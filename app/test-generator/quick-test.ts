import { PrelimsTestGenerator } from './generators/PrelimsTestGenerator'
import { TestConfiguration } from './types'

async function quickTest() {
  console.log('🧪 Quick Test Generator System Test')
  console.log('===================================\n')
  
  try {
    const generator = new PrelimsTestGenerator()
    
    const config: TestConfiguration = {
      testType: 'Prelims',
      duration: 120,
      totalQuestions: 10, // Small test for speed
      negativeMarking: -0.66,
      subjectDistribution: [],
      difficultyDistribution: {
        easy: 0.3,
        medium: 0.5,
        hard: 0.2
      }
    }
    
    console.log('Generating sample test...')
    const test = await generator.generateTest(config)
    
    console.log(`✅ Test generated successfully!`)
    console.log(`- ID: ${test.id}`)
    console.log(`- Questions: ${test.questions.length}`)
    console.log(`- Duration: ${test.duration} minutes`)
    console.log(`- Subject breakdown:`)
    
    Object.entries(test.subjectWiseBreakdown).forEach(([subject, count]) => {
      console.log(`  ${subject}: ${count}`)
    })
    
    console.log(`\nFirst question sample:`)
    console.log(`Q1. ${test.questions[0]?.question}`)
    console.log(`Options: ${test.questions[0]?.options.join(', ')}`)
    
    console.log('\n✅ Test Generator System is working correctly!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

quickTest()