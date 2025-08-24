'use client';

import { AuthForm } from '@/components/ui/AuthForm';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async (data: any) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
        },
      },
    });

    if (error) {
      console.error('Sign up error:', error);
    } else {
      router.push('/questionnaire');
    }
  };

  return (
    <AuthLayout>
      <AuthForm isSignUp={true} onSubmit={handleSignUp} />
    </AuthLayout>
  );
} 