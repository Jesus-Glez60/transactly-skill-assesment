'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCoordinates } from '../lib/geolocation';
import { Feature } from '../lib/maps.definitions';

export default function Results({
  query,
  onSearch,
}: Readonly<{
  query: string | undefined;
  onSearch: (query: string | undefined) => void;
}>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [results, setResults] = useState<Feature[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    fetchCoordinates(query)
      .then((data) => {
        if (!data) {
          setResults([]);
          return;
        }
        setResults(data.features);
      })
      .catch((error) => {
        setResults([]);
        console.error(error);
      });
  }, [query]);

  function handleClick(result: Feature) {
    const params = new URLSearchParams(searchParams);

    if (result.geometry.coordinates[1] && result.geometry.coordinates[0]) {
      params.set('lat', result.geometry.coordinates[1].toString());
      params.set('lng', result.geometry.coordinates[0].toString());
    } else {
      params.delete('lat');
      params.delete('lng');
    }

    replace(`${pathname}?${params.toString()}`);

    setResults([]);
    onSearch(result.properties.full_address);
  }

  return (
    <section className="absolute top-12 z-30 flex min-w-96 flex-col rounded-md border border-gray-300 bg-white p-2">
      {results.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {results.map((result) => (
            <li
              className="flex cursor-pointer flex-col gap-2"
              key={result.id}
              onClick={() => handleClick(result)}
            >
              <p className="text-lg font-semibold">
                {result.properties.context.place?.name}
              </p>
              <span className="flex gap-1">
                <p>{result.properties.context.region?.name}</p>
                {', '}
                <p>{result.properties.context.country?.name}</p>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </section>
  );
}
