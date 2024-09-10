import { formatDate, roundNumber } from '../lib/utils';
import { fetchFiveDayForecast } from '../lib/weather';

export default async function Forecast({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const forecast = await fetchFiveDayForecast(lat, lng);

  const today = new Date();
  const tomorrow = getTomorrowDate();

  function isToday(date: string) {
    const tempData = formatDate(date);

    const day = tempData.split(',')[0];

    const dateFormatted = tempData.split(',')[1];

    if (tempData === formatDate(today.toISOString())) {
      return ['Today', dateFormatted];
    }

    if (tempData === formatDate(tomorrow.toISOString())) {
      return ['Tomorrow', dateFormatted];
    }

    return [day, dateFormatted];
  }

  function getTomorrowDate(): Date {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }

  return (
    <ul className="flex w-fit gap-5 p-4">
      {forecast.map((item) => (
        <li
          key={item.dt.toString()}
          className={`flex flex-col items-center justify-center gap-4 rounded-lg p-4 ${
            formatDate(item.dt_txt) === formatDate(today.toISOString())
              ? 'border border-sky-500 bg-sky-400/30'
              : 'bg-white'
          }`}
        >
          <span className="flex flex-col items-center justify-center gap-1">
            <p className="font-semibold">{isToday(item.dt_txt)[0]}</p>
            <p className="text-sm">{isToday(item.dt_txt)[1]}</p>
          </span>

          <span className="flex gap-2">
            <p className="font-semibold text-red-600">
              {roundNumber(item.main.temp_max)}°
            </p>
            /
            <p className="font-semibold text-blue-500">
              {roundNumber(item.main.temp_min)}°
            </p>
          </span>
        </li>
      ))}
    </ul>
  );
}
