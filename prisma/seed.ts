import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@communityias.com' },
    update: {},
    create: {
      email: 'admin@communityias.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      profile: {
        create: {
          preferredLanguage: 'en',
          studyHoursGoal: 6
        }
      }
    }
  })

  console.log('✅ Created admin user:', admin.email)

  // Create test student
  const studentPassword = await bcrypt.hash('student123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Test Student',
      password: studentPassword,
      role: 'STUDENT',
      emailVerified: new Date(),
      profile: {
        create: {
          preferredLanguage: 'en',
          studyHoursGoal: 4,
          aspirationType: 'UPSC',
          targetYear: 2025
        }
      }
    }
  })

  console.log('✅ Created test student:', student.email)

  // Create subjects
  const subjects = [
    {
      name: 'History',
      slug: 'history',
      description: 'Indian History from Ancient to Modern times',
      icon: '📚',
      color: '#8B4513',
      order: 1
    },
    {
      name: 'Geography',
      slug: 'geography',
      description: 'Physical, Human and Economic Geography',
      icon: '🌍',
      color: '#2E8B57',
      order: 2
    },
    {
      name: 'Polity',
      slug: 'polity',
      description: 'Indian Constitution, Governance and Political System',
      icon: '⚖️',
      color: '#4169E1',
      order: 3
    },
    {
      name: 'Economy',
      slug: 'economy',
      description: 'Indian Economy and Economic Development',
      icon: '💹',
      color: '#FFD700',
      order: 4
    },
    {
      name: 'Current Affairs',
      slug: 'current-affairs',
      description: 'Latest national and international developments',
      icon: '📰',
      color: '#FF6347',
      order: 5
    }
  ]

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {},
      create: subject
    })
  }

  console.log('✅ Created subjects')

  // Create Polity module with lessons
  const politySubject = await prisma.subject.findUnique({
    where: { slug: 'polity' }
  })

  if (politySubject) {
    const polityModule = await prisma.module.upsert({
      where: { 
        slug: 'fundamental-rights-duties'
      },
      update: {},
      create: {
        subjectId: politySubject.id,
        name: 'Fundamental Rights and Duties',
        slug: 'fundamental-rights-duties',
        description: 'Part III and IVA of the Constitution',
        order: 1
      }
    })

    // Create Fundamental Rights lesson
    await prisma.lesson.upsert({
      where: { slug: 'fundamental-rights' },
      update: {},
      create: {
        moduleId: polityModule.id,
        title: 'Fundamental Rights',
        slug: 'fundamental-rights',
        description: 'Six categories of Fundamental Rights guaranteed by the Constitution',
        content: {
          sections: [
            {
              id: 'intro',
              type: 'introduction',
              title: 'Introduction to Fundamental Rights',
              content: 'Fundamental Rights are the basic human rights enshrined in the Constitution of India.'
            },
            {
              id: 'categories',
              type: 'interactive',
              title: 'Six Categories of Fundamental Rights',
              content: 'Interactive cards to learn about each right'
            },
            {
              id: 'quiz',
              type: 'quiz',
              title: 'Test Your Knowledge',
              questions: [
                {
                  id: 'q1',
                  question: 'How many Fundamental Rights are guaranteed by the Indian Constitution?',
                  options: ['5', '6', '7', '8'],
                  correct: 1
                }
              ]
            }
          ]
        },
        estimatedTime: 45,
        difficulty: 'BEGINNER',
        order: 1,
        isPublished: true,
        isFree: true,
        tags: ['constitution', 'rights', 'part-iii']
      }
    })

    console.log('✅ Created Polity module and lessons')

    // Create a test
    const test = await prisma.test.create({
      data: {
        moduleId: polityModule.id,
        title: 'Fundamental Rights - Practice Test',
        slug: 'fundamental-rights-practice',
        description: 'Test your knowledge of Fundamental Rights',
        type: 'PRACTICE',
        duration: 30,
        totalQuestions: 10,
        totalMarks: 20,
        negativeMarking: 0.33,
        difficulty: 'BEGINNER',
        isPublished: true,
        isFree: true,
        questions: {
          create: [
            {
              type: 'MCQ',
              question: 'Which Article of the Constitution deals with the Right to Constitutional Remedies?',
              options: {
                options: [
                  'Article 19',
                  'Article 21',
                  'Article 32',
                  'Article 14'
                ]
              },
              correctAnswer: 2,
              explanation: 'Article 32 provides for the Right to Constitutional Remedies, which Dr. Ambedkar called the "heart and soul" of the Constitution.',
              marks: 2,
              difficulty: 'BEGINNER',
              tags: ['article-32', 'constitutional-remedies'],
              order: 1
            },
            {
              type: 'MCQ',
              question: 'The Right to Property was removed from Fundamental Rights by which Amendment?',
              options: {
                options: [
                  '42nd Amendment',
                  '44th Amendment',
                  '73rd Amendment',
                  '86th Amendment'
                ]
              },
              correctAnswer: 1,
              explanation: 'The 44th Constitutional Amendment Act, 1978 removed the Right to Property from Fundamental Rights and made it a legal right under Article 300A.',
              marks: 2,
              difficulty: 'INTERMEDIATE',
              tags: ['amendments', 'right-to-property'],
              order: 2
            }
          ]
        }
      }
    })

    console.log('✅ Created practice test')
  }

  // Create notifications for users
  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        title: 'Welcome to Community IAS Admin Panel',
        message: 'You can manage users, content, and view analytics from the admin dashboard.',
        type: 'INFO'
      },
      {
        userId: student.id,
        title: 'Welcome to Community IAS!',
        message: 'Start your UPSC journey with our interactive lessons and comprehensive test series.',
        type: 'SUCCESS'
      }
    ]
  })

  console.log('✅ Created notifications')
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })