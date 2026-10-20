'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      console.error(error)
      setErrorMsg(error.message || 'Errore durante il login')
      return
    }
    router.push('/gestionale')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-neutral-800 p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-neutral-100 text-center">
          Login
        </h1>

        {errorMsg && (
          <p className="text-sm text-red-400 text-center">{errorMsg}</p>
        )}

        <div className="space-y-2">
          <label className="block text-sm text-neutral-200">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 text-sm"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-neutral-200">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 text-sm"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-md bg-brand/50 hover:bg-brand disabled:opacity-60 text-neutral-900 font-semibold py-2 text-sm"
        >
          {loading ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>
    </div>
  )
}
