import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export function ArrowRight({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function Clock({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}

export function Book({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    </svg>
  );
}

export function Chart({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </svg>
  );
}

export function Check({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="m4 12 5 5L20 6" />
    </svg>
  );
}

export function X({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function Flag({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M5 21V4" />
      <path d="M5 5h10l-1.5 3L15 11H5" />
    </svg>
  );
}

export function Play({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M8 5.5v13" fill="currentColor" stroke="none" />
      <path d="M8 5.5 19 12 8 18.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Stop({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Printer({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M7 8V3h10v5" />
      <rect x="4" y="8" width="16" height="8" rx="2" />
      <path d="M7 14h10v7H7z" />
    </svg>
  );
}

export function Trash({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m6 7 1 14h10l1-14" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function ChevronDown({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Spark({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6.5 6.5 2.8 2.8M14.7 14.7l2.8 2.8M17.5 6.5l-2.8 2.8M9.3 14.7l-2.8 2.8" />
    </svg>
  );
}

export function Target({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function Search({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function Menu({ size = 18, ...props }: Props) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
