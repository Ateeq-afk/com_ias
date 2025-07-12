import { NewsAnalysis, TrendAnalysis, TrendAnalyzer } from '../types'

export class UPSCTrendAnalyzer implements TrendAnalyzer {
  
  async analyzeTrends(
    newsAnalyses: NewsAnalysis[], 
    period: { start: Date, end: Date }
  ): Promise<TrendAnalysis> {
    
    const recurringThemes = this.identifyRecurringThemes(newsAnalyses)
    const emergingTopics = this.identifyEmergingTopics(newsAnalyses, period)
    const subjectDistribution = this.calculateSubjectDistribution(newsAnalyses)
    const sourceBias = this.calculateSourceBias(newsAnalyses)
    const examPredictions = await this.predictExamTopics({
      period,
      recurringThemes,
      emergingTopics,
      subjectDistribution,
      sourceBias
    })
    
    return {
      period,
      recurringThemes,
      emergingTopics,
      subjectDistribution,
      sourceBias,
      examPredictions
    }
  }
  
  async predictExamTopics(trendAnalysis: TrendAnalysis): Promise<Array<{
    topic: string
    examType: 'Prelims' | 'Mains' | 'Both'
    probability: number
    reasoning: string
  }>> {
    const predictions: Array<{
      topic: string
      examType: 'Prelims' | 'Mains' | 'Both'
      probability: number
      reasoning: string
    }> = []
    
    // Analyze recurring themes for predictions
    trendAnalysis.recurringThemes.forEach(theme => {
      const prediction = this.analyzeThemeForExam(theme)
      predictions.push(prediction)
    })
    
    // Analyze emerging topics
    trendAnalysis.emergingTopics.forEach(topic => {
      const prediction = this.analyzeEmergingTopicForExam(topic)
      predictions.push(prediction)
    })
    
    // Add subject-specific predictions
    const subjectPredictions = this.generateSubjectPredictions(trendAnalysis.subjectDistribution)
    predictions.push(...subjectPredictions)
    
    // Sort by probability and return top predictions
    return predictions
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 15)
  }
  
  async generateRevisionNotes(recurringThemes: any[]): Promise<string> {
    let notes = '📚 WEEKLY REVISION NOTES\n'
    notes += '========================\n\n'
    
    recurringThemes.forEach((theme, index) => {
      notes += `${index + 1}. ${theme.theme.toUpperCase()}\n`
      notes += `   Frequency: ${theme.occurrences} times\n`
      notes += `   Importance: ${theme.importance}\n`
      notes += `   Key Points:\n`
      
      // Generate key points for the theme
      const keyPoints = this.generateThemeKeyPoints(theme)
      keyPoints.forEach(point => {
        notes += `   • ${point}\n`
      })
      
      notes += '\n'
    })
    
    notes += '\n🎯 FOCUS AREAS\n'
    notes += '===============\n\n'
    
    // Add focus areas based on importance
    const criticalThemes = recurringThemes.filter(t => t.importance === 'Critical')
    criticalThemes.forEach(theme => {
      notes += `⭐ ${theme.theme}: Requires detailed understanding and current updates\n`
    })
    
    return notes
  }
  
  private identifyRecurringThemes(newsAnalyses: NewsAnalysis[]): Array<{
    theme: string
    occurrences: number
    newsItems: string[]
    importance: 'Critical' | 'Important' | 'Moderate'
  }> {
    const themeMap = new Map<string, {
      count: number
      items: string[]
      totalRelevance: number
    }>()
    
    // Extract themes from news
    newsAnalyses.forEach(analysis => {
      const themes = this.extractThemes(analysis)
      
      themes.forEach(theme => {
        if (!themeMap.has(theme)) {
          themeMap.set(theme, { count: 0, items: [], totalRelevance: 0 })
        }
        
        const themeData = themeMap.get(theme)!
        themeData.count++
        themeData.items.push(analysis.newsItem.id)
        themeData.totalRelevance += analysis.newsItem.upscRelevanceScore
      })
    })
    
    // Convert to array and calculate importance
    const recurringThemes = Array.from(themeMap.entries())
      .filter(([_, data]) => data.count >= 2) // Only themes that appear at least twice
      .map(([theme, data]) => ({
        theme,
        occurrences: data.count,
        newsItems: data.items,
        importance: this.calculateThemeImportance(data.count, data.totalRelevance)
      }))
      .sort((a, b) => b.occurrences - a.occurrences)
    
    return recurringThemes
  }
  
  private identifyEmergingTopics(
    newsAnalyses: NewsAnalysis[], 
    period: { start: Date, end: Date }
  ): Array<{
    topic: string
    growthRate: number
    firstAppeared: Date
    predictedImportance: string
  }> {
    const topicTimeline = new Map<string, Date[]>()
    
    // Track when each topic appeared
    newsAnalyses.forEach(analysis => {
      analysis.newsItem.syllabusTopic.forEach(topic => {
        if (!topicTimeline.has(topic)) {
          topicTimeline.set(topic, [])
        }
        topicTimeline.get(topic)!.push(analysis.newsItem.publishedDate)
      })
    })
    
    // Calculate growth rates
    const emergingTopics: Array<{
      topic: string
      growthRate: number
      firstAppeared: Date
      predictedImportance: string
    }> = []
    
    topicTimeline.forEach((dates, topic) => {
      const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime())
      const firstAppeared = sortedDates[0]
      
      // Calculate growth rate (appearances per day)
      const daysSinceFirst = (period.end.getTime() - firstAppeared.getTime()) / (1000 * 60 * 60 * 24)
      const growthRate = dates.length / Math.max(daysSinceFirst, 1)
      
      // Only include topics that appeared recently and are growing
      if (daysSinceFirst <= 7 && growthRate > 0.3) {
        emergingTopics.push({
          topic,
          growthRate: Math.round(growthRate * 100) / 100,
          firstAppeared,
          predictedImportance: this.predictTopicImportance(growthRate, dates.length)
        })
      }
    })
    
    return emergingTopics.sort((a, b) => b.growthRate - a.growthRate)
  }
  
  private calculateSubjectDistribution(newsAnalyses: NewsAnalysis[]): Record<any, number> {
    const distribution: Record<string, number> = {}
    
    newsAnalyses.forEach(analysis => {
      const subject = analysis.newsItem.primarySubject
      distribution[subject] = (distribution[subject] || 0) + 1
    })
    
    // Calculate percentages
    const total = newsAnalyses.length
    Object.keys(distribution).forEach(subject => {
      distribution[subject] = Math.round((distribution[subject] / total) * 100)
    })
    
    return distribution
  }
  
  private calculateSourceBias(newsAnalyses: NewsAnalysis[]): Record<any, number> {
    const sourceBias: Record<string, number> = {}
    
    newsAnalyses.forEach(analysis => {
      const source = analysis.newsItem.source
      sourceBias[source] = (sourceBias[source] || 0) + 1
    })
    
    return sourceBias
  }
  
  private extractThemes(analysis: NewsAnalysis): string[] {
    const themes: string[] = []
    
    // Extract from title
    const titleThemes = this.extractThemesFromText(analysis.newsItem.title)
    themes.push(...titleThemes)
    
    // Extract from key points
    analysis.keyPoints.forEach(point => {
      const pointThemes = this.extractThemesFromText(point)
      themes.push(...pointThemes)
    })
    
    // Extract from syllabus topics
    themes.push(...analysis.newsItem.syllabusTopic)
    
    // Add subject as theme
    themes.push(analysis.newsItem.primarySubject)
    
    return [...new Set(themes)] // Remove duplicates
  }
  
  private extractThemesFromText(text: string): string[] {
    const themes: string[] = []
    
    // Common theme patterns
    const themePatterns = [
      { pattern: /climate\s+change/gi, theme: 'Climate Change' },
      { pattern: /economic\s+growth/gi, theme: 'Economic Growth' },
      { pattern: /judicial\s+review/gi, theme: 'Judicial Review' },
      { pattern: /foreign\s+policy/gi, theme: 'Foreign Policy' },
      { pattern: /digital\s+india/gi, theme: 'Digital India' },
      { pattern: /sustainable\s+development/gi, theme: 'Sustainable Development' },
      { pattern: /constitutional\s+amendment/gi, theme: 'Constitutional Amendment' },
      { pattern: /social\s+justice/gi, theme: 'Social Justice' },
      { pattern: /federalism/gi, theme: 'Federalism' },
      { pattern: /governance/gi, theme: 'Governance' }
    ]
    
    themePatterns.forEach(({ pattern, theme }) => {
      if (pattern.test(text)) {
        themes.push(theme)
      }
    })
    
    return themes
  }
  
  private calculateThemeImportance(
    count: number, 
    totalRelevance: number
  ): 'Critical' | 'Important' | 'Moderate' {
    const avgRelevance = totalRelevance / count
    const importanceScore = count * 10 + avgRelevance
    
    if (importanceScore > 200) return 'Critical'
    if (importanceScore > 150) return 'Important'
    return 'Moderate'
  }
  
  private predictTopicImportance(growthRate: number, occurrences: number): string {
    const score = growthRate * 50 + occurrences * 10
    
    if (score > 80) return 'High - Likely to be exam relevant'
    if (score > 50) return 'Medium - Monitor for developments'
    return 'Low - Emerging but not yet critical'
  }
  
  private analyzeThemeForExam(theme: {
    theme: string
    occurrences: number
    newsItems: string[]
    importance: 'Critical' | 'Important' | 'Moderate'
  }): {
    topic: string
    examType: 'Prelims' | 'Mains' | 'Both'
    probability: number
    reasoning: string
  } {
    let probability = 50 // Base probability
    let examType: 'Prelims' | 'Mains' | 'Both' = 'Both'
    
    // Adjust based on importance
    if (theme.importance === 'Critical') {
      probability += 30
    } else if (theme.importance === 'Important') {
      probability += 20
    }
    
    // Adjust based on occurrences
    probability += Math.min(theme.occurrences * 5, 20)
    
    // Determine exam type based on theme nature
    if (this.isFactualTheme(theme.theme)) {
      examType = 'Prelims'
    } else if (this.isAnalyticalTheme(theme.theme)) {
      examType = 'Mains'
    }
    
    const reasoning = `Theme appeared ${theme.occurrences} times with ${theme.importance} importance. ` +
                     `${theme.importance === 'Critical' ? 'High government/policy focus. ' : ''}` +
                     `Suitable for ${examType} due to ${examType === 'Prelims' ? 'factual nature' : 'analytical depth'}.`
    
    return {
      topic: theme.theme,
      examType,
      probability: Math.min(probability, 95),
      reasoning
    }
  }
  
  private analyzeEmergingTopicForExam(topic: {
    topic: string
    growthRate: number
    firstAppeared: Date
    predictedImportance: string
  }): {
    topic: string
    examType: 'Prelims' | 'Mains' | 'Both'
    probability: number
    reasoning: string
  } {
    let probability = 40 // Base for emerging topics
    
    // Adjust based on growth rate
    probability += topic.growthRate * 20
    
    // Recent topics more likely
    const daysSinceAppeared = (Date.now() - topic.firstAppeared.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceAppeared < 3) {
      probability += 10
    }
    
    const reasoning = `Emerging topic with ${topic.growthRate} growth rate. ` +
                     `First appeared ${Math.round(daysSinceAppeared)} days ago. ` +
                     `${topic.predictedImportance}`
    
    return {
      topic: topic.topic,
      examType: 'Prelims', // Emerging topics more likely in Prelims
      probability: Math.min(probability, 85),
      reasoning
    }
  }
  
  private generateSubjectPredictions(
    subjectDistribution: Record<any, number>
  ): Array<{
    topic: string
    examType: 'Prelims' | 'Mains' | 'Both'
    probability: number
    reasoning: string
  }> {
    const predictions: Array<{
      topic: string
      examType: 'Prelims' | 'Mains' | 'Both'
      probability: number
      reasoning: string
    }> = []
    
    // High coverage subjects likely to have questions
    Object.entries(subjectDistribution)
      .filter(([_, percentage]) => percentage > 15)
      .forEach(([subject, percentage]) => {
        predictions.push({
          topic: `${subject} - Current Developments`,
          examType: 'Both',
          probability: 60 + (percentage / 2),
          reasoning: `${subject} covered ${percentage}% of current affairs, indicating high relevance`
        })
      })
    
    return predictions
  }
  
  private isFactualTheme(theme: string): boolean {
    const factualKeywords = [
      'scheme', 'mission', 'project', 'agreement', 'summit',
      'launched', 'approved', 'statistics', 'ranking'
    ]
    
    return factualKeywords.some(keyword => 
      theme.toLowerCase().includes(keyword)
    )
  }
  
  private isAnalyticalTheme(theme: string): boolean {
    const analyticalKeywords = [
      'governance', 'development', 'challenge', 'impact',
      'policy', 'reform', 'justice', 'relations'
    ]
    
    return analyticalKeywords.some(keyword => 
      theme.toLowerCase().includes(keyword)
    )
  }
  
  private generateThemeKeyPoints(theme: {
    theme: string
    occurrences: number
    newsItems: string[]
    importance: 'Critical' | 'Important' | 'Moderate'
  }): string[] {
    const keyPoints: string[] = []
    
    // Generate theme-specific points
    switch (theme.theme) {
      case 'Climate Change':
        keyPoints.push(
          'India\'s climate commitments and net-zero targets',
          'International climate negotiations and COP outcomes',
          'Renewable energy transition and green initiatives'
        )
        break
        
      case 'Economic Growth':
        keyPoints.push(
          'GDP growth projections and economic indicators',
          'Fiscal and monetary policy measures',
          'Sectoral performance and challenges'
        )
        break
        
      case 'Judicial Review':
        keyPoints.push(
          'Recent Supreme Court judgments on constitutional matters',
          'Balance between judicial activism and restraint',
          'Impact on governance and policy implementation'
        )
        break
        
      default:
        keyPoints.push(
          `Recent developments in ${theme.theme}`,
          `Policy implications and stakeholder impact`,
          `Future outlook and challenges`
        )
    }
    
    return keyPoints
  }
  
  // Utility method for generating trend report
  generateTrendReport(analysis: TrendAnalysis): string {
    let report = '📊 CURRENT AFFAIRS TREND ANALYSIS\n'
    report += '==================================\n\n'
    
    report += `Period: ${analysis.period.start.toLocaleDateString()} to ${analysis.period.end.toLocaleDateString()}\n\n`
    
    // Recurring themes section
    report += '🔄 RECURRING THEMES\n'
    report += '-------------------\n'
    analysis.recurringThemes.slice(0, 5).forEach((theme, index) => {
      report += `${index + 1}. ${theme.theme}\n`
      report += `   • Occurrences: ${theme.occurrences}\n`
      report += `   • Importance: ${theme.importance}\n`
      report += `   • Coverage: ${theme.newsItems.length} articles\n\n`
    })
    
    // Emerging topics section
    report += '🚀 EMERGING TOPICS\n'
    report += '------------------\n'
    analysis.emergingTopics.slice(0, 5).forEach((topic, index) => {
      report += `${index + 1}. ${topic.topic}\n`
      report += `   • Growth Rate: ${topic.growthRate} per day\n`
      report += `   • First Appeared: ${topic.firstAppeared.toLocaleDateString()}\n`
      report += `   • Predicted Importance: ${topic.predictedImportance}\n\n`
    })
    
    // Subject distribution
    report += '📚 SUBJECT DISTRIBUTION\n'
    report += '----------------------\n'
    Object.entries(analysis.subjectDistribution)
      .sort((a, b) => b[1] - a[1])
      .forEach(([subject, percentage]) => {
        report += `• ${subject}: ${percentage}%\n`
      })
    
    report += '\n'
    
    // Exam predictions
    report += '🎯 EXAM PREDICTIONS\n'
    report += '-------------------\n'
    analysis.examPredictions.slice(0, 10).forEach((prediction, index) => {
      report += `${index + 1}. ${prediction.topic}\n`
      report += `   • Exam Type: ${prediction.examType}\n`
      report += `   • Probability: ${prediction.probability}%\n`
      report += `   • Reasoning: ${prediction.reasoning}\n\n`
    })
    
    return report
  }
}