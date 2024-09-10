import { Suspense } from 'react';
import { fetchFavoriteLocations } from '../lib/weather';
import Forecast from './Forecast';
import WeatherCard from './WeatherCard';

export default async function Favorites() {
  const favorites = await fetchFavoriteLocations();
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6">
      {favorites.map((favorite) => (
        <>
          <Suspense key={favorite.name} fallback={<p>Loading...</p>}>
            <WeatherCard lat={favorite.lat} lng={favorite.lng} />
          </Suspense>

          <Suspense key={favorite.id} fallback={<p>Loading...</p>}>
            <Forecast lat={favorite.lat} lng={favorite.lng} />
          </Suspense>
        </>
      ))}
    </section>
  );
}
