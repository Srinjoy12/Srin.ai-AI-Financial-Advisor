'use client';

import { AuthForm } from '@/components/ui/AuthForm';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: any) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error('Login error:', error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <AuthLayout>
      <AuthForm onSubmit={handleLogin} />
    </AuthLayout>
  );
} 