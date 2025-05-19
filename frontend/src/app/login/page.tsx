'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  async function handleSubmit() {
    try {
      await login(form.email, form.password);
      router.push('/tasks');
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status == 401) {
          setError('Email or Password is wrong');
        }
      }
      setError('Error on login');
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className='space-y-4'
      >
        <Card className='w-[400px] text-center'>
          <CardHeader>
            <CardTitle>To Do App</CardTitle>
            <CardDescription>Login</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type='email'
              placeholder='myemail@mail.com'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className='mb-5'
            />
            <Input
              type='password'
              placeholder='*******'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && <p className='text-red-500 text-sm mt-4'>{error}</p>}
          </CardContent>
          <CardFooter>
            <div className='flex flex-col w-full gap-5'>
              <Button type='submit' className='cursor-pointer'>
                Login
              </Button>
              <Button
                variant='secondary'
                type='button'
                className='cursor-pointer'
                onClick={() => router.push('/register')}
              >
                Register
              </Button>

              <Button
                variant='link'
                type='button'
                className='cursor-pointer'
                onClick={() => router.push('/register-admin')}
              >
                Create First Admin
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
