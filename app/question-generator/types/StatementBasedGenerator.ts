import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel,
  Statement
} from '../types'

export class StatementBasedGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['StatementBased']
  protected generatorName = 'StatementBasedGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createStatementBased(baseFact, difficulty)
      questions.push(mainQuestion)
      
      // Generate variations if requested
      if (includeVariations) {
        const variations = await this.createVariations(baseFact, difficulty)
        questions.push(...variations)
      }
    }
    
    return questions
  }
  
  private async createStatementBased(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const questionText = this.generateQuestionText(baseFact, difficulty)
    const { statements, correctCombination } = this.generateStatements(baseFact, difficulty)
    const explanation = this.generateDetailedExplanation(baseFact, statements, correctCombination)
    
    return {
      id: this.generateQuestionId(),
      type: 'StatementBased',
      questionText,
      data: {
        statementBased: { statements, correctCombination }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'StatementBased'),
      marks: this.determineMarks(difficulty, 'StatementBased'),
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
      tags: this.generateTags(baseFact, 'StatementBased', difficulty)
    }
  }
  
  private generateQuestionText(baseFact: BaseFact, difficulty: DifficultyLevel): string {
    const fact = baseFact.content
    
    switch (difficulty) {
      case 'easy':
        return this.generateEasyQuestion(fact)
      case 'medium':
        return this.generateMediumQuestion(fact, baseFact.concepts)
      case 'hard':
        return this.generateHardQuestion(fact, baseFact.concepts, baseFact.relatedFacts)
      default:
        return this.generateEasyQuestion(fact)
    }
  }
  
  private generateEasyQuestion(fact: string): string {
    const patterns = [
      `Consider the following statements about "${fact}":`,
      `Which of the following statements regarding "${fact}" are correct?`,
      `Examine the following statements about "${fact}":`,
      `With reference to "${fact}", consider the following:`
    ]
    
    const questionPattern = patterns[Math.floor(Math.random() * patterns.length)]
    
    return `${questionPattern}

Which of the above statements is/are correct?
(a) 1 only
(b) 2 only  
(c) Both 1 and 2
(d) Neither 1 nor 2`
  }
  
  private generateMediumQuestion(fact: string, concepts: string[]): string {
    const relatedConcept = concepts[0] || 'governance'
    const patterns = [
      `In the context of ${relatedConcept}, consider the following statements about "${fact}":`,
      `Analyze the following statements regarding "${fact}" and its implications:`,
      `With reference to constitutional provisions on "${fact}", examine the following:`,
      `Consider the following statements about the implementation of "${fact}":`
    ]
    
    const questionPattern = patterns[Math.floor(Math.random() * patterns.length)]
    
    return `${questionPattern}

Which of the above statements is/are correct?
(a) 1 only
(b) 2 only
(c) Both 1 and 2  
(d) Neither 1 nor 2`
  }
  
  private generateHardQuestion(fact: string, concepts: string[], relatedFacts: string[]): string {
    const concept = concepts[0] || 'constitutional law'
    const patterns = [
      `Critically analyze the following statements about "${fact}" in contemporary India:`,
      `Consider the evolution of "${fact}" through the following statements:`,
      `Evaluate the following statements about "${fact}" from a comparative constitutional perspective:`,
      `Examine the following statements regarding the judicial interpretation of "${fact}":`
    ]
    
    const questionPattern = patterns[Math.floor(Math.random() * patterns.length)]
    
    return `${questionPattern}

Which of the above statements is/are correct?
(a) 1 only
(b) 2 only
(c) Both 1 and 2
(d) Neither 1 nor 2`
  }
  
  private generateStatements(baseFact: BaseFact, difficulty: DifficultyLevel): {
    statements: Statement[],
    correctCombination: number[]
  } {
    const statementSets = this.getStatementSets(baseFact, difficulty)
    const selectedSet = statementSets[Math.floor(Math.random() * statementSets.length)]
    
    return {
      statements: selectedSet.statements,
      correctCombination: selectedSet.correctCombination
    }
  }
  
  private getStatementSets(baseFact: BaseFact, difficulty: DifficultyLevel): Array<{
    statements: Statement[],
    correctCombination: number[]
  }> {
    switch (difficulty) {
      case 'easy':
        return this.generateEasyStatementSets(baseFact)
      case 'medium':
        return this.generateMediumStatementSets(baseFact)
      case 'hard':
        return this.generateHardStatementSets(baseFact)
      default:
        return this.generateEasyStatementSets(baseFact)
    }
  }
  
  private generateEasyStatementSets(baseFact: BaseFact): Array<{
    statements: Statement[],
    correctCombination: number[]
  }> {
    return [
      {
        statements: [
          {
            number: 1,
            text: `${baseFact.source} provides for ${baseFact.content}`,
            isCorrect: true,
            explanation: `This is correct. ${baseFact.source} specifically establishes ${baseFact.content}.`
          },
          {
            number: 2,
            text: `${baseFact.content} is not mentioned in the Indian Constitution`,
            isCorrect: false,
            explanation: `This is incorrect. ${baseFact.content} is explicitly provided for in ${baseFact.source}.`
          }
        ],
        correctCombination: [1]
      },
      {
        statements: [
          {
            number: 1,
            text: `${baseFact.content} falls under ${baseFact.topic}`,
            isCorrect: true,
            explanation: `This is correct. ${baseFact.content} is categorized under ${baseFact.topic}.`
          },
          {
            number: 2,
            text: `${baseFact.source} deals with ${baseFact.content}`,
            isCorrect: true,
            explanation: `This is correct. ${baseFact.source} specifically addresses ${baseFact.content}.`
          }
        ],
        correctCombination: [1, 2]
      }
    ]
  }
  
  private generateMediumStatementSets(baseFact: BaseFact): Array<{
    statements: Statement[],
    correctCombination: number[]
  }> {
    return [
      {
        statements: [
          {
            number: 1,
            text: `${baseFact.content} requires enabling legislation for effective implementation`,
            isCorrect: true,
            explanation: 'Most constitutional provisions require legislative framework for practical implementation.'
          },
          {
            number: 2,
            text: `${baseFact.content} can be enforced directly without any legislation`,
            isCorrect: false,
            explanation: 'Constitutional provisions typically require enabling legislation and cannot be directly enforced in all cases.'
          }
        ],
        correctCombination: [1]
      },
      {
        statements: [
          {
            number: 1,
            text: `The scope of ${baseFact.content} has evolved through judicial interpretation`,
            isCorrect: true,
            explanation: 'Constitutional provisions evolve through continuous judicial interpretation and precedents.'
          },
          {
            number: 2,
            text: `${baseFact.content} must be balanced with reasonable restrictions in public interest`,
            isCorrect: true,
            explanation: 'Constitutional rights and provisions are subject to reasonable restrictions for public welfare.'
          }
        ],
        correctCombination: [1, 2]
      }
    ]
  }
  
  private generateHardStatementSets(baseFact: BaseFact): Array<{
    statements: Statement[],
    correctCombination: number[]
  }> {
    return [
      {
        statements: [
          {
            number: 1,
            text: `Contemporary interpretation of ${baseFact.content} must consider technological and social changes`,
            isCorrect: true,
            explanation: 'Constitutional interpretation must adapt to contemporary realities while maintaining core principles.'
          },
          {
            number: 2,
            text: `${baseFact.content} represents a synthesis of liberal democratic and social welfare principles`,
            isCorrect: true,
            explanation: 'Indian constitutional provisions reflect a balance between individual freedoms and collective welfare.'
          }
        ],
        correctCombination: [1, 2]
      },
      {
        statements: [
          {
            number: 1,
            text: `The constitutional framers intended ${baseFact.content} to be static and unchanging`,
            isCorrect: false,
            explanation: 'The Constitution was designed to be a living document capable of evolution and adaptation.'
          },
          {
            number: 2,
            text: `${baseFact.content} reflects influence from comparative constitutional law and international best practices`,
            isCorrect: true,
            explanation: 'Indian constitutional provisions draw from various global constitutional traditions and experiences.'
          }
        ],
        correctCombination: [2]
      }
    ]
  }
  
  private generateDetailedExplanation(baseFact: BaseFact, statements: Statement[], correctCombination: number[]) {
    const correctAnswer = this.getCorrectAnswerOption(correctCombination)
    const correctStatements = statements.filter(stmt => correctCombination.includes(stmt.number))
    const incorrectStatements = statements.filter(stmt => !correctCombination.includes(stmt.number))
    
    return {
      correctAnswer,
      whyCorrect: correctStatements.map(stmt => stmt.explanation).join(' '),
      whyOthersWrong: incorrectStatements.map(stmt => stmt.explanation),
      conceptClarity: `Understanding ${baseFact.content} requires careful analysis of its various dimensions and constitutional context.`,
      memoryTrick: 'Read each statement independently and verify against constitutional provisions',
      commonMistakes: [
        'Not reading statements carefully',
        'Confusing similar constitutional provisions',
        'Making assumptions about constitutional implementation'
      ],
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private getCorrectAnswerOption(correctCombination: number[]): string {
    if (correctCombination.length === 0) return '(d) Neither 1 nor 2'
    if (correctCombination.includes(1) && correctCombination.includes(2)) return '(c) Both 1 and 2'
    if (correctCombination.includes(1)) return '(a) 1 only'
    if (correctCombination.includes(2)) return '(b) 2 only'
    return '(d) Neither 1 nor 2'
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Create 3-statement variation
    const variationQuestion = await this.createStatementBased(baseFact, difficulty)
    variationQuestion.id = this.generateQuestionId()
    variationQuestion.questionText = variationQuestion.questionText.replace(
      'Which of the above statements is/are correct?\n(a) 1 only\n(b) 2 only\n(c) Both 1 and 2\n(d) Neither 1 nor 2',
      `Which of the above statements is/are correct?
(a) 1 and 2 only
(b) 2 and 3 only
(c) 1 and 3 only
(d) All of the above`
    )
    
    // Add third statement and update data
    if (variationQuestion.data.statementBased) {
      const thirdStatement: Statement = {
        number: 3,
        text: `${baseFact.content} can be amended through the constitutional amendment process`,
        isCorrect: true,
        explanation: 'Constitutional provisions can be amended following the procedures laid down in the Constitution.'
      }
      
      variationQuestion.data.statementBased.statements.push(thirdStatement)
      variationQuestion.data.statementBased.correctCombination = [1, 2, 3]
    }
    
    variations.push(variationQuestion)
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'StatementBased') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.statementBased
    if (!data) {
      issues.push('Missing statement based data')
      return
    }
    
    if (!data.statements || data.statements.length < 2) {
      issues.push('Must have at least 2 statements')
      suggestions.push('Provide at least 2 statements for evaluation')
    }
    
    if (data.statements.length > 4) {
      issues.push('Too many statements (maximum 4 recommended)')
      suggestions.push('Limit to 4 statements for better readability')
    }
    
    if (!data.correctCombination || data.correctCombination.length === 0) {
      issues.push('No correct combination specified')
      suggestions.push('Specify which statements are correct')
    }
    
    // Validate statement numbering
    const expectedNumbers = Array.from({length: data.statements.length}, (_, i) => i + 1)
    const actualNumbers = data.statements.map(stmt => stmt.number).sort()
    
    if (JSON.stringify(expectedNumbers) !== JSON.stringify(actualNumbers)) {
      issues.push('Statement numbering is incorrect')
      suggestions.push('Number statements sequentially starting from 1')
    }
    
    // Check statement quality
    data.statements.forEach((statement, index) => {
      if (!statement.text || statement.text.length < 10) {
        issues.push(`Statement ${index + 1} is too short`)
      }
      if (!statement.explanation) {
        issues.push(`Statement ${index + 1} missing explanation`)
      }
    })
    
    // Validate correct combination references
    const invalidRefs = data.correctCombination.filter(num => 
      !data.statements.some(stmt => stmt.number === num)
    )
    
    if (invalidRefs.length > 0) {
      issues.push('Correct combination references non-existent statements')
      suggestions.push('Ensure correct combination only references existing statement numbers')
    }
  }
}