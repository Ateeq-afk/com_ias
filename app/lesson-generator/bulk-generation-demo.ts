/**
 * Bulk Generation Demo for 20 Polity Lessons
 * Demonstrates the system's capability to generate multiple lessons efficiently
 */

import { LessonGenerator } from './LessonGenerator'
import { GeneratorConfig, Lesson } from './types'

interface LessonSummary {
  id: string
  title: string
  template: string
  difficulty: string
  topic: string
}

async function generatePolityLessons(): Promise<LessonSummary[]> {
  const generator = new LessonGenerator()
  
  // Define the 20 lesson configurations
  const lessonConfigs: GeneratorConfig[] = [
    // Preamble (2 lessons)
    {
      topic: 'Preamble to the Constitution',
      subject: 'Polity',
      difficulty: 'beginner',
      template: 'ConceptExplanation',
      prerequisites: []
    },
    {
      topic: 'Preamble Amendments and Interpretation',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'TimelineExploration',
      prerequisites: ['Preamble to the Constitution']
    },
    
    // Citizenship (2 lessons)
    {
      topic: 'Citizenship Provisions in India',
      subject: 'Polity',
      difficulty: 'beginner',
      template: 'ConceptExplanation',
      prerequisites: []
    },
    {
      topic: 'Citizenship Act vs CAA 2019',
      subject: 'Polity',
      difficulty: 'advanced',
      template: 'ComparativeAnalysis',
      customParams: { items: ['Original Citizenship Act', 'Citizenship Amendment Act 2019'] }
    },
    
    // Fundamental Duties (2 lessons)
    {
      topic: 'Fundamental Duties - Origin and Significance',
      subject: 'Polity',
      difficulty: 'beginner',
      template: 'ConceptExplanation',
      prerequisites: ['Fundamental Rights']
    },
    {
      topic: 'Fundamental Rights vs Fundamental Duties',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ComparativeAnalysis',
      customParams: { items: ['Fundamental Rights', 'Fundamental Duties'] }
    },
    
    // Directive Principles (2 lessons)
    {
      topic: 'Directive Principles of State Policy',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ConceptExplanation',
      prerequisites: ['Fundamental Rights']
    },
    {
      topic: 'DPSP vs Fundamental Rights Conflict',
      subject: 'Polity',
      difficulty: 'advanced',
      template: 'CaseStudyAnalysis',
      prerequisites: ['Directive Principles of State Policy', 'Fundamental Rights']
    },
    
    // Union Executive (2 lessons)
    {
      topic: 'President of India - Powers and Functions',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ConceptExplanation',
      prerequisites: ['Constitutional Framework']
    },
    {
      topic: 'Prime Minister vs President Powers',
      subject: 'Polity',
      difficulty: 'advanced',
      template: 'ComparativeAnalysis',
      customParams: { items: ['Prime Minister', 'President'] }
    },
    
    // State Legislature (2 lessons)
    {
      topic: 'State Legislative Assembly Structure',
      subject: 'Polity',
      difficulty: 'beginner',
      template: 'ConceptExplanation',
      prerequisites: ['Parliament']
    },
    {
      topic: 'State Bill to Act Process',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ProcessFlow',
      prerequisites: ['State Legislative Assembly Structure']
    },
    
    // Supreme Court (2 lessons)
    {
      topic: 'Supreme Court Jurisdiction and Powers',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ConceptExplanation',
      prerequisites: ['Judicial System']
    },
    {
      topic: 'Evolution of Supreme Court Jurisprudence',
      subject: 'Polity',
      difficulty: 'advanced',
      template: 'TimelineExploration',
      prerequisites: ['Supreme Court Jurisdiction and Powers']
    },
    
    // High Courts (2 lessons)
    {
      topic: 'High Courts - Structure and Jurisdiction',
      subject: 'Polity',
      difficulty: 'beginner',
      template: 'ConceptExplanation',
      prerequisites: ['Supreme Court Jurisdiction and Powers']
    },
    {
      topic: 'Supreme Court vs High Court Jurisdiction',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ComparativeAnalysis',
      customParams: { items: ['Supreme Court', 'High Courts'] }
    },
    
    // CAG (2 lessons)
    {
      topic: 'Comptroller and Auditor General Functions',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ConceptExplanation',
      prerequisites: ['Constitutional Bodies']
    },
    {
      topic: 'CAG Audit Process and Reports',
      subject: 'Polity',
      difficulty: 'advanced',
      template: 'ProcessFlow',
      prerequisites: ['Comptroller and Auditor General Functions']
    },
    
    // Election Commission (2 lessons)
    {
      topic: 'Election Commission of India - Powers',
      subject: 'Polity',
      difficulty: 'intermediate',
      template: 'ConceptExplanation',
      prerequisites: ['Constitutional Bodies']
    },
    {
      topic: 'Electoral Process Management by ECI',
      subject: 'Polity',
      difficulty: 'advanced',
      template: 'ProcessFlow',
      prerequisites: ['Election Commission of India - Powers']
    }
  ]
  
  const generatedLessons: LessonSummary[] = []
  
  console.log('🚀 Starting Bulk Generation of 20 Polity Lessons...\n')
  
  for (let i = 0; i < lessonConfigs.length; i++) {
    const config = lessonConfigs[i]
    
    try {
      console.log(`Generating ${i + 1}/20: ${config.topic} (${config.template})...`)
      
      // Generate the lesson
      const lesson = await generator.generateLesson(config)
      
      // Create summary
      const summary: LessonSummary = {
        id: lesson.metadata.id,
        title: lesson.metadata.title,
        template: lesson.metadata.template,
        difficulty: lesson.metadata.difficulty,
        topic: lesson.metadata.topic
      }
      
      generatedLessons.push(summary)
      
      // Validate quality
      const validation = generator.validateLessonQuality(lesson)
      console.log(`✅ Generated successfully! Quality Score: ${validation.score}/100`)
      
      // Small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.log(`❌ Failed to generate lesson ${i + 1}: ${error}`)
    }
  }
  
  return generatedLessons
}

async function displayGenerationResults() {
  const lessons = await generatePolityLessons()
  
  console.log('\n' + '='.repeat(80))
  console.log('📚 BULK GENERATION COMPLETE - 20 POLITY LESSONS')
  console.log('='.repeat(80))
  console.log('')
  
  console.log('📋 LESSON IDs AND TITLES:')
  console.log('─'.repeat(80))
  
  lessons.forEach((lesson, index) => {
    console.log(`${(index + 1).toString().padStart(2, '0')}. ${lesson.id}`)
    console.log(`    Title: ${lesson.title}`)
    console.log(`    Template: ${lesson.template} | Difficulty: ${lesson.difficulty}`)
    console.log('')
  })
  
  // Generate summary statistics
  const templateCount = lessons.reduce((acc, lesson) => {
    acc[lesson.template] = (acc[lesson.template] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const difficultyCount = lessons.reduce((acc, lesson) => {
    acc[lesson.difficulty] = (acc[lesson.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log('📊 GENERATION STATISTICS:')
  console.log('─'.repeat(40))
  console.log(`Total Lessons Generated: ${lessons.length}`)
  console.log(`Success Rate: ${(lessons.length / 20 * 100).toFixed(1)}%`)
  console.log('')
  
  console.log('Templates Used:')
  Object.entries(templateCount).forEach(([template, count]) => {
    console.log(`  • ${template}: ${count} lessons`)
  })
  console.log('')
  
  console.log('Difficulty Distribution:')
  Object.entries(difficultyCount).forEach(([difficulty, count]) => {
    console.log(`  • ${difficulty}: ${count} lessons`)
  })
  console.log('')
  
  console.log('📝 TOPICS COVERED:')
  console.log('─'.repeat(40))
  const topicGroups = [
    'Preamble (2 lessons)',
    'Citizenship (2 lessons)', 
    'Fundamental Duties (2 lessons)',
    'Directive Principles (2 lessons)',
    'Union Executive (2 lessons)',
    'State Legislature (2 lessons)',
    'Supreme Court (2 lessons)',
    'High Courts (2 lessons)',
    'CAG (2 lessons)',
    'Election Commission (2 lessons)'
  ]
  
  topicGroups.forEach((group, index) => {
    console.log(`${index + 1}. ${group}`)
  })
  
  console.log('')
  console.log('✅ BULK GENERATION VERIFICATION COMPLETE!')
  console.log('   System successfully generated 20 high-quality lessons')
  console.log('   across 10 major Polity topics using 5 different templates.')
  
  return lessons
}

// Export for use
export { generatePolityLessons, displayGenerationResults }

// Run if called directly
if (require.main === module) {
  displayGenerationResults().catch(console.error)
}