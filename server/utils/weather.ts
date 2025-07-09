import { $fetch } from "ofetch";

type WeatherAPIResponse = {
	forecasts: {
		chanceOfRain: {
			T00_06: string;
			T06_12: string;
			T12_18: string;
			T18_24: string;
		};
	}[];
};

const WEATHER_API_ENDPOINT =
	"https://weather.tsukumijima.net/api/forecast/city/130010";

const fetchWeatherForecast = async (): Promise<WeatherAPIResponse> => {
	try {
		return await $fetch<WeatherAPIResponse>(WEATHER_API_ENDPOINT);
	} catch (error) {
		console.error("天気情報の取得に失敗しました:", error);
		throw new Error("天気情報の取得に失敗しました");
	}
};

type TimeSlotRainChance = {
	morning: string; // 0~6時
	noon: string; // 6~12時
	evening: string; // 12~18時
	night: string; // 18~24時
};

export const getTodayRainChance = async (): Promise<TimeSlotRainChance> => {
	const response = await fetchWeatherForecast();
	const todayForecast = response.forecasts[0];

	return {
		morning: todayForecast.chanceOfRain.T00_06,
		noon: todayForecast.chanceOfRain.T06_12,
		evening: todayForecast.chanceOfRain.T12_18,
		night: todayForecast.chanceOfRain.T18_24,
	};
};

const convertRainChancesToNumber = (
	rainChances: TimeSlotRainChance,
): number[] => {
	return Object.values(rainChances).map((chance) => Number.parseInt(chance));
};

const calculateMaxRainChance = (rainChances: TimeSlotRainChance): number => {
	const chances = convertRainChancesToNumber(rainChances).map((chance) =>
		Number.isNaN(chance) ? 0 : chance,
	);

	return Math.max(...chances);
};

const RAIN_PROBABILITY_THRESHOLD = 20;

export const isUmbrellaNeeded = async (maxChance: number): Promise<boolean> => {
	try {
		return maxChance >= RAIN_PROBABILITY_THRESHOLD;
	} catch (error) {
		console.log("傘の必要性の判定に失敗しました:", error);
		throw new Error("傘の必要性の判定に失敗しました");
	}
};

export const getUmbrellaMessage = async (): Promise<string> => {
	try {
		const rainChances = await getTodayRainChance();
		const maxChance = calculateMaxRainChance(rainChances);
		const isNeeded = isUmbrellaNeeded(maxChance);

		if (isNeeded) {
			return `☔️傘を持って行こう！
      - 本日の最高降水確率: ${maxChance}%`;
		}
		return `✅傘は不要かな！
    - 本日の最高降水確率: ${maxChance}%`;
	} catch (error) {
		console.log("メッセージの生成に失敗しました:", error);
		throw new Error("メッセージの生成に失敗しました");
	}
};
