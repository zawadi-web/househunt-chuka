import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hash = await bcrypt.hash('@chuka254', 10);
  const updated = await prisma.user.update({
    where: { email: 'giftmukhwana@gmail.com' },
    data: {
      role: 'ADMIN',
      passwordHash: hash,
    },
  });
  console.log('SUCCESS_ADMIN_UPDATED:', updated.email, updated.role);
}

main().catch(console.error);
