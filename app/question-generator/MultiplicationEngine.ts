import { Question, BaseFact, QuestionType, DifficultyLevel, MultiplicationEngine, QuestionGenerationConfig } from './types'
import { SingleCorrectMCQGenerator } from './types/SingleCorrectMCQGenerator'
import { MultipleCorrectMCQGenerator } from './types/MultipleCorrectMCQGenerator'
import { MatchTheFollowingGenerator } from './types/MatchTheFollowingGenerator'
import { AssertionReasoningGenerator } from './types/AssertionReasoningGenerator'
import { StatementBasedGenerator } from './types/StatementBasedGenerator'
import { SequenceArrangementGenerator } from './types/SequenceArrangementGenerator'
import { OddOneOutGenerator } from './types/OddOneOutGenerator'
import { CaseStudyBasedGenerator } from './types/CaseStudyBasedGenerator'
import { MapBasedGenerator } from './types/MapBasedGenerator'
import { DataBasedGenerator } from './types/DataBasedGenerator'

export class UPSCMultiplicationEngine implements MultiplicationEngine {
  private generators: Map<QuestionType, any>
  
  constructor() {
    this.initializeGenerators()
  }
  
  private initializeGenerators() {
    this.generators = new Map([
      ['SingleCorrectMCQ', new SingleCorrectMCQGenerator()],
      ['MultipleCorrectMCQ', new MultipleCorrectMCQGenerator()],
      ['MatchTheFollowing', new MatchTheFollowingGenerator()],
      ['AssertionReasoning', new AssertionReasoningGenerator()],
      ['StatementBased', new StatementBasedGenerator()],
      ['SequenceArrangement', new SequenceArrangementGenerator()],
      ['OddOneOut', new OddOneOutGenerator()],
      ['CaseStudyBased', new CaseStudyBasedGenerator()],
      ['MapBased', new MapBasedGenerator()],
      ['DataBased', new DataBasedGenerator()]
    ])
  }
  
  async multiplyFromBaseFact(baseFact: BaseFact): Promise<Question[]> {
    const multiplicationFactor = this.calculateMultiplicationFactor(baseFact)
    const questions: Question[] = []
    
    // Strategy 1: Generate across all question types
    for (const questionType of this.getRelevantQuestionTypes(baseFact)) {
      const typeQuestions = await this.generateQuestionsForType(baseFact, questionType, multiplicationFactor)
      questions.push(...typeQuestions)
    }
    
    // Strategy 2: Generate variations of best performing types
    const highImpactTypes = this.getHighImpactTypes(baseFact)
    for (const type of highImpactTypes) {
      const variations = await this.generateDeepVariations(baseFact, type)
      questions.push(...variations)
    }
    
    // Strategy 3: Generate contextual applications
    const contextualQuestions = await this.generateContextualApplications(baseFact)
    questions.push(...contextualQuestions)
    
    return this.deduplicate(questions)
  }
  
  calculateMultiplicationFactor(baseFact: BaseFact): number {
    let factor = 1
    
    // Factor based on importance
    switch (baseFact.importance) {
      case 'high': factor *= 3; break
      case 'medium': factor *= 2; break
      case 'low': factor *= 1.5; break
    }
    
    // Factor based on concept richness
    if (baseFact.concepts.length > 3) factor *= 1.5
    if (baseFact.relatedFacts.length > 2) factor *= 1.3
    
    // Factor based on subject
    const subjectMultipliers = {
      'Polity': 2.5,      // High importance for UPSC
      'History': 2.0,
      'Geography': 2.0,
      'Economy': 2.2,
      'Environment': 1.8,
      'Science & Technology': 1.7,
      'Current Affairs': 1.5,
      'Ethics': 1.6,
      'Art & Culture': 1.4,
      'International Relations': 1.8
    }
    
    factor *= subjectMultipliers[baseFact.subject] || 1.5
    
    // Cap the factor to reasonable limits
    return Math.min(Math.max(Math.round(factor), 3), 15)
  }
  
  generateVariations(baseQuestion: Question): Question[] {
    const variations: Question[] = []
    
    // Difficulty variations
    const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard']
    for (const difficulty of difficulties) {
      if (difficulty !== baseQuestion.difficulty) {
        const difficultyVariation = this.createDifficultyVariation(baseQuestion, difficulty)
        variations.push(difficultyVariation)
      }
    }
    
    // Perspective variations
    const perspectiveVariations = this.createPerspectiveVariations(baseQuestion)
    variations.push(...perspectiveVariations)
    
    // Application variations
    const applicationVariations = this.createApplicationVariations(baseQuestion)
    variations.push(...applicationVariations)
    
    return variations
  }
  
  createNegativeVersions(baseQuestion: Question): Question[] {
    const negativeVersions: Question[] = []
    
    // Create NOT/INCORRECT versions
    const notVersion = this.createNotVersion(baseQuestion)
    if (notVersion) negativeVersions.push(notVersion)
    
    // Create EXCEPT versions
    const exceptVersion = this.createExceptVersion(baseQuestion)
    if (exceptVersion) negativeVersions.push(exceptVersion)
    
    // Create FALSE statement versions
    const falseVersion = this.createFalseStatementVersion(baseQuestion)
    if (falseVersion) negativeVersions.push(falseVersion)
    
    return negativeVersions
  }
  
  private getRelevantQuestionTypes(baseFact: BaseFact): QuestionType[] {
    const allTypes: QuestionType[] = [
      'SingleCorrectMCQ', 'MultipleCorrectMCQ', 'MatchTheFollowing',
      'AssertionReasoning', 'StatementBased', 'SequenceArrangement',
      'OddOneOut', 'CaseStudyBased', 'MapBased', 'DataBased'
    ]
    
    // Filter based on subject appropriateness
    if (baseFact.subject === 'Geography') {
      return allTypes.filter(type => type !== 'AssertionReasoning')
    }
    
    if (baseFact.subject === 'History') {
      return allTypes.filter(type => !['MapBased', 'DataBased'].includes(type))
    }
    
    return allTypes
  }
  
  private async generateQuestionsForType(
    baseFact: BaseFact, 
    questionType: QuestionType, 
    factor: number
  ): Promise<Question[]> {
    const generator = this.generators.get(questionType)
    if (!generator) return []
    
    const questions: Question[] = []
    const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard']
    
    const config: QuestionGenerationConfig = {
      baseFact,
      questionTypes: [questionType],
      difficulties,
      generateNegatives: factor > 5,
      includeVariations: factor > 3,
      maxQuestionsPerType: Math.min(factor * 2, 10)
    }
    
    try {
      const generatedQuestions = await generator.generateQuestion(config)
      questions.push(...generatedQuestions)
    } catch (error) {
      console.warn(`Failed to generate ${questionType} questions:`, error)
    }
    
    return questions
  }
  
  private getHighImpactTypes(baseFact: BaseFact): QuestionType[] {
    const impactRanking = {
      'SingleCorrectMCQ': 10,     // Always high impact
      'MultipleCorrectMCQ': 9,    // UPSC Prelims favorite
      'StatementBased': 8,        // Common in UPSC
      'AssertionReasoning': 7,    // Analytical thinking
      'CaseStudyBased': 6,        // Application focused
      'MatchTheFollowing': 5,     // Good for associations
      'SequenceArrangement': 4,   // Logical ordering
      'DataBased': 3,             // Emerging trend
      'OddOneOut': 2,             // Classification
      'MapBased': 1               // Subject specific
    }
    
    // Subject-specific adjustments
    if (baseFact.subject === 'Geography') {
      impactRanking['MapBased'] = 8
      impactRanking['DataBased'] = 6
    }
    
    if (baseFact.subject === 'Polity') {
      impactRanking['CaseStudyBased'] = 9
      impactRanking['AssertionReasoning'] = 8
    }
    
    // Return top 5 types
    return Object.entries(impactRanking)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type as QuestionType)
  }
  
  private async generateDeepVariations(baseFact: BaseFact, questionType: QuestionType): Promise<Question[]> {
    const generator = this.generators.get(questionType)
    if (!generator) return []
    
    const variations: Question[] = []
    
    // Temporal variations (if applicable)
    const temporalBaseFact = this.createTemporalVariation(baseFact)
    if (temporalBaseFact) {
      const config: QuestionGenerationConfig = {
        baseFact: temporalBaseFact,
        questionTypes: [questionType],
        difficulties: ['medium'],
        generateNegatives: false,
        includeVariations: true,
        maxQuestionsPerType: 2
      }
      
      const temporalQuestions = await generator.generateQuestion(config)
      variations.push(...temporalQuestions)
    }
    
    // Comparative variations
    const comparativeBaseFact = this.createComparativeVariation(baseFact)
    if (comparativeBaseFact) {
      const config: QuestionGenerationConfig = {
        baseFact: comparativeBaseFact,
        questionTypes: [questionType],
        difficulties: ['hard'],
        generateNegatives: false,
        includeVariations: true,
        maxQuestionsPerType: 2
      }
      
      const comparativeQuestions = await generator.generateQuestion(config)
      variations.push(...comparativeQuestions)
    }
    
    return variations
  }
  
  private async generateContextualApplications(baseFact: BaseFact): Promise<Question[]> {
    const applications: Question[] = []
    
    // Current affairs context
    const currentAffairsContext = this.createCurrentAffairsContext(baseFact)
    if (currentAffairsContext) {
      const caQuestions = await this.generateContextQuestions(currentAffairsContext, 'current-affairs')
      applications.push(...caQuestions)
    }
    
    // Governance context
    const governanceContext = this.createGovernanceContext(baseFact)
    if (governanceContext) {
      const govQuestions = await this.generateContextQuestions(governanceContext, 'governance')
      applications.push(...govQuestions)
    }
    
    // International context
    const internationalContext = this.createInternationalContext(baseFact)
    if (internationalContext) {
      const intlQuestions = await this.generateContextQuestions(internationalContext, 'international')
      applications.push(...intlQuestions)
    }
    
    return applications
  }
  
  private createTemporalVariation(baseFact: BaseFact): BaseFact | null {
    if (!baseFact.content.includes('Article') && !baseFact.content.includes('Amendment')) {
      return null
    }
    
    return {
      ...baseFact,
      id: `${baseFact.id}-temporal`,
      content: `Evolution of ${baseFact.content} through constitutional amendments`,
      concepts: [...baseFact.concepts, 'constitutional evolution', 'historical development'],
      relatedFacts: [...baseFact.relatedFacts, 'constitutional history', 'amendment process']
    }
  }
  
  private createComparativeVariation(baseFact: BaseFact): BaseFact | null {
    return {
      ...baseFact,
      id: `${baseFact.id}-comparative`,
      content: `Comparative analysis of ${baseFact.content} with international practices`,
      concepts: [...baseFact.concepts, 'comparative analysis', 'international comparison'],
      relatedFacts: [...baseFact.relatedFacts, 'global practices', 'constitutional comparison']
    }
  }
  
  private createCurrentAffairsContext(baseFact: BaseFact): BaseFact | null {
    return {
      ...baseFact,
      id: `${baseFact.id}-current`,
      content: `Contemporary application of ${baseFact.content} in current governance challenges`,
      concepts: [...baseFact.concepts, 'current affairs', 'contemporary relevance'],
      relatedFacts: [...baseFact.relatedFacts, 'recent developments', 'current challenges']
    }
  }
  
  private createGovernanceContext(baseFact: BaseFact): BaseFact | null {
    return {
      ...baseFact,
      id: `${baseFact.id}-governance`,
      content: `Implementation of ${baseFact.content} in administrative governance`,
      concepts: [...baseFact.concepts, 'public administration', 'policy implementation'],
      relatedFacts: [...baseFact.relatedFacts, 'administrative efficiency', 'governance challenges']
    }
  }
  
  private createInternationalContext(baseFact: BaseFact): BaseFact | null {
    return {
      ...baseFact,
      id: `${baseFact.id}-international`,
      content: `International implications of ${baseFact.content}`,
      concepts: [...baseFact.concepts, 'international relations', 'global perspective'],
      relatedFacts: [...baseFact.relatedFacts, 'international law', 'global governance']
    }
  }
  
  private async generateContextQuestions(baseFact: BaseFact, context: string): Promise<Question[]> {
    const questions: Question[] = []
    
    // Use different generators based on context
    const contextGenerators = {
      'current-affairs': ['SingleCorrectMCQ', 'MultipleCorrectMCQ', 'StatementBased'],
      'governance': ['CaseStudyBased', 'AssertionReasoning', 'StatementBased'],
      'international': ['MultipleCorrectMCQ', 'MatchTheFollowing', 'DataBased']
    }
    
    const relevantTypes = contextGenerators[context] || ['SingleCorrectMCQ']
    
    for (const type of relevantTypes) {
      const generator = this.generators.get(type as QuestionType)
      if (generator) {
        const config: QuestionGenerationConfig = {
          baseFact,
          questionTypes: [type as QuestionType],
          difficulties: ['medium', 'hard'],
          generateNegatives: false,
          includeVariations: false,
          maxQuestionsPerType: 1
        }
        
        try {
          const contextQuestions = await generator.generateQuestion(config)
          questions.push(...contextQuestions)
        } catch (error) {
          console.warn(`Failed to generate ${context} context questions:`, error)
        }
      }
    }
    
    return questions
  }
  
  private createDifficultyVariation(baseQuestion: Question, targetDifficulty: DifficultyLevel): Question {
    const variation = { ...baseQuestion }
    variation.id = `${baseQuestion.id}-${targetDifficulty}`
    variation.difficulty = targetDifficulty
    
    // Adjust question complexity based on difficulty
    if (targetDifficulty === 'easy') {
      variation.questionText = this.simplifyQuestion(baseQuestion.questionText)
      variation.timeToSolve = Math.max(baseQuestion.timeToSolve - 30, 30)
      variation.conceptsTested = variation.conceptsTested.slice(0, 2)
    } else if (targetDifficulty === 'hard') {
      variation.questionText = this.complexifyQuestion(baseQuestion.questionText)
      variation.timeToSolve = Math.min(baseQuestion.timeToSolve + 30, 180)
      variation.conceptsTested = [...variation.conceptsTested, 'advanced application', 'critical analysis']
    }
    
    return variation
  }
  
  private createPerspectiveVariations(baseQuestion: Question): Question[] {
    const variations: Question[] = []
    
    // Historical perspective
    const historicalVariation = { ...baseQuestion }
    historicalVariation.id = `${baseQuestion.id}-historical`
    historicalVariation.questionText = this.addHistoricalPerspective(baseQuestion.questionText)
    variations.push(historicalVariation)
    
    // Contemporary perspective
    const contemporaryVariation = { ...baseQuestion }
    contemporaryVariation.id = `${baseQuestion.id}-contemporary`
    contemporaryVariation.questionText = this.addContemporaryPerspective(baseQuestion.questionText)
    variations.push(contemporaryVariation)
    
    return variations
  }
  
  private createApplicationVariations(baseQuestion: Question): Question[] {
    const variations: Question[] = []
    
    // Practical application
    const practicalVariation = { ...baseQuestion }
    practicalVariation.id = `${baseQuestion.id}-practical`
    practicalVariation.questionText = this.addPracticalApplication(baseQuestion.questionText)
    variations.push(practicalVariation)
    
    return variations
  }
  
  private createNotVersion(baseQuestion: Question): Question | null {
    if (baseQuestion.type !== 'SingleCorrectMCQ' && baseQuestion.type !== 'MultipleCorrectMCQ') {
      return null
    }
    
    const notVersion = { ...baseQuestion }
    notVersion.id = `${baseQuestion.id}-not`
    notVersion.questionText = baseQuestion.questionText.replace(
      /Which.*?(?=\?)/,
      'Which of the following is NOT'
    )
    
    // Flip the correct/incorrect options
    if (notVersion.data.singleCorrect) {
      notVersion.data.singleCorrect.options.forEach(option => {
        option.isCorrect = !option.isCorrect
      })
    }
    
    return notVersion
  }
  
  private createExceptVersion(baseQuestion: Question): Question | null {
    const exceptVersion = { ...baseQuestion }
    exceptVersion.id = `${baseQuestion.id}-except`
    exceptVersion.questionText = baseQuestion.questionText.replace(
      /Which.*?(?=\?)/,
      'All of the following are correct EXCEPT'
    )
    
    return exceptVersion
  }
  
  private createFalseStatementVersion(baseQuestion: Question): Question | null {
    if (baseQuestion.type !== 'StatementBased') {
      return null
    }
    
    const falseVersion = { ...baseQuestion }
    falseVersion.id = `${baseQuestion.id}-false`
    falseVersion.questionText = baseQuestion.questionText.replace(
      'correct',
      'incorrect'
    )
    
    return falseVersion
  }
  
  private deduplicate(questions: Question[]): Question[] {
    const seen = new Set<string>()
    return questions.filter(question => {
      const key = this.generateQuestionKey(question)
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
  
  private generateQuestionKey(question: Question): string {
    return `${question.type}-${question.difficulty}-${question.questionText.slice(0, 50)}`
  }
  
  private simplifyQuestion(questionText: string): string {
    return questionText
      .replace(/Critically analyze/g, 'What is')
      .replace(/Evaluate/g, 'Identify')
      .replace(/Examine/g, 'Which')
      .replace(/in the context of.*?,/g, '')
  }
  
  private complexifyQuestion(questionText: string): string {
    return questionText
      .replace(/^What/, 'Critically evaluate what')
      .replace(/^Which/, 'Analyze which')
      .replace(/^Identify/, 'Examine and identify')
  }
  
  private addHistoricalPerspective(questionText: string): string {
    return questionText.replace(/(?=\?)/, ' from a historical constitutional development perspective?')
  }
  
  private addContemporaryPerspective(questionText: string): string {
    return questionText.replace(/(?=\?)/, ' in the context of contemporary governance challenges?')
  }
  
  private addPracticalApplication(questionText: string): string {
    return questionText.replace(/(?=\?)/, ' in practical administrative implementation?')
  }
}