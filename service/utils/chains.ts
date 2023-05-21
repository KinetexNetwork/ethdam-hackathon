import { SupportedNetworks } from "../types/networks";
import { Nullable } from "../types/helpers";

export const buildEndpoint = (network: SupportedNetworks) => {
	const domain = process.env.QUICKNODE_DOMAIN;
	const key = process.env.QUICKNODE_KEY;

	if (!domain || !key) {
		throw new Error("Quicknode settings not set");
	}

	switch (network) {
		case SupportedNetworks.MAINNET:
			return `https://${domain}.quiknode.pro/${key}/`;

		case SupportedNetworks.GNOSIS:
			return `https://${domain}.xdai.discover.quiknode.pro/${key}/`;

		case SupportedNetworks.ARBITRUM:
			return `https://${domain}.arbitrum.discover.quiknode.pro/${key}/`;

		case SupportedNetworks.GOERLI:
			return `https://${domain}.ethereum-goerli.discover.quiknode.pro/${key}/`;

		default:
			throw new Error("Unsupported network");
	}
};

export const getNetwork = (network: Nullable<string>): SupportedNetworks => {
	if (!network) {
		throw new Error("No network argument. Pass the current network with --network arg");
	}

	switch (network) {
		case SupportedNetworks.GNOSIS:
			return SupportedNetworks.GNOSIS;

		case SupportedNetworks.GOERLI:
			return SupportedNetworks.GOERLI;

		case SupportedNetworks.MAINNET:
			return SupportedNetworks.MAINNET;

		default:
			throw new Error("Unsupported network");
	}
};

export const getRpc = (network: Nullable<string>): string => {
	if (!network) {
		throw new Error("No network argument. Pass the current network with --network arg");
	}

	switch (network) {
		case SupportedNetworks.GNOSIS:
			return "https://rpc.ankr.com/gnosis";

		case SupportedNetworks.GOERLI:
			return "https://rpc.ankr.com/eth_goerli";

		case SupportedNetworks.MAINNET:
			return "https://rpc.ankr.com/eth";

		default:
			throw new Error("Unsupported network");
	}
};
