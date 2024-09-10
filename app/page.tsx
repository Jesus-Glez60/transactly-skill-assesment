import { Suspense } from 'react';
import Favorites from './components/Favorites';
import Forecast from './components/Forecast';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';

export default function Home({
  searchParams,
}: {
  searchParams?: {
    lat?: string;
    lng?: string;
  };
}) {
  const { lat, lng } = searchParams ?? {};

  const currentLat = lat ? Number(lat) : 34.052235;
  const currentLng = lng ? Number(lng) : -118.243683;

  return (
    <>
      <Header />
      <section className="m-auto flex min-h-dvh h-full w-full flex-col items-center justify-start gap-8 bg-zinc-100 px-16 py-8">
        <Suspense fallback={<p>Loading...</p>}>
          <WeatherCard lat={currentLat} lng={currentLng} />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <Forecast lat={currentLat} lng={currentLng} />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <Favorites />
        </Suspense>
      </section>
    </>
  );
}
