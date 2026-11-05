import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X } from '../components/Icons';
import { EmptyState } from '../components/ui';
import { formatDate } from '../lib/format';
import { attemptScoreSplit, isEstimatedResult } from '../lib/scoring';
import { isReviewWrong, reviewBadge } from '../lib/review';
import { getAttempt } from '../lib/storage';
import type { Attempt, ExamQuestion, QuestionResult, SectionId } from '../types';

type Filter = 'all' | 'wrong' | 'blank';

const sectionNames: Record<SectionId, string> = {
  listening: '听力理解',
  grammar: '语法与词汇',
  vocabulary: '选词填空',
  cloze: '完形填空',
  reading: '阅读理解',
  translation: '翻译',
  summary: '概要写作',
  writing: '指导性写作',
};

export default function ReviewPage() {
  const { attemptId } = useParams();
  const [attempt] = useState<Attempt | undefined>(() => (attemptId ? getAttempt(attemptId) : undefined));
  const [filter, setFilter] = useState<Filter>('all');
  const [section, setSection] = useState<'all' | SectionId>('all');

  const filtered = useMemo(() => {
    if (!attempt) return [];
    return attempt.results.filter((result) => {
      const answered = Boolean((attempt.answers[result.id] ?? '').trim());
      if (filter === 'wrong' && !isReviewWrong(result)) return false;
      if (filter === 'blank' && answered) return false;
      if (section !== 'all' && result.section !== section) return false;
      return true;
    });
  }, [attempt, filter, section]);

  if (!attempt) {
    return (
      <div className="container page-empty">
        <EmptyState
          eyebrow="REVIEW NOT FOUND"
          title="找不到这份复盘记录"
          description="成绩记录保存在当前浏览器中。返回成绩记录页看看是否还在。"
          to="/history"
          action="查看成绩记录"
        />
      </div>
    );
  }

  const split = attemptScoreSplit(attempt);
  const wrongCount = attempt.results.filter((r) => isReviewWrong(r)).length;
  const blankCount = attempt.results.filter((r) => !(attempt.answers[r.id] ?? '').trim()).length;

  return (
    <div className="container review-page">
      <div className="result-toolbar">
        <Link to={`/result/${attempt.id}`} className="back-link">
          <ArrowLeft size={16} /> 返回成绩单
        </Link>
        <div className="toolbar-actions">
          <Link to="/" className="btn btn-ghost btn-sm">
            再练一套 <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <header className="review-hero">
        <div>
          <span className="kicker">QUESTION REVIEW</span>
          <h1>逐题复盘</h1>
          <p>
            {attempt.paper.title} · {formatDate(attempt.submittedAt)} · 客观题 {split.objectiveScore}/{split.objectiveMax}
            {split.subjectiveMax > 0
              ? ` · 主观题估分 ${split.subjectiveEstimate}/${split.subjectiveMax}（不参与评级）`
              : ''}
          </p>
        </div>
        <Link to={`/result/${attempt.id}`} className="btn btn-ghost btn-sm no-print">
          成绩单
        </Link>
      </header>

      <div className="review-filters">
        <div className="segmented" role="group" aria-label="筛选">
          <button type="button" className={filter === 'all' ? 'segment active' : 'segment'} onClick={() => setFilter('all')}>
            全部 {attempt.results.length}
          </button>
          <button type="button" className={filter === 'wrong' ? 'segment active' : 'segment'} onClick={() => setFilter('wrong')}>
            待订正 {wrongCount}
          </button>
          <button type="button" className={filter === 'blank' ? 'segment active' : 'segment'} onClick={() => setFilter('blank')}>
            未作答 {blankCount}
          </button>
        </div>
        <select
          className="select"
          value={section}
          onChange={(event) => setSection(event.target.value as 'all' | SectionId)}
          aria-label="按板块筛选"
        >
          <option value="all">全部板块</option>
          {attempt.paper.sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="review-empty">
          <p>当前筛选下没有题目。换一个筛选条件，或返回成绩单。</p>
        </div>
      ) : (
        <div className="review-list">
          {filtered.map((result) => {
            const question = attempt.paper.questions.find((q) => q.id === result.id);
            if (!question) return null;
            return (
              <ReviewItem
                key={result.id}
                result={result}
                question={question}
                attempt={attempt}
                sectionName={sectionNames[result.section]}
              />
            );
          })}
        </div>
      )}

      <div className="review-footer no-print">
        <Link to={`/result/${attempt.id}`} className="btn btn-ghost">
          <ArrowLeft size={16} /> 返回成绩单
        </Link>
        <Link to="/" className="btn btn-primary">
          开始下一套 <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function ReviewItem({
  result,
  question,
  attempt,
  sectionName,
}: {
  result: QuestionResult;
  question: ExamQuestion;
  attempt: Attempt;
  sectionName: string;
}) {
  const context = attempt.paper.contexts[question.groupId];
  const answered = Boolean((attempt.answers[result.id] ?? '').trim());
  const badge = reviewBadge(result, answered);
  const estimated = isEstimatedResult(result);

  return (
    <article className={`review-item status-${badge.status}`} id={`review-${result.id}`}>
      <div className="review-head">
        <div className="review-number">{result.number}</div>
        <div className="review-title">
          <span className="review-section">{sectionName}</span>
          <div className="review-tags">
            {question.review ? <span className="mini-tag">本轮为复习题</span> : null}
            {result.tags.slice(0, 4).map((tag) => (
              <span className="mini-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="review-status">
          <span className={`status-badge ${badge.status}`}>
            {badge.icon === 'check' ? <Check size={14} /> : badge.icon === 'cross' ? <X size={14} /> : null}
            {badge.label}
          </span>
          <span className="review-points">
            {estimated ? `估分 ${result.earned}/${result.points}` : `${result.earned}/${result.points} 分`}
          </span>
          {estimated && result.lowConfidence ? (
            <span className="review-cap-note">低置信度：估分再按 50% 封顶</span>
          ) : null}
        </div>
      </div>

      {context ? (
        <details className="review-context">
          <summary>
            {question.section === 'listening' ? '查看听力原文' : '查看原文'} · {context.title ?? '材料'}
          </summary>
          {context.audioScript ? <pre className="audio-script">{context.audioScript}</pre> : null}
          {context.text ? (
            <p className="passage-text">
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
          ) : null}
        </details>
      ) : null}

      <div className="review-body">
        {question.type === 'mcq' ? (
          <>
            <p className="review-stem">{question.stem}</p>
            <div className="review-options">
              {(question.options ?? []).map((option, index) => {
                const isCorrect = index === result.answer;
                const isChosen = index === result.selected;
                return (
                  <div
                    key={option}
                    className={[
                      'review-option',
                      isCorrect ? 'is-correct' : '',
                      isChosen && !isCorrect ? 'is-wrong' : '',
                      isChosen ? 'is-chosen' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                    {isCorrect ? <em>正确答案</em> : isChosen ? <em>你的选择</em> : null}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        {question.type === 'fill' || question.type === 'vocab' ? (
          <>
            <p className="review-stem">{question.stem.replace('______', '________')}</p>
            <div className="answer-compare">
              <div className={result.correct ? 'compare-box correct' : 'compare-box wrong'}>
                <span>你的答案</span>
                <strong>{result.userText?.trim() || '未作答'}</strong>
              </div>
              <div className="compare-box correct">
                <span>正确答案</span>
                <strong>{result.answerText}</strong>
              </div>
            </div>
          </>
        ) : null}

        {question.type === 'translation' ? (
          <>
            <p className="review-stem translation-prompt">{question.stem}</p>
            <div className="subjective-compare">
              <div>
                <span className="compare-label">你的翻译</span>
                <pre className="user-text">{result.userText?.trim() || '未作答'}</pre>
              </div>
              <div>
                <span className="compare-label">参考译文</span>
                <pre className="reference-text">{result.answerText}</pre>
              </div>
            </div>
          </>
        ) : null}

        {question.type === 'summary' || question.type === 'writing' ? (
          <>
            <p className="review-stem">{question.stem}</p>
            {question.requirements ? (
              <ul className="task-requirements">
                {question.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            <div className="subjective-compare long">
              <div>
                <span className="compare-label">你的作答（{countWords(result.userText ?? '')} 词）</span>
                <pre className="user-text">{result.userText?.trim() || '未作答'}</pre>
              </div>
              <div>
                <span className="compare-label">参考范文</span>
                <pre className="reference-text">{result.answerText}</pre>
              </div>
            </div>
          </>
        ) : null}

        {result.covered && result.covered.length > 0 ? (
          <div className="coverage">
            <span className="coverage-label">关键信息覆盖（估分依据）</span>
            <div className="coverage-list">
              {result.covered.map((point) => (
                <span key={point.label} className={point.ok ? 'coverage-chip ok' : 'coverage-chip missing'}>
                  {estimated ? (point.ok ? '已覆盖' : '待补') : point.ok ? <Check size={13} /> : <X size={13} />}
                  {point.label}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {result.feedback ? <p className="auto-feedback">{result.feedback}</p> : null}

        {question.explanation ? (
          <div className="explanation">
            <span>解析</span>
            <p>{question.explanation}</p>
          </div>
        ) : null}


        {question.tips && question.tips.length > 0 ? (
          <details className="tips-box">
            <summary>这道题的写作提示</summary>
            <ul>
              {question.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    </article>
  );
}

function countWords(text: string): number {
  const matches = text.trim().match(/[A-Za-z0-9][A-Za-z0-9'’\-]*/g);
  return matches ? matches.length : 0;
}
