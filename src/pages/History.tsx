import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Chart, Trash } from '../components/Icons';
import { EmptyState, Pill, ProgressBar } from '../components/ui';
import { formatDate, formatDuration, gradeFor } from '../lib/format';
import { attemptScoreSplit } from '../lib/scoring';
import { clearAttempts, deleteAttempt, loadAttempts } from '../lib/storage';
import type { Attempt } from '../types';

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>(() => loadAttempts());

  const stats = useMemo(() => {
    if (attempts.length === 0) return { avg: 0, best: 0, time: 0 };
    const ratios = attempts.map((a) => {
      const split = attemptScoreSplit(a);
      return split.objectiveMax ? split.objectiveScore / split.objectiveMax : 0;
    });
    return {
      avg: ratios.reduce((n, r) => n + r, 0) / ratios.length,
      best: Math.max(...ratios),
      time: attempts.reduce((n, a) => n + a.durationUsedSec, 0),
    };
  }, [attempts]);

  const remove = (id: string) => {
    if (!window.confirm('删除这条成绩记录？删除后无法恢复。')) return;
    deleteAttempt(id);
    setAttempts(loadAttempts());
  };

  const clearAll = () => {
    if (!window.confirm('清空全部成绩记录？此操作无法撤销。')) return;
    clearAttempts();
    setAttempts([]);
  };

  if (attempts.length === 0) {
    return (
      <div className="container page-empty">
        <EmptyState
          eyebrow="NO ATTEMPTS YET"
          title="还没有成绩记录"
          description="完成第一套模拟卷后，这里会保存你的得分、板块表现和历次趋势。"
          to="/"
          action="开始第一套"
        />
      </div>
    );
  }

  return (
    <div className="container history-page">
      <header className="history-hero">
        <div>
          <span className="kicker">YOUR PROGRESS</span>
          <h1>成绩记录</h1>
          <p>所有记录保存在本机浏览器。建议每周做 1–2 套完整限时训练，并留出时间复盘。</p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>
          <Trash size={16} /> 清空记录
        </button>
      </header>

      <div className="result-stat-grid history-stats">
        <div className="result-stat">
          <span>完成套数</span>
          <strong>{attempts.length}</strong>
          <em>套</em>
        </div>
        <div className="result-stat">
          <span>平均得分率</span>
          <strong>{Math.round(stats.avg * 100)}</strong>
          <em>%</em>
        </div>
        <div className="result-stat">
          <span>最高得分率</span>
          <strong>{Math.round(stats.best * 100)}</strong>
          <em>%</em>
        </div>
        <div className="result-stat">
          <span>累计练习</span>
          <strong>{Math.round(stats.time / 60)}</strong>
          <em>分钟</em>
        </div>
      </div>

      <section className="trend-panel">
        <div className="panel-head">
          <div>
            <span className="kicker">SCORE TREND</span>
            <h2>得分率趋势</h2>
          </div>
          <Chart size={20} />
        </div>
        <TrendChart attempts={attempts} />
      </section>

      <section className="history-list-section">
        <div className="panel-head">
          <div>
            <span className="kicker">ALL ATTEMPTS</span>
            <h2>全部记录</h2>
          </div>
          <span className="muted-text">{attempts.length} 条</span>
        </div>
        <div className="history-list">
          {attempts.map((attempt) => {
            const split = attemptScoreSplit(attempt);
            const ratio = split.objectiveMax ? split.objectiveScore / split.objectiveMax : 0;
            const grade = gradeFor(split.objectiveScore, split.objectiveMax);
            return (
              <article className="history-card" key={attempt.id}>
                <div className="history-main">
                  <div className="history-top">
                    <Pill tone={ratio >= 0.75 ? 'teal' : ratio >= 0.6 ? 'gold' : 'accent'}>{grade.label}</Pill>
                    <span>{attempt.paper.mode === 'full' ? '全真模拟' : '专项训练'}</span>
                    <span>{formatDate(attempt.submittedAt)}</span>
                  </div>
                  <h3>{attempt.paper.title}</h3>
                  <div className="history-bars">
                    {attempt.sectionResults.map((section) => (
                      <div className="history-bar" key={section.id}>
                        <span>{section.name}</span>
                        <ProgressBar value={section.score} max={section.max} />
                        <em>
                          {section.score}/{section.max}
                        </em>
                      </div>
                    ))}
                  </div>
                  <div className="history-meta">
                    <span>主观估分 {split.subjectiveEstimate}/{split.subjectiveMax}（不参与评级）</span>
                    <span>用时 {formatDuration(attempt.durationUsedSec)}</span>
                    <span>已答 {attempt.results.filter((r) => (attempt.answers[r.id] ?? '').trim()).length}/{attempt.results.length}</span>
                    <span>种子 {attempt.paper.seed}</span>
                  </div>
                </div>
                <div className="history-side">
                  <div className="history-score">
                    <strong>{split.objectiveScore}</strong>
                    <span>/ {split.objectiveMax}</span>
                  </div>
                  <div className="history-actions">
                    <Link to={`/result/${attempt.id}`} className="btn btn-primary btn-sm">
                      成绩单 <ArrowRight size={15} />
                    </Link>
                    <Link to={`/review/${attempt.id}`} className="btn btn-ghost btn-sm">
                      复盘
                    </Link>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="删除记录"
                      onClick={() => remove(attempt.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TrendChart({ attempts }: { attempts: Attempt[] }) {
  const ordered = [...attempts].reverse();
  const width = 640;
  const height = 200;
  const padX = 36;
  const padY = 24;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const points = ordered.map((attempt, index) => {
    const split = attemptScoreSplit(attempt);
    const ratio = split.objectiveMax ? split.objectiveScore / split.objectiveMax : 0;
    const x = ordered.length === 1 ? width / 2 : padX + (index / (ordered.length - 1)) * innerW;
    const y = padY + (1 - ratio) * innerH;
    return { x, y, ratio, attempt, split };
  });
  const path = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="trend-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="历次得分率趋势">
        {[0.25, 0.5, 0.75, 1].map((tick) => (
          <g key={tick}>
            <line
              x1={padX}
              x2={width - padX}
              y1={padY + (1 - tick) * innerH}
              y2={padY + (1 - tick) * innerH}
              className="trend-grid"
            />
            <text x={8} y={padY + (1 - tick) * innerH + 4} className="trend-axis-label">
              {Math.round(tick * 100)}
            </text>
          </g>
        ))}
        {points.length > 1 ? <polyline points={path} className="trend-line" /> : null}
        {points.map((point) => (
          <g key={point.attempt.id}>
            <circle cx={point.x} cy={point.y} r={5} className="trend-dot" />
            <title>
              {formatDate(point.attempt.submittedAt)} · 客观题 {point.split.objectiveScore}/{point.split.objectiveMax} · 主观估分{' '}
              {point.split.subjectiveEstimate}/{point.split.subjectiveMax}
            </title>
          </g>
        ))}
      </svg>
      <div className="trend-foot">
        <span>较早</span>
        <span>{ordered.length} 次练习</span>
        <span>最近</span>
      </div>
    </div>
  );
}
