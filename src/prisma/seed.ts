
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
      logoUrl: '',
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

  console.log('Seeding categories and sub-categories...');
  const hardwareCategory = await prisma.productCategory.upsert({
    where: { name: 'Perangkat Keras' },
    update: {},
    create: { name: 'Perangkat Keras' },
  });

  const kioskSubCategory = await prisma.productSubCategory.upsert({
    where: { name_categoryId: { name: 'Kiosk Digital', categoryId: hardwareCategory.id } },
    update: {},
    create: { name: 'Kiosk Digital', categoryId: hardwareCategory.id },
  });

  const queueSubCategory = await prisma.productSubCategory.upsert({
    where: { name_categoryId: { name: 'Sistem Antrian', categoryId: hardwareCategory.id } },
    update: {},
    create: { name: 'Sistem Antrian', categoryId: hardwareCategory.id },
  });
  
  const displaySubCategory = await prisma.productSubCategory.upsert({
    where: { name_categoryId: { name: 'Display Informasi', categoryId: hardwareCategory.id } },
    update: {},
    create: { name: 'Display Informasi', categoryId: hardwareCategory.id },
  });
  console.log('Categories seeded.');


  console.log('Seeding products...');
  const productsToSeed = [
    {
      title: 'Digital Kiosk GMT-K1',
      slug: 'digital-kiosk-gmt-k1',
      description: 'Solusi layanan mandiri interaktif untuk perbankan modern. Meningkatkan efisiensi dan pengalaman nasabah.',
      longDescription: 'Digital Kiosk GMT-K1 merupakan terobosan dalam layanan perbankan mandiri. Dirancang dengan desain yang elegan dan futuristik, kiosk ini memungkinkan nasabah untuk melakukan berbagai transaksi tanpa perlu antri di teller, mulai dari pembukaan rekening, transfer, hingga pembayaran tagihan. Dibangun dengan material berkualitas tinggi dan sistem keamanan berlapis, GMT-K1 adalah investasi cerdas untuk modernisasi cabang bank Anda.',
      image: 'https://placehold.co/600x400.png',
      features: [
        "Layar sentuh 21.5 inci Full HD responsif",
        "Dilengkapi NFC dan QR Code Reader terintegrasi",
        "Desain modular yang kokoh dan mudah perawatannya",
        "Sistem operasi yang aman dan terkunci untuk perbankan"
      ],
      specifications: {
        "Ukuran Layar": "21.5 inci",
        "Resolusi": "1920 x 1080 (Full HD)",
        "Tipe Panel": "IPS, 10-point capacitive touch",
        "Prosesor": "Intel Core i5",
        "Memori": "8GB DDR4 RAM",
        "Penyimpanan": "256GB SSD NVMe",
        "Konektivitas": "Wi-Fi, Ethernet, Bluetooth"
      },
      metaTitle: 'Jual Digital Kiosk GMT-K1 | Solusi Perbankan Modern',
      metaDescription: 'Digital Kiosk GMT-K1 adalah solusi layanan mandiri canggih untuk perbankan, dilengkapi fitur modern untuk meningkatkan efisiensi cabang.',
      subCategoryId: kioskSubCategory.id,
    },
    {
      title: 'SmartQ Queue System',
      slug: 'smartq-queue-system',
      description: 'Sistem antrian cerdas yang mengurangi waktu tunggu dan mengoptimalkan alur layanan pelanggan di cabang.',
      longDescription: 'Tinggalkan sistem antrian konvensional dan beralih ke SmartQ. Solusi manajemen antrian kami tidak hanya mengatur alur nasabah, tetapi juga mengumpulkan data berharga untuk analisis performa layanan. Nasabah dapat mengambil nomor antrian dari jarak jauh melalui aplikasi mobile, memantau status antrian secara real-time, dan mendapatkan estimasi waktu tunggu yang akurat. Ini adalah kunci untuk meningkatkan kepuasan dan loyalitas nasabah.',
      image: 'https://placehold.co/600x400.png',
      features: [
        "Manajemen antrian multi-layanan dan multi-teller",
        "Tiket antrian virtual via aplikasi mobile atau QR code",
        "Dasbor analitik dan laporan performa layanan real-time",
        "Panggilan suara otomatis dan display digital informatif"
      ],
      specifications: {
        "Komponen": "Mesin Tiket, Display Utama, Display Teller, Software Manajemen",
        "Integrasi": "API untuk Aplikasi Mobile, Notifikasi SMS/WhatsApp",
        "Kustomisasi": "Alur layanan, jenis layanan, branding display",
        "Platform": "Berbasis Web, dapat diakses dari mana saja"
      },
      metaTitle: 'SmartQ Queue System | Sistem Antrian Cerdas',
      metaDescription: 'Kurangi waktu tunggu dan tingkatkan kepuasan nasabah dengan SmartQ, sistem antrian cerdas dari Global Multi Technology.',
      subCategoryId: queueSubCategory.id,
    },
    {
      title: 'ForexRate Display F-32',
      slug: 'forexrate-display-f-32',
      description: 'Tampilan informasi kurs mata uang asing yang akurat, real-time, dan profesional untuk cabang bank Anda.',
      longDescription: 'Sajikan informasi kurs valuta asing dengan cara yang modern dan dapat diandalkan menggunakan ForexRate Display F-32. Dengan layar 32 inci beresolusi tinggi, informasi kurs menjadi jelas terbaca dari berbagai sudut. Sistem kami terhubung langsung ke sumber data terpercaya untuk memastikan kurs selalu up-to-date secara real-time. Konten tambahan seperti video promosi atau berita juga dapat ditampilkan, menjadikannya alat komunikasi yang efektif di dalam cabang.',
      image: 'https://placehold.co/600x400.png',
      features: [
        "Layar 32 inci profesional dengan kecerahan tinggi",
        "Pembaruan kurs otomatis dan real-time dari sumber terpercaya",
        "Tampilan dapat dikustomisasi sepenuhnya dengan logo bank",
        "Manajemen konten terpusat berbasis web yang mudah digunakan"
      ],
       specifications: {
        "Ukuran Layar": "32 inci",
        "Resolusi": "1920 x 1080 (Full HD)",
        "Orientasi": "Potrait / Landscape",
        "Fitur Software": "Manajemen playlist, penjadwalan konten, template kurs",
        "Input Data": "API, XML, atau input manual"
      },
      metaTitle: 'ForexRate Display F-32 | Papan Kurs Digital',
      metaDescription: 'Sajikan informasi kurs mata uang yang akurat dan real-time dengan ForexRate Display F-32. Profesional dan mudah dikelola.',
      subCategoryId: displaySubCategory.id,
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
