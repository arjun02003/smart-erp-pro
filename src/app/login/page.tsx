'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, DEMO_USER } from '@/lib/store';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone, Shield, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('admin@smarterp.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    login(DEMO_USER);
    toast.success('Welcome back, Arjun! 🎉');
    router.push('/dashboard');
    setLoading(false);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login(DEMO_USER);
      toast.success('Demo mode activated! 🚀');
      router.push('/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 hero-bg grid-bg relative">
      {/* Bg effects */}
      <div className="absolute top-20 left-20 w-80 h-80 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(60px)' }} />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-bold text-xl text-white">SmartERP Pro</h1>
              <p className="text-[10px] text-indigo-400 font-semibold tracking-widest">CLOUD EDITION</p>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white mt-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-sm text-slate-400 mt-1">{isLogin ? 'Sign in to your ERP dashboard' : 'Start your free 7-day trial'}</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs text-slate-400 mb-1 block font-medium">Business Name</label>
                <input className="input" placeholder="Your Business Name" id="business-name" />
              </div>
            )}
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className="input pl-10" type="email" placeholder="admin@smarterp.in"
                  value={email} onChange={e => setEmail(e.target.value)} id="login-email" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className="input pl-10 pr-10" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} id="login-password" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked /> Remember me
                </label>
                <button type="button" className="text-indigo-400 hover:text-indigo-300">Forgot password?</button>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 rounded-xl text-base"
              id="login-submit">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-slate-500">or continue with</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary py-2.5 justify-center flex items-center gap-2 text-sm rounded-xl">
              <Globe size={16} className="text-blue-400" /> Google
            </button>
            <button className="btn-secondary py-2.5 justify-center flex items-center gap-2 text-sm rounded-xl">
              <Smartphone size={16} className="text-green-400" /> OTP Login
            </button>
          </div>

          {/* Demo btn */}
          <button onClick={handleDemoLogin}
            className="w-full mt-4 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
            id="demo-login">
            🚀 Try Demo — No Sign Up Required
          </button>
        </div>

        {/* Toggle */}
        <p className="text-center text-sm text-slate-400 mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 hover:text-indigo-300 font-semibold">
            {isLogin ? 'Start Free Trial' : 'Sign In'}
          </button>
        </p>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-600">
          <Shield size={12} />
          <span>256-bit SSL Encrypted · SOC2 Compliant · GDPR Ready</span>
        </div>
      </motion.div>
    </div>
  );
}
