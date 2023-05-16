#include <iostream>
#include "Client.h"
#include "ProtocolHeader.h"

#pragma comment(lib, "Ws2_32.lib")


int main() {

	net::Client client(net::internal::kIPaddr, net::internal::kConnectionPortNum);

	while (true) {
		std::string message;
		std::cout << "Enter message to send: " << std::endl;
		std::cin >> message;
		client.SendMessage(message);
	}


	return 0;
}
