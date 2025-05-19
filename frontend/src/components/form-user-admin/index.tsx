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

export default function RegisterUserAdmin() {
  const router = useRouter();
  const { createUserByAdmin } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: '',
  });

  const [error, setError] = useState('');

  async function handleSubmit() {
    try {
      await createUserByAdmin(form.email, form.password, form.name, form.role);
      router.push('/tasks');
    } catch (error) {
      setError('Erro on create first admin');
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className='space-y-4'
    >
      <Card className='w-[300px] text-center'>
        <CardHeader>
          <CardTitle>Create user</CardTitle>
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

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className='w-full border rounded px-3 py-2 mt-4'
            required
          >
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
          </select>
          {error && <p className='text-red-500 text-sm mt-4'>{error}</p>}
        </CardContent>
        <CardFooter>
          <div className='flex flex-col w-full gap-5'>
            <Button type='submit' className='cursor-pointer'>
              Register
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
