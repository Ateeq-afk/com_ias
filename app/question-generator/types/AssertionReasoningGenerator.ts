import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel
} from '../types'

export class AssertionReasoningGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['AssertionReasoning']
  protected generatorName = 'AssertionReasoningGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createAssertionReasoning(baseFact, difficulty)
      questions.push(mainQuestion)
      
      // Generate variations if requested
      if (includeVariations) {
        const variations = await this.createVariations(baseFact, difficulty)
        questions.push(...variations)
      }
    }
    
    return questions
  }
  
  private async createAssertionReasoning(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const questionText = this.generateQuestionText()
    const { assertion, reason, correctRelation } = this.generateAssertionReason(baseFact, difficulty)
    const explanation = this.generateDetailedExplanation(baseFact, assertion, reason, correctRelation)
    
    return {
      id: this.generateQuestionId(),
      type: 'AssertionReasoning',
      questionText,
      data: {
        assertionReasoning: { assertion, reason, correctRelation }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'AssertionReasoning'),
      marks: this.determineMarks(difficulty, 'AssertionReasoning'),
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
      tags: this.generateTags(baseFact, 'AssertionReasoning', difficulty)
    }
  }
  
  private generateQuestionText(): string {
    return `Consider the following Assertion (A) and Reason (R):

Choose the correct option:
(a) Both A and R are true and R is the correct explanation of A
(b) Both A and R are true but R is not the correct explanation of A  
(c) A is true but R is false
(d) A is false but R is true
(e) Both A and R are false`
  }
  
  private generateAssertionReason(baseFact: BaseFact, difficulty: DifficultyLevel): {
    assertion: string,
    reason: string,
    correctRelation: 'both-true-reason-correct' | 'both-true-reason-incorrect' | 'assertion-true-reason-false' | 'assertion-false-reason-true' | 'both-false'
  } {
    switch (difficulty) {
      case 'easy':
        return this.generateEasyAssertionReason(baseFact)
      case 'medium':
        return this.generateMediumAssertionReason(baseFact)
      case 'hard':
        return this.generateHardAssertionReason(baseFact)
      default:
        return this.generateEasyAssertionReason(baseFact)
    }
  }
  
  private generateEasyAssertionReason(baseFact: BaseFact): {
    assertion: string,
    reason: string,
    correctRelation: 'both-true-reason-correct' | 'both-true-reason-incorrect' | 'assertion-true-reason-false' | 'assertion-false-reason-true' | 'both-false'
  } {
    const scenarios = [
      {
        assertion: `${baseFact.source} provides for ${baseFact.content}`,
        reason: `The Constitution establishes ${baseFact.content} as a fundamental provision`,
        correctRelation: 'both-true-reason-correct' as const
      },
      {
        assertion: `${baseFact.content} is guaranteed under ${baseFact.source}`,
        reason: `${baseFact.source} specifically mentions ${baseFact.content}`,
        correctRelation: 'both-true-reason-correct' as const
      }
    ]
    
    return scenarios[Math.floor(Math.random() * scenarios.length)]
  }
  
  private generateMediumAssertionReason(baseFact: BaseFact): {
    assertion: string,
    reason: string,
    correctRelation: 'both-true-reason-correct' | 'both-true-reason-incorrect' | 'assertion-true-reason-false' | 'assertion-false-reason-true' | 'both-false'
  } {
    const scenarios = [
      {
        assertion: `${baseFact.content} can be subject to reasonable restrictions`,
        reason: `Constitutional provisions must balance individual rights with public interest`,
        correctRelation: 'both-true-reason-correct' as const
      },
      {
        assertion: `${baseFact.content} has evolved through judicial interpretation`,
        reason: `The Supreme Court has the power of judicial review`,
        correctRelation: 'both-true-reason-incorrect' as const
      },
      {
        assertion: `${baseFact.source} establishes ${baseFact.content}`,
        reason: `All constitutional articles are directly enforceable`,
        correctRelation: 'assertion-true-reason-false' as const
      }
    ]
    
    return scenarios[Math.floor(Math.random() * scenarios.length)]
  }
  
  private generateHardAssertionReason(baseFact: BaseFact): {
    assertion: string,
    reason: string,
    correctRelation: 'both-true-reason-correct' | 'both-true-reason-incorrect' | 'assertion-true-reason-false' | 'assertion-false-reason-true' | 'both-false'
  } {
    const scenarios = [
      {
        assertion: `${baseFact.content} reflects the constitutional philosophy of social justice`,
        reason: `The Constitution aims to establish a welfare state through various provisions`,
        correctRelation: 'both-true-reason-correct' as const
      },
      {
        assertion: `Contemporary interpretation of ${baseFact.content} must consider technological advancement`,
        reason: `Constitutional provisions are static and cannot adapt to changing circumstances`,
        correctRelation: 'assertion-true-reason-false' as const
      },
      {
        assertion: `${baseFact.content} can never be amended`,
        reason: `Some constitutional provisions form part of the basic structure`,
        correctRelation: 'assertion-false-reason-true' as const
      }
    ]
    
    return scenarios[Math.floor(Math.random() * scenarios.length)]
  }
  
  private generateDetailedExplanation(
    baseFact: BaseFact, 
    assertion: string, 
    reason: string, 
    correctRelation: string
  ) {
    const explanationMap = {
      'both-true-reason-correct': 'Both the assertion and reason are true, and the reason correctly explains the assertion.',
      'both-true-reason-incorrect': 'Both the assertion and reason are true, but the reason does not correctly explain the assertion.',
      'assertion-true-reason-false': 'The assertion is true but the reason is false.',
      'assertion-false-reason-true': 'The assertion is false but the reason is true.',
      'both-false': 'Both the assertion and reason are false.'
    }
    
    const correctAnswer = this.getOptionFromRelation(correctRelation)
    
    return {
      correctAnswer,
      whyCorrect: explanationMap[correctRelation],
      whyOthersWrong: [
        'Other options incorrectly assess the truth value of either the assertion or reason',
        'Some options incorrectly identify the relationship between assertion and reason'
      ],
      conceptClarity: `This question tests understanding of ${baseFact.content} and its constitutional context. Both factual knowledge and logical reasoning are required.`,
      memoryTrick: 'Always evaluate assertion and reason separately first, then check if the reason explains the assertion',
      commonMistakes: [
        'Not reading the assertion and reason carefully',
        'Confusing truth value with explanatory relationship',
        'Assuming true statements always explain each other'
      ],
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private getOptionFromRelation(relation: string): string {
    const optionMap = {
      'both-true-reason-correct': '(a) Both A and R are true and R is the correct explanation of A',
      'both-true-reason-incorrect': '(b) Both A and R are true but R is not the correct explanation of A',
      'assertion-true-reason-false': '(c) A is true but R is false',
      'assertion-false-reason-true': '(d) A is false but R is true',
      'both-false': '(e) Both A and R are false'
    }
    
    return optionMap[relation] || '(a)'
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Create a variation with opposite relationship
    const variationQuestion = await this.createAssertionReasoning(baseFact, difficulty)
    variationQuestion.id = this.generateQuestionId()
    
    // Modify to create different assertion-reason relationship
    if (variationQuestion.data.assertionReasoning) {
      const { assertion, reason } = variationQuestion.data.assertionReasoning
      
      // Create a scenario where both are true but reason doesn't explain assertion
      variationQuestion.data.assertionReasoning = {
        assertion: `${baseFact.content} is an important constitutional provision`,
        reason: `India follows a federal system of government`,
        correctRelation: 'both-true-reason-incorrect'
      }
    }
    
    variations.push(variationQuestion)
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'AssertionReasoning') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.assertionReasoning
    if (!data) {
      issues.push('Missing assertion reasoning data')
      return
    }
    
    if (!data.assertion || data.assertion.length < 10) {
      issues.push('Assertion is too short or missing')
      suggestions.push('Provide a meaningful assertion statement')
    }
    
    if (!data.reason || data.reason.length < 10) {
      issues.push('Reason is too short or missing')
      suggestions.push('Provide a meaningful reason statement')
    }
    
    const validRelations = [
      'both-true-reason-correct',
      'both-true-reason-incorrect', 
      'assertion-true-reason-false',
      'assertion-false-reason-true',
      'both-false'
    ]
    
    if (!validRelations.includes(data.correctRelation)) {
      issues.push('Invalid assertion-reason relationship')
      suggestions.push('Use one of the five standard assertion-reasoning relationships')
    }
    
    // Check for logical consistency
    if (data.assertion.toLowerCase().includes('false') && data.reason.toLowerCase().includes('true')) {
      issues.push('Potential logical inconsistency in assertion-reason formulation')
    }
  }
}