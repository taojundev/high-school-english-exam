import type { SummaryItem } from '../types';

/** 概要写作：阅读约 250 词短文，写 60 词左右概要。 */
export const summary: SummaryItem[] = [
  {
    id: 's-01',
    title: 'Bike Sharing: Promise and Problems',
    difficulty: 1,
    prompt: 'Write a summary of the passage in about 60 words.',
    text: `Bike sharing has spread quickly in cities around the world. With a smartphone, riders can unlock a bike, travel a short distance, and leave it near their destination. For many commuters, it is cheaper and faster than taking a bus or taxi, and it produces no air pollution. City governments have welcomed the service because it reduces traffic and helps people exercise.

However, the rapid growth of bike sharing has created problems. In some neighborhoods, bikes are left on sidewalks, blocking pedestrians. Companies compete for space, and damaged bikes are often abandoned. Some riders ignore traffic rules, which has led to accidents. Residents have complained that the streets look untidy.

Several cities have responded with new rules. Companies must provide enough parking areas and remove broken bikes quickly. Users may be asked to park in marked zones or lose part of their deposit. Some cities have limited the number of bikes that each company can operate.

Supporters say these rules are necessary for bike sharing to survive. They argue that the service offers a flexible and green way to travel, especially for short trips. Critics worry that too many rules will make it harder for smaller companies and reduce choice. Most people agree on one point: bike sharing works best when companies, governments and riders share responsibility.`,
    keyPoints: [
      { label: '共享单车在全球城市迅速普及', patterns: ['\\bbike shar', '\\bshared bike', '\\bspread', '\\bpopular'] },
      { label: '便利、便宜、环保，减少交通与污染', patterns: ['\\bconvenien', '\\bcheap', '\\bpollut', '\\btraffic', '\\bgreen\\b'] },
      { label: '乱停、损坏、违规等问题', patterns: ['\\bpark', '\\bdamag', '\\bblock', '\\baccident', '\\brules?\\b'] },
      { label: '城市出台规则，公司负责停车与维修', patterns: ['\\brules?\\b', '\\bregulat', '\\bcompan', '\\bparking\\b'] },
      { label: '各方共同负责才能持续', patterns: ['\\bshare\\w* responsibility\\b', '\\bcooperat', '\\btogether\\b'] },
    ],
    sample:
      'Bike sharing has spread rapidly because it is convenient, cheap and green. However, careless parking, damaged bikes and rule-breaking cause accidents and untidy streets. Cities are introducing rules requiring companies to provide parking and remove broken bikes. The service can succeed only if companies, governments and riders share responsibility. With clear rules, it can remain a green option.',
    minWords: 50,
    maxWords: 80,
    tips: [
      '概要要覆盖“兴起原因—问题—应对—结论”四条主线。',
      '不要逐条罗列细节，用 however、as a result 等连接词压缩逻辑。',
      '避免照抄原文长句，用自己的话概括。',
    ],
  },
  {
    id: 's-02',
    title: 'How Plants Talk',
    difficulty: 3,
    prompt: 'Write a summary of the passage in about 60 words.',
    text: `Plants cannot run away from danger, but they are not passive. When a plant is attacked by insects, it releases chemicals into the air. These chemicals can warn nearby plants, which then produce substances that make their leaves less tasty to insects. In this way, a plant under attack may protect its neighbors.

Plants also communicate through their roots. Scientists have found that roots can release chemicals that affect the growth of other plants. In some forests, trees are connected by networks of fungus in the soil. Water and nutrients can move through these networks, and trees may even share resources with young trees that are growing in the shade.

This research is changing the way scientists think about forests. A forest is not simply a collection of individual trees; it is a community connected by underground systems. Some scientists describe the oldest trees as "mother trees" because they seem to support younger ones.

The discoveries may also help farmers. If we understand how plants signal danger, we might be able to protect crops without using as many chemicals. However, scientists warn against imagining that plants think or feel like animals. Their communication is chemical, not conscious. There is still much to learn about how these signals work and when they matter most.`,
    keyPoints: [
      { label: '植物受虫害时释放化学物质', patterns: ['\\bchemical', '\\binsect', '\\brelease'] },
      { label: '警告邻近植物，使其产生防护物质', patterns: ['\\bwarn', '\\bneighbo', '\\bprotect', '\\bdefen'] },
      { label: '根系和真菌网络可传递水分、养分', patterns: ['\\broots?\\b', '\\bfung', '\\bnetwork', '\\bnutrient'] },
      { label: '森林是被地下系统连接的整体', patterns: ['\\bcommunity\\b', '\\bconnected\\b', '\\bforest'] },
      { label: '研究有助于农业，但植物并非有意识地思考', patterns: ['\\bfarm', '\\bcrops?\\b', '\\bnot conscious\\b', '\\bchemical\\b'] },
    ],
    sample:
      'Plants release chemicals when attacked by insects, warning nearby plants to protect themselves. Through roots and fungus networks, trees exchange water and nutrients, forming connected forest communities. This knowledge may help farmers protect crops with fewer chemicals, but scientists stress that plant communication is chemical rather than conscious. Much remains to be discovered about these signals.',
    minWords: 50,
    maxWords: 80,
    tips: [
      '区分“现象”与“意义”：前半部分讲植物如何交流，后半部分讲研究价值与限制。',
      '用 through、while、but 等词把机制和意义连起来。',
      '不要加入自己的观点或原文没有的例子。',
    ],
  },
  {
    id: 's-03',
    title: 'A School Without Walls',
    difficulty: 2,
    prompt: 'Write a summary of the passage in about 60 words.',
    text: `At a school in Denmark, students spend two days a week outside the classroom. They visit museums, businesses and parks, and they work on projects rather than listening to lectures. The school calls itself "a school without walls."

In one project, students were asked to improve a local playground. They interviewed children, measured the space, and designed a new plan. They then presented their ideas to the city council. Teachers guided the process but did not give answers. Students had to decide what information they needed and how to find it.

Supporters say the approach increases motivation. Students see why they are learning and remember more because they use knowledge in real situations. Teachers also report that students become better at working in teams and explaining their ideas.

The model has challenges. It requires time, money and strong relationships with local organizations. Some parents worry that students may not cover enough material for national exams. Teachers need training to guide projects without taking over.

The school does not claim that traditional lessons are useless. It combines projects with regular classes in maths and languages. Its leaders argue that the aim of education is not only to pass exams but to prepare young people for life. For them, the city itself is a classroom.`,
    keyPoints: [
      { label: '丹麦一所学校每周两天在教室外学习', patterns: ['\\bdenmark\\b', '\\boutside\\b', '\\btwo days\\b', '\\bwithout walls\\b'] },
      { label: '通过真实项目学习，教师只引导', patterns: ['\\bproject', '\\bguide', '\\breal\\b'] },
      { label: '提高动力、团队合作与表达能力', patterns: ['\\bmotivat', '\\bteam', '\\bremember', '\\bexplain'] },
      { label: '挑战：时间、金钱、考试覆盖与教师培训', patterns: ['\\bcost', '\\bmoney\\b', '\\bexam', '\\btrain', '\\bchalleng'] },
      { label: '项目与常规课程结合，为生活做准备', patterns: ['\\bcombin', '\\btraditional\\b', '\\blife\\b', '\\bexam'] },
    ],
    sample:
      'A Danish "school without walls" sends students outside to learn through real projects, with teachers guiding rather than lecturing. This raises motivation and improves teamwork, but costs money and raises concerns about exam coverage and teacher training. The school combines projects with regular classes, aiming to prepare students for life, not just exams.',
    minWords: 50,
    maxWords: 80,
    tips: [
      '先概括做法，再写效果与挑战，最后写学校的平衡立场。',
      '不要遗漏“并非完全否定传统课堂”这一层。',
      '控制字数，避免列举博物馆、企业等细节。',
    ],
  },
  {
    id: 's-04',
    title: 'The Art of Saying No',
    difficulty: 2,
    prompt: 'Write a summary of the passage in about 60 words.',
    text: `Many people find it difficult to say no. They agree to extra work, social invitations and requests from friends, even when they are already busy. At first, saying yes feels kind. Over time, however, it can lead to stress, tiredness and resentment. People who never say no may find that they have no time for their own priorities.

Psychologists say that saying no is a skill, not a sign of selfishness. Every yes is also a no to something else, because time and energy are limited. If you agree to everything, you may end up doing nothing well. Setting limits can actually protect relationships, because honest communication is better than silent frustration.

Saying no does not have to be rude. A clear but polite response often works best: explain briefly why you cannot help, and suggest another time or another person. For example, "I can't finish this by Friday, but I could look at it on Monday." Avoid long excuses, which can sound like invitations to negotiate.

It is also important to say no to yourself. That might mean turning down a new project when your schedule is full, or leaving your phone alone while you study. The goal is not to avoid all commitments but to choose them consciously. People who set boundaries often have more energy for the things they truly value.`,
    keyPoints: [
      { label: '很多人难以拒绝，导致压力与怨恨', patterns: ['\\bsay(ing)? no\\b', '\\bstress', '\\bresent', '\\btired'] },
      { label: '拒绝是一种技能，不是自私', patterns: ['\\bskill\\b', '\\bselfish', '\\bnot a sign\\b'] },
      { label: '时间精力有限，每个“是”都意味着对别的事说“不”', patterns: ['\\blimited\\b', '\\btime\\b', '\\benergy\\b', '\\bpriorit'] },
      { label: '礼貌而清晰地拒绝，给出替代方案', patterns: ['\\bpolite', '\\bclear', '\\balternative', '\\banother\\b'] },
      { label: '也要对自己说“不”，有意识地选择承诺', patterns: ['\\byourself\\b', '\\bcommit', '\\bboundar', '\\bconscious'] },
    ],
    sample:
      'Many people say yes too often, causing stress and resentment. Psychologists argue that saying no is a skill, not selfishness, since time and energy are limited. A polite, clear refusal with an alternative can protect relationships. People should also decline commitments consciously, including distractions, so they have energy for what truly matters.',
    minWords: 50,
    maxWords: 80,
    tips: [
      '概要应包含“问题—观点—方法—态度”四部分。',
      '不要照抄例句 "I can\'t finish this by Friday"。',
      '用 since、so、while 等连接词体现因果与转折。',
    ],
  },
  {
    id: 's-05',
    title: 'Small Shops, Big Impact',
    difficulty: 3,
    prompt: 'Write a summary of the passage in about 60 words.',
    text: `On many high streets, small independent shops are closing. Large chains and online stores offer lower prices and greater convenience, and customers increasingly choose them. Some people fear that every town will soon look the same, with the same coffee shops and supermarkets on every corner.

Small shops, however, offer things that chains often cannot. Owners know their customers by name and can recommend products based on personal experience. A local bookshop may host readings; a family bakery may sell bread made with local flour. These shops give a neighborhood character and provide jobs that keep money in the local economy.

Some small businesses are finding new ways to survive. They sell online, collaborate with other shops, or run events that bring people together. A hardware store might offer repair classes; a café might display work by local artists. These activities turn shopping into an experience rather than a simple transaction.

Customers can help by choosing local shops when possible, but price matters, especially for families with limited budgets. It is unrealistic to expect everyone to pay much more for the same product. A balanced approach may be best: support small shops for special purchases and services, while accepting that chains and online stores will remain part of daily life. The goal is not to stop change but to keep choice alive.`,
    keyPoints: [
      { label: '独立小店因连锁店和网购而关闭', patterns: ['\\bsmall (independent )?shops?\\b', '\\bclos', '\\bchains?\\b', '\\bonline\\b'] },
      { label: '小店提供个性化服务、地方特色与就业', patterns: ['\\bpersonal\\b', '\\bcharacter\\b', '\\bjobs?\\b', '\\blocal\\b'] },
      { label: '一些小店通过网购、合作、活动求生存', patterns: ['\\bonline\\b', '\\bcollaborat', '\\bevent', '\\bsurviv'] },
      { label: '顾客可在能力范围内支持本地小店', patterns: ['\\bcustomer', '\\bsupport\\b', '\\blocal\\b'] },
      { label: '但价格重要，应平衡选择而非阻止变化', patterns: ['\\bprice\\b', '\\bbudget', '\\bbalance', '\\bchoice\\b'] },
    ],
    sample:
      'Independent shops are closing as chains and online stores offer lower prices. Yet small shops provide personal service, local character and jobs, and some survive through online sales, partnerships and events. Customers can support them when affordable, but price still matters. The aim is to preserve choice, not to stop change.',
    minWords: 50,
    maxWords: 80,
    tips: [
      '注意作者立场是“平衡”，不是一味支持小店。',
      '把“小店价值”和“现实价格因素”都写进概要。',
      '最后一句点明“保留选择而非阻止变化”。',
    ],
  },
];
