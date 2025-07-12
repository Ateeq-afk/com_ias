import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel
} from '../types'

export class SequenceArrangementGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['SequenceArrangement']
  protected generatorName = 'SequenceArrangementGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createSequenceArrangement(baseFact, difficulty)
      questions.push(mainQuestion)
      
      // Generate variations if requested
      if (includeVariations) {
        const variations = await this.createVariations(baseFact, difficulty)
        questions.push(...variations)
      }
    }
    
    return questions
  }
  
  private async createSequenceArrangement(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const { questionText, items, correctSequence, criterion } = this.generateSequenceData(baseFact, difficulty)
    const explanation = this.generateDetailedExplanation(baseFact, items, correctSequence, criterion)
    
    return {
      id: this.generateQuestionId(),
      type: 'SequenceArrangement',
      questionText,
      data: {
        sequenceArrangement: { items, correctSequence, criterion }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'SequenceArrangement'),
      marks: this.determineMarks(difficulty, 'SequenceArrangement'),
      conceptsTested: [baseFact.content, ...baseFact.concepts],
      explanation,
      metadata: {
        created: new Date().toISOString(),
        qualityScore: 0,
        pyqSimilarity: 0,
        highYieldTopic: baseFact.importance === 'high',
        difficultyValidated: false,
        factuallyAccurate: true
      },
      tags: this.generateTags(baseFact, 'SequenceArrangement', difficulty)
    }
  }
  
  private generateSequenceData(baseFact: BaseFact, difficulty: DifficultyLevel): {
    questionText: string,
    items: string[],
    correctSequence: number[],
    criterion: string
  } {
    const sequenceTypes = this.getSequenceTypes(baseFact, difficulty)
    const selectedType = sequenceTypes[Math.floor(Math.random() * sequenceTypes.length)]
    
    return {
      questionText: this.generateQuestionText(selectedType.criterion, difficulty),
      items: selectedType.items,
      correctSequence: selectedType.correctSequence,
      criterion: selectedType.criterion
    }
  }
  
  private generateQuestionText(criterion: string, difficulty: DifficultyLevel): string {
    const baseInstructions = `Arrange the following in the correct ${criterion} order:`
    const options = `
Choose the correct sequence:
(a) 1-2-3-4
(b) 2-1-4-3  
(c) 3-1-2-4
(d) 4-3-2-1`
    
    return baseInstructions + '\n' + options
  }
  
  private getSequenceTypes(baseFact: BaseFact, difficulty: DifficultyLevel): Array<{
    items: string[],
    correctSequence: number[],
    criterion: string
  }> {
    switch (difficulty) {
      case 'easy':
        return this.generateEasySequences(baseFact)
      case 'medium':
        return this.generateMediumSequences(baseFact)
      case 'hard':
        return this.generateHardSequences(baseFact)
      default:
        return this.generateEasySequences(baseFact)
    }
  }
  
  private generateEasySequences(baseFact: BaseFact): Array<{
    items: string[],
    correctSequence: number[],
    criterion: string
  }> {
    return [
      {
        items: [
          'Government of India Act 1935',
          'Indian Independence Act 1947', 
          'Constitution of India 1950',
          'First Constitutional Amendment 1951'
        ],
        correctSequence: [1, 2, 3, 4],
        criterion: 'chronological'
      },
      {
        items: [
          'Fundamental Rights',
          'Directive Principles',
          'Fundamental Duties',
          'Emergency Provisions'
        ],
        correctSequence: [1, 2, 3, 4],
        criterion: 'constitutional order'
      },
      {
        items: [
          'Local Government',
          'State Government',
          'Central Government', 
          'International Bodies'
        ],
        correctSequence: [1, 2, 3, 4],
        criterion: 'hierarchical'
      }
    ]
  }
  
  private generateMediumSequences(baseFact: BaseFact): Array<{
    items: string[],
    correctSequence: number[],
    criterion: string
  }> {
    return [
      {
        items: [
          'Constitutional proposal in Constituent Assembly',
          'Committee examination and deliberation',
          'Assembly debate and voting',
          'President\'s assent and implementation'
        ],
        correctSequence: [1, 2, 3, 4],
        criterion: 'procedural'
      },
      {
        items: [
          'Identification of constitutional issue',
          'Judicial interpretation development',
          'Legislative response and amendment',
          'Constitutional equilibrium restoration'
        ],
        correctSequence: [1, 2, 3, 4],
        criterion: 'logical'
      },
      {
        items: [
          'Individual Rights Protection',
          'State Obligation Implementation', 
          'Judicial Review and Oversight',
          'Democratic Accountability Mechanism'
        ],
        correctSequence: [1, 2, 3, 4],
        criterion: 'functional'
      }
    ]
  }
  
  private generateHardSequences(baseFact: BaseFact): Array<{
    items: string[],
    correctSequence: number[],
    criterion: string
  }> {
    return [
      {
        items: [
          'Pre-constitutional philosophical foundation',
          'Constitutional assembly deliberative process',
          'Post-adoption judicial interpretation evolution',
          'Contemporary constitutional adaptation challenges'
        ],
        correctSequence: [1, 2, 3, 4],
        criterion: 'evolutionary'
      },
      {
        items: [
          'Abstract constitutional principle identification',
          'Concrete legal framework development',
          'Administrative implementation mechanism',
          'Empirical outcome evaluation and refinement'
        ],
        correctSequence: [1, 2, 3, 4],
        criterion: 'implementation'
      },
      {
        items: [
          'Comparative constitutional analysis',
          'Indigenous contextual adaptation',
          'Judicial precedent establishment',
          'Dynamic constitutional jurisprudence'
        ],
        correctSequence: [1, 2, 3, 4],
        criterion: 'jurisprudential'
      }
    ]
  }
  
  private generateDetailedExplanation(baseFact: BaseFact, items: string[], correctSequence: number[], criterion: string) {
    const orderedItems = correctSequence.map(index => `${index}. ${items[index - 1]}`).join(' → ')
    
    const explanationMap = {
      'chronological': 'This sequence follows the historical timeline of constitutional development.',
      'constitutional order': 'This arrangement follows the structural order in the Constitution.',
      'hierarchical': 'This sequence represents the hierarchy from local to international level.',
      'procedural': 'This order reflects the standard constitutional procedure.',
      'logical': 'This sequence follows the logical flow of constitutional processes.',
      'functional': 'This arrangement represents the functional relationship between elements.',
      'evolutionary': 'This sequence shows the evolutionary development of constitutional concepts.',
      'implementation': 'This order reflects the implementation process from concept to practice.',
      'jurisprudential': 'This sequence represents the development of constitutional jurisprudence.'
    }
    
    return {
      correctAnswer: `Correct sequence: ${orderedItems}`,
      whyCorrect: explanationMap[criterion] || 'This sequence follows the logical constitutional order.',
      whyOthersWrong: [
        'Other sequences do not follow the correct chronological/logical order',
        'Alternative arrangements would disrupt the constitutional framework',
        'Incorrect sequences show misunderstanding of constitutional development'
      ],
      conceptClarity: `Understanding ${criterion} arrangement helps in grasping the systematic nature of constitutional provisions and their interconnections.`,
      memoryTrick: this.generateSequenceMemoryTrick(criterion),
      commonMistakes: [
        'Confusing chronological with logical order',
        'Not understanding hierarchical relationships',
        'Missing procedural sequence steps'
      ],
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private generateSequenceMemoryTrick(criterion: string): string {
    const tricks = {
      'chronological': 'Remember: Time flows forward - use years and historical events as anchors',
      'constitutional order': 'Follow the Constitution\'s structure - Parts I, II, III, IV...',
      'hierarchical': 'Think pyramid: Local → State → National → International',
      'procedural': 'Follow the standard process: Proposal → Examination → Decision → Implementation',
      'logical': 'Use cause and effect: Problem → Analysis → Solution → Result',
      'functional': 'Think of working relationships and dependencies',
      'evolutionary': 'Historical development: Past → Present → Future',
      'implementation': 'Theory to practice: Concept → Framework → Action → Evaluation',
      'jurisprudential': 'Legal evolution: Principle → Precedent → Practice → Refinement'
    }
    
    return tricks[criterion] || 'Create logical connections between sequential elements'
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Create reverse sequence variation
    const reverseQuestion = await this.createSequenceArrangement(baseFact, difficulty)
    reverseQuestion.id = this.generateQuestionId()
    
    if (reverseQuestion.data.sequenceArrangement) {
      // Create a reverse chronological sequence
      reverseQuestion.questionText = reverseQuestion.questionText.replace(
        'correct chronological order',
        'reverse chronological order (latest to earliest)'
      )
      
      const originalSequence = reverseQuestion.data.sequenceArrangement.correctSequence
      reverseQuestion.data.sequenceArrangement.correctSequence = [...originalSequence].reverse()
      reverseQuestion.data.sequenceArrangement.criterion = 'reverse chronological'
    }
    
    variations.push(reverseQuestion)
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'SequenceArrangement') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.sequenceArrangement
    if (!data) {
      issues.push('Missing sequence arrangement data')
      return
    }
    
    if (!data.items || data.items.length < 3) {
      issues.push('Must have at least 3 items to sequence')
      suggestions.push('Provide at least 3-4 items for sequencing')
    }
    
    if (data.items.length > 6) {
      issues.push('Too many items (maximum 6 recommended)')
      suggestions.push('Limit to 4-5 items for better complexity management')
    }
    
    if (!data.correctSequence || data.correctSequence.length !== data.items.length) {
      issues.push('Correct sequence length must match items length')
      suggestions.push('Provide sequence numbers for all items')
    }
    
    if (!data.criterion) {
      issues.push('Missing sequencing criterion')
      suggestions.push('Specify the basis for sequencing (chronological, logical, etc.)')
    }
    
    // Validate sequence numbers
    const expectedNumbers = Array.from({length: data.items.length}, (_, i) => i + 1)
    const sequenceNumbers = [...data.correctSequence].sort()
    
    if (JSON.stringify(expectedNumbers) !== JSON.stringify(sequenceNumbers)) {
      issues.push('Sequence numbers must be consecutive integers starting from 1')
      suggestions.push('Use numbers 1, 2, 3... matching the number of items')
    }
    
    // Check item quality
    data.items.forEach((item, index) => {
      if (!item || item.length < 5) {
        issues.push(`Item ${index + 1} is too short`)
      }
    })
    
    // Validate criterion types
    const validCriteria = [
      'chronological', 'logical', 'hierarchical', 'procedural', 
      'functional', 'evolutionary', 'implementation', 'jurisprudential',
      'constitutional order', 'reverse chronological'
    ]
    
    if (!validCriteria.includes(data.criterion)) {
      issues.push('Invalid sequencing criterion')
      suggestions.push('Use standard criteria: chronological, logical, hierarchical, etc.')
    }
  }
}