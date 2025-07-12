import { NewsItem, ProcessedNewsItem, RelevanceFilter, RelevanceScoreFactors } from '../types'

export class UPSCRelevanceFilter implements RelevanceFilter {
  
  private syllabusKeywords = {
    polity: [
      'constitution', 'parliament', 'judiciary', 'supreme court', 'high court',
      'president', 'prime minister', 'governor', 'election', 'democracy',
      'fundamental rights', 'directive principles', 'amendment', 'article',
      'bill', 'act', 'legislation', 'federalism', 'panchayat', 'municipality'
    ],
    economy: [
      'gdp', 'inflation', 'budget', 'fiscal', 'monetary', 'rbi', 'repo rate',
      'economy', 'trade', 'export', 'import', 'manufacturing', 'agriculture',
      'industry', 'service sector', 'employment', 'poverty', 'development',
      'finance', 'banking', 'insurance', 'stock market', 'investment'
    ],
    geography: [
      'climate', 'monsoon', 'river', 'mountain', 'plateau', 'coastal',
      'natural resources', 'minerals', 'forest', 'wildlife', 'biodiversity',
      'disaster', 'earthquake', 'cyclone', 'flood', 'drought', 'urbanization'
    ],
    history: [
      'ancient', 'medieval', 'modern', 'independence', 'freedom struggle',
      'colonial', 'british', 'mughal', 'maurya', 'gupta', 'architecture',
      'culture', 'heritage', 'monument', 'archaeological'
    ],
    environment: [
      'climate change', 'global warming', 'pollution', 'conservation',
      'sustainable', 'renewable energy', 'solar', 'wind', 'biodiversity',
      'forest', 'wildlife', 'ecosystem', 'carbon', 'emissions', 'green'
    ],
    science: [
      'technology', 'space', 'isro', 'satellite', 'nuclear', 'biotechnology',
      'artificial intelligence', 'digital', 'cyber', 'innovation', 'research',
      'scientific', 'discovery', 'health', 'medicine', 'vaccine'
    ],
    international: [
      'foreign policy', 'diplomacy', 'bilateral', 'multilateral', 'united nations',
      'g20', 'brics', 'saarc', 'asean', 'trade agreement', 'treaty',
      'international relations', 'global', 'summit', 'cooperation'
    ],
    social: [
      'education', 'health', 'poverty', 'inequality', 'gender', 'women',
      'child', 'tribal', 'minority', 'caste', 'reservation', 'welfare',
      'scheme', 'social justice', 'empowerment', 'development'
    ]
  }
  
  async calculateRelevanceScore(newsItem: NewsItem): Promise<number> {
    const factors = await this.getScoreBreakdown(newsItem)
    
    // Calculate weighted score
    const totalScore = 
      factors.syllabusMatch +
      factors.governmentPolicy +
      factors.constitutionalImportance +
      factors.internationalImpact +
      factors.economicImplications +
      factors.environmentalSignificance +
      factors.historicalPrecedent
    
    return Math.min(totalScore, 100)
  }
  
  async getScoreBreakdown(newsItem: NewsItem): Promise<RelevanceScoreFactors> {
    const content = (newsItem.title + ' ' + newsItem.content).toLowerCase()
    
    return {
      syllabusMatch: this.calculateSyllabusMatch(content, newsItem.tags),
      governmentPolicy: this.calculateGovernmentPolicyScore(content, newsItem.source),
      constitutionalImportance: this.calculateConstitutionalScore(content),
      internationalImpact: this.calculateInternationalScore(content),
      economicImplications: this.calculateEconomicScore(content),
      environmentalSignificance: this.calculateEnvironmentalScore(content),
      historicalPrecedent: this.calculateHistoricalScore(content)
    }
  }
  
  async filterByRelevance(newsItems: NewsItem[], threshold: number): Promise<ProcessedNewsItem[]> {
    const processedItems: ProcessedNewsItem[] = []
    
    for (const item of newsItems) {
      const relevanceScore = await this.calculateRelevanceScore(item)
      
      if (relevanceScore >= threshold) {
        const processedItem = await this.processNewsItem(item, relevanceScore)
        processedItems.push(processedItem)
      }
    }
    
    // Sort by relevance score (highest first)
    processedItems.sort((a, b) => b.upscRelevanceScore - a.upscRelevanceScore)
    
    return processedItems
  }
  
  private calculateSyllabusMatch(content: string, tags: string[]): number {
    let score = 0
    let matchedSubjects = 0
    
    // Check each subject area
    for (const [subject, keywords] of Object.entries(this.syllabusKeywords)) {
      const subjectMatches = keywords.filter(keyword => 
        content.includes(keyword) || tags.some(tag => tag.toLowerCase().includes(keyword))
      ).length
      
      if (subjectMatches > 0) {
        matchedSubjects++
        score += Math.min(subjectMatches * 2, 8)
      }
    }
    
    // Bonus for multi-subject relevance
    if (matchedSubjects > 1) {
      score += matchedSubjects * 2
    }
    
    return Math.min(score, 25)
  }
  
  private calculateGovernmentPolicyScore(content: string, source: string): number {
    let score = 0
    
    // PIB source gets automatic points
    if (source === 'PIB') {
      score += 5
    }
    
    const policyKeywords = [
      'cabinet', 'ministry', 'government', 'policy', 'scheme', 'programme',
      'initiative', 'mission', 'yojana', 'bill', 'act', 'ordinance',
      'budget', 'announcement', 'launched', 'approved'
    ]
    
    const matches = policyKeywords.filter(keyword => content.includes(keyword)).length
    score += Math.min(matches * 3, 15)
    
    return Math.min(score, 20)
  }
  
  private calculateConstitutionalScore(content: string): number {
    let score = 0
    
    const constitutionalKeywords = [
      'constitution', 'fundamental', 'article', 'amendment', 'supreme court',
      'high court', 'judiciary', 'parliament', 'legislative', 'executive',
      'federal', 'rights', 'duties', 'directive principles', 'judgment'
    ]
    
    const highValueKeywords = [
      'constitutional amendment', 'supreme court judgment', 'fundamental rights',
      'article 370', 'basic structure', 'judicial review'
    ]
    
    // Regular keywords
    const matches = constitutionalKeywords.filter(keyword => content.includes(keyword)).length
    score += Math.min(matches * 2, 10)
    
    // High value phrases
    const highValueMatches = highValueKeywords.filter(phrase => content.includes(phrase)).length
    score += highValueMatches * 3
    
    return Math.min(score, 15)
  }
  
  private calculateInternationalScore(content: string): number {
    let score = 0
    
    const internationalKeywords = [
      'g20', 'g7', 'brics', 'saarc', 'asean', 'united nations', 'un',
      'bilateral', 'multilateral', 'summit', 'treaty', 'agreement',
      'foreign', 'diplomacy', 'ambassador', 'visa', 'trade', 'fta'
    ]
    
    const regionalKeywords = [
      'china', 'pakistan', 'bangladesh', 'sri lanka', 'nepal', 'bhutan',
      'myanmar', 'usa', 'russia', 'japan', 'australia', 'uk', 'eu'
    ]
    
    const matches = internationalKeywords.filter(keyword => content.includes(keyword)).length
    const regionalMatches = regionalKeywords.filter(keyword => content.includes(keyword)).length
    
    score += Math.min(matches * 2, 6)
    score += Math.min(regionalMatches * 1, 4)
    
    return Math.min(score, 10)
  }
  
  private calculateEconomicScore(content: string): number {
    let score = 0
    
    const economicIndicators = [
      'gdp', 'inflation', 'unemployment', 'fiscal deficit', 'current account',
      'exports', 'imports', 'fdi', 'investment', 'growth rate'
    ]
    
    const economicPolicies = [
      'monetary policy', 'fiscal policy', 'budget', 'taxation', 'gst',
      'reform', 'liberalization', 'privatization', 'disinvestment'
    ]
    
    const indicatorMatches = economicIndicators.filter(keyword => content.includes(keyword)).length
    const policyMatches = economicPolicies.filter(keyword => content.includes(keyword)).length
    
    score += Math.min(indicatorMatches * 2, 5)
    score += Math.min(policyMatches * 2, 5)
    
    return Math.min(score, 10)
  }
  
  private calculateEnvironmentalScore(content: string): number {
    let score = 0
    
    const environmentKeywords = [
      'climate change', 'global warming', 'carbon', 'emissions', 'renewable',
      'sustainable', 'conservation', 'biodiversity', 'pollution', 'green'
    ]
    
    const criticalTopics = [
      'cop', 'paris agreement', 'net zero', 'carbon neutral', 'climate summit',
      'ipcc', 'unfccc', 'green hydrogen', 'electric vehicle'
    ]
    
    const matches = environmentKeywords.filter(keyword => content.includes(keyword)).length
    const criticalMatches = criticalTopics.filter(topic => content.includes(topic)).length
    
    score += Math.min(matches * 1, 5)
    score += criticalMatches * 3
    
    return Math.min(score, 10)
  }
  
  private calculateHistoricalScore(content: string): number {
    let score = 0
    
    const historicalKeywords = [
      'first', 'landmark', 'historic', 'unprecedented', 'milestone',
      'anniversary', 'commemoration', 'legacy', 'heritage'
    ]
    
    const matches = historicalKeywords.filter(keyword => content.includes(keyword)).length
    score += Math.min(matches * 2, 10)
    
    return score
  }
  
  private async processNewsItem(item: NewsItem, relevanceScore: number): Promise<ProcessedNewsItem> {
    const content = (item.title + ' ' + item.content).toLowerCase()
    
    // Determine primary subject
    const subjectScores = this.calculateSubjectScores(content, item.tags)
    const primarySubject = this.determinePrimarySubject(subjectScores)
    const secondarySubjects = this.determineSecondarySubjects(subjectScores, primarySubject)
    
    // Determine syllabus topics
    const syllabusTopic = this.identifySyllabusTopics(content, primarySubject)
    
    // Calculate question probability
    const questionProbability = this.calculateQuestionProbability(relevanceScore, item)
    
    // Determine prelims and mains relevance
    const prelimsRelevance = this.determinePrelimsRelevance(content, relevanceScore)
    const mainsRelevance = this.determineMainsRelevance(content, primarySubject)
    
    return {
      ...item,
      upscRelevanceScore: relevanceScore,
      primarySubject,
      secondarySubjects,
      syllabusTopic,
      prelimsRelevance,
      mainsRelevance,
      questionProbability,
      processingMetadata: {
        processedAt: new Date(),
        version: '1.0.0',
        confidence: this.calculateConfidence(relevanceScore)
      }
    }
  }
  
  private calculateSubjectScores(content: string, tags: string[]): Record<string, number> {
    const scores: Record<string, number> = {}
    
    for (const [subject, keywords] of Object.entries(this.syllabusKeywords)) {
      const matches = keywords.filter(keyword => 
        content.includes(keyword) || tags.some(tag => tag.toLowerCase().includes(keyword))
      ).length
      
      scores[subject] = matches
    }
    
    return scores
  }
  
  private determinePrimarySubject(scores: Record<string, number>): any {
    const sortedSubjects = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
    
    const topSubject = sortedSubjects[0]?.[0] || 'Current Affairs'
    
    // Map to proper SubjectArea type
    const subjectMapping: Record<string, any> = {
      'polity': 'Polity',
      'economy': 'Economy',
      'geography': 'Geography',
      'history': 'History',
      'environment': 'Environment',
      'science': 'Science & Technology',
      'international': 'International Relations',
      'social': 'Social Issues'
    }
    
    return subjectMapping[topSubject] || 'Current Affairs'
  }
  
  private determineSecondarySubjects(scores: Record<string, number>, primarySubject: string): any[] {
    const secondarySubjects: any[] = []
    
    const subjectMapping: Record<string, any> = {
      'polity': 'Polity',
      'economy': 'Economy',
      'geography': 'Geography',
      'history': 'History',
      'environment': 'Environment',
      'science': 'Science & Technology',
      'international': 'International Relations',
      'social': 'Social Issues'
    }
    
    for (const [subject, score] of Object.entries(scores)) {
      const mappedSubject = subjectMapping[subject]
      if (score > 0 && mappedSubject !== primarySubject) {
        secondarySubjects.push(mappedSubject)
      }
    }
    
    return secondarySubjects.slice(0, 3) // Limit to top 3
  }
  
  private identifySyllabusTopics(content: string, primarySubject: string): string[] {
    const topics: string[] = []
    
    // Subject-specific topic mapping
    const topicMappings: Record<string, Record<string, string>> = {
      'Polity': {
        'parliament': 'Parliamentary System',
        'judiciary': 'Judicial System',
        'fundamental rights': 'Fundamental Rights',
        'election': 'Electoral System',
        'federalism': 'Centre-State Relations',
        'local government': 'Local Governance'
      },
      'Economy': {
        'budget': 'Public Finance',
        'monetary policy': 'Money and Banking',
        'agriculture': 'Agricultural Economy',
        'industry': 'Industrial Policy',
        'trade': 'International Trade',
        'employment': 'Employment and Skill Development'
      },
      'Environment': {
        'climate change': 'Climate Change',
        'biodiversity': 'Biodiversity Conservation',
        'pollution': 'Environmental Pollution',
        'renewable energy': 'Renewable Energy',
        'conservation': 'Environmental Conservation'
      }
    }
    
    const subjectTopics = topicMappings[primarySubject] || {}
    
    for (const [keyword, topic] of Object.entries(subjectTopics)) {
      if (content.includes(keyword)) {
        topics.push(topic)
      }
    }
    
    return topics.length > 0 ? topics : ['Current Developments']
  }
  
  private calculateQuestionProbability(relevanceScore: number, item: NewsItem): number {
    let probability = relevanceScore * 0.5 // Base probability
    
    // Boost for certain sources
    if (item.source === 'PIB') probability += 10
    if (item.source === 'TheHindu') probability += 5
    
    // Boost for recent events
    const daysSincePublished = (Date.now() - item.publishedDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSincePublished < 30) probability += 10
    if (daysSincePublished < 7) probability += 5
    
    // Boost for certain tags
    const highProbabilityTags = ['budget', 'constitutional amendment', 'supreme court', 'election', 'scheme']
    const tagBoost = item.tags.filter(tag => 
      highProbabilityTags.some(hpt => tag.toLowerCase().includes(hpt))
    ).length
    probability += tagBoost * 5
    
    return Math.min(probability, 95)
  }
  
  private determinePrelimsRelevance(content: string, relevanceScore: number): any {
    // Prelims focuses on facts and current events
    const factsKeywords = ['launched', 'approved', 'announced', 'first', 'largest', 'highest']
    const factualContent = factsKeywords.filter(keyword => content.includes(keyword)).length
    
    if (relevanceScore > 80 || factualContent > 3) return 'High'
    if (relevanceScore > 60 || factualContent > 1) return 'Medium'
    return 'Low'
  }
  
  private determineMainsRelevance(content: string, primarySubject: string): any {
    const papers: any[] = []
    let relevanceLevel: any = 'Low'
    
    // GS Paper mapping
    const paperMapping = {
      'History': ['GS1'],
      'Geography': ['GS1', 'GS3'],
      'Social Issues': ['GS1', 'GS2'],
      'Polity': ['GS2'],
      'International Relations': ['GS2'],
      'Economy': ['GS3'],
      'Environment': ['GS3'],
      'Science & Technology': ['GS3'],
      'Ethics': ['GS4']
    }
    
    papers.push(...(paperMapping[primarySubject] || []))
    
    // Check for analytical content
    const analyticalKeywords = ['impact', 'significance', 'challenges', 'implications', 'analysis']
    const analyticalContent = analyticalKeywords.filter(keyword => content.includes(keyword)).length
    
    if (analyticalContent > 2) {
      relevanceLevel = 'High'
      papers.push('Essay')
    } else if (analyticalContent > 0) {
      relevanceLevel = 'Medium'
    }
    
    return { papers: [...new Set(papers)], relevanceLevel }
  }
  
  private calculateConfidence(relevanceScore: number): number {
    // Confidence based on relevance score
    if (relevanceScore > 85) return 0.95
    if (relevanceScore > 70) return 0.85
    if (relevanceScore > 60) return 0.75
    return 0.65
  }
}