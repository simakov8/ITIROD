#pragma once
#include <string>
#include <winsock.h>
#include "ProtocolHeader.h"

namespace net {
class Client {
public:
	Client(const std::string& ip, int port);
	~Client();

	int SendMessage(const std::string& message);

private:
	SOCKET GetSocketToSendMessage() const;
	std::string WrapMessageToProtocol(const std::string& message) const;

private:
	std::string ip_;
	int port_;
	uint32_t messageNumber_;
	char sessionId_[internal::kSessionIdLength] = { 0 };
	SOCKET dummyConnection_;
};
}
