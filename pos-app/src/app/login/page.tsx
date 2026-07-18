"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center mb-6">
        <Logo className="h-12" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-[#0D1117]">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-2">Sign in to your dashboard</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-800">
            <strong>Demo Account details:</strong>
            <div className="mt-1 flex items-center justify-between">
               <span>Email: <span className="font-mono font-medium">admin@haxone.com</span></span>
            </div>
            <div className="mt-1 flex items-center justify-between">
               <span>Password: <span className="font-mono font-medium">123456</span></span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div className="flex bg-gray-50 p-1 rounded-lg mb-6 border border-gray-200">
               <div className="flex-1 text-center py-2 bg-white rounded-md shadow-sm text-sm font-bold text-[#0D1117] cursor-pointer">Email</div>
               <div className="flex-1 text-center py-2 text-sm font-medium text-gray-500 cursor-pointer">Phone</div>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                required
                defaultValue="admin@haxone.com"
                className="w-full bg-white border-gray-300 text-[#0D1117] h-12 focus:ring-[#2563EB] focus:border-[#2563EB]"
                placeholder="john@sunrise.co.ke"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                defaultValue="123456"
                className="w-full bg-white border-gray-300 text-[#0D1117] h-12 focus:ring-[#2563EB] focus:border-[#2563EB]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#2563EB] hover:text-[#1d4ed8]">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-12 rounded-lg font-bold text-base shadow-md shadow-blue-500/20"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button variant="outline" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-10">
                G
              </Button>
              <Button variant="outline" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-10">
                A
              </Button>
              <Button variant="outline" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-10">
                M
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account? <a href="/setup" className="font-bold text-[#2563EB]">Create store</a>
          </div>
        </div>
      </div>
    </div>
  );
}
