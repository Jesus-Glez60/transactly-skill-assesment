import Link from 'next/link';
import Form from '../components/Form';
import Input from '../components/Input';
import { loginUser } from '../lib/auth';

export default function Login() {
  return (
    <>
      <section className="flex h-full w-full items-center justify-center">
        <Form formAction={loginUser}>
          <h2 className="text-center text-2xl">Login</h2>

          <Input label="Email" id="email" type="email" />

          <Input label="Password" id="password" type="password" />

          <button
            type="submit"
            className="rounded-md bg-blue-500 p-2 text-white"
          >
            Login
          </button>

          <Link
            href="/register"
            className="flex items-center justify-center rounded-md bg-gray-400 px-4 py-2 text-white"
          >
            Create account
          </Link>
        </Form>
      </section>
    </>
  );
}
