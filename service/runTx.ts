import dotenv from "dotenv";
import erc721abi from "./abis/erc721.json";
import erc721ProxyAbi from "./abis/erc721Proxy.json";
import { BigNumber, ethers } from "ethers";
import { getErc721ProxyAddress } from "./utils/contracts";
import { SupportedNetworks } from "./types/networks";
import { AuctionSalt, AuctionSuffix, FusionOrder, FusionSDK, PrivateKeyProviderConnector } from "@1inch/fusion-sdk";
import Web3 from "web3";

(async () => {
	dotenv.config();

	const makerPrivateKey = process.env.DEPLOYER_PK;
	const makerAddress = "0x9b58d0aD3CC84dF8b5313c36cE160df2b9397E35";

	const erc721ProxyAddress = getErc721ProxyAddress(SupportedNetworks.ARBITRUM);
	const nftAddress = "0x537581D9E92B4Fa13977e673daff3819067463f6";
	const usdtAddress = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
	const tokenId = BigNumber.from("21547");

	const nodeUrl = process.env.ARBITRUM_RPC;

	const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
	const wallet = new ethers.Wallet(process.env.DEPLOYER_PK!).connect(provider);

	const tokenContract = new ethers.Contract(nftAddress, erc721abi, wallet);
	const erc721ProxyContract = new ethers.Contract(erc721ProxyAddress, erc721ProxyAbi, wallet);

	const web3 = new Web3(nodeUrl!);

	// @ts-ignore
	const web3NftContract = new web3.eth.Contract(erc721ProxyAbi, erc721ProxyAddress);

	console.log(web3NftContract.methods);

	const makerAssetData =
		"0x" +
		web3NftContract.methods.func_60iHVgK(wallet.address, ethers.constants.AddressZero, 0, tokenId.toNumber(), erc721ProxyAddress).encodeABI().substr(202);

	if (!makerPrivateKey) return;

	const salt = new AuctionSalt({
		duration: 85400,
		auctionStartTime: Math.round(Date.now() / 1000),
		initialRateBump: 0,
		bankFee: "0",
	});

	const auction = new AuctionSuffix({
		points: [],
		whitelist: [],
	});

	const order = new FusionOrder(
		{
			makerAsset: nftAddress,
			takerAsset: usdtAddress,
			makingAmount: tokenId.toString(),
			takingAmount: "1000000",
			maker: wallet.address,
		},
		salt,
		auction,
		{
			makerAssetData,
		}
	);

	console.log({ order: order.build() });

	const blockchainProvider = new PrivateKeyProviderConnector(makerPrivateKey, new Web3(nodeUrl!));

	const sdk = new FusionSDK({
		url: "https://fusion.1inch.io",
		network: 42161,
		blockchainProvider,
	});

	// const submittedOrder = await sdk.submitOrder(order);
	// console.log({ submittedOrder });

	// const orders = await sdk.getOrdersByMaker({
	// 	page: 1,
	// 	limit: 2,
	// 	address: wallet.address,
	// });
	// console.log({ orders });
})();
