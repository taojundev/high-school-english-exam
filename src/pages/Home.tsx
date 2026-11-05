import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Book, Chart, Clock, Spark } from '../components/Icons';
import { Pill, ProgressBar } from '../components/ui';
import { SECTION_META } from '../sections';
import { bankTotals } from '../data';
import { generatePaper } from '../lib/exam';
import { formatDate, formatDuration, gradeFor } from '../lib/format';
import { clearActive, loadActive, loadAttempts, loadSeenHistory, saveActive } from '../lib/storage';
import type { ActiveDraft, ExamMode, SectionId } from '../types';

const difficultyOptions: { value: 'mixed' | 'basic' | 'advanced'; label: string; note: string }[] = [
  { value: 'mixed', label: '混合难度', note: '基础、进阶按比例出现' },
  { value: 'basic', label: '基础夯实', note: '优先简单题，建立信心' },
  { value: 'advanced', label: '进阶冲刺', note: '优先高难题，冲击高分' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ExamMode>('full');
  const [section, setSection] = useState<SectionId>('reading');
  const [difficulty, setDifficulty] = useState<'mixed' | 'basic' | 'advanced'>('mixed');
  const [seedInput, setSeedInput] = useState('');
  const [active, setActive] = useState<ActiveDraft | undefined>(() => loadActive());
  const [attempts] = useState(() => loadAttempts());
  const totals = useMemo(() => bankTotals(), []);

  const stats = useMemo(() => {
    if (attempts.length === 0) return { count: 0, avg: 0, best: 0, last: null as null | (typeof attempts)[number] };
    const ratios = attempts.map((a) => (a.maxScore ? a.totalScore / a.maxScore : 0));
    return {
      count: attempts.length,
      avg: ratios.reduce((n, r) => n + r, 0) / ratios.length,
      best: Math.max(...ratios),
      last: attempts[0],
    };
  }, [attempts]);

  const discardActive = () => {
    if (!window.confirm('放弃当前未交卷的考试？已作答内容将丢失。')) return;
    clearActive();
    setActive(undefined);
  };

  const start = () => {
    let seed: number | undefined;
    if (seedInput.trim()) {
      const parsed = Number(seedInput.trim());
      if (!Number.isSafeInteger(parsed) || parsed < 0) {
        window.alert('种子需为非负整数，或留空使用随机种子。');
        return;
      }
      seed = parsed;
    }
    if (active) {
      const ok = window.confirm('你还有一场未交卷的考试。开始新的考试会放弃当前进度，确定继续？');
      if (!ok) return;
      clearActive();
    }
    const paper = generatePaper({
      mode,
      section: mode === 'section' ? section : undefined,
      difficulty,
      seed,
      seenIds: seed === undefined ? loadSeenHistory() : [],
    });
    const first = paper.sections[0].id;
    const draft: ActiveDraft = {
      paper,
      answers: {},
      startedAt: new Date().toISOString(),
      flagged: [],
      transcriptReveals: [],
      replayCounts: {},
      currentSection: first,
      timeBySection: {},
      sectionEnteredAt: Date.now(),
      lastActiveAt: Date.now(),
    };
    if (!saveActive(draft)) {
      window.alert('无法保存考试进度（浏览器存储已满或不可用），请清理存储后重试。');
      return;
    }
    navigate(`/exam/${paper.id}`);
  };

  const recent = attempts.slice(0, 3);
  const lastRatio = stats.last && stats.last.maxScore ? stats.last.totalScore / stats.last.maxScore : 0;
  const lastGrade = gradeFor(lastRatio);

  return (
    <div className="home-page">
      <section className="hero container">
        <div className="hero-copy">
          <span className="kicker">SHANGHAI GAOKAO · ENGLISH</span>
          <h1>
            <span>把每一次练习，</span>
            <span>
              当成六月的那场<em>考试</em>。
            </span>
          </h1>
          <p className="hero-lead">
            覆盖听力、语法、词汇、完形、阅读、翻译、概要与写作的随机组卷系统。限时作答，交卷即出分，并把每一道错题变成下一步的提分路径。
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={start}>
              生成一套{mode === 'full' ? '全真模拟卷' : '专项练习'}
              <ArrowRight size={18} />
            </button>
            <Link to="/bank" className="btn btn-ghost btn-lg">
              <Book size={18} />
              浏览题库
            </Link>
          </div>
          <div className="hero-facts">
            <span>
              <Clock size={15} /> {mode === 'full' ? '120 分钟' : `${SECTION_META.find((s) => s.id === section)?.practiceMinutes} 分钟`}
            </span>
            <span>
              <Chart size={15} /> {mode === 'full' ? '150 分' : `${SECTION_META.find((s) => s.id === section)?.practicePoints} 分`}
            </span>
            <span>
              <Spark size={15} /> {totals.questions} 道小题随机抽取
            </span>
          </div>
        </div>

        <aside className="hero-card" aria-label="考试概览">
          <div className="hero-card-top">
            <span className="hero-card-label">{stats.last ? '最近一次成绩' : '全真模拟卷'}</span>
            <span className="hero-card-seal">模考</span>
          </div>
          {stats.last ? (
            <>
              <div className="hero-score">
                <strong>{stats.last.totalScore}</strong>
                <span>/ {stats.last.maxScore}</span>
              </div>
              <div className="hero-score-meta">
                <Pill tone="accent">{lastGrade.label}</Pill>
                <span>{formatDate(stats.last.submittedAt)}</span>
              </div>
              <div className="hero-mini-bars">
                {stats.last.sectionResults.slice(0, 5).map((s) => (
                  <div className="mini-bar" key={s.id}>
                    <div className="mini-bar-label">
                      <span>{s.name}</span>
                      <em>
                        {s.score}/{s.max}
                      </em>
                    </div>
                    <ProgressBar value={s.score} max={s.max} />
                  </div>
                ))}
              </div>
              <Link to={`/result/${stats.last.id}`} className="hero-card-link">
                查看完整成绩单 <ArrowRight size={15} />
              </Link>
            </>
          ) : (
            <>
              <div className="paper-preview">
                <div className="paper-preview-head">
                  <span>上海高考英语</span>
                  <span>150 分 · 120 分钟</span>
                </div>
                <div className="paper-preview-title">全真模拟卷</div>
                <ul>
                  {SECTION_META.map((s) => (
                    <li key={s.id}>
                      <span>{s.name}</span>
                      <em>{s.points} 分</em>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="hero-card-note">生成后立即开始计时；中途退出会自动保存，可随时继续。</p>
            </>
          )}
        </aside>
      </section>

      {active ? (
        <section className="container">
          <div className="resume-banner">
            <div className="resume-main">
              <span className="resume-dot" aria-hidden="true" />
              <div>
                <strong>有一场考试尚未交卷</strong>
                <p>
                  {active.paper.title} · 开始于 {formatDate(active.startedAt)} · 已作答{' '}
                  {Object.values(active.answers).filter((v) => v.trim()).length}/{active.paper.questions.length} 题
                </p>
              </div>
            </div>
            <div className="resume-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={discardActive}>
                放弃
              </button>
              <Link to={`/exam/${active.paper.id}`} className="btn btn-primary btn-sm">
                继续考试 <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container stats-strip" aria-label="练习统计">
        <div className="stat">
          <span className="stat-label">已完成</span>
          <strong>{stats.count}</strong>
          <em>套试卷</em>
        </div>
        <div className="stat">
          <span className="stat-label">平均得分率</span>
          <strong>{stats.count ? Math.round(stats.avg * 100) : '—'}</strong>
          <em>{stats.count ? '%' : '开始第一套'}</em>
        </div>
        <div className="stat">
          <span className="stat-label">最高得分率</span>
          <strong>{stats.count ? Math.round(stats.best * 100) : '—'}</strong>
          <em>{stats.count ? '%' : '等待记录'}</em>
        </div>
        <div className="stat">
          <span className="stat-label">题库小题</span>
          <strong>{totals.questions}</strong>
          <em>道可抽取</em>
        </div>
      </section>

      <section className="container start-section" id="start">
        <div className="start-card">
          <div className="start-head">
            <div>
              <span className="kicker">BUILD YOUR PAPER</span>
              <h2>现在，组一张属于你的卷子</h2>
            </div>
            <p>每次抽题都会优先避开最近做过的题；同一套卷内的选项顺序也会重新打乱。</p>
          </div>

          <div className="mode-tabs" role="tablist" aria-label="考试模式">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'full'}
              className={mode === 'full' ? 'mode-tab active' : 'mode-tab'}
              onClick={() => setMode('full')}
            >
              <strong>全真模拟</strong>
              <span>8 大题型 · 150 分 · 120 分钟</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'section'}
              className={mode === 'section' ? 'mode-tab active' : 'mode-tab'}
              onClick={() => setMode('section')}
            >
              <strong>专项训练</strong>
              <span>只练一个题型 · 更短更聚焦</span>
            </button>
          </div>

          {mode === 'section' ? (
            <div className="section-picker">
              {SECTION_META.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={section === s.id ? 'section-option active' : 'section-option'}
                  onClick={() => setSection(s.id)}
                  aria-pressed={section === s.id}
                >
                  <span className="section-option-name">{s.name}</span>
                  <span className="section-option-meta">
                    {s.practicePoints} 分 · {s.practiceMinutes} 分钟
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="full-preview">
              {SECTION_META.map((s) => (
                <div className="full-preview-item" key={s.id}>
                  <span>{s.name}</span>
                  <em>{s.points} 分</em>
                  <small>{s.minutes} 分钟</small>
                </div>
              ))}
            </div>
          )}

          <div className="start-footer">
            <div className="start-options">
              <div className="difficulty-picker">
                <span className="field-label">难度</span>
                <div className="segmented" role="group" aria-label="难度">
                  {difficultyOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      className={difficulty === opt.value ? 'segment active' : 'segment'}
                      onClick={() => setDifficulty(opt.value)}
                      aria-pressed={difficulty === opt.value}
                      title={opt.note}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="seed-picker" htmlFor="paper-seed">
                <span className="field-label">种子（可选）</span>
                <input
                  id="paper-seed"
                  className="text-input seed-input"
                  value={seedInput}
                  onChange={(event) => setSeedInput(event.target.value)}
                  placeholder="留空则随机"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="start-cta">
              <div className="start-summary">
                <span>{mode === 'full' ? '全真模拟卷' : `${SECTION_META.find((s) => s.id === section)?.name}专项`}</span>
                <strong>
                  {mode === 'full' ? '150 分' : `${SECTION_META.find((s) => s.id === section)?.practicePoints} 分`}
                </strong>
                <em>
                  {mode === 'full' ? '120 分钟' : `${SECTION_META.find((s) => s.id === section)?.practiceMinutes} 分钟`}
                </em>
              </div>
              <button type="button" className="btn btn-primary btn-lg" onClick={start}>
                生成试卷并开始
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container structure-section">
        <div className="section-heading">
          <span className="kicker">PAPER STRUCTURE</span>
          <h2>一张卷子，八个得分战场</h2>
          <p>分值按上海高考英语题型结构设计，练习模式会相应缩短。</p>
        </div>
        <div className="structure-table">
          <div className="structure-row structure-head">
            <span>板块</span>
            <span>题量</span>
            <span>分值</span>
            <span>建议用时</span>
            <span>训练重点</span>
          </div>
          {SECTION_META.map((s, index) => (
            <div className="structure-row" key={s.id}>
              <span className="structure-name">
                <em>{String(index + 1).padStart(2, '0')}</em>
                {s.name}
              </span>
              <span data-label="题量">{sectionCount(s.id)}</span>
              <span data-label="分值">{s.points} 分</span>
              <span data-label="建议用时">{s.minutes} 分钟</span>
              <span className="structure-focus" data-label="训练重点">
                {s.blurb}
              </span>
            </div>
          ))}
        </div>
        <p className="structure-note">
          说明：听力采用浏览器英文语音合成播放，建议佩戴耳机；翻译、概要、写作采用可解释的规则初评，结果仅供练习参考。
        </p>
      </section>

      {recent.length > 0 ? (
        <section className="container recent-section">
          <div className="section-heading with-action">
            <div>
              <span className="kicker">RECENT ATTEMPTS</span>
              <h2>最近的练习</h2>
            </div>
            <Link to="/history" className="text-link">
              全部记录 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="recent-grid">
            {recent.map((attempt) => {
              const ratio = attempt.maxScore ? attempt.totalScore / attempt.maxScore : 0;
              const grade = gradeFor(ratio);
              return (
                <Link className="recent-card" to={`/result/${attempt.id}`} key={attempt.id}>
                  <div className="recent-top">
                    <span>{attempt.paper.mode === 'full' ? '全真模拟' : '专项训练'}</span>
                    <Pill tone={ratio >= 0.75 ? 'teal' : ratio >= 0.6 ? 'gold' : 'accent'}>{grade.label}</Pill>
                  </div>
                  <strong className="recent-score">
                    {attempt.totalScore}
                    <em>/ {attempt.maxScore}</em>
                  </strong>
                  <div className="recent-meta">
                    <span>{formatDate(attempt.submittedAt)}</span>
                    <span>{formatDuration(attempt.durationUsedSec)}</span>
                  </div>
                  <div className="recent-foot">
                    <span>查看成绩单</span>
                    <ArrowRight size={15} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="container method-section">
        <div className="section-heading">
          <span className="kicker">HOW IT WORKS</span>
          <h2>练习不是做完就对答案</h2>
        </div>
        <div className="method-grid">
          <div className="method-card">
            <span className="method-num">01</span>
            <h3>随机组卷</h3>
            <p>按题型从题库抽题，避开最近做过的内容，选项顺序也重新洗牌。每一次都是新卷。</p>
          </div>
          <div className="method-card">
            <span className="method-num">02</span>
            <h3>限时作答</h3>
            <p>按真实考试节奏计时，自动保存进度。提前适应时间压力，比无限时刷题更接近实战。</p>
          </div>
          <div className="method-card">
            <span className="method-num">03</span>
            <h3>批改与路径</h3>
            <p>客观题逐题判分，主观题按要点初评；成绩单定位薄弱考点，并给出下一步练什么、怎么练。</p>
          </div>
        </div>
      </section>

      <section className="container closing-section">
        <div className="closing-card">
          <div>
            <span className="kicker">READY WHEN YOU ARE</span>
            <h2>下一套卷子，已经准备好了。</h2>
            <p>不需要注册，不需要等待。生成试卷，计时开始。</p>
          </div>
          <button type="button" className="btn btn-light btn-lg" onClick={start}>
            开始模拟考试 <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

function sectionCount(id: SectionId): string {
  const map: Record<SectionId, string> = {
    listening: '16 题',
    grammar: '10 题',
    vocabulary: '10 题',
    cloze: '15 题',
    reading: '20 题',
    translation: '5 句',
    summary: '1 篇',
    writing: '1 篇',
  };
  return map[id] ?? '—';
}

