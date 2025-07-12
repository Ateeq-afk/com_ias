import { BaseTemplate } from './BaseTemplate'
import { 
  GeneratorConfig, 
  SubjectArea, 
  PracticeQuestion, 
  PreviousYearQuestion,
  InteractiveElement 
} from '../types'

interface ProcessStep {
  id: string
  name: string
  description: string
  inputs: string[]
  outputs: string[]
  duration?: string
  authority?: string
}

export class ProcessFlowTemplate extends BaseTemplate {
  protected templateName = 'ProcessFlow'
  protected supportedSubjects: SubjectArea[] = [
    'Polity', 'Economy', 'Geography', 'Environment', 'Science & Technology'
  ]
  
  generateContent(config: GeneratorConfig) {
    const { topic, subject, difficulty } = config
    const processSteps = this.generateProcessSteps(topic, subject, difficulty)
    
    const introduction = `Understanding the process flow of ${topic} is crucial for UPSC preparation. This lesson breaks down the complex procedure into manageable steps, highlighting key stakeholders, timelines, and decision points that frequently appear in exam questions.`
    
    const mainExplanation = this.generateProcessExplanation(processSteps, topic, subject, difficulty)
    
    const examples = [
      `Real Case: How the ${topic} process worked in the recent XYZ instance`,
      `Exception Scenarios: When normal process is bypassed or modified`,
      `Comparative Process: How other countries handle similar procedures`
    ]
    
    const interactiveElements: InteractiveElement[] = [
      {
        type: 'interactive-flowchart',
        data: {
          steps: processSteps,
          connections: this.generateConnections(processSteps),
          decisionPoints: this.identifyDecisionPoints(processSteps)
        }
      },
      {
        type: 'process-simulator',
        data: {
          scenarios: this.generateScenarios(topic),
          outcomes: this.possibleOutcomes(topic)
        }
      },
      {
        type: 'stakeholder-map',
        data: {
          stakeholders: this.identifyStakeholders(processSteps),
          interactions: this.mapInteractions(processSteps)
        }
      }
    ]
    
    return {
      introduction,
      mainExplanation,
      examples,
      visualElements: [
        `Detailed process flowchart with decision diamonds`,
        `Timeline diagram showing typical duration`,
        `Stakeholder interaction matrix`
      ],
      interactiveElements
    }
  }
  
  generatePracticeQuestions(config: GeneratorConfig): PracticeQuestion[] {
    const { topic, difficulty } = config
    const questions: PracticeQuestion[] = []
    
    // Question 1: Sequence identification
    questions.push({
      id: `q1-process-${Date.now()}`,
      question: `What is the correct sequence of steps in the ${topic} process?`,
      options: [
        'Initiation → Review → Approval → Implementation',
        'Review → Initiation → Implementation → Approval',
        'Approval → Initiation → Review → Implementation',
        'Initiation → Approval → Review → Implementation'
      ],
      correctAnswer: 0,
      explanation: `The correct sequence follows the logical flow where initiation must precede review...`,
      difficulty: 'beginner',
      conceptsTested: [topic, 'Process Sequence'],
      timeToSolve: 45
    })
    
    // Question 2: Stakeholder roles
    questions.push({
      id: `q2-process-${Date.now()}`,
      question: `Which authority is responsible for the final approval in the ${topic} process?`,
      options: [
        'Executive authority at the state level',
        'Legislative committee concerned',
        'Judicial review board',
        'Administrative head of department'
      ],
      correctAnswer: 1,
      explanation: `The legislative committee holds the final approval authority because...`,
      difficulty: 'intermediate',
      conceptsTested: [topic, 'Authority and Responsibility'],
      timeToSolve: 60
    })
    
    // Question 3: Time limits
    questions.push({
      id: `q3-process-${Date.now()}`,
      question: `What is the mandatory time limit for completing the ${topic} process?`,
      options: [
        '30 days from initiation',
        '60 days with possible extension',
        '90 days strict deadline',
        'No specific time limit'
      ],
      correctAnswer: 1,
      explanation: `The process must be completed within 60 days, but can be extended by 30 days if...`,
      difficulty: 'intermediate',
      conceptsTested: [topic, 'Procedural Timelines'],
      timeToSolve: 50
    })
    
    if (difficulty === 'advanced') {
      questions.push(this.generateExceptionQuestion(topic))
      questions.push(this.generateOptimizationQuestion(topic))
    } else {
      questions.push(this.generateBottleneckQuestion(topic))
      questions.push(this.generateOutputQuestion(topic))
    }
    
    return questions
  }
  
  generatePreviousYearQuestion(config: GeneratorConfig): PreviousYearQuestion {
    const { topic } = config
    return {
      year: 2020,
      question: `Examine the ${topic} process in India. What are the major bottlenecks and how can they be addressed to improve efficiency? (250 words)`,
      marks: 15,
      expectedAnswer: `Structure:\n1. Brief overview of the process (2-3 steps)\n2. Major bottlenecks (3-4 points):\n   - Bureaucratic delays\n   - Lack of coordination\n   - Resource constraints\n   - Procedural complexities\n3. Solutions (3-4 points):\n   - Digital integration\n   - Single window clearance\n   - Time-bound disposal\n   - Capacity building\n4. Conclusion with way forward`,
      examinerInsight: `Examiners expect: Clear understanding of the process, identification of practical problems (not theoretical), feasible solutions, and examples from recent reforms or committee recommendations.`
    }
  }
  
  generateSummary(config: GeneratorConfig) {
    const { topic } = config
    return {
      keyTakeaways: [
        `${topic} process involves X major steps with Y stakeholders`,
        `Critical decision points occur at stages 2, 4, and 6`,
        `Average timeline: 60-90 days under normal circumstances`,
        `Key authorities: Initiating, Reviewing, and Approving bodies`,
        `Common bottlenecks: Documentation, coordination, and approval delays`
      ],
      mnemonics: [
        `PROCESS: Plan, Review, Obtain approval, Check, Execute, Supervise, Sign-off`,
        `Remember authorities using CLEAR: Check, Legislature, Executive, Audit, Review`
      ],
      commonMistakes: [
        `Confusing the sequence of steps`,
        `Missing the role of checking/audit authorities`,
        `Ignoring exceptional circumstances and bypass provisions`,
        `Overlooking time limits and extension provisions`
      ],
      examTips: [
        `Draw a simple flowchart in answers`,
        `Mention specific articles/rules governing the process`,
        `Include recent examples or case studies`,
        `Highlight reforms or committee recommendations`
      ]
    }
  }
  
  // Helper methods
  private generateProcessSteps(topic: string, subject: string, difficulty: string): ProcessStep[] {
    const baseSteps: ProcessStep[] = [
      {
        id: 'step1',
        name: 'Initiation',
        description: `The ${topic} process begins with formal initiation by authorized entity`,
        inputs: ['Application/Proposal', 'Supporting documents', 'Fee payment'],
        outputs: ['Acknowledgment', 'Reference number', 'Timeline communication'],
        duration: '1-3 days',
        authority: 'Initiating Authority'
      },
      {
        id: 'step2',
        name: 'Preliminary Review',
        description: 'Initial scrutiny for completeness and eligibility',
        inputs: ['Submitted documents', 'Eligibility criteria', 'Checklists'],
        outputs: ['Review report', 'Deficiency list', 'Preliminary approval'],
        duration: '7-10 days',
        authority: 'Reviewing Officer'
      },
      {
        id: 'step3',
        name: 'Detailed Examination',
        description: 'Comprehensive analysis of proposal merits',
        inputs: ['Complete application', 'Review report', 'Expert opinions'],
        outputs: ['Detailed report', 'Recommendations', 'Conditions if any'],
        duration: '15-20 days',
        authority: 'Technical Committee'
      },
      {
        id: 'step4',
        name: 'Stakeholder Consultation',
        description: 'Seeking inputs from affected parties',
        inputs: ['Examination report', 'Stakeholder list', 'Consultation framework'],
        outputs: ['Feedback compilation', 'Objections', 'Suggestions'],
        duration: '20-30 days',
        authority: 'Consultation Cell'
      }
    ]
    
    if (difficulty === 'intermediate' || difficulty === 'advanced') {
      baseSteps.push(
        {
          id: 'step5',
          name: 'Decision Making',
          description: 'Final decision based on all inputs',
          inputs: ['All reports', 'Stakeholder feedback', 'Policy guidelines'],
          outputs: ['Decision document', 'Approval/Rejection', 'Conditions'],
          duration: '10-15 days',
          authority: 'Competent Authority'
        },
        {
          id: 'step6',
          name: 'Implementation',
          description: 'Execution of approved decision',
          inputs: ['Approval order', 'Implementation plan', 'Resources'],
          outputs: ['Implementation report', 'Compliance certificate', 'Outcomes'],
          duration: '30-90 days',
          authority: 'Implementation Agency'
        }
      )
    }
    
    if (difficulty === 'advanced') {
      baseSteps.push(
        {
          id: 'step7',
          name: 'Monitoring & Evaluation',
          description: 'Ongoing assessment of implementation',
          inputs: ['Progress reports', 'Field data', 'Feedback'],
          outputs: ['Monitoring reports', 'Course corrections', 'Impact assessment'],
          duration: 'Continuous',
          authority: 'Monitoring Cell'
        },
        {
          id: 'step8',
          name: 'Audit & Closure',
          description: 'Final audit and formal closure',
          inputs: ['All documents', 'Outcomes', 'Audit criteria'],
          outputs: ['Audit report', 'Lessons learned', 'Closure certificate'],
          duration: '30 days',
          authority: 'Audit Authority'
        }
      )
    }
    
    return baseSteps
  }
  
  private generateProcessExplanation(steps: ProcessStep[], topic: string, subject: string, difficulty: string): string {
    let explanation = `## Detailed Process Flow: ${topic}\n\n`
    
    explanation += `### Overview\n`
    explanation += `The ${topic} process is a systematic procedure involving ${steps.length} major steps...\n\n`
    
    explanation += `### Step-by-Step Breakdown\n\n`
    steps.forEach((step, index) => {
      explanation += `#### Step ${index + 1}: ${step.name}\n`
      explanation += `**Description**: ${step.description}\n\n`
      explanation += `**Inputs Required**:\n`
      step.inputs.forEach(input => {
        explanation += `- ${input}\n`
      })
      explanation += `\n**Expected Outputs**:\n`
      step.outputs.forEach(output => {
        explanation += `- ${output}\n`
      })
      explanation += `\n**Timeline**: ${step.duration}\n`
      explanation += `**Responsible Authority**: ${step.authority}\n\n`
    })
    
    if (difficulty === 'intermediate' || difficulty === 'advanced') {
      explanation += `### Critical Decision Points\n`
      explanation += `The process has several critical junctures where decisions can significantly impact outcomes...\n\n`
      
      explanation += `### Exceptional Circumstances\n`
      explanation += `In certain situations, the normal process may be modified or expedited...\n\n`
    }
    
    if (difficulty === 'advanced') {
      explanation += `### Process Optimization\n`
      explanation += `Recent reforms have focused on streamlining through...\n\n`
      
      explanation += `### Comparative Analysis\n`
      explanation += `Compared to international best practices, this process...\n\n`
    }
    
    return explanation
  }
  
  private generateConnections(steps: ProcessStep[]): Array<{from: string, to: string, type: string}> {
    const connections = []
    for (let i = 0; i < steps.length - 1; i++) {
      connections.push({
        from: steps[i].id,
        to: steps[i + 1].id,
        type: 'sequential'
      })
    }
    // Add some feedback loops
    if (steps.length > 4) {
      connections.push({
        from: steps[3].id,
        to: steps[1].id,
        type: 'feedback'
      })
    }
    return connections
  }
  
  private identifyDecisionPoints(steps: ProcessStep[]): Array<{stepId: string, decisions: string[]}> {
    return [
      {
        stepId: steps[1].id,
        decisions: ['Accept for processing', 'Reject for deficiencies', 'Request clarification']
      },
      {
        stepId: steps[steps.length - 2]?.id || steps[2].id,
        decisions: ['Approve', 'Reject', 'Approve with conditions', 'Defer for more information']
      }
    ]
  }
  
  private generateScenarios(topic: string): Array<{name: string, description: string, variations: string[]}> {
    return [
      {
        name: 'Standard Scenario',
        description: `Normal ${topic} process without complications`,
        variations: ['All documents complete', 'No objections', 'Clear compliance']
      },
      {
        name: 'Complex Scenario',
        description: `${topic} process with multiple stakeholder conflicts`,
        variations: ['Competing interests', 'Legal challenges', 'Policy ambiguities']
      },
      {
        name: 'Fast-track Scenario',
        description: `Expedited ${topic} process under special provisions`,
        variations: ['Emergency provisions', 'Priority sector', 'Time-critical nature']
      }
    ]
  }
  
  private possibleOutcomes(topic: string): string[] {
    return [
      'Full approval without conditions',
      'Conditional approval with compliance requirements',
      'Partial approval for phased implementation',
      'Deferment for additional information',
      'Rejection with reasons',
      'Referral to higher authority'
    ]
  }
  
  private identifyStakeholders(steps: ProcessStep[]): Array<{name: string, role: string, influence: 'high' | 'medium' | 'low'}> {
    const stakeholders = []
    steps.forEach(step => {
      if (step.authority) {
        stakeholders.push({
          name: step.authority,
          role: `Responsible for ${step.name}`,
          influence: step.name.includes('Decision') || step.name.includes('Approval') ? 'high' : 'medium'
        })
      }
    })
    return stakeholders
  }
  
  private mapInteractions(steps: ProcessStep[]): Array<{from: string, to: string, nature: string}> {
    return [
      {
        from: 'Initiating Authority',
        to: 'Reviewing Officer',
        nature: 'Submission and clarification'
      },
      {
        from: 'Technical Committee',
        to: 'Competent Authority',
        nature: 'Recommendations and reports'
      },
      {
        from: 'Stakeholders',
        to: 'Consultation Cell',
        nature: 'Feedback and objections'
      }
    ]
  }
  
  private generateExceptionQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-exception-${Date.now()}`,
      question: `Under which circumstances can the normal ${topic} process be bypassed?`,
      options: [
        'National emergency or security concerns',
        'At the discretion of implementing officer',
        'When stakeholders unanimously agree',
        'It cannot be bypassed under any circumstance'
      ],
      correctAnswer: 0,
      explanation: `The process can be bypassed only under national emergency or security concerns as provided in...`,
      difficulty: 'advanced',
      conceptsTested: [topic, 'Exceptional Provisions'],
      timeToSolve: 70
    }
  }
  
  private generateOptimizationQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-optimize-${Date.now()}`,
      question: `Which recent reform has most significantly reduced the timeline of ${topic} process?`,
      options: [
        'Introduction of e-governance portal',
        'Delegation of powers to lower authorities',
        'Parallel processing of steps',
        'Reduction in documentation requirements'
      ],
      correctAnswer: 2,
      explanation: `Parallel processing has reduced timeline from 120 days to 60 days by allowing...`,
      difficulty: 'advanced',
      conceptsTested: [topic, 'Process Reforms'],
      timeToSolve: 75
    }
  }
  
  private generateBottleneckQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-bottleneck-${Date.now()}`,
      question: `What is the most common cause of delay in the ${topic} process?`,
      options: [
        'Incomplete documentation at initiation',
        'Lengthy stakeholder consultation',
        'Technical committee examination',
        'Final approval stage'
      ],
      correctAnswer: 1,
      explanation: `Stakeholder consultation often extends beyond stipulated time due to...`,
      difficulty: 'intermediate',
      conceptsTested: [topic, 'Process Challenges'],
      timeToSolve: 60
    }
  }
  
  private generateOutputQuestion(topic: string): PracticeQuestion {
    return {
      id: `q-output-${Date.now()}`,
      question: `What is the final output of a successful ${topic} process?`,
      options: [
        'Approval letter only',
        'Implementation certificate',
        'Compliance report and closure certificate',
        'Stakeholder satisfaction report'
      ],
      correctAnswer: 2,
      explanation: `The process concludes with both compliance report and formal closure certificate which...`,
      difficulty: 'beginner',
      conceptsTested: [topic, 'Process Outputs'],
      timeToSolve: 45
    }
  }
}