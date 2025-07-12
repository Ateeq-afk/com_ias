import { Question, DifficultyLevel, DifficultyCalculator } from './types'

export class UPSCDifficultyCalculator implements DifficultyCalculator {
  
  calculateDifficulty(question: Question): DifficultyLevel {
    const factors = this.analyzeDifficultyFactors(question)
    const score = this.calculateDifficultyScore(factors)
    
    if (score <= 35) return 'easy'
    if (score <= 70) return 'medium'
    return 'hard'
  }
  
  validateDifficulty(question: Question, expectedDifficulty: DifficultyLevel): boolean {
    const calculatedDifficulty = this.calculateDifficulty(question)
    return calculatedDifficulty === expectedDifficulty
  }
  
  getDifficultyFactors(): string[] {
    return [
      'Concept Count',
      'Cognitive Level',
      'Question Type Complexity',
      'Time Requirement',
      'Subject Integration',
      'Vocabulary Complexity',
      'UPSC Pattern Alignment',
      'Cross-Reference Requirement'
    ]
  }
  
  private analyzeDifficultyFactors(question: Question) {
    return {
      conceptCount: this.calculateConceptCountScore(question),
      cognitiveLevel: this.calculateCognitiveLevelScore(question),
      questionTypeComplexity: this.calculateQuestionTypeScore(question),
      timeRequirement: this.calculateTimeScore(question),
      subjectIntegration: this.calculateIntegrationScore(question),
      vocabularyComplexity: this.calculateVocabularyScore(question),
      upscPatternAlignment: this.calculateUPSCPatternScore(question),
      crossReferenceRequirement: this.calculateCrossReferenceScore(question)
    }
  }
  
  private calculateDifficultyScore(factors: any): number {
    const weights = {
      conceptCount: 0.15,
      cognitiveLevel: 0.20,
      questionTypeComplexity: 0.15,
      timeRequirement: 0.10,
      subjectIntegration: 0.10,
      vocabularyComplexity: 0.10,
      upscPatternAlignment: 0.10,
      crossReferenceRequirement: 0.10
    }
    
    let totalScore = 0
    for (const [factor, weight] of Object.entries(weights)) {
      totalScore += factors[factor] * weight
    }
    
    return Math.round(totalScore)
  }
  
  private calculateConceptCountScore(question: Question): number {
    const conceptCount = question.conceptsTested.length
    
    if (conceptCount <= 1) return 20  // Easy
    if (conceptCount <= 3) return 50  // Medium 
    if (conceptCount <= 5) return 75  // Hard
    return 90  // Very Hard
  }
  
  private calculateCognitiveLevelScore(question: Question): number {
    const text = question.questionText.toLowerCase()
    const explanation = question.explanation.conceptClarity.toLowerCase()
    
    // Bloom's Taxonomy mapping
    const cognitiveKeywords = {
      remember: ['what', 'when', 'where', 'who', 'list', 'identify', 'define', 'recall'],
      understand: ['explain', 'describe', 'summarize', 'interpret', 'classify'],
      apply: ['apply', 'implement', 'use', 'demonstrate', 'solve', 'show'],
      analyze: ['analyze', 'examine', 'compare', 'contrast', 'distinguish', 'differentiate'],
      evaluate: ['evaluate', 'assess', 'judge', 'critique', 'justify', 'defend'],
      create: ['create', 'design', 'construct', 'develop', 'formulate', 'synthesize']
    }
    
    const scores = {
      remember: 15,
      understand: 30,
      apply: 45,
      analyze: 65,
      evaluate: 80,
      create: 95
    }
    
    for (const [level, keywords] of Object.entries(cognitiveKeywords)) {
      if (keywords.some(keyword => text.includes(keyword) || explanation.includes(keyword))) {
        return scores[level as keyof typeof scores]
      }
    }
    
    return 30 // Default to understand level
  }
  
  private calculateQuestionTypeScore(question: Question): number {
    const typeComplexity = {
      'SingleCorrectMCQ': 25,
      'MultipleCorrectMCQ': 40,
      'OddOneOut': 35,
      'StatementBased': 50,
      'AssertionReasoning': 60,
      'MatchTheFollowing': 55,
      'SequenceArrangement': 65,
      'MapBased': 45,
      'DataBased': 70,
      'CaseStudyBased': 85
    }
    
    return typeComplexity[question.type] || 50
  }
  
  private calculateTimeScore(question: Question): number {
    const timeToSolve = question.timeToSolve
    
    if (timeToSolve <= 30) return 20   // Easy
    if (timeToSolve <= 60) return 40   // Medium
    if (timeToSolve <= 90) return 60   // Hard  
    if (timeToSolve <= 120) return 80  // Very Hard
    return 90  // Extremely Hard
  }
  
  private calculateIntegrationScore(question: Question): number {
    const subjects = this.identifySubjects(question.conceptsTested)
    const subjectCount = subjects.size
    
    if (subjectCount <= 1) return 20  // Single subject
    if (subjectCount === 2) return 50  // Cross-subject
    return 75  // Multi-subject integration
  }
  
  private identifySubjects(concepts: string[]): Set<string> {
    const subjects = new Set<string>()
    
    const subjectKeywords = {
      'polity': ['constitution', 'parliament', 'judicial', 'president', 'article', 'amendment', 'fundamental rights'],
      'history': ['ancient', 'medieval', 'modern', 'independence', 'colonial', 'dynasty', 'empire'],
      'geography': ['climate', 'soil', 'river', 'mountain', 'plateau', 'coastal', 'monsoon'],
      'economy': ['gdp', 'inflation', 'monetary', 'fiscal', 'budget', 'trade', 'industrial'],
      'environment': ['ecosystem', 'biodiversity', 'pollution', 'conservation', 'climate change'],
      'science': ['technology', 'biotechnology', 'space', 'nuclear', 'renewable', 'innovation']
    }
    
    for (const concept of concepts) {
      const lowerConcept = concept.toLowerCase()
      for (const [subject, keywords] of Object.entries(subjectKeywords)) {
        if (keywords.some(keyword => lowerConcept.includes(keyword))) {
          subjects.add(subject)
          break
        }
      }
    }
    
    return subjects
  }
  
  private calculateVocabularyScore(question: Question): number {
    const text = question.questionText + ' ' + question.explanation.conceptClarity
    const words = text.split(/\s+/)
    
    // Complex vocabulary indicators
    const complexWords = words.filter(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '')
      return cleanWord.length > 8 || // Long words
             this.isLegalTerm(cleanWord) || // Legal terminology
             this.isAcademicTerm(cleanWord) // Academic vocabulary
    })
    
    const complexityRatio = complexWords.length / words.length
    
    if (complexityRatio < 0.1) return 20   // Simple vocabulary
    if (complexityRatio < 0.2) return 40   // Moderate vocabulary
    if (complexityRatio < 0.3) return 60   // Complex vocabulary
    return 80  // Very complex vocabulary
  }
  
  private isLegalTerm(word: string): boolean {
    const legalTerms = [
      'constitutional', 'judicial', 'legislature', 'jurisdiction', 'adjudication',
      'jurisprudence', 'precedent', 'sovereignty', 'federalism', 'amendment'
    ]
    return legalTerms.includes(word)
  }
  
  private isAcademicTerm(word: string): boolean {
    const academicTerms = [
      'administration', 'implementation', 'comprehensive', 'contemporary',
      'fundamental', 'institutional', 'systematic', 'philosophical', 'theoretical'
    ]
    return academicTerms.includes(word)
  }
  
  private calculateUPSCPatternScore(question: Question): number {
    const upscCharacteristics = [
      this.hasCurrentAffairsLink(question),
      this.hasMultiplePerspectives(question),
      this.hasApplicationFocus(question),
      this.hasEthicalDimension(question),
      this.hasGovernanceRelevance(question)
    ]
    
    const matchingCharacteristics = upscCharacteristics.filter(Boolean).length
    
    return 20 + (matchingCharacteristics * 15) // Base 20, up to 95
  }
  
  private hasCurrentAffairsLink(question: Question): boolean {
    const currentAffairsKeywords = [
      'contemporary', 'current', 'recent', 'modern', '2020', '2021', '2022', '2023', '2024'
    ]
    const text = question.questionText.toLowerCase()
    return currentAffairsKeywords.some(keyword => text.includes(keyword))
  }
  
  private hasMultiplePerspectives(question: Question): boolean {
    return question.type === 'CaseStudyBased' || 
           question.type === 'AssertionReasoning' ||
           (question.data.multipleCorrect && question.data.multipleCorrect.correctCount > 1)
  }
  
  private hasApplicationFocus(question: Question): boolean {
    const applicationKeywords = ['implement', 'apply', 'practice', 'real-world', 'scenario', 'case']
    const text = question.questionText.toLowerCase()
    return applicationKeywords.some(keyword => text.includes(keyword))
  }
  
  private hasEthicalDimension(question: Question): boolean {
    const ethicalKeywords = ['ethical', 'moral', 'values', 'integrity', 'justice', 'fairness']
    const text = (question.questionText + ' ' + question.explanation.conceptClarity).toLowerCase()
    return ethicalKeywords.some(keyword => text.includes(keyword))
  }
  
  private hasGovernanceRelevance(question: Question): boolean {
    const governanceKeywords = [
      'governance', 'administration', 'policy', 'public', 'government', 
      'bureaucracy', 'civil service', 'implementation'
    ]
    const text = question.questionText.toLowerCase()
    return governanceKeywords.some(keyword => text.includes(keyword))
  }
  
  private calculateCrossReferenceScore(question: Question): number {
    const hasArticleReferences = this.countArticleReferences(question)
    const hasCaseReferences = this.countCaseReferences(question)
    const hasActReferences = this.countActReferences(question)
    
    const totalReferences = hasArticleReferences + hasCaseReferences + hasActReferences
    
    if (totalReferences === 0) return 20
    if (totalReferences <= 2) return 40
    if (totalReferences <= 4) return 60
    return 80
  }
  
  private countArticleReferences(question: Question): number {
    const text = question.questionText + ' ' + question.explanation.conceptClarity
    const articleMatches = text.match(/article\s+\d+/gi) || []
    return Math.min(articleMatches.length, 5) // Cap at 5 for scoring
  }
  
  private countCaseReferences(question: Question): number {
    const caseKeywords = ['case', 'vs', 'judgment', 'ruling', 'decision']
    const text = question.questionText.toLowerCase() + ' ' + question.explanation.conceptClarity.toLowerCase()
    return caseKeywords.filter(keyword => text.includes(keyword)).length
  }
  
  private countActReferences(question: Question): number {
    const actKeywords = ['act', 'statute', 'law', 'code', 'ordinance']
    const text = question.questionText.toLowerCase() + ' ' + question.explanation.conceptClarity.toLowerCase()
    return actKeywords.filter(keyword => text.includes(keyword)).length
  }
  
  // Utility methods for difficulty adjustment
  public adjustDifficultyForTarget(question: Question, targetDifficulty: DifficultyLevel): Question {
    const currentDifficulty = this.calculateDifficulty(question)
    
    if (currentDifficulty === targetDifficulty) {
      return question
    }
    
    const adjustedQuestion = { ...question }
    
    if (this.shouldIncreaseDifficulty(currentDifficulty, targetDifficulty)) {
      adjustedQuestion.questionText = this.makeQuestionHarder(adjustedQuestion.questionText)
      adjustedQuestion.conceptsTested = [...adjustedQuestion.conceptsTested, 'advanced application']
      adjustedQuestion.timeToSolve = Math.min(adjustedQuestion.timeToSolve + 30, 180)
    } else {
      adjustedQuestion.questionText = this.makeQuestionEasier(adjustedQuestion.questionText)
      adjustedQuestion.timeToSolve = Math.max(adjustedQuestion.timeToSolve - 20, 30)
    }
    
    return adjustedQuestion
  }
  
  private shouldIncreaseDifficulty(current: DifficultyLevel, target: DifficultyLevel): boolean {
    const levels = { easy: 1, medium: 2, hard: 3 }
    return levels[current] < levels[target]
  }
  
  private makeQuestionHarder(questionText: string): string {
    const harderPhrases = [
      'Critically analyze',
      'Evaluate in the context of',
      'Examine the implications of',
      'Compare and contrast'
    ]
    
    const randomPhrase = harderPhrases[Math.floor(Math.random() * harderPhrases.length)]
    return questionText.replace(/^(Which|What|How|Identify)/, randomPhrase)
  }
  
  private makeQuestionEasier(questionText: string): string {
    const easierPhrases = [
      'Which of the following',
      'What is',
      'Identify the',
      'Select the correct'
    ]
    
    const randomPhrase = easierPhrases[Math.floor(Math.random() * easierPhrases.length)]
    return questionText.replace(/^(Critically analyze|Evaluate|Examine|Compare).*?(?=\s)/, randomPhrase)
  }
  
  // Diagnostic methods
  public getDifficultyBreakdown(question: Question): Record<string, number> {
    const factors = this.analyzeDifficultyFactors(question)
    return {
      'Concept Count': factors.conceptCount,
      'Cognitive Level': factors.cognitiveLevel,
      'Question Type': factors.questionTypeComplexity,
      'Time Requirement': factors.timeRequirement,
      'Subject Integration': factors.subjectIntegration,
      'Vocabulary': factors.vocabularyComplexity,
      'UPSC Pattern': factors.upscPatternAlignment,
      'Cross References': factors.crossReferenceRequirement
    }
  }
}