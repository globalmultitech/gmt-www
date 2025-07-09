import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmt.co.id';
  const plainPassword = 'password123';

  console.log(`Checking for existing admin user with email: ${email}...`);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  const admin = await prisma.admin.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      password: hashedPassword,
    },
  });

  console.log(`Admin user ${admin.email} has been created/confirmed.`);
  console.log('You can now log in with:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${plainPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
