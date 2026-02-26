'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { mockLoginCredentials } from '@/data/users';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback to mock credentials for demo
        if (
          email === mockLoginCredentials.email &&
          password === mockLoginCredentials.password
        ) {
          router.push('/shop');
          return;
        }
        setError('Invalid email or password. Try alex@example.com / password123');
        setLoading(false);
        return;
      }

      router.push('/shop');
    } catch {
      // Fallback to mock credentials
      if (
        email === mockLoginCredentials.email &&
        password === mockLoginCredentials.password
      ) {
        router.push('/shop');
        return;
      }
      setError('Invalid email or password. Try alex@example.com / password123');
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        {/* Logo */}
        <div className="logo-wrap">
          <div className="logo-icon">
            <ShoppingCart size={24} />
          </div>
          <span className="logo-text">ModernShop</span>
        </div>

        <h1 className="title">Welcome back</h1>
        <p className="subtitle">Sign in to your account to continue</p>

        <div className="form">
          {/* Email */}
          <div className="field">
            <label className="field-label">Email</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          {/* Password */}
          <div className="field">
            <label className="field-label">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div className="demo-hint">
          <strong>Demo credentials:</strong> alex@example.com / password123
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f5ff 0%, #ede8ff 100%);
          padding: 1.5rem;
        }
        .card {
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(112, 0, 255, 0.12);
        }
        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: #7000ff;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1a0533;
        }
        .title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #1a0533;
          margin: 0 0 0.375rem;
        }
        .subtitle {
          color: #7a6898;
          font-size: 0.9rem;
          margin: 0 0 2rem;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4a3870;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9b8cc4;
        }
        .field-input {
          width: 100%;
          padding: 0.65rem 2.5rem 0.65rem 2.5rem;
          border: 1.5px solid #e8e0ff;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #1a0533;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .field-input:focus { border-color: #7000ff; }
        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9b8cc4;
          cursor: pointer;
          padding: 2px;
        }
        .error {
          background: #fff5f5;
          border: 1px solid #ffc5b8;
          border-radius: 10px;
          padding: 0.65rem 0.875rem;
          font-size: 0.82rem;
          color: #e17055;
        }
        .login-btn {
          width: 100%;
          padding: 0.8rem;
          background: #7000ff;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 0.25rem;
        }
        .login-btn:hover:not(:disabled) { background: #5900cc; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .demo-hint {
          margin-top: 1.25rem;
          padding: 0.75rem;
          background: #fdfaff;
          border: 1px solid #f0eeff;
          border-radius: 10px;
          font-size: 0.78rem;
          color: #7a6898;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
