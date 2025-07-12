import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel
} from '../types'

export class OddOneOutGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['OddOneOut']
  protected generatorName = 'OddOneOutGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createOddOneOut(baseFact, difficulty)
      questions.push(mainQuestion)
      
      // Generate variations if requested
      if (includeVariations) {
        const variations = await this.createVariations(baseFact, difficulty)
        questions.push(...variations)
      }
    }
    
    return questions
  }
  
  private async createOddOneOut(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const { questionText, options, oddOneIndex, category } = this.generateOddOneOutData(baseFact, difficulty)
    const explanation = this.generateDetailedExplanation(baseFact, options, oddOneIndex, category)
    
    return {
      id: this.generateQuestionId(),
      type: 'OddOneOut',
      questionText,
      data: {
        oddOneOut: { options, oddOneIndex, category }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'OddOneOut'),
      marks: this.determineMarks(difficulty, 'OddOneOut'),
      conceptsTested: [baseFact.content, ...baseFact.concepts],
      explanation,
      metadata: {
        created: new Date().toISOString(),
        qualityScore: 0,
        pyqSimilarity: 0,
        highYieldTopic: baseFact.importance === 'high',
        difficultyValidated: false,
        factuallyAccurate: true
      },
      tags: this.generateTags(baseFact, 'OddOneOut', difficulty)
    }
  }
  
  private generateOddOneOutData(baseFact: BaseFact, difficulty: DifficultyLevel): {
    questionText: string,
    options: string[],
    oddOneIndex: number,
    category: string
  } {
    const oddOneOutSets = this.getOddOneOutSets(baseFact, difficulty)
    const selectedSet = oddOneOutSets[Math.floor(Math.random() * oddOneOutSets.length)]
    
    return {
      questionText: this.generateQuestionText(selectedSet.category),
      options: selectedSet.options,
      oddOneIndex: selectedSet.oddOneIndex,
      category: selectedSet.category
    }
  }
  
  private generateQuestionText(category: string): string {
    const patterns = [
      `Which of the following is the odd one out in terms of ${category}?`,
      `Identify the option that does not belong to the same ${category} as others:`,
      `Find the exception among the following based on ${category}:`,
      `Which one is different from the others in ${category}?`
    ]
    
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private getOddOneOutSets(baseFact: BaseFact, difficulty: DifficultyLevel): Array<{
    options: string[],
    oddOneIndex: number,
    category: string
  }> {
    switch (difficulty) {
      case 'easy':
        return this.generateEasyOddOneOut(baseFact)
      case 'medium':
        return this.generateMediumOddOneOut(baseFact)
      case 'hard':
        return this.generateHardOddOneOut(baseFact)
      default:
        return this.generateEasyOddOneOut(baseFact)
    }
  }
  
  private generateEasyOddOneOut(baseFact: BaseFact): Array<{
    options: string[],
    oddOneIndex: number,
    category: string
  }> {
    return [
      {
        options: [
          'Article 14 - Right to Equality',
          'Article 19 - Right to Freedom', 
          'Article 21 - Right to Life',
          'Article 39 - Directive Principles'
        ],
        oddOneIndex: 3,
        category: 'constitutional classification'
      },
      {
        options: [
          'Fundamental Rights',
          'Directive Principles',
          'Fundamental Duties',
          'Parliamentary Procedures'
        ],
        oddOneIndex: 3,
        category: 'constitutional parts'
      },
      {
        options: [
          'President',
          'Prime Minister',
          'Chief Justice',
          'Governor'
        ],
        oddOneIndex: 2,
        category: 'executive positions'
      }
    ]
  }
  
  private generateMediumOddOneOut(baseFact: BaseFact): Array<{
    options: string[],
    oddOneIndex: number,
    category: string
  }> {
    return [
      {
        options: [
          'Habeas Corpus',
          'Mandamus',
          'Certiorari', 
          'Judicial Review'
        ],
        oddOneIndex: 3,
        category: 'writs'
      },
      {
        options: [
          '42nd Amendment - Mini Constitution',
          '44th Amendment - Emergency Provisions',
          '73rd Amendment - Panchayati Raj',
          '86th Amendment - Right to Education'
        ],
        oddOneIndex: 1,
        category: 'major constitutional amendments'
      },
      {
        options: [
          'Parliamentary Sovereignty',
          'Judicial Independence',
          'Federal Structure',
          'Rule of Law'
        ],
        oddOneIndex: 0,
        category: 'Indian constitutional features'
      }
    ]
  }
  
  private generateHardOddOneOut(baseFact: BaseFact): Array<{
    options: string[],
    oddOneIndex: number,
    category: string
  }> {
    return [
      {
        options: [
          'Kesavananda Bharati Case - Basic Structure',
          'Maneka Gandhi Case - Procedure Established by Law',
          'Minerva Mills Case - Balance Theory',
          'Shah Bano Case - Personal Laws'
        ],
        oddOneIndex: 3,
        category: 'constitutional interpretation cases'
      },
      {
        options: [
          'Separation of Powers (Montesquieu)',
          'Judicial Review (Marbury vs Madison)',
          'Parliamentary System (Westminster)',
          'Directive Principles (Irish Constitution)'
        ],
        oddOneIndex: 1,
        category: 'borrowed constitutional features'
      },
      {
        options: [
          'Living Constitution Doctrine',
          'Constitutionalism Principle',
          'Constitutional Morality',
          'Administrative Law'
        ],
        oddOneIndex: 3,
        category: 'constitutional philosophy concepts'
      }
    ]
  }
  
  private generateDetailedExplanation(baseFact: BaseFact, options: string[], oddOneIndex: number, category: string) {
    const oddOption = options[oddOneIndex]
    const similarOptions = options.filter((_, index) => index !== oddOneIndex)
    
    const explanationMap = {
      'constitutional classification': 'This classification is based on the constitutional parts and their enforceability.',
      'constitutional parts': 'This categorization follows the structural organization of the Constitution.',
      'executive positions': 'This grouping is based on the nature of executive authority and appointment.',
      'writs': 'This classification is based on types of constitutional remedies.',
      'major constitutional amendments': 'This grouping is based on the significance and scope of amendments.',
      'Indian constitutional features': 'This categorization is based on features actually adopted in Indian Constitution.',
      'constitutional interpretation cases': 'This classification is based on landmark cases that shaped constitutional law.',
      'borrowed constitutional features': 'This grouping is based on features borrowed from other constitutions.',
      'constitutional philosophy concepts': 'This categorization is based on fundamental constitutional principles.'
    }
    
    return {
      correctAnswer: `${oddOption} is the odd one out`,
      whyCorrect: `${oddOption} belongs to a different ${category} compared to the other options. ${explanationMap[category] || 'This represents a different category.'}`,
      whyOthersWrong: [
        `The other options (${similarOptions.join(', ')}) belong to the same ${category}.`,
        'These options share common constitutional characteristics.'
      ],
      conceptClarity: `Understanding ${category} helps in systematic study of constitutional provisions and their relationships.`,
      memoryTrick: this.generateCategoryMemoryTrick(category),
      commonMistakes: [
        'Confusing similar constitutional concepts',
        'Not understanding constitutional classifications',
        'Missing subtle but important distinctions'
      ],
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private generateCategoryMemoryTrick(category: string): string {
    const tricks = {
      'constitutional classification': 'Remember: FR = Justiciable, DP = Non-justiciable, FD = Moral obligation',
      'constitutional parts': 'Use Constitution structure: I-Union, II-Citizenship, III-FR, IV-DP',
      'executive positions': 'Think of appointment: President-elected, PM-appointed, CJ-appointed, Governor-appointed',
      'writs': 'Remember: 5 writs - Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-warranto',
      'major constitutional amendments': 'Major amendments change structure: 42nd-Mini, 73rd-Panchayat, 74th-Municipality',
      'Indian constitutional features': 'Remember what India adopted vs what it rejected from other systems',
      'constitutional interpretation cases': 'Landmark cases create new doctrines: Basic Structure, Procedure, Balance',
      'borrowed constitutional features': 'Remember sources: UK-Parliamentary, US-Judicial Review, Ireland-DP',
      'constitutional philosophy concepts': 'Group by philosophical vs practical concepts'
    }
    
    return tricks[category] || 'Group items by their essential characteristics and find the exception'
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Create subject-based odd one out
    const subjectVariation = await this.createOddOneOut(baseFact, difficulty)
    subjectVariation.id = this.generateQuestionId()
    
    // Create a subject-focused odd one out
    if (subjectVariation.data.oddOneOut) {
      subjectVariation.data.oddOneOut = {
        options: [
          'Constitutional Law',
          'Administrative Law', 
          'Criminal Law',
          'International Law'
        ],
        oddOneIndex: 2,
        category: 'public law branches'
      }
      subjectVariation.questionText = 'Which of the following is the odd one out in terms of public law branches?'
    }
    
    variations.push(subjectVariation)
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'OddOneOut') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.oddOneOut
    if (!data) {
      issues.push('Missing odd one out data')
      return
    }
    
    if (!data.options || data.options.length !== 4) {
      issues.push('Odd one out must have exactly 4 options')
      suggestions.push('Provide exactly 4 options for comparison')
    }
    
    if (data.oddOneIndex < 0 || data.oddOneIndex >= data.options.length) {
      issues.push('Odd one index is out of range')
      suggestions.push('Ensure odd one index is between 0 and 3')
    }
    
    if (!data.category) {
      issues.push('Missing category for comparison')
      suggestions.push('Specify the category/criterion for identifying the odd one out')
    }
    
    // Check option quality
    data.options.forEach((option, index) => {
      if (!option || option.length < 3) {
        issues.push(`Option ${index + 1} is too short`)
      }
    })
    
    // Check for distinctiveness
    const uniqueOptions = new Set(data.options)
    if (uniqueOptions.size !== data.options.length) {
      issues.push('Options must be unique')
      suggestions.push('Ensure all options are different')
    }
    
    // Validate category types
    const validCategories = [
      'constitutional classification', 'constitutional parts', 'executive positions',
      'writs', 'major constitutional amendments', 'Indian constitutional features',
      'constitutional interpretation cases', 'borrowed constitutional features',
      'constitutional philosophy concepts', 'public law branches'
    ]
    
    if (!validCategories.includes(data.category)) {
      issues.push('Use standard categorization for better clarity')
      suggestions.push('Consider using established constitutional categories')
    }
  }
}