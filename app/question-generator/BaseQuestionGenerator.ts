import { 
  Question, 
  QuestionType, 
  DifficultyLevel, 
  BaseFact, 
  QuestionGenerationConfig,
  ValidationResult,
  QuestionGenerator
} from './types'

export abstract class BaseQuestionGenerator implements QuestionGenerator {
  protected abstract supportedTypes: QuestionType[]
  protected abstract generatorName: string
  
  abstract generateQuestion(config: QuestionGenerationConfig): Promise<Question[]>
  
  getSupportedTypes(): QuestionType[] {
    return this.supportedTypes
  }
  
  async validateQuestion(question: Question): Promise<ValidationResult> {
    const issues: string[] = []
    const suggestions: string[] = []
    let qualityScore = 100
    
    // Basic validation
    if (!question.questionText || question.questionText.length < 10) {
      issues.push('Question text too short')
      qualityScore -= 20
    }
    
    if (!question.explanation.correctAnswer) {
      issues.push('Missing correct answer explanation')
      qualityScore -= 15
    }
    
    if (question.explanation.whyOthersWrong.length === 0) {
      issues.push('Missing explanations for incorrect options')
      qualityScore -= 10
    }
    
    // Type-specific validation
    await this.validateByType(question, issues, suggestions)
    
    // Calculate final scores
    const factualAccuracy = await this.checkFactualAccuracy(question)
    const difficultyAppropriate = this.validateDifficultyLevel(question)
    const ambiguityFree = this.checkAmbiguity(question)
    
    if (!factualAccuracy) {
      issues.push('Factual accuracy concerns detected')
      qualityScore -= 25
    }
    
    if (!difficultyAppropriate) {
      issues.push('Difficulty level inappropriate for content')
      qualityScore -= 15
    }
    
    if (!ambiguityFree) {
      issues.push('Question contains ambiguous elements')
      qualityScore -= 20
    }
    
    return {
      isValid: issues.length === 0,
      qualityScore: Math.max(0, qualityScore),
      issues,
      suggestions,
      factualAccuracy,
      difficultyAppropriate,
      ambiguityFree
    }
  }
  
  protected abstract validateByType(
    question: Question, 
    issues: string[], 
    suggestions: string[]
  ): Promise<void>
  
  protected async checkFactualAccuracy(question: Question): Promise<boolean> {
    // Implementation would use fact-checking algorithms
    // For now, return true with basic checks
    return question.baseFact && question.subject && question.topic
  }
  
  protected validateDifficultyLevel(question: Question): boolean {
    const difficultyFactors = this.analyzeDifficultyFactors(question)
    
    switch (question.difficulty) {
      case 'easy':
        return difficultyFactors.conceptCount <= 1 && 
               difficultyFactors.cognitive === 'recall' &&
               difficultyFactors.timeToSolve <= 30
      case 'medium':
        return difficultyFactors.conceptCount <= 3 && 
               ['application', 'analysis'].includes(difficultyFactors.cognitive) &&
               difficultyFactors.timeToSolve <= 60
      case 'hard':
        return difficultyFactors.conceptCount > 2 && 
               ['analysis', 'synthesis', 'evaluation'].includes(difficultyFactors.cognitive) &&
               difficultyFactors.timeToSolve > 60
      default:
        return false
    }
  }
  
  protected analyzeDifficultyFactors(question: Question) {
    return {
      conceptCount: question.conceptsTested.length,
      cognitive: this.determineCognitiveLevel(question.questionText),
      timeToSolve: question.timeToSolve,
      subjectIntegration: this.hasMultipleSubjects(question.conceptsTested)
    }
  }
  
  protected determineCognitiveLevel(questionText: string): string {
    const text = questionText.toLowerCase()
    
    if (text.includes('analyze') || text.includes('compare') || text.includes('examine')) {
      return 'analysis'
    } else if (text.includes('apply') || text.includes('how') || text.includes('implement')) {
      return 'application'
    } else if (text.includes('evaluate') || text.includes('critically') || text.includes('assess')) {
      return 'evaluation'
    } else if (text.includes('create') || text.includes('design') || text.includes('propose')) {
      return 'synthesis'
    } else {
      return 'recall'
    }
  }
  
  protected hasMultipleSubjects(concepts: string[]): boolean {
    const subjects = new Set()
    concepts.forEach(concept => {
      // Simple heuristic - would be more sophisticated in practice
      if (concept.includes('article') || concept.includes('constitutional')) subjects.add('polity')
      if (concept.includes('economic') || concept.includes('financial')) subjects.add('economy')
      if (concept.includes('environmental') || concept.includes('ecological')) subjects.add('environment')
      // Add more subject detection logic
    })
    return subjects.size > 1
  }
  
  protected checkAmbiguity(question: Question): boolean {
    const ambiguousWords = ['some', 'many', 'often', 'usually', 'generally', 'typically']
    const questionText = question.questionText.toLowerCase()
    
    // Check for ambiguous language
    const hasAmbiguousWords = ambiguousWords.some(word => questionText.includes(word))
    
    // Check for clear answer distinctions
    const hasMultipleValidAnswers = this.checkMultipleValidAnswers(question)
    
    return !hasAmbiguousWords && !hasMultipleValidAnswers
  }
  
  protected checkMultipleValidAnswers(question: Question): boolean {
    // Type-specific logic to check if multiple answers could be considered correct
    // This would be implemented based on question type
    return false
  }
  
  // Utility methods for question generation
  protected generateQuestionId(): string {
    return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  protected determineTimeToSolve(difficulty: DifficultyLevel, questionType: QuestionType): number {
    const baseTime = {
      'SingleCorrectMCQ': 30,
      'MultipleCorrectMCQ': 45,
      'MatchTheFollowing': 60,
      'AssertionReasoning': 45,
      'StatementBased': 60,
      'SequenceArrangement': 90,
      'OddOneOut': 30,
      'CaseStudyBased': 120,
      'MapBased': 45,
      'DataBased': 90
    }
    
    const difficultyMultiplier = {
      'easy': 0.8,
      'medium': 1.0,
      'hard': 1.5
    }
    
    return Math.round(baseTime[questionType] * difficultyMultiplier[difficulty])
  }
  
  protected determineMarks(difficulty: DifficultyLevel, questionType: QuestionType): number {
    if (questionType === 'CaseStudyBased') return difficulty === 'hard' ? 4 : 3
    if (questionType === 'DataBased') return difficulty === 'hard' ? 3 : 2
    
    return difficulty === 'hard' ? 2 : 1
  }
  
  protected generateTags(baseFact: BaseFact, questionType: QuestionType, difficulty: DifficultyLevel): string[] {
    return [
      baseFact.subject,
      baseFact.topic,
      questionType,
      difficulty,
      ...baseFact.tags,
      ...baseFact.concepts
    ]
  }
  
  // Common explanation generators
  protected generateCommonMistakes(concept: string): string[] {
    const commonMistakePatterns = {
      'fundamental rights': [
        'Confusing Fundamental Rights with Directive Principles',
        'Missing the reasonable restrictions clause',
        'Incorrect article number references'
      ],
      'constitutional articles': [
        'Mixing up article numbers',
        'Confusing Part numbers in Constitution',
        'Incorrect constitutional provisions'
      ],
      'amendments': [
        'Wrong amendment numbers',
        'Incorrect year of amendment',
        'Confusing amended and original provisions'
      ]
    }
    
    // Return relevant mistakes based on concept
    for (const [key, mistakes] of Object.entries(commonMistakePatterns)) {
      if (concept.toLowerCase().includes(key)) {
        return mistakes
      }
    }
    
    return ['Superficial reading of the question', 'Not considering all options carefully']
  }
  
  protected generateMemoryTrick(concept: string): string {
    const memoryTricks = {
      'article 14': 'Remember: 14 = Equality (1+4=5 senses, all equal)',
      'article 19': 'Remember: 19 = Teen age, freedom age (6 freedoms)',
      'article 21': 'Remember: 21 = Legal age, life begins',
      'article 25': 'Remember: 25 = Christmas day, religious freedom',
      'article 32': 'Remember: 32 = Heart age, heart of constitution'
    }
    
    return memoryTricks[concept.toLowerCase()] || 'Create association with numbers or events'
  }
  
  protected findRelatedPYQs(concept: string): string[] {
    // This would query a database of previous year questions
    // For now, return sample PYQ references
    return [
      `2023 Prelims - Question on ${concept}`,
      `2022 Mains - ${concept} in governance context`,
      `2021 Prelims - Application of ${concept}`
    ]
  }
}