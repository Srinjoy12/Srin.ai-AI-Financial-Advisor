'use client';
import React from 'react';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-black text-white grid grid-cols-1 md:grid-cols-2">
            <div className="flex items-center justify-center p-8">
                {children}
            </div>
            <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-blue-800/60 via-black to-blue-800/60 p-12">
                 <div className="max-w-2xl mx-auto -translate-y-16 group cursor-pointer">
                      <h1 className="text-5xl mb-6 leading-relaxed transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(129,140,248,0.4)]">
                          Welcome to Your Financial Future Advisor 
                      </h1>
                      <div className="relative">
                          <span className="absolute -top-4 -left-4 text-8xl text-blue-500/20 font-serif opacity-75 transition-all duration-300 group-hover:text-blue-400/30">“</span>
                          <p className="text-2xl text-gray-300 italic transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(200,200,255,0.2)]">
                              The secret to financial freedom is owning your own piece of the world. With Srin, you're not just managing money—you're building an empire.
                          </p>
                      </div>
                 </div>
            </div>
        </div>
    );
}; 