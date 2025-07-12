import { 
  NewsItem, 
  ProcessedNewsItem, 
  NewsAnalysis, 
  ContentAnalyzer,
  PrelimsQuestion,
  MainsQuestion,
  SubjectArea
} from '../types'

export class UPSCContentAnalyzer implements ContentAnalyzer {
  
  async categorizeNews(newsItem: NewsItem): Promise<ProcessedNewsItem> {
    // This would be done by RelevanceFilter in the actual flow
    // Here we'll create a basic categorization
    const content = (newsItem.title + ' ' + newsItem.content).toLowerCase()
    
    return {
      ...newsItem,
      upscRelevanceScore: 75,
      primarySubject: this.identifyPrimarySubject(content),
      secondarySubjects: this.identifySecondarySubjects(content),
      syllabusTopic: this.identifySyllabusTopics(content),
      prelimsRelevance: 'High',
      mainsRelevance: {
        papers: ['GS2', 'GS3'],
        relevanceLevel: 'Medium'
      },
      questionProbability: 70,
      processingMetadata: {
        processedAt: new Date(),
        version: '1.0.0',
        confidence: 0.85
      }
    }
  }
  
  async generateAnalysis(processedNews: ProcessedNewsItem): Promise<NewsAnalysis> {
    const summary = this.generateSummary(processedNews)
    const keyPoints = this.extractKeyPoints(processedNews)
    const factsAndFigures = this.extractFactsAndFigures(processedNews)
    const backgroundContext = this.generateBackgroundContext(processedNews)
    const upscAngle = this.generateUPSCAngle(processedNews)
    const staticConnections = this.identifyStaticConnections(processedNews)
    const questions = await this.createQuestions({ 
      newsItem: processedNews,
      summary, 
      keyPoints, 
      factsAndFigures, 
      backgroundContext, 
      upscAngle, 
      staticConnections, 
      probableQuestions: { prelims: [], mains: [] }, 
      relatedPYQs: [] 
    })
    const relatedPYQs = this.findRelatedPYQs(processedNews)
    
    return {
      newsItem: processedNews,
      summary,
      keyPoints,
      factsAndFigures,
      backgroundContext,
      upscAngle,
      staticConnections,
      probableQuestions: questions,
      relatedPYQs
    }
  }
  
  async createQuestions(analysis: NewsAnalysis): Promise<{
    prelims: PrelimsQuestion[]
    mains: MainsQuestion[]
  }> {
    const prelimsQuestions = this.generatePrelimsQuestions(analysis)
    const mainsQuestions = this.generateMainsQuestions(analysis)
    
    return {
      prelims: prelimsQuestions,
      mains: mainsQuestions
    }
  }
  
  private generateSummary(news: ProcessedNewsItem): {
    twoMinuteRead: string
    wordCount: number
  } {
    const content = news.content
    const title = news.title
    
    // Generate a concise summary (300 words target)
    let summary = `${title}\n\n`
    
    // Key announcement/development
    summary += this.extractMainPoint(content) + '\n\n'
    
    // Context and significance
    summary += this.generateContextParagraph(news) + '\n\n'
    
    // UPSC relevance
    summary += this.generateRelevanceParagraph(news) + '\n\n'
    
    // Key takeaways
    summary += this.generateTakeawaysParagraph(news)
    
    // Ensure approximately 300 words
    const words = summary.split(/\s+/)
    if (words.length > 300) {
      summary = words.slice(0, 300).join(' ') + '...'
    }
    
    return {
      twoMinuteRead: summary,
      wordCount: summary.split(/\s+/).length
    }
  }
  
  private extractKeyPoints(news: ProcessedNewsItem): string[] {
    const points: string[] = []
    const content = news.content
    
    // Extract based on news type
    if (news.source === 'PIB') {
      points.push(...this.extractGovernmentKeyPoints(content))
    } else if (news.source === 'TheHindu' || news.source === 'IndianExpress') {
      points.push(...this.extractAnalyticalKeyPoints(content))
    } else if (news.source === 'EconomicTimes') {
      points.push(...this.extractEconomicKeyPoints(content))
    } else if (news.source === 'DownToEarth') {
      points.push(...this.extractEnvironmentalKeyPoints(content))
    }
    
    // Ensure 5-7 key points
    return points.slice(0, 7)
  }
  
  private extractFactsAndFigures(news: ProcessedNewsItem): Array<{
    fact: string
    source: string
    importance: string
  }> {
    const facts: Array<{ fact: string; source: string; importance: string }> = []
    const content = news.content
    
    // Extract numbers and statistics
    const numberPatterns = [
      /Rs?\s?[\d,]+\s?(crore|lakh|billion|million)/gi,
      /\d+\.?\d*\s?%/g,
      /\d+\s?(GW|MW|MT|MMT)/gi,
      /\$\s?[\d,]+\s?(billion|million)/gi
    ]
    
    numberPatterns.forEach(pattern => {
      const matches = content.match(pattern) || []
      matches.forEach(match => {
        facts.push({
          fact: match.trim(),
          source: news.source,
          importance: this.assessFactImportance(match, news)
        })
      })
    })
    
    // Extract key dates
    const datePattern = /\d{4}[-\s]([\d]{2}|[\w]+)[-\s]\d{1,2}/g
    const dateMatches = content.match(datePattern) || []
    dateMatches.forEach(date => {
      facts.push({
        fact: `Timeline: ${date}`,
        source: news.source,
        importance: 'Medium'
      })
    })
    
    // Extract rankings and positions
    const rankingPattern = /(first|second|third|fourth|largest|biggest|top\s\d+)/gi
    const rankingMatches = content.match(rankingPattern) || []
    rankingMatches.forEach(ranking => {
      const context = this.extractSurroundingContext(content, ranking)
      facts.push({
        fact: context,
        source: news.source,
        importance: 'High'
      })
    })
    
    return facts.slice(0, 8)
  }
  
  private generateBackgroundContext(news: ProcessedNewsItem): string {
    let context = ''
    
    // Add subject-specific background
    switch (news.primarySubject) {
      case 'Polity':
        context = this.generatePolityBackground(news)
        break
      case 'Economy':
        context = this.generateEconomyBackground(news)
        break
      case 'Environment':
        context = this.generateEnvironmentBackground(news)
        break
      case 'International Relations':
        context = this.generateIRBackground(news)
        break
      default:
        context = this.generateGeneralBackground(news)
    }
    
    return context
  }
  
  private generateUPSCAngle(news: ProcessedNewsItem): string {
    let angle = 'UPSC Perspective:\n\n'
    
    // Prelims angle
    angle += `Prelims Focus: ${this.generatePrelimsAngle(news)}\n\n`
    
    // Mains angle
    angle += `Mains Relevance: ${this.generateMainsAngle(news)}\n\n`
    
    // Interview angle
    if (news.upscRelevanceScore > 80) {
      angle += `Interview Connect: ${this.generateInterviewAngle(news)}`
    }
    
    return angle
  }
  
  private identifyStaticConnections(news: ProcessedNewsItem): Array<{
    topic: string
    subject: SubjectArea
    connection: string
  }> {
    const connections: Array<{ topic: string; subject: SubjectArea; connection: string }> = []
    const content = news.content.toLowerCase()
    
    // Constitutional connections
    if (content.includes('article') || content.includes('amendment')) {
      connections.push({
        topic: 'Constitutional Framework',
        subject: 'Polity',
        connection: 'Links to constitutional provisions and amendments'
      })
    }
    
    // Historical connections
    if (content.includes('independence') || content.includes('colonial') || content.includes('historical')) {
      connections.push({
        topic: 'Modern Indian History',
        subject: 'History',
        connection: 'Historical evolution and precedents'
      })
    }
    
    // Economic theory connections
    if (content.includes('gdp') || content.includes('inflation') || content.includes('fiscal')) {
      connections.push({
        topic: 'Economic Concepts',
        subject: 'Economy',
        connection: 'Basic economic principles and theories'
      })
    }
    
    // Environmental connections
    if (content.includes('climate') || content.includes('sustainable') || content.includes('conservation')) {
      connections.push({
        topic: 'Environmental Geography',
        subject: 'Geography',
        connection: 'Environmental concepts and climate systems'
      })
    }
    
    // Add topic-specific connections based on primary subject
    connections.push(...this.getSubjectSpecificConnections(news))
    
    return connections.slice(0, 5)
  }
  
  private generatePrelimsQuestions(analysis: NewsAnalysis): PrelimsQuestion[] {
    const questions: PrelimsQuestion[] = []
    const news = analysis.newsItem
    
    // Question 1: Direct fact-based
    questions.push(this.createFactBasedQuestion(news, analysis.factsAndFigures))
    
    // Question 2: Statement-based
    questions.push(this.createStatementBasedQuestion(news, analysis.keyPoints))
    
    // Question 3: Match the following (if applicable)
    if (analysis.factsAndFigures.length >= 4) {
      questions.push(this.createMatchQuestion(news, analysis.factsAndFigures))
    }
    
    // Question 4: Application-based
    questions.push(this.createApplicationQuestion(news, analysis))
    
    // Question 5: Current affairs linked with static
    questions.push(this.createStaticLinkedQuestion(news, analysis.staticConnections))
    
    return questions.filter(q => q !== null)
  }
  
  private generateMainsQuestions(analysis: NewsAnalysis): MainsQuestion[] {
    const questions: MainsQuestion[] = []
    const news = analysis.newsItem
    
    // Analytical question
    questions.push({
      id: `mains-${news.id}-1`,
      question: this.generateAnalyticalQuestion(news, analysis),
      wordLimit: 250,
      paper: news.mainsRelevance.papers[0] || 'GS2',
      marks: 15,
      modelAnswerPoints: this.generateAnswerPoints(news, analysis, 'analytical'),
      approach: this.generateAnswerApproach('analytical')
    })
    
    // Critical evaluation question
    questions.push({
      id: `mains-${news.id}-2`,
      question: this.generateCriticalQuestion(news, analysis),
      wordLimit: 150,
      paper: news.mainsRelevance.papers[1] || news.mainsRelevance.papers[0] || 'GS3',
      marks: 10,
      modelAnswerPoints: this.generateAnswerPoints(news, analysis, 'critical'),
      approach: this.generateAnswerApproach('critical')
    })
    
    return questions
  }
  
  private findRelatedPYQs(news: ProcessedNewsItem): string[] {
    const pyqs: string[] = []
    
    // Based on subject and topic
    const subjectPYQs = this.getPYQsBySubject(news.primarySubject, news.syllabusTopic)
    pyqs.push(...subjectPYQs)
    
    // Based on keywords
    const keywordPYQs = this.getPYQsByKeywords(news.content)
    pyqs.push(...keywordPYQs)
    
    return pyqs.slice(0, 5)
  }
  
  // Helper methods
  
  private identifyPrimarySubject(content: string): SubjectArea {
    // Simple keyword-based identification
    if (content.includes('parliament') || content.includes('constitution') || content.includes('judiciary')) {
      return 'Polity'
    }
    if (content.includes('economy') || content.includes('gdp') || content.includes('inflation')) {
      return 'Economy'
    }
    if (content.includes('climate') || content.includes('environment') || content.includes('pollution')) {
      return 'Environment'
    }
    if (content.includes('foreign') || content.includes('bilateral') || content.includes('summit')) {
      return 'International Relations'
    }
    return 'Polity' // Default
  }
  
  private identifySecondarySubjects(content: string): SubjectArea[] {
    const subjects: SubjectArea[] = []
    
    const subjectKeywords = {
      'Economy': ['economic', 'financial', 'trade', 'market'],
      'Environment': ['environmental', 'climate', 'sustainable'],
      'Science & Technology': ['technology', 'digital', 'innovation'],
      'Social Issues': ['social', 'welfare', 'education', 'health']
    }
    
    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        subjects.push(subject as SubjectArea)
      }
    }
    
    return subjects.slice(0, 3)
  }
  
  private identifySyllabusTopics(content: string): string[] {
    const topics: string[] = []
    
    // Map content to syllabus topics
    const topicMapping = {
      'constitutional': ['Constitutional Framework', 'Fundamental Rights'],
      'parliament': ['Parliamentary System', 'Legislative Process'],
      'judiciary': ['Judicial System', 'Supreme Court'],
      'economy': ['Economic Development', 'Public Finance'],
      'climate': ['Climate Change', 'Environmental Conservation']
    }
    
    for (const [keyword, mappedTopics] of Object.entries(topicMapping)) {
      if (content.includes(keyword)) {
        topics.push(...mappedTopics)
      }
    }
    
    return [...new Set(topics)].slice(0, 5)
  }
  
  private extractMainPoint(content: string): string {
    // Extract the first 2-3 sentences as main point
    const sentences = content.match(/[^.!?]+[.!?]+/g) || []
    return sentences.slice(0, 2).join(' ').trim()
  }
  
  private generateContextParagraph(news: ProcessedNewsItem): string {
    return `This development is significant in the context of ${news.primarySubject}. ` +
           `It reflects the government's focus on ${news.syllabusTopic.join(' and ')}. ` +
           `The timing is crucial given recent developments in this sector.`
  }
  
  private generateRelevanceParagraph(news: ProcessedNewsItem): string {
    return `From UPSC perspective, this news is highly relevant for ${news.mainsRelevance.papers.join(', ')}. ` +
           `It connects with fundamental concepts of ${news.primarySubject} and has implications for policy analysis. ` +
           `Candidates should understand both the immediate impact and long-term consequences.`
  }
  
  private generateTakeawaysParagraph(news: ProcessedNewsItem): string {
    return `Key takeaways: Understanding this development helps in answering questions on ${news.syllabusTopic.join(', ')}. ` +
           `It exemplifies the practical application of theoretical concepts and provides contemporary examples for answer writing.`
  }
  
  private extractGovernmentKeyPoints(content: string): string[] {
    const points: string[] = []
    
    // Look for government actions
    const actionPatterns = [
      /cabinet\s+approved[^.]+/gi,
      /government\s+launched[^.]+/gi,
      /ministry\s+announced[^.]+/gi,
      /scheme\s+aims[^.]+/gi
    ]
    
    actionPatterns.forEach(pattern => {
      const matches = content.match(pattern) || []
      matches.forEach(match => points.push(match.trim()))
    })
    
    return points
  }
  
  private extractAnalyticalKeyPoints(content: string): string[] {
    const points: string[] = []
    
    // Look for analytical statements
    const sentences = content.split('.')
    sentences.forEach(sentence => {
      if (sentence.includes('impact') || sentence.includes('significance') || 
          sentence.includes('challenge') || sentence.includes('implication')) {
        points.push(sentence.trim())
      }
    })
    
    return points
  }
  
  private extractEconomicKeyPoints(content: string): string[] {
    const points: string[] = []
    
    // Extract economic indicators and policies
    const sentences = content.split('.')
    sentences.forEach(sentence => {
      if (sentence.match(/\d+\.?\d*\s?%/) || sentence.includes('crore') || 
          sentence.includes('policy') || sentence.includes('growth')) {
        points.push(sentence.trim())
      }
    })
    
    return points
  }
  
  private extractEnvironmentalKeyPoints(content: string): string[] {
    const points: string[] = []
    
    // Extract environmental data and impacts
    const sentences = content.split('.')
    sentences.forEach(sentence => {
      if (sentence.includes('climate') || sentence.includes('emission') || 
          sentence.includes('conservation') || sentence.includes('sustainable')) {
        points.push(sentence.trim())
      }
    })
    
    return points
  }
  
  private assessFactImportance(fact: string, news: ProcessedNewsItem): string {
    // Assess based on magnitude and relevance
    if (fact.includes('crore') || fact.includes('billion')) return 'High'
    if (fact.includes('first') || fact.includes('largest')) return 'High'
    if (news.upscRelevanceScore > 80) return 'High'
    return 'Medium'
  }
  
  private extractSurroundingContext(content: string, keyword: string): string {
    const index = content.toLowerCase().indexOf(keyword.toLowerCase())
    if (index === -1) return keyword
    
    const start = Math.max(0, index - 30)
    const end = Math.min(content.length, index + keyword.length + 30)
    
    return '...' + content.substring(start, end).trim() + '...'
  }
  
  private generatePolityBackground(news: ProcessedNewsItem): string {
    return `This development relates to India's constitutional and political framework. ` +
           `Understanding the constitutional provisions, institutional mechanisms, and ` +
           `democratic processes is essential to grasp the full implications. ` +
           `The issue connects with principles of governance, federalism, and rule of law.`
  }
  
  private generateEconomyBackground(news: ProcessedNewsItem): string {
    return `This economic development must be understood in the context of India's ` +
           `growth trajectory and policy framework. Key economic concepts like ` +
           `fiscal management, monetary policy, and structural reforms provide the ` +
           `theoretical foundation for analyzing such developments.`
  }
  
  private generateEnvironmentBackground(news: ProcessedNewsItem): string {
    return `Environmental issues require understanding of ecological principles, ` +
           `climate science, and sustainable development concepts. India's commitments ` +
           `under international agreements and national policies form the backdrop ` +
           `for such developments.`
  }
  
  private generateIRBackground(news: ProcessedNewsItem): string {
    return `International relations involve complex interplay of national interests, ` +
           `diplomatic strategies, and global governance mechanisms. Understanding ` +
           `India's foreign policy principles and regional dynamics is crucial.`
  }
  
  private generateGeneralBackground(news: ProcessedNewsItem): string {
    return `This development reflects broader trends in governance and policy-making. ` +
           `It connects with multiple aspects of the UPSC syllabus and requires ` +
           `interdisciplinary understanding.`
  }
  
  private generatePrelimsAngle(news: ProcessedNewsItem): string {
    return `Key facts, figures, and timelines mentioned. Focus on specific provisions, ` +
           `institutional roles, and comparative aspects.`
  }
  
  private generateMainsAngle(news: ProcessedNewsItem): string {
    return `Analytical dimensions include impact assessment, stakeholder analysis, ` +
           `challenges in implementation, and way forward. Links to broader themes ` +
           `of governance, development, and social justice.`
  }
  
  private generateInterviewAngle(news: ProcessedNewsItem): string {
    return `Personal opinion on the issue, ethical dimensions, and practical ` +
           `solutions from an administrator's perspective.`
  }
  
  private getSubjectSpecificConnections(news: ProcessedNewsItem): Array<{
    topic: string
    subject: SubjectArea
    connection: string
  }> {
    const connections: Array<{ topic: string; subject: SubjectArea; connection: string }> = []
    
    switch (news.primarySubject) {
      case 'Polity':
        connections.push({
          topic: 'Indian Constitution',
          subject: 'Polity',
          connection: 'Fundamental principles and institutional framework'
        })
        break
      case 'Economy':
        connections.push({
          topic: 'Economic Survey',
          subject: 'Economy',
          connection: 'Annual economic trends and policy recommendations'
        })
        break
    }
    
    return connections
  }
  
  private createFactBasedQuestion(
    news: ProcessedNewsItem, 
    facts: Array<{ fact: string; source: string; importance: string }>
  ): PrelimsQuestion {
    if (!news) {
      throw new Error('News item is undefined in createFactBasedQuestion')
    }
    const question = `According to recent developments in ${news.title}, which of the following is correct?`
    const correctFact = facts && facts.length > 0 ? facts[0].fact : 'Key development announced'
    
    return {
      id: `prelims-${news.id}-1`,
      question,
      options: [
        correctFact,
        this.generateDistractor(correctFact, 'numerical'),
        this.generateDistractor(correctFact, 'conceptual'),
        'None of the above'
      ],
      correctAnswer: 0,
      explanation: `The correct answer is based on the official announcement/data. ${correctFact} is the accurate figure/fact.`,
      difficulty: 'Easy',
      topic: news.syllabusTopic[0] || 'Current Affairs'
    }
  }
  
  private createStatementBasedQuestion(news: ProcessedNewsItem, keyPoints: string[]): PrelimsQuestion {
    const statements = keyPoints.slice(0, 2).map((point, i) => `${i + 1}. ${point}`)
    
    return {
      id: `prelims-${news.id}-2`,
      question: `Consider the following statements:\n${statements.join('\n')}\n\nWhich of the above statements is/are correct?`,
      options: [
        '1 only',
        '2 only',
        'Both 1 and 2',
        'Neither 1 nor 2'
      ],
      correctAnswer: 2,
      explanation: 'Both statements are correct as per the recent development.',
      difficulty: 'Medium',
      topic: news.syllabusTopic[0] || 'Current Affairs'
    }
  }
  
  private createMatchQuestion(
    news: ProcessedNewsItem, 
    facts: Array<{ fact: string; source: string; importance: string }>
  ): PrelimsQuestion {
    return {
      id: `prelims-${news.id}-3`,
      question: 'Match the following aspects of the recent development:',
      options: [
        'A-1, B-2, C-3',
        'A-2, B-3, C-1',
        'A-3, B-1, C-2',
        'A-1, B-3, C-2'
      ],
      correctAnswer: 0,
      explanation: 'The correct matching is based on the factual information provided.',
      difficulty: 'Medium',
      topic: news.syllabusTopic[0] || 'Current Affairs'
    }
  }
  
  private createApplicationQuestion(news: ProcessedNewsItem, analysis: NewsAnalysis): PrelimsQuestion {
    return {
      id: `prelims-${news.id}-4`,
      question: `The recent ${news.title} is significant because:`,
      options: [
        analysis.upscAngle.substring(0, 100),
        this.generateDistractor(analysis.upscAngle, 'conceptual'),
        this.generateDistractor(analysis.upscAngle, 'opposite'),
        'It has no major policy implications'
      ],
      correctAnswer: 0,
      explanation: 'The significance lies in its policy implications and broader impact.',
      difficulty: 'Hard',
      topic: news.syllabusTopic[0] || 'Current Affairs'
    }
  }
  
  private createStaticLinkedQuestion(
    news: ProcessedNewsItem,
    connections: Array<{ topic: string; subject: SubjectArea; connection: string }>
  ): PrelimsQuestion {
    const connection = connections[0]
    
    return {
      id: `prelims-${news.id}-5`,
      question: `The ${news.title} relates to which fundamental concept in ${connection?.subject || news.primarySubject}?`,
      options: [
        connection?.topic || 'Constitutional Framework',
        this.generateDistractor(connection?.topic || '', 'related'),
        this.generateDistractor(connection?.topic || '', 'unrelated'),
        'None of the above'
      ],
      correctAnswer: 0,
      explanation: `This development directly connects with ${connection?.topic || 'core concepts'} in the UPSC syllabus.`,
      difficulty: 'Medium',
      topic: connection?.topic || news.syllabusTopic[0] || 'Current Affairs'
    }
  }
  
  private generateDistractor(correct: string, type: string): string {
    switch (type) {
      case 'numerical':
        // Change numbers in the string
        return correct.replace(/\d+/g, (match) => String(parseInt(match) * 1.2))
      case 'conceptual':
        // Replace key concepts
        return correct.replace(/development|growth|increase/gi, 'decline')
      case 'opposite':
        // Create opposite meaning
        return correct.replace(/approved|launched|increased/gi, 'rejected')
      case 'related':
        // Related but different concept
        return 'Related Constitutional Provision'
      case 'unrelated':
        // Completely unrelated
        return 'Historical Evolution'
      default:
        return 'Alternative option'
    }
  }
  
  private generateAnalyticalQuestion(news: ProcessedNewsItem, analysis: NewsAnalysis): string {
    return `Analyze the implications of ${news.title} on India's ${news.primarySubject.toLowerCase()} landscape. ` +
           `Discuss the challenges and suggest measures for effective implementation. (250 words)`
  }
  
  private generateCriticalQuestion(news: ProcessedNewsItem, analysis: NewsAnalysis): string {
    return `Critically evaluate the ${news.title} in the context of ${news.syllabusTopic[0]}. ` +
           `What are the potential benefits and concerns? (150 words)`
  }
  
  private generateAnswerPoints(news: ProcessedNewsItem, analysis: NewsAnalysis, type: string): string[] {
    const points: string[] = []
    
    if (type === 'analytical') {
      points.push(
        `Introduction: Brief context of ${news.title}`,
        `Key provisions/features of the development`,
        `Positive implications: ${analysis.keyPoints.slice(0, 2).join('; ')}`,
        `Challenges: Implementation issues, resource constraints, coordination`,
        `Way forward: Policy recommendations, best practices`,
        `Conclusion: Balanced assessment with future outlook`
      )
    } else if (type === 'critical') {
      points.push(
        `Introduction: Overview of the issue`,
        `Arguments in favor: ${analysis.keyPoints[0]}`,
        `Arguments against: Potential drawbacks or limitations`,
        `Balanced perspective: Weighing pros and cons`,
        `Conclusion: Overall assessment`
      )
    }
    
    return points
  }
  
  private generateAnswerApproach(type: string): string {
    if (type === 'analytical') {
      return 'Start with context, analyze multiple dimensions, provide balanced view with examples, suggest practical solutions'
    }
    return 'Present both sides objectively, use facts and examples, maintain critical perspective, conclude with balanced view'
  }
  
  private getPYQsBySubject(subject: SubjectArea, topics: string[]): string[] {
    const pyqDatabase: Record<string, string[]> = {
      'Polity': [
        '2023 Prelims - Q on Constitutional amendments and federal structure',
        '2022 Mains GS2 - Role of judiciary in governance',
        '2021 Prelims - Fundamental rights and reasonable restrictions'
      ],
      'Economy': [
        '2023 Prelims - Questions on monetary policy and inflation',
        '2022 Mains GS3 - Economic recovery post-pandemic',
        '2021 Prelims - Government schemes and fiscal policy'
      ],
      'Environment': [
        '2023 Prelims - Climate change commitments and COP',
        '2022 Mains GS3 - Sustainable development and conservation',
        '2021 Prelims - Environmental laws and biodiversity'
      ]
    }
    
    return pyqDatabase[subject] || ['Previous year questions on current developments']
  }
  
  private getPYQsByKeywords(content: string): string[] {
    const pyqs: string[] = []
    
    // Simple keyword matching with PYQ database
    if (content.toLowerCase().includes('supreme court')) {
      pyqs.push('2022 Prelims - Supreme Court judgments on fundamental rights')
    }
    if (content.toLowerCase().includes('economy')) {
      pyqs.push('2023 Mains GS3 - Economic reforms and growth')
    }
    
    return pyqs
  }
}