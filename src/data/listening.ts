import type { ListeningLongItem, ListeningShortItem } from '../types';

/** 短对话：每题一段，考查地点、数字、关系、原因、态度、推断等。 */
export const listeningShort: ListeningShortItem[] = [
  {
    id: 'ls-01',
    script: `W: I'd like to renew these two books, please.
M: Sure. They're due next Friday, so you can keep them for another two weeks.
W: Great, thanks.`,
    question: 'Where does the conversation most probably take place?',
    options: ['In a library.', 'In a bookstore.', 'In a post office.', 'In a classroom.'],
    answer: 0,
    explanation: '女士要续借两本书，男士提到还书日期，场景显然是图书馆。',
    tags: ['听力-地点', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-02',
    script: `M: How long do we have to wait for a table?
W: About twenty minutes. You can wait at the bar and I'll call you.
M: All right. Two coffees while we wait, please.`,
    question: 'What will the man do while waiting?',
    options: ['Order some coffee.', 'Call a friend.', 'Book a table online.', 'Leave the restaurant.'],
    answer: 0,
    explanation: '男士说“Two coffees while we wait”，即等待时先点咖啡。',
    tags: ['听力-细节', '听力-行为'],
    difficulty: 1,
  },
  {
    id: 'ls-03',
    script: `W: Did you check the weather for tomorrow? I'm planning a picnic.
M: The forecast says it'll be sunny in the morning, but there's a shower expected around four.
W: Then I'd better bring a raincoat.`,
    question: 'What does the woman decide to bring?',
    options: ['A raincoat.', 'An umbrella.', 'A picnic blanket.', 'A hat.'],
    answer: 0,
    explanation: '男士说下午四点左右可能有阵雨，女士回应“I\'d better bring a raincoat”。',
    tags: ['听力-细节', '听力-天气'],
    difficulty: 1,
  },
  {
    id: 'ls-04',
    script: `M: Excuse me, is this the platform for the 9:15 train to Hangzhou?
W: No, that one leaves from Platform 3. This is Platform 5.
M: Thanks. I've got ten minutes, then.`,
    question: 'Which platform should the man go to?',
    options: ['Platform 3.', 'Platform 4.', 'Platform 5.', 'Platform 9.'],
    answer: 0,
    explanation: '女士明确说去杭州的 9:15 列车在 3 号站台。',
    tags: ['听力-数字', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-05',
    script: `W: You look pleased. Did the interview go well?
M: Better than I expected. They asked me to come back on Monday to meet the team.
W: That's a good sign!`,
    question: 'How does the man feel about the interview?',
    options: ['Encouraged.', 'Disappointed.', 'Nervous.', 'Confused.'],
    answer: 0,
    explanation: '男士说面试比预想的好，还被约周一见团队，女士说这是好兆头，可见他受到鼓舞。',
    tags: ['听力-态度', '听力-推断'],
    difficulty: 2,
  },
  {
    id: 'ls-06',
    script: `M: Two adult tickets and one student ticket, please.
W: That's forty pounds, but students get a discount today, so it's thirty-five.
M: Here you are.`,
    question: 'How much does the man pay?',
    options: ['£30.', '£35.', '£40.', '£45.'],
    answer: 1,
    explanation: '原价 40 英镑，学生票当天有折扣，实付 35 英镑。',
    tags: ['听力-数字', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-07',
    script: `W: I can't find my phone anywhere. I think I left it in the taxi.
M: Let's call it first. If it's still in the taxi, the driver may answer.
W: Good idea. I'll use your phone.`,
    question: 'What will the woman do first?',
    options: ['Call her own phone.', 'Call the taxi company.', 'Go back to the taxi stand.', 'Buy a new phone.'],
    answer: 0,
    explanation: '男士建议先打电话，女士同意并借用他的手机。',
    tags: ['听力-行为', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-08',
    script: `M: Are you joining the badminton club this term?
W: I'd love to, but practices are on Tuesday evenings and I have a chemistry class then.
M: What about the swimming club? It meets on Saturday mornings.
W: That works for me.`,
    question: 'Which club will the woman probably join?',
    options: ['The badminton club.', 'The swimming club.', 'The chemistry club.', 'The chess club.'],
    answer: 1,
    explanation: '羽毛球训练与化学课冲突，游泳俱乐部在周六上午，女士说可以，因此最可能加入游泳俱乐部。',
    tags: ['听力-推断', '听力-时间'],
    difficulty: 2,
  },
  {
    id: 'ls-09',
    script: `W: I booked two tickets for the concert on Saturday, but my sister can't come now.
M: I'd love to go. How much was the ticket?
W: Don't worry about the money. Just enjoy the music.`,
    question: 'What does the woman offer the man?',
    options: ['A free concert ticket.', 'A ride to the concert.', 'A music lesson.', 'A refund.'],
    answer: 0,
    explanation: '女士说“Don\'t worry about the money”，相当于把票免费给男士。',
    tags: ['听力-推断', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-10',
    script: `M: The flat is close to the subway and the rent is 2,000 yuan a month.
W: That sounds reasonable. Does it include water and electricity?
M: No, those are extra, about 200 yuan a month.`,
    question: 'How much will the woman pay for the flat each month in total?',
    options: ['1,800 yuan.', '2,000 yuan.', '2,200 yuan.', '2,400 yuan.'],
    answer: 2,
    explanation: '房租 2,000 元，水电另计约 200 元，合计约 2,200 元。',
    tags: ['听力-数字', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-11',
    script: `W: I'd like to make an appointment with Dr. Lee.
M: He's free on Wednesday morning. Is 10:30 all right?
W: Could I come at 4 p.m.? I have classes in the morning.
M: Let me see... Yes, 4:30 is the earliest in the afternoon.`,
    question: 'When will the woman see the doctor?',
    options: ['At 10:30 a.m. on Wednesday.', 'At 4:00 p.m. on Wednesday.', 'At 4:30 p.m. on Wednesday.', 'At 10:30 a.m. on Thursday.'],
    answer: 2,
    explanation: '女士希望下午 4 点，医生最早下午 4:30 有空，因此预约在周三 4:30。',
    tags: ['听力-时间', '听力-数字'],
    difficulty: 2,
  },
  {
    id: 'ls-12',
    script: `M: Are you going to Sanya for the holiday?
W: I was, but the flights are too expensive. I'm thinking of taking the train instead.
M: That takes a long time, but the views are wonderful.`,
    question: 'How will the woman probably travel?',
    options: ['By plane.', 'By train.', 'By ship.', 'By car.'],
    answer: 1,
    explanation: '机票太贵，女士考虑改坐火车，男士也认可沿途风景。',
    tags: ['听力-推断', '听力-交通'],
    difficulty: 1,
  },
  {
    id: 'ls-13',
    script: `W: Professor Smith, I'm having trouble with the research paper.
M: My office hours are from two to four on Thursdays. Bring your outline and we can go through it.
W: Thank you. I'll be there at three.`,
    question: 'What will the woman bring to the professor?',
    options: ['Her outline.', 'Her textbook.', 'A printed paper.', 'A research schedule.'],
    answer: 0,
    explanation: '教授让学生带上提纲（outline）来讨论。',
    tags: ['听力-细节', '听力-行为'],
    difficulty: 1,
  },
  {
    id: 'ls-14',
    script: `M: Do you recycle at home?
W: I do now. The building started collecting paper and plastic separately last month.
M: That's great. I wish my building would do the same.`,
    question: 'What change happened in the woman\'s building?',
    options: ['It started recycling paper and plastic.', 'It banned plastic bags.', 'It added more rubbish bins.', 'It reduced the rent.'],
    answer: 0,
    explanation: '女士说大楼从上个月开始分开回收纸张和塑料。',
    tags: ['听力-细节', '听力-环保'],
    difficulty: 1,
  },
  {
    id: 'ls-15',
    script: `W: The animal shelter needs volunteers this weekend. Are you interested?
M: I am, but I've never worked with dogs before.
W: Don't worry. They'll show you what to do. You just need to be patient.`,
    question: 'What does the woman say is most important for the volunteer?',
    options: ['Experience with dogs.', 'Patience.', 'A car.', 'Weekend free time.'],
    answer: 1,
    explanation: '女士说“You just need to be patient”，强调耐心最重要。',
    tags: ['听力-细节', '听力-建议'],
    difficulty: 1,
  },
  {
    id: 'ls-16',
    script: `M: My laptop won't start. Can you fix it today?
W: I can take a look, but I'm fully booked until Friday. If it's urgent, you can try the shop across the street.
M: I'll wait. I need it for a presentation next week.`,
    question: 'Why does the man decide to wait?',
    options: ['The repair is cheaper here.', 'He does not need it urgently.', 'The other shop is closed.', 'He trusts the woman more.'],
    answer: 1,
    explanation: '男士下周才需要电脑做演示，不是特别急，所以愿意等到周五。',
    tags: ['听力-原因', '听力-推断'],
    difficulty: 2,
  },
  {
    id: 'ls-17',
    script: `W: I'd like to check out, please. Room 508.
M: Certainly. Did you use the mini-bar?
W: Just a bottle of water.
M: That'll be 8 yuan. Here's your receipt.`,
    question: 'What is the woman doing?',
    options: ['Checking out of a hotel.', 'Ordering room service.', 'Buying a bottle of water.', 'Booking a room.'],
    answer: 0,
    explanation: '女士说“check out”，并报出房间号 508，是在酒店退房。',
    tags: ['听力-地点', '听力-细节'],
    difficulty: 1,
  },
  {
    id: 'ls-18',
    script: `M: I'm thinking of taking the history course next term.
W: I took it last year. The lectures are interesting, but there are three essays.
M: Three? Maybe I'll take the geography course instead.`,
    question: 'Why does the man change his mind?',
    options: ['The history course has too much writing.', 'The lectures are boring.', 'The course is full.', 'He prefers the geography teacher.'],
    answer: 0,
    explanation: '历史课要写三篇论文，男士觉得负担重，于是考虑改选地理。',
    tags: ['听力-原因', '听力-推断'],
    difficulty: 2,
  },
  {
    id: 'ls-19',
    script: `W: We're having dinner at my place on Friday. Would you like to come?
M: I'd love to. Shall I bring anything?
W: Just yourself. I'm trying a new recipe.`,
    question: 'What does the woman want the man to bring?',
    options: ['Nothing.', 'A dessert.', 'Some drinks.', 'A new recipe.'],
    answer: 0,
    explanation: '女士说“Just yourself”，即什么都不用带。',
    tags: ['听力-细节', '听力-推断'],
    difficulty: 1,
  },
  {
    id: 'ls-20',
    script: `M: The traffic is terrible. I've been in this taxi for forty minutes.
W: The match starts at seven. You still have twenty minutes.
M: I hope so. Could you tell the driver to take the side road?`,
    question: 'What does the man ask the woman to do?',
    options: ['Tell the driver to take another route.', 'Call the stadium.', 'Cancel the match.', 'Wait for him outside.'],
    answer: 0,
    explanation: '男士请女士告诉司机走小路（side road）。',
    tags: ['听力-行为', '听力-细节'],
    difficulty: 1,
  },
];

/** 长对话/独白：每组 3 题。 */
export const listeningLong: ListeningLongItem[] = [
  {
    id: 'll-01',
    title: 'Campus Tour',
    difficulty: 1,
    script: `M: Welcome to Westbridge University. I'm your guide, Daniel. Before we start, does anyone have questions?
W: Yes. Is the library open to first-year students during the summer?
M: Good question. The main library is open from nine to five in July, but it closes at noon on Saturdays. The science library stays open until ten all year round.
W: And where can we get our student cards?
M: At the student center, right behind the main gate. You'll need your passport and admission letter. Try to go before Friday, because the office gets very busy during registration week.
W: One more thing — is there a bus from the dormitories to the teaching buildings?
M: There is, but it only runs until six. Most students walk. It takes about fifteen minutes.`,
    questions: [
      {
        id: 'll-01-q1',
        question: 'When does the main library close on Saturdays in July?',
        options: ['At noon.', 'At five.', 'At ten.', 'It stays open all day.'],
        answer: 0,
        explanation: 'Daniel 说主图书馆 7 月周六中午 12 点闭馆。',
        tags: ['听力-时间', '听力-细节'],
        difficulty: 1,
      },
      {
        id: 'll-01-q2',
        question: 'What should students bring to get their student cards?',
        options: ['A passport and an admission letter.', 'A photo and a student number.', 'A passport and a bank card.', 'An admission letter and a photo.'],
        answer: 0,
        explanation: '办理学生卡需要护照和录取通知书。',
        tags: ['听力-细节'],
        difficulty: 1,
      },
      {
        id: 'll-01-q3',
        question: 'Why does Daniel suggest going before Friday?',
        options: ['The office will be crowded during registration week.', 'The office closes early on Friday.', 'Student cards are cheaper before Friday.', 'The student center will move.'],
        answer: 0,
        explanation: 'Daniel 说注册周办公室会非常忙，所以建议周五前去。',
        tags: ['听力-原因', '听力-推断'],
        difficulty: 2,
      },
    ],
  },
  {
    id: 'll-02',
    title: 'A Chef on Radio',
    difficulty: 2,
    script: `W: Welcome back to Kitchen Stories. Today I'm talking to Mei Lin, who runs a small restaurant in the old town. Mei, you didn't train as a chef, did you?
M: That's right. I studied chemistry at university. I worked in a lab for three years, but I spent all my free time cooking for friends.
W: What made you leave science?
M: Honestly, it was a birthday dinner. I cooked for twelve people and they kept asking where the restaurant was. I realized I wanted to make food for people every day, not just on weekends.
W: Your menu changes every week. Isn't that difficult?
M: It is, but it keeps me curious. I go to the market on Monday mornings and plan around what looks good. Customers often ask for the same dish again, and I have to explain that the best ingredients aren't always available.
W: What advice do you have for young cooks?
M: Learn the basics first. Then cook for real people, not just for photos. A dish that looks perfect but tastes ordinary won't bring anyone back.`,
    questions: [
      {
        id: 'll-02-q1',
        question: 'What did Mei Lin do before she became a chef?',
        options: ['She worked in a laboratory.', 'She taught chemistry.', 'She wrote about food.', 'She managed a market.'],
        answer: 0,
        explanation: 'Mei 说自己在实验室工作了三年。',
        tags: ['听力-细节', '听力-职业'],
        difficulty: 1,
      },
      {
        id: 'll-02-q2',
        question: 'Why does Mei change her menu every week?',
        options: ['To use the best available ingredients.', 'To satisfy regular customers.', 'To save money.', 'To follow a famous cookbook.'],
        answer: 0,
        explanation: '她根据周一市场上最好的食材来制定菜单。',
        tags: ['听力-原因', '听力-推断'],
        difficulty: 2,
      },
      {
        id: 'll-02-q3',
        question: 'What does Mei think is most important for a young cook?',
        options: ['Learning the basics and cooking for real people.', 'Taking beautiful photos of food.', 'Opening a restaurant quickly.', 'Working in a famous kitchen.'],
        answer: 0,
        explanation: '她建议先学基本功，再为真实的人做饭，而不是只为拍照。',
        tags: ['听力-观点', '听力-细节'],
        difficulty: 2,
      },
    ],
  },
  {
    id: 'll-03',
    title: 'Conference Voicemail',
    difficulty: 2,
    script: `W: Hello, this is Anna from the International Education Conference. I'm calling for Mr. Wang. The conference will be held at the Riverside Hotel from March 12th to 14th. Your talk is scheduled for the afternoon of the 13th, at three thirty, in Hall B.
We've received your slides, but the file seems to be missing the last two pages. Could you send the complete version by Friday?
Also, the hotel has changed its check-in time to 3 p.m. If you arrive earlier, you can leave your luggage at the front desk.
Finally, please let me know whether you'll join the dinner on the 12th. It's free for speakers, but we need numbers by Monday. You can reply to this email or call me at the office. Thank you.`,
    questions: [
      {
        id: 'll-03-q1',
        question: 'When is Mr. Wang\'s talk?',
        options: ['On the afternoon of March 13th.', 'On the morning of March 12th.', 'On the afternoon of March 14th.', 'On the morning of March 13th.'],
        answer: 0,
        explanation: '留言说报告安排在 13 日下午 3:30，B 厅。',
        tags: ['听力-时间', '听力-细节'],
        difficulty: 1,
      },
      {
        id: 'll-03-q2',
        question: 'What does Anna ask Mr. Wang to do by Friday?',
        options: ['Send the complete slides.', 'Book his hotel room.', 'Confirm his arrival time.', 'Pay the conference fee.'],
        answer: 0,
        explanation: 'Anna 说收到的幻灯片缺少最后两页，请他在周五前发完整版。',
        tags: ['听力-细节', '听力-行为'],
        difficulty: 1,
      },
      {
        id: 'll-03-q3',
        question: 'What does Anna need to know by Monday?',
        options: ['Whether Mr. Wang will attend the dinner.', 'Which hall Mr. Wang prefers.', 'When Mr. Wang will check in.', 'How many slides Mr. Wang will use.'],
        answer: 0,
        explanation: '她需要在周一前知道 Wang 先生是否参加 12 日的晚宴。',
        tags: ['听力-细节'],
        difficulty: 1,
      },
    ],
  },
  {
    id: 'll-04',
    title: 'Choosing a Major',
    difficulty: 2,
    script: `M: Mom, I'm trying to decide between economics and environmental science.
W: I thought you loved biology.
M: I do, but I'm also interested in how companies make decisions. Environmental science feels more useful, though.
W: Useful is good, but you'll be studying this for four years. What kind of work do you see yourself doing?
M: I'd like to help cities deal with waste and energy. Maybe working for a company or a government agency.
W: Then why not look at a program that combines both? Some universities offer environmental economics.
M: I didn't know that. That might be perfect. I'll check the course requirements tonight.
W: Good. And talk to your uncle — he works in that field. He can tell you what the day-to-day work is really like.`,
    questions: [
      {
        id: 'll-04-q1',
        question: 'What is the man trying to decide?',
        options: ['Which major to choose.', 'Which university to attend.', 'Whether to study abroad.', 'Whether to take a gap year.'],
        answer: 0,
        explanation: '男士开头就说在经济学和环境科学之间做选择。',
        tags: ['听力-主旨', '听力-细节'],
        difficulty: 1,
      },
      {
        id: 'll-04-q2',
        question: 'What does the woman suggest?',
        options: ['A program combining economics and environment.', 'Giving up biology entirely.', 'Working for a year first.', 'Choosing the more popular major.'],
        answer: 0,
        explanation: '母亲建议看看结合两者的环境经济学项目。',
        tags: ['听力-建议', '听力-细节'],
        difficulty: 1,
      },
      {
        id: 'll-04-q3',
        question: 'Why does the woman mention the uncle?',
        options: ['He can describe the actual work.', 'He teaches at the university.', 'He can help pay the tuition.', 'He studied economics.'],
        answer: 0,
        explanation: '母亲说叔叔就在这个领域工作，可以告诉他日常工作真实的样子。',
        tags: ['听力-原因', '听力-推断'],
        difficulty: 2,
      },
    ],
  },
  {
    id: 'll-05',
    title: 'Urban Gardens',
    difficulty: 3,
    script: `W: A new report says urban gardens are growing faster in Shanghai than in many other large cities. Researchers studied more than two hundred community gardens over five years.
They found that most gardens are on rooftops or unused land between buildings. The gardens are often run by residents, not by companies. In one neighborhood, eighty families share a garden of just four hundred square meters.
The report says the benefits go beyond food. Gardeners reported meeting neighbors more often and feeling less stressed. Children who took part were more willing to eat vegetables.
However, the researchers also found problems. Water and sunlight can be limited on rooftops, and some gardens close when the building is repaired. The report suggests that city planners should include garden space in new housing projects and provide long-term support, not just startup money.`,
    questions: [
      {
        id: 'll-05-q1',
        question: 'What did the researchers study?',
        options: ['Community gardens in Shanghai.', 'Rooftop restaurants.', 'New housing projects.', 'Vegetable prices in cities.'],
        answer: 0,
        explanation: '研究报告以上海社区花园为对象，跟踪了 200 多个花园。',
        tags: ['听力-主旨', '听力-细节'],
        difficulty: 1,
      },
      {
        id: 'll-05-q2',
        question: 'Which benefit is mentioned in the report?',
        options: ['Neighbors meet more often.', 'Food prices go down.', 'Buildings become safer.', 'Air travel increases.'],
        answer: 0,
        explanation: '报告提到园艺者与邻居见面更多、压力更小。',
        tags: ['听力-细节'],
        difficulty: 1,
      },
      {
        id: 'll-05-q3',
        question: 'What do the researchers recommend?',
        options: ['Including garden space in new housing and supporting it long term.', 'Giving gardens more startup money only.', 'Moving all gardens to rooftops.', 'Letting companies run the gardens.'],
        answer: 0,
        explanation: '报告建议城市规划者在新住房项目中预留花园空间，并提供长期支持。',
        tags: ['听力-建议', '听力-推断'],
        difficulty: 2,
      },
    ],
  },
  {
    id: 'll-06',
    title: 'Science Fair',
    difficulty: 2,
    script: `M: Hi, Lucy. How's your science fair project going?
W: Not great. I wanted to test which paper towel absorbs the most water, but my little brother used half my towels for a spilled drink.
M: That's annoying. Can you get more?
W: I can, but I've already used the same brand for three trials. If I buy a new pack, the results might not be comparable.
M: True. Why don't you test something else you already have? Like how different fruits conduct electricity?
W: That's actually interesting. But I only have two weeks, and I need time to write the report.
M: You could do a smaller experiment with three fruits and repeat each test twice. That's enough for a clear conclusion.
W: Okay. I'll ask my teacher if I can change the topic tomorrow.`,
    questions: [
      {
        id: 'll-06-q1',
        question: 'What is Lucy\'s problem?',
        options: ['She does not have enough paper towels.', 'She lost her report.', 'Her teacher rejected her topic.', 'She missed the science fair.'],
        answer: 0,
        explanation: 'Lucy 的弟弟用掉了她一半的纸巾，导致实验材料不够。',
        tags: ['听力-问题', '听力-细节'],
        difficulty: 1,
      },
      {
        id: 'll-06-q2',
        question: 'Why doesn\'t Lucy want to buy a new pack of towels?',
        options: ['The results might not be comparable.', 'The shop is closed.', 'They are too expensive.', 'Her teacher told her not to.'],
        answer: 0,
        explanation: '她担心换新包装后实验结果不可比。',
        tags: ['听力-原因', '听力-推断'],
        difficulty: 2,
      },
      {
        id: 'll-06-q3',
        question: 'What does the man suggest?',
        options: ['Doing a smaller experiment with three fruits.', 'Borrowing towels from a friend.', 'Writing the report first.', 'Dropping the science fair.'],
        answer: 0,
        explanation: '男士建议用三种水果做一个小一点的实验，每个测试重复两次。',
        tags: ['听力-建议', '听力-细节'],
        difficulty: 1,
      },
    ],
  },
];
