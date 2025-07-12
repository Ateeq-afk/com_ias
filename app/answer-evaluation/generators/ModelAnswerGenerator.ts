import { Question, ModelAnswer } from '../types'

export class ModelAnswerGenerator {
  private answerTemplates = {
    'GS1': {
      introduction: 'The question pertains to {topic} which holds significant importance in understanding {context}.',
      bodyStructure: ['Historical background', 'Key features/characteristics', 'Evolution over time', 'Contemporary relevance'],
      conclusion: 'Thus, {topic} continues to shape {relevance} and requires {action}.'
    },
    'GS2': {
      introduction: 'The issue of {topic} is crucial for effective governance and {relevance}.',
      bodyStructure: ['Constitutional provisions', 'Current challenges', 'Government initiatives', 'Way forward'],
      conclusion: 'Therefore, strengthening {topic} requires {recommendations}.'
    },
    'GS3': {
      introduction: '{topic} plays a vital role in India\'s economic development and {context}.',
      bodyStructure: ['Current status', 'Challenges faced', 'Government policies', 'Recommendations'],
      conclusion: 'Hence, addressing these challenges through {solutions} is essential for sustainable development.'
    },
    'GS4': {
      introduction: 'The ethical dilemma presented highlights the tension between {conflicting_values}.',
      bodyStructure: ['Stakeholder analysis', 'Ethical considerations', 'Available options', 'Recommended course of action'],
      conclusion: 'The chosen approach balances {values} while ensuring {outcome}.'
    }
  }

  private keywordDatabase = {
    'Ancient History': ['Indus Valley', 'Harappan', 'Vedic period', 'Mauryan', 'Gupta', 'archaeological evidence'],
    'Medieval History': ['Sultanate', 'Mughal', 'Vijayanagara', 'Maratha', 'composite culture', 'syncretism'],
    'Modern History': ['colonial rule', 'freedom struggle', 'nationalism', 'partition', 'independence movement'],
    'Polity': ['Constitution', 'fundamental rights', 'directive principles', 'parliamentary system', 'federalism'],
    'Geography': ['monsoon', 'Western Ghats', 'Indo-Gangetic plain', 'mineral resources', 'climate change'],
    'Economy': ['GDP', 'fiscal policy', 'monetary policy', 'agriculture', 'industry', 'services sector'],
    'Ethics': ['integrity', 'probity', 'accountability', 'transparency', 'moral values', 'ethical dilemma']
  }

  private currentAffairsExamples = {
    '2024': [
      'Digital India initiatives',
      'New Education Policy implementation',
      'Climate change commitments',
      'Atmanirbhar Bharat',
      'PM-KISAN scheme',
      'Smart Cities Mission'
    ],
    '2025': [
      'Sustainable Development Goals',
      'Green hydrogen mission',
      'ONDC implementation',
      'UPI expansion',
      'AI and governance',
      'Space sector reforms'
    ]
  }

  generateModelAnswer(question: Question, wordLimit: number = 250): ModelAnswer {
    const template = this.answerTemplates[question.subject]
    if (!template) {
      throw new Error(`No template available for subject: ${question.subject}`)
    }

    const content = this.buildAnswerContent(question, template, wordLimit)
    
    return {
      id: `model-${question.id}-${Date.now()}`,
      content,
      wordCount: this.countWords(content),
      approach: this.determineApproach(question),
      score: 85, // Model answers typically score high
      author: 'ai',
      style: this.determineStyle(question)
    }
  }

  generateMultipleVariations(question: Question, wordLimit: number = 250): ModelAnswer[] {
    const variations: ModelAnswer[] = []

    // Formal academic approach
    variations.push(this.generateFormalAnswer(question, wordLimit))

    // Analytical approach
    variations.push(this.generateAnalyticalAnswer(question, wordLimit))

    // Contemporary approach
    variations.push(this.generateContemporaryAnswer(question, wordLimit))

    return variations
  }

  private buildAnswerContent(question: Question, template: any, wordLimit: number): string {
    const targetWordsPerSection = this.calculateSectionWords(wordLimit)
    
    // Introduction
    const introduction = this.generateIntroduction(question, template, targetWordsPerSection.introduction)
    
    // Body paragraphs
    const bodyParagraphs = this.generateBodyParagraphs(question, template, targetWordsPerSection.body)
    
    // Conclusion
    const conclusion = this.generateConclusion(question, template, targetWordsPerSection.conclusion)

    return [introduction, ...bodyParagraphs, conclusion].join('\n\n')
  }

  private calculateSectionWords(totalWords: number) {
    return {
      introduction: Math.round(totalWords * 0.15), // 15%
      body: Math.round(totalWords * 0.70), // 70%
      conclusion: Math.round(totalWords * 0.15)  // 15%
    }
  }

  private generateIntroduction(question: Question, template: any, targetWords: number): string {
    const context = this.extractContext(question)
    const relevance = this.determineRelevance(question)
    
    let intro = template.introduction
      .replace('{topic}', question.topic)
      .replace('{context}', context)
      .replace('{relevance}', relevance)

    // Add current affairs context if relevant
    if (this.needsCurrentAffairs(question)) {
      const currentExample = this.getCurrentAffairsExample(question)
      intro += ` Recent developments such as ${currentExample} highlight its contemporary significance.`
    }

    return this.adjustLength(intro, targetWords)
  }

  private generateBodyParagraphs(question: Question, template: any, targetWords: number): string[] {
    const wordsPerParagraph = Math.round(targetWords / template.bodyStructure.length)
    const paragraphs: string[] = []

    template.bodyStructure.forEach((section: string, index: number) => {
      const content = this.generateSectionContent(question, section, wordsPerParagraph)
      paragraphs.push(content)
    })

    return paragraphs
  }

  private generateSectionContent(question: Question, section: string, targetWords: number): string {
    const keywords = this.getRelevantKeywords(question)
    const examples = this.getRelevantExamples(question, section)
    
    let content = `**${section}:**\n`
    
    switch (section.toLowerCase()) {
      case 'historical background':
        content += this.generateHistoricalContent(question, keywords, targetWords - 20)
        break
      case 'current challenges':
        content += this.generateChallengesContent(question, keywords, targetWords - 20)
        break
      case 'government initiatives':
        content += this.generateInitiativesContent(question, keywords, targetWords - 20)
        break
      case 'way forward':
      case 'recommendations':
        content += this.generateRecommendationsContent(question, keywords, targetWords - 20)
        break
      default:
        content += this.generateGenericContent(question, section, keywords, targetWords - 20)
    }

    if (examples.length > 0) {
      content += ` For example, ${examples[0]}.`
    }

    return this.adjustLength(content, targetWords)
  }

  private generateHistoricalContent(question: Question, keywords: string[], targetWords: number): string {
    const historicalContext = [
      `The historical evolution of ${question.topic} can be traced back to ancient times.`,
      `During the medieval period, significant developments occurred in this area.`,
      `The colonial period brought substantial changes that continue to influence contemporary approaches.`,
      `Post-independence policies have shaped the current framework.`
    ]

    let content = historicalContext.slice(0, 2).join(' ')
    content += ` Key aspects include ${keywords.slice(0, 3).join(', ')}.`
    
    return this.adjustLength(content, targetWords)
  }

  private generateChallengesContent(question: Question, keywords: string[], targetWords: number): string {
    const challenges = [
      'Implementation gaps at the grassroots level',
      'Lack of adequate funding and resources',
      'Coordination issues between different agencies',
      'Technological and infrastructure constraints',
      'Socio-cultural barriers to change'
    ]

    let content = `Several challenges impede effective ${question.topic}. `
    content += `These include ${challenges.slice(0, 3).join(', ')}.`
    content += ` Additionally, issues related to ${keywords.slice(0, 2).join(' and ')} require immediate attention.`
    
    return this.adjustLength(content, targetWords)
  }

  private generateInitiativesContent(question: Question, keywords: string[], targetWords: number): string {
    const initiatives = this.getCurrentAffairsExample(question, 3)
    
    let content = `The government has launched several initiatives to address these challenges. `
    content += `Key programs include ${initiatives.join(', ')}.`
    content += ` These measures focus on ${keywords.slice(0, 2).join(' and ')}.`
    
    return this.adjustLength(content, targetWords)
  }

  private generateRecommendationsContent(question: Question, keywords: string[], targetWords: number): string {
    const recommendations = [
      'Strengthening institutional mechanisms',
      'Enhancing stakeholder participation',
      'Leveraging technology for better implementation',
      'Improving monitoring and evaluation systems',
      'Building capacity at all levels'
    ]

    let content = `To overcome these challenges, the following measures are recommended: `
    content += `${recommendations.slice(0, 3).join(', ')}.`
    content += ` Focus should be on ${keywords.slice(0, 2).join(' and ')}.`
    
    return this.adjustLength(content, targetWords)
  }

  private generateGenericContent(question: Question, section: string, keywords: string[], targetWords: number): string {
    let content = `Regarding ${section.toLowerCase()}, it is important to understand that ${question.topic} involves multiple dimensions. `
    content += `Key considerations include ${keywords.slice(0, 3).join(', ')}.`
    content += ` This requires a comprehensive approach that addresses both immediate and long-term concerns.`
    
    return this.adjustLength(content, targetWords)
  }

  private generateConclusion(question: Question, template: any, targetWords: number): string {
    const action = this.determineRequiredAction(question)
    const recommendations = this.generateKeyRecommendations(question)
    
    let conclusion = template.conclusion
      .replace('{topic}', question.topic)
      .replace('{relevance}', this.determineRelevance(question))
      .replace('{action}', action)
      .replace('{recommendations}', recommendations)
      .replace('{solutions}', this.generateSolutions(question))
      .replace('{values}', this.extractValues(question))
      .replace('{outcome}', this.determineDesiredOutcome(question))
      .replace('{conflicting_values}', this.identifyConflictingValues(question))

    return this.adjustLength(conclusion, targetWords)
  }

  private generateFormalAnswer(question: Question, wordLimit: number): ModelAnswer {
    const content = this.buildFormalContent(question, wordLimit)
    
    return {
      id: `formal-${question.id}-${Date.now()}`,
      content,
      wordCount: this.countWords(content),
      approach: 'formal academic',
      score: 82,
      author: 'ai',
      style: 'formal'
    }
  }

  private generateAnalyticalAnswer(question: Question, wordLimit: number): ModelAnswer {
    const content = this.buildAnalyticalContent(question, wordLimit)
    
    return {
      id: `analytical-${question.id}-${Date.now()}`,
      content,
      wordCount: this.countWords(content),
      approach: 'analytical',
      score: 87,
      author: 'ai',
      style: 'analytical'
    }
  }

  private generateContemporaryAnswer(question: Question, wordLimit: number): ModelAnswer {
    const content = this.buildContemporaryContent(question, wordLimit)
    
    return {
      id: `contemporary-${question.id}-${Date.now()}`,
      content,
      wordCount: this.countWords(content),
      approach: 'contemporary relevance',
      score: 85,
      author: 'ai',
      style: 'descriptive'
    }
  }

  private buildFormalContent(question: Question, wordLimit: number): string {
    const sections = [
      `**Introduction:**\nThe concept of ${question.topic} represents a fundamental aspect of ${this.extractContext(question)}. Its significance in contemporary discourse cannot be overstated, particularly in the context of India's developmental trajectory.`,
      
      `**Analysis:**\nA comprehensive examination reveals multiple dimensions to this issue. The theoretical framework encompasses ${this.getRelevantKeywords(question).slice(0, 3).join(', ')}. Historical precedents demonstrate the evolution of this concept over time.`,
      
      `**Contemporary Relevance:**\nIn the current scenario, ${question.topic} assumes greater importance due to emerging challenges and opportunities. Recent policy initiatives reflect the government's commitment to addressing these concerns systematically.`,
      
      `**Conclusion:**\nThus, a nuanced understanding of ${question.topic} is essential for effective policy formulation and implementation. The way forward requires coordinated efforts across multiple stakeholders and sustained commitment to reform.`
    ]

    return this.adjustContentLength(sections.join('\n\n'), wordLimit)
  }

  private buildAnalyticalContent(question: Question, wordLimit: number): string {
    const sections = [
      `**Context:**\n${question.topic} presents a complex interplay of multiple factors that require careful analysis. The issue intersects with various domains including policy, implementation, and stakeholder interests.`,
      
      `**Critical Analysis:**\nOn one hand, the current approach demonstrates certain strengths including ${this.getRelevantKeywords(question).slice(0, 2).join(' and ')}. On the other hand, significant challenges persist in areas such as implementation gaps and resource constraints.`,
      
      `**Multiple Perspectives:**\nDifferent stakeholders view this issue through varying lenses. While policymakers emphasize systemic reforms, ground-level implementers highlight practical constraints. Citizens, meanwhile, seek tangible outcomes that improve their quality of life.`,
      
      `**Way Forward:**\nA balanced approach requires synthesizing these diverse perspectives. Key recommendations include strengthening institutional mechanisms, enhancing transparency, and ensuring adequate resource allocation. Success depends on sustained political will and effective monitoring systems.`
    ]

    return this.adjustContentLength(sections.join('\n\n'), wordLimit)
  }

  private buildContemporaryContent(question: Question, wordLimit: number): string {
    const currentExamples = this.getCurrentAffairsExample(question, 2)
    
    const sections = [
      `**Contemporary Context:**\nIn today's rapidly evolving landscape, ${question.topic} has gained unprecedented significance. Recent developments such as ${currentExamples[0]} exemplify the urgent need for comprehensive policy intervention.`,
      
      `**Current Initiatives:**\nThe government's response has been multi-pronged, encompassing initiatives like ${currentExamples.join(' and ')}. These programs reflect a shift towards more inclusive and technology-driven solutions.`,
      
      `**Emerging Challenges:**\nHowever, new-age challenges including digital divide, climate change impacts, and post-pandemic recovery needs require innovative approaches. Traditional solutions may not adequately address these evolving complexities.`,
      
      `**Future Roadmap:**\nLooking ahead, success will depend on adaptive governance, stakeholder collaboration, and leveraging technological innovations. The focus must shift from reactive measures to proactive, anticipatory governance models that can respond effectively to emerging challenges.`
    ]

    return this.adjustContentLength(sections.join('\n\n'), wordLimit)
  }

  // Helper methods
  private extractContext(question: Question): string {
    const contextMap = {
      'GS1': 'Indian heritage and culture',
      'GS2': 'governance and public policy',
      'GS3': 'economic development and environmental sustainability',
      'GS4': 'ethical governance and human values'
    }
    return contextMap[question.subject] || 'public administration'
  }

  private determineRelevance(question: Question): string {
    const relevanceMap = {
      'GS1': 'cultural preservation and national identity',
      'GS2': 'democratic governance and citizen welfare',
      'GS3': 'sustainable development and economic growth',
      'GS4': 'ethical leadership and value-based governance'
    }
    return relevanceMap[question.subject] || 'effective governance'
  }

  private needsCurrentAffairs(question: Question): boolean {
    return question.subject !== 'GS1' || question.topic.includes('modern') || question.topic.includes('contemporary')
  }

  private getCurrentAffairsExample(question: Question, count: number = 1): string | string[] {
    const examples = this.currentAffairsExamples['2024'].concat(this.currentAffairsExamples['2025'])
    const relevant = examples.filter(example => 
      example.toLowerCase().includes(question.topic.toLowerCase()) ||
      question.keywords.some(keyword => example.toLowerCase().includes(keyword.toLowerCase()))
    )
    
    const selected = relevant.length > 0 ? relevant : examples
    return count === 1 ? selected[0] : selected.slice(0, count)
  }

  private getRelevantKeywords(question: Question): string[] {
    const topicKeywords = this.keywordDatabase[question.topic] || []
    const subjectKeywords = this.keywordDatabase[question.subject] || []
    return [...question.keywords, ...topicKeywords, ...subjectKeywords].slice(0, 8)
  }

  private getRelevantExamples(question: Question, section: string): string[] {
    // Return relevant examples based on question and section
    return [`Example related to ${question.topic} in ${section}`]
  }

  private determineApproach(question: Question): string {
    if (question.subject === 'GS4') return 'case study analysis'
    if (question.difficulty === 'hard') return 'comprehensive analytical'
    return 'structured descriptive'
  }

  private determineStyle(question: Question): 'formal' | 'analytical' | 'descriptive' | 'comparative' {
    if (question.subject === 'GS4') return 'analytical'
    if (question.text.includes('compare') || question.text.includes('contrast')) return 'comparative'
    if (question.text.includes('analyze') || question.text.includes('evaluate')) return 'analytical'
    return 'descriptive'
  }

  private determineRequiredAction(question: Question): string {
    const actionMap = {
      'GS1': 'preservation and promotion efforts',
      'GS2': 'comprehensive policy reforms',
      'GS3': 'strategic interventions and sustainable practices',
      'GS4': 'value-based leadership and ethical practices'
    }
    return actionMap[question.subject] || 'coordinated action'
  }

  private generateKeyRecommendations(question: Question): string {
    const recommendations = [
      'institutional strengthening',
      'stakeholder engagement',
      'technology integration',
      'capacity building',
      'monitoring and evaluation'
    ]
    return recommendations.slice(0, 3).join(', ')
  }

  private generateSolutions(question: Question): string {
    return 'innovative approaches, collaborative governance, and sustainable practices'
  }

  private extractValues(question: Question): string {
    if (question.subject === 'GS4') return 'integrity, transparency, and accountability'
    return 'efficiency, equity, and sustainability'
  }

  private determineDesiredOutcome(question: Question): string {
    return 'optimal results while maintaining ethical standards'
  }

  private identifyConflictingValues(question: Question): string {
    return 'competing priorities and stakeholder interests'
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  private adjustLength(text: string, targetWords: number): string {
    const currentWords = this.countWords(text)
    if (currentWords <= targetWords) return text
    
    const words = text.split(/\s+/)
    return words.slice(0, targetWords).join(' ')
  }

  private adjustContentLength(content: string, wordLimit: number): string {
    const currentWords = this.countWords(content)
    if (currentWords <= wordLimit) return content
    
    const sections = content.split('\n\n')
    const reductionRatio = wordLimit / currentWords
    
    return sections.map(section => {
      const sectionWords = this.countWords(section)
      const targetSectionWords = Math.round(sectionWords * reductionRatio)
      return this.adjustLength(section, targetSectionWords)
    }).join('\n\n')
  }
}