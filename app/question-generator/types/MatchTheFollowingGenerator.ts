import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel,
  MatchPair
} from '../types'

export class MatchTheFollowingGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['MatchTheFollowing']
  protected generatorName = 'MatchTheFollowingGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createMatchTheFollowing(baseFact, difficulty)
      questions.push(mainQuestion)
      
      // Generate variations if requested (no negative version for this type)
      if (includeVariations) {
        const variations = await this.createVariations(baseFact, difficulty)
        questions.push(...variations)
      }
    }
    
    return questions
  }
  
  private async createMatchTheFollowing(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const questionText = this.generateQuestionText(baseFact, difficulty)
    const { leftColumn, rightColumn, correctPairs } = this.generateMatchingData(baseFact, difficulty)
    const explanation = this.generateDetailedExplanation(baseFact, correctPairs)
    
    return {
      id: this.generateQuestionId(),
      type: 'MatchTheFollowing',
      questionText,
      data: {
        matchTheFollowing: { leftColumn, rightColumn, correctPairs }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'MatchTheFollowing'),
      marks: this.determineMarks(difficulty, 'MatchTheFollowing'),
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
      tags: this.generateTags(baseFact, 'MatchTheFollowing', difficulty)
    }
  }
  
  private generateQuestionText(baseFact: BaseFact, difficulty: DifficultyLevel): string {
    const fact = baseFact.content
    const source = baseFact.source
    
    switch (difficulty) {
      case 'easy':
        return this.generateEasyQuestion(fact, source)
      case 'medium':
        return this.generateMediumQuestion(fact, source, baseFact.concepts)
      case 'hard':
        return this.generateHardQuestion(fact, source, baseFact.concepts, baseFact.relatedFacts)
      default:
        return this.generateEasyQuestion(fact, source)
    }
  }
  
  private generateEasyQuestion(fact: string, source: string): string {
    const patterns = [
      `Match the following constitutional provisions with their descriptions:`,
      `Match List I with List II:`,
      `Match the following articles with their subject matter:`,
      `Correctly match the constitutional provisions:`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private generateMediumQuestion(fact: string, source: string, concepts: string[]): string {
    const relatedConcept = concepts[0] || 'governance'
    const patterns = [
      `In the context of ${relatedConcept}, match the following provisions with their implications:`,
      `Match the constitutional articles with their practical applications:`,
      `Connect the following constitutional concepts with their real-world examples:`,
      `Match the provisions with their contemporary relevance:`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private generateHardQuestion(fact: string, source: string, concepts: string[], relatedFacts: string[]): string {
    const concept = concepts[0] || 'constitutional law'
    const patterns = [
      `Analyze and match the constitutional provisions with their judicial interpretations:`,
      `Match the following constitutional concepts with their evolution through landmark cases:`,
      `Connect the provisions with their comparative constitutional parallels:`,
      `Match the constitutional framework elements with their philosophical foundations:`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private generateMatchingData(baseFact: BaseFact, difficulty: DifficultyLevel): {
    leftColumn: string[],
    rightColumn: string[],
    correctPairs: MatchPair[]
  } {
    const pairs = this.getMatchingPairs(baseFact, difficulty)
    const leftColumn = pairs.map(pair => pair.left)
    const rightColumn = this.shuffleArray([...pairs.map(pair => pair.right)])
    
    return {
      leftColumn,
      rightColumn,
      correctPairs: pairs
    }
  }
  
  private getMatchingPairs(baseFact: BaseFact, difficulty: DifficultyLevel): MatchPair[] {
    switch (difficulty) {
      case 'easy':
        return this.generateEasyPairs(baseFact)
      case 'medium':
        return this.generateMediumPairs(baseFact)
      case 'hard':
        return this.generateHardPairs(baseFact)
      default:
        return this.generateEasyPairs(baseFact)
    }
  }
  
  private generateEasyPairs(baseFact: BaseFact): MatchPair[] {
    const sourceNum = parseInt(baseFact.source.replace('Article ', ''))
    
    return [
      {
        left: baseFact.source,
        right: baseFact.content,
        explanation: `${baseFact.source} specifically deals with ${baseFact.content}.`
      },
      {
        left: `Article ${sourceNum + 1}`,
        right: 'Related constitutional provision',
        explanation: `Article ${sourceNum + 1} covers a different but related constitutional matter.`
      },
      {
        left: `Article ${sourceNum - 1}`,
        right: 'Preceding constitutional clause',
        explanation: `Article ${sourceNum - 1} precedes and contextualizes the main provision.`
      },
      {
        left: 'Constitutional Part',
        right: baseFact.topic,
        explanation: `This provision falls under the constitutional part dealing with ${baseFact.topic}.`
      },
      {
        left: 'Legal Status',
        right: 'Enforceable/Non-enforceable',
        explanation: 'Constitutional provisions have different legal enforceability status.'
      }
    ]
  }
  
  private generateMediumPairs(baseFact: BaseFact): MatchPair[] {
    return [
      {
        left: baseFact.content,
        right: 'Legislative implementation required',
        explanation: `${baseFact.content} requires enabling legislation for effective implementation.`
      },
      {
        left: 'Reasonable restrictions',
        right: 'Balancing individual and state interests',
        explanation: 'Constitutional rights are subject to reasonable restrictions to balance competing interests.'
      },
      {
        left: 'Judicial review',
        right: 'Constitutional interpretation mechanism',
        explanation: 'Courts interpret and evolve constitutional provisions through judicial review.'
      },
      {
        left: 'Amendment procedure',
        right: 'Constitutional modification process',
        explanation: 'Specific procedures exist for amending constitutional provisions.'
      },
      {
        left: 'Federal structure',
        right: 'Distribution of powers',
        explanation: 'Constitutional provisions operate within the federal structure of governance.'
      }
    ]
  }
  
  private generateHardPairs(baseFact: BaseFact): MatchPair[] {
    return [
      {
        left: 'Constituent Assembly debates',
        right: 'Original constitutional intent',
        explanation: 'Understanding original framers\' intent through constituent assembly discussions.'
      },
      {
        left: 'Comparative constitutional law',
        right: 'International best practices',
        explanation: 'Indian constitutional provisions draw from and compare with global constitutional traditions.'
      },
      {
        left: 'Evolving jurisprudence',
        right: 'Dynamic constitutional interpretation',
        explanation: 'Constitutional meaning evolves through continuous judicial interpretation and societal changes.'
      },
      {
        left: 'Constitutional philosophy',
        right: 'Underlying normative framework',
        explanation: 'Constitutional provisions reflect deeper philosophical commitments about justice and governance.'
      },
      {
        left: 'Contemporary challenges',
        right: 'Adaptive constitutional response',
        explanation: 'Modern constitutional interpretation addresses contemporary social and technological challenges.'
      }
    ]
  }
  
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  
  private generateDetailedExplanation(baseFact: BaseFact, correctPairs: MatchPair[]) {
    const correctAnswers = correctPairs.map(pair => `${pair.left} → ${pair.right}`).join('; ')
    const explanations = correctPairs.map(pair => pair.explanation)
    
    return {
      correctAnswer: correctAnswers,
      whyCorrect: explanations.join(' '),
      whyOthersWrong: ['Incorrect matches would show misunderstanding of constitutional relationships and provisions.'],
      conceptClarity: `Understanding ${baseFact.content} requires recognizing its relationships with other constitutional elements and their practical implications.`,
      memoryTrick: this.generateMemoryTrick(baseFact.source.toLowerCase()),
      commonMistakes: [
        'Confusing similar constitutional provisions',
        'Mismatching articles with their subjects',
        'Incorrect understanding of constitutional relationships'
      ],
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Timeline-based variation
    const timelineQuestion = await this.createMatchTheFollowing(baseFact, difficulty)
    timelineQuestion.questionText = `Match the following constitutional developments with their chronological periods:`
    timelineQuestion.id = this.generateQuestionId()
    
    // Update pairs for timeline theme
    if (timelineQuestion.data.matchTheFollowing) {
      const timelinePairs: MatchPair[] = [
        {
          left: 'Pre-independence discussions',
          right: '1930s-1940s',
          explanation: 'Constitutional discussions began during the independence movement.'
        },
        {
          left: 'Constituent Assembly',
          right: '1946-1950',
          explanation: 'The Constituent Assembly drafted the Constitution between 1946-1950.'
        },
        {
          left: 'Constitution adoption',
          right: '26 January 1950',
          explanation: 'The Constitution came into effect on 26 January 1950.'
        },
        {
          left: 'First amendment',
          right: '1951',
          explanation: 'The first constitutional amendment was passed in 1951.'
        },
        {
          left: 'Basic structure doctrine',
          right: '1973 (Kesavananda Bharati)',
          explanation: 'The basic structure doctrine was established in 1973.'
        }
      ]
      
      timelineQuestion.data.matchTheFollowing.correctPairs = timelinePairs
      timelineQuestion.data.matchTheFollowing.leftColumn = timelinePairs.map(p => p.left)
      timelineQuestion.data.matchTheFollowing.rightColumn = this.shuffleArray(timelinePairs.map(p => p.right))
    }
    
    variations.push(timelineQuestion)
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'MatchTheFollowing') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.matchTheFollowing
    if (!data) {
      issues.push('Missing match the following data')
      return
    }
    
    if (data.leftColumn.length !== 5 || data.rightColumn.length !== 5) {
      issues.push('Match the following must have exactly 5 items in each column')
      suggestions.push('Ensure both columns have exactly 5 items')
    }
    
    if (data.correctPairs.length !== 5) {
      issues.push('Must have exactly 5 correct pairs')
      suggestions.push('Provide exactly 5 matching pairs')
    }
    
    // Check if all left items have corresponding pairs
    const leftInPairs = data.correctPairs.map(pair => pair.left)
    const missingLeft = data.leftColumn.filter(item => !leftInPairs.includes(item))
    if (missingLeft.length > 0) {
      issues.push('Some left column items have no matching pairs')
      suggestions.push('Ensure all left column items have corresponding pairs')
    }
    
    // Check pair quality
    data.correctPairs.forEach((pair, index) => {
      if (!pair.left || !pair.right) {
        issues.push(`Pair ${index + 1} has missing items`)
      }
      if (!pair.explanation) {
        issues.push(`Pair ${index + 1} missing explanation`)
      }
    })
  }
}