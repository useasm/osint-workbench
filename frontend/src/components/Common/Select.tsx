import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  hint?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, placeholder, className, containerClassName, id, ...props },
  ref,
) {
  const autoId = useId()
  const selectId = id ?? autoId

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[11px] font-medium uppercase tracking-wider text-text-secondary"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          className={cn(
            'w-full appearance-none rounded-sm border bg-bg-secondary px-3 py-2.5 pr-9 text-sm text-text-primary',
            'transition-all duration-300 ease-out-soft focus:outline-none',
            error
              ? 'border-accent-red/70 focus:border-accent-red focus:shadow-glow-red'
              : 'border-border-color focus:border-accent-cyan focus:shadow-glow-cyan',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-bg-secondary">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
      </div>

      {error ? (
        <p className="text-[11px] text-accent-red">{error}</p>
      ) : (
        hint && <p className="text-[11px] text-text-secondary">{hint}</p>
      )}
    </div>
  )
})
