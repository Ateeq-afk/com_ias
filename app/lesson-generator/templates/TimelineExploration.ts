import { BaseTemplate } from './BaseTemplate'
import { 
  GeneratorConfig, 
  SubjectArea, 
  PracticeQuestion, 
  PreviousYearQuestion,
  InteractiveElement 
} from '../types'

interface TimelineEvent {
  year: string
  event: string
  significance: string
  context?: string
}

export class TimelineExplorationTemplate extends BaseTemplate {
  protected templateName = 'TimelineExploration'
  protected supportedSubjects: SubjectArea[] = [
    'History', 'Polity', 'Economy', 'Art & Culture', 'International Relations'
  ]
  
  generateContent(config: GeneratorConfig) {
    const { topic, subject, difficulty } = config
    const timeline = this.generateTimeline(topic, subject, difficulty)
    
    const introduction = `This timeline exploration of ${topic} traces the evolution and key milestones that shaped its current form. Understanding the chronological development is essential for UPSC as it helps establish cause-effect relationships and contextual understanding.`
    
    const mainExplanation = this.generateChronologicalNarrative(timeline, topic, subject, difficulty)
    
    const examples = [
      `Turning Point: The event of ${timeline[Math.floor(timeline.length/2)].year} marked a crucial shift...`,
      `Pattern Recognition: Notice how events in ${timeline[0].year} to ${timeline[timeline.length-1].year} show...`,
      `Contemporary Impact: Recent developments continue the trajectory established in...`
    ]
    
    const interactiveElements: InteractiveElement[] = [
      {
        type: 'interactive-timeline',
        data: {
          events: timeline,
          categories: this.categorizeEvents(timeline),
          filters: ['Political', 'Economic', 'Social', 'Cultural']
        }
      },
      {
        type: 'period-comparison',
        data: {
          periods: this.definePeriods(timeline),
          comparisons: this.generatePeriodComparisons(timeline)
        }
      },
      {
        type: 'cause-effect-chain',
        data: {
          chains: this.identifyCauseEffectChains(timeline)
        }
      }
    ]
    
    return {
      introduction,
      mainExplanation,
      examples,
      visualElements: [
        `Comprehensive timeline infographic`,
        `Period-wise thematic map`,
        `Cause-effect flowchart`
      ],
      interactiveElements
    }
  }
  
  generatePracticeQuestions(config: GeneratorConfig): PracticeQuestion[] {
    const { topic, difficulty } = config
    const questions: PracticeQuestion[] = []
    
    // Question 1: Chronological ordering
    questions.push({
      id: `q1-timeline-${Date.now()}`,
      question: `Arrange the following events related to ${topic} in chronological order:\n1. Event A\n2. Event B\n3. Event C\n4. Event D`,
      options: [
        '1-2-3-4',
        '2-1-4-3',
        '3-2-1-4',
        '4-3-2-1'
      ],
      correctAnswer: 1,
      explanation: `The correct chronological order is 2-1-4-3. Event B (Year X) preceded Event A (Year Y)...`,
      difficulty: 'beginner',
      conceptsTested: [topic, 'Chronology'],
      timeToSolve: 60
    })
    
    // Question 2: Cause and effect
    questions.push({
      id: `q2-timeline-${Date.now()}`,
      question: `Which event was the direct consequence of the ${topic} development in 1857?`,
      options: [
        'Immediate administrative reforms',
        'Economic policy changes after a decade',
        'Social movements in the following years',
        'International recognition much later'
      ],
      correctAnswer: 0,
      explanation: `The 1857 event led to immediate administrative reforms because...`,
      difficulty: 'intermediate',
      conceptsTested: [topic, 'Cause-Effect Analysis'],
      timeToSolve: 75
    })
    
    // Question 3: Period analysis
    questions.push({
      id: `q3-timeline-${Date.now()}`,
      question: `Which period saw the most significant transformation in ${topic}?`,
      options: [
        '1850-1900: Foundation period',
        '1900-1947: Colonial evolution',
        '1947-1991: Post-independence consolidation',
        '1991-present: Modern reforms'
      ],
      correctAnswer: 2,
      explanation: `The post-independence period witnessed the most significant transformation due to...`,
      difficulty: 'intermediate',
      conceptsTested: [topic, 'Period Analysis'],
      timeToSolve: 80
    })
    
    if (difficulty === 'advanced') {
      questions.push(this.generateTurningPointQuestion(topic))
      questions.push(this.generateComparativeTimelineQuestion(topic))
    } else {
      questions.push(this.generateMilestoneQuestion(topic))
      questions.push(this.generateImpactQuestion(topic))
    }
    
    return questions
  }
  
  generatePreviousYearQuestion(config: GeneratorConfig): PreviousYearQuestion {
    const { topic } = config
    return {
      year: 2021,
      question: `Trace the evolution of ${topic} from independence to the present day. How have the changing socio-political contexts influenced its trajectory? (250 words)`,
      marks: 15,
      expectedAnswer: `Key points to cover:\n1. Initial phase (1947-1960s): Foundation and challenges\n2. Middle phase (1970s-1990): Consolidation and reforms\n3. Contemporary phase (2000-present): Modernization\n4. Socio-political influences at each stage\n5. Current status and future trajectory`,
      examinerInsight: `Examiners look for: Clear periodization, understanding of context, ability to identify key turning points, linking events to broader themes, and analytical rather than purely descriptive approach.`
    }
  }
  
  generateSummary(config: GeneratorConfig) {
    const { topic } = config
    return {
      keyTakeaways: [
        `${topic} evolved through distinct phases, each shaped by contemporary contexts`,
        `Key turning points: 1857, 1947, 1991 marked paradigm shifts`,
        `Continuities are as important as changes in understanding evolution`,
        `External factors played crucial role in shaping trajectory`,
        `Current form reflects cumulative impact of historical development`
      ],
      mnemonics: [
        `Remember key dates: FREE (Foundation, Reform, Evolution, Expansion)`,
        `Phases: CAMP (Colonial, Awakening, Modern, Post-modern)`
      ],
      commonMistakes: [
        `Focusing only on political events, ignoring social-economic aspects`,
        `Missing the continuities while emphasizing changes`,
        `Incorrect chronological ordering of events`,
        `Overlooking regional variations in timeline`
      ],
      examTips: [
        `Always start with a brief timeline overview`,
        `Identify 3-4 major turning points`,
        `Link events to broader historical themes`,
        `Use specific dates and avoid vague timeframes`
      ]
    }
  }
  
  // Helper methods
  private generateTimeline(topic: string, subject: string, difficulty: string): TimelineEvent[] {
    const baseEvents: TimelineEvent[] = [
      {
        year: '1857',
        event: `First major development in ${topic}`,
        significance: 'Marked the beginning of organized approach',
        context: 'Colonial response to emerging challenges'
      },
      {
        year: '1885',
        event: `Institutional framework for ${topic}`,
        significance: 'Formalization of structures',
        context: 'Growing political consciousness'
      },
      {
        year: '1919',
        event: `Reforms affecting ${topic}`,
        significance: 'Partial concessions and limited progress',
        context: 'Post-WWI political changes'
      },
      {
        year: '1935',
        event: `Major legislation on ${topic}`,
        significance: 'Comprehensive framework established',
        context: 'Provincial autonomy era'
      },
      {
        year: '1947',
        event: `Independence and ${topic}`,
        significance: 'Fundamental restructuring',
        context: 'Nation-building priorities'
      },
      {
        year: '1950',
        event: `Constitutional provisions for ${topic}`,
        significance: 'Legal foundation established',
        context: 'Democratic framework'
      }
    ]
    
    if (difficulty === 'intermediate' || difficulty === 'advanced') {
      baseEvents.push(
        {
          year: '1967',
          event: `First major challenge to ${topic}`,
          significance: 'Testing of established systems',
          context: 'Political realignment'
        },
        {
          year: '1975-77',
          event: `Emergency and ${topic}`,
          significance: 'Stress test of institutions',
          context: 'Constitutional crisis'
        },
        {
          year: '1991',
          event: `Liberalization impact on ${topic}`,
          significance: 'Paradigm shift in approach',
          context: 'Economic reforms'
        }
      )
    }
    
    if (difficulty === 'advanced') {
      baseEvents.push(
        {
          year: '2000',
          event: `Technological transformation of ${topic}`,
          significance: 'Digital age implications',
          context: 'IT revolution'
        },
        {
          year: '2014',
          event: `New governance model for ${topic}`,
          significance: 'Centralization vs federalism debate',
          context: 'Political shift'
        },
        {
          year: '2020',
          event: `Pandemic and ${topic}`,
          significance: 'Resilience and adaptation',
          context: 'Global crisis response'
        }
      )
    }
    
    return baseEvents
  }
  
  private generateChronologicalNarrative(timeline: TimelineEvent[], topic: string, subject: string, difficulty: string): string {
    let narrative = `## Historical Evolution of ${topic}\n\n`
    
    narrative += `### Pre-Independence Era (Pre-1947)\n`
    narrative += `The foundations of ${topic} were laid during the colonial period...\n\n`
    
    narrative += `### Early Independence (1947-1960s)\n`
    narrative += `Post-independence, the focus shifted to nation-building...\n\n`
    
    narrative += `### Consolidation Phase (1970s-1980s)\n`
    narrative += `This period witnessed strengthening of institutions...\n\n`
    
    if (difficulty === 'intermediate' || difficulty === 'advanced') {
      narrative += `### Reform Era (1990s-2000s)\n`
      narrative += `Liberalization brought fundamental changes...\n\n`
    }
    
    if (difficulty === 'advanced') {
      narrative += `### Contemporary Developments (2010s-Present)\n`
      narrative += `Current phase characterized by technology and governance reforms...\n\n`
      
      narrative += `### Analytical Perspectives\n`
      narrative += `Scholars identify several patterns in this evolution...\n\n`
    }
    
    return narrative
  }
  
  private categorizeEvents(timeline: TimelineEvent[]): Record<string, TimelineEvent[]> {
    return {
      Political: timeline.filter(e => e.context?.includes('political') || e.context?.includes('governance')),
      Economic: timeline.filter(e => e.context?.includes('economic') || e.context?.includes('reforms')),
      Social: timeline.filter(e => e.context?.includes('social') || e.context?.includes('consciousness')),
      Constitutional: timeline.filter(e => e.context?.includes('Constitutional') || e.event.includes('legislation'))
    }
  }
  
  private definePeriods(timeline: TimelineEvent[]): Array<{name: string, start: string, end: string, characteristics: string[]}> {
    return [
      {
        name: 'Colonial Foundations',
        start: '1857',
        end: '1947',
        characteristics: ['Limited representation', 'Gradual reforms', 'Growing consciousness']
      },
      {
        name: 'Nation Building',
        start: '1947',
        end: '1970',
        characteristics: ['Constitutional framework', 'Institution creation', 'Democratic consolidation']
      },
      {
        name: 'Maturation Phase',
        start: '1970',
        end: '1991',
        characteristics: ['System testing', 'Regional assertions', 'Political diversification']
      },
      {
        name: 'Reform Era',
        start: '1991',
        end: 'Present',
        characteristics: ['Economic liberalization', 'Technological adoption', 'Global integration']
      }
    ]
  }
  
  private generatePeriodComparisons(timeline: TimelineEvent[]): Array<{aspect: string, periods: Record<string, string>}> {
    return [
      {
        aspect: 'Dominant Theme',
        periods: {
          'Colonial': 'Limited representation',
          'Post-Independence': 'Nation building',
          'Modern': 'Efficiency and technology'
        }
      },
      {
        aspect: 'Key Challenges',
        periods: {
          'Colonial': 'Lack of autonomy',
          'Post-Independence': 'Resource constraints',
          'Modern': 'Governance complexity'
        }
      }
    ]
  }
  
  private identifyCauseEffectChains(timeline: TimelineEvent[]): Array<{cause: string, effect: string, explanation: string}> {
    return [
      {
        cause: '1857 Uprising',
        effect: '1858 Government of India Act',
        explanation: 'Direct British Crown rule established'
      },
      {
        cause: '1919 Jallianwala Bagh',
        effect: '1919 Government of India Act',
        explanation: 'Reforms to address growing discontent'
      },
      {
        cause: '1975 Emergency',
        effect: '1978 Constitutional Amendments',
        explanation: 'Safeguards against authoritarian tendencies'
      }
    ]
  }
  
  private generateTurningPointQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-turning-${Date.now()}`,
      question: `Which event marked the most significant turning point in the evolution of ${topic} and why?`,
      options: [
        'Independence in 1947 - Complete paradigm shift',
        'Emergency 1975-77 - Institutional stress test',
        'Liberalization 1991 - Economic transformation',
        'Digital India 2015 - Technological revolution'
      ],
      correctAnswer: 0,
      explanation: `Independence marked the most significant turning point as it fundamentally altered...`,
      difficulty: 'advanced',
      conceptsTested: [topic, 'Critical Turning Points'],
      timeToSolve: 90
    }
  }
  
  private generateComparativeTimelineQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-comparative-${Date.now()}`,
      question: `How did the evolution of ${topic} in India differ from similar developments in other post-colonial nations?`,
      options: [
        'India followed a completely unique trajectory',
        'Similar pattern but different pace of evolution',
        'Identical to other Commonwealth nations',
        'Opposite direction compared to others'
      ],
      correctAnswer: 1,
      explanation: `While the broad pattern was similar to other post-colonial nations, India's pace...`,
      difficulty: 'advanced',
      conceptsTested: [topic, 'Comparative Evolution'],
      timeToSolve: 85
    }
  }
  
  private generateMilestoneQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-milestone-${Date.now()}`,
      question: `Which year marked the formal establishment of ${topic} in independent India?`,
      options: [
        '1947 - With independence',
        '1950 - With Constitution',
        '1952 - First elections',
        '1956 - States reorganization'
      ],
      correctAnswer: 1,
      explanation: `The Constitution in 1950 formally established ${topic} with detailed provisions...`,
      difficulty: 'beginner',
      conceptsTested: [topic, 'Key Milestones'],
      timeToSolve: 45
    }
  }
  
  private generateImpactQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-impact-${Date.now()}`,
      question: `What was the immediate impact of the 1991 reforms on ${topic}?`,
      options: [
        'Complete overhaul of existing systems',
        'Gradual adaptation to new economic reality',
        'No significant change initially',
        'Reversal of previous policies'
      ],
      correctAnswer: 1,
      explanation: `The 1991 reforms led to gradual adaptation as ${topic} had to align with...`,
      difficulty: 'intermediate',
      conceptsTested: [topic, '1991 Reforms Impact'],
      timeToSolve: 60
    }
  }
}