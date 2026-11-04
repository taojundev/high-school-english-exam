import type { WritingItem } from '../types';

/** 指导性写作：应用文与议论文，120–150 词。keyPoints 用于内容要点覆盖初评。 */
export const writing: WritingItem[] = [
  {
    id: 'w-01',
    title: 'An Email to an Exchange Student',
    difficulty: 1,
    prompt:
      '假设你是李华，你的英国朋友 Chris 即将作为交换生来你校学习一学期。请给他写一封邮件，介绍学校的社团活动并欢迎他的到来。',
    requirements: [
      '表达欢迎并询问他到达的时间',
      '介绍两个你推荐的社团及活动内容',
      '说明社团活动的时间或地点',
      '表达期待并请他提前告知兴趣',
    ],
    keyPoints: [
      { label: '表达欢迎', patterns: ['\\bwelcome\\b', '\\bglad\\b', '\\bpleased\\b'] },
      { label: '介绍两个社团', patterns: ['\\bclub', '\\bsociet'] },
      { label: '说明时间或地点', patterns: ['\\b(friday|monday|tuesday|wednesday|thursday|saturday|sunday)\\b', '\\bpm\\b', '\\ba\\.m\\.', '\\bafter school\\b', '\\broom\\b'] },
      { label: '询问到达时间或兴趣', patterns: ['\\bwhen\\b', '\\barriv', '\\binterest', '\\bwhich\\b'] },
      { label: '表达期待', patterns: ['\\blook(ing)? forward\\b', '\\bexpect\\b', '\\bhope\\b'] },
    ],
    sample: `Dear Chris,

I'm delighted to hear that you will be joining us as an exchange student next term. Welcome to our school!

I'd like to recommend two clubs. The English Drama Club meets every Friday afternoon in Room 302, where we rehearse short plays and sometimes perform for the whole school. The Photography Club meets on Wednesday after school and organizes walks around the city, so it is a great way to explore Shanghai. Both clubs are friendly to new members, so you do not need any experience to join.

Could you let me know when you will arrive and which club interests you more? I can help you sign up.

I'm looking forward to meeting you.

Yours,
Li Hua`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '邮件要有称呼和结尾，语气友好但不过分随意。',
      '两个社团各写一句具体活动，避免只列名称。',
      '结尾用 Could you let me know ...? 自然引出询问。',
    ],
  },
  {
    id: 'w-02',
    title: 'A Reading Festival Proposal',
    difficulty: 2,
    prompt:
      '假定你是校学生会主席李华。学校计划举办“校园读书节”，请你写一封倡议书，号召同学们积极参与。',
    requirements: [
      '说明读书节的目的',
      '介绍至少两项活动',
      '提出参与建议（如每天阅读半小时）',
      '发出号召',
    ],
    keyPoints: [
      { label: '说明读书节目的', patterns: ['\\bread', '\\bfestival\\b', '\\bpurpose\\b', '\\baim\\b'] },
      { label: '介绍至少两项活动', patterns: ['\\bshare\\b', '\\bcompetition\\b', '\\blecture\\b', '\\bexhibition\\b', '\\bactivity\\b'] },
      { label: '提出参与建议', patterns: ['\\bhalf an hour\\b', '\\bevery day\\b', '\\bdaily\\b', '\\bsuggest\\b', '\\badvise\\b'] },
      { label: '发出号召', patterns: ['\\bjoin\\b', '\\btake part\\b', '\\baction\\b', '\\blet\\b'] },
    ],
    sample: `Dear fellow students,

Our school will hold a Reading Festival next month. The event aims to encourage us to read more and share the joy of books.

Several activities will be organized. There will be a book-sharing session where students introduce their favourite books, and a writing competition on the theme "A Book That Changed Me". A local writer will also give a talk about how reading shapes our thinking.

I suggest that everyone read for at least half an hour every day and take notes on what impresses you most. You can also recommend a book to a classmate.

Books open doors to new worlds. Let's make reading part of our daily life. Join us and discover the pleasure of reading!

The Student Union`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '倡议书要“目的—活动—建议—号召”四步走。',
      '活动名称要具体，避免空泛的 “many activities”。',
      '结尾用祈使句增强号召力。',
    ],
  },
  {
    id: 'w-03',
    title: 'Should Mobile Phones Be Banned at School?',
    difficulty: 3,
    prompt:
      '最近，你校就“中学生是否应该带手机进校园”展开讨论。请你写一篇英语短文，陈述你的观点并说明理由。',
    requirements: [
      '明确表达你的观点',
      '给出至少两个理由',
      '提及可能的反对意见并回应',
      '得出结论',
    ],
    keyPoints: [
      { label: '明确观点', patterns: ['\\bi (believe|think|agree|disagree)\\b', '\\bin my opinion\\b', '\\bshould\\b'] },
      { label: '理由一（如分心/社交）', patterns: ['\\bdistract', '\\bfocus\\b', '\\bconcentrat', '\\bstudy\\b'] },
      { label: '理由二（如安全/联系家长）', patterns: ['\\bsafety\\b', '\\bemergenc', '\\bparents?\\b', '\\bcontact\\b'] },
      { label: '回应反对意见', patterns: ['\\bhowever\\b', '\\bon the other hand\\b', '\\bwhile\\b', '\\balthough\\b'] },
      { label: '得出结论', patterns: ['\\bin conclusion\\b', '\\btherefore\\b', '\\bso\\b', '\\bbalance\\b'] },
    ],
    sample: `Should students be allowed to bring mobile phones to school? In my opinion, they should not be completely banned, but their use should be strictly controlled.

On the one hand, phones can distract students. Messages and games make it hard to concentrate in class, and some students stay up late playing on their phones. On the other hand, phones are useful in emergencies. If a student feels unwell or needs to contact parents, a phone can be a lifeline.

Some people argue that a ban is the simplest solution. However, a complete ban may cause practical problems and does not teach students to use technology responsibly.

In conclusion, schools should set clear rules: phones must be kept in lockers during lessons and used only when necessary. This balance protects learning while keeping students safe.`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '议论文要有清晰立场，避免“既同意又不同意”却没有结论。',
      '用 On the one hand ... On the other hand ... 组织两个理由。',
      '回应反方时用 However，再给出自己的解决方案。',
    ],
  },
  {
    id: 'w-04',
    title: 'A Volunteer Experience',
    difficulty: 1,
    prompt:
      '假定你是李华，你校英文报正在征集“志愿服务”主题稿件。请写一篇短文，介绍你参加的一次志愿活动及你的感受。',
    requirements: [
      '介绍活动的时间、地点和内容',
      '描述你具体做了什么',
      '说明你的感受或收获',
      '呼吁更多同学参与',
    ],
    keyPoints: [
      { label: '活动时间地点', patterns: ['\\blast\\b', '\\bweekend\\b', '\\bsaturday\\b', '\\bsunday\\b', '\\bcommunity\\b', '\\bpark\\b'] },
      { label: '活动内容', patterns: ['\\bclean', '\\bvolunteer', '\\bhelp', '\\bvisit', '\\bcollect'] },
      { label: '具体做了什么', patterns: ['\\bi (sat|showed|helped|explained|taught|spent|cleaned|visited|picked|organized)\\b', '\\bmy job\\b', '\\bwe\\b'] },
      { label: '感受或收获', patterns: ['\\bfeel\\b', '\\blearn', '\\brealiz', '\\bmeaning', '\\bproud\\b'] },
      { label: '呼吁参与', patterns: ['\\bjoin\\b', '\\btake part\\b', '\\bencourage\\b', '\\bvolunteer\\b'] },
    ],
    sample: `Last Saturday, I took part in a volunteer activity at a community center near my home. Our task was to help elderly residents learn to use smartphones.

At first, I was nervous because I had never taught anyone before. I sat next to an 80-year-old woman and showed her how to make video calls and send photos. She repeated each step carefully and wrote notes in a small notebook. When she successfully called her granddaughter, her face lit up.

The experience taught me that small acts of patience can make a big difference. I also realized that older people are eager to learn; they simply need someone to guide them.

Volunteering is not only about giving. It is also about learning and connecting. I hope more students will join us and discover the joy of helping others.`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '用具体细节（老人记笔记、成功视频通话）代替空泛的“很感动”。',
      '时态以一般过去时为主，感受部分可用一般现在时。',
      '结尾呼吁要自然，不要突然喊口号。',
    ],
  },
  {
    id: 'w-05',
    title: 'An Application for a Summer Camp',
    difficulty: 2,
    prompt:
      '假定你是李华，你想申请参加一个国际青年夏令营。请写一封申请信，介绍自己并说明申请理由。',
    requirements: [
      '说明你从何处得知夏令营',
      '介绍自己的兴趣和特长',
      '说明希望参加的原因',
      '询问相关安排',
    ],
    keyPoints: [
      { label: '得知渠道', patterns: ['\\blearn(ed)?\\b', '\\bwebsite\\b', '\\bnotice\\b', '\\bheard\\b'] },
      { label: '兴趣特长', patterns: ['\\binterest', '\\bgood at\\b', '\\bskill\\b', '\\bexperience\\b'] },
      { label: '申请原因', patterns: ['\\bwhy\\b', '\\breason\\b', '\\bimprove\\b', '\\blearn\\b', '\\bculture\\b'] },
      { label: '询问安排', patterns: ['\\bcould you\\b', '\\bwould you\\b', '\\binformation\\b', '\\bschedule\\b', '\\bfee\\b'] },
    ],
    sample: `Dear Sir or Madam,

I am writing to apply for the International Youth Summer Camp advertised on your website.

I am a 16-year-old student from Shanghai. I am interested in environmental science and have taken part in several school projects on recycling. I also enjoy photography and have won a prize in our city's youth photo competition. These experiences have taught me to work in a team and to communicate with people from different backgrounds.

I would like to join the camp because it offers a chance to learn about global issues and to practice my English in a real setting. I am especially interested in the workshop on sustainable cities.

Could you please send me more information about the schedule and the fee? I would also like to know whether accommodation is provided.

Thank you for your consideration.

Yours sincerely,
Li Hua`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '申请信结构：信息来源—自我介绍—申请理由—询问—致谢。',
      '特长要与夏令营主题相关，不要罗列无关奖项。',
      '询问信息用 Could you please ...? 保持礼貌。',
    ],
  },
  {
    id: 'w-06',
    title: 'A One-Day Tour of Shanghai',
    difficulty: 1,
    prompt:
      '假定你是李华，你的澳大利亚朋友 Emma 将来上海旅游一天。请给她写一封邮件，推荐一条一日游路线并说明理由。',
    requirements: [
      '推荐至少两个地点',
      '说明路线安排和时间',
      '介绍其中一个地点的特色',
      '提醒注意事项',
    ],
    keyPoints: [
      { label: '推荐两个地点', patterns: ['\\bbund\\b', '\\bmuseum\\b', '\\bgarden\\b', '\\btemple\\b', '\\bpark\\b'] },
      { label: '路线与时间', patterns: ['\\bmorning\\b', '\\bafternoon\\b', '\\bevening\\b', '\\bfirst\\b', '\\bthen\\b'] },
      { label: '地点特色', patterns: ['\\bhistory\\b', '\\barchitecture\\b', '\\bfood\\b', '\\bview\\b', '\\bculture\\b'] },
      { label: '注意事项', patterns: ['\\bremember\\b', '\\bnote\\b', '\\bbring\\b', '\\bwear\\b', '\\bcrowd'] },
    ],
    sample: `Dear Emma,

I'm so excited that you'll be in Shanghai for a day! Here is a route I think you'll enjoy.

Start at the Bund in the morning. The view of the river and the old buildings is amazing, and it's a great place for photos. Then take the subway to the Shanghai Museum, where you can see beautiful Chinese art and learn about the city's history. In the afternoon, walk through Yu Garden and try some local snacks nearby.

Remember to wear comfortable shoes, as you'll be walking a lot. The Bund can be crowded at weekends, so go early if possible. Also, bring an umbrella in case of rain.

Let me know if you need any help. Enjoy your trip!

Yours,
Li Hua`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '用 First/Then/In the afternoon 等词让路线清晰。',
      '景点介绍抓一个特色即可，不要写成百科。',
      '注意事项要具体（鞋子、拥挤、雨伞）。',
    ],
  },
  {
    id: 'w-07',
    title: 'Should Teenagers Do Housework?',
    difficulty: 2,
    prompt:
      '有些家长认为中学生应以学习为主，不必做家务；也有人认为做家务对学生成长有益。请你写一篇英语短文，谈谈你的看法。',
    requirements: [
      '表明你的观点',
      '说明做家务的好处',
      '回应“影响学习”的担忧',
      '给出建议',
    ],
    keyPoints: [
      { label: '表明观点', patterns: ['\\bi (think|believe|agree)\\b', '\\bin my opinion\\b', '\\bshould\\b'] },
      { label: '好处（责任/独立/体谅父母）', patterns: ['\\bresponsib', '\\bindependen', '\\bunderstand\\b', '\\bparents?\\b', '\\bskill\\b'] },
      { label: '回应影响学习的担忧', patterns: ['\\bhowever\\b', '\\bwhile\\b', '\\bdo not take\\b', '\\bbalance\\b', '\\btoo much\\b'] },
      { label: '给出建议', patterns: ['\\bsuggest\\b', '\\badvise\\b', '\\bshould\\b', '\\bdivide\\b', '\\bweekend\\b'] },
    ],
    sample: `Some parents believe that teenagers should focus only on study, but I think doing housework is also important.

First, housework teaches responsibility. When students cook a meal or clean a room, they learn that a family depends on everyone's effort. Second, these skills are necessary for independent life. A student who can wash clothes and manage a simple meal will adapt more easily when living away from home. Finally, helping at home helps us understand how much our parents do for us.

Some worry that housework takes time away from study. However, a reasonable amount—perhaps twenty minutes a day—will not harm grades. In fact, a break from books can improve concentration.

In my opinion, families should share chores fairly, and students should do at least one task regularly. Learning to live well is as important as learning to pass exams.`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '用 First/Second/Finally 组织理由，逻辑清楚。',
      '回应担忧时给出“合理数量”的具体方案，比空说“不冲突”更有力。',
      '结尾把“生活能力”和“考试”并列，升华主题。',
    ],
  },
  {
    id: 'w-08',
    title: 'Learning from Failure',
    difficulty: 2,
    prompt:
      '你校英语演讲比赛的主题是“Learning from Failure”。请你写一篇演讲稿，结合自己的经历谈谈如何面对失败。',
    requirements: [
      '讲述一次失败经历',
      '说明你从中学到了什么',
      '给听众提出建议',
      '用合适的方式结尾',
    ],
    keyPoints: [
      { label: '讲述失败经历', patterns: ['\\bi (failed|lost|did not)\\b', '\\bonce\\b', '\\blast year\\b', '\\bcompetition\\b'] },
      { label: '学到的东西', patterns: ['\\blearn', '\\brealiz', '\\bmistake', '\\bimprove\\b'] },
      { label: '给听众建议', patterns: ['\\bsuggest\\b', '\\badvise\\b', '\\bshould\\b', '\\bnever give up\\b', '\\btry again\\b'] },
      { label: '结尾', patterns: ['\\bthank you\\b', '\\bin conclusion\\b', '\\bremember\\b'] },
    ],
    sample: `Good morning, everyone. Today I want to talk about learning from failure.

Last year, I entered the school speech competition. I practiced for weeks and was sure I would win. But on the day, I forgot my lines in the middle of the speech. I stood there in silence, and finally left the stage. I felt embarrassed and wanted to give up.

A few days later, my teacher asked me a simple question: "What would you do differently?" I realized that I had memorized every word but never practiced in front of an audience. I joined a drama club to practice speaking in front of others. This year, I entered the competition again—and came third.

Failure is not the opposite of success; it is part of it. My advice is simple: ask what went wrong, change one thing, and try again. Thank you.`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '演讲稿要有称呼、互动和结尾致谢。',
      '失败经历要具体（忘词、沉默、离场），才能打动人。',
      '建议只讲一条并讲透，比列五条更有说服力。',
    ],
  },
  {
    id: 'w-09',
    title: 'A Letter to the Principal',
    difficulty: 2,
    prompt:
      '假定你是李华，你校食堂最近排队时间过长、菜品单一。请给校长写一封信，反映问题并提出建议。',
    requirements: [
      '说明写信目的',
      '描述两个具体问题',
      '提出至少两条建议',
      '表达希望改进的愿望',
    ],
    keyPoints: [
      { label: '写信目的', patterns: ['\\bwrite\\b', '\\bcomplain\\b', '\\bproblem\\b', '\\bsuggest\\b'] },
      { label: '问题一（排队久）', patterns: ['\\bqueue', '\\bwait', '\\bline\\b', '\\bcrowd'] },
      { label: '问题二（菜品单一）', patterns: ['\\bvariety\\b', '\\bsame\\b', '\\bdish', '\\bchoice\\b'] },
      { label: '建议', patterns: ['\\bsuggest\\b', '\\brecommend\\b', '\\bcould\\b', '\\bmore windows\\b', '\\bmenu\\b'] },
      { label: '希望改进', patterns: ['\\bhope\\b', '\\bimprove\\b', '\\blook forward\\b'] },
    ],
    sample: `Dear Mr. Wang,

I am writing to share some concerns about our school canteen and to offer a few suggestions.

Recently, the queues at lunchtime have become very long. Many students spend more than twenty minutes waiting, which leaves little time to eat and rest. In addition, the menu offers limited variety. The same dishes appear almost every day, and students who prefer vegetables or lighter meals have few choices.

I would like to suggest opening an extra serving window during the busiest period and introducing a weekly menu with more choices. It might also help to allow students to order meals in advance through the school app.

I hope these suggestions will be considered. A better canteen would improve students' health and make our school life more pleasant.

Yours sincerely,
Li Hua`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '建议信语气要礼貌、建设性，避免只抱怨。',
      '问题与建议一一对应，结构更清晰。',
      '结尾表达希望，不要用命令语气。',
    ],
  },
  {
    id: 'w-10',
    title: 'Short Videos and Teenagers',
    difficulty: 3,
    prompt:
      '越来越多的青少年每天花大量时间刷短视频。请你写一篇英语短文，分析这一现象的原因、影响，并提出你的建议。',
    requirements: [
      '分析短视频受欢迎的原因',
      '说明其积极和消极影响',
      '提出合理使用建议',
      '得出结论',
    ],
    keyPoints: [
      { label: '受欢迎的原因', patterns: ['\\bshort\\b', '\\bvideo', '\\bconvenien', '\\binteresting', '\\bquick\\b'] },
      { label: '积极影响', patterns: ['\\blearn\\b', '\\bcreative\\b', '\\bknowledge\\b', '\\bhelpful\\b', '\\buseful\\b', '\\bteach'] },
      { label: '消极影响', patterns: ['\\bdistract', '\\bwaste\\b', '\\baddict', '\\bsleep\\b', '\\bfocus\\b', '\\blose track\\b', '\\bstay up\\b', '\\bconcentrat', '\\bunhealthy\\b'] },
      { label: '使用建议', patterns: ['\\blimit\\b', '\\bset\\b', '\\btime\\b', '\\bsuggest\\b', '\\bcontrol\\b'] },
      { label: '结论', patterns: ['\\bin conclusion\\b', '\\btherefore\\b', '\\bbalance\\b', '\\bwise\\b'] },
    ],
    sample: `Short videos have become part of daily life for many teenagers. Why are they so popular? They are short, easy to watch and endlessly entertaining. A single swipe brings a new joke, recipe or news clip, so it is easy to keep watching.

These videos can be useful. They introduce new ideas, teach practical skills and offer a quick way to relax. However, the negative effects are serious. Many teenagers lose track of time, stay up late and find it hard to concentrate on homework. Some videos spread false information or encourage unhealthy comparisons.

In my view, teenagers should set a daily time limit and keep phones out of the bedroom. Schools and parents can also recommend high-quality channels instead of simply banning the apps.

In conclusion, short videos are a tool, not a way of life. Used wisely, they can inform and entertain; used carelessly, they steal our time.`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '原因—影响（正反）—建议—结论，四段结构最稳。',
      '消极影响要落到具体行为（熬夜、注意力、错误信息）。',
      '结论用“工具而非生活方式”形成对比。',
    ],
  },
  {
    id: 'w-11',
    title: 'An English Drama Festival Notice',
    difficulty: 1,
    prompt:
      '假定你是校学生会成员李华。学校将举办英语戏剧节，请写一则英文通知，告知活动安排并鼓励同学参加。',
    requirements: [
      '说明活动时间和地点',
      '介绍活动内容',
      '说明报名方式或截止日期',
      '鼓励同学参加',
    ],
    keyPoints: [
      { label: '时间地点', patterns: ['\\b(next|this)\\b', '\\bfriday\\b', '\\bhall\\b', '\\btheatre\\b', '\\bauditorium\\b'] },
      { label: '活动内容', patterns: ['\\bplay\\b', '\\bperform', '\\bdrama\\b', '\\bshow\\b'] },
      { label: '报名方式/截止日期', patterns: ['\\bsign up\\b', '\\bregister\\b', '\\bbefore\\b', '\\bdeadline\\b', '\\broom\\b'] },
      { label: '鼓励参加', patterns: ['\\bwelcome\\b', '\\bjoin\\b', '\\bencourage\\b', "\\bdon't miss\\b"] },
    ],
    sample: `Notice

The Student Union is pleased to announce that our annual English Drama Festival will be held on Friday, 15th December, in the school auditorium. The event will start at 6 p.m. and last about two hours.

Each class will perform a short play in English. We will also have a guest performance by the university drama club and a prize for the best actor and actress. It will be a wonderful chance to practice English and enjoy great stories.

Students who wish to perform should sign up at the Student Union office before 8th December. Each group should prepare a five-minute play and submit its title by email.

Everyone is welcome to watch. Don't miss this chance to enjoy an evening of creativity and laughter!

The Student Union`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '通知要有标题、正文和落款，信息要完整。',
      '时间、地点、报名截止日期必须写清楚。',
      '语气正式中带热情，结尾用 Don\'t miss ... 增强吸引力。',
    ],
  },
  {
    id: 'w-12',
    title: 'A Book Recommendation',
    difficulty: 2,
    prompt:
      '假定你是李华，你校英文报“好书推荐”栏目正在征稿。请推荐一本你喜欢的英文书（或英文译本），介绍内容并说明推荐理由。',
    requirements: [
      '介绍书名和作者',
      '简述书的内容',
      '说明推荐理由',
      '给出阅读建议',
    ],
    keyPoints: [
      { label: '书名作者', patterns: ['\\bbook\\b', '\\bwritten by\\b', '\\bauthor\\b', '\\bnovel\\b'] },
      { label: '内容简介', patterns: ['\\bstory\\b', '\\btells\\b', '\\bmain character\\b', '\\babout\\b'] },
      { label: '推荐理由', patterns: ['\\brecommend\\b', '\\bmoving\\b', '\\binteresting\\b', '\\blesson\\b', '\\bunderstand\\b'] },
      { label: '阅读建议', patterns: ['\\bread\\b', '\\bnote\\b', '\\bdictionary\\b', '\\btime\\b', '\\bchapter\\b'] },
    ],
    sample: `I would like to recommend the novel Wonder by R. J. Palacio. It tells the story of August, a ten-year-old boy with a facial difference, who attends a mainstream school for the first time. The story is told from several characters' points of view, including August, his sister and his classmates.

I recommend this book because it is both moving and honest. It shows how kindness can change a person's life, but it does not pretend that people are always kind. Reading it helped me think about how I treat others and how quick judgments can hurt.

If you decide to read it, I suggest keeping a notebook of your favourite sentences and discussing them with a friend. The language is not difficult, so it is suitable for English learners.

I hope you will enjoy it as much as I did.`,
    minWords: 120,
    maxWords: 150,
    tips: [
      '书评要“介绍—理由—建议”三层，不要大段复述情节。',
      '推荐理由落到“对我有什么影响”，比只说“很好看”更有说服力。',
      '阅读建议要针对英语学习者，具体可操作。',
    ],
  },
];
