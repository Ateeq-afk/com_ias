import { UPSCEvaluationEngine } from '../engine/EvaluationEngine'
import { ModelAnswerGenerator } from '../generators/ModelAnswerGenerator'
import { ProgressTracker } from '../tracking/ProgressTracker'
import { Question, AnswerInput, EvaluationResponse } from '../types'

export class AnswerEvaluationDemo {
  private evaluationEngine: UPSCEvaluationEngine
  private modelGenerator: ModelAnswerGenerator
  private progressTracker: ProgressTracker

  constructor() {
    this.evaluationEngine = new UPSCEvaluationEngine()
    this.modelGenerator = new ModelAnswerGenerator()
    this.progressTracker = new ProgressTracker()
  }

  async generateDemonstration(): Promise<{
    gs1Demo: EvaluationResponse,
    gs2Demo: EvaluationResponse,
    gs3Demo: EvaluationResponse,
    gs4Demo: EvaluationResponse,
    essayDemo: EvaluationResponse
  }> {
    // Generate sample evaluations for different question types
    const gs1Demo = await this.demonstrateGS1Evaluation()
    const gs2Demo = await this.demonstrateGS2Evaluation()
    const gs3Demo = await this.demonstrateGS3Evaluation()
    const gs4Demo = await this.demonstrateGS4Evaluation()
    const essayDemo = await this.demonstrateEssayEvaluation()

    return { gs1Demo, gs2Demo, gs3Demo, gs4Demo, essayDemo }
  }

  private async demonstrateGS1Evaluation(): Promise<EvaluationResponse> {
    const question: Question = {
      id: 'gs1-history-001',
      text: 'Analyze the significance of the Harappan civilization in understanding early urban planning in the Indian subcontinent. (250 words)',
      subject: 'GS1',
      topic: 'Ancient History',
      subtopic: 'Harappan Civilization',
      difficulty: 'medium',
      wordLimit: 250,
      timeLimit: 30,
      year: 2023,
      source: 'upsc',
      keywords: ['Harappan', 'urban planning', 'civilization', 'drainage system', 'grid pattern', 'archaeological'],
      expectedPoints: [
        'Urban planning features',
        'Drainage system',
        'Grid pattern streets',
        'Water management',
        'Archaeological evidence'
      ],
      modelAnswers: []
    }

    const sampleAnswer: AnswerInput = {
      id: 'answer-001',
      questionId: question.id,
      userId: 'demo-user',
      content: `The Harappan civilization represents one of the earliest examples of sophisticated urban planning in the Indian subcontinent. Archaeological excavations at sites like Harappa and Mohenjo-daro reveal remarkable city planning that demonstrates advanced civic sense.

The most striking feature is the grid pattern layout with streets intersecting at right angles. This systematic approach to city planning shows remarkable foresight and administrative efficiency. The drainage system is particularly impressive, with covered drains running along streets, connected to house drains, indicating advanced sanitation awareness.

Water management was another crucial aspect, with the Great Bath at Mohenjo-daro showcasing hydraulic engineering skills. Wells were strategically located throughout cities, ensuring water supply to all areas. The uniform brick sizes and standardized weights and measures indicate centralized planning and quality control.

However, the civilization lacked monumental architecture like pyramids or temples, suggesting a more egalitarian society focused on practical urban amenities rather than religious grandeur. The absence of clear palaces or royal residences supports this interpretation.

The Harappan urban planning principles influenced later Indian city planning, with concepts of drainage, water management, and systematic layouts being adopted by subsequent civilizations. This demonstrates the enduring legacy of Harappan innovation in urban development, making it a cornerstone for understanding early urbanization in South Asia.`,
      format: 'text',
      wordCount: 247,
      timeSpent: 1650,
      submittedAt: new Date()
    }

    const evaluation = await this.evaluationEngine.evaluateAnswer(question, sampleAnswer)
    const modelAnswer = this.modelGenerator.generateModelAnswer(question, 250)

    return {
      evaluationId: `eval-${Date.now()}`,
      score: evaluation.score,
      feedback: evaluation.feedback,
      upscAnalysis: evaluation.upscAnalysis,
      modelAnswer,
      processingTime: 2.5
    }
  }

  private async demonstrateGS2Evaluation(): Promise<EvaluationResponse> {
    const question: Question = {
      id: 'gs2-polity-001',
      text: 'Examine the role of Article 32 of the Indian Constitution in protecting fundamental rights. (150 words)',
      subject: 'GS2',
      topic: 'Indian Polity',
      subtopic: 'Fundamental Rights',
      difficulty: 'easy',
      wordLimit: 150,
      timeLimit: 20,
      year: 2024,
      source: 'upsc',
      keywords: ['Article 32', 'fundamental rights', 'constitutional remedy', 'Supreme Court', 'writs'],
      expectedPoints: [
        'Right to constitutional remedies',
        'Direct access to Supreme Court',
        'Writ jurisdiction',
        'Guardian of fundamental rights',
        'Dr. Ambedkar\'s views'
      ],
      modelAnswers: []
    }

    const sampleAnswer: AnswerInput = {
      id: 'answer-002',
      questionId: question.id,
      userId: 'demo-user',
      content: `Article 32, known as the "Right to Constitutional Remedies," is the heart and soul of the Indian Constitution according to Dr. B.R. Ambedkar. It empowers citizens to directly approach the Supreme Court when their fundamental rights are violated.

The article grants the Supreme Court power to issue writs including habeas corpus, mandamus, prohibition, certiorari, and quo-warranto. This ensures that fundamental rights are not merely decorative but have effective enforcement mechanisms.

Recent cases like the privacy judgment and Aadhaar verdict demonstrate Article 32's contemporary relevance. During the COVID-19 pandemic, the Supreme Court used Article 32 to address migrant workers' rights and healthcare access issues.

However, challenges exist including pendency of cases and accessibility for marginalized sections. The judiciary sometimes faces criticism for judicial overreach while exercising Article 32 powers.

Way forward includes alternative dispute resolution mechanisms, legal aid expansion, and technology integration for better access. Article 32 remains crucial for protecting democracy and ensuring constitutional values are upheld.`,
      format: 'text',
      wordCount: 148,
      timeSpent: 1200,
      submittedAt: new Date()
    }

    const evaluation = await this.evaluationEngine.evaluateAnswer(question, sampleAnswer)
    const modelAnswer = this.modelGenerator.generateModelAnswer(question, 150)

    return {
      evaluationId: `eval-${Date.now()}`,
      score: evaluation.score,
      feedback: evaluation.feedback,
      upscAnalysis: evaluation.upscAnalysis,
      modelAnswer,
      processingTime: 2.1
    }
  }

  private async demonstrateGS3Evaluation(): Promise<EvaluationResponse> {
    const question: Question = {
      id: 'gs3-economy-001',
      text: 'Discuss the impact of digital payment systems on financial inclusion in India. Analyze both benefits and challenges. (250 words)',
      subject: 'GS3',
      topic: 'Indian Economy',
      subtopic: 'Digital Economy',
      difficulty: 'medium',
      wordLimit: 250,
      timeLimit: 30,
      year: 2024,
      source: 'upsc',
      keywords: ['digital payments', 'financial inclusion', 'UPI', 'cashless economy', 'Jan Dhan', 'fintech'],
      expectedPoints: [
        'UPI and digital infrastructure',
        'Jan Dhan-Aadhaar-Mobile trinity',
        'Rural penetration',
        'Financial literacy challenges',
        'Cyber security concerns'
      ],
      modelAnswers: []
    }

    const sampleAnswer: AnswerInput = {
      id: 'answer-003',
      questionId: question.id,
      userId: 'demo-user',
      content: `Digital payment systems have revolutionized financial inclusion in India, transforming the economic landscape through innovative technology solutions.

**Benefits:**
The Unified Payments Interface (UPI) has democratized financial transactions, enabling seamless money transfers even for rural populations. The Jan Dhan-Aadhaar-Mobile (JAM) trinity has brought millions of unbanked individuals into the formal financial system. According to RBI data, digital transactions reached ₹14.3 trillion in 2024, indicating massive adoption.

Rural areas have particularly benefited through mobile banking and payment apps. Small merchants can now accept digital payments without expensive point-of-sale terminals. Government benefit transfers through Direct Benefit Transfer (DBT) have reduced leakages and ensured targeted delivery.

**Challenges:**
However, significant challenges persist. Digital literacy remains low, especially among elderly and rural populations. Cybersecurity threats and fraud cases have increased, creating trust issues. Network connectivity problems in remote areas limit digital payment accessibility.

The digital divide excludes many from these benefits, while concerns about data privacy and surveillance persist. Small-value transactions still prefer cash due to convenience and habit.

**Way Forward:**
Enhanced financial literacy programs, robust cybersecurity frameworks, and improved rural connectivity are essential. Public-private partnerships can drive innovation while ensuring inclusive growth. The focus should be on making digital payments more secure, accessible, and user-friendly to achieve true financial inclusion.`,
      format: 'text',
      wordCount: 248,
      timeSpent: 1800,
      submittedAt: new Date()
    }

    const evaluation = await this.evaluationEngine.evaluateAnswer(question, sampleAnswer)
    const modelAnswer = this.modelGenerator.generateModelAnswer(question, 250)

    return {
      evaluationId: `eval-${Date.now()}`,
      score: evaluation.score,
      feedback: evaluation.feedback,
      upscAnalysis: evaluation.upscAnalysis,
      modelAnswer,
      processingTime: 2.8
    }
  }

  private async demonstrateGS4Evaluation(): Promise<EvaluationResponse> {
    const question: Question = {
      id: 'gs4-ethics-001',
      text: 'You are a District Collector and discover that a prestigious government contract was awarded to a company owned by your close friend. The contract appears legally sound but you suspect favoritism. Your friend has helped your family during difficult times. What should you do? Discuss the ethical issues involved.',
      subject: 'GS4',
      topic: 'Ethics',
      subtopic: 'Case Study',
      difficulty: 'hard',
      wordLimit: 250,
      timeLimit: 35,
      year: 2024,
      source: 'upsc',
      keywords: ['conflict of interest', 'personal relationships', 'official duty', 'transparency', 'accountability'],
      expectedPoints: [
        'Conflict of interest identification',
        'Stakeholder analysis',
        'Ethical frameworks',
        'Available options',
        'Recommended action'
      ],
      modelAnswers: []
    }

    const sampleAnswer: AnswerInput = {
      id: 'answer-004',
      questionId: question.id,
      userId: 'demo-user',
      content: `This case presents a classic conflict between personal relationships and professional ethics, requiring careful analysis of competing values.

**Ethical Issues:**
1. **Conflict of Interest**: Personal friendship creates potential bias in judgment
2. **Appearance of Impropriety**: Even if legal, public perception matters
3. **Duty vs. Gratitude**: Official responsibility conflicts with personal loyalty
4. **Transparency**: Public trust depends on transparent decision-making

**Stakeholder Analysis:**
- **Public**: Expects fair, transparent governance
- **Friend**: May face scrutiny but deserves fair treatment
- **Government**: Requires ethical conduct from officials
- **Self**: Must maintain integrity and credibility

**Available Options:**
1. **Ignore**: Maintain status quo if legally sound
2. **Investigate**: Conduct thorough review of the process
3. **Recuse**: Transfer the matter to another authority
4. **Report**: Inform higher authorities about potential conflict

**Recommended Action:**
I would recuse myself from any decisions related to this contract and formally report the potential conflict of interest to my superiors. This ensures:
- Transparency and accountability
- Protection of public interest
- Preservation of personal and professional integrity
- Fair treatment for all parties

**Justification:**
While grateful to my friend, my primary duty is to the public. The appearance of favoritism, even if unfounded, can erode public trust. Recusal demonstrates commitment to ethical governance while allowing proper investigation without bias.

True friendship would appreciate this principled stand rather than expecting compromised ethics.`,
      format: 'text',
      wordCount: 242,
      timeSpent: 2100,
      submittedAt: new Date()
    }

    const evaluation = await this.evaluationEngine.evaluateAnswer(question, sampleAnswer)
    const modelAnswer = this.modelGenerator.generateModelAnswer(question, 250)

    return {
      evaluationId: `eval-${Date.now()}`,
      score: evaluation.score,
      feedback: evaluation.feedback,
      upscAnalysis: evaluation.upscAnalysis,
      modelAnswer,
      processingTime: 3.2
    }
  }

  private async demonstrateEssayEvaluation(): Promise<EvaluationResponse> {
    const question: Question = {
      id: 'essay-001',
      text: '"Technology is best when it brings people together." - Discuss this statement in the context of modern India\'s digital transformation.',
      subject: 'Essay',
      topic: 'Technology and Society',
      subtopic: 'Digital Transformation',
      difficulty: 'hard',
      wordLimit: 1000,
      timeLimit: 90,
      year: 2024,
      source: 'upsc',
      keywords: ['technology', 'digital transformation', 'social cohesion', 'connectivity', 'India'],
      expectedPoints: [
        'Introduction with thesis',
        'Digital India initiatives',
        'Social media and connectivity',
        'Digital divide challenges',
        'Way forward and conclusion'
      ],
      modelAnswers: []
    }

    const sampleAnswer: AnswerInput = {
      id: 'answer-005',
      questionId: question.id,
      userId: 'demo-user',
      content: `**Introduction**

Technology serves as a powerful catalyst for human connection, transcending geographical boundaries and social barriers. In the context of India's digital transformation, this statement resonates profoundly as the nation leverages technology to bridge divides and foster inclusivity. From rural villages accessing government services through Common Service Centers to students attending virtual classes during the pandemic, technology has indeed brought people together in unprecedented ways.

**Digital India: Connecting the Unconnected**

The Digital India initiative exemplifies technology's unifying potential. The Jan Aushadhi portal connects patients to affordable medicines nationwide, while the ONDC platform enables small merchants to compete with large e-commerce players. UPI has democratized financial transactions, allowing a vegetable vendor in Kerala to receive payments from customers across India.

The Aarogya Setu app during COVID-19 demonstrated technology's role in collective welfare, enabling contact tracing and health monitoring on a national scale. Similarly, the CoWIN platform ensured equitable vaccine distribution, bringing together citizens from diverse backgrounds in a common health mission.

**Educational and Social Connectivity**

Technology has revolutionized education access in India. The DIKSHA platform provides learning resources to students regardless of their socio-economic background. Online learning during the pandemic ensured educational continuity, though it also exposed digital divides.

Social media platforms have enabled new forms of community building. WhatsApp groups for apartment societies, LinkedIn networks for professional growth, and YouTube channels for skill development have created virtual communities that complement physical interactions.

**Challenges and Contradictions**

However, technology's unifying potential faces significant challenges. The digital divide between urban and rural areas, wealthy and poor, educated and illiterate creates new forms of exclusion. Misinformation spread through social media has sometimes divided communities rather than uniting them.

Privacy concerns and surveillance fears can create distrust, while algorithmic biases may perpetuate existing social inequalities. The challenge lies in ensuring technology serves as a bridge rather than a barrier.

**Way Forward**

India must focus on inclusive digital growth, ensuring technology reaches the last mile. Digital literacy programs, affordable internet access, and user-friendly interfaces in local languages are essential. The emphasis should be on human-centered technology design that prioritizes community building over mere efficiency.

**Conclusion**

Technology's true power lies not in its sophistication but in its ability to connect hearts and minds. India's digital transformation journey, while impressive, must remain focused on its ultimate goal: bringing people together in a more equitable and inclusive society. The future belongs to technologies that strengthen human bonds rather than weaken them.`,
      format: 'text',
      wordCount: 412, // This is just the introduction part for demo
      timeSpent: 2700,
      submittedAt: new Date()
    }

    const evaluation = await this.evaluationEngine.evaluateAnswer(question, sampleAnswer)
    const modelAnswer = this.modelGenerator.generateModelAnswer(question, 1000)

    return {
      evaluationId: `eval-${Date.now()}`,
      score: evaluation.score,
      feedback: evaluation.feedback,
      upscAnalysis: evaluation.upscAnalysis,
      modelAnswer,
      processingTime: 4.5
    }
  }

  // Method to demonstrate the complete evaluation process
  async demonstrateCompleteEvaluation(questionText: string, answerText: string, subject: 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay' = 'GS2'): Promise<{
    evaluation: EvaluationResponse,
    modelAnswerVariations: any[],
    improvementPlan: any,
    comparison: any
  }> {
    // Create question object
    const question: Question = {
      id: `demo-${Date.now()}`,
      text: questionText,
      subject,
      topic: 'Demo Topic',
      subtopic: 'Demo Subtopic',
      difficulty: 'medium',
      wordLimit: 250,
      timeLimit: 30,
      source: 'practice',
      keywords: this.extractKeywords(questionText),
      expectedPoints: [],
      modelAnswers: []
    }

    // Create answer input
    const answer: AnswerInput = {
      id: `answer-${Date.now()}`,
      questionId: question.id,
      userId: 'demo-user',
      content: answerText,
      format: 'text',
      wordCount: answerText.split(/\s+/).length,
      timeSpent: 1800,
      submittedAt: new Date()
    }

    // Perform evaluation
    const evaluation = await this.evaluationEngine.evaluateAnswer(question, answer)
    const modelAnswer = this.modelGenerator.generateModelAnswer(question, 250)
    const modelVariations = this.modelGenerator.generateMultipleVariations(question, 250)

    // Generate improvement plan
    const progressData = await this.progressTracker.trackProgress('demo-user')

    const response: EvaluationResponse = {
      evaluationId: `eval-${Date.now()}`,
      score: evaluation.score,
      feedback: evaluation.feedback,
      upscAnalysis: evaluation.upscAnalysis,
      modelAnswer,
      processingTime: 3.0
    }

    return {
      evaluation: response,
      modelAnswerVariations: modelVariations,
      improvementPlan: progressData.personalizedPlan,
      comparison: {
        userScore: evaluation.score.total,
        modelScore: 85,
        gap: 85 - evaluation.score.total,
        keyDifferences: evaluation.feedback.modelComparison.differences
      }
    }
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - in production would use NLP
    const words = text.toLowerCase().split(/\s+/)
    const stopWords = ['the', 'in', 'of', 'and', 'or', 'but', 'with', 'for', 'to', 'from', 'by', 'at', 'on']
    return words.filter(word => 
      word.length > 3 && 
      !stopWords.includes(word) &&
      /^[a-zA-Z]+$/.test(word)
    ).slice(0, 10)
  }

  // Method to demonstrate real-time evaluation
  async demonstrateRealTimeEvaluation(): Promise<{
    evaluationSteps: any[],
    finalResult: EvaluationResponse
  }> {
    const evaluationSteps = [
      {
        step: 1,
        name: 'Content Analysis',
        description: 'Analyzing keyword coverage and factual accuracy',
        progress: 25,
        findings: ['Keyword coverage: 75%', 'Factual accuracy: Good', '3 current affairs references found']
      },
      {
        step: 2,
        name: 'Structure Evaluation',
        description: 'Checking introduction, body, and conclusion',
        progress: 50,
        findings: ['Clear introduction present', 'Well-organized body paragraphs', 'Strong conclusion with recommendations']
      },
      {
        step: 3,
        name: 'Language Assessment',
        description: 'Evaluating grammar, clarity, and expression',
        progress: 75,
        findings: ['Grammar score: 85%', 'Vocabulary level: Advanced', '2 minor clarity issues identified']
      },
      {
        step: 4,
        name: 'Final Scoring',
        description: 'Calculating overall score and generating feedback',
        progress: 100,
        findings: ['Total score: 78/100', 'Grade: B+', 'Percentile: 82nd']
      }
    ]

    const finalResult = await this.demonstrateGS2Evaluation()

    return { evaluationSteps, finalResult }
  }
}