'use client';

import Link from 'next/link';
import Form from '../components/Form';
import Input from '../components/Input';
import { createUser } from '../lib/auth';

export default function Register() {
  return (
    <>
      <section className="flex h-full w-full items-center justify-center">
        <Form formAction={createUser}>
          <h2 className="text-center text-2xl">Create an account</h2>

          <Input label="Name" id="name" type="text" />

          <Input label="Email" id="email" type="email" />

          <Input label="Password" id="password" type="password" />

          <button
            type="submit"
            className="rounded-md bg-blue-500 p-2 text-white"
          >
            Login
          </button>

          <Link
            href="/login"
            className="flex items-center justify-center rounded-md bg-gray-400 px-4 py-2 text-white"
          >
            Log in
          </Link>
        </Form>
      </section>
    </>
  );
}
