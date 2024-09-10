'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSession } from '../lib/auth';
import Search from './Search';

export default function Header() {
  const [location, setLocation] = useState<number[]>();
  const [session, setSession] = useState<RequestCookie | null>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    getSession().then((session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation([latitude, longitude]);
      });
    }
  }, []);

  useEffect(() => {
    setLocationParams();
  }, [location]);

  function setLocationParams() {
    if (location && !params.has('lat') && !params.has('lng')) {
      params.set('lat', location[0].toString());
      params.set('lng', location[1].toString());
    } else {
      params.delete('lat');
      params.delete('lng');
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <header className="mx-auto flex h-20 w-full justify-between px-16 pt-6">
      <h1 className="m-0 text-3xl">Transactly Weather</h1>

      <Search />

      {session ? (
        <button>Log Out</button>
      ) : (
        <Link
          href="/login"
          className="flex items-center justify-center rounded-md bg-gray-400 px-4 py-2 text-white"
        >
          Login
        </Link>
      )}
    </header>
  );
}
