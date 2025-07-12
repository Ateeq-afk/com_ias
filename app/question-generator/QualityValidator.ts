import { Question, QualityValidator, ValidationResult } from './types'

export class UPSCQualityValidator implements QualityValidator {
  
  validateQuestion(question: Question): ValidationResult {
    const issues: string[] = []
    const suggestions: string[] = []
    let qualityScore = 100
    
    // Basic validation
    const basicValidation = this.performBasicValidation(question)
    issues.push(...basicValidation.issues)
    suggestions.push(...basicValidation.suggestions)
    qualityScore -= basicValidation.penaltyScore
    
    // Content validation
    const contentValidation = this.performContentValidation(question)
    issues.push(...contentValidation.issues)
    suggestions.push(...contentValidation.suggestions)
    qualityScore -= contentValidation.penaltyScore
    
    // UPSC-specific validation
    const upscValidation = this.performUPSCValidation(question)
    issues.push(...upscValidation.issues)
    suggestions.push(...upscValidation.suggestions)
    qualityScore -= upscValidation.penaltyScore
    
    // Type-specific validation
    const typeValidation = this.performTypeSpecificValidation(question)
    issues.push(...typeValidation.issues)
    suggestions.push(...typeValidation.suggestions)
    qualityScore -= typeValidation.penaltyScore
    
    const factualAccuracy = this.checkFactualAccuracy(question)
    const ambiguityFree = this.detectAmbiguity(question)
    const difficultyAppropriate = this.verifyDifficulty(question)
    
    if (!factualAccuracy.isAccurate) {
      issues.push(...factualAccuracy.issues)
      qualityScore -= 25
    }
    
    if (ambiguityFree.length > 0) {
      issues.push(...ambiguityFree)
      qualityScore -= 15
    }
    
    if (!difficultyAppropriate) {
      issues.push('Difficulty level inappropriate for question complexity')
      qualityScore -= 10
    }
    
    const finalScore = Math.max(0, qualityScore)
    
    return {
      isValid: issues.length === 0,
      qualityScore: finalScore,
      issues: [...new Set(issues)], // Remove duplicates
      suggestions: [...new Set(suggestions)],
      factualAccuracy: factualAccuracy.isAccurate,
      difficultyAppropriate,
      ambiguityFree: ambiguityFree.length === 0
    }
  }
  
  checkFactualAccuracy(question: Question): { isAccurate: boolean, issues: string[] } {
    const issues: string[] = []
    let isAccurate = true
    
    // Check for basic factual requirements
    if (!question.baseFact || !question.subject || !question.topic) {
      issues.push('Missing basic factual information (baseFact, subject, or topic)')
      isAccurate = false
    }
    
    // Check constitutional accuracy
    const constitutionalCheck = this.checkConstitutionalAccuracy(question)
    if (!constitutionalCheck.isAccurate) {
      issues.push(...constitutionalCheck.issues)
      isAccurate = false
    }
    
    // Check historical accuracy
    const historicalCheck = this.checkHistoricalAccuracy(question)
    if (!historicalCheck.isAccurate) {
      issues.push(...historicalCheck.issues)
      isAccurate = false
    }
    
    // Check institutional accuracy
    const institutionalCheck = this.checkInstitutionalAccuracy(question)
    if (!institutionalCheck.isAccurate) {
      issues.push(...institutionalCheck.issues)
      isAccurate = false
    }
    
    return { isAccurate, issues }
  }
  
  detectAmbiguity(question: Question): string[] {
    const ambiguities: string[] = []
    const text = question.questionText.toLowerCase()
    
    // Check for ambiguous language
    const ambiguousWords = [
      'some', 'many', 'often', 'usually', 'generally', 'typically',
      'probably', 'possibly', 'might', 'could', 'sometimes'
    ]
    
    ambiguousWords.forEach(word => {
      if (text.includes(word)) {
        ambiguities.push(`Ambiguous language detected: "${word}"`)
      }
    })
    
    // Check for unclear references
    const unclearReferences = ['it', 'this', 'that', 'these', 'those']
    unclearReferences.forEach(ref => {
      const regex = new RegExp(`\\b${ref}\\b`, 'g')
      const matches = text.match(regex)
      if (matches && matches.length > 2) {
        ambiguities.push(`Excessive use of unclear reference: "${ref}"`)
      }
    })
    
    // Check for multiple interpretations
    if (this.hasMultipleInterpretations(question)) {
      ambiguities.push('Question allows multiple valid interpretations')
    }
    
    // Check for incomplete information
    if (this.hasIncompleteInformation(question)) {
      ambiguities.push('Question lacks sufficient information for definitive answer')
    }
    
    return ambiguities
  }
  
  verifyDifficulty(question: Question): boolean {
    const difficultyFactors = this.analyzeDifficultyFactors(question)
    const expectedScore = this.getExpectedDifficultyScore(question.difficulty)
    const actualScore = this.calculateActualDifficultyScore(difficultyFactors)
    
    // Allow 20% tolerance
    const tolerance = expectedScore * 0.2
    return Math.abs(actualScore - expectedScore) <= tolerance
  }
  
  calculateQualityScore(question: Question): number {
    const validation = this.validateQuestion(question)
    return validation.qualityScore
  }
  
  private performBasicValidation(question: Question): { issues: string[], suggestions: string[], penaltyScore: number } {
    const issues: string[] = []
    const suggestions: string[] = []
    let penaltyScore = 0
    
    // Question text validation
    if (!question.questionText || question.questionText.length < 10) {
      issues.push('Question text too short')
      suggestions.push('Provide meaningful question text (minimum 10 characters)')
      penaltyScore += 20
    }
    
    if (question.questionText && question.questionText.length > 500) {
      issues.push('Question text too long')
      suggestions.push('Keep question text concise (maximum 500 characters)')
      penaltyScore += 10
    }
    
    // ID validation
    if (!question.id) {
      issues.push('Missing question ID')
      suggestions.push('Provide unique question identifier')
      penaltyScore += 5
    }
    
    // Type validation
    if (!question.type) {
      issues.push('Missing question type')
      suggestions.push('Specify valid question type')
      penaltyScore += 15
    }
    
    // Difficulty validation
    if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
      issues.push('Invalid difficulty level')
      suggestions.push('Use valid difficulty: easy, medium, or hard')
      penaltyScore += 10
    }
    
    // Time validation
    if (!question.timeToSolve || question.timeToSolve < 15 || question.timeToSolve > 300) {
      issues.push('Invalid time to solve')
      suggestions.push('Set realistic time between 15-300 seconds')
      penaltyScore += 5
    }
    
    // Marks validation
    if (!question.marks || question.marks < 1 || question.marks > 10) {
      issues.push('Invalid marks allocation')
      suggestions.push('Set appropriate marks between 1-10')
      penaltyScore += 5
    }
    
    return { issues, suggestions, penaltyScore }
  }
  
  private performContentValidation(question: Question): { issues: string[], suggestions: string[], penaltyScore: number } {
    const issues: string[] = []
    const suggestions: string[] = []
    let penaltyScore = 0
    
    // Explanation validation
    if (!question.explanation) {
      issues.push('Missing explanation')
      suggestions.push('Provide comprehensive explanation')
      penaltyScore += 20
    } else {
      if (!question.explanation.correctAnswer) {
        issues.push('Missing correct answer in explanation')
        suggestions.push('Specify the correct answer')
        penaltyScore += 10
      }
      
      if (!question.explanation.whyCorrect) {
        issues.push('Missing explanation for correct answer')
        suggestions.push('Explain why the answer is correct')
        penaltyScore += 10
      }
      
      if (!question.explanation.conceptClarity) {
        issues.push('Missing concept clarity explanation')
        suggestions.push('Provide clear concept explanation')
        penaltyScore += 5
      }
    }
    
    // Concepts validation
    if (!question.conceptsTested || question.conceptsTested.length === 0) {
      issues.push('No concepts tested specified')
      suggestions.push('List the concepts being tested')
      penaltyScore += 10
    }
    
    // Tags validation
    if (!question.tags || question.tags.length === 0) {
      issues.push('No tags specified')
      suggestions.push('Add relevant tags for categorization')
      penaltyScore += 5
    }
    
    return { issues, suggestions, penaltyScore }
  }
  
  private performUPSCValidation(question: Question): { issues: string[], suggestions: string[], penaltyScore: number } {
    const issues: string[] = []
    const suggestions: string[] = []
    let penaltyScore = 0
    
    // UPSC relevance check
    if (!this.isUPSCRelevant(question)) {
      issues.push('Question not relevant to UPSC syllabus')
      suggestions.push('Ensure question aligns with UPSC syllabus and pattern')
      penaltyScore += 15
    }
    
    // Subject appropriateness
    if (!this.isSubjectAppropriate(question)) {
      issues.push('Content not appropriate for specified subject')
      suggestions.push('Review subject classification and content alignment')
      penaltyScore += 10
    }
    
    // Exam pattern compliance
    if (!this.followsUPSCPattern(question)) {
      issues.push('Does not follow UPSC question patterns')
      suggestions.push('Adapt question to standard UPSC formats and language')
      penaltyScore += 10
    }
    
    // Current affairs integration
    if (this.shouldHaveCurrentAffairsLink(question) && !this.hasCurrentAffairsLink(question)) {
      issues.push('Missing contemporary relevance')
      suggestions.push('Add current affairs or contemporary application angle')
      penaltyScore += 5
    }
    
    return { issues, suggestions, penaltyScore }
  }
  
  private performTypeSpecificValidation(question: Question): { issues: string[], suggestions: string[], penaltyScore: number } {
    const issues: string[] = []
    const suggestions: string[] = []
    let penaltyScore = 0
    
    switch (question.type) {
      case 'SingleCorrectMCQ':
        const singleValidation = this.validateSingleCorrectMCQ(question)
        issues.push(...singleValidation.issues)
        suggestions.push(...singleValidation.suggestions)
        penaltyScore += singleValidation.penaltyScore
        break
        
      case 'MultipleCorrectMCQ':
        const multipleValidation = this.validateMultipleCorrectMCQ(question)
        issues.push(...multipleValidation.issues)
        suggestions.push(...multipleValidation.suggestions)
        penaltyScore += multipleValidation.penaltyScore
        break
        
      case 'StatementBased':
        const statementValidation = this.validateStatementBased(question)
        issues.push(...statementValidation.issues)
        suggestions.push(...statementValidation.suggestions)
        penaltyScore += statementValidation.penaltyScore
        break
        
      // Add other type validations as needed
    }
    
    return { issues, suggestions, penaltyScore }
  }
  
  private checkConstitutionalAccuracy(question: Question): { isAccurate: boolean, issues: string[] } {
    const issues: string[] = []
    let isAccurate = true
    
    const text = question.questionText.toLowerCase() + ' ' + 
                (question.explanation?.conceptClarity || '').toLowerCase()
    
    // Check for article references
    const articleMatches = text.match(/article\s+(\d+)/g)
    if (articleMatches) {
      articleMatches.forEach(match => {
        const articleNum = parseInt(match.replace('article ', ''))
        if (!this.isValidArticleNumber(articleNum)) {
          issues.push(`Invalid article number: ${articleNum}`)
          isAccurate = false
        }
      })
    }
    
    // Check for amendment references
    const amendmentMatches = text.match(/(\d+)(st|nd|rd|th)\s+amendment/g)
    if (amendmentMatches) {
      amendmentMatches.forEach(match => {
        const amendmentNum = parseInt(match.replace(/\D/g, ''))
        if (!this.isValidAmendmentNumber(amendmentNum)) {
          issues.push(`Invalid amendment number: ${amendmentNum}`)
          isAccurate = false
        }
      })
    }
    
    return { isAccurate, issues }
  }
  
  private checkHistoricalAccuracy(question: Question): { isAccurate: boolean, issues: string[] } {
    const issues: string[] = []
    let isAccurate = true
    
    const text = question.questionText.toLowerCase()
    
    // Check for date references
    const yearMatches = text.match(/\b(19|20)\d{2}\b/g)
    if (yearMatches) {
      yearMatches.forEach(year => {
        const yearNum = parseInt(year)
        if (yearNum < 1947 || yearNum > new Date().getFullYear()) {
          // Only flag if it's clearly wrong for Indian constitutional context
          if (text.includes('constitution') && yearNum < 1950) {
            issues.push(`Constitutional reference with pre-1950 date: ${year}`)
            isAccurate = false
          }
        }
      })
    }
    
    return { isAccurate, issues }
  }
  
  private checkInstitutionalAccuracy(question: Question): { isAccurate: boolean, issues: string[] } {
    const issues: string[] = []
    let isAccurate = true
    
    // Check for institutional power references
    const text = question.questionText.toLowerCase()
    
    // Basic institutional checks
    if (text.includes('president') && text.includes('dissolve parliament')) {
      issues.push('President cannot dissolve Parliament directly')
      isAccurate = false
    }
    
    if (text.includes('prime minister') && text.includes('constitutional head')) {
      issues.push('Prime Minister is not the constitutional head of state')
      isAccurate = false
    }
    
    return { isAccurate, issues }
  }
  
  private hasMultipleInterpretations(question: Question): boolean {
    const text = question.questionText.toLowerCase()
    
    // Check for ambiguous question stems
    const ambiguousStems = [
      'which is better',
      'which is more important',
      'what should be done'
    ]
    
    return ambiguousStems.some(stem => text.includes(stem))
  }
  
  private hasIncompleteInformation(question: Question): boolean {
    const text = question.questionText.toLowerCase()
    
    // Check for incomplete context
    if (text.includes('the following') && !question.data) {
      return true
    }
    
    if (text.includes('above') && !text.includes('statement') && !text.includes('passage')) {
      return true
    }
    
    return false
  }
  
  private analyzeDifficultyFactors(question: Question): any {
    return {
      conceptCount: question.conceptsTested.length,
      timeToSolve: question.timeToSolve,
      questionType: question.type,
      vocabularyComplexity: this.calculateVocabularyComplexity(question.questionText)
    }
  }
  
  private getExpectedDifficultyScore(difficulty: string): number {
    return { easy: 35, medium: 55, hard: 80 }[difficulty] || 50
  }
  
  private calculateActualDifficultyScore(factors: any): number {
    let score = 0
    
    // Concept count contribution
    score += Math.min(factors.conceptCount * 8, 30)
    
    // Time contribution
    score += Math.min(factors.timeToSolve / 3, 30)
    
    // Type complexity
    const typeScores = {
      'SingleCorrectMCQ': 15,
      'MultipleCorrectMCQ': 25,
      'StatementBased': 30,
      'AssertionReasoning': 35,
      'CaseStudyBased': 45,
      'DataBased': 40
    }
    score += typeScores[factors.questionType] || 25
    
    // Vocabulary complexity
    score += factors.vocabularyComplexity * 0.3
    
    return Math.min(score, 100)
  }
  
  private calculateVocabularyComplexity(text: string): number {
    const words = text.split(/\s+/)
    const complexWords = words.filter(word => word.length > 8).length
    return (complexWords / words.length) * 100
  }
  
  private isUPSCRelevant(question: Question): boolean {
    const upscSubjects = [
      'History', 'Geography', 'Polity', 'Economy', 'Environment',
      'Science & Technology', 'Current Affairs', 'Ethics',
      'Art & Culture', 'International Relations'
    ]
    
    return upscSubjects.includes(question.subject)
  }
  
  private isSubjectAppropriate(question: Question): boolean {
    const text = question.questionText.toLowerCase()
    const subject = question.subject.toLowerCase()
    
    const subjectKeywords = {
      'polity': ['constitution', 'parliament', 'court', 'president', 'article'],
      'history': ['ancient', 'medieval', 'modern', 'independence', 'colonial'],
      'geography': ['climate', 'river', 'mountain', 'plateau', 'monsoon'],
      'economy': ['gdp', 'inflation', 'budget', 'trade', 'industrial'],
      'environment': ['ecosystem', 'pollution', 'conservation', 'biodiversity']
    }
    
    const keywords = subjectKeywords[subject] || []
    return keywords.some(keyword => text.includes(keyword))
  }
  
  private followsUPSCPattern(question: Question): boolean {
    const text = question.questionText.toLowerCase()
    
    const upscPatterns = [
      /^which of the following/,
      /^consider the following/,
      /^with reference to/,
      /select.*correct/,
      /identify.*correct/
    ]
    
    return upscPatterns.some(pattern => pattern.test(text))
  }
  
  private shouldHaveCurrentAffairsLink(question: Question): boolean {
    return ['Current Affairs', 'Environment', 'Science & Technology'].includes(question.subject)
  }
  
  private hasCurrentAffairsLink(question: Question): boolean {
    const text = question.questionText.toLowerCase()
    const currentKeywords = ['recent', 'current', 'contemporary', '2020', '2021', '2022', '2023', '2024']
    return currentKeywords.some(keyword => text.includes(keyword))
  }
  
  private validateSingleCorrectMCQ(question: Question): { issues: string[], suggestions: string[], penaltyScore: number } {
    const issues: string[] = []
    const suggestions: string[] = []
    let penaltyScore = 0
    
    const data = question.data.singleCorrect
    if (!data) {
      issues.push('Missing single correct MCQ data')
      suggestions.push('Provide options with one correct answer')
      return { issues, suggestions, penaltyScore: 30 }
    }
    
    if (!data.options || data.options.length !== 4) {
      issues.push('Must have exactly 4 options')
      suggestions.push('Provide exactly 4 multiple choice options')
      penaltyScore += 15
    }
    
    const correctCount = data.options?.filter(opt => opt.isCorrect).length || 0
    if (correctCount !== 1) {
      issues.push('Must have exactly 1 correct option')
      suggestions.push('Mark exactly one option as correct')
      penaltyScore += 20
    }
    
    return { issues, suggestions, penaltyScore }
  }
  
  private validateMultipleCorrectMCQ(question: Question): { issues: string[], suggestions: string[], penaltyScore: number } {
    const issues: string[] = []
    const suggestions: string[] = []
    let penaltyScore = 0
    
    const data = question.data.multipleCorrect
    if (!data) {
      issues.push('Missing multiple correct MCQ data')
      return { issues, suggestions, penaltyScore: 30 }
    }
    
    const correctCount = data.options?.filter(opt => opt.isCorrect).length || 0
    if (correctCount < 2 || correctCount > 3) {
      issues.push('Must have 2-3 correct options')
      suggestions.push('Mark 2-3 options as correct for multiple correct MCQ')
      penaltyScore += 15
    }
    
    return { issues, suggestions, penaltyScore }
  }
  
  private validateStatementBased(question: Question): { issues: string[], suggestions: string[], penaltyScore: number } {
    const issues: string[] = []
    const suggestions: string[] = []
    let penaltyScore = 0
    
    const data = question.data.statementBased
    if (!data) {
      issues.push('Missing statement based data')
      return { issues, suggestions, penaltyScore: 30 }
    }
    
    if (!data.statements || data.statements.length < 2) {
      issues.push('Must have at least 2 statements')
      suggestions.push('Provide at least 2 statements for evaluation')
      penaltyScore += 15
    }
    
    return { issues, suggestions, penaltyScore }
  }
  
  private isValidArticleNumber(articleNum: number): boolean {
    // Basic validation - Indian Constitution has articles 1-395 (with some gaps)
    return articleNum >= 1 && articleNum <= 395
  }
  
  private isValidAmendmentNumber(amendmentNum: number): boolean {
    // As of 2024, there have been 105+ constitutional amendments
    return amendmentNum >= 1 && amendmentNum <= 110
  }
}