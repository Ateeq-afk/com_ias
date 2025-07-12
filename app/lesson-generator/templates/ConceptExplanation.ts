import { BaseTemplate } from './BaseTemplate'
import { 
  GeneratorConfig, 
  SubjectArea, 
  PracticeQuestion, 
  PreviousYearQuestion,
  InteractiveElement 
} from '../types'

export class ConceptExplanationTemplate extends BaseTemplate {
  protected templateName = 'ConceptExplanation'
  protected supportedSubjects: SubjectArea[] = [
    'History', 'Geography', 'Polity', 'Economy', 'Environment',
    'Science & Technology', 'Ethics', 'Art & Culture'
  ]
  
  generateContent(config: GeneratorConfig) {
    const { topic, subject, difficulty } = config
    
    const introduction = `Understanding ${topic} is essential for mastering ${subject} in the UPSC examination. This concept forms the foundation for many advanced topics and frequently appears in both Prelims and Mains.`
    
    const mainExplanation = this.generateDetailedExplanation(topic, subject, difficulty)
    
    const examples = [
      `Historical Context: ${topic} emerged during...`,
      `Practical Application: In modern India, ${topic} is applied in...`,
      `Comparative Perspective: Unlike other countries, India&apos;s approach to ${topic}...`
    ]
    
    const interactiveElements: InteractiveElement[] = [
      {
        type: 'concept-map',
        data: {
          central: topic,
          branches: this.generateConceptBranches(topic),
          connections: this.generateConceptConnections(topic)
        }
      },
      {
        type: 'flashcards',
        data: this.generateFlashcards(topic, 5)
      }
    ]
    
    return {
      introduction,
      mainExplanation,
      examples,
      visualElements: [`Diagram showing the structure of ${topic}`, `Infographic on key aspects`],
      interactiveElements
    }
  }
  
  generatePracticeQuestions(config: GeneratorConfig): PracticeQuestion[] {
    const { topic, difficulty } = config
    const questions: PracticeQuestion[] = []
    
    // Question 1: Definition based
    questions.push({
      id: `q1-${Date.now()}`,
      question: `Which of the following best defines ${topic}?`,
      options: [
        `A comprehensive framework that encompasses all aspects of governance`,
        `The correct definition of ${topic}`,
        `A limited concept applicable only in specific contexts`,
        `An outdated concept no longer relevant in modern times`
      ],
      correctAnswer: 1,
      explanation: `Option B is correct. ${topic} is defined as... This definition is important because it helps distinguish it from related concepts.`,
      difficulty: 'beginner',
      conceptsTested: [topic, 'Basic Definitions'],
      timeToSolve: 30
    })
    
    // Question 2: Feature identification
    questions.push({
      id: `q2-${Date.now()}`,
      question: `Consider the following features:\n1. Feature A\n2. Feature B\n3. Feature C\n\nWhich of these are characteristics of ${topic}?`,
      options: [
        '1 and 2 only',
        '2 and 3 only',
        '1 and 3 only',
        '1, 2 and 3'
      ],
      correctAnswer: 3,
      explanation: `Features 1, 2, and 3 are all essential characteristics of ${topic}. Understanding these features helps in...`,
      difficulty: 'intermediate',
      conceptsTested: [topic, 'Features and Characteristics'],
      timeToSolve: 45
    })
    
    // Add 3 more questions based on difficulty
    if (difficulty === 'intermediate' || difficulty === 'advanced') {
      questions.push(this.generateApplicationQuestion(topic))
    }
    
    if (difficulty === 'advanced') {
      questions.push(this.generateAnalyticalQuestion(topic))
      questions.push(this.generateComparativeQuestion(topic))
    } else {
      questions.push(this.generateFactualQuestion(topic))
      questions.push(this.generateExampleBasedQuestion(topic))
    }
    
    return questions
  }
  
  generatePreviousYearQuestion(config: GeneratorConfig): PreviousYearQuestion {
    const { topic } = config
    return {
      year: 2023,
      question: `"${topic} has been a cornerstone of India&apos;s development strategy." Critically examine this statement in the context of recent policy changes. (250 words)`,
      marks: 15,
      expectedAnswer: `A comprehensive answer should cover:\n1. Definition and importance of ${topic}\n2. Historical evolution\n3. Recent policy changes\n4. Impact assessment\n5. Challenges and way forward`,
      examinerInsight: `The examiner looks for: conceptual clarity, ability to link theory with current developments, balanced critical analysis, and structured presentation.`
    }
  }
  
  generateSummary(config: GeneratorConfig) {
    const { topic } = config
    return {
      keyTakeaways: [
        `${topic} is fundamental to understanding the broader subject`,
        `Key features include: A, B, and C`,
        `Applications are seen in domains X, Y, and Z`,
        `Recent developments have shaped its current form`,
        `UPSC frequently tests both conceptual understanding and application`
      ],
      mnemonics: [
        `Remember the features using: ABCDE framework`,
        `Timeline: Ancient -> Medieval -> Modern -> Contemporary`
      ],
      commonMistakes: [
        `Confusing ${topic} with similar concepts`,
        `Overlooking historical evolution`,
        `Missing contemporary relevance`
      ],
      examTips: [
        `Always define the concept before discussing`,
        `Use examples from current affairs`,
        `Draw diagrams where applicable`,
        `Link to constitutional provisions if relevant`
      ]
    }
  }
  
  // Helper methods
  private generateDetailedExplanation(topic: string, subject: string, difficulty: string): string {
    let explanation = `${topic} can be understood through multiple dimensions:\n\n`
    
    explanation += `1. **Definition and Scope**: ${topic} refers to...\n\n`
    explanation += `2. **Historical Evolution**: The concept evolved through...\n\n`
    explanation += `3. **Key Components**: The main elements include...\n\n`
    explanation += `4. **Theoretical Framework**: Scholars define it as...\n\n`
    
    if (difficulty === 'intermediate' || difficulty === 'advanced') {
      explanation += `5. **Contemporary Relevance**: In today's context...\n\n`
      explanation += `6. **Challenges and Criticisms**: Major issues include...\n\n`
    }
    
    if (difficulty === 'advanced') {
      explanation += `7. **Comparative Analysis**: Globally, different approaches...\n\n`
      explanation += `8. **Future Prospects**: Emerging trends suggest...\n\n`
    }
    
    return explanation
  }
  
  private generateConceptBranches(topic: string): string[] {
    return [
      'Definition',
      'Historical Context',
      'Key Features',
      'Applications',
      'Challenges',
      'Future Trends'
    ]
  }
  
  private generateConceptConnections(topic: string): Array<{from: string, to: string, label: string}> {
    return [
      { from: 'Definition', to: 'Key Features', label: 'defines' },
      { from: 'Historical Context', to: 'Applications', label: 'evolved into' },
      { from: 'Applications', to: 'Challenges', label: 'faces' },
      { from: 'Challenges', to: 'Future Trends', label: 'shapes' }
    ]
  }
  
  private generateFlashcards(topic: string, count: number): Array<{front: string, back: string}> {
    const flashcards = []
    for (let i = 0; i < count; i++) {
      flashcards.push({
        front: `Key aspect ${i + 1} of ${topic}`,
        back: `Detailed explanation of aspect ${i + 1}...`
      })
    }
    return flashcards
  }
  
  private generateApplicationQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-app-${Date.now()}`,
      question: `How is ${topic} applied in the context of India&apos;s governance system?`,
      options: [
        'Through legislative mechanisms only',
        'Through executive actions and judicial review',
        'Through comprehensive institutional framework',
        'Through informal practices and conventions'
      ],
      correctAnswer: 2,
      explanation: `${topic} is applied through a comprehensive institutional framework that includes...`,
      difficulty: 'intermediate',
      conceptsTested: [topic, 'Practical Application'],
      timeToSolve: 60
    }
  }
  
  private generateAnalyticalQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-analytical-${Date.now()}`,
      question: `Analyze the impact of ${topic} on India&apos;s socio-economic development.`,
      options: [
        'Primarily positive with minimal challenges',
        'Mixed impact with both benefits and drawbacks',
        'Largely theoretical with limited practical impact',
        'Negative impact outweighing benefits'
      ],
      correctAnswer: 1,
      explanation: `A nuanced analysis shows that ${topic} has had mixed impact...`,
      difficulty: 'advanced',
      conceptsTested: [topic, 'Critical Analysis'],
      timeToSolve: 90
    }
  }
  
  private generateComparativeQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-comparative-${Date.now()}`,
      question: `Compare India&apos;s approach to ${topic} with that of other democracies.`,
      options: [
        'India follows the exact model of Western democracies',
        'India has developed a unique approach suited to its context',
        'India&apos;s approach is primarily influenced by neighboring countries',
        'There is no significant difference in approaches'
      ],
      correctAnswer: 1,
      explanation: `India has developed a unique approach to ${topic} that reflects...`,
      difficulty: 'advanced',
      conceptsTested: [topic, 'Comparative Politics'],
      timeToSolve: 75
    }
  }
  
  private generateFactualQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-factual-${Date.now()}`,
      question: `When was ${topic} first introduced in India?`,
      options: [
        'During British colonial period',
        'Immediately after independence',
        'During the 1970s reforms',
        'In the post-liberalization era'
      ],
      correctAnswer: 1,
      explanation: `${topic} was introduced immediately after independence as part of...`,
      difficulty: 'beginner',
      conceptsTested: [topic, 'Historical Facts'],
      timeToSolve: 30
    }
  }
  
  private generateExampleBasedQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-example-${Date.now()}`,
      question: `Which of the following is the best example of ${topic} in practice?`,
      options: [
        'Example A from State X',
        'Example B from Central Government',
        'Example C from Judiciary',
        'Example D from Civil Society'
      ],
      correctAnswer: 1,
      explanation: `Example B from Central Government best illustrates ${topic} because...`,
      difficulty: 'beginner',
      conceptsTested: [topic, 'Practical Examples'],
      timeToSolve: 45
    }
  }
}