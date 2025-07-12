import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel
} from '../types'

export class MapBasedGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['MapBased']
  protected generatorName = 'MapBasedGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createMapBased(baseFact, difficulty)
      questions.push(mainQuestion)
      
      // Generate variations if requested
      if (includeVariations) {
        const variations = await this.createVariations(baseFact, difficulty)
        questions.push(...variations)
      }
    }
    
    return questions
  }
  
  private async createMapBased(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const { questionText, mapDescription, locations, correctLocation } = this.generateMapData(baseFact, difficulty)
    const explanation = this.generateDetailedExplanation(baseFact, mapDescription, locations, correctLocation)
    
    return {
      id: this.generateQuestionId(),
      type: 'MapBased',
      questionText,
      data: {
        mapBased: { mapDescription, locations, correctLocation }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'MapBased'),
      marks: this.determineMarks(difficulty, 'MapBased'),
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
      tags: this.generateTags(baseFact, 'MapBased', difficulty)
    }
  }
  
  private generateMapData(baseFact: BaseFact, difficulty: DifficultyLevel): {
    questionText: string,
    mapDescription: string,
    locations: string[],
    correctLocation: string
  } {
    const mapSets = this.getMapSets(baseFact, difficulty)
    const selectedSet = mapSets[Math.floor(Math.random() * mapSets.length)]
    
    return {
      questionText: this.generateQuestionText(selectedSet.mapType),
      mapDescription: selectedSet.mapDescription,
      locations: selectedSet.locations,
      correctLocation: selectedSet.correctLocation
    }
  }
  
  private generateQuestionText(mapType: string): string {
    const patterns = [
      `Study the ${mapType} and identify the marked location:`,
      `Based on the ${mapType} provided, which location is correctly marked?`,
      `Analyze the ${mapType} and select the appropriate location:`,
      `With reference to the ${mapType}, identify the highlighted area:`
    ]
    
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private getMapSets(baseFact: BaseFact, difficulty: DifficultyLevel): Array<{
    mapDescription: string,
    locations: string[],
    correctLocation: string,
    mapType: string
  }> {
    switch (difficulty) {
      case 'easy':
        return this.generateEasyMapQuestions(baseFact)
      case 'medium':
        return this.generateMediumMapQuestions(baseFact)
      case 'hard':
        return this.generateHardMapQuestions(baseFact)
      default:
        return this.generateEasyMapQuestions(baseFact)
    }
  }
  
  private generateEasyMapQuestions(baseFact: BaseFact): Array<{
    mapDescription: string,
    locations: string[],
    correctLocation: string,
    mapType: string
  }> {
    return [
      {
        mapDescription: `A political map of India showing constitutional bodies and their headquarters. The map shows four major cities marked as A, B, C, and D. Location B is marked in the national capital region and represents the seat of the Supreme Court of India.`,
        locations: ['Mumbai', 'New Delhi', 'Chennai', 'Kolkata'],
        correctLocation: 'New Delhi',
        mapType: 'political map'
      },
      {
        mapDescription: `An administrative map showing the location of High Courts in different states. The map highlights a major commercial city in western India marked as location C, which houses a High Court with jurisdiction over multiple states.`,
        locations: ['Bangalore', 'Hyderabad', 'Mumbai', 'Pune'],
        correctLocation: 'Mumbai',
        mapType: 'administrative map'
      },
      {
        mapDescription: `A constitutional map showing the distribution of legislative assemblies. Location A is marked in a northern state known for its legislative assembly building designed by renowned architects and housing the largest state legislature.`,
        locations: ['Lucknow', 'Chandigarh', 'Jaipur', 'Dehradun'],
        correctLocation: 'Lucknow',
        mapType: 'constitutional map'
      }
    ]
  }
  
  private generateMediumMapQuestions(baseFact: BaseFact): Array<{
    mapDescription: string,
    locations: string[],
    correctLocation: string,
    mapType: string
  }> {
    return [
      {
        mapDescription: `A thematic map showing the distribution of constitutional amendments' implementation across Indian states. The map highlights regions where the 73rd Amendment (Panchayati Raj) was first successfully implemented. Location X marks a state that became a model for other states in implementing three-tier Panchayati Raj system.`,
        locations: ['Karnataka', 'Rajasthan', 'West Bengal', 'Andhra Pradesh'],
        correctLocation: 'Karnataka',
        mapType: 'thematic map'
      },
      {
        mapDescription: `A governance map showing the distribution of tribunal headquarters across India. Location Y represents a city that houses multiple quasi-judicial bodies including the Central Administrative Tribunal and is strategically located for administrative efficiency.`,
        locations: ['New Delhi', 'Mumbai', 'Chennai', 'Kolkata'],
        correctLocation: 'New Delhi',
        mapType: 'governance map'
      },
      {
        mapDescription: `A federal structure map showing the seat of a state that has its own High Court but shares jurisdiction with neighboring union territories. Location Z marks a state capital that exemplifies the complexity of federal judicial administration.`,
        locations: ['Chandigarh', 'Guwahati', 'Port Blair', 'Gangtok'],
        correctLocation: 'Chandigarh',
        mapType: 'federal structure map'
      }
    ]
  }
  
  private generateHardMapQuestions(baseFact: BaseFact): Array<{
    mapDescription: string,
    locations: string[],
    correctLocation: string,
    mapType: string
  }> {
    return [
      {
        mapDescription: `A complex constitutional geography map showing the intersection of Article 370 implementation and its geographical implications. The map displays a region marked as P which was uniquely governed under special constitutional provisions until 2019, representing a distinctive federal arrangement.`,
        locations: ['Ladakh', 'Jammu and Kashmir', 'Himachal Pradesh', 'Uttarakhand'],
        correctLocation: 'Jammu and Kashmir',
        mapType: 'constitutional geography map'
      },
      {
        mapDescription: `An institutional distribution map showing the strategic placement of constitutional bodies for optimal federal governance. Location Q marks a city chosen for housing important constitutional institutions due to its central location and administrative infrastructure, representing the principle of geographical balance in institutional distribution.`,
        locations: ['Bhopal', 'Nagpur', 'Allahabad', 'Indore'],
        correctLocation: 'Allahabad',
        mapType: 'institutional distribution map'
      },
      {
        mapDescription: `A constitutional evolution map tracking the implementation of language provisions under the Eighth Schedule. Location R represents a linguistic region that played a crucial role in the linguistic reorganization of states and demonstrates the constitutional accommodation of linguistic diversity.`,
        locations: ['Tamil Nadu (Chennai)', 'Andhra Pradesh (Hyderabad)', 'Kerala (Thiruvananthapuram)', 'Karnataka (Bangalore)'],
        correctLocation: 'Andhra Pradesh (Hyderabad)',
        mapType: 'constitutional evolution map'
      }
    ]
  }
  
  private generateDetailedExplanation(baseFact: BaseFact, mapDescription: string, locations: string[], correctLocation: string) {
    return {
      correctAnswer: correctLocation,
      whyCorrect: `${correctLocation} is the correct answer based on the geographical and constitutional context provided in the map description.`,
      whyOthersWrong: locations.filter(loc => loc !== correctLocation).map(loc => `${loc} does not match the geographical or institutional criteria described in the map.`),
      conceptClarity: `Map-based questions test the understanding of geographical distribution of constitutional institutions and their strategic placement for effective governance.`,
      memoryTrick: this.generateMapMemoryTrick(correctLocation),
      commonMistakes: [
        'Not reading the map description carefully',
        'Confusing similar constitutional institutions',
        'Missing geographical clues in the description'
      ],
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private generateMapMemoryTrick(correctLocation: string): string {
    const locationTricks = {
      'New Delhi': 'Capital city = Supreme Court, Parliament, President',
      'Mumbai': 'Commercial capital = Bombay High Court (first HC)',
      'Lucknow': 'UP capital = Largest state assembly',
      'Karnataka': 'First to implement Panchayati Raj successfully',
      'Chandigarh': 'Shared capital of Punjab and Haryana',
      'Jammu and Kashmir': 'Special status under Article 370 (until 2019)',
      'Allahabad': 'Historical legal center with High Court since 1866',
      'Andhra Pradesh (Hyderabad)': 'First linguistic state formation'
    }
    
    // Extract the main location name for the trick
    const mainLocation = correctLocation.split(' (')[0]
    return locationTricks[correctLocation] || locationTricks[mainLocation] || 'Use geographical and institutional context clues'
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Create historical constitutional map variation
    const historicalVariation = await this.createMapBased(baseFact, difficulty)
    historicalVariation.id = this.generateQuestionId()
    
    if (historicalVariation.data.mapBased) {
      historicalVariation.data.mapBased = {
        mapDescription: `A historical constitutional map showing the evolution of democratic institutions in India. The map marks location H as the birthplace of an important constitutional convention that influenced the framing of the Indian Constitution.`,
        locations: ['Lahore', 'Karachi', 'Calcutta', 'Bombay'],
        correctLocation: 'Calcutta'
      }
      historicalVariation.questionText = 'Study the historical constitutional map and identify the marked location:'
    }
    
    variations.push(historicalVariation)
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'MapBased') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.mapBased
    if (!data) {
      issues.push('Missing map based data')
      return
    }
    
    if (!data.mapDescription || data.mapDescription.length < 50) {
      issues.push('Map description too short')
      suggestions.push('Provide detailed map description (minimum 50 characters)')
    }
    
    if (!data.locations || data.locations.length !== 4) {
      issues.push('Must have exactly 4 location options')
      suggestions.push('Provide exactly 4 location choices')
    }
    
    if (!data.correctLocation) {
      issues.push('Missing correct location')
      suggestions.push('Specify the correct location')
    }
    
    if (!data.locations.includes(data.correctLocation)) {
      issues.push('Correct location must be among the options')
      suggestions.push('Ensure correct location is included in the options list')
    }
    
    // Check for geographical realism
    if (!data.mapDescription.toLowerCase().includes('map')) {
      issues.push('Description should clearly indicate it\'s a map-based question')
      suggestions.push('Include explicit map references in the description')
    }
    
    // Validate location format
    data.locations.forEach((location, index) => {
      if (!location || location.length < 3) {
        issues.push(`Location ${index + 1} is too short`)
      }
    })
    
    // Check for uniqueness
    const uniqueLocations = new Set(data.locations)
    if (uniqueLocations.size !== data.locations.length) {
      issues.push('All locations must be unique')
      suggestions.push('Ensure no duplicate locations in options')
    }
    
    // Check for realistic constitutional/geographical context
    const constitutionalKeywords = ['constitutional', 'court', 'assembly', 'tribunal', 'governance', 'federal', 'administrative']
    const hasConstitutionalContext = constitutionalKeywords.some(keyword => 
      data.mapDescription.toLowerCase().includes(keyword)
    )
    
    if (!hasConstitutionalContext) {
      issues.push('Map should have constitutional/governance context')
      suggestions.push('Include constitutional institutions or governance aspects in map description')
    }
  }
}