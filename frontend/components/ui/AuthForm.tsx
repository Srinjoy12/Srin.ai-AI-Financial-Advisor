'use client';
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const AuthForm: React.FC<{ isSignUp?: boolean; onSubmit: (data: any) => void; }> = ({ isSignUp = false, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, name });
  };

  return (
    <div className="w-full max-w-sm p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-medium text-white">
          {isSignUp ? 'Create an Account' : 'Sign In'}
        </h2>
        <p className="mt-2 text-gray-400">
          {isSignUp ? 'Enter your details to get started.' : 'Enter your credentials to access your account.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2.5 bg-[#1a1a2a] border border-gray-700/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2.5 bg-[#1a1a2a] border border-gray-700/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2.5 bg-[#1a1a2a] border border-gray-700/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2.5">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center text-gray-500">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link href={isSignUp ? '/login' : '/signup'} className="text-blue-400 hover:underline">
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </Link>
      </div>
    </div>
  );
}; 