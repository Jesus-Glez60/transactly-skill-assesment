'use server';

import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export async function loginUser(formData: FormData) {
  const validateFields = loginSchema.safeParse(Object.fromEntries(formData));

  if (!validateFields.success) {
    throw new Error('Missing or invalid fields');
  }

  const { email, password } = validateFields.data;

  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    if (!user.rows.length) {
      throw new Error('User not found');
    }

    const match = await bcrypt.compare(password, user.rows[0].password);

    if (!match) {
      throw new Error('Invalid password');
    }

    const cookieStore = cookies();

    cookieStore.set('session', user.rows[0].id.toString(), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }

  revalidatePath('/register');

  redirect('/');
}

export async function createUser(formData: FormData) {
  const validateFields = createUserSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!validateFields.success) {
    throw new Error('Missing or invalid fields');
  }

  const { name, email, password } = validateFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;

    if (user.rows.length) {
      throw new Error('User already exists');
    }

    await sql<User>`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword})`;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error((error as Error).message);
  }

  revalidatePath('/register');

  redirect('/login');
}

export async function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return null;
  }

  return session;
}

export async function logout() {
  console.log('logging out');

  if (cookies().has('session')) {
    cookies().delete('session');
  }

  revalidatePath('/');
}
