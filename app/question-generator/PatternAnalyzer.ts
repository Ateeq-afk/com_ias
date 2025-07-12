import { Question, PatternAnalyzer, TrendAnalysis } from './types'

export class UPSCPatternAnalyzer implements PatternAnalyzer {
  
  analyzePYQSimilarity(question: Question): number {
    let similarity = 0
    
    // Analyze question structure patterns
    similarity += this.analyzeQuestionStructure(question) * 0.25
    
    // Analyze content patterns  
    similarity += this.analyzeContentPatterns(question) * 0.25
    
    // Analyze difficulty patterns
    similarity += this.analyzeDifficultyPatterns(question) * 0.20
    
    // Analyze vocabulary patterns
    similarity += this.analyzeVocabularyPatterns(question) * 0.15
    
    // Analyze UPSC-specific patterns
    similarity += this.analyzeUPSCSpecificPatterns(question) * 0.15
    
    return Math.min(Math.round(similarity), 100)
  }
  
  identifyHighYieldTopics(questions: Question[]): string[] {
    const topicFrequency = new Map<string, number>()
    const topicImportance = new Map<string, number>()
    
    // Count topic frequency and calculate importance
    questions.forEach(question => {
      const topic = question.topic
      topicFrequency.set(topic, (topicFrequency.get(topic) || 0) + 1)
      
      // Calculate importance based on difficulty and question type
      const importance = this.calculateTopicImportance(question)
      topicImportance.set(topic, (topicImportance.get(topic) || 0) + importance)
    })
    
    // Combine frequency and importance scores
    const topicScores = new Map<string, number>()
    topicFrequency.forEach((frequency, topic) => {
      const importance = topicImportance.get(topic) || 0
      const score = frequency * 0.4 + importance * 0.6
      topicScores.set(topic, score)
    })
    
    // Return top high-yield topics
    return Array.from(topicScores.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([topic]) => topic)
  }
  
  generateSimilarPatterns(pyqPattern: string): Question[] {
    // This would typically query a database of PYQ patterns
    // For now, return template-based similar questions
    const similarQuestions: Question[] = []
    
    const patternAnalysis = this.analyzePYQPattern(pyqPattern)
    
    // Generate questions based on identified patterns
    if (patternAnalysis.type === 'constitutional-rights') {
      similarQuestions.push(...this.generateConstitutionalRightsQuestions(patternAnalysis))
    } else if (patternAnalysis.type === 'institutional-powers') {
      similarQuestions.push(...this.generateInstitutionalQuestionsPattern(patternAnalysis))
    } else if (patternAnalysis.type === 'amendment-analysis') {
      similarQuestions.push(...this.generateAmendmentQuestions(patternAnalysis))
    }
    
    return similarQuestions
  }
  
  trackTrends(questions: Question[]): TrendAnalysis {
    return {
      popularTopics: this.analyzePopularTopics(questions),
      difficultyDistribution: this.analyzeDifficultyDistribution(questions),
      questionTypePreference: this.analyzeQuestionTypePreference(questions),
      emergingPatterns: this.identifyEmergingPatterns(questions)
    }
  }
  
  private analyzeQuestionStructure(question: Question): number {
    let score = 0
    const questionText = question.questionText.toLowerCase()
    
    // UPSC question structure patterns
    const upscStructures = [
      /^which of the following/,
      /^consider the following/,
      /^with reference to/,
      /^in the context of/,
      /^which.*?statement.*?correct/,
      /^arrange.*?chronological.*?order/,
      /^match.*?following/
    ]
    
    upscStructures.forEach(pattern => {
      if (pattern.test(questionText)) {
        score += 15
      }
    })
    
    // Question ending patterns
    const endingPatterns = [
      /select.*?correct.*?option/,
      /choose.*?appropriate/,
      /identify.*?correct/,
      /which.*?above.*?correct/
    ]
    
    endingPatterns.forEach(pattern => {
      if (pattern.test(questionText)) {
        score += 10
      }
    })
    
    return Math.min(score, 100)
  }
  
  private analyzeContentPatterns(question: Question): number {
    let score = 0
    const text = (question.questionText + ' ' + question.explanation.conceptClarity).toLowerCase()
    
    // UPSC content patterns
    const contentIndicators = [
      // Constitutional references
      { pattern: /article\s+\d+/, score: 20 },
      { pattern: /constitutional\s+(provision|amendment)/, score: 15 },
      { pattern: /fundamental\s+(right|duty)/, score: 18 },
      
      // Institutional references
      { pattern: /(supreme court|high court|parliament)/, score: 15 },
      { pattern: /(president|prime minister|governor)/, score: 12 },
      
      // UPSC buzzwords
      { pattern: /(governance|administration|policy)/, score: 10 },
      { pattern: /(contemporary|current|recent)/, score: 8 },
      { pattern: /(implementation|application)/, score: 8 },
      
      // Legal terminology
      { pattern: /(judicial review|writ|jurisdiction)/, score: 12 },
      { pattern: /(precedent|landmark case)/, score: 10 },
      
      // Multi-disciplinary connections
      { pattern: /(economic|social|environmental)\s+implication/, score: 8 }
    ]
    
    contentIndicators.forEach(({ pattern, score: points }) => {
      if (pattern.test(text)) {
        score += points
      }
    })
    
    return Math.min(score, 100)
  }
  
  private analyzeDifficultyPatterns(question: Question): number {
    let score = 0
    
    // UPSC difficulty characteristics
    const difficultyFactors = {
      easy: { timeRange: [30, 60], concepts: [1, 2], score: 70 },
      medium: { timeRange: [45, 90], concepts: [2, 4], score: 85 },
      hard: { timeRange: [75, 120], concepts: [3, 6], score: 95 }
    }
    
    const factor = difficultyFactors[question.difficulty]
    
    // Check time appropriateness
    if (question.timeToSolve >= factor.timeRange[0] && question.timeToSolve <= factor.timeRange[1]) {
      score += 30
    }
    
    // Check concept count appropriateness
    const conceptCount = question.conceptsTested.length
    if (conceptCount >= factor.concepts[0] && conceptCount <= factor.concepts[1]) {
      score += 30
    }
    
    // Check marks allocation
    const expectedMarks = question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 2 : 3
    if (question.marks === expectedMarks) {
      score += 20
    }
    
    // Check question type appropriateness for difficulty
    const typeComplexity = this.getQuestionTypeComplexity(question.type)
    const difficultyComplexity = { easy: 1, medium: 2, hard: 3 }[question.difficulty]
    
    if (Math.abs(typeComplexity - difficultyComplexity) <= 1) {
      score += 20
    }
    
    return score
  }
  
  private analyzeVocabularyPatterns(question: Question): number {
    let score = 0
    const text = question.questionText + ' ' + question.explanation.conceptClarity
    
    // UPSC vocabulary patterns
    const upscVocabulary = [
      'constitutional', 'judicial', 'legislative', 'executive', 'administrative',
      'governance', 'implementation', 'framework', 'provision', 'jurisdiction',
      'precedent', 'interpretation', 'contemporary', 'comprehensive', 'significant',
      'fundamental', 'essential', 'crucial', 'relevant', 'appropriate',
      'implications', 'consequences', 'ramifications', 'effectiveness', 'efficiency'
    ]
    
    const words = text.toLowerCase().split(/\s+/)
    const vocabularyMatches = words.filter(word => 
      upscVocabulary.some(vocab => word.includes(vocab))
    ).length
    
    const vocabularyRatio = vocabularyMatches / words.length
    
    // Optimal vocabulary ratio for UPSC questions is 0.1-0.2
    if (vocabularyRatio >= 0.1 && vocabularyRatio <= 0.2) {
      score = 100
    } else if (vocabularyRatio >= 0.05 && vocabularyRatio <= 0.3) {
      score = 75
    } else {
      score = 50
    }
    
    return score
  }
  
  private analyzeUPSCSpecificPatterns(question: Question): number {
    let score = 0
    const text = question.questionText.toLowerCase()
    
    // UPSC-specific question patterns
    const upscPatterns = [
      // Multi-statement questions
      { pattern: /statement.*?1.*?statement.*?2/, score: 20 },
      
      // Assertion-Reasoning format
      { pattern: /assertion.*?reason/, score: 25 },
      
      // Current affairs integration
      { pattern: /(recent|current|contemporary|2020|2021|2022|2023|2024)/, score: 15 },
      
      // Application-based questions
      { pattern: /(scenario|case|situation|context)/, score: 15 },
      
      // Cross-cutting themes
      { pattern: /(sustainable development|good governance|digital india)/, score: 10 },
      
      // Ethics integration
      { pattern: /(ethical|moral|values|integrity)/, score: 10 },
      
      // International perspective
      { pattern: /(international|global|comparative)/, score: 8 }
    ]
    
    upscPatterns.forEach(({ pattern, score: points }) => {
      if (pattern.test(text)) {
        score += points
      }
    })
    
    return Math.min(score, 100)
  }
  
  private calculateTopicImportance(question: Question): number {
    let importance = 0
    
    // Base importance by difficulty
    importance += { easy: 1, medium: 2, hard: 3 }[question.difficulty]
    
    // Question type multiplier
    const typeMultiplier = {
      'SingleCorrectMCQ': 1.2,
      'MultipleCorrectMCQ': 1.5,
      'StatementBased': 1.4,
      'AssertionReasoning': 1.3,
      'CaseStudyBased': 1.6,
      'MatchTheFollowing': 1.1,
      'SequenceArrangement': 1.0,
      'OddOneOut': 0.9,
      'MapBased': 1.0,
      'DataBased': 1.2
    }
    
    importance *= typeMultiplier[question.type] || 1.0
    
    // High-yield topic boost
    if (question.metadata.highYieldTopic) {
      importance *= 1.5
    }
    
    // Quality score factor
    importance *= (question.metadata.qualityScore / 100)
    
    return importance
  }
  
  private getQuestionTypeComplexity(type: string): number {
    const complexity = {
      'SingleCorrectMCQ': 1,
      'OddOneOut': 1,
      'MultipleCorrectMCQ': 2,
      'StatementBased': 2,
      'MatchTheFollowing': 2,
      'AssertionReasoning': 2,
      'SequenceArrangement': 3,
      'MapBased': 2,
      'DataBased': 3,
      'CaseStudyBased': 3
    }
    
    return complexity[type] || 2
  }
  
  private analyzePYQPattern(pattern: string): any {
    // Simplified pattern analysis
    if (pattern.includes('fundamental rights') || pattern.includes('article')) {
      return { type: 'constitutional-rights', complexity: 'medium' }
    }
    
    if (pattern.includes('parliament') || pattern.includes('president') || pattern.includes('court')) {
      return { type: 'institutional-powers', complexity: 'hard' }
    }
    
    if (pattern.includes('amendment')) {
      return { type: 'amendment-analysis', complexity: 'hard' }
    }
    
    return { type: 'general', complexity: 'medium' }
  }
  
  private generateConstitutionalRightsQuestions(analysis: any): Question[] {
    // Template-based question generation
    return []
  }
  
  private generateInstitutionalQuestionsPattern(analysis: any): Question[] {
    // Template-based question generation
    return []
  }
  
  private generateAmendmentQuestions(analysis: any): Question[] {
    // Template-based question generation
    return []
  }
  
  private analyzePopularTopics(questions: Question[]): Array<{topic: string, frequency: number}> {
    const topicCount = new Map<string, number>()
    
    questions.forEach(question => {
      const topic = question.topic
      topicCount.set(topic, (topicCount.get(topic) || 0) + 1)
    })
    
    return Array.from(topicCount.entries())
      .map(([topic, frequency]) => ({ topic, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)
  }
  
  private analyzeDifficultyDistribution(questions: Question[]): Record<string, number> {
    const distribution = { easy: 0, medium: 0, hard: 0 }
    
    questions.forEach(question => {
      distribution[question.difficulty]++
    })
    
    return distribution
  }
  
  private analyzeQuestionTypePreference(questions: Question[]): Record<string, number> {
    const preference: Record<string, number> = {}
    
    questions.forEach(question => {
      preference[question.type] = (preference[question.type] || 0) + 1
    })
    
    return preference
  }
  
  private identifyEmergingPatterns(questions: Question[]): string[] {
    const patterns: string[] = []
    
    // Analyze for emerging patterns
    const recentQuestions = questions.filter(q => 
      new Date(q.metadata.created) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    
    // Check for increasing complexity
    const avgComplexity = recentQuestions.reduce((acc, q) => 
      acc + this.getQuestionTypeComplexity(q.type), 0) / recentQuestions.length
    
    if (avgComplexity > 2) {
      patterns.push('Increasing question complexity trend')
    }
    
    // Check for interdisciplinary questions
    const interdisciplinary = recentQuestions.filter(q => q.conceptsTested.length > 3).length
    if (interdisciplinary / recentQuestions.length > 0.3) {
      patterns.push('Growing emphasis on interdisciplinary questions')
    }
    
    // Check for application-based questions
    const applicationBased = recentQuestions.filter(q => 
      q.questionText.toLowerCase().includes('application') ||
      q.questionText.toLowerCase().includes('implementation') ||
      q.type === 'CaseStudyBased'
    ).length
    
    if (applicationBased / recentQuestions.length > 0.25) {
      patterns.push('Shift towards application and implementation focused questions')
    }
    
    // Check for current affairs integration
    const currentAffairs = recentQuestions.filter(q =>
      q.questionText.toLowerCase().includes('recent') ||
      q.questionText.toLowerCase().includes('current') ||
      q.questionText.toLowerCase().includes('contemporary')
    ).length
    
    if (currentAffairs / recentQuestions.length > 0.2) {
      patterns.push('Increased integration of current affairs with core topics')
    }
    
    return patterns
  }
  
  // Additional utility methods for pattern analysis
  public generatePatternReport(questions: Question[]): string {
    const trends = this.trackTrends(questions)
    const highYieldTopics = this.identifyHighYieldTopics(questions)
    
    const report = `
UPSC Question Pattern Analysis Report
=====================================

Popular Topics:
${trends.popularTopics.map(t => `- ${t.topic}: ${t.frequency} questions`).join('\n')}

Difficulty Distribution:
- Easy: ${trends.difficultyDistribution.easy}
- Medium: ${trends.difficultyDistribution.medium}  
- Hard: ${trends.difficultyDistribution.hard}

Question Type Preferences:
${Object.entries(trends.questionTypePreference)
  .sort(([,a], [,b]) => b - a)
  .map(([type, count]) => `- ${type}: ${count}`)
  .join('\n')}

High-Yield Topics:
${highYieldTopics.slice(0, 10).map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

Emerging Patterns:
${trends.emergingPatterns.map(pattern => `- ${pattern}`).join('\n')}
    `
    
    return report.trim()
  }
}