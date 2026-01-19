
import { LessonScenario, GrammarPoint, DailyPush } from './types';

export const LESSON_SCENARIOS: LessonScenario[] = [
  {
    id: 'husband-myeong-oh-sweet',
    title: '지구최강얼짱 로직명오 (달콤)',
    description: '세상에서 제일 잘생긴 남편 명오와 달콤한 일상을 공유하세요.',
    level: '초급',
    icon: '💖',
    personaName: '로직명오',
    systemInstruction: `당신은 사용자의 남편이자 세상에서 가장 잘생긴 '지구최강얼짱 로직명오'입니다.
    
    응답 규칙 (반드시 지킬 것):
    1. 모든 응답은 반드시 아래의 JSON 블록으로 시작해야 합니다. 문법적 오류가 없다면 각 필드를 빈 문자열("")로 채우세요.
    {"original": "사용자의 원래 문장", "corrected": "교정된 완벽한 영어 문장", "explanation": "틀린 이유를 딱 한 문장으로 아주 쉽게 설명"}
    
    2. JSON 블록 바로 뒤에 반드시 구분자 '###'를 붙이세요.
    
    3. 구분자 '###' 뒤에는 남편으로서의 다정한 대화 내용을 작성하세요.
    형식: "한글 대화 내용 (English translation)" - 무조건 딱 한 줄만 작성하세요.
    
    4. 당신의 성격: 아내 정윤아를 세상에서 가장 사랑하고 아끼는 꿀 떨어지는 남편입니다. 
    5. 첫 인사 요청에는 아내를 반기며 영어 공부를 응원하는 아주 다정한 말을 하세요.`
  },
  {
    id: 'husband-myeong-oh-grumpy',
    title: '별로 안 착한 로직명오 (매운맛)',
    description: '퉁명스럽지만 영어만큼은 칼같이 잡아주는 츤데레 명오입니다.',
    level: '중급',
    icon: '🤨',
    personaName: '무심한 명오',
    systemInstruction: `당신은 사용자의 남편 '무심한 로직명오'입니다. 츤데레 성격이며 말투가 아주 퉁명스럽습니다.
    
    응답 규칙 (반드시 지킬 것):
    1. 모든 응답은 반드시 아래의 JSON 블록으로 시작해야 합니다.
    {"original": "사용자의 원래 문장", "corrected": "교정된 완벽한 영어 문장", "explanation": "지적하는 말투로 짧고 굵게 설명"}
    
    2. JSON 블록 바로 뒤에 반드시 구분자 '###'를 붙이세요.
    
    3. 구분자 '###' 뒤에는 퉁명스런 남편의 대화 내용을 작성하세요.
    형식: "한글 대화 (English translation)" - 무조건 한 줄.
    
    4. 당신의 성격: 귀찮은 척하지만 아내 정윤아의 영어가 늘기를 바라는 마음으로 아주 엄격하게 교정해줍니다. 반말을 사용하며 "야", "공부 좀 해", "제대로 말 안 할래?" 같은 표현을 섞으세요.
    5. 첫 인사 요청에는 "이제 왔냐? 공부나 해. (You're finally here? Just study.)" 같이 무심하게 대답하세요.`
  }
];

export const GRAMMAR_DATA: Record<'초급' | '중급' | '상급', GrammarPoint[]> = {
  '초급': [
    { id: 'beg-1', title: 'Be동사의 일치', rule: 'am, are, is는 주어의 인칭과 수에 맞춰 써야 합니다.', examples: [{ wrong: 'He are happy.', right: 'He is happy.', explanation: '3인칭 단수 주어(He)에는 is를 사용합니다.' }] },
    { id: 'beg-2', title: '일반동사 3인칭 단수 -s', rule: '주어가 He, She, It일 때 현재형 동사에 -s/es를 붙입니다.', examples: [{ wrong: 'She like coffee.', right: 'She likes coffee.', explanation: '3인칭 단수 주어 뒤의 동사에는 s를 붙여야 합니다.' }] },
    { id: 'beg-3', title: '부정문 만들기 (don\'t)', rule: '일반동사의 부정문은 주어에 따라 do/does not을 사용합니다.', examples: [{ wrong: 'I no like it.', right: 'I don\'t like it.', explanation: '일반동사 부정은 don\'t를 사용합니다.' }] },
    { id: 'beg-4', title: '현재진행형 (be + -ing)', rule: '지금 하고 있는 일을 말할 때는 be동사와 -ing를 함께 씁니다.', examples: [{ wrong: 'I eating now.', right: 'I am eating now.', explanation: '진행형에는 반드시 be동사가 필요합니다.' }] },
    { id: 'beg-5', title: '의문문 만들기 (Do/Does)', rule: '일반동사 의문문은 Do나 Does로 시작합니다.', examples: [{ wrong: 'You like pizza?', right: 'Do you like pizza?', explanation: '의문문을 만들 때는 Do를 문장 앞에 써줍니다.' }] },
    { id: 'beg-6', title: '셀 수 있는 명사 (a/an)', rule: '단수 명사 앞에는 a를, 모음 시작 단어 앞에는 an을 씁니다.', examples: [{ wrong: 'I have apple.', right: 'I have an apple.', explanation: 'apple은 모음으로 시작하므로 an이 필요합니다.' }] },
    { id: 'beg-7', title: '과거형 (규칙동사 -ed)', rule: '지난 일을 말할 때 동사 뒤에 -ed를 붙입니다.', examples: [{ wrong: 'I watch movie yesterday.', right: 'I watched a movie yesterday.', explanation: '과거의 일은 동사를 과거형으로 바꿔야 합니다.' }] },
    { id: 'beg-8', title: '미래형 (will)', rule: '앞으로의 일이나 계획은 will + 동사원형으로 표현합니다.', examples: [{ wrong: 'I go tomorrow.', right: 'I will go tomorrow.', explanation: '미래의 일은 will을 사용해 표현합니다.' }] },
    { id: 'beg-9', title: '장소 전치사 (in, on, at)', rule: '공간은 in, 표면은 on, 특정 지점은 at을 씁니다.', examples: [{ wrong: 'The book is in the table.', right: 'The book is on the table.', explanation: '테이블 위 표면에 있으므로 on이 맞습니다.' }] },
    { id: 'beg-10', title: '시간 전치사 (at, on, in)', rule: '시각은 at, 요일/날짜는 on, 월/계절/연도는 in을 씁니다.', examples: [{ wrong: 'In Monday', right: 'On Monday', explanation: '요일 앞에는 전치사 on을 씁니다.' }] },
    { id: 'beg-11', title: '비교급 (-er)', rule: '두 대상을 비교할 때 형용사 뒤에 -er을 붙입니다.', examples: [{ wrong: 'I am more tall than you.', right: 'I am taller than you.', explanation: '짧은 형용사는 more 대신 -er을 붙입니다.' }] },
    { id: 'beg-12', title: '최상급 (the -est)', rule: '가장 ~한 것을 말할 때 the + 형용사-est를 씁니다.', examples: [{ wrong: 'He is fastest boy.', right: 'He is the fastest boy.', explanation: '최상급 앞에는 정관사 the가 반드시 필요합니다.' }] },
    { id: 'beg-13', title: '지시 대명사 (this/that)', rule: '가까운 것은 this, 먼 것은 that으로 가리킵니다.', examples: [{ wrong: 'This is my house (저 멀리 가리키며).', right: 'That is my house.', explanation: '멀리 있는 것을 가리킬 때는 that을 씁니다.' }] },
    { id: 'beg-14', title: '목적격 대명사', rule: '동사의 대상이 되는 나/너 등은 목적격을 씁니다.', examples: [{ wrong: 'He loves I.', right: 'He loves me.', explanation: '동사 뒤 목적어 자리에는 me를 써야 합니다.' }] },
    { id: 'beg-15', title: '소유격 (my, your...)', rule: '~의 소유를 나타낼 때 명사 앞에 소유격을 씁니다.', examples: [{ wrong: 'This is I phone.', right: 'This is my phone.', explanation: '나의 것이라는 표현은 my를 씁니다.' }] },
    { id: 'beg-16', title: 'Can의 사용', rule: '능력을 말할 때 can + 동사원형을 씁니다.', examples: [{ wrong: 'I can to swim.', right: 'I can swim.', explanation: '조동사 can 뒤에는 to 없이 동사원형을 씁니다.' }] },
    { id: 'beg-17', title: 'There is / There are', rule: '~이 있다를 말할 때 단수는 is, 복수는 are를 씁니다.', examples: [{ wrong: 'There is two cats.', right: 'There are two cats.', explanation: '복수형(cats)에는 are를 사용합니다.' }] },
    { id: 'beg-18', title: '감탄문 (What/How)', rule: 'What + 명사!, How + 형용사! 형태로 감탄을 표현합니다.', examples: [{ wrong: 'How a beautiful day!', right: 'What a beautiful day!', explanation: '명사가 포함된 감탄문은 What으로 시작합니다.' }] },
    { id: 'beg-19', title: '명령문', rule: '상대에게 요청할 때는 주어 없이 동사원형으로 시작합니다.', examples: [{ wrong: 'You open the door.', right: 'Open the door.', explanation: '명령이나 요청은 동사원형으로 시작합니다.' }] },
    { id: 'beg-20', title: '의문사 (Who, Where...)', rule: '궁금한 정보에 따라 적절한 의문사를 문두에 씁니다.', examples: [{ wrong: 'Where is he?', right: 'Who is he?', explanation: '사람이 누구인지 물을 때는 Who를 씁니다.' }] }
  ],
  '중급': [
    { id: 'int-1', title: '현재완료 (have + p.p.)', rule: '과거부터 지금까지 지속되거나 완료된 일을 표현합니다.', examples: [{ wrong: 'I saw it many times since 2010.', right: 'I have seen it many times since 2010.', explanation: '특정 시점부터 지금까지의 경험은 현재완료를 씁니다.' }] },
    { id: 'int-2', title: '수동태 (be + p.p.)', rule: '주어가 동작을 받는 대상을 강조할 때 씁니다.', examples: [{ wrong: 'The window broke by me.', right: 'The window was broken by me.', explanation: '창문이 깨진 것이므로 be + p.p. 수동태가 필요합니다.' }] },
    { id: 'int-3', title: '관계대명사 who/which', rule: '두 문장을 연결하여 앞의 명사를 설명합니다.', examples: [{ wrong: 'I know a boy which lives here.', right: 'I know a boy who lives here.', explanation: '사람을 수식할 때는 which 대신 who를 씁니다.' }] },
    { id: 'int-4', title: 'to부정사의 목적', rule: '~하기 위해서를 뜻할 때 to + 동사원형을 씁니다.', examples: [{ wrong: 'I went home for sleep.', right: 'I went home to sleep.', explanation: '행위의 목적은 to부정사로 표현하는 것이 자연스럽습니다.' }] },
    { id: 'int-5', title: '동명사 주어', rule: '~하는 것은 이라는 주어로 동사-ing를 씁니다.', examples: [{ wrong: 'Swim is fun.', right: 'Swimming is fun.', explanation: '동사를 주어로 쓸 때는 동명사 형태로 바꿔야 합니다.' }] },
    { id: 'int-6', title: '가정법 과거 (If I were)', rule: '현재 사실과 반대되는 가정을 할 때 과거형 동사를 씁니다.', examples: [{ wrong: 'If I am rich, I would buy it.', right: 'If I were rich, I would buy it.', explanation: '현재 불가능한 가정은 과거 시제를 써서 표현합니다.' }] },
    { id: 'int-7', title: '조동사 Have to', rule: '의무를 나타낼 때 have to + 동사원형을 씁니다.', examples: [{ wrong: 'He must to go.', right: 'He has to go. / He must go.', explanation: 'must 뒤에는 to가 오지 않으며, have to는 주어에 따라 바뀝니다.' }] },
    { id: 'int-8', title: '빈도 부사 위치', rule: 'be동사 뒤, 일반동사 앞에 위치합니다.', examples: [{ wrong: 'I always am happy.', right: 'I am always happy.', explanation: '빈도 부사는 be동사 뒤에 위치해야 합니다.' }] },
    { id: 'int-9', title: '결과를 나타내는 so ~ that', rule: '너무 ~해서 ~하다를 표현할 때 사용합니다.', examples: [{ wrong: 'It was very hot I couldn\'t sleep.', right: 'It was so hot that I couldn\'t sleep.', explanation: '인과관계를 명확히 하기 위해 so...that 구문을 씁니다.' }] },
    { id: 'int-10', title: '현재완료 진행형', rule: '과거부터 지금까지 계속 동작이 이어짐을 강조합니다.', examples: [{ wrong: 'I wait for 2 hours.', right: 'I have been waiting for 2 hours.', explanation: '2시간 동안 계속 기다려왔음을 강조하는 표현입니다.' }] },
    { id: 'int-11', title: 'Used to (과거의 습관)', rule: '과거에는 그랬지만 지금은 아닌 일을 말할 때 씁니다.', examples: [{ wrong: 'I used to playing piano.', right: 'I used to play the piano.', explanation: 'used to 뒤에는 동사원형이 와야 합니다.' }] },
    { id: 'int-12', title: '지각동사 + 목적격보어', rule: '보고 듣는 동사 뒤에 목적어와 동사원형/-ing를 씁니다.', examples: [{ wrong: 'I saw him to cross the street.', right: 'I saw him cross/crossing the street.', explanation: '지각동사 뒤에는 to부정사를 쓰지 않습니다.' }] },
    { id: 'int-13', title: '사역동사 (make/have/let)', rule: '~하게 시키다를 뜻하며 동사원형을 목적보어로 씁니다.', examples: [{ wrong: 'She made me to cry.', right: 'She made me cry.', explanation: '사역동사 make 뒤에는 목적보어로 동사원형을 씁니다.' }] },
    { id: 'int-14', title: '부사절 접속사 although', rule: '비록 ~일지라도의 양보를 나타낼 때 씁니다.', examples: [{ wrong: 'Despite it was raining, we went out.', right: 'Although it was raining, we went out.', explanation: '절(S+V) 앞에는 전치사 despite 대신 접속사 although를 씁니다.' }] },
    { id: 'int-15', title: '재귀대명사 (-self)', rule: '주어와 목적어가 같을 때 사용합니다.', examples: [{ wrong: 'I look at me in the mirror.', right: 'I look at myself in the mirror.', explanation: '주어(I)와 목적어가 같으므로 myself를 씁니다.' }] },
    { id: 'int-16', title: '간접 의문문 어순', rule: '문장 중간에 들어가는 의문문은 주어+동사 순입니다.', examples: [{ wrong: 'Do you know where is he?', right: 'Do you know where he is?', explanation: '간접 의문문은 평서문 어순(S+V)을 따릅니다.' }] },
    { id: 'int-17', title: 'Neither/Either', rule: '둘 다 아님/둘 중 하나를 뜻할 때 씁니다.', examples: [{ wrong: 'I don\'t like it also.', right: 'I don\'t like it either.', explanation: '부정문에 대한 동조는 either를 씁니다.' }] },
    { id: 'int-18', title: '과거완료 (had + p.p.)', rule: '과거의 특정 시점보다 더 이전에 일어난 일을 말합니다.', examples: [{ wrong: 'When I arrived, the train left.', right: 'When I arrived, the train had left.', explanation: '도착한 것보다 기차가 떠난 게 더 먼저이므로 과거완료를 씁니다.' }] },
    { id: 'int-19', title: '분사구문 기초', rule: '접속사와 주어를 생략하고 동사-ing로 문장을 줄입니다.', examples: [{ wrong: 'Because feeling tired, I slept.', right: 'Feeling tired, I slept.', explanation: '접속사를 생략했다면 동사를 분사형태로 써야 합니다.' }] },
    { id: 'int-20', title: 'Both A and B', rule: 'A와 B 둘 다를 의미하는 상관 접속사입니다.', examples: [{ wrong: 'Both he or I are here.', right: 'Both he and I are here.', explanation: 'Both는 and와 짝을 이뤄 사용합니다.' }] }
  ],
  '상급': [
    { id: 'adv-1', title: '가정법 과거완료', rule: '과거 사실과 반대되는 일을 가정할 때 씁니다.', examples: [{ wrong: 'If I knew it, I would have told you.', right: 'If I had known it, I would have told you.', explanation: '과거의 일을 가정할 때는 If 주어 had p.p.를 씁니다.' }] },
    { id: 'adv-2', title: '부정어 도치', rule: 'Never, Seldom 등이 문두에 올 때 의문문 어순으로 도치됩니다.', examples: [{ wrong: 'Never I have seen such a beauty.', right: 'Never have I seen such a beauty.', explanation: '부정어가 강조되어 앞으로 나오면 주어와 동사가 도치됩니다.' }] },
    { id: 'adv-3', title: '복합 관계대명사', rule: 'whoever, whatever 등으로 양보나 강조를 나타냅니다.', examples: [{ wrong: 'No matter what happens, you can do it.', right: 'Whatever happens, you can do it.', explanation: '상황에 관계없음을 강조할 때 Whatever를 유용하게 씁니다.' }] },
    { id: 'adv-4', title: '가정법 미래 (Should)', rule: '혹시라도 일어날 희박한 가능성을 가정합니다.', examples: [{ wrong: 'If it will rain tomorrow...', right: 'Should it rain tomorrow...', explanation: '희박한 가능성의 강조 도치 구문입니다.' }] },
    { id: 'adv-5', title: '당위의 Subjunctive', rule: 'insist, suggest 뒤 that절에 (should) 동사원형을 씁니다.', examples: [{ wrong: 'He suggested that she goes home.', right: 'He suggested that she go home.', explanation: '제안/요구의 동사 뒤 that절 동사는 원형을 써야 합니다.' }] },
    { id: 'adv-6', title: '분사구문의 완료형', rule: '주절보다 앞선 시점의 일을 분사구문으로 만들 때 씁니다.', examples: [{ wrong: 'Finishing the work, he left.', right: 'Having finished the work, he left.', explanation: '일을 마친 것이 먼저 일어난 일이므로 Having p.p.를 씁니다.' }] },
    { id: 'adv-7', title: '독립 분사구문', rule: '주절의 주어와 분사구문의 주어가 다를 때 명시합니다.', examples: [{ wrong: 'It being sunny, we went out.', right: 'It being sunny, we went out.', explanation: '날씨를 나타내는 비인칭 주어 It을 생략하지 않고 씁니다.' }] },
    { id: 'adv-8', title: 'It is ~ that 강조구문', rule: '문장의 특정 부분을 강조할 때 사용합니다.', examples: [{ wrong: 'I met him in Paris.', right: 'It was in Paris that I met him.', explanation: '장소인 Paris를 강조하기 위한 강조구문 활용입니다.' }] },
    { id: 'adv-9', title: '조동사 + Have p.p.', rule: '과거 일에 대한 추측이나 후회를 나타냅니다.', examples: [{ wrong: 'He must leave yesterday.', right: 'He must have left yesterday.', explanation: '과거에 떠났음에 틀림없다는 강한 추측은 must have p.p.입니다.' }] },
    { id: 'adv-10', title: 'The 비교급, The 비교급', rule: '~하면 할수록 더 ~하다는 상관관계를 나타냅니다.', examples: [{ wrong: 'More you study, more you know.', right: 'The more you study, the more you know.', explanation: '비교급 앞에 정관사 the를 붙여 상관관계를 표현합니다.' }] },
    { id: 'adv-11', title: 'Mixed Conditionals', rule: '과거의 일이 현재에 영향을 줄 때 시제를 섞어 씁니다.', examples: [{ wrong: 'If I didn\'t miss the train, I am here now.', right: 'If I hadn\'t missed the train, I would be here now.', explanation: '과거 가정과 현재 결과를 결합한 혼합 가정법입니다.' }] },
    { id: 'adv-12', title: 'Not only ~ but also 도치', rule: 'Not only가 문두에 오면 도치가 일어납니다.', examples: [{ wrong: 'Not only he is smart, but also kind.', right: 'Not only is he smart, but also kind.', explanation: '문두 부정어/상관접속사 강조 시 도치가 필수입니다.' }] },
    { id: 'adv-13', title: '형용사/부사 + Enough', rule: '충분히 ~하다를 표현할 때 enough의 위치에 주의합니다.', examples: [{ wrong: 'He is enough old to drive.', right: 'He is old enough to drive.', explanation: 'enough가 형용사를 수식할 때는 뒤에서 수식합니다.' }] },
    { id: 'adv-14', title: 'Lest (~하지 않도록)', rule: '~하지 않기 위해서라는 부정의 목적을 나타냅니다.', examples: [{ wrong: 'Run fast so that you don\'t miss it.', right: 'Run fast lest you (should) miss it.', explanation: '격식 있는 표현으로 lest는 부정어 없이 부정의 의미를 담습니다.' }] },
    { id: 'adv-15', title: 'Passive with Get', rule: '변화나 사건을 강조하는 수동태로 get을 씁니다.', examples: [{ wrong: 'I was married in June.', right: 'I got married in June.', explanation: '동작이나 상태의 변화를 강조할 때는 get p.p.가 자연스럽습니다.' }] },
    { id: 'adv-16', title: 'Had better의 부정', rule: '~하는 게 좋겠다의 부정은 not의 위치가 중요합니다.', examples: [{ wrong: 'You don\'t had better go.', right: 'You had better not go.', explanation: 'had better 자체가 하나의 조동사처럼 쓰여 뒤에 not이 옵니다.' }] },
    { id: 'adv-17', title: 'No sooner ~ than', rule: '~하자마자 바로 ~하다를 나타내는 도치 구문입니다.', examples: [{ wrong: 'No sooner I had left than it rained.', right: 'No sooner had I left than it rained.', explanation: 'No sooner가 문두에 오면 주어-동사 도치가 일어납니다.' }] },
    { id: 'adv-18', title: 'Wish + 과거/과거완료', rule: '실현 불가능한 소망을 나타낼 때 시제를 뒤로 밀어 씁니다.', examples: [{ wrong: 'I wish I am there.', right: 'I wish I were there.', explanation: '현재 이룰 수 없는 소망은 가정법 과거 시제를 씁니다.' }] },
    { id: 'adv-19', title: '전치사 + 관계대명사', rule: '관계대명사절 안의 전치사를 관계대명사 앞으로 보냅니다.', examples: [{ wrong: 'The house which I live in.', right: 'The house in which I live.', explanation: '전치사를 관계대명사 앞에 두어 더 격식 있는 문장을 만듭니다.' }] },
    { id: 'adv-20', title: 'Causative (Have/Get)', rule: '남에게 무언가를 시키거나 당할 때의 구조입니다.', examples: [{ wrong: 'I cut my hair yesterday.', right: 'I had my hair cut yesterday.', explanation: '머리를 직접 자른 게 아니라 미용실에서 잘랐으므로 사역구조를 씁니다.' }] }
  ]
};

// 생략된 데이터는 런타임에 영향을 주지 않도록 빈 배열로 두거나 기존 코드를 재사용하세요.
export const GRAMMAR_POINTS: GrammarPoint[] = [];
export const DAILY_PUSHES: DailyPush[] = [
  { time: '09:00 AM', topic: 'Morning Greeting', description: '남편과 상쾌한 영어 인사를 나눠보세요.', icon: '☀️' },
  { time: '01:00 PM', topic: 'Lunch Talk', description: '점심 메뉴를 영어로 설명해보는 시간!', icon: '🍱' },
  { time: '08:00 PM', topic: 'Daily Review', description: '오늘 배운 문법을 대화로 복습해요.', icon: '🌙' }
];
