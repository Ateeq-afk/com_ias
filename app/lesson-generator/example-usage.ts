/**
 * Example Usage of the UPSC Lesson Generation System
 * This file demonstrates how to use the system for various scenarios
 */

import { LessonGenerator } from './LessonGenerator'
import { sampleLesson } from './sample-lesson'

async function exampleUsage() {
  console.log('🎓 UPSC Lesson Generation System - Example Usage\n')
  
  const generator = new LessonGenerator()
  
  // Example 1: Generate a single lesson
  console.log('Example 1: Generating a Single Lesson')
  console.log('=========================================')
  
  try {
    const lesson = await generator.generateLesson({
      topic: 'Separation of Powers',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ConceptExplanation',
      prerequisites: ['Constitutional Framework', 'Fundamental Rights']
    })
    
    console.log(`✅ Generated: "${lesson.metadata.title}"`)
    console.log(`   Template: ${lesson.metadata.template}`)
    console.log(`   Duration: ${lesson.metadata.duration} minutes`)
    console.log(`   Questions: ${lesson.practice.questions.length}`)
    console.log(`   Quality Score: ${generator.validateLessonQuality(lesson).score}/100`)
    
  } catch (error) {
    console.log(`❌ Error: ${error}`)
  }
  
  console.log('')
  
  // Example 2: Bulk generation for specific subjects
  console.log('Example 2: Bulk Generation for Economy Subject')
  console.log('==============================================')
  
  try {
    const bulkResult = await generator.generateBulkLessons(
      ['Economy'],
      ['beginner', 'intermediate'],
      {
        maxLessonsPerTopic: 1,
        priorityOnly: true,
        outputFormat: 'json'
      }
    )
    
    console.log(`✅ Generated ${bulkResult.summary.totalLessons} lessons`)
    console.log(`   Study Hours: ${bulkResult.summary.estimatedStudyHours}`)
    console.log('   Templates Used:')
    Object.entries(bulkResult.summary.lessonsPerTemplate).forEach(([template, count]) => {
      console.log(`     - ${template}: ${count}`)
    })
    
  } catch (error) {
    console.log(`❌ Error: ${error}`)
  }
  
  console.log('')
  
  // Example 3: Generate topic variations
  console.log('Example 3: Topic Variations for "Federalism"')
  console.log('============================================')
  
  try {
    const variations = await generator.generateTopicVariations(
      'Federalism in India',
      'Polity',
      {
        templates: ['ConceptExplanation', 'ComparativeAnalysis', 'ProcessFlow'],
        difficulties: ['intermediate', 'advanced']
      }
    )
    
    console.log(`✅ Generated ${variations.length} variations:`)
    variations.forEach((lesson, index) => {
      console.log(`   ${index + 1}. ${lesson.metadata.template} (${lesson.metadata.difficulty})`)
    })
    
  } catch (error) {
    console.log(`❌ Error: ${error}`)
  }
  
  console.log('')
  
  // Example 4: Personalized study plan
  console.log('Example 4: Personalized Study Plan')
  console.log('===================================')
  
  const userProgress = {
    completedTopics: ['pol-001', 'eco-001', 'hist-001'],
    weakAreas: ['Geography' as const, 'Environment' as const],
    preferredDifficulty: 'intermediate' as const,
    timeAvailable: 90 // 1.5 hours per day
  }
  
  const recommendations = generator.getPersonalizedRecommendations(userProgress)
  
  console.log(`📅 Recommended Topics: ${recommendations.recommendedLessons.length}`)
  console.log(`📚 Study Plan: ${recommendations.studyPlan.length} weeks`)
  console.log('')
  console.log('First Week Plan:')
  if (recommendations.studyPlan.length > 0) {
    const firstWeek = recommendations.studyPlan[0]
    console.log(`   Week 1: ${firstWeek.lessons.length} lessons (${firstWeek.estimatedTime} minutes)`)
    firstWeek.lessons.slice(0, 5).forEach((lesson, index) => {
      console.log(`     ${index + 1}. ${lesson}`)
    })
    if (firstWeek.lessons.length > 5) {
      console.log(`     ... and ${firstWeek.lessons.length - 5} more lessons`)
    }
  }
  
  console.log('')
  
  // Example 5: Quality validation
  console.log('Example 5: Quality Validation of Sample Lesson')
  console.log('===============================================')
  
  const validation = generator.validateLessonQuality(sampleLesson)
  console.log(`📊 Quality Score: ${validation.score}/100`)
  console.log(`✅ Valid: ${validation.isValid}`)
  
  if (validation.issues.length > 0) {
    console.log('⚠️  Issues found:')
    validation.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`)
    })
  } else {
    console.log('✅ No quality issues found!')
  }
  
  console.log('')
  
  // Example 6: Export options
  console.log('Example 6: Export Capabilities')
  console.log('===============================')
  
  const sampleLessons = [sampleLesson]
  
  try {
    // JSON export
    const jsonData = await generator.exportLessons(sampleLessons, 'json', {
      includeInteractive: true,
      compression: false
    })
    console.log(`✅ JSON Export: ${jsonData.length} characters`)
    
    // CSV export
    const csvData = await generator.exportLessons(sampleLessons, 'csv')
    console.log(`✅ CSV Export: ${csvData.split('\n').length} rows`)
    
    console.log('✅ Additional formats available: PDF, Database')
    
  } catch (error) {
    console.log(`❌ Export Error: ${error}`)
  }
  
  console.log('')
  
  // Example 7: Template-specific generation
  console.log('Example 7: Template-Specific Scenarios')
  console.log('======================================')
  
  const templateExamples = [
    {
      template: 'ComparativeAnalysis' as const,
      topic: 'Presidential vs Parliamentary System',
      customParams: { items: ['Presidential System', 'Parliamentary System'] }
    },
    {
      template: 'TimelineExploration' as const,
      topic: 'Evolution of Banking in India',
      customParams: {}
    },
    {
      template: 'ProcessFlow' as const,
      topic: 'Goods and Services Tax Implementation',
      customParams: {}
    }
  ]
  
  for (const example of templateExamples) {
    try {
      const lesson = await generator.generateLesson({
        topic: example.topic,
        subject: 'Economy',
        difficulty: 'intermediate',
        template: example.template,
        customParams: example.customParams
      })
      
      console.log(`✅ ${example.template}: "${lesson.metadata.title}"`)
      console.log(`   Interactive Elements: ${lesson.content.interactiveElements.length}`)
      
    } catch (error) {
      console.log(`❌ ${example.template}: Error - ${error}`)
    }
  }
  
  console.log('')
  console.log('🎉 Example Usage Completed!')
  console.log('')
  console.log('💡 Key Takeaways:')
  console.log('   • Single lesson generation is perfect for specific topics')
  console.log('   • Bulk generation can create hundreds of lessons efficiently')
  console.log('   • Topic variations provide multiple learning approaches')
  console.log('   • Personalized plans adapt to individual progress')
  console.log('   • Quality validation ensures consistent standards')
  console.log('   • Multiple export formats support different use cases')
  console.log('   • Template-specific features enhance learning experience')
}

// Sample lesson preview
function previewSampleLesson() {
  console.log('📖 SAMPLE LESSON PREVIEW')
  console.log('========================')
  console.log('')
  console.log(`Title: ${sampleLesson.metadata.title}`)
  console.log(`Subject: ${sampleLesson.metadata.subject}`)
  console.log(`Template: ${sampleLesson.metadata.template}`)
  console.log(`Difficulty: ${sampleLesson.metadata.difficulty}`)
  console.log(`Duration: ${sampleLesson.metadata.duration} minutes`)
  console.log(`Prerequisites: ${sampleLesson.metadata.prerequisites.join(', ')}`)
  console.log('')
  console.log('Introduction:')
  console.log(sampleLesson.content.introduction)
  console.log('')
  console.log('Key Takeaways:')
  sampleLesson.summary.keyTakeaways.forEach((takeaway, index) => {
    console.log(`   ${index + 1}. ${takeaway}`)
  })
  console.log('')
  console.log('Practice Questions:')
  sampleLesson.practice.questions.slice(0, 2).forEach((question, index) => {
    console.log(`   Q${index + 1}: ${question.question}`)
    console.log(`   Difficulty: ${question.difficulty} | Time: ${question.timeToSolve}s`)
  })
  console.log(`   ... and ${sampleLesson.practice.questions.length - 2} more questions`)
  console.log('')
  console.log('Interactive Elements:')
  sampleLesson.content.interactiveElements.forEach((element, index) => {
    console.log(`   ${index + 1}. ${element.type}`)
  })
  console.log('')
  console.log('Cross-Subject Links:')
  sampleLesson.connections.crossSubjectLinks.forEach((link, index) => {
    console.log(`   ${index + 1}. ${link}`)
  })
}

// Run examples
if (require.main === module) {
  console.log('🚀 Starting Example Usage...\n')
  previewSampleLesson()
  console.log('\n' + '='.repeat(60) + '\n')
  exampleUsage().catch(console.error)
}

export { exampleUsage, previewSampleLesson }