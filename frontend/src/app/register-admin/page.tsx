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

export default function RegisterFirstAdminPage() {
  const router = useRouter();
  const { createFirstAdminUser } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [error, setError] = useState('');

  async function handleSubmit() {
    try {
      await createFirstAdminUser(form.email, form.password, form.name);
      router.push('/tasks');
    } catch (error) {
      setError('Erro on create first admin');
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
            <CardDescription>Register First Admin</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type='text'
              placeholder='Your Name'
              className='mb-5'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              type='email'
              placeholder='myemail@mail.com'
              className='mb-5'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
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
                Register
              </Button>
              <Button
                variant='secondary'
                type='button'
                className='cursor-pointer'
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
