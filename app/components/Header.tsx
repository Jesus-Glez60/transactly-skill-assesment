'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getSession, logout } from '../lib/auth';
import Search from './Search';

export default function Header() {
  const [location, setLocation] = useState<number[]>();
  const [session, setSession] = useState<RequestCookie | null>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

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

    setLocationParams();
  }, [location, params, pathname, replace]);

  return (
    <header className="mx-auto flex h-20 w-full justify-between px-16 pt-6">
      <h1 className="relative m-0 text-3xl">
        Transactly Weather{' '}
        <SunIcon className="absolute -right-8 -top-4 h-8 w-8 outline-sky-500" />
      </h1>

      <Search />

      {session ? (
        <form action={logout} className="h-full w-fit">
          <button
            type="submit"
            className="flex h-full items-center justify-center gap-2 rounded-lg px-6 transition-all hover:bg-zinc-500/30 hover:text-white"
          >
            Log Out <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 rounded-md bg-gray-400 px-4 py-2 text-white transition-all hover:bg-gray-500"
        >
          Login
          <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
        </Link>
      )}
    </header>
  );
}
