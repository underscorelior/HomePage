/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
	TiWeatherSunny,
	TiWeatherCloudy,
	TiDelete,
	TiWeatherStormy,
	TiWeatherSnow,
	TiWeatherDownpour,
	TiWeatherShower,
	TiWeatherPartlySunny,
	TiWeatherWindyCloudy,
} from 'react-icons/ti';
import { AiOutlineLoading } from 'react-icons/ai';

function Clock() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [weatherData, setWeatherData] = useState<any>(null);
	const [location, setLocation] = useState('');

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(fetchData, errors, {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		});

		const intervalId = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		const geoInterval = setInterval(() => {
			navigator.geolocation.getCurrentPosition(fetchData, errors, {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0,
			});
		}, 600000);

		return () => {
			clearInterval(intervalId);
			clearInterval(geoInterval);
		};
	}, []);

	async function fetchData(pos: GeolocationPosition) {
		const crd = pos.coords;
		try {
			const response = await axios.get(
				`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&units=metric&appid=${process.env.WEATHER_KEY}`,
			);
			const locationResponse = await axios.get(
				`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${crd.latitude}&longitude=${crd.longitude}&localityLanguage=en`,
			);

			setWeatherData(response.data);
			setLocation(
				locationResponse.data.locality +
					', ' +
					(locationResponse.data.countryName == 'United States of America (the)'
						? locationResponse.data.principalSubdivisionCode.replace('US-', '')
						: locationResponse.data.countryCode),
			);
		} catch (error) {
			console.error(error);
		}
	}
	function errors(err: GeolocationPositionError) {
		console.error(`ERROR(${err.code}): ${err.message}`);
	}

	const formattedTime = currentTime.toLocaleTimeString('en-US', {
		hour12: true,
		hour: 'numeric',
		minute: 'numeric',
	});

	const formattedDate = currentTime
		.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		})
		.replace(/\d+/, (day) => getOrdinalSuffix(parseInt(day, 10)));

	function getOrdinalSuffix(b: number) {
		const suffixes = ['th', 'st', 'nd', 'rd'];
		return (
			b + (suffixes[((b % 100) - 20) % 10] || suffixes[b % 100] || suffixes[0])
		);
	}

	return (
		<section className="flex w-full flex-col items-end p-6 font-black">
			<div className="gradtext text-5xl lg:text-[4.25rem]">
				{formattedTime}
				<p className="text-end text-[1.625rem]">{formattedDate}</p>
			</div>
			<div>
				{weatherData ? (
					<span className="flex w-full flex-row items-end justify-center text-end text-[1.625rem]">
						{weatherData.weather[0].main == 'Clear' ? (
							<TiWeatherSunny className="fill-ctp-peach mr-2 text-4xl" />
						) : weatherData.weather[0].main == 'Clouds' ? (
							weatherData.weather[0].description == 'few clouds' ? (
								<TiWeatherPartlySunny className="fill-ctp-text mr-2 text-4xl" />
							) : (
								<TiWeatherCloudy className="fill-ctp-text mr-2 text-4xl" />
							)
						) : weatherData.weather[0].main in ['Rain', 'Drizzle'] ? (
							weatherData.weather[0].description in
							[
								'light intensity shower rain',
								'shower rain',
								'light rain',
								'light intensity drizzle',
								'light intensity drizzle rain',
							] ? (
								<TiWeatherShower className="fill-ctp-blue mr-2 text-4xl" />
							) : (
								<TiWeatherDownpour className="fill-ctp-sapphire mr-2 text-4xl" />
							)
						) : weatherData.weather[0].main == 'Thunderstorm' ? (
							<TiWeatherStormy className="fill-ctp-yellow mr-2 text-4xl" />
						) : weatherData.weather[0].main == 'Snow' ? (
							<TiWeatherSnow className="fill-ctp-text mr-2 text-4xl" />
						) : (weatherData.weather[0].id + '')[0] == '7' ? (
							<TiWeatherWindyCloudy className="fill-ctp-text mr-2 text-4xl" />
						) : (
							<TiDelete className="fill-ctp-red mr-2 text-4xl" />
						)}
						<p className="gradtext">
							{Math.round(weatherData.main.temp)}°C - {location}
						</p>
					</span>
				) : (
					<AiOutlineLoading className="fill-ctp-text w-full animate-spin items-end text-[1.625rem]" />
				)}
			</div>
		</section>
	);
}

export default Clock;
