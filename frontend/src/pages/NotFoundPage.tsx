import { Link } from 'react-router-dom'
import { Home, TriangleAlert } from 'lucide-react'
import { Button } from '../components/Common/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center animate-fade-in">
      <TriangleAlert className="h-12 w-12 text-accent-orange" />
      <p className="mt-6 text-5xl font-bold text-text-primary">
        4<span className="text-accent-red">0</span>4
      </p>
      <p className="mt-2 text-sm text-text-secondary">This route is offline.</p>
      <Link to="/" className="mt-6">
        <Button leftIcon={<Home className="h-4 w-4" />}>Back to dashboard</Button>
      </Link>
    </div>
  )
}
