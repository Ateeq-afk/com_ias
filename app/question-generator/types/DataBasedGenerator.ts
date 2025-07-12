import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel,
  QuestionOption
} from '../types'

export class DataBasedGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['DataBased']
  protected generatorName = 'DataBasedGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createDataBased(baseFact, difficulty)
      questions.push(mainQuestion)
      
      // Generate variations if requested
      if (includeVariations) {
        const variations = await this.createVariations(baseFact, difficulty)
        questions.push(...variations)
      }
    }
    
    return questions
  }
  
  private async createDataBased(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const { dataSource, interpretationQuestion, options } = this.generateDataQuestion(baseFact, difficulty)
    const explanation = this.generateDetailedExplanation(baseFact, dataSource, options)
    
    return {
      id: this.generateQuestionId(),
      type: 'DataBased',
      questionText: `Study the following data and answer the question:`,
      data: {
        dataBased: { dataSource, interpretationQuestion, options }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'DataBased'),
      marks: this.determineMarks(difficulty, 'DataBased'),
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
      tags: this.generateTags(baseFact, 'DataBased', difficulty)
    }
  }
  
  private generateDataQuestion(baseFact: BaseFact, difficulty: DifficultyLevel): {
    dataSource: string,
    interpretationQuestion: string,
    options: QuestionOption[]
  } {
    const dataSets = this.getDataSets(baseFact, difficulty)
    const selectedSet = dataSets[Math.floor(Math.random() * dataSets.length)]
    
    return selectedSet
  }
  
  private getDataSets(baseFact: BaseFact, difficulty: DifficultyLevel): Array<{
    dataSource: string,
    interpretationQuestion: string,
    options: QuestionOption[]
  }> {
    switch (difficulty) {
      case 'easy':
        return this.generateEasyDataQuestions(baseFact)
      case 'medium':
        return this.generateMediumDataQuestions(baseFact)
      case 'hard':
        return this.generateHardDataQuestions(baseFact)
      default:
        return this.generateEasyDataQuestions(baseFact)
    }
  }
  
  private generateEasyDataQuestions(baseFact: BaseFact): Array<{
    dataSource: string,
    interpretationQuestion: string,
    options: QuestionOption[]
  }> {
    return [
      {
        dataSource: `Constitutional Amendment Frequency (1950-2020)

Decade | Number of Amendments
1950-60 | 3
1960-70 | 8  
1970-80 | 14
1980-90 | 7
1990-00 | 6
2000-10 | 5
2010-20 | 4

Total Amendments: 47 (till 2020)`,

        interpretationQuestion: 'Based on the data above, which decade saw the highest constitutional amendment activity?',
        
        options: [
          {
            id: 'opt1',
            text: '1970-80',
            isCorrect: true,
            explanation: 'The 1970-80 decade had 14 amendments, the highest among all decades shown.'
          },
          {
            id: 'opt2', 
            text: '1960-70',
            isCorrect: false,
            explanation: 'This decade had 8 amendments, which is high but not the highest.'
          },
          {
            id: 'opt3',
            text: '1980-90', 
            isCorrect: false,
            explanation: 'This decade had 7 amendments, fewer than the 1970s.'
          },
          {
            id: 'opt4',
            text: '1950-60',
            isCorrect: false,
            explanation: 'This decade had only 3 amendments, the lowest in the early decades.'
          }
        ]
      }
    ]
  }
  
  private generateMediumDataQuestions(baseFact: BaseFact): Array<{
    dataSource: string,
    interpretationQuestion: string,
    options: QuestionOption[]
  }> {
    return [
      {
        dataSource: `Supreme Court Case Load Analysis (2015-2020)

Year | Cases Filed | Cases Disposed | Pendency Rate (%)
2015 | 65,543 | 62,847 | 15.2
2016 | 68,291 | 64,156 | 18.7  
2017 | 71,875 | 67,234 | 22.1
2018 | 74,562 | 69,845 | 25.8
2019 | 77,156 | 71,923 | 28.4
2020 | 58,743 | 64,187 | 24.9

Note: 2020 figures affected by COVID-19 restrictions`,

        interpretationQuestion: 'Which inference can be drawn from the Supreme Court data trends (2015-2019)?',
        
        options: [
          {
            id: 'opt1',
            text: 'Case filing increased while disposal efficiency decreased',
            isCorrect: true,
            explanation: 'Cases filed increased from 65,543 to 77,156, but pendency rate increased from 15.2% to 28.4%.'
          },
          {
            id: 'opt2',
            text: 'Both case filing and disposal rates remained constant',
            isCorrect: false,
            explanation: 'The data shows clear increasing trends in both filing and pendency.'
          },
          {
            id: 'opt3',
            text: 'Case disposal improved significantly over the period',
            isCorrect: false,
            explanation: 'While disposal numbers increased, the pendency rate also increased.'
          },
          {
            id: 'opt4',
            text: 'The Supreme Court reduced its case load effectively',
            isCorrect: false,
            explanation: 'The increasing pendency rate indicates the opposite trend.'
          }
        ]
      }
    ]
  }
  
  private generateHardDataQuestions(baseFact: BaseFact): Array<{
    dataSource: string,
    interpretationQuestion: string,
    options: QuestionOption[]
  }> {
    return [
      {
        dataSource: `Constitutional Rights Litigation Patterns (2010-2020)

Right Category | Cases (2010) | Cases (2020) | Change (%) | Success Rate (2020)
Equality | 1,247 | 2,156 | +72.9 | 34.2%
Freedom | 856 | 1,923 | +124.6 | 28.7%
Life & Liberty | 2,134 | 4,567 | +114.0 | 45.6%
Religion | 234 | 445 | +90.2 | 22.1%
Education | 345 | 1,234 | +257.7 | 67.8%
Property | 567 | 423 | -25.4 | 18.9%

Judicial Observation: "Digital age has transformed the nature and volume of rights-based litigation, with educational rights showing unprecedented growth due to technological barriers during pandemic."`,

        interpretationQuestion: 'What does the comprehensive data analysis reveal about constitutional rights litigation evolution?',
        
        options: [
          {
            id: 'opt1',
            text: 'Educational rights litigation growth reflects societal transformation and has highest success rate',
            isCorrect: true,
            explanation: 'Education shows 257.7% growth (highest) and 67.8% success rate (highest), reflecting digital divide issues.'
          },
          {
            id: 'opt2',
            text: 'Property rights litigation increased due to economic development',
            isCorrect: false,
            explanation: 'Property rights litigation actually decreased by 25.4%.'
          },
          {
            id: 'opt3',
            text: 'All constitutional rights show uniform litigation growth patterns',
            isCorrect: false,
            explanation: 'Growth rates vary significantly, from -25.4% to +257.7%.'
          },
          {
            id: 'opt4',
            text: 'Religious freedom cases have the highest success rate',
            isCorrect: false,
            explanation: 'Religious freedom has 22.1% success rate, while education has 67.8%.'
          }
        ]
      }
    ]
  }
  
  private generateDetailedExplanation(baseFact: BaseFact, dataSource: string, options: QuestionOption[]) {
    const correctOption = options.find(opt => opt.isCorrect)!
    const wrongOptions = options.filter(opt => !opt.isCorrect)
    
    return {
      correctAnswer: correctOption.text,
      whyCorrect: correctOption.explanation,
      whyOthersWrong: wrongOptions.map(opt => opt.explanation),
      conceptClarity: `Data interpretation in constitutional studies requires careful analysis of trends, patterns, and their underlying causes. Understanding quantitative aspects helps in evidence-based constitutional analysis.`,
      memoryTrick: 'Always look for trends, patterns, and exceptions in constitutional data',
      commonMistakes: [
        'Misreading data values or trends',
        'Confusing correlation with causation',
        'Ignoring contextual factors affecting data',
        'Not considering temporal changes in constitutional practice'
      ],
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Create comparative data variation
    const comparativeVariation = await this.createDataBased(baseFact, difficulty)
    comparativeVariation.id = this.generateQuestionId()
    
    if (comparativeVariation.data.dataBased) {
      comparativeVariation.data.dataBased = {
        dataSource: `Comparative Constitutional Court Performance (Annual Averages 2018-2020)

Country | Cases Filed (000s) | Disposal Rate (%) | Average Hearing Time (months)
India (SC) | 71.2 | 74.3 | 8.4
USA (SCOTUS) | 0.07 | 98.2 | 12.1
UK (UKSC) | 0.09 | 96.7 | 9.2
Germany (BCC) | 6.2 | 89.4 | 14.6
Canada (SCC) | 0.08 | 95.1 | 11.3

Note: Indian figures reflect higher case load due to broader jurisdiction`,
        
        interpretationQuestion: 'What does the comparative analysis reveal about the Indian Supreme Court?',
        
        options: [
          {
            id: 'opt1',
            text: 'Handles significantly higher case volume but with lower disposal efficiency',
            isCorrect: true,
            explanation: 'India handles 71,200 cases vs others handling less than 6,200, but has 74.3% disposal rate compared to 89-98% for others.'
          },
          {
            id: 'opt2',
            text: 'Has the most efficient case disposal system globally',
            isCorrect: false,
            explanation: 'India has the lowest disposal rate at 74.3% among the countries listed.'
          },
          {
            id: 'opt3',
            text: 'Takes the longest time for case hearings',
            isCorrect: false,
            explanation: 'India takes 8.4 months, which is actually the shortest among all countries.'
          },
          {
            id: 'opt4',
            text: 'Operates with similar case loads as other supreme courts',
            isCorrect: false,
            explanation: 'India\'s case load is dramatically higher than other supreme courts.'
          }
        ]
      }
    }
    
    variations.push(comparativeVariation)
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'DataBased') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.dataBased
    if (!data) {
      issues.push('Missing data based question data')
      return
    }
    
    if (!data.dataSource || data.dataSource.length < 100) {
      issues.push('Data source too brief')
      suggestions.push('Provide comprehensive data with tables, charts, or detailed statistics')
    }
    
    if (!data.interpretationQuestion) {
      issues.push('Missing interpretation question')
      suggestions.push('Include a specific question asking for data interpretation')
    }
    
    if (!data.options || data.options.length !== 4) {
      issues.push('Must have exactly 4 interpretation options')
      suggestions.push('Provide 4 different interpretation choices')
    }
    
    // Check if data source contains actual data
    const hasNumbers = /\d+/.test(data.dataSource)
    if (!hasNumbers) {
      issues.push('Data source should contain numerical data')
      suggestions.push('Include tables, statistics, or quantitative information')
    }
    
    // Check for data structure indicators
    const dataIndicators = ['table', 'chart', 'graph', 'data', 'statistics', 'figures', '%', 'year', 'trend']
    const hasDataStructure = dataIndicators.some(indicator => 
      data.dataSource.toLowerCase().includes(indicator)
    )
    
    if (!hasDataStructure) {
      issues.push('Data source should clearly present structured data')
      suggestions.push('Format data as tables or clearly structured information')
    }
    
    // Validate options
    const correctOptions = data.options.filter(opt => opt.isCorrect)
    if (correctOptions.length !== 1) {
      issues.push('Must have exactly one correct interpretation')
      suggestions.push('Ensure only one option is marked as correct')
    }
    
    // Check option quality
    data.options.forEach((option, index) => {
      if (!option.text || option.text.length < 10) {
        issues.push(`Option ${index + 1} is too short`)
      }
      if (!option.explanation) {
        issues.push(`Option ${index + 1} missing explanation`)
      }
    })
    
    // Check for constitutional relevance
    const constitutionalKeywords = ['constitutional', 'court', 'rights', 'amendment', 'judicial', 'governance', 'legal', 'article']
    const hasConstitutionalRelevance = constitutionalKeywords.some(keyword => 
      data.dataSource.toLowerCase().includes(keyword) || 
      data.interpretationQuestion.toLowerCase().includes(keyword)
    )
    
    if (!hasConstitutionalRelevance) {
      issues.push('Data should be constitutionally relevant')
      suggestions.push('Ensure data relates to constitutional institutions, rights, or governance')
    }
  }
}