import { ERC721_PROXY_ADDRESS_ARBITRUM } from "../constants/contracts";
import { Nullable } from "../types/helpers";
import { SupportedNetworks } from "../types/networks";

export const getErc721ProxyAddress = (network: Nullable<string>): string => {
	if (!network) {
		throw new Error("No network argument. Pass the current network with --network arg");
	}

	switch (network) {
		case SupportedNetworks.ARBITRUM:
			return ERC721_PROXY_ADDRESS_ARBITRUM;

		default:
			throw new Error("Unsupported network");
	}
};
