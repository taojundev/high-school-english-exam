import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Printer, Spark, Target } from '../components/Icons';
import { EmptyState, Pill, ProgressBar, ScoreRing } from '../components/ui';
import { generatePaper } from '../lib/exam';
import { formatClock, formatDate, formatDuration, gradeFor, percent } from '../lib/format';
import { clearActive, getAttempt, loadActive, loadSeen, saveActive } from '../lib/storage';
import type { Attempt, SectionId } from '../types';

const priorityLabel = { high: '优先补', medium: '建议练', low: '再巩固' } as const;

export default function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt] = useState<Attempt | undefined>(() => (attemptId ? getAttempt(attemptId) : undefined));

  const weakTags = useMemo(() => {
    if (!attempt) return [];
    return attempt.tagStats
      .filter((t) => t.total >= 1 && t.accuracy < 0.75)
      .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
      .slice(0, 10);
  }, [attempt]);

  if (!attempt) {
    return (
      <div className="container page-empty">
        <EmptyState
          eyebrow="REPORT NOT FOUND"
          title="找不到这份成绩单"
          description="成绩记录保存在当前浏览器中。如果清理过浏览器数据，历史成绩将无法恢复。"
          to="/history"
          action="查看成绩记录"
        />
      </div>
    );
  }

  const { paper } = attempt;
  const ratio = attempt.maxScore ? attempt.totalScore / attempt.maxScore : 0;
  const grade = gradeFor(ratio);
  const objective = attempt.results.filter((r) => r.type === 'mcq' || r.type === 'fill' || r.type === 'vocab');
  const answered = attempt.results.filter((r) => (attempt.answers[r.id] ?? '').trim()).length;
  const correct = objective.filter((r) => r.correct).length;
  const subjective = attempt.results.filter((r) => r.type === 'translation' || r.type === 'summary' || r.type === 'writing');

  const guardActive = () => {
    const active = loadActive();
    if (!active) return true;
    if (!window.confirm('还有一场未交卷的考试，开始新的考试会放弃当前进度，确定继续？')) return false;
    clearActive();
    return true;
  };

  const startSection = (section: SectionId) => {
    if (!guardActive()) return;
    const next = generatePaper({ mode: 'section', section, seenIds: loadSeen() });
    const first = next.sections[0].id;
    saveActive({
      paper: next,
      answers: {},
      startedAt: new Date().toISOString(),
      flagged: [],
      transcriptReveals: [],
      replayCounts: {},
      currentSection: first,
      timeBySection: {},
      sectionEnteredAt: Date.now(),
    });
    navigate(`/exam/${next.id}`);
  };

  const startFull = () => {
    if (!guardActive()) return;
    const next = generatePaper({ mode: 'full', seenIds: loadSeen() });
    saveActive({
      paper: next,
      answers: {},
      startedAt: new Date().toISOString(),
      flagged: [],
      transcriptReveals: [],
      replayCounts: {},
      currentSection: next.sections[0].id,
      timeBySection: {},
      sectionEnteredAt: Date.now(),
    });
    navigate(`/exam/${next.id}`);
  };

  return (
    <div className="container result-page">
      <div className="result-toolbar no-print">
        <Link to="/history" className="back-link">
          <ArrowLeft size={16} /> 成绩记录
        </Link>
        <div className="toolbar-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}>
            <Printer size={16} /> 打印 / 导出 PDF
          </button>
          <Link to={`/review/${attempt.id}`} className="btn btn-primary btn-sm">
            逐题复盘 <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <header className="result-hero">
        <div className="result-hero-copy">
          <span className="kicker">SCORE REPORT</span>
          <h1>这一次，<em>{grade.label}</em>。</h1>
          <p className="result-sub">
            {paper.title} · {formatDate(attempt.submittedAt)} · 用时 {formatDuration(attempt.durationUsedSec)} · 种子{' '}
            {paper.seed}
          </p>
          <div className="result-badges">
            <Pill tone={ratio >= 0.75 ? 'teal' : ratio >= 0.6 ? 'gold' : 'accent'}>{grade.label}</Pill>
            <Pill tone="muted">满分 {attempt.maxScore}</Pill>
            <Pill tone="muted">已答 {answered}/{attempt.results.length}</Pill>
            <Pill tone="muted">{paper.mode === 'full' ? '全真模拟' : '专项训练'}</Pill>
          </div>
          <p className="result-note">{grade.note}。分数只是快照，下面的失分分布和行动建议更值得花时间。</p>
        </div>
        <ScoreRing score={attempt.totalScore} max={attempt.maxScore} label={grade.label} size={196} />
      </header>

      <section className="result-stat-grid" aria-label="成绩摘要">
        <div className="result-stat">
          <span>客观题正确率</span>
          <strong>{percent(objective.length ? correct / objective.length : 0)}</strong>
          <em>
            {correct}/{objective.length} 题
          </em>
        </div>
        <div className="result-stat">
          <span>主观题初评</span>
          <strong>
            {subjective.reduce((n, r) => n + r.earned, 0)}
            <i> / {subjective.reduce((n, r) => n + r.points, 0)}</i>
          </strong>
          <em>翻译 · 概要 · 写作</em>
        </div>
        <div className="result-stat">
          <span>平均每题用时</span>
          <strong>{Math.round(attempt.durationUsedSec / Math.max(1, attempt.results.length))}</strong>
          <em>秒 / 题</em>
        </div>
        <div className="result-stat">
          <span>未作答</span>
          <strong>{attempt.results.length - answered}</strong>
          <em>题</em>
        </div>
      </section>

      <div className="result-columns">
        <section className="result-panel">
          <div className="panel-head">
            <div>
              <span className="kicker">BY SECTION</span>
              <h2>分板块表现</h2>
            </div>
            <Link to={`/review/${attempt.id}`} className="text-link no-print">
              看错题 <ArrowRight size={15} />
            </Link>
          </div>
          <div className="section-results">
            {attempt.sectionResults.map((section) => {
              const tone = section.accuracy >= 0.8 ? 'ok' : section.accuracy >= 0.6 ? 'warn' : 'bad';
              return (
                <div className="section-result-row" key={section.id}>
                  <div className="section-result-name">
                    <strong>{section.name}</strong>
                    <span>
                      {section.correct}/{section.total} · {Math.round(section.accuracy * 100)}%
                    </span>
                  </div>
                  <div className="section-result-bar">
                    <ProgressBar value={section.score} max={section.max} tone={tone} />
                  </div>
                  <div className="section-result-score">
                    {section.score}
                    <em>/ {section.max}</em>
                  </div>
                  <div className="section-result-time">
                    {formatClock((attempt.timeBySection[section.id] ?? 0))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="result-panel">
          <div className="panel-head">
            <div>
              <span className="kicker">WEAK SPOTS</span>
              <h2>失分标签</h2>
            </div>
            <Target size={20} />
          </div>
          {weakTags.length > 0 ? (
            <>
              <p className="panel-lead">按正确率从低到高排列。标签越小，越适合优先补。</p>
              <div className="tag-cloud">
                {weakTags.map((tag) => (
                  <span
                    key={`${tag.section}-${tag.tag}`}
                    className={tag.accuracy < 0.5 ? 'tag-chip bad' : 'tag-chip warn'}
                    title={`${tag.correct}/${tag.total} 正确`}
                  >
                    {tag.tag}
                    <em>{Math.round(tag.accuracy * 100)}%</em>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="all-good">
              <CheckMark />
              <p>本次没有明显的薄弱标签。继续保持限时训练，重点减少拼写、单复数等非知识性失分。</p>
            </div>
          )}
        </section>
      </div>

      <section className="result-panel suggestions-panel">
        <div className="panel-head">
          <div>
            <span className="kicker">NEXT STEPS</span>
            <h2>下一步，这样练</h2>
          </div>
          <Spark size={20} />
        </div>
        <p className="panel-lead">
          建议根据本次的失分标签、板块正确率和用时自动生成。先做优先级最高的一项，不要一次改所有问题。
        </p>
        <div className="suggestion-list">
          {attempt.suggestions.map((suggestion, index) => (
            <article className={`suggestion priority-${suggestion.priority}`} key={`${suggestion.title}-${index}`}>
              <span className="suggestion-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="suggestion-main">
                <div className="suggestion-head">
                  <Pill tone={suggestion.priority === 'high' ? 'accent' : suggestion.priority === 'medium' ? 'gold' : 'teal'}>
                    {priorityLabel[suggestion.priority]}
                  </Pill>
                  <h3>{suggestion.title}</h3>
                </div>
                <p>{suggestion.detail}</p>
                <div className="suggestion-action">
                  <span>{suggestion.action}</span>
                  {suggestion.section ? (
                    <button type="button" className="text-link no-print" onClick={() => startSection(suggestion.section!)}>
                      练这个题型 <ArrowRight size={15} />
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="result-actions-panel no-print">
        <div>
          <span className="kicker">KEEP GOING</span>
          <h2>把这次的结果，变成下一次的起点。</h2>
          <p>建议 24 小时内重做一次错题，再做一套新的全卷验证是否真正掌握。</p>
        </div>
        <div className="result-actions">
          <Link to={`/review/${attempt.id}`} className="btn btn-ghost">
            逐题复盘
          </Link>
          <button type="button" className="btn btn-primary" onClick={startFull}>
            再考一套 <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <p className="result-disclaimer">
        说明：客观题按标准答案判分；翻译、概要、写作采用关键信息和语言特征进行规则初评，不能替代人工阅卷。成绩与解析仅用于练习。
      </p>
    </div>
  );
}

function CheckMark() {
  return (
    <span className="check-mark" aria-hidden="true">
      ✓
    </span>
  );
}
