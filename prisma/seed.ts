import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmt.co.id';
  const plainPassword = 'password123';
  const name = 'Admin User';

  console.log(`Checking for existing user with email: ${email}...`);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      name: name,
      password: hashedPassword,
    },
    create: {
      email: email,
      password: hashedPassword,
      name: name,
    },
  });

  console.log(`User ${user.email} has been created/confirmed.`);
  console.log('You can now log in with:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${plainPassword}`);
}

main()
  .catch((e) => {
    console.error('Error during database seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
