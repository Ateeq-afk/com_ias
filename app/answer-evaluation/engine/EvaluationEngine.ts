import { 
  AnswerInput, 
  EvaluationScore, 
  DetailedFeedback, 
  Question,
  ContentScore,
  StructureScore,
  AnalyticalScore,
  InnovationScore,
  LanguageScore,
  WordLimitScore,
  GrammarError,
  SpecificFeedback,
  ImprovementSuggestion,
  ModelComparison,
  UPSCAnswerAnalysis
} from '../types'

export class UPSCEvaluationEngine {
  private upscKeywords: Record<string, string[]> = {
    'GS1': ['ancient', 'medieval', 'modern', 'culture', 'heritage', 'civilization', 'dynasty', 'empire', 'colonial', 'freedom struggle'],
    'GS2': ['constitution', 'governance', 'polity', 'parliament', 'judiciary', 'federalism', 'rights', 'directive principles', 'amendment', 'separation of powers'],
    'GS3': ['economy', 'development', 'agriculture', 'industry', 'services', 'trade', 'fiscal', 'monetary', 'GDP', 'inflation', 'employment'],
    'GS4': ['ethics', 'integrity', 'probity', 'moral', 'values', 'virtue', 'character', 'accountability', 'transparency', 'dilemma']
  }

  private scoringPatterns = {
    introduction: /^(introduction|context|background|overview)/i,
    conclusion: /(conclusion|way forward|suggests?|recommend)/i,
    examples: /(for example|for instance|case study|illustration)/i,
    analysis: /(however|therefore|consequently|thus|hence|analysis)/i,
    currentAffairs: /(recent|2024|2025|current|latest|contemporary)/i
  }

  async evaluateAnswer(question: Question, answer: AnswerInput): Promise<{
    score: EvaluationScore,
    feedback: DetailedFeedback,
    upscAnalysis: UPSCAnswerAnalysis
  }> {
    const contentScore = this.evaluateContent(question, answer)
    const structureScore = this.evaluateStructure(answer)
    const analyticalScore = this.evaluateAnalyticalDepth(answer)
    const innovationScore = this.evaluateInnovation(answer)
    const languageScore = this.evaluateLanguage(answer)
    const wordLimitScore = this.evaluateWordLimit(question, answer)

    const totalScore = 
      contentScore.score + 
      structureScore.score + 
      analyticalScore.score + 
      innovationScore.score + 
      languageScore.score + 
      wordLimitScore.score

    const evaluationScore: EvaluationScore = {
      total: totalScore,
      maxTotal: 100,
      breakdown: {
        contentRelevance: contentScore,
        structurePresentation: structureScore,
        analyticalDepth: analyticalScore,
        innovation: innovationScore,
        language: languageScore,
        wordLimit: wordLimitScore
      }
    }

    const feedback = this.generateDetailedFeedback(evaluationScore, question, answer)
    const upscAnalysis = this.analyzeUPSCPattern(question, answer)

    return { score: evaluationScore, feedback, upscAnalysis }
  }

  private evaluateContent(question: Question, answer: AnswerInput): ContentScore {
    const content = answer.content.toLowerCase()
    const subjectKeywords = this.upscKeywords[question.subject] || []
    const questionKeywords = question.keywords.map(k => k.toLowerCase())
    const allRelevantKeywords = [...subjectKeywords, ...questionKeywords]

    // Keyword Coverage Analysis
    const coveredKeywords = allRelevantKeywords.filter(keyword => 
      content.includes(keyword.toLowerCase())
    )
    const missedKeywords = allRelevantKeywords.filter(keyword => 
      !content.includes(keyword.toLowerCase())
    )
    
    const keywordCoverage = (coveredKeywords.length / allRelevantKeywords.length) * 100

    // Concept Accuracy (simplified - in real implementation would use NLP)
    const conceptAccuracy = this.calculateConceptAccuracy(content, question)

    // Facts and Figures Detection
    const factsAndFigures = this.detectFactsAndFigures(content)

    // Current Affairs Integration
    const currentAffairsIntegration = this.detectCurrentAffairs(content)

    const score = Math.round(
      (keywordCoverage * 0.4) + 
      (conceptAccuracy * 0.3) + 
      (factsAndFigures * 0.2) + 
      (currentAffairsIntegration * 0.1)
    ) * 0.25 // Scale to 25 points

    return {
      score: Math.min(score, 25),
      maxScore: 25,
      keywordCoverage,
      conceptAccuracy,
      factsAndFigures,
      currentAffairsIntegration,
      details: {
        coveredKeywords,
        missedKeywords,
        factualErrors: [], // Would be populated by fact-checking
        relevantCurrentAffairs: this.extractCurrentAffairs(content)
      }
    }
  }

  private evaluateStructure(answer: AnswerInput): StructureScore {
    const content = answer.content
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    
    // Introduction check
    const hasIntroduction = this.scoringPatterns.introduction.test(paragraphs[0] || '')
    const introductionScore = hasIntroduction ? 5 : 2

    // Conclusion check
    const lastParagraph = paragraphs[paragraphs.length - 1] || ''
    const hasConclusion = this.scoringPatterns.conclusion.test(lastParagraph)
    const conclusionScore = hasConclusion ? 5 : 2

    // Logical flow (simplified heuristic)
    const logicalFlowScore = this.assessLogicalFlow(paragraphs)

    // Paragraph organization
    const organizationScore = this.assessParagraphOrganization(paragraphs)

    const totalScore = Math.round(
      (introductionScore + conclusionScore + logicalFlowScore + organizationScore) / 4 * 20
    )

    return {
      score: Math.min(totalScore, 20),
      maxScore: 20,
      introduction: introductionScore,
      logicalFlow: logicalFlowScore,
      paragraphOrganization: organizationScore,
      conclusion: conclusionScore,
      details: {
        hasIntroduction,
        hasConclusion,
        paragraphCount: paragraphs.length,
        transitionQuality: logicalFlowScore > 7 ? 'excellent' : 
                          logicalFlowScore > 5 ? 'good' : 
                          logicalFlowScore > 3 ? 'average' : 'poor'
      }
    }
  }

  private evaluateAnalyticalDepth(answer: AnswerInput): AnalyticalScore {
    const content = answer.content.toLowerCase()

    // Critical thinking indicators
    const criticalThinking = this.assessCriticalThinking(content)

    // Multiple perspectives
    const perspectives = this.countPerspectives(content)
    const multiplePerspectives = Math.min(perspectives * 2, 10)

    // Cause-effect analysis
    const causeEffectAnalysis = this.detectCauseEffectAnalysis(content)

    // Solutions provided
    const solutionsProvided = this.detectSolutions(content)

    const totalScore = Math.round(
      (criticalThinking + multiplePerspectives + causeEffectAnalysis + solutionsProvided) / 4
    )

    return {
      score: Math.min(totalScore, 20),
      maxScore: 20,
      criticalThinking,
      multiplePerspectives,
      causeEffectAnalysis,
      solutionsProvided,
      details: {
        perspectivesCount: perspectives,
        analysisDepth: totalScore > 15 ? 'deep' : totalScore > 10 ? 'moderate' : 'surface',
        solutionsPracticality: solutionsProvided > 7 ? 'excellent' : 
                              solutionsProvided > 5 ? 'good' : 
                              solutionsProvided > 3 ? 'average' : 'poor'
      }
    }
  }

  private evaluateInnovation(answer: AnswerInput): InnovationScore {
    const content = answer.content

    // Unique insights detection
    const uniqueInsights = this.detectUniqueInsights(content)

    // Case studies usage
    const caseStudies = this.detectCaseStudies(content)

    // Diagrams count
    const diagramsCount = answer.diagrams?.length || 0
    const diagramsScore = Math.min(diagramsCount * 2, 4)

    // Contemporary relevance
    const contemporaryRelevance = this.assessContemporaryRelevance(content)

    const totalScore = uniqueInsights + caseStudies + diagramsScore + contemporaryRelevance

    return {
      score: Math.min(totalScore, 15),
      maxScore: 15,
      uniqueInsights,
      caseStudies,
      diagrams: diagramsScore,
      contemporaryRelevance,
      details: {
        innovativePoints: this.extractInnovativePoints(content),
        caseStudiesUsed: this.extractCaseStudies(content),
        diagramsCount,
        uniquenessLevel: uniqueInsights > 3 ? 'highly_unique' : 
                        uniqueInsights > 1 ? 'somewhat_unique' : 'common'
      }
    }
  }

  private evaluateLanguage(answer: AnswerInput): LanguageScore {
    const content = answer.content

    // Grammar and spelling check (simplified)
    const grammarErrors = this.detectGrammarErrors(content)
    const grammarScore = Math.max(10 - grammarErrors.length, 0)

    // Clarity assessment
    const clarityScore = this.assessClarity(content)

    // Vocabulary level
    const vocabularyScore = this.assessVocabulary(content)

    // Technical terms usage
    const technicalTermsScore = this.assessTechnicalTerms(content)

    const totalScore = Math.round(
      (grammarScore + clarityScore + vocabularyScore + technicalTermsScore) / 4
    )

    return {
      score: Math.min(totalScore, 10),
      maxScore: 10,
      clarity: clarityScore,
      grammar: grammarScore,
      vocabulary: vocabularyScore,
      technicalTerms: technicalTermsScore,
      details: {
        grammarErrors: grammarErrors.slice(0, 5), // Show top 5 errors
        vocabularyLevel: vocabularyScore > 7 ? 'advanced' : 
                        vocabularyScore > 4 ? 'intermediate' : 'basic',
        clarityIssues: this.identifyClarityIssues(content)
      }
    }
  }

  private evaluateWordLimit(question: Question, answer: AnswerInput): WordLimitScore {
    const requiredWords = question.wordLimit
    const actualWords = answer.wordCount
    const difference = Math.abs(actualWords - requiredWords)
    const percentageDifference = (difference / requiredWords) * 100

    let adherenceScore = 10
    if (percentageDifference > 20) adherenceScore = 4
    else if (percentageDifference > 15) adherenceScore = 6
    else if (percentageDifference > 10) adherenceScore = 8
    else if (percentageDifference > 5) adherenceScore = 9

    // Efficiency bonus for concise yet comprehensive answers
    const efficiency = actualWords <= requiredWords ? 
      Math.min(10, 10 - (percentageDifference / 2)) : 
      Math.max(4, 10 - percentageDifference)

    const penalty = actualWords > requiredWords * 1.2 ? 2 : 0

    return {
      score: Math.max(adherenceScore - penalty, 0),
      maxScore: 10,
      adherence: adherenceScore,
      efficiency,
      details: {
        requiredWords,
        actualWords,
        penalty,
        efficiency: efficiency > 8 ? 'excellent' : 
                   efficiency > 6 ? 'good' : 
                   efficiency > 4 ? 'average' : 'poor'
      }
    }
  }

  // Helper methods for detailed analysis
  private calculateConceptAccuracy(content: string, question: Question): number {
    // Simplified concept accuracy - would use NLP in production
    const conceptWords = question.expectedPoints.join(' ').toLowerCase()
    const matchingConcepts = conceptWords.split(' ').filter(concept => 
      content.includes(concept)
    ).length
    return Math.min((matchingConcepts / question.expectedPoints.length) * 100, 100)
  }

  private detectFactsAndFigures(content: string): number {
    const numberPattern = /\b\d+(\.\d+)?(%|billion|million|thousand|crore|lakh)?\b/g
    const yearPattern = /\b(19|20)\d{2}\b/g
    const datePattern = /\b\d{1,2}(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\b/gi
    
    const numbers = content.match(numberPattern) || []
    const years = content.match(yearPattern) || []
    const dates = content.match(datePattern) || []
    
    const factCount = numbers.length + years.length + dates.length
    return Math.min(factCount * 2, 10)
  }

  private detectCurrentAffairs(content: string): number {
    const currentKeywords = ['2024', '2025', 'recent', 'latest', 'contemporary', 'current', 'ongoing']
    const matches = currentKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length
    return Math.min(matches * 2, 10)
  }

  private extractCurrentAffairs(content: string): string[] {
    // Simplified extraction - would use NLP to identify actual current affairs
    const sentences = content.split(/[.!?]+/)
    return sentences.filter(sentence => 
      this.scoringPatterns.currentAffairs.test(sentence)
    ).slice(0, 3)
  }

  private assessLogicalFlow(paragraphs: string[]): number {
    if (paragraphs.length < 2) return 3
    
    // Check for transition words and logical connectors
    const transitionWords = ['however', 'therefore', 'furthermore', 'moreover', 'consequently', 'thus', 'hence', 'additionally']
    let transitionCount = 0
    
    paragraphs.forEach(paragraph => {
      transitionWords.forEach(word => {
        if (paragraph.toLowerCase().includes(word)) transitionCount++
      })
    })
    
    return Math.min(transitionCount + 3, 10)
  }

  private assessParagraphOrganization(paragraphs: string[]): number {
    const idealParagraphs = paragraphs.length >= 3 && paragraphs.length <= 6
    const consistentLength = this.checkParagraphLengthConsistency(paragraphs)
    
    let score = 5
    if (idealParagraphs) score += 3
    if (consistentLength) score += 2
    
    return Math.min(score, 10)
  }

  private checkParagraphLengthConsistency(paragraphs: string[]): boolean {
    if (paragraphs.length < 2) return false
    
    const lengths = paragraphs.map(p => p.length)
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length
    const variance = lengths.reduce((acc, length) => acc + Math.pow(length - avgLength, 2), 0) / lengths.length
    
    return variance < avgLength * 0.5 // Low variance indicates consistency
  }

  private assessCriticalThinking(content: string): number {
    const criticalWords = ['analyze', 'evaluate', 'assess', 'critique', 'examine', 'question', 'challenge', 'implications']
    const matches = criticalWords.filter(word => 
      content.includes(word)
    ).length
    return Math.min(matches + 2, 10)
  }

  private countPerspectives(content: string): number {
    const perspectiveIndicators = ['on one hand', 'on the other hand', 'alternatively', 'from another perspective', 'different viewpoint', 'various stakeholders']
    return perspectiveIndicators.filter(indicator => 
      content.includes(indicator)
    ).length
  }

  private detectCauseEffectAnalysis(content: string): number {
    const causeEffectWords = ['because', 'due to', 'results in', 'leads to', 'causes', 'effects', 'impact', 'consequence']
    const matches = causeEffectWords.filter(word => 
      content.includes(word)
    ).length
    return Math.min(matches, 10)
  }

  private detectSolutions(content: string): number {
    const solutionWords = ['solution', 'recommend', 'suggest', 'propose', 'way forward', 'measures', 'steps', 'approach']
    const matches = solutionWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length
    return Math.min(matches * 1.5, 10)
  }

  private detectUniqueInsights(content: string): number {
    // Simplified - would use ML to detect truly unique insights
    const insightWords = ['insight', 'perspective', 'understanding', 'realization', 'observation']
    const matches = insightWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length
    return Math.min(matches, 5)
  }

  private detectCaseStudies(content: string): number {
    const caseStudyPatterns = ['case study', 'for example', 'for instance', 'illustration', 'example of']
    const matches = caseStudyPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern)
    ).length
    return Math.min(matches * 2, 5)
  }

  private assessContemporaryRelevance(content: string): number {
    const relevanceKeywords = ['2024', '2025', 'current', 'recent', 'ongoing', 'contemporary']
    const matches = relevanceKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length
    return Math.min(matches, 5)
  }

  private extractInnovativePoints(content: string): string[] {
    // Simplified extraction
    const sentences = content.split(/[.!?]+/)
    return sentences.filter(sentence => 
      sentence.toLowerCase().includes('innovative') || 
      sentence.toLowerCase().includes('unique') ||
      sentence.toLowerCase().includes('novel')
    ).slice(0, 3)
  }

  private extractCaseStudies(content: string): string[] {
    const sentences = content.split(/[.!?]+/)
    return sentences.filter(sentence => 
      sentence.toLowerCase().includes('case study') ||
      sentence.toLowerCase().includes('for example') ||
      sentence.toLowerCase().includes('for instance')
    ).slice(0, 3)
  }

  private detectGrammarErrors(content: string): GrammarError[] {
    // Simplified grammar checking - would use proper grammar checking API
    const errors: GrammarError[] = []
    
    // Check for common errors
    const commonErrors = [
      { pattern: /\bi\b/g, suggestion: 'I', type: 'grammar' as const },
      { pattern: /their\s+are\b/gi, suggestion: 'there are', type: 'grammar' as const },
      { pattern: /its\s+a\b/gi, suggestion: "it's a", type: 'grammar' as const }
    ]
    
    commonErrors.forEach(errorPattern => {
      const matches = content.match(errorPattern.pattern)
      if (matches) {
        matches.forEach(match => {
          errors.push({
            text: match,
            type: errorPattern.type,
            suggestion: errorPattern.suggestion,
            severity: 'medium'
          })
        })
      }
    })
    
    return errors.slice(0, 10) // Limit to 10 errors
  }

  private assessClarity(content: string): number {
    const sentences = content.split(/[.!?]+/)
    const avgSentenceLength = sentences.reduce((acc, sentence) => acc + sentence.length, 0) / sentences.length
    
    // Optimal sentence length is around 15-20 words
    const optimalLength = avgSentenceLength > 80 && avgSentenceLength < 120
    const clarityScore = optimalLength ? 8 : 6
    
    // Check for clarity indicators
    const clarityWords = ['clearly', 'evidently', 'obviously', 'specifically', 'precisely']
    const clarityBonus = clarityWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length
    
    return Math.min(clarityScore + clarityBonus, 10)
  }

  private assessVocabulary(content: string): number {
    const words = content.toLowerCase().split(/\s+/)
    const uniqueWords = new Set(words)
    const vocabularyRichness = uniqueWords.size / words.length
    
    // Advanced vocabulary indicators
    const advancedWords = ['comprehensive', 'substantial', 'significant', 'considerable', 'evaluate', 'analyze', 'synthesize']
    const advancedWordCount = advancedWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length
    
    const baseScore = vocabularyRichness * 15 // Scale richness
    const advancedBonus = advancedWordCount * 0.5
    
    return Math.min(baseScore + advancedBonus, 10)
  }

  private assessTechnicalTerms(content: string): number {
    // Subject-specific technical terms would be loaded based on question subject
    const technicalTerms = ['constitutional', 'fundamental', 'directive', 'parliamentary', 'judicial', 'executive', 'legislative']
    const matches = technicalTerms.filter(term => 
      content.toLowerCase().includes(term)
    ).length
    return Math.min(matches, 10)
  }

  private identifyClarityIssues(content: string): string[] {
    const issues: string[] = []
    const sentences = content.split(/[.!?]+/)
    
    sentences.forEach((sentence, index) => {
      if (sentence.length > 150) {
        issues.push(`Sentence ${index + 1} is too long. Consider breaking it down.`)
      }
      if (sentence.split(',').length > 4) {
        issues.push(`Sentence ${index + 1} has too many commas. Simplify structure.`)
      }
    })
    
    return issues.slice(0, 3)
  }

  private generateDetailedFeedback(score: EvaluationScore, question: Question, answer: AnswerInput): DetailedFeedback {
    const overall = this.generateOverallFeedback(score)
    const specific = this.generateSpecificFeedback(score, answer)
    const suggestions = this.generateImprovementSuggestions(score, question)
    const modelComparison = this.generateModelComparison(question, answer, score)

    return { overall, specific, suggestions, modelComparison }
  }

  private generateOverallFeedback(score: EvaluationScore) {
    const percentage = (score.total / score.maxTotal) * 100
    let grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'
    
    if (percentage >= 90) grade = 'A+'
    else if (percentage >= 85) grade = 'A'
    else if (percentage >= 80) grade = 'B+'
    else if (percentage >= 75) grade = 'B'
    else if (percentage >= 70) grade = 'C+'
    else if (percentage >= 60) grade = 'C'
    else if (percentage >= 50) grade = 'D'
    else grade = 'F'

    const strengths: string[] = []
    const weaknesses: string[] = []

    // Identify strengths and weaknesses based on scores
    if (score.breakdown.contentRelevance.score >= 20) strengths.push('Strong content knowledge')
    else weaknesses.push('Need to improve content relevance')

    if (score.breakdown.structurePresentation.score >= 16) strengths.push('Well-structured answer')
    else weaknesses.push('Improve answer structure')

    if (score.breakdown.analyticalDepth.score >= 16) strengths.push('Good analytical thinking')
    else weaknesses.push('Develop analytical depth')

    return {
      strengths,
      weaknesses,
      grade,
      percentile: Math.min(percentage + 10, 95), // Simplified percentile calculation
      predictedExamScore: Math.round(percentage * 2) // Scale to 200 marks
    }
  }

  private generateSpecificFeedback(score: EvaluationScore, answer: AnswerInput): SpecificFeedback[] {
    const feedback: SpecificFeedback[] = []
    
    // Content feedback
    if (score.breakdown.contentRelevance.keywordCoverage < 70) {
      feedback.push({
        text: `Keyword coverage is ${score.breakdown.contentRelevance.keywordCoverage.toFixed(1)}%. Include more relevant terms.`,
        type: 'negative',
        category: 'content',
        priority: 'high'
      })
    }

    // Structure feedback
    if (!score.breakdown.structurePresentation.details.hasIntroduction) {
      feedback.push({
        text: 'Add a clear introduction to set context for your answer.',
        type: 'suggestion',
        category: 'structure',
        priority: 'medium'
      })
    }

    if (!score.breakdown.structurePresentation.details.hasConclusion) {
      feedback.push({
        text: 'Include a strong conclusion with way forward or recommendations.',
        type: 'suggestion',
        category: 'structure',
        priority: 'medium'
      })
    }

    // Language feedback
    if (score.breakdown.language.details.grammarErrors.length > 0) {
      feedback.push({
        text: `Found ${score.breakdown.language.details.grammarErrors.length} grammar issues. Review for accuracy.`,
        type: 'warning',
        category: 'language',
        priority: 'medium'
      })
    }

    return feedback
  }

  private generateImprovementSuggestions(score: EvaluationScore, question: Question): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = []

    if (score.breakdown.contentRelevance.score < 18) {
      suggestions.push({
        id: 'content-improvement',
        title: 'Enhance Content Knowledge',
        description: 'Focus on covering more relevant keywords and concepts for this topic.',
        example: 'Include specific facts, figures, and recent developments related to the question.',
        category: 'short_term',
        effort: 'medium',
        impact: 'high',
        resources: [
          {
            type: 'lesson',
            title: `${question.subject} - ${question.topic}`,
            url: `/lessons/${question.subject.toLowerCase()}/${question.topic}`,
            estimatedTime: 45
          }
        ]
      })
    }

    if (score.breakdown.analyticalDepth.score < 15) {
      suggestions.push({
        id: 'analytical-improvement',
        title: 'Develop Analytical Skills',
        description: 'Practice analyzing issues from multiple perspectives and providing balanced viewpoints.',
        example: 'Use "On one hand... On the other hand..." structure to show different perspectives.',
        category: 'long_term',
        effort: 'high',
        impact: 'high',
        resources: [
          {
            type: 'practice',
            title: 'Analytical Writing Practice',
            url: '/practice/analytical-writing',
            estimatedTime: 60
          }
        ]
      })
    }

    return suggestions
  }

  private generateModelComparison(question: Question, answer: AnswerInput, score: EvaluationScore): ModelComparison {
    // This would fetch actual model answers in production
    const modelAnswer = this.getModelAnswer(question)
    
    return {
      modelAnswer: modelAnswer.content,
      similarities: ['Good structure with clear paragraphs', 'Relevant examples provided'],
      differences: ['Model answer includes more current affairs', 'Better conclusion with specific recommendations'],
      scoreDifference: 85 - score.total, // Assuming model answer scores 85
      improvementAreas: ['Add more contemporary examples', 'Strengthen conclusion', 'Include policy recommendations']
    }
  }

  private getModelAnswer(question: Question): { content: string } {
    // Simplified model answer - would fetch from database in production
    return {
      content: `Model answer for ${question.text}. This would be a comprehensive answer covering all aspects with proper structure, relevant examples, and contemporary relevance.`
    }
  }

  private analyzeUPSCPattern(question: Question, answer: AnswerInput): UPSCAnswerAnalysis {
    return {
      preferredPatterns: [
        {
          pattern: 'Introduction-Body-Conclusion',
          frequency: 85,
          effectiveness: 90,
          examinerPreference: 95,
          examples: ['Start with context', 'Develop arguments', 'End with way forward']
        }
      ],
      scoringKeywords: this.upscKeywords[question.subject] || [],
      examinerFriendlyFormats: [
        'Use clear headings and subheadings',
        'Include bullet points for clarity',
        'Provide specific examples',
        'End with actionable recommendations'
      ],
      diagramOpportunities: [
        'Flowchart for process explanation',
        'Timeline for historical events',
        'Comparison table for different aspects'
      ],
      commonMistakes: [
        'Lack of current affairs integration',
        'Missing conclusion',
        'Exceeding word limit',
        'Generic examples without specificity'
      ]
    }
  }
}