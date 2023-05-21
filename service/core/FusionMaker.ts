import axios from "axios";
import { BigNumber, Contract, Wallet, ethers, providers } from "ethers";

import { SupportedNetworks } from "../types/networks";
import { buildEndpoint } from "../utils/chains";
import { Nullable } from "../types/helpers";
import { getRpc } from "../utils/chains";
import { FusionSDK, PrivateKeyProviderConnector, FusionOrder } from "@1inch/fusion-sdk";

import Web3 from "web3";
import { getErc721ProxyAddress } from "../utils/contracts";
import erc721abi from "../abis/erc721.json";

export class FusionMaker {
	network: SupportedNetworks;
	slot: Nullable<string>;
	provider: providers.JsonRpcProvider;
	wallet: Wallet;

	constructor(network: SupportedNetworks) {
		this.network = network;

		this.configureAxios();

		this.provider = new providers.JsonRpcProvider(getRpc(this.network));

		const deployer_pk = process.env.DEPLOYER_PK;
		if (!deployer_pk) {
			throw new Error();
		}

		this.wallet = new Wallet(deployer_pk).connect(this.provider);
	}

	configureContracts() {
		this.provider = new providers.JsonRpcProvider(getRpc(this.network));
	}

	configureAxios() {
		axios.defaults.baseURL = buildEndpoint(this.network);
		axios.defaults.headers.common = {
			accept: "application/json",
		};
	}

	async runApi<T, K>(method: () => Promise<T>): Promise<Nullable<K>> {
		try {
			//@ts-ignore
			return (await method()).data.data;
		} catch (error) {
			if (error instanceof Error) {
				console.log("Received API error: ", error.message);
				return null;
			}

			console.log("Unknown error. Check your api config");
			return null;
		}
	}

	async runContractGetter<T>(method: () => Promise<T>): Promise<Nullable<T>> {
		try {
			//@ts-ignore
			return await method();
		} catch (error) {
			if (error instanceof Error) {
				console.log("Received contract error: ", error.message);
				return null;
			}

			console.log("Unknown error. Check your contract config");
			return null;
		}
	}

	async runTx(call: () => any): Promise<boolean> {
		try {
			//@ts-ignore
			const tx = await call();
			await tx.wait();
			return true;
		} catch (error) {
			if (error instanceof Error) {
				console.log("Received contract error: ", error.message);
				return false;
			}

			console.log("Unknown error. Check your contract config");
			return false;
		}
	}

	async post721Order() {}
}
