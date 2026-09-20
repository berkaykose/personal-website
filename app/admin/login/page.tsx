'use client'
import { useActionState } from 'react'
import { loginAction, type LoginState } from './actions'

export default function AdminLoginPage() {
  const [state, action, isPending] = useActionState<LoginState | null, FormData>(loginAction, null)

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-4">
          ADMIN
        </div>
        <h1 className="font-display text-3xl font-bold mb-8">Sign in</h1>

        <form action={action} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs tracking-widest uppercase text-muted mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 text-sm border border-border rounded-md bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs tracking-widest uppercase text-muted mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 text-sm border border-border rounded-md bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center gap-1 bg-accent text-white text-sm font-medium px-6 py-3 rounded-md hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
