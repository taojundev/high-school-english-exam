import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Search } from '../components/Icons';
import { Pill } from '../components/ui';
import { BANK, BANK_STATS, bankTotals } from '../data';
import { SECTION_META } from '../sections';
import type { SectionId } from '../types';

const tabs: { id: SectionId; label: string; count: number }[] = [
  { id: 'listening', label: '听力', count: BANK.listeningShort.length + BANK.listeningLong.length },
  { id: 'grammar', label: '语法', count: BANK.grammarMcq.length + BANK.grammarFill.length },
  { id: 'vocabulary', label: '词汇', count: BANK.vocabulary.length },
  { id: 'cloze', label: '完形', count: BANK.cloze.length },
  { id: 'reading', label: '阅读', count: BANK.reading.length },
  { id: 'translation', label: '翻译', count: BANK.translation.length },
  { id: 'summary', label: '概要', count: BANK.summary.length },
  { id: 'writing', label: '写作', count: BANK.writing.length },
];

export default function BankPage() {
  const [active, setActive] = useState<SectionId>('reading');
  const [query, setQuery] = useState('');
  const totals = useMemo(() => bankTotals(), []);
  const meta = SECTION_META.find((s) => s.id === active)!;
  const q = query.trim().toLowerCase();

  const match = (value: unknown) => !q || JSON.stringify(value).toLowerCase().includes(q);

  return (
    <div className="container bank-page">
      <header className="bank-hero">
        <div>
          <span className="kicker">QUESTION BANK</span>
          <h1>题库</h1>
          <p>
            共 {totals.questions} 道小题，覆盖 {BANK_STATS.length} 类素材。每次组卷只抽取其中一部分，并优先避开最近做过的题。
          </p>
        </div>
        <Link to="/" className="btn btn-primary">
          去组卷 <ArrowRight size={17} />
        </Link>
      </header>

      <div className="bank-stat-grid">
        {BANK_STATS.map((stat) => (
          <div className="bank-stat" key={stat.key}>
            <span>{stat.label}</span>
            <strong>{stat.count}</strong>
            <em>{stat.unit}</em>
          </div>
        ))}
      </div>

      <div className="bank-toolbar">
        <div className="bank-tabs" role="tablist" aria-label="题型">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              className={active === tab.id ? 'bank-tab active' : 'bank-tab'}
              onClick={() => {
                setActive(tab.id);
                setQuery('');
              }}
            >
              {tab.label}
              <em>{tab.count}</em>
            </button>
          ))}
        </div>
        <label className="search-box">
          <Search size={17} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`在${meta.name}中搜索`}
            aria-label="搜索题库"
          />
        </label>
      </div>

      <div className="bank-heading">
        <div>
          <h2>{meta.name}</h2>
          <p>{meta.blurb}</p>
        </div>
        <Pill tone="muted">{meta.points} 分 · 建议 {meta.minutes} 分钟</Pill>
      </div>

      <div className="bank-list">
        {active === 'listening'
          ? (
              <>
                {BANK.listeningShort.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">短对话</span>
                      <span className="bank-item-title">{item.question}</span>
                      <span className="bank-item-meta">{item.tags[0]}</span>
                    </summary>
                    <div className="bank-item-body">
                      <pre className="audio-script">{item.script}</pre>
                      <ol className="bank-options">
                        {item.options.map((option, index) => (
                          <li key={option} className={index === item.answer ? 'correct' : ''}>
                            {String.fromCharCode(65 + index)}. {option}
                          </li>
                        ))}
                      </ol>
                      <p className="bank-explain">{item.explanation}</p>
                    </div>
                  </details>
                ))}
                {BANK.listeningLong.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">长材料</span>
                      <span className="bank-item-title">{item.title}</span>
                      <span className="bank-item-meta">{item.questions.length} 题</span>
                    </summary>
                    <div className="bank-item-body">
                      <pre className="audio-script">{item.script}</pre>
                      {item.questions.map((question, qi) => (
                        <div className="bank-subquestion" key={question.id}>
                          <p className="bank-question">
                            {qi + 1}. {question.question}
                          </p>
                          <ol className="bank-options">
                            {question.options.map((option, index) => (
                              <li key={option} className={index === question.answer ? 'correct' : ''}>
                                {String.fromCharCode(65 + index)}. {option}
                              </li>
                            ))}
                          </ol>
                          <p className="bank-explain">{question.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
                {!BANK.listeningShort.some(match) && !BANK.listeningLong.some(match) ? <NoMatch /> : null}
              </>
            )
          : null}

        {active === 'grammar'
          ? (
              <>
                {BANK.grammarMcq.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">单选</span>
                      <span className="bank-item-title">{item.stem}</span>
                      <span className="bank-item-meta">{item.tags[0]}</span>
                    </summary>
                    <div className="bank-item-body">
                      <ol className="bank-options">
                        {item.options.map((option, index) => (
                          <li key={option} className={index === item.answer ? 'correct' : ''}>
                            {String.fromCharCode(65 + index)}. {option}
                          </li>
                        ))}
                      </ol>
                      <p className="bank-explain">{item.explanation}</p>
                    </div>
                  </details>
                ))}
                {BANK.grammarFill.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">填空</span>
                      <span className="bank-item-title">{item.stem}</span>
                      <span className="bank-item-meta">{item.tags[0]}</span>
                    </summary>
                    <div className="bank-item-body">
                      <p className="bank-answer">答案：{item.answer}</p>
                      <p className="bank-explain">{item.explanation}</p>
                    </div>
                  </details>
                ))}
                {!BANK.grammarMcq.some(match) && !BANK.grammarFill.some(match) ? <NoMatch /> : null}
              </>
            )
          : null}

        {active === 'vocabulary'
          ? (
              <>
                {BANK.vocabulary.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">选词</span>
                      <span className="bank-item-title">{item.sentence}</span>
                      <span className="bank-item-meta">{item.tags[0]}</span>
                    </summary>
                    <div className="bank-item-body">
                      <p className="bank-answer">答案：{item.answer}</p>
                      <p className="bank-explain">{item.explanation}</p>
                      <p className="bank-explain">干扰项：{item.distractors.join(' / ')}</p>
                    </div>
                  </details>
                ))}
                {!BANK.vocabulary.some(match) ? <NoMatch /> : null}
              </>
            )
          : null}

        {active === 'cloze'
          ? (
              <>
                {BANK.cloze.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">完形</span>
                      <span className="bank-item-title">{item.title}</span>
                      <span className="bank-item-meta">{item.blanks.length} 空 · 难度 {item.difficulty}</span>
                    </summary>
                    <div className="bank-item-body">
                      <p className="passage-text">{item.text}</p>
                      <div className="bank-blanks">
                        {item.blanks.map((blank, index) => (
                          <div className="bank-blank" key={index}>
                            <span>{index + 1}.</span>
                            <strong>{blank.options[blank.answer]}</strong>
                            <em>{blank.explanation}</em>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                ))}
                {!BANK.cloze.some(match) ? <NoMatch /> : null}
              </>
            )
          : null}

        {active === 'reading'
          ? (
              <>
                {BANK.reading.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">阅读</span>
                      <span className="bank-item-title">{item.title}</span>
                      <span className="bank-item-meta">{item.questions.length} 题 · 难度 {item.difficulty}</span>
                    </summary>
                    <div className="bank-item-body">
                      <p className="passage-text">{item.text}</p>
                      {item.questions.map((question, qi) => (
                        <div className="bank-subquestion" key={question.id}>
                          <p className="bank-question">
                            {qi + 1}. {question.question}
                          </p>
                          <ol className="bank-options">
                            {question.options.map((option, index) => (
                              <li key={option} className={index === question.answer ? 'correct' : ''}>
                                {String.fromCharCode(65 + index)}. {option}
                              </li>
                            ))}
                          </ol>
                          <p className="bank-explain">{question.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
                {!BANK.reading.some(match) ? <NoMatch /> : null}
              </>
            )
          : null}

        {active === 'translation'
          ? (
              <>
                {BANK.translation.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">翻译</span>
                      <span className="bank-item-title">{item.chinese}</span>
                      <span className="bank-item-meta">{item.tags[0]}</span>
                    </summary>
                    <div className="bank-item-body">
                      <p className="bank-answer">{item.reference}</p>
                      <ul className="bank-bullets">
                        {item.tips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
                {!BANK.translation.some(match) ? <NoMatch /> : null}
              </>
            )
          : null}

        {active === 'summary'
          ? (
              <>
                {BANK.summary.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">概要</span>
                      <span className="bank-item-title">{item.title}</span>
                      <span className="bank-item-meta">{item.minWords}–{item.maxWords} 词</span>
                    </summary>
                    <div className="bank-item-body">
                      <p className="passage-text">{item.text}</p>
                      <p className="bank-answer">参考概要：{item.sample}</p>
                      <ul className="bank-bullets">
                        {item.tips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
                {!BANK.summary.some(match) ? <NoMatch /> : null}
              </>
            )
          : null}

        {active === 'writing'
          ? (
              <>
                {BANK.writing.filter(match).map((item) => (
                  <details className="bank-item" key={item.id}>
                    <summary>
                      <span className="bank-item-type">写作</span>
                      <span className="bank-item-title">{item.title}</span>
                      <span className="bank-item-meta">{item.minWords}–{item.maxWords} 词 · 难度 {item.difficulty}</span>
                    </summary>
                    <div className="bank-item-body">
                      <p className="bank-question">{item.prompt}</p>
                      <ul className="bank-bullets">
                        {item.requirements.map((req) => (
                          <li key={req}>{req}</li>
                        ))}
                      </ul>
                      <p className="bank-answer">参考范文：{item.sample}</p>
                    </div>
                  </details>
                ))}
                {!BANK.writing.some(match) ? <NoMatch /> : null}
              </>
            )
          : null}
      </div>

      <div className="bank-foot">
        <Book size={18} />
        <p>题库会持续扩充；当前版本以高考常见话题与考点为主，题目为原创或改编练习材料。</p>
      </div>
    </div>
  );
}

function NoMatch() {
  return (
    <div className="review-empty">
      <p>没有找到匹配的题目。试试更短的关键词，或切换题型。</p>
    </div>
  );
}
