import { GeoLocation } from './maps.definitions';

export async function fetchCoordinates(
  query: string,
): Promise<GeoLocation | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?access_token=pk.eyJ1IjoiamVzdXMtZ2xlejYwIiwiYSI6ImNsczB2dmxiNDA1OWEybHBhYnIzdnpkZnUifQ.EscuVG7k21D8BpiD9DVCdQ&q=${query}`,
    );

    const data: GeoLocation = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
