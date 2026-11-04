import type { ClozeItem } from '../types';

const b = (options: string[], answer: number, explanation: string, tags: string[]) => ({
  options,
  answer,
  explanation,
  tags,
});

/** 完形填空：每篇 15 空，语篇类型覆盖记叙、说明、议论。 */
export const cloze: ClozeItem[] = [
  {
    id: 'c-01',
    title: 'The School Garden',
    difficulty: 1,
    text: `For years, the corner of our school yard was just a patch of dry earth. Then last spring, our biology teacher, Ms. Chen, suggested turning it into a garden. At first, few students were (1) ______. We imagined long hours of digging in the sun. But Ms. Chen promised that we would (2) ______ the work in small teams, and that the garden would be ours to design.

Our team chose vegetables. We read about which plants grow well together and learned that tomatoes can (3) ______ insects away from cabbages. We also discovered that the soil needed more nutrients, so we started a compost box. Every lunchtime, someone would (4) ______ food scraps to the box instead of throwing them away.

The biggest challenge was water. During the dry weeks, the plants began to (5) ______. We solved the problem by collecting rainwater from the roof. A simple pipe led the water into two large barrels. It was a (6) ______ solution, but it worked.

By September, we had more vegetables than we could eat. We (7) ______ the extra produce to a local shelter. Seeing how much people appreciated the fresh food made us (8) ______ that the garden was about more than biology. It had become a place where students worked together and (9) ______ responsibility for something real.

This year, other classes want to join. Ms. Chen says the garden will (10) ______ to grow, but we need a new plan. We are now (11) ______ building a small greenhouse so that we can grow vegetables in winter. The project will (12) ______ money, so we are organizing a sale of homemade jam. We hope the whole school will (13) ______ from what we have learned.

Looking back, I am (14) ______ of what we created. The garden has taught us a (15) ______ that no textbook could: good things grow when people work together.`,
    blanks: [
      b(['curious', 'enthusiastic', 'anxious', 'absent'], 1, '前文提出把荒地改成花园，后文却说“想象在太阳下挖土”，说明起初很少有学生“热情高涨”。', ['完形-上下文', '完形-形容词']),
      b(['divide', 'avoid', 'finish', 'repeat'], 0, '分成小组“分担”工作，与后文“花园由我们设计”呼应。', ['完形-动词', '完形-逻辑']),
      b(['keep', 'carry', 'drive', 'invite'], 0, 'keep insects away from ... 是固定搭配，意为“让昆虫远离……”。', ['完形-搭配', '完形-动词']),
      b(['carry', 'throw', 'return', 'sell'], 0, '把食物残渣“搬/带到”堆肥箱，而不是扔掉。', ['完形-动词', '完形-逻辑']),
      b(['suffer', 'increase', 'disappear', 'flower'], 0, '干旱数周，植物开始“受苦/枯萎”，于是后文才想办法收集雨水。', ['完形-上下文', '完形-动词']),
      b(['temporary', 'simple', 'modern', 'popular'], 1, '用屋顶雨水和两个大桶，办法很“简单”，但有效。', ['完形-形容词', '完形-转折']),
      b(['donated', 'sold', 'delivered', 'lent'], 0, '把多余蔬菜“捐赠”给收容所，符合公益语境。', ['完形-动词', '完形-语义']),
      b(['realize', 'pretend', 'doubt', 'forget'], 0, '看到别人感激，我们“意识到”花园不只是生物课。', ['完形-动词', '完形-逻辑']),
      b(['took', 'avoided', 'shared', 'assigned'], 0, 'take responsibility for ... 是固定搭配，意为“对……负责”。', ['完形-搭配', '完形-动词']),
      b(['continue', 'fail', 'wait', 'refuse'], 0, '其他班级想加入，花园将继续“扩大/发展”，但需要新计划。', ['完形-动词', '完形-逻辑']),
      b(['considering', 'regretting', 'avoiding', 'imagining'], 0, '正在“考虑”建温室，与后文筹钱相呼应。', ['完形-动词', '完形-逻辑']),
      b(['require', 'save', 'earn', 'reduce'], 0, '项目需要“资金”，所以要卖自制果酱筹钱。', ['完形-动词', '完形-语义']),
      b(['benefit', 'suffer', 'escape', 'learn'], 0, 'benefit from 表示“从……中受益”，符合作者希望全校受益的愿望。', ['完形-搭配', '完形-动词']),
      b(['proud', 'afraid', 'tired', 'ashamed'], 0, 'be proud of 表示“为……自豪”，与回顾成果的语气一致。', ['完形-搭配', '完形-情感']),
      b(['lesson', 'story', 'joke', 'rule'], 0, '花园教会我们教科书无法传授的“一课”，与末句总结呼应。', ['完形-名词', '完形-主旨']),
    ],
  },
  {
    id: 'c-02',
    title: 'Learning to Sign',
    difficulty: 2,
    text: `When I signed up for the community center's sign language class, I expected to learn a few gestures. I did not expect it to change the way I (1) ______.

Our teacher, Mr. Lewis, was deaf. On the first day, he did not speak at all. He (2) ______ himself using his hands, and an interpreter translated for us. I felt (3) ______ because I could not understand anything. For the first few weeks, my hands moved slowly and my face stayed (4) ______, which, I learned, is a problem: in sign language, facial expressions carry meaning.

Mr. Lewis taught us that signing is not simply English words (5) ______ into hand movements. It has its own grammar. For example, the order of words can change, and the space in front of the body can (6) ______ different people or places. I had to stop (7) ______ in Chinese and start thinking in pictures.

The most valuable part of the course was meeting deaf people from the community. They came to our class and told us about their lives. One woman explained how (8) ______ it was when shop assistants wrote notes instead of looking at her. Another described the (9) ______ of watching a play with a sign language interpreter.

On the last day, we performed a short story in sign language. I made several (10) ______, but the audience clapped warmly. More importantly, I could (11) ______ most of the conversation at the reception afterwards.

I am still a (12) ______, and I know I have a long way to go. But the class has made me more (13) ______ of the people around me. Now, when I see someone signing, I no longer (14) ______; I smile. Sometimes I even (15) ______ in.`,
    blanks: [
      b(['communicate', 'study', 'travel', 'exercise'], 0, '学习手语改变的是“交流”方式，全文围绕沟通展开。', ['完形-主旨', '完形-动词']),
      b(['introduced', 'described', 'enjoyed', 'excused'], 0, '老师用手“介绍”自己，符合第一天的场景。', ['完形-动词', '完形-上下文']),
      b(['nervous', 'angry', 'bored', 'confident'], 0, '什么都看不懂，自然感到“紧张”。', ['完形-情感', '完形-形容词']),
      b(['still', 'bright', 'relaxed', 'hidden'], 0, '脸保持“不动/没有表情”，而手语中面部表情也承载意义，所以是问题。', ['完形-形容词', '完形-上下文']),
      b(['translated', 'divided', 'turned', 'copied'], 0, '手语不是把英语单词“翻译”成手势，而是有自己的语法。', ['完形-动词', '完形-逻辑']),
      b(['represent', 'replace', 'protect', 'record'], 0, '身体前方的空间可以“代表”不同的人或地点。', ['完形-动词', '完形-语义']),
      b(['thinking', 'speaking', 'writing', 'reading'], 0, 'stop doing sth.；作者要停止“用中文思考”，开始用画面思考。', ['完形-非谓语', '完形-上下文']),
      b(['frustrating', 'exciting', 'relaxing', 'amusing'], 0, '店员写纸条而不看她，这种经历令人“沮丧”。', ['完形-情感', '完形-形容词']),
      b(['joy', 'fear', 'duty', 'challenge'], 0, '有手语翻译看戏，是一种“快乐”，与前文负面经历形成对比。', ['完形-名词', '完形-情感']),
      b(['mistakes', 'friends', 'decisions', 'promises'], 0, '作者犯了几个“错误”，但观众仍热情鼓掌，语意转折。', ['完形-名词', '完形-转折']),
      b(['follow', 'avoid', 'lead', 'change'], 0, '能“跟上”招待会上的大部分对话，说明进步。', ['完形-动词', '完形-逻辑']),
      b(['beginner', 'teacher', 'expert', 'volunteer'], 0, 'still a beginner 与“还有很长的路要走”呼应。', ['完形-名词', '完形-逻辑']),
      b(['aware', 'afraid', 'tired', 'proud'], 0, 'be aware of 表示“意识到/关注到”，与后文主动微笑、加入呼应。', ['完形-搭配', '完形-形容词']),
      b(['stare', 'smile', 'leave', 'whisper'], 0, '以前会“盯着看”，现在改为微笑，体现态度的转变。', ['完形-动词', '完形-对比']),
      b(['join', 'give', 'take', 'move'], 0, 'join in 表示“加入其中”，与全文学习手语、参与交流的主题一致。', ['完形-搭配', '完形-动词']),
    ],
  },
  {
    id: 'c-03',
    title: 'Sleep and Memory',
    difficulty: 3,
    text: `Students often stay up late before exams, believing that more study time means better results. Research on sleep, however, suggests the (1) ______. During sleep, the brain does not simply rest; it (2) ______ and stores what we have learned during the day.

In one experiment, two groups of students learned a list of words. One group slept for eight hours, while the other stayed awake. The next morning, the sleeping group could (3) ______ far more words. Brain scans showed that the sleeping brain was (4) ______ the day's experiences, strengthening the connections between brain cells.

Scientists have also found that different stages of sleep (5) ______ in different ways. Deep sleep seems to help with facts and information, while REM sleep, the stage in which we dream, may support creativity. People who are woken during REM sleep often (6) ______ to solve problems that require flexible thinking.

Lack of sleep affects more than memory. It can (7) ______ the immune system, make us impatient, and (8) ______ the risk of accidents. Teenagers, whose bodies naturally want to sleep later, are especially (9) ______ to suffer when school starts early.

So what can students do? Experts recommend keeping a (10) ______ sleep schedule, even at weekends. Screens should be (11) ______ for an hour before bed, because the light they give off can (12) ______ the release of sleep hormones. Caffeine after lunch is another (13) ______ worth changing.

None of this means that sleep is a (14) ______ for hard work. But it does mean that a good night's sleep is not a waste of time. It may be the most (15) ______ revision tool we have.`,
    blanks: [
      b(['opposite', 'same', 'answer', 'problem'], 0, '研究发现与“熬夜多学就更好”相反，后文解释睡眠帮助记忆。', ['完形-逻辑', '完形-名词']),
      b(['organizes', 'hides', 'invents', 'forgets'], 0, '睡眠中大脑“整理”并储存白天所学。', ['完形-动词', '完形-主旨']),
      b(['recall', 'spell', 'invent', 'copy'], 0, '睡了八小时的一组能“回忆”出更多单词。', ['完形-动词', '完形-实验']),
      b(['replaying', 'ignoring', 'recording', 'changing'], 0, '脑扫描显示睡眠中的大脑在“重放”白天的经历。', ['完形-动词', '完形-科学']),
      b(['contribute', 'compete', 'refuse', 'belong'], 0, '不同睡眠阶段以不同方式“起作用/有贡献”，后文分别说明。', ['完形-动词', '完形-逻辑']),
      b(['struggle', 'manage', 'decide', 'promise'], 0, '被从 REM 睡眠中叫醒的人往往“难以”解决需要灵活思维的问题。', ['完形-动词', '完形-逻辑']),
      b(['weaken', 'protect', 'strengthen', 'change'], 0, '缺觉会“削弱”免疫系统，与后文负面影响并列。', ['完形-动词', '完形-搭配']),
      b(['increase', 'reduce', 'avoid', 'measure'], 0, '缺觉会“增加”事故风险。', ['完形-动词', '完形-搭配']),
      b(['likely', 'unwilling', 'afraid', 'unable'], 0, 'be likely to do sth. 表示“可能做某事”；青少年尤其容易受影响。', ['完形-搭配', '完形-形容词']),
      b(['regular', 'strict', 'short', 'changing'], 0, '专家建议保持“规律”的睡眠时间表。', ['完形-形容词', '完形-建议']),
      b(['avoided', 'used', 'checked', 'repaired'], 0, '睡前应“避免”看屏幕，因为光线会延迟睡眠激素释放。', ['完形-动词', '完形-建议']),
      b(['delay', 'speed', 'allow', 'record'], 0, '屏幕光线会“延迟”睡眠激素的释放。', ['完形-动词', '完形-因果']),
      b(['habit', 'answer', 'rule', 'medicine'], 0, '午饭后摄入咖啡因是另一个值得改变的“习惯”。', ['完形-名词', '完形-建议']),
      b(['substitute', 'reason', 'result', 'reward'], 0, '睡眠不能“替代”努力，而是提高效率。', ['完形-名词', '完形-逻辑']),
      b(['effective', 'expensive', 'difficult', 'popular'], 0, '良好睡眠可能是最“有效”的复习工具，总结全文。', ['完形-形容词', '完形-主旨']),
    ],
  },
  {
    id: 'c-04',
    title: 'The Soap Seller',
    difficulty: 2,
    text: `When Maya's grandmother taught her to make soap, she never imagined it would become a business. At first, soap-making was just a hobby. Maya gave bars to friends, who then asked for more. Soon, her small kitchen was (1) ______ with bottles and bowls.

Maya decided to sell her soap at the local weekend market. She was (2) ______ on the first morning. She had spent weeks (3) ______ her display, but she had no idea whether anyone would stop. The first customer bought two bars and said the lavender soap reminded her of her mother's garden. That (4) ______ gave Maya the confidence to continue.

The market taught her lessons that a textbook could not. She learned to keep (5) ______ records of what sold and what did not. She also learned that customers value (6) ______; when a batch of soap was not perfect, she told them, and they (7) ______ it. Within a year, she had regular customers who (8) ______ soap for weddings and hotels.

Maya now (9) ______ two assistants, both students from her old school. She pays them fairly and (10) ______ them to make soap themselves. She has also started using (11) ______ packaging, which costs a little more but (12) ______ waste. "It is not just about selling," she says. "It is about (13) ______ something that people trust."

Her advice to other young people is simple: start small. "You don't need a perfect plan. You need to (14) ______ to your customers and be willing to change." Maya's next goal is to open a small shop, but she is in no (15) ______. She wants to grow at a speed she can manage.`,
    blanks: [
      b(['crowded', 'familiar', 'popular', 'careful'], 0, '厨房里“挤满”瓶瓶罐罐，说明生意起步、空间不够。', ['完形-形容词', '完形-上下文']),
      b(['nervous', 'angry', 'bored', 'certain'], 0, '第一次去市集摆摊，不知有没有人停步，所以“紧张”。', ['完形-情感', '完形-形容词']),
      b(['preparing', 'copying', 'cleaning', 'hiding'], 0, 'spend time doing sth.；她花数周“准备”展台。', ['完形-非谓语', '完形-动词']),
      b(['comment', 'price', 'mistake', 'warning'], 0, '顾客关于薰衣草香皂的那句“评论”给了她信心。', ['完形-名词', '完形-指代']),
      b(['accurate', 'secret', 'short', 'funny'], 0, '做生意要保存“准确”的销售记录。', ['完形-形容词', '完形-语义']),
      b(['honesty', 'speed', 'silence', 'competition'], 0, '下一句说香皂不完美时她会如实告知，说明顾客看重“诚实”。', ['完形-名词', '完形-上下文']),
      b(['appreciated', 'doubted', 'ignored', 'forgave'], 0, '顾客“欣赏”她的坦诚，与后文回头客增多呼应。', ['完形-动词', '完形-逻辑']),
      b(['ordered', 'borrowed', 'hid', 'refused'], 0, '固定顾客“订购”婚礼和酒店用皂。', ['完形-动词', '完形-语义']),
      b(['employs', 'misses', 'invites', 'teaches'], 0, 'Maya 现在“雇用”了两名助手，后文提到付工资。', ['完形-动词', '完形-上下文']),
      b(['trains', 'forces', 'asks', 'allows'], 0, '她“培训”助手自己制作香皂，体现授人以渔。', ['完形-动词', '完形-语义']),
      b(['recycled', 'expensive', 'colorful', 'imported'], 0, '使用“可回收”包装，与后文减少浪费相呼应。', ['完形-形容词', '完形-环保']),
      b(['reduces', 'creates', 'hides', 'measures'], 0, '可回收包装成本略高，但“减少”浪费。', ['完形-动词', '完形-转折']),
      b(['building', 'renting', 'closing', 'copying'], 0, '她追求的是“建立”一个人们信任的品牌，而不只是卖货。', ['完形-动词', '完形-主旨']),
      b(['listen', 'write', 'point', 'lie'], 0, 'listen to customers 表示“倾听顾客”，与“愿意改变”并列。', ['完形-搭配', '完形-建议']),
      b(['hurry', 'debt', 'doubt', 'mood'], 0, 'in no hurry 表示“不着急”，与“按自己能掌控的速度成长”呼应。', ['完形-搭配', '完形-逻辑']),
    ],
  },
  {
    id: 'c-05',
    title: 'A New City',
    difficulty: 2,
    text: `When I moved to Shanghai at fifteen, I was sure I would hate it. I had left my friends, my school, and the small town where I knew every street. For the first month, I (1) ______ to go out at weekends. I stayed in my room, (2) ______ through photos of my old life.

My mother finally (3) ______ that I join a weekend badminton club. I went only to stop her from (4) ______. On the first day, I sat alone on a bench, watching the others. Then a girl my age (5) ______ and asked if I wanted to play. Her name was Lin, and she was also new to the city.

We were not good at badminton. We (6) ______ the shuttlecock, laughed, and tried again. After the session, Lin (7) ______ walking to a noodle shop nearby. Over steaming bowls, we discovered that we both loved science fiction and hated mornings. By the time I got home, the city felt (8) ______ less strange.

Over the next year, Lin and I (9) ______ close friends. We studied together, (10) ______ about films, and celebrated each other's small victories. I also made other friends (11) ______ the club. Slowly, Shanghai stopped being a place I had been (12) ______ to and became a place I chose to call home.

I still miss my old town. But I have learned that friendship does not (13) ______ on how long you have known someone. It grows from shared time and (14) ______ acts of kindness. Sometimes, all it takes is someone asking, "Do you want to play?" I am (15) ______ that Lin asked me.`,
    blanks: [
      b(['refused', 'agreed', 'hoped', 'offered'], 0, '初到上海很抗拒，周末“拒绝”出门，与后文待在房间呼应。', ['完形-动词', '完形-情感']),
      b(['scrolling', 'walking', 'working', 'cooking'], 0, 'scroll through photos 表示“翻看照片”，符合待在房间的语境。', ['完形-动词', '完形-搭配']),
      b(['insisted', 'denied', 'forgot', 'regretted'], 0, '母亲“坚持”让作者参加羽毛球俱乐部，后文作者才去了。', ['完形-动词', '完形-逻辑']),
      b(['worrying', 'laughing', 'leaving', 'waiting'], 0, '作者去俱乐部只是为了让母亲“担心”少一点。', ['完形-动词', '完形-情感']),
      b(['approached', 'escaped', 'apologized', 'returned'], 0, '一个同龄女孩“走过来”问要不要一起打。', ['完形-动词', '完形-场景']),
      b(['missed', 'caught', 'threw', 'bought'], 0, '两人球技不好，没接住羽毛球，然后大笑再试。', ['完形-动词', '完形-上下文']),
      b(['suggested', 'avoided', 'imagined', 'denied'], 0, 'Lin“提议”去附近面馆，推动两人关系发展。', ['完形-动词', '完形-逻辑']),
      b(['slightly', 'hardly', 'equally', 'suddenly'], 0, '交到朋友后，城市“稍微”没那么陌生了，程度合理。', ['完形-副词', '完形-语义']),
      b(['became', 'met', 'left', 'missed'], 0, '接下来一年，两人“成为”好朋友。', ['完形-动词', '完形-时间']),
      b(['argued', 'agreed', 'asked', 'cared'], 0, '朋友之间会为电影“争论”，与“庆祝彼此的小胜利”并列。', ['完形-动词', '完形-语义']),
      b(['through', 'against', 'without', 'except'], 0, '通过俱乐部“结识”其他朋友，through 表示途径。', ['完形-介词', '完形-搭配']),
      b(['sent', 'invited', 'forced', 'compared'], 0, '上海从“被送来”的地方变成“自己选择”的家，形成对比。', ['完形-动词', '完形-对比']),
      b(['depend', 'insist', 'focus', 'spend'], 0, 'depend on 表示“取决于”，友谊不取决于认识时间长短。', ['完形-搭配', '完形-主旨']),
      b(['small', 'rare', 'difficult', 'famous'], 0, '友谊来自共处的时间和“小小的”善意，与全文温暖语气一致。', ['完形-形容词', '完形-主旨']),
      b(['grateful', 'sorry', 'afraid', 'surprised'], 0, 'be grateful that ... 表示“感激……”，回应 Lin 主动邀请。', ['完形-情感', '完形-形容词']),
    ],
  },
];
