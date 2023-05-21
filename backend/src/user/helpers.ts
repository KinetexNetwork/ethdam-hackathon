import * as dayjs from 'dayjs'
import * as isBetween from 'dayjs/plugin/isBetween'
import { TimePeriodRewards } from 'src/reward-settings/reward-settings.interface'
import { TokenCrypto } from 'src/types/kinetexCrypto'
import { PriceListMeta } from 'src/types/kinetexMeta'
import { SwapStateV3, SwapV3 } from 'src/types/kinetexV3'

dayjs.extend(isBetween)

export enum Crew3Level {
	NOT_ELIGIBLE = 0,
	JUNIOR = 3,
	MASTER = 6,
	MAGISTER = 7,
	LEGENDARY = 10,
}

export enum AmbassadorLevel {
	JUNIOR = 0,
	MASTER = 1,
	MAGISTER = 2,
	LEGENDARY = 3,
}

export const getLevelFromCrew3 = (crew3Level: number): AmbassadorLevel => {
	switch (crew3Level) {
		case Crew3Level.LEGENDARY:
			return AmbassadorLevel.LEGENDARY

		case Crew3Level.MASTER:
			return AmbassadorLevel.MASTER

		case Crew3Level.MAGISTER:
			return AmbassadorLevel.MAGISTER

		default:
			return AmbassadorLevel.JUNIOR
	}
}

type WeekSwaps = {
	start: string
	end: string
	swaps: SwapV3[]
}

export type SwapsByWeek = {
	[key: number]: WeekSwaps
}

export interface ValueWithDecimal {
	v: string | number
	d: number
}

export const getSwapsByWeek = (swaps: SwapV3[], stopRewardsDate: Date) => {
	// let startDate = dayjs(swaps[0].created_at)
	let startDate = dayjs(stopRewardsDate)
	let weekEnd = dayjs(startDate).subtract(7, 'days')
	let weekCount = 0
	const swapsByWeek: SwapsByWeek = {}

	for (const swap of swaps) {
		if (swap.state === SwapStateV3.completed) {
			if (dayjs(swap.created_at).isBefore(weekEnd)) {
				startDate = dayjs(weekEnd)
				weekEnd = dayjs(startDate).subtract(7, 'days')
				weekCount++
			}

			if (!swapsByWeek?.[weekCount]) {
				swapsByWeek[weekCount] = {
					start: dayjs(startDate).format(),
					end: dayjs(weekEnd).format(),
					swaps: [],
				}
			}

			if (dayjs(swap.created_at).isBetween(startDate, weekEnd)) {
				swapsByWeek[weekCount].swaps.push(swap)
			}
		}
	}

	return { swapsByWeek }
}

const getClosestNumber = (num: number, array: number[]) =>
	array.reverse().find((e) => e <= num)

const getReward = (count: number, rewardSettings: TimePeriodRewards) => {
	const closestTier = getClosestNumber(
		count,
		Object.keys(rewardSettings).map((key) => parseInt(key, 10))
	)

	if (closestTier) {
		return parseInt(rewardSettings[closestTier], 10)
	}

	return 0
}

export const getLastWeekUsdVolume = (
	swaps: SwapV3[],
	prices: PriceListMeta,
	tokens: TokenCrypto[],
	decimals: number = 4,
	debug: boolean = false
) => {
	// let startDate = dayjs(swaps[0].created_at).add(1, 'second')
	let startDate = dayjs().add(1, 'second')
	let weekEnd = dayjs(startDate).subtract(7, 'days')

	const lastWeekSwaps = swaps.filter(
		(swap) =>
			dayjs(swap.created_at).isBetween(
				dayjs(startDate),
				dayjs(weekEnd)
			) && swap.state === SwapStateV3.completed
	)

	const swapInfo = {}

	const volume = lastWeekSwaps.reduce((counter, swap) => {
		const fromAddress = swap.from_token_address
		const fromChainId = swap.from_chain_id
		const assetPrice = prices.prices.find(
			(price) =>
				price.address === fromAddress && price.chain_id === fromChainId
		)
		const assetInfo: TokenCrypto = tokens.find(
			(token) =>
				token.address === fromAddress && token.chain_id === fromChainId
		)

		if (assetPrice) {
			const dividerUsd =
				BigInt(10) ** BigInt(assetPrice.price.d - decimals)
			const usdPrice = BigInt(assetPrice.price.v) / dividerUsd
			const dividerToken =
				BigInt(10) ** BigInt(assetInfo.decimals - decimals)
			const fromAmount = BigInt(swap.from_amount) / dividerToken

			// here we should divide by decimals * 2,
			// but we leave that to the frontend, check return value
			const usdVolume =
				(fromAmount * usdPrice) / BigInt(10) ** BigInt(decimals)

			if (debug) {
				const formattedTime = dayjs(swap.created_at).format(
					'DD/MM/YYYY hh:mm:ss'
				)

				swapInfo[formattedTime] = {
					token_from: assetInfo.symbol,
					token_to: tokens.find(
						(token) =>
							token.address === swap.to_token_address &&
							token.chain_id === swap.to_chain_id
					).symbol,
					token_from_amt: fromAmount.toString(),
					token_to_price: usdPrice.toString(),
					volume: usdVolume.toString(),
					decimals,
					volume_formatted: (
						parseFloat(usdVolume.toString()) /
						10 ** 4
					).toFixed(2),
				}
			}

			return usdVolume + counter
		}

		return counter
	}, BigInt(0))

	const volumeWithDecimals: ValueWithDecimal = {
		v: volume.toString(),
		d: decimals,
	}

	return {
		volume: volumeWithDecimals,
		count: lastWeekSwaps.length,
	}
}

export type WeeklySwapReward = {
	swapCount: number
	rewards: number
	startDate: string
	endDate: string
}

export type WeeklySwapRewards = {
	[key: number]: WeeklySwapReward
}

export type SwapRewards = {
	totalRewards: number
	totalSwaps: number
	weekly: WeeklySwapRewards
}

export const getSwapRewards = (
	swapsByWeek: SwapsByWeek,
	rewardSettings: TimePeriodRewards
) => {
	const swapRewards: SwapRewards = {
		totalRewards: 0,
		totalSwaps: 0,
		weekly: {},
	}

	for (const weekKey of Object.keys(swapsByWeek)) {
		const week: WeekSwaps = swapsByWeek[weekKey]
		const swapCount = week.swaps.length
		const rewardCount = getReward(swapCount, rewardSettings)

		swapRewards.weekly[weekKey] = {
			swapCount,
			rewards: rewardCount,
			startDate: week.start,
			endDate: week.end,
		} as WeeklySwapReward

		swapRewards.totalRewards += rewardCount
		swapRewards.totalSwaps += swapCount
	}

	return { swapRewards }
}
