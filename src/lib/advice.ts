import type {
  Paper,
  QuestionResult,
  SectionId,
  SectionResult,
  Suggestion,
  SuggestionPriority,
  TagStat,
} from '../types';

export interface AdviceEntry {
  title: string;
  detail: string;
  action: string;
}

const TAG_ADVICE: Record<string, AdviceEntry> = {
  '听力-细节': {
    title: '听力细节题：先读题干，再抓关键词',
    detail: '细节题失分通常不是听不懂，而是听前没有目标。先圈出题干中的人名、时间、地点、动作，听时只等这些信息出现。',
    action: '用专项模式练 1 组短对话：播放前 15 秒读题并写下关键词，听完先复述再作答。',
  },
  '听力-数字': {
    title: '听力数字题：边听边记，别心算',
    detail: '数字题常设干扰项（原价/折扣、开始/结束、提前/推迟）。先把听到的数字和单位记下，再根据问题做一步运算。',
    action: '整理 10 个常考数字场景（价格、时间、年龄、航班），每个场景练 2 题。',
  },
  '听力-推断': {
    title: '听力推断题：注意语气与转折',
    detail: '推断答案往往不在原句里，而在 but、actually、I\'m afraid 之后的语气变化中。听到转折先标记，再判断说话人真正态度。',
    action: '精听 2 段长对话，逐句写下“表面意思”和“言外之意”，再对照题目。',
  },
  '听力-态度': {
    title: '听力态度题：抓形容词和语调',
    detail: '态度题要区分 positive / negative / neutral。注意说话人使用的评价性形容词和重读，而不是只听内容。',
    action: '练习时把每段录音中所有评价性形容词圈出来，归纳成态度词表。',
  },
  '听力-时间': {
    title: '听力时间题：先记时间点，再处理变化',
    detail: '时间题常考“原定—推迟—最终”的变化。听到 but、instead、actually 时立刻更新笔记。',
    action: '做 5 道时间题，专练“先记原信息，再改笔记”的习惯。',
  },
  '听力-原因': {
    title: '听力原因题：关注 because / so / that\'s why',
    detail: '原因常由 because、since、that\'s why 引出，也可能藏在说话人的解释里。先定位因果信号词。',
    action: '精听 1 段对话，画出所有因果连接词，再用一句话概括原因。',
  },
  '听力-地点': {
    title: '听力地点题：抓场景词',
    detail: '地点题靠场景词判断，如 renew/due（图书馆）、menu/order（餐厅）、platform（车站）。不要等“地点”被直接说出。',
    action: '整理 8 个高频场景词群，每个场景写 5 个关键词。',
  },
  '听力-主旨': {
    title: '听力主旨题：听开头和结尾',
    detail: '长对话/独白的主旨通常在开头两句和结尾总结中。先抓“谁在说、为什么说”，再判断选项。',
    action: '练 2 段独白，只听首尾各两句，先猜主旨，再听全文验证。',
  },
  '语法-时态': {
    title: '时态题：先找时间标志，再定时态',
    detail: '时态题不要凭语感。先找时间状语（by the time、since、last year），再判断动作发生在“现在、过去还是过去的过去”。',
    action: '做 10 道时态题，每题写下判断依据（时间词/上下文），再对答案。',
  },
  '语法-非谓语': {
    title: '非谓语题：判断主动被动与先后',
    detail: '先找逻辑主语，再判断主动/被动；然后看动作与谓语是同时、先后还是目的。三步走比背规则更稳。',
    action: '整理现在分词、过去分词、不定式各 5 个典型句，标注逻辑主语。',
  },
  '语法-定语从句': {
    title: '定语从句：先找先行词，再看缺什么成分',
    detail: '把先行词代回从句：缺主语/宾语用 that/which/who，缺状语用 where/when/why，缺定语用 whose。',
    action: '做 8 道定语从句题，每题写出“先行词 + 从句缺什么成分”。',
  },
  '语法-虚拟语气': {
    title: '虚拟语气：按时间分三类',
    detail: '与现在相反用过去式，与过去相反用 had done，与将来相反用 were to do/should do。先判断时间，再套结构。',
    action: '默写三类虚拟条件句各 2 个例句，并做 6 道混合题。',
  },
  '语法-倒装': {
    title: '倒装题：先认触发词',
    detail: '否定词（not until、hardly）、only + 状语、so/neither 置于句首时，主句要部分倒装。先认触发词，再调语序。',
    action: '整理 5 种倒装触发结构，每种造 1 个句子。',
  },
  '语法-主谓一致': {
    title: '主谓一致：找真正的主语',
    detail: 'the number of、neither ... nor、the only one of ... 等结构容易误判。先划掉修饰成分，找到谓语真正对应的主语。',
    action: '做 8 道主谓一致题，每题圈出真正主语。',
  },
  '语法-介词': {
    title: '介词题：按搭配积累，不按中文猜',
    detail: '介词最忌直译。把动词/形容词与介词的固定搭配成组记忆，如 devote ... to、be essential to、a solution to。',
    action: '建立“动词/形容词 + 介词”搭配卡片，每天复习 10 组。',
  },
  '语法-词性': {
    title: '词性题：先看空格缺什么成分',
    detail: '空格前是冠词/形容词，通常填名词；修饰动词填副词；作表语填形容词。先判断成分，再变词形。',
    action: '做 10 道词形变化题，每题标注空格在句中作什么成分。',
  },
  '语法-动词': {
    title: '动词题：注意及物性与搭配',
    detail: '先判断动词是否需要宾语、是否用于被动，再检查固定搭配。不要只看中文意思。',
    action: '整理 20 个高频动词的及物/不及物用法与常见搭配。',
  },
  '词汇-搭配': {
    title: '词汇搭配：成组记忆，不背孤立单词',
    detail: '选词填空常考固定搭配（maintain a balance、take measures、be aware of）。只记单词中文意思不够，要连同介词和宾语一起记。',
    action: '把本次错题中的搭配抄成“动词 + 名词/介词”短语，第二天默写。',
  },
  '词汇-语义': {
    title: '词义辨析：把选项放回语境',
    detail: '四个选项可能中文意思相近，但搭配或语域不同。先读完整句，判断褒贬、正式程度和逻辑关系，再排除。',
    action: '做 10 道近义词辨析题，每题写出两个选项的差异（搭配/褒贬/程度）。',
  },
  '词汇-形容词': {
    title: '形容词题：先判断修饰对象',
    detail: '形容词要与人/物、褒贬和语境匹配。先找被修饰的名词，再判断需要“可靠的、灵活的、显著的”等哪类含义。',
    action: '按主题整理形容词（人物品质、事物特征、程度评价）各 10 个。',
  },
  '词汇-动词': {
    title: '动词题：先看主语和宾语',
    detail: '动词题要同时看主语（单复数/人/物）和宾语（能否搭配），再判断时态和语态。',
    action: '把错题动词做成“主语 + 动词 + 宾语”句卡，朗读记忆。',
  },
  '词汇-名词': {
    title: '名词题：注意可数性与固定搭配',
    detail: '名词题常考可数/不可数、单复数以及固定搭配（a solution to、the purpose of）。先看限定词和谓语。',
    action: '整理 15 个高频抽象名词及其搭配。',
  },
  '词汇-副词': {
    title: '副词题：看它修饰谁',
    detail: '副词修饰动词、形容词或整句。先确定修饰对象，再判断程度、方式或频率。',
    action: '做 8 道副词题，标出每个副词修饰的词。',
  },
  '完形-上下文': {
    title: '完形：先通读，再逐空',
    detail: '完形的答案常在上下文中复现或对照。先花 1 分钟通读全文抓主线，再逐空找线索，不要看一句填一句。',
    action: '用本次完形重做一遍：第一遍只读不填，第二遍再选，比较两次差异。',
  },
  '完形-逻辑': {
    title: '完形逻辑：标记转折与因果',
    detail: '完形常考 however、therefore、instead 等逻辑关系。把连接词圈出来，判断前后是顺承、转折还是因果。',
    action: '精读 1 篇完形，画出所有逻辑连接词并写出前后关系。',
  },
  '完形-搭配': {
    title: '完形搭配：动词与介词一起看',
    detail: '完形中的固定搭配往往决定答案，如 keep ... away from、take responsibility for、benefit from。',
    action: '把本次完形出现的搭配整理成 10 张短语卡。',
  },
  '完形-情感': {
    title: '完形情感线：跟着人物情绪走',
    detail: '记叙类完形常有情绪变化（nervous → confident → grateful）。先确定人物情绪曲线，再选形容词/动词。',
    action: '重读本次完形，标出人物情绪变化的关键词。',
  },
  '阅读-细节': {
    title: '阅读细节题：定位 + 同义替换',
    detail: '细节题不是通读全文，而是用题干关键词回原文定位，再识别同义替换。找不到定位句时，先排除与原文矛盾的选项。',
    action: '做 2 篇阅读，只做细节题，每题写出原文定位句和同义替换词。',
  },
  '阅读-主旨': {
    title: '阅读主旨题：看首尾与高频词',
    detail: '主旨题要覆盖全文，不能选只讲一段的选项。先看首段和末段，再找反复出现的主题词，最后排除过窄/过宽的选项。',
    action: '练 3 篇阅读，用一句话写出每段大意，再归纳全文主旨。',
  },
  '阅读-推断': {
    title: '阅读推断题：排除“原文原句”',
    detail: '推断题答案通常需要一步推理，直接照抄原文的选项往往是陷阱。先排除与原文相同但未回答问题的选项。',
    action: '做 5 道推断题，每题写出“原文证据 → 推理 → 结论”。',
  },
  '阅读-词句': {
    title: '词句猜测：回到上下文',
    detail: '猜词题要看前后句的解释、举例或对比关系，不要只看单词本身。代词指代则往前找最近的名词。',
    action: '做 5 道词义/指代题，用箭头标出上下文线索。',
  },
  '阅读-态度': {
    title: '态度题：抓评价性语言',
    detail: '作者态度常通过形容词、副词和转折句体现。区分 objective、supportive、critical、doubtful，不要把自己的观点代入。',
    action: '精读 1 篇议论文，圈出所有评价性形容词和转折句，再判断态度。',
  },
  '翻译-非谓语': {
    title: '翻译：先找主干，再处理修饰',
    detail: '中译英先确定主谓宾，再把时间、原因、伴随等修饰成分转成从句或非谓语，避免逐字直译。',
    action: '做 5 句翻译，每句先划主干，再写修饰成分。',
  },
  '翻译-时态': {
    title: '翻译：时态由语境决定',
    detail: '中文没有时态标记，英文必须补出来。先找时间词（已经、将、昨天），再判断完成/进行/被动。',
    action: '把 10 句错题按“过去/现在/将来/完成”分类，重写时态。',
  },
  '翻译-句型': {
    title: '翻译：积累高频句型',
    detail: 'It is said that、Not until、Only by、It occurred to sb. that 等句型能显著提升表达。先背结构，再套内容。',
    action: '整理 8 个高频翻译句型，每个造 1 句并与参考译文对比。',
  },
  '翻译-固定搭配': {
    title: '翻译：搭配要地道',
    detail: '“采取措施”“以……闻名”“期待收到来信”等都有固定英文搭配。逐字翻译容易失分。',
    action: '把本次翻译中的搭配整理成中英对照卡，朗读 3 遍。',
  },
  '翻译-倒装': {
    title: '翻译倒装：先认触发结构',
    detail: 'Not until、Only by、Hardly ... when 置于句首时需部分倒装。先写出正常语序，再倒装，避免漏助动词。',
    action: '做 5 句倒装翻译，先写正常语序，再改写并核对助动词。',
  },
  '概要写作': {
    title: '概要：要点优先，压缩表达',
    detail: '概要评分首先看要点覆盖，其次看语言压缩。先列 4–5 个要点，再用自己的话连成 3–4 句，避免照抄原句。',
    action: '重做本次概要：先写 5 个要点提纲，再压缩到 60 词，最后与范文对比。',
  },
  '写作': {
    title: '写作：审题列提纲，再动笔',
    detail: '写作失分常因漏要点或结构不清。动笔前用 2 分钟列提纲：开头目的、主体 2–3 点、结尾呼应，并检查词数。',
    action: '用本次题目重新列提纲，写完后对照要点逐项打勾，再修改语言。',
  },
};

const SECTION_ADVICE: Record<SectionId, AdviceEntry> = {
  listening: {
    title: '听力：建立“读题—预测—抓词”流程',
    detail: '听力提分不靠反复盲听。先读题预测场景，听时抓关键词和转折，听完立刻作答，不要纠结上一题。',
    action: '每天精听 1 段、泛听 10 分钟，坚持两周。',
  },
  grammar: {
    title: '语法：按考点建错题本',
    detail: '语法题数量有限，适合精准补漏。把错题按“时态、非谓语、从句、搭配”分类，每类只记一条判断规则。',
    action: '整理本次语法错题，写出每题的判断依据，三天后重做。',
  },
  vocabulary: {
    title: '词汇：在搭配和语境中记忆',
    detail: '孤立背单词容易“认识但选不对”。把单词放进短语和句子，特别关注动词搭配、介词和褒贬。',
    action: '每天精记 10 个高频搭配，并用它们各造 1 句。',
  },
  cloze: {
    title: '完形：先通读，再逐空',
    detail: '完形考的是语篇逻辑，不是单句翻译。先通读抓主线，再借助复现、转折和搭配逐空判断。',
    action: '隔天重做本次完形，第一遍只读不填，第二遍再选。',
  },
  reading: {
    title: '阅读：定位句 + 同义替换',
    detail: '阅读提分的关键是“回原文找证据”。每道题都标出定位句，并比较选项与原文的同义替换，减少凭印象作答。',
    action: '每天精做 1 篇阅读，限时 8 分钟，逐题写定位句。',
  },
  translation: {
    title: '翻译：先搭骨架，再润色',
    detail: '翻译要先保证主谓宾和时态正确，再处理修饰与高级表达。不要为了“高级”而牺牲准确性。',
    action: '每天翻译 3 句，先写主干，再对照参考译文修改。',
  },
  summary: {
    title: '概要：要点覆盖 + 语言压缩',
    detail: '概要不是缩写全文，而是保留核心信息、删去例子和细节。先列要点，再用自己的话连接。',
    action: '每周练 2 篇概要，严格控制在 60 词左右。',
  },
  writing: {
    title: '写作：结构先行，语言其次',
    detail: '先确保要点齐全、段落清晰，再追求高级词汇。阅卷首先看“是否完成任务”，其次看语言质量。',
    action: '每周写 1 篇并对照范文修改，重点检查要点、连接词和词数。',
  },
};

/** Tag prefixes are written as "板块-考点", so a tag can still find a section-level fallback. */
const TAG_PREFIX_SECTION: Record<string, SectionId> = {
  听力: 'listening',
  语法: 'grammar',
  词汇: 'vocabulary',
  完形: 'cloze',
  阅读: 'reading',
  翻译: 'translation',
  概要: 'summary',
  写作: 'writing',
};

const GENERIC_ADVICE: AdviceEntry = {
  title: '把这道题当成一次定位练习',
  detail:
    '这个考点暂时没有单独的指导条目。先回到题干/原文找出判断依据，再对照解析确认自己是“读懂后选对”还是“排除后猜对”。',
  action: '把本题解析压缩成一句错因笔记（词义、搭配、逻辑还是定位），隔天重做同考点 3 题。',
};

/** True when the tag has its own hand-written entry in the advice table. */
export function hasTagAdvice(tag: string): boolean {
  return Object.prototype.hasOwnProperty.call(TAG_ADVICE, tag);
}

/** Section-level guidance; always non-empty. */
export function sectionAdvice(section: SectionId): AdviceEntry {
  return SECTION_ADVICE[section] ?? GENERIC_ADVICE;
}

/**
 * Guidance for one exam tag. Never returns undefined: a tag without its own entry falls back to
 * the section advice (taken from the argument, else guessed from the "板块-考点" prefix), then to
 * a generic entry. The 240-line table itself is not copied or rewritten.
 */
export function adviceForTag(tag: string, section?: SectionId): AdviceEntry {
  const direct = TAG_ADVICE[tag];
  if (direct) return direct;
  const guessed = section ?? TAG_PREFIX_SECTION[tag.split('-')[0] ?? ''];
  return guessed ? SECTION_ADVICE[guessed] ?? GENERIC_ADVICE : GENERIC_ADVICE;
}

const priorityRank: Record<SuggestionPriority, number> = { high: 0, medium: 1, low: 2 };

function priorityFor(accuracy: number): SuggestionPriority {
  if (accuracy < 0.5) return 'high';
  if (accuracy < 0.7) return 'medium';
  return 'low';
}

export interface AdviceInput {
  results: QuestionResult[];
  sectionResults: SectionResult[];
  tagStats: TagStat[];
  timeBySection: Partial<Record<SectionId, number>>;
  /** Real objective marks. Rating-like conclusions must use these two, never the subjective estimate. */
  objectiveScore: number;
  objectiveMax: number;
  /** Rough subjective estimate; may drive practice advice, never a grade conclusion. */
  subjectiveEstimate: number;
  subjectiveMax: number;
  paper: Paper;
  unanswered: number;
}

const ESTIMATED_SECTIONS = new Set<SectionId>(['translation', 'summary', 'writing']);

export function buildSuggestions(input: AdviceInput): Suggestion[] {
  const {
    results,
    sectionResults,
    tagStats,
    timeBySection,
    objectiveScore,
    objectiveMax,
    subjectiveEstimate,
    subjectiveMax,
    paper,
    unanswered,
  } = input;
  const suggestions: Suggestion[] = [];
  const titles = new Set<string>();

  const add = (raw: Suggestion) => {
    if (titles.has(raw.title)) return;
    let suggestion = raw;
    const highCount = suggestions.filter((s) => s.priority === 'high').length;
    if (suggestion.priority === 'high' && highCount >= 2) {
      suggestion = { ...suggestion, priority: 'medium' };
    }
    titles.add(suggestion.title);
    suggestions.push(suggestion);
  };

  const weakTags = tagStats
    .filter((t) => t.total >= 1 && t.accuracy < 0.75)
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
    .slice(0, 5);

  for (const tag of weakTags) {
    const entry = TAG_ADVICE[tag.tag] ?? SECTION_ADVICE[tag.section];
    const estimated = ESTIMATED_SECTIONS.has(tag.section);
    add({
      priority: priorityFor(tag.accuracy),
      title: entry.title,
      detail: `${entry.detail}（本项${estimated ? '估分' : ''}得分率 ${Math.round(tag.accuracy * 100)}%${estimated ? '，估分不参与评级' : ''}）`,
      action: entry.action,
      section: tag.section,
      tag: tag.tag,
    });
    if (suggestions.length >= 3) break;
  }

  const rateOf = (section: SectionResult) =>
    section.scoreRate ?? (section.max > 0 ? section.score / section.max : 0);
  const weakSections = sectionResults
    .filter((s) => s.max > 0 && rateOf(s) < 0.7)
    // Highest-value (most lost marks) sections get the first slots, so reading/writing
    // cannot be crowded out by low-value tag suggestions.
    .sort((a, b) => b.max - b.score - (a.max - a.score) || rateOf(a) - rateOf(b));

  for (const section of weakSections) {
    if (suggestions.length >= 5) break;
    if (suggestions.some((s) => s.section === section.id)) continue;
    const entry = SECTION_ADVICE[section.id];
    const estimated = ESTIMATED_SECTIONS.has(section.id);
    add({
      priority: priorityFor(rateOf(section)),
      title: entry.title,
      detail: `${entry.detail}（本节${estimated ? '估分' : ''} ${section.score}/${section.max}，${estimated ? '估分不参与评级，仅作练习参考' : `得分率 ${Math.round(rateOf(section) * 100)}%`}）`,
      action: entry.action,
      section: section.id,
    });
  }

  const timeIssues = sectionResults.filter((s) => {
    const used = timeBySection[s.id] ?? 0;
    const meta = paper.sections.find((p) => p.id === s.id);
    return meta && used > meta.minutes * 60 * 1.35 && s.accuracy < 0.8;
  });
  if (timeIssues.length > 0) {
    const names = timeIssues.map((s) => s.name).join('、');
    add({
      priority: 'medium',
      title: '时间分配：先易后难，给写作留足时间',
      detail: `你在 ${names} 上用时明显超出建议，且正确率不高。卡题超过 2 分钟应先标记跳过，交卷前再回来。`,
      action: '下一次全卷练习时，按“听力 20 分钟—语法词汇 16 分钟—完形阅读 38 分钟—翻译 10 分钟—概要写作 36 分钟”设分段闹钟。',
    });
  }

  if (unanswered > 0) {
    add({
      priority: 'medium',
      title: '减少空白：先拿能拿的分',
      detail: `本次有 ${unanswered} 道题未作答。客观题即使不确定也应根据排除法作答，写作至少写出提纲和开头。`,
      action: '下次交卷前留 3 分钟，专门检查答题卡上的空白题。',
    });
  }

  // Grade-shaped advice may only look at objective marks; the estimate never upgrades it.
  const ratio = objectiveMax > 0 ? objectiveScore / objectiveMax : 0;
  const subjective = results.filter(
    (r) => r.type === 'translation' || r.type === 'summary' || r.type === 'writing',
  );
  const subjectiveHealthy = subjective.every((r) => r.points > 0 && r.earned / r.points >= 0.7);
  // Never tell a student with a weak translation/summary/essay to simply "aim higher".
  if (ratio >= 0.88 && subjectiveHealthy) {
    const estimateNote =
      subjectiveMax > 0 ? `主观题估分 ${subjectiveEstimate}/${subjectiveMax}，估分不参与评级。` : '';
    add({
      priority: 'low',
      title: '冲击高分：把“会做”变成“稳拿”',
      detail: `客观题得分率 ${Math.round(ratio * 100)}%，已经具备较强基础。${estimateNote}下一步重点是减少非知识性失分：拼写、单复数、时态和书写规范。`,
      action: '重做本次错题并逐题写“失分原因”，一周后再做一套全卷验证稳定性。',
    });
  }

  if (suggestions.length === 0) {
    add({
      priority: 'low',
      title: '保持手感：稳定比突击更重要',
      detail: '本次没有明显薄弱项。继续保持每周 1–2 套完整限时训练，重点维护阅读速度和写作手感。',
      action: '制定一周计划：2 篇阅读 + 1 篇完形 + 1 篇写作，每次限时完成。',
    });
  }

  return suggestions.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]).slice(0, 6);
}
