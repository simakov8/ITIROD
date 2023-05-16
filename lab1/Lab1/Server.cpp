#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdio.h>
#include <stdexcept>
#include <iostream>
#include <string>
#include <thread>

#include "Server.h"
#include "../client/ProtocolHeader.h"

#pragma comment(lib, "Ws2_32.lib")


namespace net {
Server::Server() : initialConnectionSocket_{ INVALID_SOCKET }, incommingMessagesSocket_{ INVALID_SOCKET } {
	WSADATA wsaData;
	
	// Initialize Winsock
	auto iResult = WSAStartup(MAKEWORD(2, 2), &wsaData);
	if (iResult != 0) {
		std::cerr << "Server:: WSAStartup failed: " << iResult << std::endl;
		throw std::runtime_error("WSAStartup failed: " + std::to_string(iResult));
	}

	InitConnectionSocket();
	InitIncommingMessagesSocket();

	std::cout << "Server:: server initialized successfully. Socket created" << std::endl;
}

Server::~Server() {
	closesocket(initialConnectionSocket_);
	closesocket(incommingMessagesSocket_);
	WSACleanup();
}

void Server::Startup() {
	auto th1 = std::thread(&Server::AcceptNewConnections, this);
	th1.detach();

	auto th2 = std::thread(&Server::AcceptIncomingMessages, this);
	th2.join();
}

void Server::InitConnectionSocket() {
	initialConnectionSocket_ = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (initialConnectionSocket_ == INVALID_SOCKET) {
		std::cerr << "InitConnectionSocket:: error at socket(): " << std::hex << WSAGetLastError() << std::endl;
		WSACleanup();
		throw std::runtime_error("error at socket(): " + std::to_string(WSAGetLastError()));
	}

	sockaddr_in service;
	service.sin_family = AF_INET;
	service.sin_port = htons(internal::kConnectionPortNum);
	inet_pton(AF_INET, internal::kIPaddr, &service.sin_addr);

	if (bind(initialConnectionSocket_,
		(SOCKADDR*)&service, sizeof(service)) == SOCKET_ERROR) {
		std::cerr << "InitConnectionSocket:: bind failed with error: " << std::hex << WSAGetLastError() << std::endl;
		closesocket(initialConnectionSocket_);
		WSACleanup();
		throw std::runtime_error("bind failed with error: " + std::to_string(WSAGetLastError()));
	}
}

void Server::InitIncommingMessagesSocket() {
	incommingMessagesSocket_ = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
	if (incommingMessagesSocket_ == INVALID_SOCKET) {
		std::cerr << "InitIncommingMessagesSocket:: error at socket(): " << std::hex << WSAGetLastError() << std::endl;
		WSACleanup();
		throw std::runtime_error("error at socket(): " + std::to_string(WSAGetLastError()));
	}

	sockaddr_in service;
	service.sin_family = AF_INET;
	service.sin_port = htons(internal::kMessagePortNum);
	inet_pton(AF_INET, internal::kIPaddr, &service.sin_addr);

	if (bind(incommingMessagesSocket_,
		(SOCKADDR*)&service, sizeof(service)) == SOCKET_ERROR) {
		std::cerr << "InitIncommingMessagesSocket:: bind failed with error: " << std::hex << WSAGetLastError() << std::endl;
		closesocket(incommingMessagesSocket_);
		WSACleanup();
		throw std::runtime_error("bind failed with error: " + std::to_string(WSAGetLastError()));
	}
}

void Server::AcceptNewConnections() {
	if (listen(initialConnectionSocket_, SOMAXCONN) == SOCKET_ERROR) {
		std::cerr << "AcceptNewConnections:: listen failed with error: " << std::hex << WSAGetLastError() << std::endl;
		closesocket(initialConnectionSocket_);
		WSACleanup();
	}

	while (true) {
		SOCKET clientSocket = INVALID_SOCKET;

		// Accept a client socket
		clientSocket = accept(initialConnectionSocket_, NULL, NULL);
		if (clientSocket == INVALID_SOCKET) {
			std::cerr << "AcceptNewConnections:: accept failed: " << std::hex << WSAGetLastError() << std::endl;
			closesocket(initialConnectionSocket_);
			WSACleanup();

			throw std::runtime_error("AcceptNewConnections:: accept failed: " + std::to_string(WSAGetLastError()));
		}

		std::string sessionId = GenerateRandomSessionId();
		auto iResult = send(clientSocket, sessionId.c_str(), sessionId.length(), 0);
		if (iResult == SOCKET_ERROR) {
			std::cerr << "AcceptNewConnections:: sending session id failed." << std::endl;
			closesocket(clientSocket);
			continue;
		}

		std::cout << "AcceptNewConnections:: new connection request" << std::endl;
		sessions_[sessionId] = std::make_shared<ClientSession>(0, clientSocket); // TODO syncranization sessions_ object
	}
}

void Server::AcceptIncomingMessages() {
	char recvBuf[1024];
	int bufLen = 1024;

	struct sockaddr_in senderAddr;
	int SenderAddrSize = sizeof(senderAddr);

	while (true) {
		auto iResult = recvfrom(incommingMessagesSocket_,
			recvBuf, bufLen, 0, (SOCKADDR*)&senderAddr, &SenderAddrSize);
		if (iResult == SOCKET_ERROR) {
			std::cerr << "AcceptIncomingMessages:: cannor recfrom UDP: " << std::hex <<  WSAGetLastError()  << std::endl;
			return;
		}
		if (iResult > 0) {
			std::cout << "AcceptIncomingMessages:: recieved " << iResult << " bytes." << std::endl;

			auto th = std::thread(&Server::ProcessMessage, this, recvBuf, iResult);
			th.detach();
		}
	}
}

std::string Server::GenerateRandomSessionId() const {
	static const char alphanum[] =
		"0123456789"
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		"abcdefghijklmnopqrstuvwxyz";
	std::string tmp_s;
	tmp_s.reserve(internal::kSessionIdLength);

	for (int i = 0; i < internal::kSessionIdLength; ++i) {
		tmp_s += alphanum[rand() % (sizeof(alphanum) - 1)];
	}

	if (sessions_.find(tmp_s) != sessions_.end())
		tmp_s = GenerateRandomSessionId();

	return tmp_s;
}

void Server::ProcessMessage(const char* msgPtr, int size) {
	mtx_.lock();
	internal::ProtocolHeder header;
	memcpy(&header, msgPtr, sizeof(header));

	auto payload_size = size - sizeof(header);
	std::string payload;
	payload.resize(payload_size);
	memcpy((void*)payload.data(), msgPtr + sizeof(header), payload_size);

	//auto t = *(sessions_.begin();
	std::string recieved_session_id;
	recieved_session_id.resize(10);
	memcpy((void*)recieved_session_id.data(), header.sessionId_, internal::kSessionIdLength);
	auto session = sessions_.find(recieved_session_id);
	if (session == sessions_.end()) {
		std::cerr << "invalid session id" << std::endl;
		return;
	}

	if (session->second->messageNumber_++ == header.messageNumber_) {
		std::cout << payload << std::endl;
	}
	else {
		std::cerr << "invalid message order." << std::endl;
	}

	mtx_.unlock();
}

} // namespace net
