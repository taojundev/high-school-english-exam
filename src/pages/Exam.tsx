import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Flag, Play, Stop } from '../components/Icons';
import { Modal, ProgressBar } from '../components/ui';
import { groupQuestions, paperSourceIds } from '../lib/exam';
import { countWords } from '../lib/scoring';
import { formatClock, formatDuration } from '../lib/format';
import { speakScript, speechSupported, stopSpeaking, type SpeechHandle } from '../lib/speech';
import { clearActive, loadActive, loadSettings, markSeen, saveActive, saveAttempt } from '../lib/storage';
import { scoreAttempt } from '../lib/scoring';
import type {
  ActiveDraft,
  ExamQuestion,
  QuestionContext,
  SectionId,
} from '../types';

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function ExamPage() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ActiveDraft | null>(() => {
    const current = loadActive();
    return current && current.paper.id === paperId
      ? { ...current, sectionEnteredAt: Date.now() }
      : null;
  });
  const [now, setNow] = useState(() => Date.now());
  const [showSubmit, setShowSubmit] = useState(false);
  const [playing, setPlaying] = useState<{ groupId: string; handle: SpeechHandle } | null>(null);
  const [audioError, setAudioError] = useState(false);
  const submittedRef = useRef(false);
  const settings = useMemo(() => loadSettings(), []);

  useEffect(() => {
    if (!draft) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [draft]);

  const draftRef = useRef<ActiveDraft | null>(draft);
  draftRef.current = draft;

  useEffect(() => {
    if (!draft) return;
    const timer = window.setTimeout(() => {
      if (!submittedRef.current) saveActive(draft);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [draft]);

  useEffect(() => {
    const flush = () => {
      if (draftRef.current && !submittedRef.current) saveActive(draftRef.current);
    };
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const finish = useCallback(() => {
    if (!draft || submittedRef.current) return;
    submittedRef.current = true;
    stopSpeaking();
    setPlaying(null);
    const nowMs = Date.now();
    const elapsed = Math.max(0, Math.round((nowMs - draft.sectionEnteredAt) / 1000));
    const timeBySection = {
      ...draft.timeBySection,
      [draft.currentSection]: (draft.timeBySection[draft.currentSection] ?? 0) + elapsed,
    };
    const attempt = scoreAttempt(draft.paper, draft.answers, {
      startedAt: draft.startedAt,
      submittedAt: new Date().toISOString(),
      durationUsedSec: Math.max(0, Math.round((nowMs - new Date(draft.startedAt).getTime()) / 1000)),
      timeBySection,
      transcriptReveals: draft.transcriptReveals,
      replayCounts: draft.replayCounts,
    });
    saveAttempt(attempt);
    markSeen(paperSourceIds(draft.paper));
    clearActive();
    navigate(`/result/${attempt.id}`, { replace: true });
  }, [draft, navigate]);

  const deadline = draft ? new Date(draft.startedAt).getTime() + draft.paper.durationMin * 60_000 : 0;
  const remaining = draft ? Math.max(0, Math.floor((deadline - now) / 1000)) : 0;
  const urgent = remaining <= 300;
  const critical = remaining <= 60;

  useEffect(() => {
    if (!draft || submittedRef.current) return;
    if (remaining <= 0) {
      setShowSubmit(false);
      finish();
    }
  }, [remaining, draft, finish]);

  if (!draft) {
    return (
      <div className="container page-empty">
        <span className="kicker">PAPER NOT FOUND</span>
        <h1>这场考试不在当前进度中</h1>
        <p>可能已经交卷，或试卷已被新的练习替换。你可以回到首页继续，或查看历史成绩。</p>
        <div className="hero-actions">
          <Link to="/" className="btn btn-primary">
            返回首页 <ArrowRight size={17} />
          </Link>
          <Link to="/history" className="btn btn-ghost">
            成绩记录
          </Link>
        </div>
      </div>
    );
  }

  const { paper } = draft;
  const currentSection = paper.sections.find((s) => s.id === draft.currentSection) ?? paper.sections[0];
  const sectionQuestions = paper.questions.filter((q) => currentSection.questionIds.includes(q.id));
  const groups = groupQuestions(sectionQuestions);
  const answeredCount = paper.questions.filter((q) => (draft.answers[q.id] ?? '').trim()).length;
  const unanswered = paper.questions.length - answeredCount;

  const update = (id: string, value: string) => {
    setDraft((prev) => (prev ? { ...prev, answers: { ...prev.answers, [id]: value } } : prev));
  };

  const toggleFlag = (id: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const flagged = prev.flagged.includes(id)
        ? prev.flagged.filter((x) => x !== id)
        : [...prev.flagged, id];
      return { ...prev, flagged };
    });
  };

  const revealTranscript = (groupId: string) => {
    if (!window.confirm('显示听力原文会明显降低练习效果，确定查看？')) return;
    setDraft((prev) =>
      prev
        ? { ...prev, transcriptReveals: [...new Set([...prev.transcriptReveals, groupId])] }
        : prev,
    );
  };

  const notePlayed = (groupId: string) => {
    setDraft((prev) =>
      prev
        ? { ...prev, replayCounts: { ...prev.replayCounts, [groupId]: (prev.replayCounts[groupId] ?? 0) + 1 } }
        : prev,
    );
  };

  const stopAudio = () => {
    playing?.handle.stop();
    setPlaying(null);
  };

  const goSection = (id: SectionId) => {
    stopAudio();
    setDraft((prev) => {
      if (!prev || prev.currentSection === id) return prev;
      const nowMs = Date.now();
      const elapsed = Math.max(0, Math.round((nowMs - prev.sectionEnteredAt) / 1000));
      return {
        ...prev,
        currentSection: id,
        sectionEnteredAt: nowMs,
        timeBySection: {
          ...prev.timeBySection,
          [prev.currentSection]: (prev.timeBySection[prev.currentSection] ?? 0) + elapsed,
        },
      };
    });
    setNow(Date.now());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpTo = (q: ExamQuestion) => {
    if (q.section !== draft.currentSection) goSection(q.section);
    window.setTimeout(() => {
      document.getElementById(`question-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  const toggleAudio = (groupId: string, script: string) => {
    if (playing?.groupId === groupId) {
      stopAudio();
      return;
    }
    stopAudio();
    if (!speechSupported()) {
      setAudioError(true);
      return;
    }
    const handle = speakScript(script, {
      rate: settings.speechRate,
      onEnd: () => setPlaying(null),
      onError: () => {
        setPlaying(null);
        setAudioError(true);
      },
    });
    if (!handle) {
      setAudioError(true);
      return;
    }
    notePlayed(groupId);
    setPlaying({ groupId, handle });
  };

  const leave = () => {
    stopAudio();
    saveActive(draft);
    navigate('/');
  };

  const sectionIndex = paper.sections.findIndex((s) => s.id === currentSection.id);

  return (
    <div className="exam-page">
      <div className="exam-top">
        <div className="container exam-top-inner">
          <div className="exam-top-left">
            <button type="button" className="back-button" onClick={leave}>
              <ArrowLeft size={17} /> 保存并退出
            </button>
            <div className="exam-title">
              <h1>{paper.title}</h1>
              <p>
                {paper.mode === 'full' ? '全真模拟' : '专项训练'} · 种子 {paper.seed} · {paper.questions.length} 题 ·{' '}
                {paper.maxScore} 分
              </p>
            </div>
          </div>
          <div className="exam-top-right">
            <div className={critical ? 'timer critical' : urgent ? 'timer urgent' : 'timer'}>
              <Clock size={18} />
              <strong>{formatClock(remaining)}</strong>
              <span>剩余</span>
            </div>
            <div className="exam-progress">
              <span>
                已答 {answeredCount}/{paper.questions.length}
              </span>
              <ProgressBar value={answeredCount} max={paper.questions.length} tone="ok" />
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setShowSubmit(true)}>
              交卷
            </button>
          </div>
        </div>
      </div>

      <div className="container exam-layout">
        <nav className="exam-rail" aria-label="试卷结构">
          <span className="rail-label">试卷结构</span>
          {paper.sections.map((section) => {
            const own = paper.questions.filter((q) => section.questionIds.includes(q.id));
            const done = own.filter((q) => (draft.answers[q.id] ?? '').trim()).length;
            return (
              <button
                type="button"
                key={section.id}
                className={section.id === currentSection.id ? 'rail-item active' : 'rail-item'}
                onClick={() => goSection(section.id)}
              >
                <span className="rail-name">{section.name}</span>
                <span className="rail-meta">
                  {done}/{own.length} · {section.points} 分
                </span>
                <span className="rail-bar">
                  <span style={{ width: `${own.length ? (done / own.length) * 100 : 0}%` }} />
                </span>
              </button>
            );
          })}
          <div className="rail-tip">
            <Flag size={14} />
            点击题目右上角可标记，交卷前重点检查。
          </div>
        </nav>

        <div className="exam-main">
          <header className="exam-section-head">
            <div className="section-head-row">
              <div>
                <span className="kicker">
                  SECTION {String(sectionIndex + 1).padStart(2, '0')} / {String(paper.sections.length).padStart(2, '0')}
                </span>
                <h2>{currentSection.name}</h2>
                <span className="section-en">{currentSection.en}</span>
              </div>
              <div className="section-facts">
                <span>{currentSection.points} 分</span>
                <span>建议 {currentSection.minutes} 分钟</span>
                <span>
                  已答 {sectionQuestions.filter((q) => (draft.answers[q.id] ?? '').trim()).length}/{sectionQuestions.length}
                </span>
              </div>
            </div>
            <p className="section-instructions">{currentSection.instructions}</p>
            {currentSection.id === 'listening' ? (
              <p className="audio-hint">
                听力由浏览器语音合成播放，建议使用 Chrome / Edge 并佩戴耳机。重播次数会被记录；交卷前请勿查看原文。
              </p>
            ) : null}
          </header>

          {groups.map((group) => {
            const first = group[0];
            const context = paper.contexts[first.groupId];
            if (first.section === 'listening' && context) {
              return (
                <section className="question-group" key={first.groupId}>
                  <AudioCard
                    context={context}
                    isPlaying={playing?.groupId === first.groupId}
                    playCount={draft.replayCounts[first.groupId] ?? 0}
                    revealed={draft.transcriptReveals.includes(first.groupId)}
                    unsupported={audioError || !speechSupported()}
                    onToggle={() => toggleAudio(first.groupId, context.audioScript ?? '')}
                    onReveal={() => revealTranscript(first.groupId)}
                    rate={settings.speechRate}
                  />
                  {group.length > 1 ? <p className="group-label">听下面一段材料，回答第 {group[0].number}–{group[group.length - 1].number} 题。</p> : null}
                  {group.map((q) => (
                    <QuestionCard
                      key={q.id}
                      q={q}
                      value={draft.answers[q.id] ?? ''}
                      flagged={draft.flagged.includes(q.id)}
                      onChange={(value) => update(q.id, value)}
                      onFlag={() => toggleFlag(q.id)}
                    />
                  ))}
                </section>
              );
            }

            if (first.section === 'vocabulary') {
              const bank = paper.wordBanks[first.groupId] ?? [];
              const used = group
                .map((q) => draft.answers[q.id])
                .filter((v): v is string => Boolean(v && v.trim()))
                .map((v) => v.toLowerCase());
              return (
                <section className="question-group" key={first.groupId}>
                  <div className="vocab-bank-card">
                    <div className="vocab-bank-head">
                      <span className="kicker">WORD BANK</span>
                      <span>11 选 10 · 有一个多余单词</span>
                    </div>
                    <div className="vocab-bank">
                      {bank.map((word) => (
                        <span key={word} className={used.includes(word.toLowerCase()) ? 'vocab-word used' : 'vocab-word'}>
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                  {group.map((q) => (
                    <QuestionCard
                      key={q.id}
                      q={q}
                      value={draft.answers[q.id] ?? ''}
                      flagged={draft.flagged.includes(q.id)}
                      onChange={(value) => update(q.id, value)}
                      onFlag={() => toggleFlag(q.id)}
                      wordBank={bank}
                      usedWords={used}
                    />
                  ))}
                </section>
              );
            }

            if (context && (first.section === 'reading' || first.section === 'cloze' || first.section === 'summary')) {
              return (
                <section className="question-group" key={first.groupId}>
                  <PassageCard context={context} cloze={first.section === 'cloze'} />
                  {group.map((q) => (
                    <QuestionCard
                      key={q.id}
                      q={q}
                      value={draft.answers[q.id] ?? ''}
                      flagged={draft.flagged.includes(q.id)}
                      onChange={(value) => update(q.id, value)}
                      onFlag={() => toggleFlag(q.id)}
                    />
                  ))}
                </section>
              );
            }

            if (group.length > 1) {
              return (
                <section className="question-group" key={first.groupId}>
                  {group.map((q) => (
                    <QuestionCard
                      key={q.id}
                      q={q}
                      value={draft.answers[q.id] ?? ''}
                      flagged={draft.flagged.includes(q.id)}
                      onChange={(value) => update(q.id, value)}
                      onFlag={() => toggleFlag(q.id)}
                    />
                  ))}
                </section>
              );
            }

            return (
              <QuestionCard
                key={first.id}
                q={first}
                value={draft.answers[first.id] ?? ''}
                flagged={draft.flagged.includes(first.id)}
                onChange={(value) => update(first.id, value)}
                onFlag={() => toggleFlag(first.id)}
              />
            );
          })}

          <div className="exam-bottom-nav">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={sectionIndex === 0}
              onClick={() => goSection(paper.sections[sectionIndex - 1].id)}
            >
              <ArrowLeft size={17} /> 上一板块
            </button>
            <span>
              {currentSection.name} · 已答 {sectionQuestions.filter((q) => (draft.answers[q.id] ?? '').trim()).length}/
              {sectionQuestions.length}
            </span>
            {sectionIndex < paper.sections.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goSection(paper.sections[sectionIndex + 1].id)}
              >
                下一板块 <ArrowRight size={17} />
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => setShowSubmit(true)}>
                检查并交卷 <Check size={17} />
              </button>
            )}
          </div>
        </div>

        <aside className="answer-sheet" aria-label="答题卡">
          <div className="sheet-head">
            <strong>答题卡</strong>
            <span>
              {answeredCount}/{paper.questions.length}
            </span>
          </div>
          <div className="sheet-scroll">
            {paper.sections.map((section) => {
              const own = paper.questions.filter((q) => section.questionIds.includes(q.id));
              return (
                <div className="sheet-section" key={section.id}>
                  <div className="sheet-section-head">
                    <span>{section.name}</span>
                    <em>{own.filter((q) => (draft.answers[q.id] ?? '').trim()).length}/{own.length}</em>
                  </div>
                  <div className="sheet-grid">
                    {own.map((q) => {
                      const answered = Boolean((draft.answers[q.id] ?? '').trim());
                      const flagged = draft.flagged.includes(q.id);
                      return (
                        <button
                          type="button"
                          key={q.id}
                          className={[
                            'sheet-cell',
                            answered ? 'answered' : '',
                            flagged ? 'flagged' : '',
                            q.section === currentSection.id ? 'in-section' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => jumpTo(q)}
                          aria-label={`第 ${q.number} 题${answered ? '，已答' : '，未答'}${flagged ? '，已标记' : ''}`}
                        >
                          {q.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="sheet-legend">
            <span><i className="legend-dot answered" />已答</span>
            <span><i className="legend-dot flagged" />标记</span>
            <span><i className="legend-dot" />未答</span>
          </div>
          <div className="sheet-foot">
            <span>建议用时 {formatDuration(paper.durationMin * 60)}</span>
            <button type="button" className="text-link" onClick={() => setShowSubmit(true)}>
              交卷
            </button>
          </div>
        </aside>
      </div>

      <Modal
        open={showSubmit}
        title="确认交卷"
        onClose={() => setShowSubmit(false)}
        actions={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setShowSubmit(false)}>
              继续检查
            </button>
            <button type="button" className="btn btn-primary" onClick={finish}>
              确认交卷 <Check size={17} />
            </button>
          </>
        }
      >
        <div className="submit-summary">
          <div>
            <span>已作答</span>
            <strong>{answeredCount}</strong>
          </div>
          <div>
            <span>未作答</span>
            <strong className={unanswered > 0 ? 'warn-text' : ''}>{unanswered}</strong>
          </div>
          <div>
            <span>剩余时间</span>
            <strong>{formatClock(remaining)}</strong>
          </div>
        </div>
        <p className={unanswered > 0 ? 'submit-note warn-text' : 'submit-note'}>
          {unanswered > 0
            ? `还有 ${unanswered} 道题未作答，交卷后将无法修改。确定现在交卷吗？`
            : '所有题目都已作答。交卷后可查看成绩、逐题解析和提分建议。'}
        </p>
      </Modal>
    </div>
  );
}

function AudioCard({
  context,
  isPlaying,
  playCount,
  revealed,
  unsupported,
  onToggle,
  onReveal,
  rate,
}: {
  context: QuestionContext;
  isPlaying: boolean;
  playCount: number;
  revealed: boolean;
  unsupported: boolean;
  onToggle: () => void;
  onReveal: () => void;
  rate: number;
}) {
  return (
    <div className="audio-card">
      <div className="audio-main">
        <button
          type="button"
          className={isPlaying ? 'audio-play playing' : 'audio-play'}
          onClick={onToggle}
          aria-label={isPlaying ? '停止播放' : '播放录音'}
        >
          {isPlaying ? <Stop size={20} /> : <Play size={20} />}
        </button>
        <div className="audio-info">
          <strong>{context.title ?? '听力材料'}</strong>
          <span>
            {context.audioLabel ?? '录音'} · 语速 {rate.toFixed(2)}x · 已播放 {playCount} 次
          </span>
        </div>
        <div className={isPlaying ? 'waveform playing' : 'waveform'} aria-hidden="true">
          {[8, 16, 11, 22, 14, 26, 10, 18, 7, 20, 12, 24, 9, 15].map((h, i) => (
            <span key={i} style={{ height: `${h}px`, animationDelay: `${i * 70}ms` }} />
          ))}
        </div>
      </div>
      <div className="audio-foot">
        {unsupported ? (
          <span className="audio-warning">当前浏览器不支持语音合成，请使用 Chrome / Edge，或查看原文。</span>
        ) : (
          <span>正式考试只播放一遍；本工具允许重播，并记录次数。</span>
        )}
        {revealed ? null : (
          <button type="button" className="text-link" onClick={onReveal}>
            无法播放？显示原文
          </button>
        )}
      </div>
      {revealed && context.audioScript ? (
        <pre className="audio-script">{context.audioScript}</pre>
      ) : null}
    </div>
  );
}

function PassageCard({ context, cloze }: { context: QuestionContext; cloze?: boolean }) {
  return (
    <article className="passage-card">
      {context.title ? (
        <div className="passage-head">
          <span className="kicker">READING PASSAGE</span>
          <h3>{context.title}</h3>
        </div>
      ) : null}
      {cloze && context.text ? (
        <p className="passage-text cloze-text">
          {context.text.split(/(\(\d+\)\s*_{2,})/g).map((part, index) => {
            const match = part.match(/\((\d+)\)/);
            return match ? (
              <span className="cloze-number" key={`${part}-${index}`}>
                {match[1]}
              </span>
            ) : (
              <span key={index}>{part}</span>
            );
          })}
        </p>
      ) : (
        <p className="passage-text">{context.text}</p>
      )}
    </article>
  );
}

function QuestionCard({
  q,
  value,
  flagged,
  onChange,
  onFlag,
  wordBank,
  usedWords,
}: {
  q: ExamQuestion;
  value: string;
  flagged: boolean;
  onChange: (value: string) => void;
  onFlag: () => void;
  wordBank?: string[];
  usedWords?: string[];
}) {
  const isSubjective = q.type === 'translation' || q.type === 'summary' || q.type === 'writing';
  return (
    <article className={flagged ? 'question-card flagged' : 'question-card'} id={`question-${q.id}`}>
      <div className="question-head">
        <div className="question-number">{q.number}</div>
        <div className="question-stem">
          {q.type === 'translation' ? <p className="translation-prompt">{q.stem}</p> : null}
          {q.type === 'summary' || q.type === 'writing' ? (
            <>
              <p className="task-prompt">{q.stem}</p>
              {q.requirements ? (
                <ul className="task-requirements">
                  {q.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : null}
          {q.type === 'mcq' ? <p>{q.stem}</p> : null}
          {q.type === 'fill' ? <p>{q.stem}</p> : null}
          {q.type === 'vocab' ? <VocabSentence q={q} value={value} wordBank={wordBank ?? []} usedWords={usedWords ?? []} onChange={onChange} /> : null}
        </div>
        <button
          type="button"
          className={flagged ? 'flag-button active' : 'flag-button'}
          onClick={onFlag}
          aria-label={flagged ? '取消标记' : '标记此题'}
          title={flagged ? '取消标记' : '标记此题'}
        >
          <Flag size={17} />
        </button>
      </div>

      {q.type === 'mcq' ? (
        <div className="options">
          {(q.options ?? []).map((option, index) => (
            <label key={option} className={value === String(index) ? 'option selected' : 'option'}>
              <input
                type="radio"
                name={`q-${q.id}`}
                value={index}
                checked={value === String(index)}
                onChange={() => onChange(String(index))}
              />
              <span className="option-letter">{optionLetters[index]}</span>
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      ) : null}

      {q.type === 'fill' ? (
        <div className="fill-row">
          <label htmlFor={`fill-${q.id}`}>你的答案</label>
          <input
            id={`fill-${q.id}`}
            className="text-input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="填入单词的正确形式"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      ) : null}

      {isSubjective ? (
        <div className="writing-area">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={q.type === 'translation' ? 3 : q.type === 'summary' ? 6 : 12}
            placeholder={
              q.type === 'translation'
                ? '写下你的英文翻译……'
                : q.type === 'summary'
                  ? '用 60 词左右写出概要，不要照抄原文……'
                  : '先列提纲，再写正文……'
            }
            spellCheck={false}
          />
          <div className="writing-meta">
            <WordCounter text={value} min={q.minWords} max={q.maxWords} />
            <span>{q.points} 分</span>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function VocabSentence({
  q,
  value,
  wordBank,
  usedWords,
  onChange,
}: {
  q: ExamQuestion;
  value: string;
  wordBank: string[];
  usedWords: string[];
  onChange: (value: string) => void;
}) {
  const parts = q.stem.split('______');
  const before = parts[0] ?? '';
  const after = parts.slice(1).join('______');
  return (
    <p className="vocab-sentence">
      {before}
      <select
        className={value ? 'vocab-select filled' : 'vocab-select'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`第 ${q.number} 题选词`}
      >
        <option value="">选择单词</option>
        {wordBank.map((word) => {
          const isUsedElsewhere = usedWords.includes(word.toLowerCase()) && value.toLowerCase() !== word.toLowerCase();
          return (
            <option key={word} value={word} disabled={isUsedElsewhere}>
              {word}
              {isUsedElsewhere ? '（已用）' : ''}
            </option>
          );
        })}
      </select>
      {after}
    </p>
  );
}

export function WordCounter({ text, min, max }: { text: string; min?: number; max?: number }) {
  const words = countWords(text);
  const tooShort = min !== undefined && words < min;
  const tooLong = max !== undefined && words > max;
  return (
    <span className={tooShort || tooLong ? 'word-count warn-text' : 'word-count'}>
      {words} 词
      {min !== undefined && max !== undefined ? ` · 建议 ${min}–${max}` : ''}
      {tooShort ? ' · 偏少' : tooLong ? ' · 偏多' : ''}
    </span>
  );
}

