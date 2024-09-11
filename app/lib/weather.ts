'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { CurrentWeather, FiveDayForecast, ForecastList } from './definitions';
import { FavoriteLocation } from './maps.definitions';

export async function fetchCurrentWether(
  lat: number,
  lon: number,
): Promise<CurrentWeather> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`,
    );

    const data: CurrentWeather = await response.json();

    revalidatePath('/');

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch current weather');
  }
}

export async function fetchFiveDayForecast(
  lat: number,
  lon: number,
): Promise<ForecastList[]> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`,
    );

    const data: FiveDayForecast = await response.json();

    const filteredForecast: ForecastList[] = [];
    const seenDates = new Set<string>();

    data.list.forEach((entry) => {
      const entryDate = entry.dt_txt.split(' ')[0];
      if (!seenDates.has(entryDate)) {
        filteredForecast.push(entry);
        seenDates.add(entryDate);
      }
    });

    return filteredForecast;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch five day forecast');
  }
}

export async function setFavoriteLocation(
  location: string,
  lat: number,
  lon: number,
): Promise<boolean> {
  // Save favorite location to database

  const cookieStore = cookies();
  const session = cookieStore.get('session');
  const userId = session?.value;

  if (!userId) {
    return false;
  }

  let locationId = 0;

  const locationExists =
    await sql`SELECT * FROM cities WHERE lat=${lat} AND lng=${lon}`;

  if (locationExists.rows.length === 0) {
    const newLocation =
      await sql`INSERT INTO cities (name, lat, lng) VALUES (${location}, ${lat}, ${lon}) RETURNING id`;

    locationId = newLocation.rows[0].id;
  }

  if (!locationId) {
    locationId = locationExists.rows[0].id;
  }

  const favoritesExist =
    await sql`SELECT * FROM user_favorites WHERE user_id=${userId} AND city_id=${locationId}`;

  if (favoritesExist.rows.length === 5) {
    return false;
  }

  if (favoritesExist.rows.length) {
    await sql`DELETE FROM user_favorites WHERE user_id=${userId} AND city_id=${locationId}`;
    return false;
  }

  await sql`INSERT INTO user_favorites (user_id, city_id) VALUES (${userId}, ${locationId})`;

  revalidatePath('/');

  return true;
}

export async function fetchFavoriteLocations() {
  const cookieStore = cookies();
  const session = cookieStore.get('session');
  const userId = session?.value;

  if (!userId) {
    return [];
  }

  const favorites =
    await sql`SELECT * FROM user_favorites WHERE user_id=${userId}`;

  if (!favorites.rows.length) {
    return [];
  }

  const favoriteLocations = [];

  for (const favorite of favorites.rows) {
    const city =
      await sql<FavoriteLocation>`SELECT * FROM cities WHERE id=${favorite.city_id}`;

    favoriteLocations.push(city.rows[0]);
  }

  revalidatePath('/');

  return favoriteLocations;
}
