import { roundNumber } from '../lib/utils';
import { fetchCurrentWether } from '../lib/weather';
import FavoriteButton from './FavoriteButton';

export default async function WeatherCard({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const weather = await fetchCurrentWether(lat, lng);

  return (
    <div className="relative flex max-h-56 min-w-60 max-w-80 flex-col items-center justify-center gap-4 rounded-md bg-sky-500 p-6">
      <FavoriteButton location={weather.name} lat={lat} lng={lng} />
      <p className="font-bold">{weather.name}</p>
      <p className="font-bold">{weather.weather[0].main}</p>

      <div className="flex flex-col gap-4">
        <p className="text-7xl">{roundNumber(weather.main.temp)}°</p>

        <p>
          Feels like <strong>{roundNumber(weather.main.feels_like)}°</strong>
        </p>
      </div>
    </div>
  );
}
