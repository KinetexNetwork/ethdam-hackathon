import { getNetwork } from "./utils/chains";
import { FusionMaker } from "./core/FusionMaker";
import { getAppArgs } from "./utils/node";
import dotenv from "dotenv";

(async () => {
	dotenv.config();
	const { network } = getAppArgs();

	const fusionMaker = new FusionMaker(getNetwork(network));
	await fusionMaker.post721Order();
})();
