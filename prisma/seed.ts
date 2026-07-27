import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Chuka University and Chuka Town data...');

  // 1. Create Town
  const chukaTown = await prisma.town.upsert({
    where: { slug: 'chuka' },
    update: {},
    create: {
      name: 'Chuka',
      slug: 'chuka',
      county: 'Tharaka Nithi',
    },
  });

  // 2. Create Campus
  const chukaUni = await prisma.campus.upsert({
    where: { slug: 'chuka-university-main-campus' },
    update: {},
    create: {
      name: 'Chuka University Main Campus',
      slug: 'chuka-university-main-campus',
      townId: chukaTown.id,
      latitude: -0.3325,
      longitude: 37.6450,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Town created: ${chukaTown.name} (ID: ${chukaTown.id})`);
  console.log(`Campus created: ${chukaUni.name} (ID: ${chukaUni.id})`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
