import {
  TestAttempt,
  TestAnalytics,
  SolutionSet,
  PrelimsTest,
  MainsTest,
  AnalyticsGenerator
} from '../types'
import { Question, DifficultyLevel, SubjectArea } from '../../question-generator/types'

export class UPSCTestAnalytics implements AnalyticsGenerator {
  
  async generateTestAnalytics(attempt: TestAttempt): Promise<TestAnalytics> {
    const overallAnalysis = this.calculateOverallAnalysis(attempt)
    const subjectWiseAnalysis = this.calculateSubjectWiseAnalysis(attempt)
    const difficultyAnalysis = this.calculateDifficultyAnalysis(attempt)
    const topicWisePerformance = this.calculateTopicWisePerformance(attempt)
    const timeManagement = this.analyzeTimeManagement(attempt)
    const weakAreaIdentification = await this.identifyWeakAreas(attempt)
    const improvementSuggestions = this.generateImprovementSuggestions(attempt)
    const comparisonWithToppers = await this.compareWithToppers(attempt)

    return {
      testId: attempt.testId,
      attemptId: `attempt-${Date.now()}`,
      overallAnalysis,
      subjectWiseAnalysis,
      difficultyAnalysis,
      topicWisePerformance,
      timeManagement,
      weakAreaIdentification,
      improvementSuggestions,
      comparisonWithToppers
    }
  }

  async generateSolutionSet(test: PrelimsTest | MainsTest): Promise<SolutionSet> {
    const solutions = await Promise.all(
      test.questions.map(async (question, index) => {
        return {
          questionId: question.id,
          correctAnswer: this.getCorrectAnswer(question),
          explanation: await this.generateDetailedExplanation(question),
          conceptsCovered: this.extractConcepts(question),
          difficulty: question.difficulty,
          averageTime: this.calculateAverageTime(question.difficulty),
          commonMistakes: this.identifyCommonMistakes(question),
          videoScriptOutline: await this.generateVideoScript(question.id, question.explanation),
          relatedPYQs: this.findRelatedPYQs(question),
          furtherReading: this.suggestFurtherReading(question)
        }
      })
    )

    // Create mock analytics for the solution set
    const mockAttempt = this.createMockAttempt(test)
    const detailedAnalytics = await this.generateTestAnalytics(mockAttempt)

    return {
      testId: test.id,
      solutions,
      detailedAnalytics
    }
  }

  async generateVideoScript(questionId: string, solution: string): Promise<string> {
    return `
UPSC Question Analysis - ${questionId}

[INTRO - 30 seconds]
"Welcome back to our UPSC question analysis series. Today we'll analyze question ${questionId}, understand why the correct answer is what it is, and learn the broader concepts."

[QUESTION READING - 45 seconds]
"Let's start by reading the question carefully. [Read question aloud] 
Notice the key terms and what exactly is being asked."

[OPTION ANALYSIS - 2 minutes]
"Now let's analyze each option:
Option A: [Detailed analysis]
Option B: [Detailed analysis] 
Option C: [Detailed analysis]
Option D: [Detailed analysis]"

[CORRECT ANSWER EXPLANATION - 2 minutes]
"The correct answer is [X] because: ${solution}
This connects to the broader concept of..."

[CONCEPT CLARITY - 1.5 minutes]
"Let's understand the underlying concept:
- Definition and scope
- Key characteristics
- Examples and applications"

[UPSC PERSPECTIVE - 1 minute]
"From UPSC's perspective:
- Why this topic is important
- How it might appear in other questions
- Connection to current affairs"

[MEMORY TECHNIQUE - 30 seconds]
"Remember this using: [Memory technique/acronym]"

[WRAP UP - 30 seconds]
"Key takeaway: [Main learning point]
Practice similar questions and connect concepts for better retention."

Total Duration: ~8 minutes
    `.trim()
  }

  async calculatePercentile(score: number, testId: string): Promise<number> {
    // In production, this would calculate based on actual test data
    // For demo, we'll simulate percentile calculation
    
    // Mock score distribution (normal distribution around 50)
    const mockScores = this.generateMockScoreDistribution(1000)
    
    const scoresBelow = mockScores.filter(s => s < score).length
    const percentile = Math.round((scoresBelow / mockScores.length) * 100)
    
    return Math.max(1, Math.min(99, percentile))
  }

  async generatePerformanceTrends(
    userId: string,
    attempts: TestAttempt[]
  ): Promise<{
    scoreProgression: Array<{ date: Date; score: number; testType: string }>
    accuracyTrends: Array<{ subject: SubjectArea; trend: 'improving' | 'declining' | 'stable'; change: number }>
    timeManagementTrends: Array<{ date: Date; avgTimePerQuestion: number }>
    strongestImprovement: string
    biggestConcern: string
  }> {
    const scoreProgression = attempts.map(attempt => ({
      date: attempt.attemptedAt,
      score: attempt.score,
      testType: this.extractTestType(attempt.testId)
    }))

    const accuracyTrends = await this.calculateAccuracyTrends(attempts)
    const timeManagementTrends = this.calculateTimeManagementTrends(attempts)
    
    return {
      scoreProgression,
      accuracyTrends,
      timeManagementTrends,
      strongestImprovement: this.identifyStrongestImprovement(attempts),
      biggestConcern: this.identifyBiggestConcern(attempts)
    }
  }

  async generateDetailedReport(attempt: TestAttempt): Promise<string> {
    const analytics = await this.generateTestAnalytics(attempt)
    
    return `
# DETAILED PERFORMANCE REPORT

## Overall Performance
- **Score**: ${analytics.overallAnalysis.score}/${analytics.overallAnalysis.maxScore} (${analytics.overallAnalysis.accuracy.toFixed(1)}%)
- **Percentile**: ${analytics.overallAnalysis.percentile}
- **Time Taken**: ${Math.floor(analytics.overallAnalysis.timeTaken / 60)} minutes ${analytics.overallAnalysis.timeTaken % 60} seconds
- **Questions Attempted**: ${analytics.overallAnalysis.questionsAttempted}/${analytics.overallAnalysis.questionsAttempted + analytics.overallAnalysis.unattempted}

## Subject-wise Analysis
${analytics.subjectWiseAnalysis.map(subject => `
### ${subject.subject}
- **Accuracy**: ${subject.accuracy.toFixed(1)}% (${subject.correct}/${subject.attempted})
- **Average Time**: ${subject.averageTime.toFixed(1)} seconds
- **Score**: ${subject.score}/${subject.maxScore}
`).join('')}

## Difficulty Analysis
${analytics.difficultyAnalysis.map(diff => `
- **${diff.difficulty.toUpperCase()}**: ${diff.accuracy.toFixed(1)}% accuracy (${diff.correct}/${diff.attempted})
`).join('')}

## Time Management
- **Average Time per Question**: ${analytics.timeManagement.averageTimePerQuestion.toFixed(1)} seconds
- **Fastest Question**: ${analytics.timeManagement.fastestQuestion.time} seconds
- **Slowest Question**: ${analytics.timeManagement.slowestQuestion.time} seconds
- **Rush Hour Analysis**: ${analytics.timeManagement.rushHourAnalysis}

## Weak Areas Identified
${analytics.weakAreaIdentification.map(area => `
- **${area.area}**: ${area.accuracy.toFixed(1)}% accuracy
  - Suggestion: ${area.suggestion}
  - Resources: ${area.recommendedResources.join(', ')}
`).join('')}

## Improvement Suggestions
${analytics.improvementSuggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n')}

## Comparison with Toppers
- **Topper Average**: ${analytics.comparisonWithToppers.topperAverage}%
- **Your Score**: ${analytics.comparisonWithToppers.yourScore}%
- **Gap**: ${analytics.comparisonWithToppers.gap} marks
- **Focus Areas**: ${analytics.comparisonWithToppers.areasToImprove.join(', ')}

---
*Generated by UPSC Test Analytics Engine*
    `.trim()
  }

  private calculateOverallAnalysis(attempt: TestAttempt): TestAnalytics['overallAnalysis'] {
    const totalQuestions = attempt.responses.length
    const correctAnswers = attempt.responses.filter(r => r.isCorrect).length
    const wrongAnswers = attempt.responses.filter(r => !r.isCorrect && r.selectedOption !== undefined).length
    const unattempted = attempt.responses.filter(r => r.selectedOption === undefined).length
    
    const maxScore = totalQuestions * 2 // Assuming 2 marks per question
    const negativeMarks = wrongAnswers * 0.66
    const positiveMarks = correctAnswers * 2
    const score = positiveMarks - negativeMarks

    return {
      score: Math.round(score * 100) / 100,
      maxScore,
      accuracy: attempt.accuracy,
      percentile: attempt.percentile || 50,
      rank: Math.floor(Math.random() * 1000) + 1, // Mock rank
      timeTaken: attempt.timeSpent * 60, // Convert to seconds
      questionsAttempted: totalQuestions - unattempted,
      correctAnswers,
      wrongAnswers,
      unattempted
    }
  }

  private calculateSubjectWiseAnalysis(attempt: TestAttempt): TestAnalytics['subjectWiseAnalysis'] {
    const subjectData = new Map<SubjectArea, {
      attempted: number
      correct: number
      totalTime: number
      score: number
      maxScore: number
    }>()

    attempt.responses.forEach(response => {
      const subject = this.extractSubjectFromQuestionId(response.questionId)
      
      if (!subjectData.has(subject)) {
        subjectData.set(subject, {
          attempted: 0,
          correct: 0,
          totalTime: 0,
          score: 0,
          maxScore: 0
        })
      }

      const data = subjectData.get(subject)!
      if (response.selectedOption !== undefined) {
        data.attempted++
        data.maxScore += 2
        
        if (response.isCorrect) {
          data.correct++
          data.score += 2
        } else {
          data.score -= 0.66
        }
      }
      data.totalTime += response.timeSpent
    })

    return Array.from(subjectData.entries()).map(([subject, data]) => ({
      subject,
      attempted: data.attempted,
      correct: data.correct,
      accuracy: data.attempted > 0 ? (data.correct / data.attempted) * 100 : 0,
      averageTime: data.attempted > 0 ? data.totalTime / data.attempted : 0,
      score: Math.round(data.score * 100) / 100,
      maxScore: data.maxScore
    }))
  }

  private calculateDifficultyAnalysis(attempt: TestAttempt): TestAnalytics['difficultyAnalysis'] {
    // Mock difficulty analysis since we don't have difficulty info in responses
    return [
      {
        difficulty: 'easy',
        attempted: Math.floor(attempt.responses.length * 0.3),
        correct: Math.floor(attempt.responses.length * 0.3 * 0.8),
        accuracy: 80,
        averageTime: 45
      },
      {
        difficulty: 'medium',
        attempted: Math.floor(attempt.responses.length * 0.5),
        correct: Math.floor(attempt.responses.length * 0.5 * 0.6),
        accuracy: 60,
        averageTime: 75
      },
      {
        difficulty: 'hard',
        attempted: Math.floor(attempt.responses.length * 0.2),
        correct: Math.floor(attempt.responses.length * 0.2 * 0.4),
        accuracy: 40,
        averageTime: 120
      }
    ]
  }

  private calculateTopicWisePerformance(attempt: TestAttempt): TestAnalytics['topicWisePerformance'] {
    const topicData = new Map<string, { attempted: number; correct: number }>()
    
    attempt.responses.forEach(response => {
      const topic = this.extractTopicFromQuestionId(response.questionId)
      
      if (!topicData.has(topic)) {
        topicData.set(topic, { attempted: 0, correct: 0 })
      }
      
      const data = topicData.get(topic)!
      if (response.selectedOption !== undefined) {
        data.attempted++
        if (response.isCorrect) {
          data.correct++
        }
      }
    })

    return Array.from(topicData.entries()).map(([topic, data]) => {
      const accuracy = data.attempted > 0 ? (data.correct / data.attempted) * 100 : 0
      return {
        topic,
        attempted: data.attempted,
        correct: data.correct,
        accuracy,
        suggestion: this.generateTopicSuggestion(topic, accuracy)
      }
    })
  }

  private analyzeTimeManagement(attempt: TestAttempt): TestAnalytics['timeManagement'] {
    const responseTimes = attempt.responses.map(r => r.timeSpent)
    const totalTime = responseTimes.reduce((sum, time) => sum + time, 0)
    const averageTime = totalTime / responseTimes.length
    
    const sortedTimes = [...responseTimes].sort((a, b) => a - b)
    const fastestTime = sortedTimes[0]
    const slowestTime = sortedTimes[sortedTimes.length - 1]
    
    // Analyze last 30% of questions for rush hour analysis
    const rushHourStartIndex = Math.floor(responseTimes.length * 0.7)
    const rushHourTimes = responseTimes.slice(rushHourStartIndex)
    const rushHourAverage = rushHourTimes.reduce((sum, time) => sum + time, 0) / rushHourTimes.length
    const rushHourAnalysis = rushHourAverage < averageTime * 0.8 ? 
      'Good - maintained speed in final phase' : 
      'Rushed in final phase - practice time management'

    return {
      totalTime,
      averageTimePerQuestion: averageTime,
      fastestQuestion: { id: 'fastest-q', time: fastestTime },
      slowestQuestion: { id: 'slowest-q', time: slowestTime },
      rushHourAnalysis
    }
  }

  private async identifyWeakAreas(attempt: TestAttempt): Promise<TestAnalytics['weakAreaIdentification']> {
    const subjectAnalysis = this.calculateSubjectWiseAnalysis(attempt)
    
    return subjectAnalysis
      .filter(subject => subject.accuracy < 60)
      .map(subject => ({
        area: subject.subject,
        accuracy: subject.accuracy,
        suggestion: this.generateWeakAreaSuggestion(subject.subject, subject.accuracy),
        recommendedResources: this.getRecommendedResources(subject.subject)
      }))
  }

  private generateImprovementSuggestions(attempt: TestAttempt): string[] {
    const suggestions: string[] = []
    const overallAccuracy = attempt.accuracy
    
    if (overallAccuracy < 50) {
      suggestions.push('Focus on building foundational concepts before attempting mock tests')
      suggestions.push('Practice topic-wise questions to strengthen weak areas')
    } else if (overallAccuracy < 70) {
      suggestions.push('Work on analytical and application-based questions')
      suggestions.push('Improve time management through regular practice')
    } else {
      suggestions.push('Focus on advanced level questions and current affairs integration')
      suggestions.push('Practice elimination techniques for difficult questions')
    }

    // Time-based suggestions
    const avgTime = attempt.timeSpent * 60 / attempt.responses.length
    if (avgTime > 90) {
      suggestions.push('Practice speed reading and quick decision making')
    } else if (avgTime < 60) {
      suggestions.push('Spend more time on careful analysis to improve accuracy')
    }

    suggestions.push('Review all explanations, especially for correct answers you guessed')
    suggestions.push('Maintain a mistake journal and review weekly')

    return suggestions
  }

  private async compareWithToppers(attempt: TestAttempt): Promise<TestAnalytics['comparisonWithToppers']> {
    // Mock topper data
    const topperAverage = Math.max(attempt.accuracy, 75) + Math.random() * 15
    const gap = Math.max(0, topperAverage - attempt.accuracy)
    
    const areasToImprove: string[] = []
    if (gap > 20) {
      areasToImprove.push('Fundamental concepts', 'Current affairs', 'Time management')
    } else if (gap > 10) {
      areasToImprove.push('Analytical questions', 'Advanced topics')
    } else {
      areasToImprove.push('Maintain consistency')
    }

    return {
      topperAverage: Math.round(topperAverage * 100) / 100,
      yourScore: attempt.accuracy,
      gap: Math.round(gap * 100) / 100,
      areasToImprove
    }
  }

  // Helper methods
  private getCorrectAnswer(question: any): number | number[] | string {
    return question.correctAnswer
  }

  private async generateDetailedExplanation(question: any): Promise<string> {
    return `${question.explanation}\n\nDetailed Analysis:\n- Key concept: ${question.concepts?.[0] || 'Core concept'}\n- Why other options are wrong: Each incorrect option represents a common misconception\n- UPSC perspective: This type of question tests your understanding of fundamental principles\n- Memory tip: Use acronyms or visual associations to remember key facts`
  }

  private extractConcepts(question: any): string[] {
    return question.concepts || ['General concept']
  }

  private calculateAverageTime(difficulty: DifficultyLevel): number {
    const timeMap = {
      'easy': 45,
      'medium': 75,
      'hard': 120
    }
    return timeMap[difficulty]
  }

  private identifyCommonMistakes(question: any): string[] {
    return [
      'Misreading the question stem',
      'Confusing similar concepts',
      'Not eliminating obviously wrong options',
      'Rushing without careful analysis'
    ]
  }

  private findRelatedPYQs(question: any): string[] {
    return [
      'UPSC 2023 - Similar concept tested',
      'UPSC 2022 - Related application question',
      'UPSC 2021 - Basic concept question'
    ]
  }

  private suggestFurtherReading(question: any): string[] {
    return [
      `NCERT Chapter on ${question.topic}`,
      `Spectrum book reference for ${question.subject}`,
      `Current affairs compilation for ${question.topic}`
    ]
  }

  private createMockAttempt(test: PrelimsTest | MainsTest): TestAttempt {
    const responses = test.questions.map(q => ({
      questionId: q.id,
      selectedOption: Math.floor(Math.random() * 4),
      timeSpent: 60 + Math.random() * 60,
      isCorrect: Math.random() > 0.4,
      marksAwarded: Math.random() > 0.4 ? 2 : -0.66
    }))

    const correctCount = responses.filter(r => r.isCorrect).length
    const accuracy = (correctCount / responses.length) * 100

    return {
      testId: test.id,
      userId: 'demo-user',
      attemptedAt: new Date(),
      completedAt: new Date(),
      responses,
      score: correctCount * 2 - (responses.length - correctCount) * 0.66,
      accuracy,
      timeSpent: 120,
      percentile: 50
    }
  }

  private generateMockScoreDistribution(size: number): number[] {
    const scores: number[] = []
    for (let i = 0; i < size; i++) {
      // Normal distribution around 50 with std dev of 20
      const score = Math.max(0, Math.min(100, 50 + (Math.random() - 0.5) * 40))
      scores.push(score)
    }
    return scores.sort((a, b) => a - b)
  }

  private extractSubjectFromQuestionId(questionId: string): SubjectArea {
    if (questionId.includes('polity')) return 'Polity'
    if (questionId.includes('history')) return 'History'
    if (questionId.includes('geography')) return 'Geography'
    if (questionId.includes('economy')) return 'Economy'
    if (questionId.includes('environment')) return 'Environment'
    if (questionId.includes('science')) return 'Science & Technology'
    return 'Current Affairs'
  }

  private extractTopicFromQuestionId(questionId: string): string {
    const parts = questionId.split('-')
    return parts.length > 2 ? parts[2].replace(/([A-Z])/g, ' $1').trim() : 'General'
  }

  private extractTestType(testId: string): string {
    if (testId.includes('prelims')) return 'Prelims'
    if (testId.includes('mains')) return 'Mains'
    if (testId.includes('sectional')) return 'Sectional'
    return 'Practice'
  }

  private async calculateAccuracyTrends(attempts: TestAttempt[]): Promise<any[]> {
    // Mock implementation
    return [
      { subject: 'Polity' as SubjectArea, trend: 'improving' as const, change: 15 },
      { subject: 'History' as SubjectArea, trend: 'declining' as const, change: -5 },
      { subject: 'Economy' as SubjectArea, trend: 'stable' as const, change: 2 }
    ]
  }

  private calculateTimeManagementTrends(attempts: TestAttempt[]): any[] {
    return attempts.map(attempt => ({
      date: attempt.attemptedAt,
      avgTimePerQuestion: (attempt.timeSpent * 60) / attempt.responses.length
    }))
  }

  private identifyStrongestImprovement(attempts: TestAttempt[]): string {
    return 'Polity - 15% improvement in last 3 tests'
  }

  private identifyBiggestConcern(attempts: TestAttempt[]): string {
    return 'History - declining accuracy trend'
  }

  private generateTopicSuggestion(topic: string, accuracy: number): string {
    if (accuracy < 40) {
      return `Focus on basic concepts of ${topic}. Start with NCERT and build foundation.`
    } else if (accuracy < 70) {
      return `Practice more questions on ${topic}. Review previous year questions.`
    } else {
      return `Good performance in ${topic}. Focus on advanced applications.`
    }
  }

  private generateWeakAreaSuggestion(subject: SubjectArea, accuracy: number): string {
    const suggestions = {
      'Polity': 'Read Constitution articles daily, focus on recent amendments',
      'History': 'Create timeline charts, practice chronology questions',
      'Geography': 'Use maps and diagrams, focus on physical geography',
      'Economy': 'Follow economic survey, practice data interpretation',
      'Environment': 'Read current affairs on climate change and policies',
      'Science & Technology': 'Focus on recent developments and applications'
    }
    
    return suggestions[subject] || `Practice more questions and review concepts in ${subject}`
  }

  private getRecommendedResources(subject: SubjectArea): string[] {
    const resources = {
      'Polity': ['Laxmikanth', 'Constitution of India by DD Basu', 'PRS Legislative Research'],
      'History': ['NCERT', 'Spectrum Modern History', 'Bipin Chandra'],
      'Geography': ['NCERT Geography', 'G C Leong', 'Savindra Singh'],
      'Economy': ['NCERT Economics', 'Economic Survey', 'Indian Economy by Ramesh Singh'],
      'Environment': ['Down to Earth Magazine', 'NIOS Environment', 'Current Affairs'],
      'Science & Technology': ['NCERT Science', 'Science Reporter', 'Current Affairs']
    }
    
    return resources[subject] || ['Standard textbooks', 'Current affairs', 'Previous year questions']
  }
}