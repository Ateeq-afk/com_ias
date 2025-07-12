import {
  ContentGenerator,
  FlashCard,
  QuickQuiz,
  QuickQuizQuestion,
  MindMap,
  MindMapBranch,
  MindMapConnection,
  SummaryNotes,
  DateFact,
  RevisionItem,
  RevisionContent
} from '../types'
import { SubjectArea, DifficultyLevel } from '../../question-generator/types'

export class UPSCRevisionMaterialGenerator implements ContentGenerator {
  
  private mnemonicDatabase: Map<string, string[]> = new Map()
  private conceptConnections: Map<string, string[]> = new Map()

  constructor() {
    this.initializeMnemonicDatabase()
    this.initializeConceptConnections()
  }

  async generateFlashCards(source: any): Promise<FlashCard[]> {
    console.log(`🃏 Generating flash cards from source: ${source.type}`)
    
    const flashCards: FlashCard[] = []
    
    if (source.type === 'lesson') {
      flashCards.push(...await this.generateFlashCardsFromLesson(source))
    } else if (source.type === 'revisionItem') {
      flashCards.push(...await this.generateFlashCardsFromRevisionItem(source))
    } else if (source.type === 'currentAffairs') {
      flashCards.push(...await this.generateFlashCardsFromCurrentAffairs(source))
    }
    
    console.log(`✅ Generated ${flashCards.length} flash cards`)
    return flashCards
  }

  async generateQuickQuiz(topic: string, difficulty: DifficultyLevel): Promise<QuickQuiz> {
    console.log(`🧩 Generating quick quiz for ${topic} (${difficulty} difficulty)`)
    
    const questions = await this.generateQuizQuestions(topic, difficulty)
    const timeLimit = this.calculateQuizTimeLimit(questions, difficulty)
    
    const quiz: QuickQuiz = {
      id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      questions,
      timeLimit,
      passingScore: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 70 : 80,
      category: topic,
      difficulty
    }
    
    console.log(`✅ Generated quiz with ${questions.length} questions, ${timeLimit}s time limit`)
    return quiz
  }

  async generateMindMap(concept: string): Promise<MindMap> {
    console.log(`🧠 Generating mind map for concept: ${concept}`)
    
    const centralTopic = concept
    const branches = await this.generateMindMapBranches(concept)
    const connections = this.generateMindMapConnections(branches)
    const visualElements = this.generateVisualElements(concept, branches)
    
    const mindMap: MindMap = {
      id: `mindmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      centralTopic,
      branches,
      connections,
      layout: this.selectOptimalLayout(concept),
      visualElements
    }
    
    console.log(`✅ Generated mind map with ${branches.length} branches and ${connections.length} connections`)
    return mindMap
  }

  async generateSummaryNotes(lesson: any): Promise<SummaryNotes> {
    console.log(`📝 Generating summary notes for lesson: ${lesson.title}`)
    
    const keyPoints = this.extractKeyPoints(lesson.content)
    const bulletPoints = this.createBulletPoints(lesson.content)
    const onePageSummary = this.createOnePageSummary(lesson)
    const formulaSheet = this.extractFormulas(lesson.content)
    const importantDates = this.extractImportantDates(lesson.content)
    const mnemonics = await this.generateMnemonics(keyPoints)
    const quickFacts = this.generateQuickFacts(lesson.content)
    
    const summaryNotes: SummaryNotes = {
      id: `summary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: lesson.title,
      keyPoints,
      bulletPoints,
      onePageSummary,
      formulaSheet: formulaSheet.length > 0 ? formulaSheet : undefined,
      importantDates: importantDates.length > 0 ? importantDates : undefined,
      mnemonics: mnemonics.length > 0 ? mnemonics : undefined,
      quickFacts
    }
    
    console.log(`✅ Generated summary notes with ${keyPoints.length} key points`)
    return summaryNotes
  }

  async generateMnemonics(facts: string[]): Promise<string[]> {
    console.log(`🎭 Generating mnemonics for ${facts.length} facts`)
    
    const mnemonics: string[] = []
    
    for (const fact of facts) {
      const mnemonic = await this.createMnemonic(fact)
      if (mnemonic) {
        mnemonics.push(mnemonic)
      }
    }
    
    console.log(`✅ Generated ${mnemonics.length} mnemonics`)
    return mnemonics
  }

  // Advanced content generation methods
  async generateInteractiveFlashCards(revisionItems: RevisionItem[]): Promise<FlashCard[]> {
    console.log(`🎮 Generating interactive flash cards for ${revisionItems.length} items`)
    
    const cards: FlashCard[] = []
    
    for (const item of revisionItems) {
      // Generate different types of cards based on content type
      switch (item.contentType) {
        case 'Date':
          cards.push(...this.generateDateFlashCards(item))
          break
        case 'Formula':
          cards.push(...this.generateFormulaFlashCards(item))
          break
        case 'Concept':
          cards.push(...this.generateConceptFlashCards(item))
          break
        case 'CurrentAffairs':
          cards.push(...this.generateCurrentAffairsFlashCards(item))
          break
        default:
          cards.push(...this.generateStandardFlashCards(item))
      }
    }
    
    return cards
  }

  async generateThematicQuizzes(theme: string, subjects: SubjectArea[]): Promise<QuickQuiz[]> {
    console.log(`🎯 Generating thematic quizzes for theme: ${theme}`)
    
    const quizzes: QuickQuiz[] = []
    
    for (const subject of subjects) {
      const quiz = await this.generateThematicQuiz(theme, subject)
      quizzes.push(quiz)
    }
    
    return quizzes
  }

  async generateVisualMemoryAids(concepts: string[]): Promise<any[]> {
    console.log(`👁️ Generating visual memory aids for ${concepts.length} concepts`)
    
    const memoryAids = []
    
    for (const concept of concepts) {
      const aid = {
        concept,
        type: this.selectVisualType(concept),
        content: await this.createVisualContent(concept),
        memoryHooks: this.createMemoryHooks(concept),
        colorCoding: this.assignColorCoding(concept),
        spatialLayout: this.designSpatialLayout(concept)
      }
      memoryAids.push(aid)
    }
    
    return memoryAids
  }

  async generateStoryBasedRecall(facts: string[], context: string): Promise<any> {
    console.log(`📚 Generating story-based recall for ${facts.length} facts`)
    
    const story = {
      title: `The Story of ${context}`,
      narrative: this.weaveFactsIntoStory(facts, context),
      keyCharacters: this.createStoryCharacters(facts),
      plotPoints: this.createPlotPoints(facts),
      visualScenes: this.createVisualScenes(facts),
      recallCues: this.createRecallCues(facts, context)
    }
    
    return story
  }

  // Private helper methods for flash card generation
  private async generateFlashCardsFromLesson(lesson: any): Promise<FlashCard[]> {
    const cards: FlashCard[] = []
    
    // Generate cards from key concepts
    lesson.keyConcepts?.forEach((concept: string, index: number) => {
      cards.push({
        id: `lesson-card-${lesson.id}-${index}`,
        front: `What is ${concept}?`,
        back: lesson.conceptDefinitions?.[concept] || `${concept} is a key concept in ${lesson.subject}`,
        hints: this.generateHints(concept),
        examples: lesson.examples?.filter((ex: string) => ex.includes(concept)) || [],
        mnemonics: this.mnemonicDatabase.get(concept.toLowerCase()) || [],
        difficulty: lesson.difficulty || 'medium',
        tags: [lesson.subject, lesson.topic, concept.toLowerCase()]
      })
    })
    
    // Generate cards from important dates
    lesson.importantDates?.forEach((dateInfo: any, index: number) => {
      cards.push({
        id: `lesson-date-card-${lesson.id}-${index}`,
        front: `When did ${dateInfo.event} happen?`,
        back: `${dateInfo.date} - ${dateInfo.significance}`,
        hints: [dateInfo.context, `Think about ${dateInfo.period}`],
        difficulty: 'hard',
        tags: ['date', 'chronology', lesson.subject]
      })
    })
    
    // Generate cards from factoids
    lesson.factoids?.forEach((factoid: string, index: number) => {
      const questionPart = this.convertFactoidToQuestion(factoid)
      cards.push({
        id: `lesson-fact-card-${lesson.id}-${index}`,
        front: questionPart.question,
        back: questionPart.answer,
        hints: this.generateFactoidHints(factoid),
        difficulty: 'medium',
        tags: ['fact', lesson.subject, lesson.topic]
      })
    })
    
    return cards
  }

  private async generateFlashCardsFromRevisionItem(item: RevisionItem): Promise<FlashCard[]> {
    const cards: FlashCard[] = []
    
    // Main concept card
    cards.push({
      id: `revision-card-${item.id}`,
      front: `Explain: ${item.content.title}`,
      back: item.content.keyPoints.join('\n'),
      hints: item.content.factoids || [],
      examples: item.content.examples || [],
      mnemonics: item.content.mnemonics || [],
      difficulty: item.difficulty,
      tags: item.tags
    })
    
    // Specific fact cards
    item.content.factoids?.forEach((factoid, index) => {
      const questionPart = this.convertFactoidToQuestion(factoid)
      cards.push({
        id: `revision-fact-card-${item.id}-${index}`,
        front: questionPart.question,
        back: questionPart.answer,
        hints: [item.content.title],
        difficulty: item.difficulty,
        tags: item.tags
      })
    })
    
    return cards
  }

  private async generateFlashCardsFromCurrentAffairs(article: any): Promise<FlashCard[]> {
    const cards: FlashCard[] = []
    
    // Main article card
    cards.push({
      id: `ca-card-${article.id}`,
      front: `What is the significance of: ${article.title}?`,
      back: article.keyPoints?.join('\n') || article.summary,
      hints: article.staticConnections || [],
      difficulty: 'medium',
      tags: ['current-affairs', article.category]
    })
    
    // Date-specific cards
    if (article.dates) {
      article.dates.forEach((date: string, index: number) => {
        cards.push({
          id: `ca-date-card-${article.id}-${index}`,
          front: `When was ${article.title} announced/implemented?`,
          back: date,
          hints: [article.context],
          difficulty: 'hard',
          tags: ['current-affairs', 'date']
        })
      })
    }
    
    return cards
  }

  private generateDateFlashCards(item: RevisionItem): FlashCard[] {
    const cards: FlashCard[] = []
    
    item.content.dates?.forEach((date, index) => {
      // Year card
      cards.push({
        id: `date-year-${item.id}-${index}`,
        front: `In which year: ${item.content.title}?`,
        back: date,
        hints: this.generateDateHints(date, item.subject),
        difficulty: 'hard',
        tags: ['date', 'year', item.subject]
      })
      
      // Event card
      cards.push({
        id: `date-event-${item.id}-${index}`,
        front: `What happened in ${date}?`,
        back: item.content.title,
        hints: item.content.keyPoints.slice(0, 2),
        difficulty: 'medium',
        tags: ['date', 'event', item.subject]
      })
    })
    
    return cards
  }

  private generateFormulaFlashCards(item: RevisionItem): FlashCard[] {
    const cards: FlashCard[] = []
    
    item.content.formulas?.forEach((formula, index) => {
      cards.push({
        id: `formula-card-${item.id}-${index}`,
        front: `Formula for: ${item.content.title}`,
        back: formula,
        hints: item.content.keyPoints,
        difficulty: 'medium',
        tags: ['formula', 'calculation', item.subject]
      })
    })
    
    return cards
  }

  private generateConceptFlashCards(item: RevisionItem): FlashCard[] {
    const cards: FlashCard[] = []
    
    // Main concept card
    cards.push({
      id: `concept-main-${item.id}`,
      front: `Define: ${item.content.title}`,
      back: item.content.keyPoints.join('\n'),
      hints: item.content.factoids || [],
      examples: item.content.examples || [],
      difficulty: item.difficulty,
      tags: ['concept', item.subject]
    })
    
    // Feature cards
    item.content.keyPoints.forEach((point, index) => {
      cards.push({
        id: `concept-feature-${item.id}-${index}`,
        front: `Key feature of ${item.content.title}:`,
        back: point,
        hints: [item.content.title],
        difficulty: item.difficulty,
        tags: ['concept', 'feature', item.subject]
      })
    })
    
    return cards
  }

  private generateCurrentAffairsFlashCards(item: RevisionItem): FlashCard[] {
    const cards: FlashCard[] = []
    
    // Main CA card
    cards.push({
      id: `ca-main-${item.id}`,
      front: `Current Affairs: ${item.content.title}`,
      back: item.content.keyPoints.join('\n'),
      hints: item.content.connections || [],
      difficulty: 'medium',
      tags: ['current-affairs', item.subject]
    })
    
    // Static connection cards
    item.content.connections?.forEach((connection, index) => {
      cards.push({
        id: `ca-connection-${item.id}-${index}`,
        front: `How does ${item.content.title} relate to ${connection}?`,
        back: `This connects to ${connection} through policy/governance implications`,
        hints: [item.content.title],
        difficulty: 'hard',
        tags: ['current-affairs', 'connection']
      })
    })
    
    return cards
  }

  private generateStandardFlashCards(item: RevisionItem): FlashCard[] {
    return [{
      id: `standard-card-${item.id}`,
      front: item.content.title,
      back: item.content.keyPoints.join('\n'),
      hints: item.content.factoids || [],
      difficulty: item.difficulty,
      tags: item.tags
    }]
  }

  // Quiz generation methods
  private async generateQuizQuestions(topic: string, difficulty: DifficultyLevel): Promise<QuickQuizQuestion[]> {
    const questions: QuickQuizQuestion[] = []
    const questionCount = this.getQuestionCount(difficulty)
    
    for (let i = 0; i < questionCount; i++) {
      const question = await this.generateSingleQuizQuestion(topic, difficulty, i)
      questions.push(question)
    }
    
    return questions
  }

  private async generateSingleQuizQuestion(topic: string, difficulty: DifficultyLevel, index: number): Promise<QuickQuizQuestion> {
    const questionTypes = ['multiple-choice', 'fill-in-blank', 'true-false']
    const questionType = questionTypes[index % questionTypes.length]
    
    let question: QuickQuizQuestion
    
    switch (questionType) {
      case 'multiple-choice':
        question = this.generateMultipleChoiceQuestion(topic, difficulty)
        break
      case 'fill-in-blank':
        question = this.generateFillInBlankQuestion(topic, difficulty)
        break
      case 'true-false':
        question = this.generateTrueFalseQuestion(topic, difficulty)
        break
      default:
        question = this.generateMultipleChoiceQuestion(topic, difficulty)
    }
    
    return {
      ...question,
      id: `quiz-q-${Date.now()}-${index}`,
      points: this.calculateQuestionPoints(difficulty),
      timeLimit: this.calculateQuestionTimeLimit(difficulty)
    }
  }

  private generateMultipleChoiceQuestion(topic: string, difficulty: DifficultyLevel): Partial<QuickQuizQuestion> {
    const questionData = this.getTopicQuestionData(topic)
    
    return {
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.options[0], // First option is correct
      explanation: questionData.explanation
    }
  }

  private generateFillInBlankQuestion(topic: string, difficulty: DifficultyLevel): Partial<QuickQuizQuestion> {
    const questionData = this.getTopicQuestionData(topic)
    const blankQuestion = questionData.statement.replace(questionData.answer, '______')
    
    return {
      question: `Fill in the blank: ${blankQuestion}`,
      correctAnswer: questionData.answer,
      explanation: questionData.explanation
    }
  }

  private generateTrueFalseQuestion(topic: string, difficulty: DifficultyLevel): Partial<QuickQuizQuestion> {
    const questionData = this.getTopicQuestionData(topic)
    
    return {
      question: `True or False: ${questionData.statement}`,
      options: ['True', 'False'],
      correctAnswer: questionData.isTrue ? 'True' : 'False',
      explanation: questionData.explanation
    }
  }

  // Mind map generation methods
  private async generateMindMapBranches(concept: string): Promise<MindMapBranch[]> {
    const branches: MindMapBranch[] = []
    const conceptData = this.getConceptData(concept)
    
    // Central concept
    branches.push({
      id: 'central',
      title: concept,
      content: conceptData.description ? [conceptData.description] : [],
      color: '#4A90E2',
      importance: 5,
      position: { x: 0, y: 0 }
    })
    
    // Main branches
    conceptData.mainAspects?.forEach((aspect: string, index: number) => {
      const angle = (index * 360) / conceptData.mainAspects.length
      const radius = 200
      const x = Math.cos(angle * Math.PI / 180) * radius
      const y = Math.sin(angle * Math.PI / 180) * radius
      
      branches.push({
        id: `branch-${index}`,
        parentId: 'central',
        title: aspect,
        content: conceptData.aspectDetails?.[aspect] || [],
        color: this.getBranchColor(index),
        importance: 4,
        position: { x, y }
      })
      
      // Sub-branches
      const subAspects = conceptData.subAspects?.[aspect] || []
      subAspects.forEach((subAspect: string, subIndex: number) => {
        const subAngle = angle + (subIndex - subAspects.length / 2) * 30
        const subRadius = 120
        const subX = x + Math.cos(subAngle * Math.PI / 180) * subRadius
        const subY = y + Math.sin(subAngle * Math.PI / 180) * subRadius
        
        branches.push({
          id: `sub-${index}-${subIndex}`,
          parentId: `branch-${index}`,
          title: subAspect,
          content: [subAspect],
          color: this.getBranchColor(index, true),
          importance: 3,
          position: { x: subX, y: subY }
        })
      })
    })
    
    return branches
  }

  private generateMindMapConnections(branches: MindMapBranch[]): MindMapConnection[] {
    const connections: MindMapConnection[] = []
    
    // Connect main branches to central
    branches.filter(b => b.parentId === 'central').forEach(branch => {
      connections.push({
        fromBranchId: 'central',
        toBranchId: branch.id,
        type: 'Related to',
        label: 'includes'
      })
    })
    
    // Connect sub-branches to main branches
    branches.filter(b => b.parentId && b.parentId !== 'central').forEach(branch => {
      connections.push({
        fromBranchId: branch.parentId!,
        toBranchId: branch.id,
        type: 'Leads to',
        label: 'contains'
      })
    })
    
    // Add cross-connections for related concepts
    this.findCrossConnections(branches).forEach(connection => {
      connections.push(connection)
    })
    
    return connections
  }

  private generateVisualElements(concept: string, branches: MindMapBranch[]): any[] {
    const elements = []
    
    // Add icons for different branch types
    branches.forEach(branch => {
      const icon = this.selectIconForBranch(branch.title)
      if (icon) {
        elements.push({
          type: 'Icon',
          content: icon,
          position: { x: branch.position.x - 20, y: branch.position.y - 20 },
          size: { width: 24, height: 24 }
        })
      }
    })
    
    // Add timeline if concept has chronological aspects
    if (this.hasChronologicalAspects(concept)) {
      elements.push({
        type: 'Timeline',
        content: 'chronological-flow',
        position: { x: -300, y: 200 },
        size: { width: 600, height: 100 }
      })
    }
    
    return elements
  }

  // Summary notes generation methods
  private extractKeyPoints(content: string): string[] {
    const sentences = content.split(/[.!?]+/)
    return sentences
      .filter(sentence => sentence.length > 30)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .slice(0, 8) // Top 8 key points
  }

  private createBulletPoints(content: string): string[] {
    const keyPoints = this.extractKeyPoints(content)
    return keyPoints.map(point => `• ${point}`)
  }

  private createOnePageSummary(lesson: any): string {
    const title = lesson.title
    const keyPoints = this.extractKeyPoints(lesson.content)
    const examples = lesson.examples || []
    const dates = lesson.importantDates || []
    
    let summary = `# ${title}\n\n`
    summary += `## Key Points:\n${keyPoints.slice(0, 5).map(point => `• ${point}`).join('\n')}\n\n`
    
    if (examples.length > 0) {
      summary += `## Examples:\n${examples.slice(0, 3).map(ex => `• ${ex}`).join('\n')}\n\n`
    }
    
    if (dates.length > 0) {
      summary += `## Important Dates:\n${dates.map(d => `• ${d.date}: ${d.event}`).join('\n')}\n\n`
    }
    
    summary += `## Quick Revision:\n• Review key points daily\n• Practice with examples\n• Connect to current affairs`
    
    return summary
  }

  private extractFormulas(content: string): string[] {
    const formulaPatterns = [
      /[A-Z]\s*=\s*[^.]+/g,
      /\d+\s*[×÷+\-]\s*\d+/g,
      /\([^)]+\)\s*[×÷+\-]\s*\([^)]+\)/g
    ]
    
    const formulas: string[] = []
    formulaPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        formulas.push(...matches)
      }
    })
    
    return [...new Set(formulas)] // Remove duplicates
  }

  private extractImportantDates(content: string): DateFact[] {
    const datePattern = /(\d{4})\s*[-–]\s*([^.!?]+)/g
    const dates: DateFact[] = []
    
    let match
    while ((match = datePattern.exec(content)) !== null) {
      dates.push({
        date: match[1],
        event: match[2].trim(),
        significance: 'Important historical milestone',
        context: 'Part of chronological development'
      })
    }
    
    return dates.slice(0, 5) // Top 5 dates
  }

  private generateQuickFacts(content: string): string[] {
    const facts = []
    
    // Extract numerical facts
    const numberPattern = /(\d+(?:,\d+)*(?:\.\d+)?)\s*([^.!?]+)/g
    let match
    while ((match = numberPattern.exec(content)) !== null) {
      facts.push(`${match[1]} - ${match[2].trim()}`)
    }
    
    // Extract percentage facts
    const percentPattern = /(\d+(?:\.\d+)?%)\s*([^.!?]+)/g
    while ((match = percentPattern.exec(content)) !== null) {
      facts.push(`${match[1]} - ${match[2].trim()}`)
    }
    
    return facts.slice(0, 10) // Top 10 quick facts
  }

  // Mnemonic generation
  private async createMnemonic(fact: string): Promise<string | null> {
    // Check existing mnemonics first
    const existing = this.mnemonicDatabase.get(fact.toLowerCase())
    if (existing && existing.length > 0) {
      return existing[0]
    }
    
    // Generate new mnemonic
    const words = fact.split(' ').filter(word => word.length > 3)
    if (words.length < 2) return null
    
    // Create acronym-based mnemonic
    const acronym = words.map(word => word[0].toUpperCase()).join('')
    const mnemonicPhrase = this.createMnemonicPhrase(acronym)
    
    return `${acronym} - ${mnemonicPhrase}`
  }

  private createMnemonicPhrase(acronym: string): string {
    const mnemonicWords: Record<string, string> = {
      'A': 'Always', 'B': 'Better', 'C': 'Create', 'D': 'During', 'E': 'Every',
      'F': 'For', 'G': 'Great', 'H': 'Help', 'I': 'In', 'J': 'Just',
      'K': 'Keep', 'L': 'Learn', 'M': 'Make', 'N': 'Never', 'O': 'Only',
      'P': 'Please', 'Q': 'Quickly', 'R': 'Remember', 'S': 'Study', 'T': 'Take',
      'U': 'Use', 'V': 'Very', 'W': 'When', 'X': 'eXamine', 'Y': 'Your', 'Z': 'Zero'
    }
    
    return acronym.split('').map(char => mnemonicWords[char] || char).join(' ')
  }

  // Helper methods
  private convertFactoidToQuestion(factoid: string): { question: string; answer: string } {
    if (factoid.includes(' is ') || factoid.includes(' are ')) {
      const parts = factoid.split(/ is | are /)
      return {
        question: `What ${parts.length > 1 ? 'is' : 'are'} ${parts[0]}?`,
        answer: parts.slice(1).join(' is ')
      }
    }
    
    if (factoid.includes(' was ') || factoid.includes(' were ')) {
      const parts = factoid.split(/ was | were /)
      return {
        question: `What happened to ${parts[0]}?`,
        answer: parts.slice(1).join(' was ')
      }
    }
    
    return {
      question: `What do you know about: ${factoid.split(' ').slice(0, 3).join(' ')}?`,
      answer: factoid
    }
  }

  private generateHints(concept: string): string[] {
    const hints = []
    
    if (concept.includes('Article')) {
      hints.push('Think about constitutional provisions')
    }
    
    if (concept.includes('Right')) {
      hints.push('Related to fundamental rights')
    }
    
    if (concept.includes('Policy')) {
      hints.push('Government initiative or program')
    }
    
    hints.push(`Related to ${concept.split(' ')[0]}`)
    
    return hints
  }

  private generateFactoidHints(factoid: string): string[] {
    const hints = []
    
    if (factoid.includes('Article')) {
      const articleMatch = factoid.match(/Article\s+(\d+)/i)
      if (articleMatch) {
        hints.push(`Constitutional Article ${articleMatch[1]}`)
      }
    }
    
    if (factoid.includes('%')) {
      hints.push('Think about percentages or statistics')
    }
    
    if (factoid.match(/\d{4}/)) {
      hints.push('Important year or date')
    }
    
    return hints
  }

  private generateDateHints(date: string, subject: SubjectArea): string[] {
    const hints = []
    const year = parseInt(date)
    
    if (year >= 1947 && year <= 1950) {
      hints.push('Independence era')
    } else if (year >= 1950 && year <= 1970) {
      hints.push('Early post-independence period')
    } else if (year >= 1991 && year <= 2000) {
      hints.push('Economic liberalization era')
    }
    
    if (subject === 'Polity') {
      hints.push('Constitutional or political development')
    } else if (subject === 'Economy') {
      hints.push('Economic policy or reform')
    }
    
    return hints
  }

  // Additional helper methods
  private getQuestionCount(difficulty: DifficultyLevel): number {
    return difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10
  }

  private calculateQuizTimeLimit(questions: QuickQuizQuestion[], difficulty: DifficultyLevel): number {
    const baseTime = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
    return baseTime + (questions.length * 10)
  }

  private calculateQuestionPoints(difficulty: DifficultyLevel): number {
    return difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
  }

  private calculateQuestionTimeLimit(difficulty: DifficultyLevel): number {
    return difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60
  }

  private selectOptimalLayout(concept: string): 'Radial' | 'Tree' | 'Circular' | 'Timeline' {
    if (concept.toLowerCase().includes('history') || concept.toLowerCase().includes('development')) {
      return 'Timeline'
    }
    if (concept.toLowerCase().includes('system') || concept.toLowerCase().includes('structure')) {
      return 'Tree'
    }
    if (concept.toLowerCase().includes('cycle') || concept.toLowerCase().includes('process')) {
      return 'Circular'
    }
    return 'Radial'
  }

  private getBranchColor(index: number, isSubBranch: boolean = false): string {
    const colors = ['#4A90E2', '#7ED321', '#F5A623', '#D0021B', '#9013FE', '#50E3C2', '#B8E986']
    const color = colors[index % colors.length]
    return isSubBranch ? this.lightenColor(color) : color
  }

  private lightenColor(color: string): string {
    // Simple color lightening - in production, use proper color manipulation
    return color + '80' // Add transparency
  }

  private findCrossConnections(branches: MindMapBranch[]): MindMapConnection[] {
    const connections: MindMapConnection[] = []
    
    // Find branches with similar content
    for (let i = 0; i < branches.length; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        const branch1 = branches[i]
        const branch2 = branches[j]
        
        if (this.branchesAreRelated(branch1, branch2)) {
          connections.push({
            fromBranchId: branch1.id,
            toBranchId: branch2.id,
            type: 'Related to',
            label: 'connected'
          })
        }
      }
    }
    
    return connections
  }

  private branchesAreRelated(branch1: MindMapBranch, branch2: MindMapBranch): boolean {
    // Simple relatedness check based on title similarity
    const words1 = branch1.title.toLowerCase().split(' ')
    const words2 = branch2.title.toLowerCase().split(' ')
    
    return words1.some(word => words2.includes(word) && word.length > 3)
  }

  private selectIconForBranch(title: string): string | null {
    const iconMap: Record<string, string> = {
      'government': '🏛️',
      'policy': '📋',
      'rights': '⚖️',
      'economy': '💰',
      'environment': '🌱',
      'history': '📚',
      'geography': '🗺️',
      'science': '🔬',
      'technology': '💻'
    }
    
    const lowerTitle = title.toLowerCase()
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (lowerTitle.includes(keyword)) {
        return icon
      }
    }
    
    return null
  }

  private hasChronologicalAspects(concept: string): boolean {
    const chronologyKeywords = ['history', 'development', 'evolution', 'timeline', 'period', 'era']
    return chronologyKeywords.some(keyword => concept.toLowerCase().includes(keyword))
  }

  // Mock data methods
  private getTopicQuestionData(topic: string): any {
    return {
      question: `What is the main feature of ${topic}?`,
      options: [`Primary characteristic of ${topic}`, 'Option B', 'Option C', 'Option D'],
      statement: `${topic} is an important concept in UPSC preparation`,
      answer: 'important concept',
      isTrue: true,
      explanation: `This relates to the fundamental principles of ${topic}`
    }
  }

  private getConceptData(concept: string): any {
    return {
      description: `${concept} is a fundamental concept`,
      mainAspects: ['Definition', 'Features', 'Importance', 'Applications'],
      aspectDetails: {
        'Definition': [`Clear understanding of ${concept}`],
        'Features': [`Key characteristics of ${concept}`],
        'Importance': [`Significance in UPSC context`],
        'Applications': [`Practical applications of ${concept}`]
      },
      subAspects: {
        'Definition': ['Core meaning', 'Context'],
        'Features': ['Primary traits', 'Secondary traits'],
        'Importance': ['Academic value', 'Practical value'],
        'Applications': ['Examples', 'Case studies']
      }
    }
  }

  // Initialize databases
  private initializeMnemonicDatabase(): void {
    this.mnemonicDatabase.set('fundamental rights', ['FREDS - Freedom, Rights, Equality, Dignity, Speech'])
    this.mnemonicDatabase.set('directive principles', ['DPSP - Democratic Principles Sustain Progress'])
    this.mnemonicDatabase.set('constitutional amendments', ['CAP - Constitutional Amendment Process'])
    // Add more mnemonics as needed
  }

  private initializeConceptConnections(): void {
    this.conceptConnections.set('polity', ['constitution', 'parliament', 'judiciary', 'executive'])
    this.conceptConnections.set('economy', ['fiscal policy', 'monetary policy', 'budget', 'trade'])
    this.conceptConnections.set('geography', ['physical', 'human', 'economic', 'environmental'])
    // Add more connections as needed
  }

  // Advanced content generation methods (stubs for full implementation)
  private async generateThematicQuiz(theme: string, subject: SubjectArea): Promise<QuickQuiz> {
    return this.generateQuickQuiz(`${theme} in ${subject}`, 'medium')
  }

  private selectVisualType(concept: string): string {
    if (concept.includes('map') || concept.includes('geography')) return 'map'
    if (concept.includes('chart') || concept.includes('data')) return 'chart'
    if (concept.includes('diagram') || concept.includes('structure')) return 'diagram'
    return 'infographic'
  }

  private async createVisualContent(concept: string): Promise<string> {
    return `Visual representation of ${concept}`
  }

  private createMemoryHooks(concept: string): string[] {
    return [`Remember ${concept} by its first letter`, `Associate with familiar ${concept.split(' ')[0]}`]
  }

  private assignColorCoding(concept: string): Record<string, string> {
    return {
      primary: '#4A90E2',
      secondary: '#7ED321',
      accent: '#F5A623'
    }
  }

  private designSpatialLayout(concept: string): any {
    return {
      type: 'grid',
      columns: 3,
      spacing: 20
    }
  }

  private weaveFactsIntoStory(facts: string[], context: string): string {
    return `Once upon a time in ${context}, ${facts.join(' and then ')}.`
  }

  private createStoryCharacters(facts: string[]): string[] {
    return facts.map(fact => fact.split(' ')[0]).slice(0, 5)
  }

  private createPlotPoints(facts: string[]): string[] {
    return facts.map((fact, index) => `Chapter ${index + 1}: ${fact}`)
  }

  private createVisualScenes(facts: string[]): string[] {
    return facts.map(fact => `Scene depicting ${fact}`)
  }

  private createRecallCues(facts: string[], context: string): string[] {
    return [`Remember the story of ${context}`, ...facts.map(fact => `Think about ${fact.split(' ')[0]}`)]
  }
}