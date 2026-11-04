import type { ReadingItem } from '../types';

const q = (
  id: string,
  question: string,
  options: string[],
  answer: number,
  explanation: string,
  tags: string[],
  difficulty: 1 | 2 | 3,
) => ({ id, question, options, answer, explanation, tags, difficulty });

/** 阅读理解：10 篇，每篇 5 题，覆盖细节、主旨、推断、词义、态度。 */
export const reading: ReadingItem[] = [
  {
    id: 'r-01',
    title: 'The Library of Things',
    difficulty: 1,
    text: `In many neighborhoods, people own drills, ladders, and camping tents that they use only a few times a year. A new type of library is trying to change that. The Library of Things lends household items instead of books. Members pay a small yearly fee and can borrow everything from sewing machines to projectors.

The idea started in Toronto in 2013 and has spread to dozens of cities. Supporters say it saves money and reduces waste. A drill, for example, might be used for twenty minutes but take years to break down in a landfill. Borrowing one avoids the need for every household to buy its own.

Not everyone is convinced. Some items are expensive to repair, and staff must check them carefully after each loan. Insurance can also be a problem. "A library of things is not a shop," says one organizer. "We need members who treat the objects as if they belong to the whole community."

In Shanghai, a small library in a community center has lent out more than 300 items in its first year. The most popular? A cake tin shaped like a dinosaur. "People borrow it for birthdays, then return it," the organizer says. "It has been used by fifty families and is still in perfect condition."`,
    questions: [
      q('r-01-q1', 'What is the passage mainly about?', ['A library that lends household items.', 'A shop that sells second-hand tools.', 'A campaign to reduce plastic waste.', 'A community center for children.'], 0, '全文围绕“物品图书馆”展开，介绍其起源、好处与挑战。', ['阅读-主旨'], 1),
      q('r-01-q2', 'Why does the author mention the drill?', ['To show that some items are rarely used.', 'To explain how libraries buy tools.', 'To suggest that drills are dangerous.', 'To compare prices in different cities.'], 0, '电钻一年只用几次、却要多年才能降解，说明很多家庭物品使用率低、浪费大。', ['阅读-细节', '阅读-举例'], 1),
      q('r-01-q3', 'What challenge is mentioned in paragraph 3?', ['Repair costs and insurance.', 'A lack of members.', 'Too many donations.', 'No space for books.'], 0, '第三段明确提到维修费用高、保险也可能成为问题。', ['阅读-细节'], 1),
      q('r-01-q4', 'The organizer\'s words "not a shop" suggest that members should ______.', ['take shared responsibility for the items', 'pay more for expensive objects', 'return items within one day', 'bring their own tools'], 0, '“不是商店”意味着会员要把物品当作社区共有财产来爱护，而不是像顾客一样消费。', ['阅读-推断', '阅读-词句'], 2),
      q('r-01-q5', 'The dinosaur cake tin is used as an example of ______.', ['an item that can be shared many times', 'a product that is hard to repair', 'a gift that people often buy', 'a toy designed for children'], 0, '一个蛋糕模具被 50 个家庭使用后仍完好，说明共享能提高物品利用率。', ['阅读-推断', '阅读-举例'], 1),
    ],
  },
  {
    id: 'r-02',
    title: 'Why We Forget',
    difficulty: 2,
    text: `Most people imagine memory as a filing cabinet: information goes in, and if we are careful, it stays. Scientists now think memory works more like a forest after rain. Paths form where they are used; unused paths slowly disappear.

Forgetting is not always a failure. It helps the brain focus on what matters. In one study, people were asked to remember a list of words. Those who forgot irrelevant words performed better on a later task than those who remembered everything. The brain, it seems, is constantly deciding what to keep.

Sleep plays a key role. During deep sleep, the brain replays important experiences and strengthens the connections between neurons. Without enough sleep, these connections remain weak, and new information is easily lost. This may explain why studying all night often leads to poor results.

Stress is another factor. A little stress can sharpen attention, but long periods of stress make it harder to form new memories. The hormone cortisol, released during stress, can damage the hippocampus, a part of the brain essential for learning.

The good news is that memory can be trained. Testing yourself, spacing out study sessions, and explaining ideas to others are more effective than simply rereading notes. Each time you recall something, the path in the forest becomes a little clearer.`,
    questions: [
      q('r-02-q1', 'What is the main idea of the passage?', ['Memory is shaped by use, sleep, stress and training.', 'Memory works exactly like a filing cabinet.', 'Forgetting is always a sign of failure.', 'Sleep has little effect on learning.'], 0, '文章从记忆机制、遗忘作用、睡眠、压力与训练多方面说明记忆如何被塑造。', ['阅读-主旨'], 2),
      q('r-02-q2', 'According to the passage, forgetting can be useful because it ______.', ['helps the brain focus on important things', 'makes room for new books', 'reduces the need for sleep', 'prevents stress completely'], 0, '第二段指出遗忘帮助大脑聚焦重要信息，忘记无关词汇的人在后续任务中表现更好。', ['阅读-细节'], 1),
      q('r-02-q3', 'What happens during deep sleep?', ['Connections between neurons are strengthened.', 'The brain stops processing information.', 'Cortisol is released.', 'Unused paths disappear completely.'], 0, '第三段说深度睡眠时大脑重放重要经历并强化神经元连接。', ['阅读-细节'], 1),
      q('r-02-q4', 'What can cortisol do according to the passage?', ['Damage a brain area important for learning.', 'Improve long-term memory.', 'Increase the length of sleep.', 'Replace the need for review.'], 0, '第四段指出长期压力释放的皮质醇会损伤对学习至关重要的海马体。', ['阅读-细节', '阅读-科学'], 2),
      q('r-02-q5', 'Which study method does the author support?', ['Testing yourself regularly.', 'Rereading notes many times.', 'Studying all night before exams.', 'Avoiding all stress.'], 0, '最后一段明确说自我测试、间隔复习和向他人解释比反复读笔记更有效。', ['阅读-细节', '阅读-推断'], 1),
    ],
  },
  {
    id: 'r-03',
    title: 'The Year I Stopped Rushing',
    difficulty: 2,
    text: `Last year, I decided to walk to work instead of taking the subway. The journey took forty minutes, twice as long, and at first I hated it. I counted the minutes and arrived annoyed. Then something changed. I began to notice the same people: the man who opened the bakery at five, the woman who watered the plants outside the clinic, the children who waited for the school bus.

One morning, the bakery man waved. A week later, I knew his name. He told me he had been baking for thirty years and that his son was studying in another city. I started buying bread on Fridays. It became a small ritual.

Walking also gave me time to think. I solved problems that had been stuck in my head for weeks. I noticed that my best ideas came not when I was working, but when I was moving.

I am not suggesting that everyone should give up the subway. Some people cannot afford an extra forty minutes. But I do think we miss a lot when we treat travel as wasted time. The city is full of small stories, and most of them are invisible from a train window. Last month, the bakery closed for a day. The next morning, the man was back, and he had saved me a loaf. "I knew you would come," he said. He was right.`,
    questions: [
      q('r-03-q1', 'What is the author\'s main point?', ['Slowing down can help us notice city life and think better.', 'Walking is always faster than taking the subway.', 'Bakery owners work harder than office workers.', 'Cities are too crowded for walking.'], 0, '作者通过步行上班的经历说明慢下来能观察生活、获得思考空间。', ['阅读-主旨'], 2),
      q('r-03-q2', 'Why did the author start buying bread on Fridays?', ['It became a small weekly ritual.', 'The bread was cheaper on Fridays.', 'The bakery man asked him to.', 'He wanted to help the man\'s son.'], 0, '第三段说周五买面包“became a small ritual”，是逐渐形成的习惯。', ['阅读-细节'], 1),
      q('r-03-q3', 'When did the author\'s best ideas come?', ['While moving, not while working at a desk.', 'While riding the subway.', 'While talking to the bakery man.', 'While waiting for the school bus.'], 0, '第四段说最好的想法不是工作时出现，而是在移动时出现。', ['阅读-细节'], 1),
      q('r-03-q4', 'What can be inferred from the bakery man saving a loaf?', ['He knew the author would come that morning.', 'He wanted to sell more bread.', 'He was closing the bakery permanently.', 'He had forgotten the author\'s name.'], 0, '他说“I knew you would come”，并提前留了面包，说明他熟悉作者的习惯。', ['阅读-推断'], 2),
      q('r-03-q5', 'The tone of the passage is best described as ______.', ['reflective and warm', 'angry and critical', 'formal and scientific', 'humorous and careless'], 0, '文章回忆个人经历，语气温和、带有反思。', ['阅读-语气'], 1),
    ],
  },
  {
    id: 'r-04',
    title: 'The Four-Day Week',
    difficulty: 3,
    text: `Imagine working four days a week for the same pay. For many people, this sounds impossible. Yet a growing number of companies are testing it, and the early results are surprising.

In a six-month trial in the UK, more than 60 companies took part. Employees worked 80 percent of their usual hours but kept their salaries. Most companies reported that productivity stayed the same or improved. Staff took fewer sick days, and fewer people left their jobs. The trial was so successful that most participants decided to continue.

Why might working less produce more? Supporters point to several reasons. Meetings become shorter when time is limited. People waste less time on unimportant tasks. And employees who have an extra day to rest, care for family, or pursue hobbies return with more energy.

Critics warn that the results may not apply everywhere. A hospital or a restaurant cannot simply close on Fridays. Some jobs require constant presence, and scheduling becomes complicated. There is also the risk that employees will feel pressure to fit five days of work into four, increasing stress rather than reducing it.

The four-day week is not a magic solution. But it challenges an assumption that has gone unexamined for a century: that longer hours automatically mean better work. Perhaps the real question is not how many hours we work, but how well we use them.`,
    questions: [
      q('r-04-q1', 'What is the passage mainly about?', ['The promise and limits of the four-day work week.', 'Why hospitals should close on Fridays.', 'How to reduce salaries in companies.', 'The history of the working week.'], 0, '文章介绍四天工作制的试验结果、原因与批评，最后提出应关注工作效率。', ['阅读-主旨'], 2),
      q('r-04-q2', 'What did the UK trial find?', ['Productivity stayed the same or improved.', 'Most companies lost money.', 'Employees worked longer hours.', 'Staff took more sick days.'], 0, '第二段说大多数公司报告生产率持平或提高，请病假和离职的人更少。', ['阅读-细节'], 1),
      q('r-04-q3', 'Which is NOT given as a reason for higher productivity?', ['Employees receive higher salaries.', 'Meetings become shorter.', 'People waste less time on unimportant tasks.', 'Employees return with more energy.'], 0, '试验中工资不变，并未提高；其余三项都是文中给出的原因。', ['阅读-细节', '阅读-排除'], 2),
      q('r-04-q4', 'What concern do critics raise?', ['Some jobs cannot easily be reorganized.', 'Employees will refuse to rest.', 'Companies will hire too many people.', 'Meetings will become longer.'], 0, '批评者指出医院、餐厅等需要持续在场的岗位难以照搬四天工作制，排班也变复杂。', ['阅读-细节'], 2),
      q('r-04-q5', 'The author\'s attitude toward the four-day week is ______.', ['cautiously supportive', 'completely opposed', 'totally uninterested', 'angry'], 0, '作者承认其局限，但认为它挑战了“工时越长越好”的旧假设，态度是谨慎支持。', ['阅读-态度'], 2),
    ],
  },
  {
    id: 'r-05',
    title: 'The Truth About Street Food',
    difficulty: 2,
    text: `Street food is often blamed for stomach problems. Travelers are warned to avoid it, and health inspectors treat it with suspicion. But in many cities, street food is safer than it looks—and it is an important part of daily life.

Consider the noodle stall near my office. It has no chairs, only three plastic tables. The owner, Mr. Zhang, arrives at five every morning to prepare the broth. He buys vegetables from the same market each day and cooks everything in front of customers. His stall is small, but it is clean, and his customers have been coming for years.

A 2019 study of street food in Bangkok found that most vendors followed basic hygiene rules. The real risk came from a small number of stalls that used unsafe water. The researchers argued that cities should help vendors improve rather than push them away.

Street food also offers something that restaurants often cannot: low prices, speed, and a place where people from different backgrounds eat side by side. For many workers, it is the only affordable hot meal of the day.

None of this means that every stall is safe. Travelers should still choose busy stalls with high turnover, where food is cooked fresh. But blaming all street food is lazy. It ignores the skill of the vendors and the role they play in feeding cities.`,
    questions: [
      q('r-05-q1', 'What is the author\'s main argument?', ['Street food is often safer and more valuable than people assume.', 'All street food is dangerous and should be avoided.', 'Restaurants are always cleaner than street stalls.', 'Street food should be free for workers.'], 0, '文章先反驳对街头食品的笼统指责，再说明其卫生、经济与社会价值。', ['阅读-主旨', '阅读-论点'], 2),
      q('r-05-q2', 'What helps make Mr. Zhang\'s stall safe?', ['Fresh ingredients and cooking in front of customers.', 'Having many chairs for customers.', 'Selling only one kind of food.', 'Using water from the market.'], 0, '第三段说他每天从同一市场买蔬菜，并在顾客面前烹饪，摊位干净。', ['阅读-细节'], 1),
      q('r-05-q3', 'What did the Bangkok study find?', ['A few stalls used unsafe water.', 'Most vendors ignored hygiene rules.', 'Street food caused most stomach problems.', 'Restaurants were safer than stalls.'], 0, '研究显示多数摊贩遵守基本卫生规则，真正风险来自少数使用不安全水源的摊位。', ['阅读-细节'], 1),
      q('r-05-q4', 'Why is street food important for many workers?', ['It is an affordable hot meal.', 'It is open only at night.', 'It offers free seating.', 'It is recommended by inspectors.'], 0, '第五段说对许多工人而言，街头食品是唯一负担得起的热饭。', ['阅读-细节'], 1),
      q('r-05-q5', 'The author calls blaming all street food "lazy" because it ______.', ['ignores vendors\' skills and their role in cities', 'takes too much time', 'is supported by restaurants', 'focuses on travelers'], 0, '作者认为一概指责忽略了摊贩的手艺和他们喂养城市的作用。', ['阅读-推断', '阅读-词句'], 2),
    ],
  },
  {
    id: 'r-06',
    title: 'The Girl Who Drew Maps',
    difficulty: 2,
    text: `Mary was nine when she began drawing maps of her village. She used the backs of old calendars and whatever pencils she could find. Her maps were not accurate—the river was too wide, the school too close—but they showed something real: where people gathered, where the ground became muddy after rain, and which paths were safe at night.

Her teacher noticed the maps and asked if she could make one for the school. Mary spent a month measuring the playground with a rope. The result was so detailed that the headmaster had it framed. For the first time, Mary thought that drawing maps might be more than a game.

At university, she studied geography. Her professor was impressed by her village maps and encouraged her to work with a local planning team. The team was designing a new bus route. They had data, but they did not know which streets felt dangerous to walk at night. Mary's maps, made with residents, showed exactly that.

Today, Mary works for a city planning office. She still starts every project by walking through the neighborhood and talking to people. "A map is not just a picture of space," she says. "It is a record of how people live in it." Her old calendars are gone, but one map hangs in her office—the first one, with the too-wide river.`,
    questions: [
      q('r-06-q1', 'What is the passage mainly about?', ['How Mary\'s childhood map-making shaped her career.', 'How to measure a playground with a rope.', 'Why old calendars are useful for drawing.', 'The history of bus routes in Mary\'s city.'], 0, '文章按时间顺序讲 Mary 从童年画地图到成为城市规划工作者的经历。', ['阅读-主旨'], 1),
      q('r-06-q2', 'What was special about Mary\'s early maps?', ['They recorded people\'s everyday experience of the village.', 'They were completely accurate.', 'They were drawn by her teacher.', 'They showed the whole country.'], 0, '她的地图虽然比例不准，却标出了人们聚集、雨后泥泞、夜间安全的路径等真实生活信息。', ['阅读-细节', '阅读-推断'], 2),
      q('r-06-q3', 'Why did the professor encourage Mary?', ['He was impressed by her village maps.', 'She had the highest exam score.', 'She wanted to leave the university.', 'He needed someone to teach geography.'], 0, '第四段说他被 Mary 的村庄地图打动，鼓励她与规划团队合作。', ['阅读-细节'], 1),
      q('r-06-q4', 'What did the planning team lack?', ['Knowledge of which streets felt dangerous at night.', 'Data about the city\'s population.', 'Money for a new bus route.', 'Permission to build roads.'], 0, '团队有数据，但不知道哪些街道夜间让人感到不安全，而 Mary 的地图正好补上。', ['阅读-细节'], 1),
      q('r-06-q5', 'What does Mary mean by "a record of how people live"?', ['Maps should reflect people\'s real experiences.', 'Maps should only show official buildings.', 'Maps should be sold to residents.', 'Maps should avoid showing rivers.'], 0, '她的地图记录居民的生活经验，而不只是空间位置。', ['阅读-词句', '阅读-推断'], 2),
    ],
  },
  {
    id: 'r-07',
    title: 'Repair Cafés',
    difficulty: 2,
    text: `Every Saturday morning, a community center in my neighborhood opens its doors to broken things. Toasters, lamps, bicycles, and torn curtains arrive in bags. Volunteers sit at tables with tools and try to fix them. This is a repair café.

The first repair café opened in Amsterdam in 2009. Since then, thousands have appeared around the world. The idea is simple: instead of throwing away broken objects, people bring them to be repaired for free. Volunteers are not always experts; many are retired engineers, hobbyists, or people who simply enjoy taking things apart.

The environmental case is strong. Manufacturing a new product uses energy and raw materials, and old products often end up in landfills. Repairing extends the life of an object and reduces waste. In one year, a single café in Germany repaired more than 1,200 items.

But the social benefits may be just as important. Repair cafés bring together people of different ages and backgrounds. A teenager might learn to solder from a retired electrician. A neighbor might discover that someone down the street has the same broken kettle.

Not everything can be fixed. Some products are designed so that they cannot be opened, and replacement parts may be impossible to find. Still, the cafés send a message: things do not have to be disposable. Sometimes, with a little help, they can have a second life.`,
    questions: [
      q('r-07-q1', 'What is the passage mainly about?', ['Repair cafés reduce waste and build community.', 'How to open a café in Amsterdam.', 'Why new products are always better.', 'The history of toasters and lamps.'], 0, '文章介绍维修咖啡馆的起源、环保与社会价值，以及局限。', ['阅读-主旨'], 1),
      q('r-07-q2', 'How do repair cafés help the environment?', ['They extend the life of objects and reduce waste.', 'They sell new products at low prices.', 'They collect rubbish from landfills.', 'They manufacture replacement parts.'], 0, '第三段说明维修延长物品寿命、减少浪费，也减少制造新产品所需的能源和原料。', ['阅读-细节'], 1),
      q('r-07-q3', 'What social benefit is mentioned?', ['People of different ages learn from each other.', 'Volunteers receive high salaries.', 'Customers must pay for repairs.', 'Shops become more competitive.'], 0, '第四段举例：青少年向退休电工学焊接，邻居因同样的坏水壶而相识。', ['阅读-细节'], 1),
      q('r-07-q4', 'What limitation of repair cafés is mentioned?', ['Some products cannot be opened or repaired.', 'There are not enough broken objects.', 'Volunteers refuse to work on Saturdays.', 'They are too expensive to run.'], 0, '最后一段指出有些产品设计成无法打开，替换零件也可能找不到。', ['阅读-细节'], 1),
      q('r-07-q5', 'The phrase "second life" in the last paragraph refers to ______.', ['an object being used again after repair', 'a person changing careers', 'a café opening in a new city', 'a product being redesigned'], 0, '“second life”指损坏物品经维修后重新被使用。', ['阅读-词句'], 1),
    ],
  },
  {
    id: 'r-08',
    title: 'Music and the Brain',
    difficulty: 3,
    text: `Music is one of the oldest human activities, yet scientists are still discovering how it affects the brain. When we listen to music, many areas of the brain become active at once. The auditory cortex processes sound, the motor system responds to rhythm, and the emotional centers assign meaning.

Studies show that music can reduce pain and anxiety. In hospitals, patients who listen to music before surgery often need less medication. The effect is not simply distraction; music seems to activate the brain's reward system, releasing dopamine, the same chemical involved in eating and falling in love.

Musicians have an advantage in some mental tasks. Years of practice strengthen the connections between the two halves of the brain. This may help with memory, attention, and even language learning. But non-musicians can benefit too. Learning to play an instrument as an adult improves coordination and may slow age-related decline.

Does listening to Mozart make you smarter? The idea, known as the "Mozart effect," became popular in the 1990s. Later research showed that the effect was small and temporary. Enjoying music may improve your mood, which can help you concentrate, but it will not raise your IQ.

What music does reliably is connect people. Singing together, dancing, or even tapping to the same beat creates a sense of belonging. In a world where many experiences are private, music remains something we often share.`,
    questions: [
      q('r-08-q1', 'What is the passage mainly about?', ['How music affects the brain and what claims are exaggerated.', 'Why Mozart was a great composer.', 'How to become a professional musician.', 'Why hospitals should ban music.'], 0, '文章介绍音乐对大脑的多方面影响，并澄清“莫扎特效应”被夸大的说法。', ['阅读-主旨'], 2),
      q('r-08-q2', 'How does music reduce pain according to the passage?', ['It activates the brain\'s reward system.', 'It stops the auditory cortex from working.', 'It makes patients sleep longer.', 'It replaces all medication.'], 0, '第二段指出音乐不只是分散注意力，还会激活奖励系统、释放多巴胺。', ['阅读-细节'], 2),
      q('r-08-q3', 'What advantage do musicians have?', ['Stronger connections between the two halves of the brain.', 'A higher IQ from birth.', 'No need for sleep.', 'Better eyesight.'], 0, '第三段说多年练习强化左右脑连接，可能有助于记忆、注意力和语言学习。', ['阅读-细节'], 1),
      q('r-08-q4', 'What does later research say about the Mozart effect?', ['It is small and temporary.', 'It lasts for years.', 'It raises IQ permanently.', 'It has never been studied.'], 0, '第四段说后续研究表明该效应很小且短暂，不会提高智商。', ['阅读-细节'], 2),
      q('r-08-q5', 'What does music do reliably, according to the author?', ['Connect people.', 'Raise intelligence.', 'Cure anxiety completely.', 'Improve eyesight.'], 0, '最后一段强调音乐可靠的作用是连接人、创造归属感。', ['阅读-细节'], 1),
    ],
  },
  {
    id: 'r-09',
    title: 'The Cost of Fast Fashion',
    difficulty: 3,
    text: `A new T-shirt costs less than a cup of coffee. For consumers, this seems like a bargain. But the low price hides a high cost.

The fashion industry produces more than 100 billion garments a year, and many are worn only a few times. Clothes are made from materials that take decades to decompose, and dyes pollute rivers. Workers in some factories earn very little and face unsafe conditions. These problems are not new, but they have grown as production has sped up.

Some people argue that consumers are to blame. If we stopped buying cheap clothes, companies would change. There is some truth in this. But it ignores the fact that many families cannot afford expensive clothing. Telling a low-income parent to buy a $100 jacket instead of a $20 one is not realistic. The responsibility must be shared by governments, companies, and consumers.

What can individuals do? Buy less, choose second-hand, repair clothes, and support brands that are transparent about their supply chains. These actions matter, but they are not enough. Real change requires laws that make companies responsible for the waste they create and ensure that workers are paid fairly.

Fast fashion is not evil in itself. Affordable clothing has improved many lives. The problem is a system that treats clothes as disposable and people as cheap. We need a system that values both.`,
    questions: [
      q('r-09-q1', 'What is the author\'s main point?', ['Fast fashion\'s low prices hide environmental and social costs that require shared action.', 'Consumers alone are responsible for fast fashion.', 'Expensive clothes are always better.', 'The fashion industry should be closed down.'], 0, '作者既承认廉价服装的价值，又指出环境与劳工代价，主张政府、企业和消费者共同负责。', ['阅读-主旨', '阅读-论点'], 3),
      q('r-09-q2', 'What does the author think of the view that consumers are to blame?', ['It is partly true but ignores affordability.', 'It is completely wrong.', 'It is the only cause of the problem.', 'It is supported by all families.'], 0, '第三段说这种观点有道理，但忽略了低收入家庭买不起昂贵衣服的现实。', ['阅读-推断', '阅读-态度'], 2),
      q('r-09-q3', 'Which environmental problem is mentioned?', ['Dyes pollute rivers.', 'Cotton fields are disappearing.', 'Trucks cause noise pollution.', 'Factories use too much paper.'], 0, '第二段明确提到染料污染河流，衣物材料数十年才能降解。', ['阅读-细节'], 1),
      q('r-09-q4', 'What does the author say is needed for real change?', ['Laws holding companies responsible and ensuring fair pay.', 'Only individual choices.', 'A complete ban on T-shirts.', 'Higher prices for all clothes.'], 0, '最后两段说个人行动重要但不够，真正改变需要法律让企业负责并保障公平工资。', ['阅读-细节'], 2),
      q('r-09-q5', 'The author\'s attitude toward fast fashion itself is ______.', ['critical of the system, not simply the clothes', 'completely supportive', 'uninterested', 'confused'], 0, '作者说“Fast fashion is not evil in itself”，批评的是把衣服当一次性用品、把人当廉价的体系。', ['阅读-态度', '阅读-词句'], 3),
    ],
  },
  {
    id: 'r-10',
    title: 'Learning a Language as an Adult',
    difficulty: 2,
    text: `Many adults believe they are too old to learn a new language. Children seem to pick up languages effortlessly, while adults struggle with grammar and pronunciation. But research suggests that adults are not worse learners—they are different learners.

Children have more time and often more opportunities to practice. They are not afraid of making mistakes. Adults, on the other hand, have busy schedules and may feel embarrassed when they speak incorrectly. These factors, rather than age itself, explain much of the difference.

Adults actually have advantages. They understand grammar concepts, can set goals, and can use resources such as books, apps, and native speakers. A 2021 study found that adults who studied consistently for six months made faster progress in reading and writing than children in the same program.

Pronunciation is harder for adults, especially if they start after puberty. But it is not impossible. Regular listening and speaking practice can improve accent significantly. The key is to start early and practice often.

The biggest mistake adults make is waiting for the perfect moment. They buy a course, download an app, and then stop after two weeks. Language learning rewards habit more than talent. Fifteen minutes a day is better than two hours once a month. As one teacher put it, "The best learner is not the one who never makes mistakes, but the one who keeps talking."`,
    questions: [
      q('r-10-q1', 'What is the passage mainly about?', ['Adults can learn languages well with the right habits and advantages.', 'Children are always better language learners.', 'Adults should never study pronunciation.', 'Language apps are a waste of money.'], 0, '文章反驳“成人学不好语言”的偏见，说明成人的优势、困难与关键习惯。', ['阅读-主旨'], 1),
      q('r-10-q2', 'Why do children seem to learn languages more easily?', ['They have more time, opportunities and less fear of mistakes.', 'Their brains are completely different.', 'They never study grammar.', 'They have better teachers.'], 0, '第二段把差异归因于时间、机会和不怕犯错，而非年龄本身。', ['阅读-细节'], 1),
      q('r-10-q3', 'What advantage do adults have?', ['They can understand grammar concepts and set goals.', 'They never make mistakes.', 'They have more free time.', 'They learn pronunciation more easily.'], 0, '第三段列出成人优势：理解语法概念、能设定目标、会利用资源。', ['阅读-细节'], 1),
      q('r-10-q4', 'What does the passage say about adult pronunciation?', ['It is harder but can improve with regular practice.', 'It can never improve.', 'It is easier than for children.', 'It does not matter at all.'], 0, '第四段说成人发音更难，尤其青春期后开始学，但规律听说练习能显著改善。', ['阅读-细节'], 2),
      q('r-10-q5', 'What does the teacher\'s quote emphasize?', ['Persistence matters more than being perfect.', 'Only talented people can learn languages.', 'Mistakes should be avoided.', 'Long study sessions are best.'], 0, '老师说最好的学习者不是从不犯错的人，而是不断开口的人，强调坚持。', ['阅读-词句', '阅读-推断'], 2),
    ],
  },
];
