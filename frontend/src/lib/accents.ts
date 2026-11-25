// class names are written out in full on purpose, tailwind jit can't see interpolated strings

export type Accent = 'green' | 'cyan' | 'orange' | 'red' | 'violet' | 'yellow'

export interface AccentClasses {
  text: string
  border: string
  bg: string
  solid: string
  hover: string
  chip: string
  groupHoverText: string
}

export const accents: Record<Accent, AccentClasses> = {
  green: {
    text: 'text-accent-green',
    border: 'border-accent-green/50',
    bg: 'bg-accent-green/10',
    solid: 'bg-accent-green',
    hover: 'hover:border-accent-green/60 hover:shadow-glow-green',
    chip: 'bg-accent-green/10 border-accent-green/40 text-accent-green',
    groupHoverText: 'group-hover:text-accent-green',
  },
  cyan: {
    text: 'text-accent-cyan',
    border: 'border-accent-cyan/50',
    bg: 'bg-accent-cyan/10',
    solid: 'bg-accent-cyan',
    hover: 'hover:border-accent-cyan/60 hover:shadow-glow-cyan',
    chip: 'bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan',
    groupHoverText: 'group-hover:text-accent-cyan',
  },
  orange: {
    text: 'text-accent-orange',
    border: 'border-accent-orange/50',
    bg: 'bg-accent-orange/10',
    solid: 'bg-accent-orange',
    hover: 'hover:border-accent-orange/60 hover:shadow-glow-orange',
    chip: 'bg-accent-orange/10 border-accent-orange/40 text-accent-orange',
    groupHoverText: 'group-hover:text-accent-orange',
  },
  red: {
    text: 'text-accent-red',
    border: 'border-accent-red/50',
    bg: 'bg-accent-red/10',
    solid: 'bg-accent-red',
    hover: 'hover:border-accent-red/60 hover:shadow-glow-red',
    chip: 'bg-accent-red/10 border-accent-red/40 text-accent-red',
    groupHoverText: 'group-hover:text-accent-red',
  },
  violet: {
    text: 'text-accent-violet',
    border: 'border-accent-violet/50',
    bg: 'bg-accent-violet/10',
    solid: 'bg-accent-violet',
    hover: 'hover:border-accent-violet/60 hover:shadow-glow-violet',
    chip: 'bg-accent-violet/10 border-accent-violet/40 text-accent-violet',
    groupHoverText: 'group-hover:text-accent-violet',
  },
  yellow: {
    text: 'text-accent-yellow',
    border: 'border-accent-yellow/50',
    bg: 'bg-accent-yellow/10',
    solid: 'bg-accent-yellow',
    hover: 'hover:border-accent-yellow/60 hover:shadow-glow-yellow',
    chip: 'bg-accent-yellow/10 border-accent-yellow/40 text-accent-yellow',
    groupHoverText: 'group-hover:text-accent-yellow',
  },
}
