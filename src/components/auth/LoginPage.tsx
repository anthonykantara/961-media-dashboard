import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { requestOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [expiresIn, setExpiresIn] = useState(600);

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const seconds = await requestOtp(email);
      setExpiresIn(seconds);
      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send login code.');
    } finally { setBusy(false); }
  }

  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      await verifyOtp(email, code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid login code.');
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-5xl font-bold tracking-tighter text-[#FF0000]">961</div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">Media CMS</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in with your email</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Email address
              <input
                type="email" required autoFocus autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-red-100"
                placeholder="you@example.com"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-[#FF0000] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? 'Sending code...' : 'Send login code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="text-sm text-gray-600">We sent a 6-digit code to <strong className="text-gray-900">{email}</strong>.</div>
            <label className="block text-sm font-medium text-gray-700">
              Login code
              <input
                type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required autoFocus autoComplete="one-time-code" value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-red-100"
                placeholder="000000"
              />
            </label>
            <p className="text-xs text-gray-400">Code expires in {Math.ceil(expiresIn / 60)} minutes.</p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={busy || code.length !== 6} className="w-full rounded-xl bg-[#FF0000] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? 'Signing in...' : 'Sign in'}
            </button>
            <button type="button" onClick={() => { setStep('email'); setCode(''); setError(''); }} className="w-full text-sm font-medium text-gray-500 hover:text-gray-900">
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
