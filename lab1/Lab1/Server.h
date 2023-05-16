#pragma once
#include <winsock.h>
#include <cstdint>
#include <unordered_map>
#include <mutex>

namespace net {
class Server {
public:
	Server();
	~Server();
	void Startup();
	
private:
	void InitConnectionSocket();
	void InitIncommingMessagesSocket();

	void AcceptNewConnections();
	void AcceptIncomingMessages();

	void ProcessMessage(const char* msgPtr, int size);

	std::string GenerateRandomSessionId() const;

private:
	SOCKET initialConnectionSocket_;
	SOCKET incommingMessagesSocket_;

	struct ClientSession;
	std::mutex mtx_;
	std::unordered_map<std::string, std::shared_ptr<ClientSession>> sessions_;

private:
	struct ClientSession {
		ClientSession(uint32_t n, SOCKET s) : messageNumber_(n), connectionSocket_(s) {}
		uint32_t messageNumber_;
		SOCKET connectionSocket_;
	};

};
}
