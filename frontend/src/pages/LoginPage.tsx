import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail, Terminal } from 'lucide-react'
import { Button } from '../components/Common/Button'
import { Input } from '../components/Common/Input'
import { useToast } from '../components/Common/Toast'

export function LoginPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [remember, setRemember] = useState(true)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    showToast({ variant: 'success', title: 'Welcome back', message: 'Demo session started.' })
    navigate('/')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-border-color bg-bg-secondary lg:flex">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-bg-primary via-transparent to-accent-green/5" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-accent-green/50 bg-accent-green/10 text-accent-green shadow-glow-green">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-wide">
              OSINT<span className="text-accent-green">_</span>WB
            </span>
          </div>

          <div className="max-w-md">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent-green">// intelligence workspace</p>
            <h1 className="text-3xl font-bold leading-tight text-text-primary">
              Map the adversary.
              <br />
              Link the entities.
              <br />
              <span className="text-accent-cyan text-glow-cyan">Find the truth.</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-text-secondary">
              A unified OSINT environment — cases, entities, relations and findings in one dark, fast,
              keyboard-driven console.
            </p>
          </div>

          <pre className="rounded border border-border-color bg-bg-primary/60 p-4 text-[11px] leading-relaxed text-text-secondary">
            <span className="text-accent-green">$</span> osint init --secure{'\n'}
            <span className="text-accent-cyan">[ok]</span> vault unlocked{'\n'}
            <span className="text-accent-cyan">[ok]</span> 12 sources connected{'\n'}
            <span className="text-accent-green">▸</span> awaiting operator<span className="animate-blink">_</span>
          </pre>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Sign in</h2>
            <p className="mt-1 text-sm text-text-secondary">Access your intelligence workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="operator@agency.io"
              autoComplete="email"
              defaultValue="sunfiz.w@gmail.com"
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />
            <Input
              type="password"
              label="Password"
              name="password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              defaultValue="demo-access"
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 cursor-pointer accent-accent-green"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() =>
                  showToast({ variant: 'info', title: 'Password reset', message: 'The reset link is a stub in the demo.' })
                }
                className="text-xs text-accent-cyan transition-colors duration-300 hover:text-text-primary"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-text-secondary">
            No account?{' '}
            <Link to="/register" className="text-accent-green transition-colors duration-300 hover:text-text-primary">
              Create
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
