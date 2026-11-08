import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Play, Stop, X } from '../components/Icons';
import { ProgressBar } from '../components/ui';
import { SECTION_MAP } from '../sections';
import { paperSourceIds } from '../lib/exam';
import { formatClock, formatDate, percent } from '../lib/format';
import { formatScore } from '../lib/scoring';
import { speakScript, speechSupported, stopSpeaking, type SpeechHandle } from '../lib/speech';
import { loadSettings, markSeen } from '../lib/storage';
import {
  DRILL_SECTION_INFO,
  buildDrillPaper,
  buildDrillRecord,
  groupWrongTags,
  judgeAnswer,
  loadDrillRecords,
  saveDrillRecord,
  type DrillFeedback,
  type DrillRecord,
  type DrillSectionInfo,
} from '../lib/drill';
import type { ExamQuestion, Paper, QuestionContext, SectionId } from '../types';

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function DrillPage() {
  const [records, setRecords] = useState<DrillRecord[]>(() => loadDrillRecords());
  const [paper, setPaper] = useState<Paper | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, DrillFeedback>>({});
  const [record, setRecord] = useState<DrillRecord | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [questionStart, setQuestionStart] = useState(0);
  const [questionElapsed, setQuestionElapsed] = useState<Record<string, number>>({});
  const [playing, setPlaying] = useState<{ groupId: string; handle: SpeechHandle } | null>(null);
  const [audioError, setAudioError] = useState(false);
  const [transcriptReveals, setTranscriptReveals] = useState<string[]>([]);
  const [replayCounts, setReplayCounts] = useState<Record<string, number>>({});
  const [saveFailed, setSaveFailed] = useState(false);
  const savedRef = useRef(false);
  const settings = useMemo(() => loadSettings(), []);

  // The drill has no countdown: the clock is informational, and the record stores the total.
  useEffect(() => {
    if (!paper || record) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [paper, record]);

  useEffect(() => () => stopSpeaking(), []);

  const stopAudio = useCallback(() => {
    setPlaying((current) => {
      current?.handle.stop();
      return null;
    });
  }, []);

  const start = useCallback(
    (section: SectionId) => {
      stopAudio();
      stopSpeaking();
      const next = buildDrillPaper(section);
      const stamp = Date.now();
      savedRef.current = false;
      setPaper(next);
      setIndex(0);
      setAnswers({});
      setFeedback({});
      setRecord(null);
      setStartedAt(stamp);
      setNow(stamp);
      setQuestionStart(stamp);
      setQuestionElapsed({});
      setTranscriptReveals([]);
      setReplayCounts({});
      setAudioError(false);
      setSaveFailed(false);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    },
    [stopAudio],
  );

  const leave = () => {
    stopAudio();
    stopSpeaking();
    savedRef.current = false;
    setPaper(null);
    setRecord(null);
    setFeedback({});
    setAnswers({});
    setRecords(loadDrillRecords());
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const current = paper && !record ? paper.questions[index] : undefined;
  const revealed = current ? feedback[current.id] : undefined;
  const total = paper?.questions.length ?? 0;
  const elapsedSec = startedAt ? Math.max(0, Math.round((now - startedAt) / 1000)) : 0;

  const answer = (question: ExamQuestion, value: string) => {
    if (feedback[question.id]) return; // locked once revealed
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const reveal = () => {
    if (!paper || !current) return;
    const raw = answers[current.id] ?? '';
    if (!raw.trim() || feedback[current.id]) return;
    const judged = judgeAnswer(paper, current, raw);
    setFeedback((prev) => ({ ...prev, [current.id]: judged }));
    setQuestionElapsed((prev) => ({
      ...prev,
      [current.id]: Math.max(0, Math.round((Date.now() - questionStart) / 1000)),
    }));
  };

  const finish = useCallback(() => {
    if (!paper || savedRef.current) return;
    savedRef.current = true;
    const verdicts = Object.fromEntries(
      Object.entries(feedback).map(([id, item]) => [
        id,
        { correct: item.correct, earned: item.earned, points: item.points },
      ]),
    );
    const built = buildDrillRecord({
      section: paper.sectionFilter ?? paper.sections[0].id,
      questions: paper.questions,
      verdicts,
      elapsedSec: Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
    });
    setSaveFailed(!saveDrillRecord(built));
    // Only a finished set marks its own items as seen; nothing is written before that.
    markSeen(paperSourceIds(paper));
    setRecord(built);
    setRecords(loadDrillRecords());
    stopAudio();
    stopSpeaking();
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [feedback, paper, startedAt, stopAudio]);

  const advance = () => {
    if (!paper) return;
    if (index < paper.questions.length - 1) {
      setIndex(index + 1);
      setQuestionStart(Date.now());
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    finish();
  };

  const toggleAudio = (context: QuestionContext) => {
    const groupId = current?.groupId ?? '';
    if (playing?.groupId === groupId) {
      stopAudio();
      return;
    }
    stopAudio();
    if (!speechSupported()) {
      setAudioError(true);
      return;
    }
    const handle = speakScript(context.audioScript ?? '', {
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
    setReplayCounts((prev) => ({ ...prev, [groupId]: (prev[groupId] ?? 0) + 1 }));
    setPlaying({ groupId, handle });
  };

  const revealTranscript = (groupId: string) => {
    if (!window.confirm('显示听力原文会明显降低练习效果，确定查看？')) return;
    setTranscriptReveals((prev) => [...new Set([...prev, groupId])]);
  };

  if (!paper) {
    return (
      <div className="container drill-page">
        <header className="drill-hero">
          <div>
            <span className="kicker">SINGLE SECTION · 单项测试</span>
            <h1>单项测试</h1>
            <p>
              一题一屏，做完立刻对答案。先自己作答，再点「查看答案」，看判定、正确答案、解析和按考点的指导意见。
              每一题对完答案就锁定，不能改答。
            </p>
          </div>
        </header>

        <div className="drill-grid">
          {DRILL_SECTION_INFO.map((info) => (
            <DrillCard key={info.id} info={info} onStart={() => start(info.id)} />
          ))}
        </div>

        <p className="drill-excluded">
          翻译、概要写作、指导性写作没有唯一答案，不做逐题判定：请到首页「专项训练」整块作答，再看参考译文与估分。
        </p>

        {records.length > 0 ? (
          <section className="drill-recent" aria-label="最近练习">
            <div className="drill-recent-head">
              <h2>最近练习</h2>
              <span>只记录板块、正确率与用时，不计入成绩记录与评级</span>
            </div>
            <ul>
              {records.slice(0, 5).map((item) => (
                <li key={item.id} className="drill-recent-row">
                  <strong>{SECTION_MAP[item.section]?.name ?? item.section}</strong>
                  <span>
                    {item.correct}/{item.questions} 题 · {formatScore(item.earned)}/{item.points} 分
                  </span>
                  <span>{percent(item.points > 0 ? item.earned / item.points : 0)}</span>
                  <time>{formatDate(item.at)}</time>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    );
  }

  if (record) {
    const accuracy = record.points > 0 ? record.earned / record.points : 0;
    const wrong = groupWrongTags(record.wrongTags);
    return (
      <div className="container drill-page">
        <header className="drill-summary-head">
          <span className="kicker">SECTION SUMMARY · 单项测试</span>
          <h1>本节小结</h1>
          <p>
            {SECTION_MAP[record.section]?.name ?? record.section} · 共 {record.questions} 题 · 用时{' '}
            {formatClock(record.elapsedSec)}
          </p>
        </header>

        {saveFailed ? (
          <div className="storage-warning" role="alert">
            练习记录保存失败：浏览器存储已满或不可用。本次成绩仍显示在下方，但不会出现在「最近练习」。
          </div>
        ) : null}

        <section className="drill-summary" aria-label="本节成绩">
          <div className="drill-summary-stat">
            <span>正确率</span>
            <strong>{percent(accuracy)}</strong>
            <small>
              答对 {record.correct}/{record.questions} 题 · {formatScore(record.earned)}/{record.points} 分
            </small>
          </div>
          <div className="drill-summary-stat">
            <span>用时</span>
            <strong>{formatClock(record.elapsedSec)}</strong>
            <small>从开始本节到点「完成本节」的总时长</small>
          </div>
          <div className="drill-summary-stat">
            <span>错题考点</span>
            <strong>{wrong.reduce((sum, item) => sum + item.count, 0)}</strong>
            <small>{wrong.length ? `${wrong.length} 个考点` : '本轮没有错题'}</small>
          </div>
        </section>

        <section className="drill-wrong" aria-label="错题考点汇总">
          <h2>错题考点汇总</h2>
          {wrong.length ? (
            <ul>
              {wrong.map((item) => (
                <li key={item.tag}>
                  <span className="drill-tag">{item.tag}</span>
                  <span>错 {item.count} 次</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>本轮全部答对，可以直接换一个板块，或把难度调高再来一组。</p>
          )}
        </section>

        <div className="drill-summary-actions">
          <button type="button" className="btn btn-primary" onClick={() => start(record.section)}>
            再来一组 <ArrowRight size={17} />
          </button>
          <button type="button" className="btn btn-ghost" onClick={leave}>
            换板块
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container page-empty">
        <span className="kicker">DRILL NOT FOUND</span>
        <h1>这组练习已经不在了</h1>
        <p>页面可能被刷新过。回到单项测试重新选一个板块即可。</p>
        <Link to="/drill" className="btn btn-primary" onClick={leave}>
          返回单项测试 <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  const context = paper.contexts[current.groupId];
  const wordBank = current.section === 'vocabulary' ? paper.wordBanks[current.groupId] ?? [] : [];
  const groupSize = wordBank.length
    ? paper.questions.filter((q) => q.groupId === current.groupId).length
    : 0;
  const usedWords = wordBank.length
    ? Object.entries(answers)
        .filter(([, value]) => value.trim())
        .map(([, value]) => value.toLowerCase())
    : [];
  const isListening = current.section === 'listening';
  const isPassage = current.section === 'cloze' || current.section === 'reading';
  const answered = Boolean((answers[current.id] ?? '').trim());
  const locked = Boolean(revealed);

  return (
    <div className="container drill-page">
      <header className="drill-head">
        <div className="drill-head-main">
          <button type="button" className="back-button" onClick={leave}>
            <ArrowLeft size={17} /> 离开本节
          </button>
          <div>
            <span className="kicker">单项测试 · {SECTION_MAP[current.section].en}</span>
            <h1>{SECTION_MAP[current.section].name}</h1>
            <p>
              第 {index + 1} / {total} 题 · 本题 {current.points} 分 · 一题一屏，答完再看答案
            </p>
          </div>
        </div>
        <div className="drill-head-side">
          <div className="drill-timer">
            <Clock size={17} />
            <strong>{formatClock(elapsedSec)}</strong>
            <span>已用</span>
          </div>
          <div className="drill-progress">
            <ProgressBar value={index + (locked ? 1 : 0)} max={total} tone="ok" />
            <span>
              已答 {Object.keys(feedback).length}/{total}
            </span>
          </div>
        </div>
      </header>

      {isListening && context ? (
        <div className="drill-context">
          <AudioCard
            context={context}
            isPlaying={playing?.groupId === current.groupId}
            playCount={replayCounts[current.groupId] ?? 0}
            revealed={transcriptReveals.includes(current.groupId)}
            unsupported={audioError || !speechSupported()}
            onToggle={() => toggleAudio(context)}
            onReveal={() => revealTranscript(current.groupId)}
            rate={settings.speechRate}
          />
        </div>
      ) : null}

      {isPassage && context ? (
        <div className="drill-context">
          <PassageCard context={context} cloze={current.section === 'cloze'} />
        </div>
      ) : null}

      {wordBank.length > 0 ? (
        <div className="drill-context">
          <div className="vocab-bank-card">
            <div className="vocab-bank-head">
              <span className="kicker">WORD BANK</span>
              <span>
                {wordBank.length} 选 {groupSize} · 整组共用同一个方框
                {wordBank.length > groupSize
                  ? ` · 有 ${wordBank.length - groupSize} 个多余单词`
                  : ''}
              </span>
            </div>
            <div className="vocab-bank">
              {wordBank.map((word) => (
                <span
                  key={word}
                  className={usedWords.includes(word.toLowerCase()) ? 'vocab-word used' : 'vocab-word'}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <article className="question-card drill-question">
        <div className="question-head">
          <div className="question-number">{index + 1}</div>
          {current.review ? (
            <span className="mini-tag review-tag" title="该板块未做过的内容已用完，本轮为复习题">
              本轮为复习题
            </span>
          ) : null}
          <div className="question-stem">
            {current.type === 'vocab' ? (
              <VocabSentence
                q={current}
                number={index + 1}
                value={answers[current.id] ?? ''}
                wordBank={wordBank}
                usedWords={usedWords}
                locked={locked}
                onChange={(value) => answer(current, value)}
              />
            ) : (
              <p>{current.stem}</p>
            )}
          </div>
        </div>

        {current.type === 'mcq' ? (
          <div className="options">
            {(current.options ?? []).map((option, optionIndex) => {
              const selected = (answers[current.id] ?? '') === String(optionIndex);
              const isKey = locked && current.answer === optionIndex;
              const classes = ['option'];
              if (selected) classes.push('selected');
              if (isKey) classes.push('correct');
              if (locked && selected && current.answer !== optionIndex) classes.push('wrong');
              return (
                <label key={option} className={classes.join(' ')}>
                  <input
                    type="radio"
                    name={`drill-${current.id}`}
                    value={optionIndex}
                    checked={selected}
                    disabled={locked}
                    onChange={() => answer(current, String(optionIndex))}
                  />
                  <span className="option-letter">{optionLetters[optionIndex]}</span>
                  <span className="option-text">{option}</span>
                </label>
              );
            })}
          </div>
        ) : null}

        {current.type === 'fill' ? (
          <div className="fill-row">
            <label htmlFor={`drill-fill-${current.id}`}>你的答案</label>
            <input
              id={`drill-fill-${current.id}`}
              className="text-input"
              value={answers[current.id] ?? ''}
              onChange={(event) => answer(current, event.target.value)}
              placeholder="填入单词的正确形式"
              autoComplete="off"
              spellCheck={false}
              readOnly={locked}
            />
          </div>
        ) : null}
      </article>

      <div className="drill-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={reveal}
          disabled={!answered || locked}
        >
          {locked ? '已查看答案' : '查看答案'}
        </button>
        {locked ? (
          <button type="button" className="btn btn-ghost" onClick={advance}>
            {index < total - 1 ? '下一题' : '完成本节'}
            <ArrowRight size={17} />
          </button>
        ) : (
          <span className="drill-hint">
            {answered ? '先自己确认一遍，再查看答案；查看后本题锁定。' : '先在本题作答，「查看答案」才会可用。'}
          </span>
        )}
      </div>

      {revealed ? (
        <RevealCard
          feedback={revealed}
          elapsed={questionElapsed[current.id] ?? 0}
        />
      ) : null}
    </div>
  );
}

function DrillCard({ info, onStart }: { info: DrillSectionInfo; onStart: () => void }) {
  return (
    <article className="drill-card">
      <span className="kicker">{info.en}</span>
      <h2>{info.name}</h2>
      <p>{info.blurb}</p>
      <div className="drill-card-facts">
        <span>{info.questions} 题</span>
        <span>{info.points} 分</span>
        <span>建议 {info.minutes} 分钟</span>
      </div>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={onStart}
        aria-label={`开始${info.name}单项测试`}
      >
        开始练习 <ArrowRight size={16} />
      </button>
    </article>
  );
}

function RevealCard({ feedback, elapsed }: { feedback: DrillFeedback; elapsed: number }) {
  return (
    <section
      className={feedback.correct ? 'drill-feedback ok' : 'drill-feedback bad'}
      aria-label="本题答案与指导"
    >
      <div className="drill-verdict">
        <span className={feedback.correct ? 'drill-badge ok' : 'drill-badge bad'}>
          {feedback.correct ? <Check size={16} /> : <X size={16} />}
          {feedback.correct ? '答对了' : '答错了'}
        </span>
        <span className="drill-verdict-meta">
          {formatScore(feedback.earned)}/{feedback.points} 分 · 本题用时 {formatClock(elapsed)}
        </span>
      </div>

      <dl className="drill-answer">
        <div>
          <dt>正确答案</dt>
          <dd>{feedback.answerText || '—'}</dd>
        </div>
        <div>
          <dt>你的答案</dt>
          <dd>{feedback.userText || '未作答'}</dd>
        </div>
      </dl>

      <div className="drill-explain">
        <span className="kicker">解析</span>
        <p>{feedback.explanation}</p>
      </div>

      <div className="drill-advice">
        <span className="kicker">指导意见</span>
        <h3>{feedback.guidance.title}</h3>
        <p>{feedback.guidance.detail}</p>
        <p className="drill-advice-action">
          <strong>下一步</strong>
          {feedback.guidance.action}
        </p>
        {feedback.guidance.source !== 'tag' ? (
          <span className="drill-advice-note">
            该考点暂无专属条目，这里显示{feedback.guidance.source === 'section' ? '板块' : '通用'}建议；
            考点：{feedback.guidance.tags.join(' · ') || '未标注'}。
          </span>
        ) : null}
      </div>
    </section>
  );
}

function VocabSentence({
  q,
  number,
  value,
  wordBank,
  usedWords,
  locked,
  onChange,
}: {
  q: ExamQuestion;
  number: number;
  value: string;
  wordBank: string[];
  usedWords: string[];
  locked: boolean;
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
        disabled={locked}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`第 ${number} 题选词`}
      >
        <option value="">选择单词</option>
        {wordBank.map((word) => {
          const isUsedElsewhere =
            usedWords.includes(word.toLowerCase()) && value.toLowerCase() !== word.toLowerCase();
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
      {revealed && context.audioScript ? <pre className="audio-script">{context.audioScript}</pre> : null}
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
