
import prisma from '@/lib/db';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';

async function main() {
  const email = 'admin@gmt.co.id';
  const plainPassword = 'password123';
  const name = 'Admin User';

  console.log(`Checking for existing user with email: ${email}...`);

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(plainPassword, salt);

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

  console.log('Seeding web settings...');
  await prisma.webSettings.upsert({
    where: { id: 1 },
    update: {}, // Don't update on seed, just ensure it exists
    create: {
      id: 1,
      companyName: 'Global Multi Technology',
      whatsappSales: '+6281234567890',
      footerText: 'Menyediakan solusi dan layanan teknologi terdepan untuk transformasi digital.',
      socialMedia: {
        twitter: '#',
        facebook: '#',
        instagram: '#',
        linkedin: '#',
      },
      menuItems: [
        { label: 'Beranda', href: '/' },
        { label: 'Produk', href: '/produk' },
        { label: 'Solusi', href: '/solusi' },
        { label: 'Layanan', href: '/layanan' },
        { label: 'Resources', href: '/resources' },
        { label: 'Tentang Kami', href: '/tentang-kami' },
      ],
    },
  });
  console.log('Web settings seeded.');

  console.log('Seeding products...');
  const productsToSeed = [
    {
      title: 'Digital Kiosk GMT-K1',
      description: 'Solusi layanan mandiri interaktif untuk perbankan modern. Meningkatkan efisiensi dan pengalaman nasabah.',
      image: 'https://placehold.co/600x400.png',
      features: [
        "Layar sentuh 21.5 inci Full HD",
        "Dilengkapi NFC dan QR Code Reader",
        "Desain modular dan kokoh",
        "Sistem operasi yang aman dan terkunci"
      ],
      metaTitle: 'Jual Digital Kiosk GMT-K1 | Solusi Perbankan Modern',
      metaDescription: 'Digital Kiosk GMT-K1 adalah solusi layanan mandiri canggih untuk perbankan, dilengkapi fitur modern untuk meningkatkan efisiensi cabang.'
    },
    {
      title: 'SmartQ Queue System',
      description: 'Sistem antrian cerdas yang mengurangi waktu tunggu dan mengoptimalkan alur layanan pelanggan di cabang.',
      image: 'https://placehold.co/600x400.png',
      features: [
        "Manajemen antrian multi-layanan",
        "Tiket antrian via aplikasi mobile",
        "Analitik dan laporan performa layanan",
        "Panggilan suara dan display digital"
      ],
      metaTitle: 'SmartQ Queue System | Sistem Antrian Cerdas',
      metaDescription: 'Kurangi waktu tunggu dan tingkatkan kepuasan nasabah dengan SmartQ, sistem antrian cerdas dari Global Multi Technology.'
    },
    {
      title: 'ForexRate Display F-32',
      description: 'Tampilan informasi kurs mata uang asing yang akurat, real-time, dan profesional untuk cabang bank Anda.',
      image: 'https://placehold.co/600x400.png',
      features: [
        "Layar 32 inci dengan kecerahan tinggi",
        "Update kurs otomatis dari sumber terpercaya",
        "Tampilan dapat dikustomisasi dengan logo bank",
        "Manajemen konten terpusat via web"
      ],
      metaTitle: 'ForexRate Display F-32 | Papan Kurs Digital',
      metaDescription: 'Sajikan informasi kurs mata uang yang akurat dan real-time dengan ForexRate Display F-32. Profesional dan mudah dikelola.'
    }
  ];

  for (const productData of productsToSeed) {
    await prisma.product.upsert({
      where: { title: productData.title },
      update: productData,
      create: productData,
    });
    console.log(`Product "${productData.title}" seeded.`);
  }

  console.log('Products seeded.');


  console.log('\nSeed completed. You can now log in with:');
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
