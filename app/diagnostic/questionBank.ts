export interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'factual' | 'analytical' | 'application';
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  trapQuestion?: boolean;
  teachingMoment?: string;
  averageTime: number; // in seconds
  topicImportance: 'high' | 'medium' | 'low';
}

export const questions: Question[] = [
  // Opening Questions (1-3) - Medium difficulty to calibrate
  {
    id: 'CA001',
    subject: 'Current Affairs',
    topic: 'Government Schemes',
    difficulty: 'medium',
    type: 'factual',
    question: 'The PM-VISHWAKARMA scheme launched in 2023 primarily targets which segment?',
    options: {
      A: 'Agricultural workers',
      B: 'Traditional artisans and craftspeople',
      C: 'IT professionals',
      D: 'Healthcare workers'
    },
    correctAnswer: 'B',
    explanation: 'PM-VISHWAKARMA aims to strengthen traditional artisans and craftspeople by providing skill training, modern tools, and market linkage.',
    averageTime: 45,
    topicImportance: 'high'
  },
  {
    id: 'POL001',
    subject: 'Polity',
    topic: 'Fundamental Rights',
    difficulty: 'medium',
    type: 'analytical',
    question: 'Which Fundamental Right is available to both citizens and non-citizens in India?',
    options: {
      A: 'Right to Freedom of Religion',
      B: 'Right against Discrimination',
      C: 'Right to Life and Personal Liberty',
      D: 'Cultural and Educational Rights'
    },
    correctAnswer: 'C',
    explanation: 'Article 21 (Right to Life and Personal Liberty) is available to all persons, not just citizens. This reflects the universal nature of human dignity.',
    averageTime: 50,
    topicImportance: 'high'
  },
  {
    id: 'HIS001',
    subject: 'History',
    topic: 'Modern India',
    difficulty: 'medium',
    type: 'factual',
    question: 'The Vernacular Press Act of 1878 was repealed by which Viceroy?',
    options: {
      A: 'Lord Lytton',
      B: 'Lord Ripon',
      C: 'Lord Dufferin',
      D: 'Lord Lansdowne'
    },
    correctAnswer: 'B',
    explanation: 'Lord Ripon repealed the Vernacular Press Act in 1882, earning him the title "Father of Local Self-Government" for his liberal policies.',
    averageTime: 40,
    topicImportance: 'medium'
  },

  // Middle Section (4-15) - Mixed difficulties
  {
    id: 'GEO001',
    subject: 'Geography',
    topic: 'Physical Geography',
    difficulty: 'easy',
    type: 'factual',
    question: 'Which of the following is the correct sequence of Himalayan ranges from south to north?',
    options: {
      A: 'Shivalik - Lesser Himalaya - Greater Himalaya',
      B: 'Greater Himalaya - Lesser Himalaya - Shivalik',
      C: 'Lesser Himalaya - Shivalik - Greater Himalaya',
      D: 'Shivalik - Greater Himalaya - Lesser Himalaya'
    },
    correctAnswer: 'A',
    explanation: 'The Himalayan ranges from south to north are: Shivalik (Outer Himalayas), Lesser Himalaya (Middle Himalayas), and Greater Himalaya (Inner Himalayas).',
    averageTime: 35,
    topicImportance: 'high'
  },
  {
    id: 'ECO001',
    subject: 'Economy',
    topic: 'National Income',
    difficulty: 'hard',
    type: 'analytical',
    question: 'If the GDP deflator increases from 100 to 110 while nominal GDP increases by 15%, what is the change in real GDP?',
    options: {
      A: '5% increase',
      B: '4.5% increase',
      C: '10% increase',
      D: '25% increase'
    },
    correctAnswer: 'B',
    explanation: 'Real GDP = (Nominal GDP / GDP Deflator) × 100. With 15% nominal growth and 10% inflation, real growth ≈ 4.5%.',
    trapQuestion: true,
    averageTime: 70,
    topicImportance: 'high'
  },
  {
    id: 'SCI001',
    subject: 'Science & Technology',
    topic: 'Space Technology',
    difficulty: 'medium',
    type: 'application',
    question: 'Chandrayaan-3&apos;s successful soft landing near the lunar south pole is significant because:',
    options: {
      A: 'It&apos;s easier to land there',
      B: 'Presence of water ice in permanently shadowed regions',
      C: 'Better communication with Earth',
      D: 'Lower gravity at poles'
    },
    correctAnswer: 'B',
    explanation: 'The lunar south pole contains permanently shadowed craters with water ice deposits, crucial for future lunar missions and potential colonization.',
    averageTime: 45,
    topicImportance: 'medium'
  },
  {
    id: 'ENV001',
    subject: 'Environment',
    topic: 'Climate Change',
    difficulty: 'medium',
    type: 'analytical',
    question: 'Which of the following best explains the "carbon fertilization effect"?',
    options: {
      A: 'Using carbon-based fertilizers in agriculture',
      B: 'Enhanced plant growth due to increased atmospheric CO2',
      C: 'Carbon sequestration in soil',
      D: 'Reduction in soil carbon due to warming'
    },
    correctAnswer: 'B',
    explanation: 'Higher CO2 levels can enhance photosynthesis in some plants, but this effect is limited by other factors like nutrients and water availability.',
    averageTime: 55,
    topicImportance: 'high'
  },
  {
    id: 'POL002',
    subject: 'Polity',
    topic: 'Parliament',
    difficulty: 'hard',
    type: 'application',
    question: 'A Money Bill returned by Rajya Sabha with amendments:',
    options: {
      A: 'Must be accepted by Lok Sabha',
      B: 'Can be rejected by Lok Sabha entirely',
      C: 'Requires joint sitting if disagreement persists',
      D: 'Becomes void after 14 days'
    },
    correctAnswer: 'B',
    explanation: 'Lok Sabha has overriding powers regarding Money Bills. It may accept or reject Rajya Sabha\'s recommendations, but the bill is deemed passed regardless.',
    trapQuestion: true,
    averageTime: 60,
    topicImportance: 'high'
  },
  {
    id: 'HIS002',
    subject: 'History',
    topic: 'Ancient India',
    difficulty: 'medium',
    type: 'analytical',
    question: 'The decline of the Harappan civilization is NOT attributed to:',
    options: {
      A: 'Aryan invasion',
      B: 'Climate change and drought',
      C: 'Tectonic activities changing river courses',
      D: 'Overexploitation of resources'
    },
    correctAnswer: 'A',
    explanation: 'Modern scholarship has largely discredited the Aryan invasion theory. The decline was likely due to environmental factors and natural causes.',
    averageTime: 50,
    topicImportance: 'medium'
  },
  {
    id: 'GEO002',
    subject: 'Geography',
    topic: 'Economic Geography',
    difficulty: 'hard',
    type: 'application',
    question: 'The concept of "Demographic Dividend" in India is challenged primarily by:',
    options: {
      A: 'Declining birth rate',
      B: 'Skill gap and unemployment',
      C: 'Aging population',
      D: 'Gender imbalance'
    },
    correctAnswer: 'B',
    explanation: 'While India has a young population, the lack of skills and job opportunities prevents realization of the demographic dividend.',
    averageTime: 45,
    topicImportance: 'high'
  },
  {
    id: 'CA002',
    subject: 'Current Affairs',
    topic: 'International Relations',
    difficulty: 'medium',
    type: 'analytical',
    question: 'India&apos;s "Neighbourhood First" policy has evolved to include:',
    options: {
      A: 'Only SAARC nations',
      B: 'Extended neighbourhood including Central Asia and Southeast Asia',
      C: 'Only countries sharing land borders',
      D: 'G20 nations exclusively'
    },
    correctAnswer: 'B',
    explanation: 'The policy now encompasses the extended neighbourhood, reflecting India\'s growing strategic interests beyond immediate borders.',
    averageTime: 40,
    topicImportance: 'high'
  },
  {
    id: 'ECO002',
    subject: 'Economy',
    topic: 'Monetary Policy',
    difficulty: 'easy',
    type: 'factual',
    question: 'The Monetary Policy Committee (MPC) of RBI has how many members?',
    options: {
      A: '4',
      B: '5',
      C: '6',
      D: '7'
    },
    correctAnswer: 'C',
    explanation: 'MPC has 6 members - 3 from RBI (including Governor) and 3 external members appointed by the government.',
    averageTime: 30,
    topicImportance: 'medium'
  },
  {
    id: 'HIS003',
    subject: 'History',
    topic: 'Medieval India',
    difficulty: 'hard',
    type: 'analytical',
    question: 'The Iqta system differed from European feudalism primarily in:',
    options: {
      A: 'Military obligations',
      B: 'Non-hereditary nature of assignments',
      C: 'Tax collection methods',
      D: 'Administrative structure'
    },
    correctAnswer: 'B',
    explanation: 'Unlike European feudalism, Iqtas were non-hereditary and transferable, preventing the development of a landed aristocracy.',
    trapQuestion: true,
    averageTime: 65,
    topicImportance: 'medium'
  },
  {
    id: 'ENV002',
    subject: 'Environment',
    topic: 'Biodiversity',
    difficulty: 'medium',
    type: 'application',
    question: 'The "Living Planet Index" by WWF measures:',
    options: {
      A: 'Number of species on Earth',
      B: 'Trends in vertebrate population abundance',
      C: 'Forest cover globally',
      D: 'Ocean health indicators'
    },
    correctAnswer: 'B',
    explanation: 'The LPI tracks population trends of vertebrate species to assess the health of global biodiversity.',
    averageTime: 50,
    topicImportance: 'medium'
  },
  {
    id: 'SCI002',
    subject: 'Science & Technology',
    topic: 'Biotechnology',
    difficulty: 'easy',
    type: 'factual',
    question: 'CRISPR-Cas9 technology is primarily used for:',
    options: {
      A: 'Protein synthesis',
      B: 'Gene editing',
      C: 'Cell division',
      D: 'DNA replication'
    },
    correctAnswer: 'B',
    explanation: 'CRISPR-Cas9 is a revolutionary gene-editing tool that allows precise modification of DNA sequences.',
    averageTime: 35,
    topicImportance: 'high'
  },

  // Closing Questions (16-20) - Showcase teaching style
  {
    id: 'POL003',
    subject: 'Polity',
    topic: 'Constitutional Bodies',
    difficulty: 'medium',
    type: 'application',
    question: 'Which statement about the Election Commission is INCORRECT?',
    options: {
      A: 'Chief Election Commissioner can only be removed like a Supreme Court Judge',
      B: 'Other Election Commissioners have the same removal process as CEC',
      C: 'President appoints all Election Commissioners',
      D: 'Election Commission is a multi-member body since 1993'
    },
    correctAnswer: 'B',
    explanation: 'Other Election Commissioners can be removed on the recommendation of the CEC, making their position less secure than the CEC&apos;s.',
    teachingMoment: 'This asymmetry in removal procedures ensures CEC&apos;s independence while maintaining hierarchical authority.',
    averageTime: 55,
    topicImportance: 'high'
  },
  {
    id: 'GEO003',
    subject: 'Geography',
    topic: 'Human Geography',
    difficulty: 'medium',
    type: 'analytical',
    question: 'The concept of "Quaternary Sector" in economics refers to:',
    options: {
      A: 'Traditional services',
      B: 'Knowledge-based services',
      C: 'Manufacturing industries',
      D: 'Agricultural activities'
    },
    correctAnswer: 'B',
    explanation: 'Quaternary sector involves knowledge-based services like R&D, IT, consultancy - crucial for India&apos;s service-led growth.',
    teachingMoment: 'India&apos;s IT sector exemplifies quaternary activities, contributing significantly to exports and employment.',
    averageTime: 45,
    topicImportance: 'medium'
  },
  {
    id: 'CA003',
    subject: 'Current Affairs',
    topic: 'Economy',
    difficulty: 'hard',
    type: 'analytical',
    question: 'The "Impossible Trinity" in economics suggests that a country cannot simultaneously have:',
    options: {
      A: 'High growth, low inflation, and full employment',
      B: 'Fixed exchange rate, independent monetary policy, and free capital flow',
      C: 'Trade surplus, budget surplus, and high savings',
      D: 'Strong currency, export competitiveness, and import substitution'
    },
    correctAnswer: 'B',
    explanation: 'The Mundell-Fleming trilemma states these three policies are mutually incompatible - a key concept for understanding RBI&apos;s policy choices.',
    teachingMoment: 'India chose independent monetary policy and free capital flows, allowing the rupee to float - understanding why helps grasp our economic policy framework.',
    averageTime: 70,
    topicImportance: 'high'
  },
  {
    id: 'ECO003',
    subject: 'Economy',
    topic: 'Development Economics',
    difficulty: 'medium',
    type: 'application',
    question: 'The "Middle Income Trap" refers to:',
    options: {
      A: 'Stagnation when per capita income reaches middle-income level',
      B: 'Income inequality in middle-class',
      C: 'Tax burden on middle-income groups',
      D: 'Savings pattern of middle-income countries'
    },
    correctAnswer: 'A',
    explanation: 'Countries struggle to transition from middle to high income due to loss of competitive edge in exports and inability to compete with advanced economies.',
    teachingMoment: 'India must focus on innovation and skill development to avoid this trap - a crucial policy challenge for the next decade.',
    averageTime: 50,
    topicImportance: 'high'
  },
  {
    id: 'HIS004',
    subject: 'History',
    topic: 'Freedom Movement',
    difficulty: 'medium',
    type: 'analytical',
    question: 'The significance of the Karachi Session (1931) of Congress lies in:',
    options: {
      A: 'Adoption of Purna Swaraj resolution',
      B: 'Resolution on Fundamental Rights and Economic Policy',
      C: 'Decision to launch Quit India Movement',
      D: 'Acceptance of Gandhi-Irwin Pact'
    },
    correctAnswer: 'B',
    explanation: 'The Karachi Session adopted resolutions on Fundamental Rights and Economic Policy, laying the foundation for India&apos;s constitutional vision.',
    teachingMoment: 'These resolutions influenced our Constitution&apos;s Fundamental Rights and Directive Principles - showing how freedom struggle shaped modern India.',
    averageTime: 45,
    topicImportance: 'high'
  }
];