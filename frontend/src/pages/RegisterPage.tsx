import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, AtSign, Lock, Mail, User, UserPlus } from 'lucide-react'
import { Button } from '../components/Common/Button'
import { Input } from '../components/Common/Input'
import { useToast } from '../components/Common/Toast'
import { cn } from '../lib/cn'

interface Strength {
  score: number // 0..4
  label: string
  color: string
}

function scorePassword(pw: string): Strength {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map: Strength[] = [
    { score: 0, label: 'Very weak', color: 'bg-accent-red' },
    { score: 1, label: 'Weak', color: 'bg-accent-red' },
    { score: 2, label: 'Fair', color: 'bg-accent-orange' },
    { score: 3, label: 'Good', color: 'bg-yellow-300' },
    { score: 4, label: 'Strong', color: 'bg-accent-green' },
  ]
  return map[score]
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)

  const strength = useMemo(() => scorePassword(password), [password])
  const mismatch = confirm.length > 0 && confirm !== password

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (mismatch || !agreed) {
      showToast({ variant: 'warning', title: 'Check the form', message: 'Passwords must match and the terms must be accepted.' })
      return
    }
    showToast({ variant: 'success', title: 'Account created', message: 'Demo account ready — signing you in.' })
    navigate('/')
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 sm:p-10">
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-20" aria-hidden />
      <div className="relative w-full max-w-md animate-fade-in rounded border border-border-color bg-bg-secondary/90 p-8 shadow-glow-cyan backdrop-blur-md">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-secondary transition-colors duration-300 hover:text-accent-cyan"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>

        <h1 className="text-2xl font-bold text-text-primary">Create account</h1>
        <p className="mt-1 text-sm text-text-secondary">A new operator workspace.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input label="Name" name="name" placeholder="John Analyst" leftIcon={<User className="h-4 w-4" />} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Username" name="username" placeholder="i.analyst" leftIcon={<AtSign className="h-4 w-4" />} required />
            <Input label="Email" name="email" type="email" placeholder="jane@agency.io" leftIcon={<Mail className="h-4 w-4" />} required />
          </div>

          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Choose a strong password"
              leftIcon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-colors duration-300',
                        i < strength.score ? strength.color : 'bg-bg-tertiary',
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-text-secondary">
                  Strength: <span className="text-text-primary">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirm password"
            name="confirm"
            type="password"
            placeholder="Repeat password"
            leftIcon={<Lock className="h-4 w-4" />}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={mismatch ? 'Passwords do not match' : undefined}
            required
          />

          <label className="flex cursor-pointer select-none items-start gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 cursor-pointer accent-accent-green"
            />
            <span>
              I accept the{' '}
              <span className="text-accent-cyan">Terms of Use</span> and the{' '}
              <span className="text-accent-cyan">Privacy Policy</span>.
            </span>
          </label>

          <Button type="submit" fullWidth size="lg" leftIcon={<UserPlus className="h-4 w-4" />}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-secondary">
          Already registered?{' '}
          <Link to="/login" className="text-accent-green transition-colors duration-300 hover:text-text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
