import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel
} from '../types'

export class CaseStudyBasedGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['CaseStudyBased']
  protected generatorName = 'CaseStudyBasedGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createCaseStudyBased(baseFact, difficulty)
      questions.push(mainQuestion)
      
      // Generate variations if requested
      if (includeVariations) {
        const variations = await this.createVariations(baseFact, difficulty)
        questions.push(...variations)
      }
    }
    
    return questions
  }
  
  private async createCaseStudyBased(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const { passage, subQuestions } = this.generateCaseStudyData(baseFact, difficulty)
    const questionText = this.generateQuestionText()
    const explanation = this.generateDetailedExplanation(baseFact, passage, subQuestions)
    
    return {
      id: this.generateQuestionId(),
      type: 'CaseStudyBased',
      questionText,
      data: {
        caseStudy: { passage, questions: subQuestions }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'CaseStudyBased'),
      marks: this.determineMarks(difficulty, 'CaseStudyBased'),
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
      tags: this.generateTags(baseFact, 'CaseStudyBased', difficulty)
    }
  }
  
  private generateQuestionText(): string {
    return `Read the following case study carefully and answer the questions that follow:`
  }
  
  private generateCaseStudyData(baseFact: BaseFact, difficulty: DifficultyLevel): {
    passage: string,
    subQuestions: Question[]
  } {
    const caseStudySets = this.getCaseStudySets(baseFact, difficulty)
    const selectedSet = caseStudySets[Math.floor(Math.random() * caseStudySets.length)]
    
    return selectedSet
  }
  
  private getCaseStudySets(baseFact: BaseFact, difficulty: DifficultyLevel): Array<{
    passage: string,
    subQuestions: Question[]
  }> {
    switch (difficulty) {
      case 'easy':
        return this.generateEasyCaseStudies(baseFact)
      case 'medium':
        return this.generateMediumCaseStudies(baseFact)
      case 'hard':
        return this.generateHardCaseStudies(baseFact)
      default:
        return this.generateEasyCaseStudies(baseFact)
    }
  }
  
  private generateEasyCaseStudies(baseFact: BaseFact): Array<{
    passage: string,
    subQuestions: Question[]
  }> {
    return [
      {
        passage: `Ram, a citizen of India, was denied admission to a government medical college despite scoring higher marks than some students who were admitted. The college authorities cited a reservation policy that allocated seats based on social categories. Ram argues that this violates his right to equality under ${baseFact.source}. 

The college maintains that the reservation policy is constitutionally valid and serves the constitutional goal of social justice. Ram approaches the court seeking admission and challenging the reservation policy.`,
        
        subQuestions: [
          {
            id: this.generateQuestionId(),
            type: 'SingleCorrectMCQ',
            questionText: 'Which constitutional right is primarily involved in this case?',
            data: {
              singleCorrect: {
                options: [
                  { id: 'opt1', text: 'Right to Equality', isCorrect: true, explanation: 'This case involves Article 14 - Right to Equality' },
                  { id: 'opt2', text: 'Right to Education', isCorrect: false, explanation: 'While education is involved, the primary issue is equality' },
                  { id: 'opt3', text: 'Right to Life', isCorrect: false, explanation: 'This is not about life and liberty' },
                  { id: 'opt4', text: 'Right to Freedom', isCorrect: false, explanation: 'The issue is not about freedom but equality' }
                ]
              }
            },
            difficulty: 'easy',
            subject: baseFact.subject,
            topic: baseFact.topic,
            baseFact: baseFact.id,
            timeToSolve: 60,
            marks: 2,
            conceptsTested: ['Right to Equality', 'Reservation Policy'],
            explanation: {
              correctAnswer: 'Right to Equality',
              whyCorrect: 'The case involves discrimination in admission based on social categories, which is primarily a matter of Article 14',
              whyOthersWrong: ['Other rights are not the primary issue in this case'],
              conceptClarity: 'Understanding the application of equality principle in reservation policies',
              memoryTrick: 'Equal treatment cases always involve Article 14',
              commonMistakes: ['Confusing with Right to Education'],
              relatedPYQs: ['2022 Prelims - Reservation in promotion']
            },
            metadata: {
              created: new Date().toISOString(),
              qualityScore: 85,
              pyqSimilarity: 75,
              highYieldTopic: true,
              difficultyValidated: true,
              factuallyAccurate: true
            },
            tags: ['constitutional law', 'case study', 'equality']
          }
        ]
      }
    ]
  }
  
  private generateMediumCaseStudies(baseFact: BaseFact): Array<{
    passage: string,
    subQuestions: Question[]
  }> {
    return [
      {
        passage: `A state government passed a law requiring all private schools to reserve 25% seats for economically weaker sections and provide free education to these students. Several private school associations challenged this law arguing that it violates their right to manage educational institutions.

The government defended the law stating that education is a public function and such regulation is necessary for achieving the directive principle of free and compulsory education. The schools argue that forcing them to provide free education amounts to taking of property without compensation.

The matter involves interpretation of ${baseFact.source} and its relationship with property rights and educational rights.`,
        
        subQuestions: [
          {
            id: this.generateQuestionId(),
            type: 'MultipleCorrectMCQ',
            questionText: 'Which constitutional provisions are relevant to this case?',
            data: {
              multipleCorrect: {
                options: [
                  { id: 'opt1', text: 'Article 19(1)(g) - Right to practice profession', isCorrect: true, explanation: 'Running schools is a profession/business' },
                  { id: 'opt2', text: 'Article 21A - Right to Education', isCorrect: true, explanation: 'The case involves educational rights' },
                  { id: 'opt3', text: 'Article 300A - Right to Property', isCorrect: true, explanation: 'Schools claim property rights violation' },
                  { id: 'opt4', text: 'Article 32 - Constitutional Remedies', isCorrect: false, explanation: 'This is the remedy provision, not the substantive right' }
                ],
                correctCount: 3
              }
            },
            difficulty: 'medium',
            subject: baseFact.subject,
            topic: baseFact.topic,
            baseFact: baseFact.id,
            timeToSolve: 90,
            marks: 3,
            conceptsTested: ['Educational Rights', 'Property Rights', 'Professional Freedom'],
            explanation: {
              correctAnswer: 'Articles 19(1)(g), 21A, and 300A',
              whyCorrect: 'All three provisions are directly relevant to the case',
              whyOthersWrong: ['Article 32 is procedural, not substantive'],
              conceptClarity: 'Understanding intersection of multiple constitutional rights',
              memoryTrick: 'Education cases involve multiple rights: profession, education, property',
              commonMistakes: ['Confusing procedural with substantive rights'],
              relatedPYQs: ['2021 Mains - Private school regulation']
            },
            metadata: {
              created: new Date().toISOString(),
              qualityScore: 88,
              pyqSimilarity: 80,
              highYieldTopic: true,
              difficultyValidated: true,
              factuallyAccurate: true
            },
            tags: ['constitutional law', 'education', 'multiple rights']
          }
        ]
      }
    ]
  }
  
  private generateHardCaseStudies(baseFact: BaseFact): Array<{
    passage: string,
    subQuestions: Question[]
  }> {
    return [
      {
        passage: `In a landmark constitutional case, the Supreme Court was faced with determining whether certain traditional practices of a religious community could be regulated by the state when they allegedly violated principles of gender equality and human dignity.

The religious community argued that Article 25 protects their right to practice religion according to their beliefs and that state interference would violate religious autonomy. Women's rights groups contended that these practices violated Articles 14, 15, and 21, and that religious freedom cannot override fundamental rights.

The state government supported regulation, citing its duty under Article 15(3) to make special provisions for women and children. The case required the court to balance religious freedom with gender equality, considering the relationship between ${baseFact.source} and other constitutional provisions.

The court also had to consider whether the practices were essential to religion, the scope of state intervention in religious matters, and the evolution of constitutional interpretation in light of changing social values.`,
        
        subQuestions: [
          {
            id: this.generateQuestionId(),
            type: 'AssertionReasoning',
            questionText: 'Consider the following Assertion (A) and Reason (R):\n\nAssertion (A): Religious practices that violate gender equality can be regulated by the state.\nReason (R): Fundamental rights are hierarchical with equality rights taking precedence over religious freedom.\n\nChoose the correct option:\n(a) Both A and R are true and R is the correct explanation of A\n(b) Both A and R are true but R is not the correct explanation of A\n(c) A is true but R is false\n(d) A is false but R is true',
            data: {
              assertionReasoning: {
                assertion: 'Religious practices that violate gender equality can be regulated by the state',
                reason: 'Fundamental rights are hierarchical with equality rights taking precedence over religious freedom',
                correctRelation: 'assertion-true-reason-false'
              }
            },
            difficulty: 'hard',
            subject: baseFact.subject,
            topic: baseFact.topic,
            baseFact: baseFact.id,
            timeToSolve: 120,
            marks: 4,
            conceptsTested: ['Religious Freedom', 'Gender Equality', 'Constitutional Balance'],
            explanation: {
              correctAnswer: '(c) A is true but R is false',
              whyCorrect: 'The assertion is true as the state can regulate discriminatory practices, but the reason is false as fundamental rights are not hierarchical',
              whyOthersWrong: ['Rights are not hierarchical but require balancing'],
              conceptClarity: 'Understanding the non-hierarchical nature of fundamental rights and need for balancing',
              memoryTrick: 'Rights require balancing, not hierarchy',
              commonMistakes: ['Assuming hierarchy among fundamental rights'],
              relatedPYQs: ['2018 Mains - Religious freedom vs equality']
            },
            metadata: {
              created: new Date().toISOString(),
              qualityScore: 92,
              pyqSimilarity: 85,
              highYieldTopic: true,
              difficultyValidated: true,
              factuallyAccurate: true
            },
            tags: ['constitutional law', 'religious freedom', 'gender equality', 'balancing']
          }
        ]
      }
    ]
  }
  
  private generateDetailedExplanation(baseFact: BaseFact, passage: string, subQuestions: Question[]) {
    return {
      correctAnswer: 'See individual sub-question answers',
      whyCorrect: 'Case study approach tests practical application of constitutional principles',
      whyOthersWrong: ['Alternative approaches may miss practical complexities'],
      conceptClarity: `This case study illustrates the practical application of ${baseFact.content} in real-world scenarios, showing how constitutional principles interact with social issues.`,
      memoryTrick: 'Case studies require identifying key constitutional provisions and their interactions',
      commonMistakes: [
        'Not reading the case study carefully',
        'Missing interconnections between different constitutional provisions',
        'Applying theoretical knowledge without considering practical context'
      ],
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Create administrative law variation
    const adminVariation = await this.createCaseStudyBased(baseFact, difficulty)
    adminVariation.id = this.generateQuestionId()
    
    if (adminVariation.data.caseStudy) {
      adminVariation.data.caseStudy.passage = `A government officer was dismissed from service without following proper procedures. The dismissal order cited misconduct but did not provide specific charges or an opportunity for hearing. The officer challenges the dismissal on grounds of violation of natural justice principles enshrined in constitutional law.`
      
      // Update sub-questions for administrative context
      adminVariation.data.caseStudy.questions = [
        {
          id: this.generateQuestionId(),
          type: 'SingleCorrectMCQ',
          questionText: 'Which principle of natural justice is primarily violated?',
          data: {
            singleCorrect: {
              options: [
                { id: 'opt1', text: 'Audi alteram partem (Right to be heard)', isCorrect: true, explanation: 'No opportunity for hearing was provided' },
                { id: 'opt2', text: 'Nemo judex in causa sua', isCorrect: false, explanation: 'This relates to bias, not hearing' },
                { id: 'opt3', text: 'Due process', isCorrect: false, explanation: 'While related, the specific violation is right to hearing' },
                { id: 'opt4', text: 'Reasoned decision', isCorrect: false, explanation: 'The primary issue is lack of hearing opportunity' }
              ]
            }
          },
          difficulty: 'medium',
          subject: baseFact.subject,
          topic: 'Administrative Law',
          baseFact: baseFact.id,
          timeToSolve: 60,
          marks: 2,
          conceptsTested: ['Natural Justice', 'Administrative Action'],
          explanation: {
            correctAnswer: 'Audi alteram partem (Right to be heard)',
            whyCorrect: 'The officer was not given opportunity to defend against charges',
            whyOthersWrong: ['Other principles not directly violated in this case'],
            conceptClarity: 'Understanding natural justice principles in administrative action',
            memoryTrick: 'Audi alteram partem = hear the other side',
            commonMistakes: ['Confusing different principles of natural justice'],
            relatedPYQs: ['2020 Mains - Natural justice in administration']
          },
          metadata: {
            created: new Date().toISOString(),
            qualityScore: 87,
            pyqSimilarity: 78,
            highYieldTopic: true,
            difficultyValidated: true,
            factuallyAccurate: true
          },
          tags: ['administrative law', 'natural justice', 'case study']
        }
      ]
    }
    
    variations.push(adminVariation)
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'CaseStudyBased') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.caseStudy
    if (!data) {
      issues.push('Missing case study data')
      return
    }
    
    if (!data.passage || data.passage.length < 100) {
      issues.push('Case study passage too short')
      suggestions.push('Provide a detailed case study passage (minimum 100 characters)')
    }
    
    if (!data.questions || data.questions.length === 0) {
      issues.push('No sub-questions provided')
      suggestions.push('Include at least 1-2 sub-questions based on the case study')
    }
    
    if (data.questions.length > 3) {
      issues.push('Too many sub-questions')
      suggestions.push('Limit to 2-3 sub-questions for better focus')
    }
    
    // Validate sub-questions
    data.questions.forEach((subQ, index) => {
      if (!subQ.questionText) {
        issues.push(`Sub-question ${index + 1} missing question text`)
      }
      
      if (!subQ.type) {
        issues.push(`Sub-question ${index + 1} missing type`)
      }
      
      if (!subQ.data) {
        issues.push(`Sub-question ${index + 1} missing question data`)
      }
      
      if (!subQ.explanation) {
        issues.push(`Sub-question ${index + 1} missing explanation`)
      }
    })
    
    // Check passage quality
    if (data.passage.split(' ').length < 50) {
      issues.push('Case study passage should be more detailed')
      suggestions.push('Expand the case study to provide sufficient context')
    }
    
    // Check for realistic scenario
    if (!data.passage.includes('constitutional') && !data.passage.includes('legal') && !data.passage.includes('court')) {
      issues.push('Case study should be legally realistic')
      suggestions.push('Ensure the case study reflects realistic legal scenarios')
    }
  }
}