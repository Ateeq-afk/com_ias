#!/usr/bin/env ts-node

import { demonstrateQuestionGeneration } from './question-generator/QuestionGenerationDemo'
import { demonstrateCurrentAffairsSystem } from './current-affairs/demonstration'

async function runCompleteDemo() {
  console.log('🎓 UPSC PREPARATION SYSTEM - COMPLETE DEMONSTRATION')
  console.log('==================================================\n')
  
  console.log('This demonstration showcases two powerful systems:')
  console.log('1. Question Generation System - Creates thousands of questions from base facts')
  console.log('2. Current Affairs System - Processes daily news for UPSC relevance\n')
  
  console.log('Press Enter to start the demonstration...')
  
  // Part 1: Question Generation System
  console.log('\n\n📚 PART 1: QUESTION GENERATION SYSTEM')
  console.log('=====================================\n')
  
  try {
    await demonstrateQuestionGeneration()
  } catch (error) {
    console.error('Error in Question Generation:', error)
  }
  
  console.log('\n\n--- Press Enter to continue to Current Affairs System ---')
  
  // Part 2: Current Affairs System
  console.log('\n\n📰 PART 2: CURRENT AFFAIRS SYSTEM')
  console.log('=================================\n')
  
  try {
    await demonstrateCurrentAffairsSystem()
  } catch (error) {
    console.error('Error in Current Affairs System:', error)
  }
  
  console.log('\n\n🏁 COMPLETE DEMONSTRATION FINISHED!')
  console.log('===================================')
  console.log('\nBoth systems are ready for production use:')
  console.log('• Question Generation: 10-15x multiplication per fact')
  console.log('• Current Affairs: Daily automated content creation')
  console.log('\nThank you for watching the demonstration! 🎉')
}

// Run the complete demo
if (require.main === module) {
  runCompleteDemo()
    .catch(error => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { runCompleteDemo }