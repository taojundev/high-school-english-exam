import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from './Icons';

export function ScoreRing({
  score,
  max,
  size = 168,
  label,
}: {
  score: number;
  max: number;
  size?: number;
  label?: string;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const ratio = max > 0 ? Math.min(1, Math.max(0, score / max)) : 0;
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 128 128" width={size} height={size} aria-hidden="true">
        <circle className="ring-track" cx="64" cy="64" r={radius} />
        <circle
          className="ring-value"
          cx="64"
          cy="64"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
        />
      </svg>
      <div className="ring-center">
        <strong>{Number.isInteger(score) ? score : score.toFixed(1)}</strong>
        <span>/ {max}</span>
        {label ? <em>{label}</em> : null}
      </div>
    </div>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
  actions,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="icon-button" aria-label="关闭" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {actions ? <div className="modal-actions">{actions}</div> : null}
      </div>
    </div>
  );
}

export function EmptyState({
  eyebrow,
  title,
  description,
  to,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  to?: string;
  action?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      {eyebrow ? <span className="kicker">{eyebrow}</span> : null}
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
      {to && action ? (
        <Link className="btn btn-primary" to={to}>
          {action}
          <ArrowRight size={17} />
        </Link>
      ) : null}
    </div>
  );
}

export function ProgressBar({ value, max, tone }: { value: number; max: number; tone?: 'ok' | 'warn' | 'bad' }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <span className={tone ? `tone-${tone}` : undefined} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Pill({ children, tone }: { children: ReactNode; tone?: 'accent' | 'teal' | 'gold' | 'muted' }) {
  return <span className={`pill ${tone ? `pill-${tone}` : ''}`}>{children}</span>;
}
