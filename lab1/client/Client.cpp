#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <stdexcept>
#include "Client.h"
#include "ProtocolHeader.h"


namespace net {
Client::Client(const std::string& ip, int port) :
	dummyConnection_(INVALID_SOCKET),
	ip_(ip),
	port_(port),
	messageNumber_(0) {
	WSADATA wsaData;
	
	// Initialize Winsock
	auto iResult = WSAStartup(MAKEWORD(2, 2), &wsaData);
	if (iResult != 0) {
		std::cerr << "WSAStartup failed: " << iResult << std::endl;
		throw std::runtime_error("WSAStartup failed: " + std::to_string(iResult));
	}

	dummyConnection_ = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (dummyConnection_ == INVALID_SOCKET) {
		std::cerr << "error at socket(): " << std::hex << WSAGetLastError() << std::endl;
		WSACleanup();
		throw std::runtime_error("error at socket(): " + std::to_string(WSAGetLastError()));
	}

	SOCKADDR_IN clientService;
	clientService.sin_family = AF_INET;
	clientService.sin_port = htons(port);
	inet_pton(AF_INET, ip.c_str(), &clientService.sin_addr);

	iResult = connect(dummyConnection_, (SOCKADDR*)&clientService, sizeof(clientService));
	if (iResult == SOCKET_ERROR) {
		std::cerr << "connect function failed with error: " << std::hex << WSAGetLastError() << std::endl;
		closesocket(dummyConnection_);
		WSACleanup();
		throw std::runtime_error("error at connect(): " + std::to_string(WSAGetLastError()));
	}

	iResult = recv(dummyConnection_, sessionId_, internal::kSessionIdLength, MSG_WAITALL);
	if (iResult <= 0)
		throw std::runtime_error("error while reading session id.");

	std::cout << "connection to " << ip << ":" << port << " established" << std::endl;
}

Client::~Client() {
	closesocket(dummyConnection_);
	WSACleanup();
}

SOCKET Client::GetSocketToSendMessage() const {
	SOCKET result_socket = INVALID_SOCKET;

	result_socket = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
	if (result_socket == INVALID_SOCKET) {
		std::cerr << "error at socket(): " << std::hex << WSAGetLastError() << std::endl;
		WSACleanup();
		throw std::runtime_error("error at socket(): " + std::to_string(WSAGetLastError()));
	}

	return result_socket;
}

std::string Client::WrapMessageToProtocol(const std::string& message) const {
	internal::ProtocolHeder header;
	header.messageNumber_ = messageNumber_;
	memcpy(header.sessionId_, sessionId_, sizeof(sessionId_));

	std::string wrapped_message;
	wrapped_message.resize(sizeof(header) + message.length());

	memcpy((void*)wrapped_message.data(), &header, sizeof(header)); // coping header
	memcpy((void*)(wrapped_message.data() + sizeof(header)), message.data(), message.length()); // coping header

	return wrapped_message;
}

int Client::SendMessage(const std::string& message) {
	SOCKET socket_to_send = INVALID_SOCKET;
	try {
		socket_to_send = GetSocketToSendMessage();

		SOCKADDR_IN serverService;
		serverService.sin_family = AF_INET;
		serverService.sin_port = htons(internal::kMessagePortNum);
		inet_pton(AF_INET, ip_.c_str(), &serverService.sin_addr);

		std::string wrapped_message = WrapMessageToProtocol(message);
		if (sendto(socket_to_send, wrapped_message.c_str(), wrapped_message.length(), 0, (SOCKADDR*)&serverService, sizeof(serverService)) ==
			SOCKET_ERROR) {
			throw std::runtime_error("cannot sendto");
		}
		messageNumber_++;
	}
	catch (const std::exception& ex) {
		std::cerr << "error while sending message: " << ex.what();
		closesocket(socket_to_send);
		return 1;
	}

	closesocket(socket_to_send);
	return 0;
}
} // namespace net

