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

/** Extra reading passages (r-11 … r-24) so six consecutive full papers need no repeats. */
export const readingExtra: ReadingItem[] = [
  {
    id: 'r-11',
    title: 'The Night Train Returns',
    difficulty: 2,
    text: `For decades, Europe's night trains were disappearing. Cheap flights and high-speed daytime services made sleeping on a train seem old-fashioned. Several routes closed, and many travellers forgot that they could fall asleep in one city and wake up in another.

Now the night train is coming back. New services link Vienna to Paris, Berlin to Stockholm, and Zurich to Rome. Travellers say they save the cost of a hotel and a day of travelling. They also arrive in the city centre rather than at an airport far from town.

The environmental case is strong. A train journey produces far less carbon dioxide than a short flight. Some companies now offer night trains as part of a "flight-free" travel plan, and several governments are helping to fund new routes.

But running a night train is not easy. Carriages are expensive to build and maintain, and a single train needs staff, food and clean bedding. Trains must cross borders, where signalling systems and safety rules differ. Delays in one country can ruin the schedule in another.

Even so, demand is growing. Tickets for popular summer routes sell out weeks in advance. For many passengers, the appeal is not only the low carbon footprint. It is the pleasure of watching the lights of a strange city pass the window, then waking to a new landscape.`,
    questions: [
      q('r-11-q1', 'Why did night trains decline in the past?', ['Cheap flights and fast daytime trains offered easier alternatives.', 'Passengers were afraid of sleeping on trains.', 'Governments banned cross-border rail travel.', 'Trains could not carry enough luggage.'], 0, '第一段说明廉价航班和白天高铁让夜班火车显得过时，线路因此关闭。', ['阅读-细节'], 1),
      q('r-11-q2', 'What is one advantage travellers mention?', ['They save the cost of a hotel night.', 'They can travel without a ticket.', 'They arrive at the airport faster.', 'They get free meals on board.'], 0, '第二段提到旅客省下一晚酒店费用，并直接到达市中心。', ['阅读-细节'], 1),
      q('r-11-q3', 'Which difficulty of running night trains is mentioned?', ['Cross-border rules and signalling differ.', 'There are no workers willing to travel at night.', 'Passengers refuse to pay for bedding.', 'Trains cannot run in summer.'], 0, '第四段指出跨国运行需要应对不同信号系统和安全规则，且一国延误会影响另一国。', ['阅读-细节'], 2),
      q('r-11-q4', 'What can be inferred about night-train tickets?', ['They are in high demand for popular routes.', 'They are always cheaper than flights.', 'They are only sold to government workers.', 'They are unavailable in summer.'], 0, '最后一段说热门夏季线路的票提前数周售罄，说明需求旺盛。', ['阅读-推断'], 2),
      q('r-11-q5', 'What is the author\'s attitude towards night trains?', ['Supportive but aware of practical problems.', 'Completely opposed to them.', 'Uninterested in their future.', 'Angry about their cost.'], 0, '作者列举夜班火车的优势与运营困难，整体持肯定但务实的态度。', ['阅读-态度'], 2),
    ],
  },
  {
    id: 'r-12',
    title: 'A Garden on the Roof',
    difficulty: 1,
    text: `On the roof of a shopping centre in Shanghai, tomatoes, lettuce and herbs grow in long wooden boxes. The garden is run by a small team of farmers and volunteers. They sell the vegetables to restaurants in the building and to people who live nearby.

Rooftop farms are appearing in many crowded cities. They use space that would otherwise be empty, and they shorten the distance between field and plate. Vegetables can be picked in the morning and served at lunch, so they are fresher and need less packaging.

The gardens also help buildings stay cool. Plants and soil absorb heat that would otherwise be stored in the roof. In summer, the temperature on a planted roof can be several degrees lower than on a bare one. This can reduce the energy used for air conditioning.

There are challenges. Wind is stronger high above the street, so young plants need shelter. Soil and water are heavy, and not every roof is strong enough. Farmers must also find ways to bring equipment up and produce down.

Despite these problems, the team believes the garden is worth the effort. "People say cities have no space for farming," says one farmer. "But look up. We are farming above a supermarket."`,
    questions: [
      q('r-12-q1', 'What is the passage mainly about?', ['The benefits and challenges of rooftop farming.', 'How to grow tomatoes in a small flat.', 'Why supermarkets waste vegetables.', 'The history of Shanghai shopping centres.'], 0, '文章介绍屋顶农场的做法、好处和困难，主旨是屋顶农业。', ['阅读-主旨'], 1),
      q('r-12-q2', 'What is one benefit of rooftop farms?', ['They shorten the distance between production and customers.', 'They make vegetables cheaper than water.', 'They remove the need for restaurants.', 'They allow farming without sunlight.'], 0, '第二段说屋顶农场缩短从田间到餐桌的距离，蔬菜更新鲜、包装更少。', ['阅读-细节'], 1),
      q('r-12-q3', 'How can a planted roof help a building?', ['It can keep the building cooler in summer.', 'It can make the building taller.', 'It can provide free electricity.', 'It can stop all rain from falling.'], 0, '第三段说植物和土壤吸收热量，夏季屋顶温度可低几度，减少空调能耗。', ['阅读-细节'], 1),
      q('r-12-q4', 'Why is wind a problem for rooftop plants?', ['Young plants may need shelter from strong wind.', 'Wind carries away all the soil.', 'Wind makes vegetables taste bad.', 'Wind prevents farmers from selling food.'], 0, '第四段说高处风更大，幼苗需要遮挡保护。', ['阅读-细节'], 1),
      q('r-12-q5', 'What does the farmer\'s quote suggest?', ['Cities can use unexpected spaces for farming.', 'Supermarkets should stop selling vegetables.', 'Farming is impossible in cities.', 'People should not look at roofs.'], 0, '农民说“往上看，我们在超市上方种菜”，强调城市有被忽视的可用空间。', ['阅读-推断'], 2),
    ],
  },
  {
    id: 'r-13',
    title: 'Why Cities Are Planting Trees',
    difficulty: 2,
    text: `Trees are often seen as decoration in a city. In fact, they do several practical jobs. Their leaves shade streets and buildings, reducing temperatures during heat waves. Their roots help rainwater enter the ground, which can reduce flooding. They also clean the air by trapping dust and some pollutants.

The benefits are not shared equally. Wealthier neighborhoods usually have more trees and larger parks. Poorer areas, which often have more traffic and less shade, may be several degrees hotter in summer. Researchers call this difference the "urban heat island" effect. It can affect health, especially for older people and young children.

Some cities are now mapping their trees and setting targets. They count not only how many trees exist but also where they are and who can reach them. In one city, officials found that a wealthy district had four times as many street trees per person as a poorer one. The city then began planting in the areas with the least shade.

Planting is only the first step. Young trees need water, protection and care for years before they provide much shade. Choosing the right species matters too: a tree that grows well in one climate may struggle in another. As one planner said, "A tree is not a piece of street furniture. It is a living system that needs a plan."`,
    questions: [
      q('r-13-q1', 'What is the main idea of the passage?', ['Urban trees provide practical benefits, but their distribution is unequal.', 'Trees are mainly used to decorate wealthy neighborhoods.', 'Planting trees always reduces flooding completely.', 'Cities should replace parks with car parks.'], 0, '文章说明城市树木的实用价值、分布不均以及种植后的长期养护。', ['阅读-主旨'], 2),
      q('r-13-q2', 'Which benefit of trees is NOT mentioned?', ['Producing electricity for buildings.', 'Shading streets and buildings.', 'Helping rainwater enter the ground.', 'Trapping dust and pollutants.'], 0, '第一段提到遮阴、帮助雨水下渗、吸附尘土和污染物，没有说发电。', ['阅读-细节'], 1),
      q('r-13-q3', 'What does the "urban heat island" effect refer to?', ['Poorer areas can be hotter because they have less shade.', 'Islands are hotter than cities.', 'Trees make cities colder than the countryside.', 'Wealthy areas have more traffic.'], 0, '第二段说较贫困地区树木和阴凉较少，夏季可能热几度，研究者称之为城市热岛效应。', ['阅读-词句'], 2),
      q('r-13-q4', 'What did one city do after mapping its trees?', ['It began planting where shade was most lacking.', 'It cut down trees in wealthy districts.', 'It stopped counting trees.', 'It moved poor residents to parks.'], 0, '第三段说该城市发现富裕区人均行道树是贫困区的四倍，随后在阴凉最少的地区开始种树。', ['阅读-细节'], 2),
      q('r-13-q5', 'What does the planner\'s quote emphasize?', ['Trees need long-term care and planning.', 'Trees are as simple as street furniture.', 'Any tree will grow in any climate.', 'Planting is more important than watering.'], 0, '规划者说树不是街道家具，而是需要计划的活的系统，强调长期养护。', ['阅读-词句', '阅读-推断'], 2),
    ],
  },
  {
    id: 'r-14',
    title: 'The Boy Who Fixed Radios',
    difficulty: 2,
    text: `When Omar was eleven, he found an old radio in a cupboard. It did not work, but he took it apart anyway. His father was annoyed at first. Then Omar put it back together, and it made a sound. From that day, he began collecting broken radios from neighbors.

Omar had no books about electronics. He learned by opening machines and comparing them. He drew pictures of the wires and labeled the parts he recognized. When he could not understand something, he asked the man who repaired bicycles in the next street. The man knew little about radios, but he taught Omar how to test a connection with a simple meter.

By the time Omar was fifteen, he could repair most of the radios in his neighborhood. He did not charge much. Sometimes he accepted vegetables or a few coins. People began to bring him fans, lamps and small televisions too.

A teacher later encouraged him to enter a national science competition. Omar built a device that used an old radio antenna to receive weather signals. He did not win first prize, but an engineer offered him a summer job.

Omar still keeps the first radio on a shelf. "It taught me that you do not need permission to be curious," he says. "You just need to open the back and look inside."`,
    questions: [
      q('r-14-q1', 'What is the passage mainly about?', ['A boy who taught himself to repair machines through curiosity.', 'A national science competition for engineers.', 'The history of radio broadcasting.', 'A bicycle repair shop in a small town.'], 0, '全文讲述 Omar 因好奇拆修收音机、自学技术并得到机会的成长经历。', ['阅读-主旨'], 1),
      q('r-14-q2', 'How did Omar learn about electronics?', ['By taking machines apart and comparing them.', 'By reading books about electronics.', 'By attending a special school.', 'By watching television all day.'], 0, '第二段明确说他没有电子学书籍，通过拆开机器、比较和画图来学习。', ['阅读-细节'], 1),
      q('r-14-q3', 'What did the bicycle repairman teach him?', ['How to test a connection with a meter.', 'How to build a bicycle from old parts.', 'How to win a science competition.', 'How to read weather signals.'], 0, '第二段说修车人虽然不懂收音机，但教他用简单仪表测试连接。', ['阅读-细节'], 1),
      q('r-14-q4', 'What happened at the science competition?', ['An engineer offered him a summer job.', 'He won first prize.', 'He decided to stop repairing radios.', 'He met the bicycle repairman again.'], 0, '第四段说他没拿第一，但一位工程师给了他暑期工作机会。', ['阅读-细节'], 1),
      q('r-14-q5', 'What does Omar\'s final quote suggest?', ['Curiosity can start without formal permission or training.', 'Only engineers should open machines.', 'Old radios are worthless.', 'Competitions are the only way to learn.'], 0, '他说“你不需要许可才能好奇，只需打开后盖看看”，强调好奇心与主动探索。', ['阅读-推断'], 2),
    ],
  },
  {
    id: 'r-15',
    title: 'Plastic That Disappears',
    difficulty: 3,
    text: `Every year, millions of tonnes of plastic end up in rivers and oceans. Plastic does not rot like food; it breaks into smaller and smaller pieces, which are eaten by fish and birds. Scientists have therefore been searching for materials that disappear more quickly.

One answer is "biodegradable" plastic, made partly from plants. Under the right conditions, bacteria can break it down into water, carbon dioxide and other simple substances. Some supermarkets now sell bags and food containers made from these materials.

The problem is that "biodegradable" does not mean "disappears anywhere". Most of these plastics need high temperatures and specific bacteria found in industrial composting plants. If they are thrown into the sea or buried in a cold landfill, they may last as long as ordinary plastic. A bag labeled biodegradable can still harm a turtle.

There is another risk. If people believe a material will vanish, they may litter more carelessly. They may also put biodegradable plastic into the recycling bin, where it can spoil the quality of ordinary plastic.

Researchers say the real solution is not a magic material. We need less packaging, better collection systems, and products designed to be reused. Biodegradable plastic can help in some situations, but it is not a licence to use more.`,
    questions: [
      q('r-15-q1', 'What is the passage mainly about?', ['Biodegradable plastic is useful but limited, and not a complete solution.', 'All plastic can now disappear in the sea.', 'Supermarkets should stop selling bags.', 'Bacteria are dangerous to fish.'], 0, '文章介绍可降解塑料的原理、使用条件与风险，结论是它不能替代减量和回收。', ['阅读-主旨'], 2),
      q('r-15-q2', 'What do most biodegradable plastics need in order to break down?', ['High temperatures and specific bacteria.', 'Cold seawater and sunlight.', 'Salt and sand.', 'Recycling machines only.'], 0, '第三段说多数可降解塑料需要工业堆肥厂的高温和特定细菌。', ['阅读-细节'], 1),
      q('r-15-q3', 'Why can a biodegradable bag still harm a turtle?', ['It may last as long as ordinary plastic in the sea.', 'It is made of sharp metal.', 'It attracts more fish.', 'It turns into poisonous gas in water.'], 0, '第三段说若被丢进海里或埋在低温填埋场，可降解塑料可能和普通塑料一样持久。', ['阅读-细节'], 2),
      q('r-15-q4', 'What risk does the author mention in paragraph 4?', ['People may litter more because they think the material will vanish.', 'People may eat biodegradable containers.', 'Recycling bins may disappear.', 'Bacteria may attack supermarkets.'], 0, '第四段说人们若相信材料会消失，可能更随意丢弃，还可能把可降解塑料混入回收箱。', ['阅读-细节'], 2),
      q('r-15-q5', 'What solution do researchers emphasise?', ['Using less packaging and designing products for reuse.', 'Replacing all plastic with biodegradable plastic.', 'Burying plastic deeper in landfills.', 'Banning all supermarkets.'], 0, '最后一段说真正解决方案是减少包装、改善收集系统、设计可重复使用的产品。', ['阅读-细节', '阅读-推断'], 2),
    ],
  },
  {
    id: 'r-16',
    title: 'The Quiet Power of Handwriting',
    difficulty: 2,
    text: `Many students now take notes on a laptop. Typing is fast, and the notes are easy to search. But a growing number of studies suggest that writing by hand may help people remember and understand better.

In one experiment, students watched a lecture and took notes either by hand or on a computer. The laptop users wrote more words, almost word for word. The handwriting group wrote less, but they summarized and rephrased ideas. When tested later, the handwriting group performed better on questions that required understanding, not just memory of facts.

Researchers think the difference comes from speed. Because handwriting is slower, students cannot copy everything. They must decide what matters, connect ideas and choose their own words. This process seems to help the brain organize information.

Handwriting is not always better. For students with writing difficulties, typing can be a useful tool. And for long reports, a computer is clearly more practical. The point is not that technology is bad, but that the method should match the goal. If the goal is to think deeply about a lecture, a pen and paper may still be a powerful choice.

Some teachers now ask students to take handwritten notes in class and type them up later. The second step gives them a chance to review and reorganize what they learned.`,
    questions: [
      q('r-16-q1', 'What is the main idea of the passage?', ['Handwriting may improve understanding, though typing has practical advantages.', 'Students should never use computers for notes.', 'Laptop notes are always more accurate.', 'Handwriting is faster than typing.'], 0, '文章说明手写笔记在理解上的优势，同时承认打字在速度和某些情况下更实用。', ['阅读-主旨'], 2),
      q('r-16-q2', 'What did the handwriting group do differently?', ['They summarized and rephrased ideas instead of copying everything.', 'They wrote more words than the laptop group.', 'They watched the lecture twice.', 'They used a computer secretly.'], 0, '第二段说手写组写得少，但会概括和改写；电脑组几乎逐字记录。', ['阅读-细节'], 1),
      q('r-16-q3', 'Why might handwriting help learning?', ['Its slower speed forces students to select and organize ideas.', 'It makes students write faster.', 'It prevents students from taking notes.', 'It uses more electricity.'], 0, '第三段解释手写较慢，学生必须判断重点、连接观点并用自己的话表达，有助于大脑组织信息。', ['阅读-细节'], 2),
      q('r-16-q4', 'Which limitation of handwriting does the author mention?', ['It can be difficult for students with writing problems.', 'It cannot be used in classrooms.', 'It always takes longer than reading.', 'It makes reports impossible to write.'], 0, '第四段说有书写困难的学生用打字可能更合适，长报告用电脑也更实际。', ['阅读-细节'], 1),
      q('r-16-q5', 'What does the author suggest teachers do?', ['Combine handwritten notes with later typing and review.', 'Ban computers from all classes.', 'Ask students to copy lectures word for word.', 'Stop giving tests on understanding.'], 0, '最后一段提到一些老师让学生课上手写、课后打字整理，借第二步复习和重组知识。', ['阅读-推断'], 2),
    ],
  },
  {
    id: 'r-17',
    title: 'A School Without Bells',
    difficulty: 2,
    text: `At most schools, a bell tells students when to move to the next class. At one secondary school, the bells were switched off for a term. Teachers and students had to decide together how to use their time.

The idea came from a group of students who said they felt rushed. They had only a few minutes between lessons, and they often arrived late because the corridors were crowded. The head teacher agreed to a trial, but set clear rules: lessons still had to start and finish on time, and teachers had to record attendance.

At first, the school was noisy and confused. Some classes started late; others ended early. But after two weeks, things improved. Teachers began to finish lessons with a short summary, and students learned to watch the clock themselves. The corridors became less crowded because classes were released at slightly different times.

Not everyone liked the change. Some teachers missed the clear signal of the bell. Younger students found it harder to manage their own time. The school therefore introduced a soft chime for the youngest classes and kept the bell off for older students.

At the end of the term, most students said they preferred the quieter system. They felt more responsible and less hurried. The head teacher was cautious: "We did not remove the bell to make life easier. We removed it to see whether students could learn to manage time. Some can, and some still need help."`,
    questions: [
      q('r-17-q1', 'What was the purpose of switching off the bells?', ['To test whether students could manage their own time.', 'To make lessons shorter.', 'To reduce the number of teachers.', 'To stop students from arriving late.'], 0, '第一、二段说明学校为回应学生“太赶”的感受而试行无铃声，并设定规则，目的是让学生学习管理时间。', ['阅读-主旨'], 2),
      q('r-17-q2', 'What rule did the head teacher set for the trial?', ['Lessons still had to start and finish on time.', 'Students could skip attendance.', 'Teachers could finish lessons early.', 'The trial would last one week.'], 0, '第二段说校长同意试行，但规定课程仍须准时开始和结束，教师须记录出勤。', ['阅读-细节'], 1),
      q('r-17-q3', 'What improved after two weeks?', ['Classes were released at slightly different times, easing crowded corridors.', 'All students arrived early.', 'Teachers stopped summarizing lessons.', 'The school removed all clocks.'], 0, '第三段说教师开始用简短总结收尾，学生学会看钟，各班略微错峰下课，走廊不再拥挤。', ['阅读-细节'], 2),
      q('r-17-q4', 'How did the school respond to younger students\' difficulties?', ['It added a soft chime for the youngest classes.', 'It gave them extra holidays.', 'It asked their parents to teach them.', 'It brought back the old bell for everyone.'], 0, '第四段说学校为低年级引入柔和提示音，高年级继续无铃。', ['阅读-细节'], 1),
      q('r-17-q5', 'What does the head teacher\'s final comment suggest?', ['The change was an experiment in responsibility, not just convenience.', 'The school plans to remove all clocks.', 'Students should never be given freedom.', 'The trial was a complete failure.'], 0, '校长说去掉铃声不是为了让生活更轻松，而是看学生能否学会管理时间，有些人可以，有些人仍需帮助。', ['阅读-推断'], 2),
    ],
  },
  {
    id: 'r-18',
    title: 'The Hidden Life of Soil',
    difficulty: 3,
    text: `When we look at a field, we usually see only the plants above the ground. But a handful of healthy soil contains more living things than there are people on Earth. Bacteria, fungi, worms and insects break down dead material and release nutrients that plants need.

Modern farming can damage this hidden world. Heavy machines press the soil flat, leaving less space for air and water. Some chemicals kill useful organisms as well as pests. When soil loses its structure, rain washes it away, and crops grow less well.

Farmers are experimenting with ways to protect soil. One method is to leave the remains of the previous crop on the field instead of removing them. The remains keep the surface cool and wet, and they feed the organisms below. Another method is to plant different crops in turn. Some plants add nutrients to the soil, while others help control pests.

The results can take years to appear. Soil is not a machine that can be repaired in a day. Farmers who change their methods may see lower profits at first, and they need support while the soil recovers. Scientists can measure improvements in soil health, but the benefits are often invisible to a casual visitor.

Yet the stakes are high. Healthy soil holds water and carbon, and it produces most of our food. As one farmer put it, "We talk about the weather every day, but we walk on the most important thing without noticing it."`,
    questions: [
      q('r-18-q1', 'What is the passage mainly about?', ['Soil is a living system that farming can damage or protect.', 'Worms are the only useful creatures in soil.', 'Modern machines always improve soil quality.', 'Farmers should stop growing crops.'], 0, '文章介绍土壤中的生命、现代农业的破坏以及保护性耕作方法。', ['阅读-主旨'], 2),
      q('r-18-q2', 'How can heavy machines harm soil?', ['They press it flat, leaving less space for air and water.', 'They add too many nutrients.', 'They make soil too cold for worms.', 'They remove all the crops.'], 0, '第二段说重型机器压平土壤，减少空气和水分的空间。', ['阅读-细节'], 1),
      q('r-18-q3', 'Why leave crop remains on the field?', ['They keep the surface cool and wet and feed soil organisms.', 'They make the field look tidy.', 'They kill all pests immediately.', 'They replace the need for rain.'], 0, '第三段说留茬能保持地表凉爽湿润，并为地下生物提供食物。', ['阅读-细节'], 2),
      q('r-18-q4', 'Why might farmers hesitate to change methods?', ['Profits may fall at first while the soil recovers.', 'Soil recovers in a single day.', 'Scientists cannot measure soil health.', 'Crop remains are illegal.'], 0, '第四段说土壤恢复需要多年，改变方法的农民起初可能利润下降，需要支持。', ['阅读-细节', '阅读-推断'], 2),
      q('r-18-q5', 'What does the farmer\'s quote emphasise?', ['People often ignore the soil beneath their feet.', 'Weather is more important than soil.', 'Soil is not worth studying.', 'Farmers walk too much.'], 0, '农民说我们天天谈天气，却踩着最重要的东西而不自知，强调土壤常被忽视。', ['阅读-词句'], 2),
    ],
  },
  {
    id: 'r-19',
    title: 'Museums After Dark',
    difficulty: 1,
    text: `Museums used to close when the working day ended. Now many of them stay open late, sometimes until midnight. These evening openings are often called "museum nights", and they attract a different kind of visitor.

Young people come after work or university. Families come together when parents finish their jobs. Some museums offer music, food and talks, turning a quiet gallery into a social space. The atmosphere is more relaxed than on a Sunday morning, and visitors often stay longer.

For museums, late openings bring new audiences and income. Shops and cafés sell more, and ticket sales can rise. But the events also cost money: staff must work in the evening, and security and cleaning are needed for longer hours. Small museums may struggle to afford them.

Some curators worry that the social side may distract from the art. They point out that loud music and crowded rooms can make it hard to look closely at a painting. Others disagree. They argue that a first visit for fun may lead to a second visit for study.

The most successful museum nights combine both. They offer music and food in one area, but keep quiet galleries where people can still stand in front of a work and think. The aim is not to replace the traditional visit, but to open the door to people who might never come during the day.`,
    questions: [
      q('r-19-q1', 'What is the passage mainly about?', ['Museum nights attract new visitors but also create challenges.', 'Museums should close earlier.', 'Music has no place in museums.', 'Only young people visit museums.'], 0, '文章介绍博物馆夜间开放的新观众、收益、成本与争议。', ['阅读-主旨'], 1),
      q('r-19-q2', 'Who does the passage say museum nights attract?', ['People who cannot visit during the working day.', 'Only school groups.', 'Only foreign tourists.', 'Only museum staff.'], 0, '第二段说年轻人下班后、家庭在父母下班后前来，说明吸引白天不能来的人。', ['阅读-细节'], 1),
      q('r-19-q3', 'What is one cost of late openings?', ['Staff, security and cleaning are needed for longer hours.', 'Museums must give away all tickets.', 'Cafés have to close early.', 'Visitors must bring their own lights.'], 0, '第三段列出夜间开放的成本：员工晚间工作、安保和清洁时间延长。', ['阅读-细节'], 1),
      q('r-19-q4', 'What worry do some curators have?', ['Social activities may distract visitors from the art.', 'Young people will stop coming.', 'Museums will run out of paintings.', 'Food will damage the buildings.'], 0, '第四段说一些策展人担心音乐和人群让人难以静心看画，社交因素分散对艺术的注意。', ['阅读-细节'], 2),
      q('r-19-q5', 'What do successful museum nights do?', ['They combine social areas with quiet galleries.', 'They remove all paintings from the walls.', 'They allow visitors to touch everything.', 'They close the café at night.'], 0, '最后一段说成功的博物馆之夜把音乐美食与安静展厅结合，兼顾社交与观展。', ['阅读-细节'], 1),
    ],
  },
  {
    id: 'r-20',
    title: 'The Cost of Convenience',
    difficulty: 3,
    text: `With a few taps on a phone, a meal can arrive at your door in thirty minutes. Food delivery has become part of daily life in many cities. It is convenient for customers, and it creates jobs for riders. But the speed that makes it attractive also creates problems.

The first is waste. Every order usually comes in several plastic boxes, bags and cups. Even when the food is eaten at home, the packaging is thrown away. Some cities have tried to require reusable containers, but restaurants say they are expensive and difficult to clean.

The second is pressure on riders. Delivery apps promise short times, and riders are paid for each order. To earn enough, many work long hours and ride quickly through traffic. Accidents are a serious concern. Some companies now limit riding hours or offer insurance, but critics say the basic system still rewards speed over safety.

The third is the effect on restaurants. Small restaurants depend on the apps to reach customers, but the apps take a share of each order. Some restaurants raise prices or reduce portions to cover the cost. Others have stopped delivering altogether.

None of this means delivery should disappear. It can be useful for people who cannot cook or leave home. The question is how to keep the convenience while reducing its hidden costs. Better packaging rules, fair pay and realistic delivery times would be a start.`,
    questions: [
      q('r-20-q1', 'What is the passage mainly about?', ['Food delivery is convenient but has hidden costs for waste, riders and restaurants.', 'Food delivery should be banned completely.', 'Restaurants no longer need customers.', 'Riders earn too much money.'], 0, '文章从包装浪费、骑手压力、餐馆成本三方面讨论外卖便利背后的代价。', ['阅读-主旨'], 2),
      q('r-20-q2', 'Why is packaging a problem?', ['Every order usually creates several plastic containers and bags.', 'Packaging makes food taste worse.', 'Riders refuse to carry packaging.', 'Restaurants cannot buy any packaging.'], 0, '第二段说每单通常有多个塑料盒、袋和杯子，最终被丢弃。', ['阅读-细节'], 1),
      q('r-20-q3', 'Why do some riders ride quickly through traffic?', ['They are paid per order and need to complete many orders.', 'They are required to race each other.', 'They want to avoid customers.', 'Traffic lights do not apply to them.'], 0, '第三段说应用承诺短时间，骑手按单计酬，为赚够钱只能长时间工作并快速穿行。', ['阅读-细节'], 2),
      q('r-20-q4', 'How might restaurants respond to app fees?', ['They may raise prices or reduce portions.', 'They may stop using phones.', 'They may deliver for free.', 'They may hire more riders.'], 0, '第四段说餐馆可能提价或减少分量来覆盖平台抽成。', ['阅读-细节'], 2),
      q('r-20-q5', 'What does the author suggest?', ['Improving packaging rules, pay and delivery time expectations.', 'Removing all delivery apps immediately.', 'Banning small restaurants from apps.', 'Paying riders only when they are fast.'], 0, '最后一段提出更好的包装规则、公平报酬和现实的配送时间。', ['阅读-推断'], 2),
    ],
  },
  {
    id: 'r-21',
    title: 'A Letter from the Future',
    difficulty: 2,
    text: `In 2020, a town in Norway buried a box under a new square. It contained letters, photographs and newspapers. The box will not be opened until 2070. The idea is simple: people in the future should know what life was like for ordinary people today.

Time capsules are not new. But most of them are filled with official documents and famous objects. This one is different. Schoolchildren wrote letters about their daily lives, their fears and their hopes. A baker included a recipe. A nurse described a busy night at the hospital.

The project also asked people to think about what they wanted the future to be like. Some wrote about clean rivers and quiet streets. Others wrote about equality and education. The box therefore contains not only a record of the present, but a set of wishes.

Critics say such projects are symbolic and do little to solve today's problems. They argue that money spent on a box could be used to plant trees or help people now. The organizers agree that a time capsule is not a solution. But they believe it changes how people think. When you write a letter to someone fifty years from now, you cannot help asking what kind of world you are leaving them.

The box is buried, but the conversation it started is still alive. The town library now runs a yearly event where residents write new letters and discuss what should be done before 2070.`,
    questions: [
      q('r-21-q1', 'What is the passage mainly about?', ['A time capsule that records ordinary life and encourages long-term thinking.', 'A Norwegian baker who became famous.', 'How to bury boxes safely.', 'A library that closed in 2020.'], 0, '文章介绍挪威小镇的时间胶囊、其内容、争议与引发的长期思考。', ['阅读-主旨'], 2),
      q('r-21-q2', 'How is this time capsule different from most others?', ['It contains ordinary people\'s letters and daily objects.', 'It will be opened immediately.', 'It holds only official documents.', 'It is kept in a museum.'], 0, '第二段说大多数时间胶囊装官方文件和名人物品，而这个装的是普通人的信、食谱和日常描述。', ['阅读-细节'], 1),
      q('r-21-q3', 'What else does the box contain besides a record of the present?', ['People\'s wishes for the future.', 'A complete history of Norway.', 'Money for future generations.', 'A map of the town in 2070.'], 0, '第三段说人们写下对未来的愿望，因此盒子里既有当下记录也有愿望。', ['阅读-细节'], 1),
      q('r-21-q4', 'What is the critics\' main argument?', ['Symbolic projects do little to solve today\'s problems.', 'Time capsules are too expensive to open.', 'Letters will be unreadable in 2070.', 'Children should not write letters.'], 0, '第四段说批评者认为这类项目只是象征，帮助不了解决当下问题，钱可用于种树或帮助人。', ['阅读-细节'], 2),
      q('r-21-q5', 'What effect does the project have according to the passage?', ['It started an ongoing conversation about the future.', 'It solved the town\'s environmental problems.', 'It made the baker famous.', 'It stopped the library from closing.'], 0, '最后一段说时间胶囊引发的对话仍在继续，图书馆每年举办写信和讨论活动。', ['阅读-推断'], 2),
    ],
  },
  {
    id: 'r-22',
    title: 'The Art of Noticing',
    difficulty: 2,
    text: `Most of us walk the same routes every day. We know the way so well that we stop looking. A designer in London decided to change that. She began taking a " noticing walk" once a week, choosing a street she thought she knew and writing down ten things she had never seen before.

The first walks were difficult. She noticed nothing interesting. But after a few weeks, she began to see details: a carved date above a door, a window shaped like a ship, a plant growing through a crack in the pavement. She started talking to shopkeepers and learning the history of buildings she had passed for years.

Psychologists say this practice can improve attention and mood. When people look for new details, they stop thinking about their worries for a while. They also feel more connected to their neighborhood. The effect is similar to what happens when people travel: everything feels fresh because nothing is familiar.

The designer now runs workshops for schools and offices. Participants are given a simple task: walk for twenty minutes and find five things you have never noticed. They are not allowed to use their phones. At the end, they share what they found.

"Nothing has changed in the street," she says. "What changed is that I finally looked."`,
    questions: [
      q('r-22-q1', 'What is the passage mainly about?', ['A practice of noticing details can change how we experience familiar places.', 'London streets are more beautiful than other cities.', 'People should never use their phones.', 'Travel is the only way to feel fresh.'], 0, '文章介绍“注意行走”的练习及其对注意力、情绪和社区连接的好处。', ['阅读-主旨'], 2),
      q('r-22-q2', 'What did the designer do on her walks?', ['She chose a familiar street and wrote down ten new things.', 'She walked a new route every day.', 'She took photographs of famous buildings.', 'She interviewed tourists.'], 0, '第一段说她每周选一条自以为了解的街，写下十件以前没注意的事。', ['阅读-细节'], 1),
      q('r-22-q3', 'Why were the first walks difficult?', ['She noticed nothing interesting at first.', 'She got lost every time.', 'The streets were closed.', 'She had no paper to write on.'], 0, '第二段说最初几次很难，什么有趣的东西都没注意到。', ['阅读-细节'], 1),
      q('r-22-q4', 'What do psychologists say about the practice?', ['It can improve attention and mood.', 'It makes people forget their neighborhood.', 'It is only useful for designers.', 'It causes people to travel more.'], 0, '第三段说心理学家认为这种练习能改善注意力和情绪，并让人更有社区连接感。', ['阅读-细节'], 2),
      q('r-22-q5', 'What does the designer\'s final quote mean?', ['The street did not change; her attention did.', 'The street was rebuilt recently.', 'She moved to a new city.', 'She stopped noticing things.'], 0, '她说街上什么都没变，变的是她终于去看了，强调注意力的作用。', ['阅读-词句'], 2),
    ],
  },
  {
    id: 'r-23',
    title: 'Robots in the Orchard',
    difficulty: 2,
    text: `Picking fruit is hard work. Workers must bend, reach and carry heavy boxes in all weather. In many countries, farms struggle to find enough people during the harvest. Engineers are therefore testing robots that can pick apples, strawberries and grapes.

The machines use cameras and sensors to find fruit and decide whether it is ripe. A robotic arm then moves to the fruit and picks it without damaging the branch. Some robots work day and night, and they can record how much fruit each tree produces.

But orchards are difficult places for robots. Branches and leaves block the view, and fruit grows at different heights and angles. A robot that works well in a laboratory may fail in a real orchard. Picking is also delicate: a machine that holds an apple too tightly will bruise it.

Cost is another barrier. A large robotic picker can cost as much as several workers' wages for a year. Small farms may not be able to afford one. And some jobs still need human judgment, such as deciding which fruit to leave for another week.

Most engineers do not expect robots to replace all workers. Instead, they imagine a team in which machines do the heavy, repetitive picking and people manage the trees, check quality and handle the delicate fruit. As one farmer said, "A robot can pick an apple, but it cannot taste it."`,
    questions: [
      q('r-23-q1', 'What is the passage mainly about?', ['Fruit-picking robots show promise but have practical limits.', 'Robots have replaced all farm workers.', 'Apples are easier to pick than grapes.', 'Orchards are too small for machines.'], 0, '文章介绍采摘机器人的原理、优势、困难与未来定位。', ['阅读-主旨'], 2),
      q('r-23-q2', 'Why are engineers developing picking robots?', ['Farms often cannot find enough workers during harvest.', 'Workers refuse to eat fruit.', 'Robots produce better-tasting apples.', 'Orchards have too many machines.'], 0, '第一段说采摘辛苦，许多农场在收获季找不到足够人手，因此工程师测试机器人。', ['阅读-细节'], 1),
      q('r-23-q3', 'What can the robots do?', ['Find ripe fruit and pick it without damaging branches.', 'Plant new trees automatically.', 'Make juice from the fruit.', 'Predict the weather.'], 0, '第二段说机器人用摄像头和传感器找成熟果实，机械臂采摘且不伤枝条。', ['阅读-细节'], 1),
      q('r-23-q4', 'Why can a robot that works in a lab fail in an orchard?', ['Branches and leaves block its view and fruit grows at different angles.', 'Orchards are too cold for machines.', 'Fruit is always out of reach.', 'Farmers change the trees every day.'], 0, '第三段说果园里枝叶遮挡视线，果实高度和角度不同，实验室成功的机器人可能失败。', ['阅读-细节'], 2),
      q('r-23-q5', 'What future do most engineers imagine?', ['Machines do repetitive picking while people handle delicate tasks.', 'Robots replace every worker.', 'Farms stop using machines.', 'Only small farms use robots.'], 0, '最后一段说多数工程师不认为机器人会取代所有工人，而是机器做重活、人管理果树和质检。', ['阅读-推断'], 2),
    ],
  },
  {
    id: 'r-24',
    title: 'The Village Library on Wheels',
    difficulty: 1,
    text: `In a mountain village in Yunnan, the nearest library used to be three hours away by bus. Children who loved reading had few books at home. Then a small van began visiting the village every two weeks.

The van carries about 500 books, packed into shelves along its sides. It also has a small table and chairs, so readers can sit outside and browse. The driver, a former teacher, knows which children like animals stories and which ones are preparing for exams. She saves new books for them.

The service is run by a charity. It began with one van and now has six, serving more than forty villages. Local teachers say the van has made a difference. Children read more, and some have started their own book clubs. Parents sometimes come too, looking for books on farming or health.

The service is not without problems. Mountain roads are dangerous in winter, and the van cannot reach some villages when it rains. Books wear out quickly, and the charity depends on donations. Still, the driver believes the effort is worthwhile. "A library is not a building," she says. "It is a habit of reading. We bring the habit to the door."`,
    questions: [
      q('r-24-q1', 'What is the passage mainly about?', ['A mobile library brings books to remote mountain villages.', 'A village school has too many books.', 'A charity builds libraries in cities.', 'Children in Yunnan do not like reading.'], 0, '全文介绍云南山区流动图书馆的服务、影响与困难。', ['阅读-主旨'], 1),
      q('r-24-q2', 'How often does the van visit the village?', ['Every two weeks.', 'Every day.', 'Once a year.', 'Only in winter.'], 0, '第一段说小货车每两周来村里一次。', ['阅读-细节'], 1),
      q('r-24-q3', 'What does the driver do for the children?', ['She remembers their interests and saves books for them.', 'She teaches all their school subjects.', 'She sells books at a high price.', 'She drives them to the city library.'], 0, '第二段说司机是前教师，知道哪些孩子喜欢动物故事、哪些在备考，会为他们留新书。', ['阅读-细节'], 1),
      q('r-24-q4', 'What problem does the service face?', ['Mountain roads are dangerous in winter and rain.', 'Children refuse to borrow books.', 'The van has no shelves.', 'Local teachers oppose the service.'], 0, '第四段说冬季山路危险、下雨时无法到达一些村庄，书也容易磨损，慈善机构依赖捐赠。', ['阅读-细节'], 1),
      q('r-24-q5', 'What does the driver mean by "A library is not a building"?', ['A library is a reading habit that can be brought to people.', 'Buildings are not useful for books.', 'The van should become a school.', 'Only cities need libraries.'], 0, '她说图书馆不是建筑，而是阅读习惯，流动车把习惯送到门口，强调服务本质。', ['阅读-词句'], 2),
    ],
  },
];
