import { BaseTemplate } from './BaseTemplate'
import { 
  GeneratorConfig, 
  SubjectArea, 
  PracticeQuestion, 
  PreviousYearQuestion,
  InteractiveElement 
} from '../types'

export class ComparativeAnalysisTemplate extends BaseTemplate {
  protected templateName = 'ComparativeAnalysis'
  protected supportedSubjects: SubjectArea[] = [
    'Polity', 'Economy', 'History', 'Geography', 'International Relations'
  ]
  
  generateContent(config: GeneratorConfig) {
    const { topic, subject, difficulty, customParams } = config
    const items = customParams?.items || this.extractComparisonItems(topic)
    
    const introduction = `This lesson provides a comprehensive comparison between ${items.join(' and ')}. Understanding their similarities and differences is crucial for ${subject} preparation as UPSC often tests comparative knowledge through direct questions or expects it in analytical answers.`
    
    const mainExplanation = this.generateComparativeExplanation(items, subject, difficulty)
    
    const examples = [
      `Real-world application: How ${items[0]} differs from ${items[1]} in practice`,
      `Historical evolution: The parallel development of both concepts`,
      `Contemporary relevance: Current debates and policy implications`
    ]
    
    const interactiveElements: InteractiveElement[] = [
      {
        type: 'comparison-table',
        data: {
          headers: ['Aspect', ...items],
          rows: this.generateComparisonRows(items, subject)
        }
      },
      {
        type: 'venn-diagram',
        data: {
          sets: items,
          commonalities: this.findCommonalities(items),
          differences: this.findDifferences(items)
        }
      },
      {
        type: 'slider-comparison',
        data: {
          parameters: ['Effectiveness', 'Cost', 'Implementation', 'Public Support'],
          items: items
        }
      }
    ]
    
    return {
      introduction,
      mainExplanation,
      examples,
      visualElements: [
        `Side-by-side comparison chart`,
        `Timeline showing evolution of both concepts`,
        `Infographic highlighting key differences`
      ],
      interactiveElements
    }
  }
  
  generatePracticeQuestions(config: GeneratorConfig): PracticeQuestion[] {
    const { topic, difficulty, customParams } = config
    const items = customParams?.items || this.extractComparisonItems(topic)
    const questions: PracticeQuestion[] = []
    
    // Question 1: Direct comparison
    questions.push({
      id: `q1-comp-${Date.now()}`,
      question: `Which of the following statements correctly distinguishes between ${items[0]} and ${items[1]}?`,
      options: [
        `${items[0]} is broader in scope while ${items[1]} is more specific`,
        `Both are identical in their application`,
        `${items[1]} is a subset of ${items[0]}`,
        `They operate in completely different domains`
      ],
      correctAnswer: 0,
      explanation: `The key distinction lies in the scope and application. ${items[0]} encompasses...`,
      difficulty: 'beginner',
      conceptsTested: items,
      timeToSolve: 45
    })
    
    // Question 2: Similarity identification
    questions.push({
      id: `q2-comp-${Date.now()}`,
      question: `What is the most significant commonality between ${items[0]} and ${items[1]}?`,
      options: [
        'Both originated in the same historical period',
        'Both serve similar fundamental objectives',
        'Both have identical implementation mechanisms',
        'Both face the same challenges'
      ],
      correctAnswer: 1,
      explanation: `Despite their differences, both concepts share the fundamental objective of...`,
      difficulty: 'intermediate',
      conceptsTested: [...items, 'Commonalities'],
      timeToSolve: 60
    })
    
    // Question 3: Application-based
    questions.push({
      id: `q3-comp-${Date.now()}`,
      question: `In which scenario would ${items[0]} be more appropriate than ${items[1]}?`,
      options: [
        'When dealing with federal structures',
        'In unitary systems of governance',
        'During emergency situations',
        'For routine administrative matters'
      ],
      correctAnswer: 0,
      explanation: `${items[0]} is more suitable in federal structures because...`,
      difficulty: 'intermediate',
      conceptsTested: [...items, 'Practical Application'],
      timeToSolve: 75
    })
    
    if (difficulty === 'advanced') {
      questions.push(this.generateCriticalAnalysisQuestion(items))
      questions.push(this.generateSynthesisQuestion(items))
    } else {
      questions.push(this.generateAdvantageDisadvantageQuestion(items))
      questions.push(this.generateEvolutionQuestion(items))
    }
    
    return questions
  }
  
  generatePreviousYearQuestion(config: GeneratorConfig): PreviousYearQuestion {
    const items = config.customParams?.items || this.extractComparisonItems(config.topic)
    return {
      year: 2022,
      question: `Compare and contrast ${items[0]} and ${items[1]} in the Indian context. Which one has been more effective in achieving its stated objectives? (250 words)`,
      marks: 15,
      expectedAnswer: `Structure:\n1. Brief introduction defining both concepts\n2. Similarities (2-3 points)\n3. Differences (3-4 points)\n4. Effectiveness analysis with examples\n5. Balanced conclusion`,
      examinerInsight: `Look for: Clear understanding of both concepts, logical comparison structure, use of relevant examples, balanced analysis without bias, and substantiated conclusion.`
    }
  }
  
  generateSummary(config: GeneratorConfig) {
    const items = config.customParams?.items || this.extractComparisonItems(config.topic)
    return {
      keyTakeaways: [
        `${items[0]} focuses on X while ${items[1]} emphasizes Y`,
        `Key similarities: Both aim to achieve common goals`,
        `Major differences lie in approach, scope, and implementation`,
        `Context determines which is more appropriate`,
        `UPSC tests both conceptual clarity and practical application`
      ],
      mnemonics: [
        `Remember differences using: SCOPE (Scope, Context, Objective, Process, Effect)`,
        `Similarities: GOAL (Governance, Objectives, Accountability, Legacy)`
      ],
      commonMistakes: [
        `Treating them as mutually exclusive when they can coexist`,
        `Ignoring historical context of their evolution`,
        `Over-simplifying complex differences`,
        `Missing contemporary applications`
      ],
      examTips: [
        `Use comparison tables in answers`,
        `Provide specific examples for each point`,
        `Maintain objectivity - avoid taking sides`,
        `Link to current affairs when possible`
      ]
    }
  }
  
  // Helper methods
  private extractComparisonItems(topic: string): string[] {
    // Extract items from topic like "Parliament vs State Legislature"
    if (topic.includes(' vs ')) {
      return topic.split(' vs ').map(item => item.trim())
    } else if (topic.includes(' and ')) {
      return topic.split(' and ').map(item => item.trim())
    }
    return [topic, 'Related Concept']
  }
  
  private generateComparativeExplanation(items: string[], subject: string, difficulty: string): string {
    let explanation = `## Comprehensive Comparison: ${items.join(' vs ')}\n\n`
    
    explanation += `### 1. Conceptual Overview\n`
    items.forEach(item => {
      explanation += `**${item}**: Fundamental understanding and definition...\n\n`
    })
    
    explanation += `### 2. Key Similarities\n`
    explanation += `- Both concepts share foundational principles...\n`
    explanation += `- Common objectives include...\n`
    explanation += `- Institutional frameworks overlap in...\n\n`
    
    explanation += `### 3. Critical Differences\n`
    explanation += `| Aspect | ${items[0]} | ${items[1]} |\n`
    explanation += `|--------|---------|----------|\n`
    explanation += `| Scope | Broader, encompassing... | Specific, focused on... |\n`
    explanation += `| Authority | Derives from... | Based on... |\n`
    explanation += `| Application | Used in contexts of... | Applied when... |\n\n`
    
    if (difficulty === 'intermediate' || difficulty === 'advanced') {
      explanation += `### 4. Evolutionary Perspective\n`
      explanation += `The historical development shows...\n\n`
      
      explanation += `### 5. Contemporary Relevance\n`
      explanation += `In current scenario, the debate centers on...\n\n`
    }
    
    if (difficulty === 'advanced') {
      explanation += `### 6. Theoretical Frameworks\n`
      explanation += `Scholars have analyzed these through lenses of...\n\n`
      
      explanation += `### 7. Global Perspectives\n`
      explanation += `International comparisons reveal...\n\n`
    }
    
    return explanation
  }
  
  private generateComparisonRows(items: string[], subject: string): Array<string[]> {
    return [
      ['Definition', `${items[0]} is defined as...`, `${items[1]} refers to...`],
      ['Origin', 'Historical origin of concept 1', 'Historical origin of concept 2'],
      ['Scope', 'Broader application', 'Specific application'],
      ['Authority', 'Constitutional/Legal basis 1', 'Constitutional/Legal basis 2'],
      ['Process', 'Implementation mechanism 1', 'Implementation mechanism 2'],
      ['Limitations', 'Constraints of concept 1', 'Constraints of concept 2'],
      ['Examples', 'Practical examples 1', 'Practical examples 2']
    ]
  }
  
  private findCommonalities(items: string[]): string[] {
    return [
      'Both aim to ensure governance',
      'Constitutional backing',
      'Democratic principles',
      'Accountability mechanisms'
    ]
  }
  
  private findDifferences(items: string[]): string[] {
    return [
      `${items[0]}: Broader scope and application`,
      `${items[1]}: Specific focus and limited application`,
      `${items[0]}: Different procedural requirements`,
      `${items[1]}: Unique institutional framework`
    ]
  }
  
  private generateCriticalAnalysisQuestion(items: string[]): PracticeQuestion {
    return {
      id: `q-critical-${Date.now()}`,
      question: `Critically analyze the statement: "${items[0]} has become obsolete in the presence of ${items[1]}"`,
      options: [
        'Completely agree - modern systems have replaced traditional ones',
        'Partially agree - some overlap but both serve different purposes',
        'Disagree - both continue to serve distinct and important functions',
        'Cannot be determined without specific context'
      ],
      correctAnswer: 2,
      explanation: `Both concepts continue to serve distinct functions. While there may be some overlap...`,
      difficulty: 'advanced',
      conceptsTested: [...items, 'Critical Thinking'],
      timeToSolve: 90
    }
  }
  
  private generateSynthesisQuestion(items: string[]): PracticeQuestion {
    return {
      id: `q-synthesis-${Date.now()}`,
      question: `How can ${items[0]} and ${items[1]} be integrated for better governance?`,
      options: [
        'Complete merger into a single system',
        'Maintain strict separation with no interaction',
        'Complementary functioning with defined boundaries',
        'Replace both with a new system'
      ],
      correctAnswer: 2,
      explanation: `The optimal approach involves complementary functioning where each system...`,
      difficulty: 'advanced',
      conceptsTested: [...items, 'Integration', 'Governance'],
      timeToSolve: 80
    }
  }
  
  private generateAdvantageDisadvantageQuestion(items: string[]): PracticeQuestion {
    return {
      id: `q-advantage-${Date.now()}`,
      question: `What is the primary advantage of ${items[0]} over ${items[1]}?`,
      options: [
        'Greater flexibility in implementation',
        'Stronger legal backing',
        'Wider public acceptance',
        'Lower resource requirements'
      ],
      correctAnswer: 0,
      explanation: `The primary advantage of ${items[0]} is its greater flexibility...`,
      difficulty: 'intermediate',
      conceptsTested: items,
      timeToSolve: 60
    }
  }
  
  private generateEvolutionQuestion(items: string[]): PracticeQuestion {
    return {
      id: `q-evolution-${Date.now()}`,
      question: `How did ${items[0]} and ${items[1]} evolve in the Indian context?`,
      options: [
        'Both evolved simultaneously from British legacy',
        `${items[0]} preceded ${items[1]} by several decades`,
        `${items[1]} was a response to limitations of ${items[0]}`,
        'They evolved independently without interaction'
      ],
      correctAnswer: 2,
      explanation: `The evolution shows that ${items[1]} emerged as a response to...`,
      difficulty: 'intermediate',
      conceptsTested: [...items, 'Historical Evolution'],
      timeToSolve: 70
    }
  }
}