#pragma once
#include <cstdint>
#include "ProtocolHeader.h"

namespace net{
namespace internal {
	const u_short kConnectionPortNum = 1234;
	const u_short kMessagePortNum		 = 1235;
	static const char* kIPaddr			 = "127.0.0.1";
	const int kSessionIdLength			 = 10;


	struct ProtocolHeder {
		uint32_t messageNumber_;
		char sessionId_[internal::kSessionIdLength] = { 0 };
	};
} // namespace internal
}

