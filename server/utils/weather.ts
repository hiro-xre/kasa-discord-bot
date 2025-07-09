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
