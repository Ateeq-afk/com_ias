import { LessonGenerator } from './LessonGenerator'
import { GeneratorConfig } from './types'

/**
 * Demonstration of the Lesson Generation System
 * This script generates 10 sample lessons across different templates
 */

async function demonstrateLessonGeneration() {
  const generator = new LessonGenerator()
  
  console.log('🚀 Starting Lesson Generation System Demo...\n')
  
  // Configuration for 10 different sample lessons
  const sampleConfigs: GeneratorConfig[] = [
    {
      topic: 'Fundamental Rights',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ConceptExplanation',
      prerequisites: ['Constitutional Framework']
    },
    {
      topic: 'Parliament vs State Legislature',
      subject: 'Polity',
      difficulty: 'advanced',
      template: 'ComparativeAnalysis',
      customParams: { items: ['Parliament', 'State Legislature'] }
    },
    {
      topic: 'Evolution of Indian Constitution',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'TimelineExploration'
    },
    {
      topic: 'Bill to Act Process',
      subject: 'Polity',
      difficulty: 'beginner',
      template: 'ProcessFlow'
    },
    {
      topic: 'Emergency Provisions Case Study',
      subject: 'Polity',
      difficulty: 'advanced',
      template: 'CaseStudyAnalysis'
    },
    {
      topic: 'Monsoon System in India',
      subject: 'Geography',
      difficulty: 'intermediate',
      template: 'ProcessFlow'
    },
    {
      topic: 'Physiographic Divisions of India',
      subject: 'Geography',
      difficulty: 'beginner',
      template: 'MapBased'
    },
    {
      topic: 'GDP Growth Trends',
      subject: 'Economy',
      difficulty: 'intermediate',
      template: 'DataInterpretation'
    },
    {
      topic: 'Green Revolution Impact',
      subject: 'Economy',
      difficulty: 'advanced',
      template: 'CaseStudyAnalysis'
    },
    {
      topic: 'Administrative Ethics Framework',
      subject: 'Ethics',
      difficulty: 'intermediate',
      template: 'ConceptExplanation'
    }
  ]
  
  const generatedLessons = []
  
  // Generate individual lessons
  console.log('📚 Generating Sample Lessons:\n')
  
  for (let i = 0; i < sampleConfigs.length; i++) {
    const config = sampleConfigs[i]
    console.log(`${i + 1}. Generating: "${config.topic}" (${config.template} - ${config.difficulty})`)
    
    try {
      const lesson = await generator.generateLesson(config)
      generatedLessons.push(lesson)
      
      // Validate lesson quality
      const validation = generator.validateLessonQuality(lesson)
      console.log(`   ✅ Generated successfully! Quality Score: ${validation.score}/100`)
      
      if (validation.issues.length > 0) {
        console.log(`   ⚠️  Issues: ${validation.issues.join(', ')}`)
      }
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error}`)
    }
    
    console.log('')
  }
  
  // Demonstrate bulk generation for a specific subject
  console.log('🔄 Demonstrating Bulk Generation for Polity (High Priority Topics):\n')
  
  const bulkResult = await generator.generateBulkLessons(
    ['Polity'],
    ['beginner', 'intermediate'],
    {
      maxLessonsPerTopic: 2,
      priorityOnly: true,
      outputFormat: 'json'
    }
  )
  
  console.log('📊 Bulk Generation Summary:')
  console.log(`   Total Lessons Generated: ${bulkResult.summary.totalLessons}`)
  console.log(`   Estimated Study Hours: ${bulkResult.summary.estimatedStudyHours}`)
  console.log(`   Lessons by Template:`)
  
  Object.entries(bulkResult.summary.lessonsPerTemplate).forEach(([template, count]) => {
    console.log(`     - ${template}: ${count} lessons`)
  })
  
  console.log('')
  
  // Demonstrate personalized recommendations
  console.log('🎯 Generating Personalized Study Plan:\n')
  
  const userProgress = {
    completedTopics: ['pol-001', 'hist-001'],
    weakAreas: ['Economy' as const, 'Geography' as const],
    preferredDifficulty: 'intermediate' as const,
    timeAvailable: 60 // 60 minutes per day
  }
  
  const recommendations = generator.getPersonalizedRecommendations(userProgress)
  
  console.log('📅 Recommended Study Plan (First 3 Weeks):')
  recommendations.studyPlan.slice(0, 3).forEach(week => {
    console.log(`   Week ${week.week}: ${week.lessons.length} lessons (${week.estimatedTime} minutes)`)
    week.lessons.slice(0, 3).forEach(lesson => {
      console.log(`     - ${lesson}`)
    })
    if (week.lessons.length > 3) {
      console.log(`     ... and ${week.lessons.length - 3} more`)
    }
  })
  
  console.log('')
  
  // Demonstrate topic variations
  console.log('🔀 Generating Topic Variations for "Indian Constitution":\n')
  
  const variations = await generator.generateTopicVariations(
    'Indian Constitution',
    'Polity',
    {
      templates: ['ConceptExplanation', 'TimelineExploration', 'ComparativeAnalysis'],
      difficulties: ['beginner', 'advanced'],
      customParams: [{ items: ['Indian Constitution', 'US Constitution'] }]
    }
  )
  
  console.log(`   Generated ${variations.length} variations:`)
  variations.forEach((lesson, index) => {
    console.log(`   ${index + 1}. ${lesson.metadata.template} (${lesson.metadata.difficulty})`)
  })
  
  console.log('')
  
  // Show sample lesson content
  if (generatedLessons.length > 0) {
    const sampleLesson = generatedLessons[0]
    console.log('📖 Sample Lesson Content Preview:\n')
    console.log(`Title: ${sampleLesson.metadata.title}`)
    console.log(`Duration: ${sampleLesson.metadata.duration} minutes`)
    console.log(`Template: ${sampleLesson.metadata.template}`)
    console.log(`Difficulty: ${sampleLesson.metadata.difficulty}`)
    console.log(`\nIntroduction: ${sampleLesson.content.introduction.substring(0, 200)}...`)
    console.log(`\nKey Takeaways:`)
    sampleLesson.summary.keyTakeaways.slice(0, 3).forEach((takeaway, index) => {
      console.log(`   ${index + 1}. ${takeaway}`)
    })
    console.log(`\nPractice Questions: ${sampleLesson.practice.questions.length} questions`)
    console.log(`Interactive Elements: ${sampleLesson.content.interactiveElements.length} elements`)
  }
  
  console.log('\n🎉 Demo completed successfully!')
  console.log('\n📈 System Capabilities Summary:')
  console.log('   ✅ 10 different lesson templates')
  console.log('   ✅ 1500+ potential lessons from complete syllabus')
  console.log('   ✅ Automatic quality validation')
  console.log('   ✅ Personalized study plans')
  console.log('   ✅ Bulk generation capabilities')
  console.log('   ✅ Multiple export formats')
  console.log('   ✅ Interactive elements for engagement')
  console.log('   ✅ UPSC-specific question patterns')
  console.log('   ✅ Cross-topic connections')
  console.log('   ✅ Adaptive difficulty levels')
}

// Architecture Documentation
function displaySystemArchitecture() {
  console.log('\n🏗️  LESSON GENERATION SYSTEM ARCHITECTURE\n')
  
  console.log('📋 CORE COMPONENTS:')
  console.log('   1. Template System (10 specialized templates)')
  console.log('   2. Content Generator (AI-powered content creation)')
  console.log('   3. Syllabus Parser (Complete UPSC syllabus mapping)')
  console.log('   4. Bulk Generator (Mass lesson production)')
  console.log('   5. Quality Validator (Automated quality checks)')
  console.log('   6. Personalization Engine (Adaptive recommendations)')
  console.log('')
  
  console.log('🎨 LESSON TEMPLATES:')
  const templates = [
    'ConceptExplanation - For theories and definitions',
    'ComparativeAnalysis - For X vs Y topics',
    'TimelineExploration - For historical events',
    'ProcessFlow - For system workflows',
    'CaseStudyAnalysis - For real examples',
    'MapBased - For geography topics',
    'DataInterpretation - For economy and statistics',
    'ConstitutionalArticles - For legal topics',
    'CurrentAffairsLink - For recent events',
    'ProblemSolving - For analytical topics'
  ]
  
  templates.forEach((template, index) => {
    console.log(`   ${index + 1}. ${template}`)
  })
  
  console.log('')
  console.log('📚 SYLLABUS COVERAGE:')
  console.log('   • History: 200+ micro-topics across 5 major areas')
  console.log('   • Polity: 200+ micro-topics across constitutional framework')
  console.log('   • Economy: 200+ micro-topics across planning to external sector')
  console.log('   • Geography: 200+ micro-topics across physical and human geography')
  console.log('   • Environment: 200+ micro-topics (implementation ready)')
  console.log('   • Science & Technology: 200+ micro-topics (implementation ready)')
  console.log('   • Current Affairs: 200+ micro-topics (implementation ready)')
  console.log('   • Ethics: 200+ micro-topics (implementation ready)')
  console.log('   • Art & Culture: 200+ micro-topics (implementation ready)')
  console.log('   • International Relations: 200+ micro-topics (implementation ready)')
  
  console.log('')
  console.log('⚙️ GENERATION FEATURES:')
  console.log('   • 5-minute focused lessons')
  console.log('   • Interactive elements specific to template type')
  console.log('   • 5 practice questions with detailed explanations')
  console.log('   • 1 previous year UPSC question per lesson')
  console.log('   • Key takeaways and mnemonics')
  console.log('   • Cross-topic connections')
  console.log('   • Adaptive difficulty levels')
  console.log('   • Quality validation (0-100 score)')
  console.log('   • Multiple export formats (JSON, CSV, PDF, Database)')
  
  console.log('')
  console.log('🎯 PERSONALIZATION:')
  console.log('   • Progress-based recommendations')
  console.log('   • Weak area focus')
  console.log('   • Time-based study plans')
  console.log('   • Priority topic identification')
  console.log('   • Custom learning paths')
  
  console.log('')
  console.log('📊 SCALABILITY:')
  console.log('   • Bulk generation: 1500+ lessons')
  console.log('   • Batch processing: Configurable batch sizes')
  console.log('   • Memory optimization: Streaming for large datasets')
  console.log('   • Parallel processing: Concurrent lesson generation')
  console.log('   • Incremental updates: Add new topics without regeneration')
}

// Run demonstration
if (require.main === module) {
  displaySystemArchitecture()
  demonstrateLessonGeneration().catch(console.error)
}

export { demonstrateLessonGeneration, displaySystemArchitecture }