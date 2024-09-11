'use client';

import { HeartIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { fetchFavoriteLocations, setFavoriteLocation } from '../lib/weather';

export default function FavoriteButton({
  location,
  lat,
  lng,
}: {
  location: string;
  lat: number;
  lng: number;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
      const favorites = await fetchFavoriteLocations();

      if (
        favorites.some(
          (favorite) => favorite.lat === lat && favorite.lng === lng,
        )
      ) {
        setIsFavorite(true);
      }
    }

    checkFavorite();
  }, [lat, lng, isFavorite]);

  async function toggleFavorite() {
    const result = await setFavoriteLocation(location, lat, lng);

    setIsFavorite(result);
  }

  return (
    <button
      className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white transition-all ${
        isFavorite ? 'bg-red-500' : 'bg-gray-500 hover:bg-gray-400'
      }`}
      onClick={toggleFavorite}
    >
      <HeartIcon
        className={`h-4 w-4 ${
          isFavorite ? 'outline-red-500' : 'outline-black hover:fill-red-500'
        }`}
      />
    </button>
  );
}
