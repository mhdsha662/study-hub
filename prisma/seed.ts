import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cambridge.com' },
    update: {},
    create: {
      email: 'admin@cambridge.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      hasBookAccess: true,
      isActive: true,
    },
  })

  // Create sample subjects
  const subjects = [
    { code: '9701', name: 'Chemistry', level: 'A_LEVEL' as const },
    { code: '9702', name: 'Physics', level: 'A_LEVEL' as const },
    { code: '9700', name: 'Biology', level: 'A_LEVEL' as const },
    { code: '9609', name: 'Business', level: 'A_LEVEL' as const },
    { code: '9618', name: 'IT', level: 'A_LEVEL' as const },
    { code: '9709', name: 'Mathematics', level: 'A_LEVEL' as const },
    { code: '0620', name: 'Chemistry', level: 'IGCSE' as const },
    { code: '0625', name: 'Physics', level: 'IGCSE' as const },
    { code: '0610', name: 'Biology', level: 'IGCSE' as const },
    { code: '0450', name: 'Business Studies', level: 'IGCSE' as const },
  ]

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: {},
      create: subject,
    })
  }

  // Create sample announcement
  await prisma.announcement.create({
    data: {
      title: 'Welcome to Cambridge Study Hub!',
      content: 'This is a platform for accessing Cambridge study resources. Past papers are freely available, while books require login access.',
      priority: 1,
    },
  })

  // Create sample past papers
  const chemistrySubject = await prisma.subject.findFirst({ where: { code: '9701' } })
  const physicsSubject = await prisma.subject.findFirst({ where: { code: '9702' } })
  const igcseChemistrySubject = await prisma.subject.findFirst({ where: { code: '0620' } })

  if (chemistrySubject) {
    await prisma.resource.createMany({
      data: [
        {
          title: '9701 Chemistry AS Level Paper 1',
          filename: '9701_s24_qp_11.pdf',
          originalName: '9701_s24_qp_11.pdf',
          filePath: 'past-papers/9701_s24_qp_11.pdf',
          fileSize: 1024000,
          mimeType: 'application/pdf',
          category: 'PAST_PAPER',
          year: 2024,
          paperNumber: '1',
          subjectId: chemistrySubject.id,
          downloadCount: 1234,
          viewCount: 5678,
        },
        {
          title: '9701 Chemistry A Level Paper 3',
          filename: '9701_s24_qp_31.pdf',
          originalName: '9701_s24_qp_31.pdf',
          filePath: 'past-papers/9701_s24_qp_31.pdf',
          fileSize: 1152000,
          mimeType: 'application/pdf',
          category: 'PAST_PAPER',
          year: 2024,
          paperNumber: '3',
          subjectId: chemistrySubject.id,
          downloadCount: 987,
          viewCount: 4321,
        },
        {
          title: '9701 Chemistry AS Level Paper 1',
          filename: '9701_s23_qp_11.pdf',
          originalName: '9701_s23_qp_11.pdf',
          filePath: 'past-papers/9701_s23_qp_11.pdf',
          fileSize: 980000,
          mimeType: 'application/pdf',
          category: 'PAST_PAPER',
          year: 2023,
          paperNumber: '1',
          subjectId: chemistrySubject.id,
          downloadCount: 2345,
          viewCount: 8901,
        },
      ],
    })
  }

  if (physicsSubject) {
    await prisma.resource.createMany({
      data: [
        {
          title: '9702 Physics AS Level Paper 1',
          filename: '9702_s24_qp_11.pdf',
          originalName: '9702_s24_qp_11.pdf',
          filePath: 'past-papers/9702_s24_qp_11.pdf',
          fileSize: 890000,
          mimeType: 'application/pdf',
          category: 'PAST_PAPER',
          year: 2024,
          paperNumber: '1',
          subjectId: physicsSubject.id,
          downloadCount: 1567,
          viewCount: 6789,
        },
        {
          title: '9702 Physics A Level Paper 4',
          filename: '9702_s24_qp_41.pdf',
          originalName: '9702_s24_qp_41.pdf',
          filePath: 'past-papers/9702_s24_qp_41.pdf',
          fileSize: 1200000,
          mimeType: 'application/pdf',
          category: 'PAST_PAPER',
          year: 2024,
          paperNumber: '4',
          subjectId: physicsSubject.id,
          downloadCount: 876,
          viewCount: 3456,
        },
      ],
    })
  }

  if (igcseChemistrySubject) {
    await prisma.resource.createMany({
      data: [
        {
          title: '0620 Chemistry Paper 2',
          filename: '0620_s23_qp_22.pdf',
          originalName: '0620_s23_qp_22.pdf',
          filePath: 'past-papers/0620_s23_qp_22.pdf',
          fileSize: 750000,
          mimeType: 'application/pdf',
          category: 'PAST_PAPER',
          year: 2023,
          paperNumber: '2',
          subjectId: igcseChemistrySubject.id,
          downloadCount: 3456,
          viewCount: 12345,
        },
        {
          title: '0620 Chemistry Paper 4',
          filename: '0620_s23_qp_42.pdf',
          originalName: '0620_s23_qp_42.pdf',
          filePath: 'past-papers/0620_s23_qp_42.pdf',
          fileSize: 850000,
          mimeType: 'application/pdf',
          category: 'PAST_PAPER',
          year: 2023,
          paperNumber: '4',
          subjectId: igcseChemistrySubject.id,
          downloadCount: 2890,
          viewCount: 9876,
        },
      ],
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })