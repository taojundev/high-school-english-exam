import type { ListeningShortItem } from '../types';

/** Extra short dialogues (ls-21 … ls-40) so four consecutive full papers need no repeats. */
export const listeningShortExtra: ListeningShortItem[] = [
  {
    id: 'ls-21',
    script: `M: Could you tell me when the next train to Suzhou leaves?
W: The 10:20 is delayed by fifteen minutes. You can wait on platform six.
M: Thanks. I'll get a coffee first.`,
    question: 'When will the next train to Suzhou leave?',
    options: ['At 10:05.', 'At 10:20.', 'At 10:35.', 'At 10:50.'],
    answer: 2,
    explanation: '原定 10:20，延误 15 分钟，因此 10:35 发车。',
    tags: ['听力-数字', '听力-时间'],
    difficulty: 1,
  },
  {
    id: 'ls-22',
    script: `W: I'm looking for a birthday present for my brother. He's just started learning photography.
M: The cameras are over there, but if he's a beginner, a good tripod might be more useful.
W: That's a good idea. He can borrow a camera from school.`,
    question: 'What will the woman probably buy?',
    options: ['A camera.', 'A tripod.', 'A school bag.', 'A photo album.'],
    answer: 1,
    explanation: '男士建议初学者先买三脚架，女士认可因为弟弟可以借相机。',
    tags: ['听力-建议', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-23',
    script: `M: Did you finish the history essay last night?
W: I wrote the introduction, but I fell asleep at eleven. I still need two more paragraphs.
M: You'd better start now. It's due at noon.`,
    question: 'What does the woman still need to do?',
    options: ['Write two more paragraphs.', 'Read the introduction.', 'Hand in the essay.', 'Go to sleep.'],
    answer: 0,
    explanation: '女士说还需要再写两段。',
    tags: ['听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-24',
    script: `W: Excuse me, is this seat taken?
M: No, please sit down. Actually, could you watch my bag for a minute? I need to find the ticket office.
W: Of course. I'll be here for the next twenty minutes.`,
    question: 'What does the man ask the woman to do?',
    options: ['Watch his bag.', 'Buy him a ticket.', 'Move to another seat.', 'Call the ticket office.'],
    answer: 0,
    explanation: '男士请女士帮看包，他去找售票处。',
    tags: ['听力-细节', '听力-行为'],
    difficulty: 1,
  },
  {
    id: 'ls-25',
    script: `M: How was the concert last night?
W: The music was wonderful, but the hall was so cold that I couldn't enjoy the second half.
M: That's a pity. I heard the singer was excellent.`,
    question: "What was the woman's main complaint?",
    options: ['The hall was too cold.', 'The singer was late.', 'The tickets were expensive.', 'The music was boring.'],
    answer: 0,
    explanation: '女士说音乐很棒，但大厅太冷，下半场无法享受。',
    tags: ['听力-态度', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-26',
    script: `W: I'd like to return this jacket. It's the wrong size.
M: Do you have the receipt? Without it, we can only offer a credit note.
W: Yes, here it is. I'd prefer a refund, please.`,
    question: 'What does the woman want?',
    options: ['A refund.', 'A credit note.', 'A different colour.', 'A larger jacket.'],
    answer: 0,
    explanation: '女士明确说希望退款；小票还在。',
    tags: ['听力-细节', '听力-意图'],
    difficulty: 1,
  },
  {
    id: 'ls-27',
    script: `M: I'm thinking of joining the school choir. Do I need to audition?
W: Not this term. We're short of tenors, so anyone who can sing in tune is welcome.
M: Great. I'll come to rehearsal on Thursday.`,
    question: 'Why can the man join without an audition?',
    options: ['The choir needs more tenors.', 'He is already a member.', 'The choir is closing.', 'Auditions are on Thursday.'],
    answer: 0,
    explanation: '女士说这学期缺男高音，能唱准的人都可以加入。',
    tags: ['听力-原因', '听力-细节'],
    difficulty: 2,
  },
  {
    id: 'ls-28',
    script: `W: Have you seen my glasses? I can't find them anywhere.
M: They were on the kitchen table. Did you check your coat pocket?
W: Oh, you're right. I put them there after reading.`,
    question: "Where are the woman's glasses?",
    options: ['In her coat pocket.', 'On the kitchen table.', 'In the bathroom.', 'In her bag.'],
    answer: 0,
    explanation: '男士提醒她检查外套口袋，女士发现确实在那里。',
    tags: ['听力-地点', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-29',
    script: `M: The train is cancelled because of strong wind. What should we do?
W: There's a bus at four, but it takes five hours. Or we could stay overnight and take the morning train.
M: Let's take the bus. I can't miss the meeting tomorrow.`,
    question: 'How will they travel?',
    options: ['By bus.', 'By train tonight.', 'By plane.', 'They will stay overnight.'],
    answer: 0,
    explanation: '男士选择四点的巴士，因为不能错过明天会议。',
    tags: ['听力-推断', '听力-交通'],
    difficulty: 2,
  },
  {
    id: 'ls-30',
    script: `W: Your report is good, but the conclusion is too short. Can you add a paragraph about future research?
M: Of course. Should I also include more data in the results section?
W: No, the data is fine. Just work on the ending.`,
    question: 'What does the woman want the man to improve?',
    options: ['The conclusion.', 'The data.', 'The introduction.', 'The title.'],
    answer: 0,
    explanation: '女士说结论太短，让他加一段未来研究；数据不用改。',
    tags: ['听力-细节', '听力-建议'],
    difficulty: 1,
  },
  {
    id: 'ls-31',
    script: `M: I heard you moved to a new flat. Is it closer to work?
W: Much closer. I used to spend an hour on the bus. Now I walk for fifteen minutes.
M: That must give you more time in the morning.`,
    question: "How long does the woman's journey to work take now?",
    options: ['Fifteen minutes on foot.', 'An hour by bus.', 'Fifteen minutes by bus.', 'An hour on foot.'],
    answer: 0,
    explanation: '女士现在步行 15 分钟上班，以前坐公交一小时。',
    tags: ['听力-数字', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-32',
    script: `W: The science museum is free on Fridays, isn't it?
M: It is, but you still need to book a ticket online. The 2 p.m. slot is already full.
W: Then let's go at 10. I'll book two tickets now.`,
    question: 'What will the woman do?',
    options: ['Book tickets for 10 a.m.', 'Wait until next Friday.', 'Pay for two tickets.', 'Visit at 2 p.m.'],
    answer: 0,
    explanation: '下午两点已满，女士说改十点并现在就订两张票。',
    tags: ['听力-细节', '听力-行为'],
    difficulty: 2,
  },
  {
    id: 'ls-33',
    script: `M: You look tired. Did you stay up late again?
W: My neighbor's dog barked until midnight. I tried earplugs, but they didn't help.
M: Maybe you should talk to your neighbor.`,
    question: 'Why is the woman tired?',
    options: ['She could not sleep because of a dog.', 'She worked late.', 'She lost her earplugs.', 'She was ill.'],
    answer: 0,
    explanation: '女士说邻居的狗叫到半夜，耳塞也没用，因此没睡好。',
    tags: ['听力-原因', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-34',
    script: `W: I'm calling about the bicycle advertised online. Is it still available?
M: Yes, but someone is coming to see it this afternoon. If you can come before noon, I'll keep it for you.
W: I'll be there at eleven.`,
    question: 'What does the man agree to do?',
    options: ['Keep the bicycle until eleven.', 'Sell it to the other person.', 'Lower the price.', 'Deliver the bicycle.'],
    answer: 0,
    explanation: '男士答应如果女士中午前到就给她留着，女士说十一点到。',
    tags: ['听力-细节', '听力-推断'],
    difficulty: 2,
  },
  {
    id: 'ls-35',
    script: `M: The soup tastes a little salty. Did you add salt?
W: Only a little. Maybe the stock was already salty. I can add some water.
M: No, it's fine. I'll just drink more water.`,
    question: 'What does the man decide to do?',
    options: ['Drink more water.', 'Add water to the soup.', 'Order another dish.', 'Stop eating.'],
    answer: 0,
    explanation: '男士说不用加水，自己多喝水就好。',
    tags: ['听力-态度', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-36',
    script: `W: Professor Lee, I'm worried about the exam. I missed two weeks of class.
M: Come to my office hours on Wednesday. We can go over the main topics, but you'll need to read the chapters yourself.
W: Thank you. I'll do that.`,
    question: 'What does the professor offer to do?',
    options: ['Review the main topics with her.', 'Give her a passing grade.', 'Cancel the exam.', 'Teach her the whole course again.'],
    answer: 0,
    explanation: '教授让她周三来办公室复习主要话题，但教材仍需自己读。',
    tags: ['听力-建议', '听力-细节'],
    difficulty: 2,
  },
  {
    id: 'ls-37',
    script: `M: We're planning a surprise party for Anna. Can you keep it a secret?
W: Of course. What time should I arrive?
M: Around six. She finishes work at half past five, so we need to be ready before seven.`,
    question: 'When does Anna finish work?',
    options: ['At 5:30.', 'At 6:00.', 'At 6:30.', 'At 7:00.'],
    answer: 0,
    explanation: '男士说她五点半下班，派对要在七点前准备好。',
    tags: ['听力-时间', '听力-数字'],
    difficulty: 1,
  },
  {
    id: 'ls-38',
    script: `W: Your flight has been moved to gate 12. Boarding starts in twenty minutes.
M: Gate 12? I thought it was gate 20. Thanks for telling me.
W: You'd better hurry. It's a ten-minute walk from here.`,
    question: 'What gate should the man go to?',
    options: ['Gate 12.', 'Gate 20.', 'Gate 10.', 'Gate 22.'],
    answer: 0,
    explanation: '女士说航班改到 12 号登机口。',
    tags: ['听力-地点', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-39',
    script: `M: I loved the book you lent me, especially the ending. Did the author write anything else?
W: She has a new novel, but it's quite different. It's about a family in the 19th century.
M: I'd still like to read it.`,
    question: "What is the woman's new book about?",
    options: ['A 19th-century family.', 'A science experiment.', 'A travel journey.', 'A school teacher.'],
    answer: 0,
    explanation: '女士说新小说讲 19 世纪的一个家庭。',
    tags: ['听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-40',
    script: `W: The garden looks much better than last year.
M: Thanks. I changed the soil and planted flowers that need less water. It saves time too.
W: Maybe I should try that. My plants always die in summer.`,
    question: 'Why did the man choose those flowers?',
    options: ['They need less water.', 'They grow faster.', 'They are cheaper.', 'They attract birds.'],
    answer: 0,
    explanation: '男士说种需水少的花，既省水也省时间。',
    tags: ['听力-原因', '听力-细节'],
    difficulty: 1,
  },
];
