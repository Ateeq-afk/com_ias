import { 
  NewsAnalysis, 
  DailyCompilation, 
  WeeklyCompilation,
  CompilationGenerator,
  PrelimsQuestion
} from '../types'

export class UPSCCompilationGenerator implements CompilationGenerator {
  
  async generateDailyBrief(analyses: NewsAnalysis[], date: Date): Promise<DailyCompilation> {
    // Sort by relevance score
    const sortedAnalyses = analyses.sort((a, b) => 
      b.newsItem.upscRelevanceScore - a.newsItem.upscRelevanceScore
    )
    
    // Select top 10 stories
    const topStories = sortedAnalyses.slice(0, 10)
    
    // Generate daily quiz from all questions
    const allQuestions: PrelimsQuestion[] = []
    analyses.forEach(analysis => {
      allQuestions.push(...analysis.probableQuestions.prelims)
    })
    
    // Select 10 diverse questions for daily quiz
    const dailyQuiz = this.selectDiverseQuestions(allQuestions, 10)
    
    // Generate brief summary
    const briefSummary = this.generateBriefSummary(topStories, date)
    
    // Categorize important updates
    const importantUpdates = this.categorizeImportantUpdates(topStories)
    
    return {
      date,
      topStories,
      quiz: dailyQuiz,
      briefSummary,
      importantUpdates,
      totalNewsProcessed: analyses.length,
      totalNewsSelected: topStories.length
    }
  }
  
  async generateWeeklyCompilation(dailyCompilations: DailyCompilation[]): Promise<WeeklyCompilation> {
    const weekNumber = this.getWeekNumber(dailyCompilations[0].date)
    const startDate = dailyCompilations[0].date
    const endDate = dailyCompilations[dailyCompilations.length - 1].date
    
    // Extract highlights
    const highlights = this.extractWeeklyHighlights(dailyCompilations)
    
    // Analyze trending topics
    const trendingTopics = this.analyzeTrendingTopics(dailyCompilations)
    
    // Compile consolidated quiz
    const consolidatedQuiz = this.createConsolidatedQuiz(dailyCompilations)
    
    // Extract mains topics
    const mainsTopics = this.extractMainsTopics(dailyCompilations)
    
    // Generate revision notes
    const revisionNotes = this.generateRevisionNotes(dailyCompilations)
    
    // Predict important topics
    const predictedTopics = this.predictImportantTopics(trendingTopics, dailyCompilations)
    
    return {
      weekNumber,
      startDate,
      endDate,
      highlights,
      trendingTopics,
      consolidatedQuiz,
      mainsTopics,
      revisionNotes,
      predictedTopics
    }
  }
  
  async generatePDF(compilation: DailyCompilation | WeeklyCompilation): Promise<Buffer> {
    // In a real implementation, this would use a PDF library like jsPDF or puppeteer
    // For demo, we'll return a mock buffer
    const pdfContent = this.generatePDFContent(compilation)
    return Buffer.from(pdfContent, 'utf-8')
  }
  
  async generateQuiz(questions: PrelimsQuestion[]): Promise<string> {
    let quizContent = '📝 UPSC DAILY QUIZ\n'
    quizContent += '==================\n\n'
    
    questions.forEach((question, index) => {
      quizContent += `Q${index + 1}. ${question.question}\n\n`
      question.options.forEach((option, optIndex) => {
        quizContent += `${String.fromCharCode(97 + optIndex)}) ${option}\n`
      })
      quizContent += '\n'
    })
    
    quizContent += '\n📊 ANSWER KEY\n'
    quizContent += '============\n\n'
    
    questions.forEach((question, index) => {
      const correctOption = String.fromCharCode(97 + question.correctAnswer)
      quizContent += `${index + 1}. (${correctOption}) - ${question.explanation}\n\n`
    })
    
    return quizContent
  }
  
  private generateBriefSummary(topStories: NewsAnalysis[], date: Date): string {
    const dateStr = date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    let summary = `📅 Daily Current Affairs Brief - ${dateStr}\n\n`
    summary += `Today's top ${topStories.length} UPSC-relevant developments:\n\n`
    
    // Group by subject
    const subjectGroups = this.groupBySubject(topStories)
    
    for (const [subject, stories] of Object.entries(subjectGroups)) {
      summary += `${this.getSubjectEmoji(subject)} ${subject.toUpperCase()}\n`
      stories.forEach(story => {
        summary += `• ${story.newsItem.title} (Relevance: ${story.newsItem.upscRelevanceScore}/100)\n`
      })
      summary += '\n'
    }
    
    // Add key statistics
    summary += `📊 Today's Statistics:\n`
    summary += `• Most covered subject: ${this.getMostCoveredSubject(topStories)}\n`
    summary += `• Average relevance score: ${this.calculateAverageRelevance(topStories)}\n`
    summary += `• High-priority topics: ${this.getHighPriorityCount(topStories)}\n`
    
    return summary
  }
  
  private categorizeImportantUpdates(stories: NewsAnalysis[]): {
    government: string[]
    economy: string[]
    international: string[]
    environment: string[]
  } {
    const updates = {
      government: [] as string[],
      economy: [] as string[],
      international: [] as string[],
      environment: [] as string[]
    }
    
    stories.forEach(story => {
      const update = `${story.newsItem.title} - ${story.keyPoints[0]}`
      
      switch (story.newsItem.primarySubject) {
        case 'Polity':
        case 'Social Issues':
          updates.government.push(update)
          break
        case 'Economy':
          updates.economy.push(update)
          break
        case 'International Relations':
          updates.international.push(update)
          break
        case 'Environment':
        case 'Geography':
          updates.environment.push(update)
          break
        default:
          // Categorize based on content
          if (story.newsItem.content.toLowerCase().includes('government')) {
            updates.government.push(update)
          } else if (story.newsItem.content.toLowerCase().includes('economy')) {
            updates.economy.push(update)
          }
      }
    })
    
    return updates
  }
  
  private selectDiverseQuestions(questions: PrelimsQuestion[], count: number): PrelimsQuestion[] {
    // Ensure diversity by difficulty and topic
    const easyQuestions = questions.filter(q => q.difficulty === 'Easy')
    const mediumQuestions = questions.filter(q => q.difficulty === 'Medium')
    const hardQuestions = questions.filter(q => q.difficulty === 'Hard')
    
    const selected: PrelimsQuestion[] = []
    
    // Try to maintain 3:5:2 ratio (Easy:Medium:Hard)
    const easyCount = Math.min(3, easyQuestions.length)
    const hardCount = Math.min(2, hardQuestions.length)
    const mediumCount = count - easyCount - hardCount
    
    // Random selection from each difficulty
    selected.push(...this.randomSelect(easyQuestions, easyCount))
    selected.push(...this.randomSelect(mediumQuestions, mediumCount))
    selected.push(...this.randomSelect(hardQuestions, hardCount))
    
    return selected.slice(0, count)
  }
  
  private randomSelect<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
  
  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }
  
  private extractWeeklyHighlights(compilations: DailyCompilation[]): string[] {
    const highlights: string[] = []
    
    // Get most important story from each day
    compilations.forEach(daily => {
      if (daily.topStories.length > 0) {
        const topStory = daily.topStories[0]
        highlights.push(
          `${daily.date.toLocaleDateString('en-IN')}: ${topStory.newsItem.title} ` +
          `(${topStory.newsItem.primarySubject}, Score: ${topStory.newsItem.upscRelevanceScore})`
        )
      }
    })
    
    // Add weekly statistics
    const totalNews = compilations.reduce((sum, daily) => sum + daily.totalNewsProcessed, 0)
    const totalSelected = compilations.reduce((sum, daily) => sum + daily.totalNewsSelected, 0)
    
    highlights.push(`Weekly Statistics: ${totalNews} news processed, ${totalSelected} selected for UPSC relevance`)
    
    return highlights
  }
  
  private analyzeTrendingTopics(compilations: DailyCompilation[]): Array<{
    topic: string
    frequency: number
    importance: string
  }> {
    const topicFrequency = new Map<string, number>()
    const topicImportance = new Map<string, number>()
    
    // Count topic frequencies
    compilations.forEach(daily => {
      daily.topStories.forEach(story => {
        story.newsItem.syllabusTopic.forEach(topic => {
          topicFrequency.set(topic, (topicFrequency.get(topic) || 0) + 1)
          topicImportance.set(topic, 
            Math.max(topicImportance.get(topic) || 0, story.newsItem.upscRelevanceScore)
          )
        })
      })
    })
    
    // Convert to array and sort by frequency
    const trending = Array.from(topicFrequency.entries())
      .map(([topic, frequency]) => ({
        topic,
        frequency,
        importance: this.calculateImportance(frequency, topicImportance.get(topic) || 0)
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)
    
    return trending
  }
  
  private calculateImportance(frequency: number, maxRelevance: number): string {
    const score = frequency * 10 + maxRelevance
    if (score > 150) return 'Critical'
    if (score > 100) return 'High'
    return 'Moderate'
  }
  
  private createConsolidatedQuiz(compilations: DailyCompilation[]): PrelimsQuestion[] {
    const allQuestions: PrelimsQuestion[] = []
    
    // Collect all questions from the week
    compilations.forEach(daily => {
      allQuestions.push(...daily.quiz)
    })
    
    // Remove duplicates and select best 20
    const uniqueQuestions = this.removeDuplicateQuestions(allQuestions)
    
    // Sort by topic diversity and difficulty balance
    return this.selectBalancedQuestions(uniqueQuestions, 20)
  }
  
  private removeDuplicateQuestions(questions: PrelimsQuestion[]): PrelimsQuestion[] {
    const seen = new Set<string>()
    return questions.filter(q => {
      const key = q.question.substring(0, 50)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
  
  private selectBalancedQuestions(questions: PrelimsQuestion[], count: number): PrelimsQuestion[] {
    // Group by topic
    const topicGroups = new Map<string, PrelimsQuestion[]>()
    questions.forEach(q => {
      const topic = q.topic
      if (!topicGroups.has(topic)) {
        topicGroups.set(topic, [])
      }
      topicGroups.get(topic)!.push(q)
    })
    
    // Select from each topic proportionally
    const selected: PrelimsQuestion[] = []
    const questionsPerTopic = Math.floor(count / topicGroups.size)
    
    topicGroups.forEach(topicQuestions => {
      selected.push(...this.randomSelect(topicQuestions, questionsPerTopic))
    })
    
    // Fill remaining slots
    if (selected.length < count) {
      const remaining = questions.filter(q => !selected.includes(q))
      selected.push(...this.randomSelect(remaining, count - selected.length))
    }
    
    return selected.slice(0, count)
  }
  
  private extractMainsTopics(compilations: DailyCompilation[]): any[] {
    const mainsQuestions: any[] = []
    
    compilations.forEach(daily => {
      daily.topStories.forEach(story => {
        mainsQuestions.push(...story.probableQuestions.mains)
      })
    })
    
    // Select diverse mains questions
    return mainsQuestions.slice(0, 10)
  }
  
  private generateRevisionNotes(compilations: DailyCompilation[]): Array<{
    subject: any
    points: string[]
  }> {
    const subjectNotes = new Map<any, Set<string>>()
    
    compilations.forEach(daily => {
      daily.topStories.forEach(story => {
        const subject = story.newsItem.primarySubject
        if (!subjectNotes.has(subject)) {
          subjectNotes.set(subject, new Set())
        }
        
        // Add key points
        story.keyPoints.slice(0, 3).forEach(point => {
          subjectNotes.get(subject)!.add(point)
        })
      })
    })
    
    // Convert to array format
    return Array.from(subjectNotes.entries()).map(([subject, points]) => ({
      subject,
      points: Array.from(points).slice(0, 10)
    }))
  }
  
  private predictImportantTopics(
    trendingTopics: Array<{ topic: string; frequency: number; importance: string }>,
    compilations: DailyCompilation[]
  ): Array<{ topic: string; probability: number; reasoning: string }> {
    const predictions: Array<{ topic: string; probability: number; reasoning: string }> = []
    
    // Based on trending topics
    trendingTopics.slice(0, 5).forEach(trending => {
      const probability = this.calculateProbability(trending.frequency, trending.importance)
      predictions.push({
        topic: trending.topic,
        probability,
        reasoning: `High frequency (${trending.frequency} occurrences) with ${trending.importance} importance indicates exam relevance`
      })
    })
    
    // Based on government focus areas
    const govFocusAreas = this.identifyGovernmentFocus(compilations)
    govFocusAreas.forEach(area => {
      predictions.push({
        topic: area,
        probability: 75,
        reasoning: 'Recent government initiatives indicate policy priority'
      })
    })
    
    return predictions.sort((a, b) => b.probability - a.probability).slice(0, 10)
  }
  
  private calculateProbability(frequency: number, importance: string): number {
    let base = frequency * 10
    if (importance === 'Critical') base *= 1.5
    if (importance === 'High') base *= 1.2
    return Math.min(base, 95)
  }
  
  private identifyGovernmentFocus(compilations: DailyCompilation[]): string[] {
    const focusAreas = new Set<string>()
    
    compilations.forEach(daily => {
      daily.topStories.forEach(story => {
        if (story.newsItem.source === 'PIB' && story.newsItem.upscRelevanceScore > 80) {
          story.newsItem.syllabusTopic.forEach(topic => focusAreas.add(topic))
        }
      })
    })
    
    return Array.from(focusAreas).slice(0, 5)
  }
  
  private generatePDFContent(compilation: DailyCompilation | WeeklyCompilation): string {
    let content = ''
    
    if ('topStories' in compilation) {
      // Daily compilation
      content += `DAILY CURRENT AFFAIRS - ${compilation.date.toLocaleDateString()}\n\n`
      content += compilation.briefSummary + '\n\n'
      
      content += 'TOP STORIES\n'
      content += '===========\n\n'
      
      compilation.topStories.forEach((story, index) => {
        content += `${index + 1}. ${story.newsItem.title}\n`
        content += `Subject: ${story.newsItem.primarySubject} | Score: ${story.newsItem.upscRelevanceScore}\n`
        content += `Summary: ${story.summary.twoMinuteRead.substring(0, 200)}...\n\n`
      })
      
      content += '\nDAILY QUIZ\n'
      content += '==========\n\n'
      content += this.generateQuizSection(compilation.quiz)
      
    } else {
      // Weekly compilation
      content += `WEEKLY COMPILATION - Week ${compilation.weekNumber}\n\n`
      content += `Period: ${compilation.startDate.toLocaleDateString()} to ${compilation.endDate.toLocaleDateString()}\n\n`
      
      content += 'WEEKLY HIGHLIGHTS\n'
      content += '================\n\n'
      compilation.highlights.forEach(highlight => {
        content += `• ${highlight}\n`
      })
      
      content += '\n\nTRENDING TOPICS\n'
      content += '===============\n\n'
      compilation.trendingTopics.forEach(topic => {
        content += `• ${topic.topic} (Frequency: ${topic.frequency}, Importance: ${topic.importance})\n`
      })
    }
    
    return content
  }
  
  private generateQuizSection(questions: PrelimsQuestion[]): string {
    let content = ''
    
    questions.forEach((q, i) => {
      content += `Q${i + 1}. ${q.question}\n`
      q.options.forEach((opt, j) => {
        content += `   ${String.fromCharCode(97 + j)}) ${opt}\n`
      })
      content += '\n'
    })
    
    return content
  }
  
  private groupBySubject(stories: NewsAnalysis[]): Record<string, NewsAnalysis[]> {
    const groups: Record<string, NewsAnalysis[]> = {}
    
    stories.forEach(story => {
      const subject = story.newsItem.primarySubject
      if (!groups[subject]) {
        groups[subject] = []
      }
      groups[subject].push(story)
    })
    
    return groups
  }
  
  private getSubjectEmoji(subject: string): string {
    const emojiMap: Record<string, string> = {
      'Polity': '⚖️',
      'Economy': '💹',
      'Environment': '🌿',
      'Science & Technology': '🔬',
      'International Relations': '🌐',
      'Geography': '🗺️',
      'History': '📜',
      'Social Issues': '👥',
      'Art & Culture': '🎭',
      'Ethics': '🤝'
    }
    
    return emojiMap[subject] || '📌'
  }
  
  private getMostCoveredSubject(stories: NewsAnalysis[]): string {
    const subjectCount = new Map<string, number>()
    
    stories.forEach(story => {
      const subject = story.newsItem.primarySubject
      subjectCount.set(subject, (subjectCount.get(subject) || 0) + 1)
    })
    
    const sorted = Array.from(subjectCount.entries()).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] || 'General'
  }
  
  private calculateAverageRelevance(stories: NewsAnalysis[]): string {
    const total = stories.reduce((sum, story) => sum + story.newsItem.upscRelevanceScore, 0)
    const average = total / stories.length
    return average.toFixed(1)
  }
  
  private getHighPriorityCount(stories: NewsAnalysis[]): number {
    return stories.filter(story => story.newsItem.upscRelevanceScore >= 80).length
  }
}