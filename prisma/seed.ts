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
        { label: 'Hubungi Kami', href: '/hubungi-kami' },
      ],
      heroHeadline: 'Creative solutions to improve your business',
      heroDescription: 'We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses of all sizes succeed in the digital world.',
      heroImageUrl: 'https://placehold.co/1920x1080.png',
      heroButton1Text: 'Our services',
      heroButton1Link: '/layanan',
      heroButton2Text: 'Contact us',
      heroButton2Link: '/hubungi-kami',
      featureCards: [
        {
            icon: 'MonitorSmartphone',
            title: 'Smart softwares',
            description: 'Duis aute irure dolor in repreherita ineto.',
        },
        {
            icon: 'BarChart',
            title: 'Trusted security',
            description: 'Lorem consectetur adipi elitsed tempono.',
        },
        {
            icon: 'Medal',
            title: 'Awards winners',
            description: 'Ariento mesfato prodo arte e eli manifesto.',
        },
        {
            icon: 'User',
            title: 'Great experience',
            description: 'Lorem consectetur adipiscing elitsed pro.',
        },
      ],
      aboutUsSubtitle: 'ABOUT US',
      aboutUsTitle: 'We are the best IT solution',
      aboutUsDescription: 'We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses of all sizes succeed in the digital world. We believe that technology can be a powerful tool for good, and we are dedicated to using our skills and expertise to make a positive impact.',
      aboutUsImageUrl: 'https://placehold.co/600x600.png',
      aboutUsChecklist: [
        "Bespoke software solutions",
        "Human-centered design",
        "Cloud-native architecture",
      ],
      servicesSubtitle: 'WHAT WE DO',
      servicesTitle: 'Layanan Profesional Kami',
      servicesDescription: 'Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda. Temukan bagaimana layanan kami dapat mendukung kesuksesan Anda.',
      professionalServices: [
        {
          icon: 'Headphones',
          title: 'Layanan Purna Jual',
          description: 'Kami memastikan investasi teknologi Anda beroperasi secara optimal dengan dukungan teknis yang responsif dan andal. Tim kami siap membantu mengatasi setiap kendala.',
          details: [
            'Dukungan teknis on-site dan remote.',
            'Kontrak pemeliharaan preventif.',
            'Ketersediaan suku cadang asli.',
            'Layanan perbaikan perangkat keras.',
          ],
        },
        {
          icon: 'Layers',
          title: 'Integrasi Sistem',
          description: 'Hubungkan semua komponen teknologi Anda menjadi satu ekosistem yang solid dan efisien. Kami ahli dalam mengintegrasikan sistem yang berbeda untuk kelancaran alur kerja.',
          details: [
            'Integrasi dengan Core Banking System.',
            'Penyatuan platform hardware dan software.',
            'Pengembangan API kustom.',
            'Sinkronisasi data antar sistem.',
          ],
        },
        {
          icon: 'Code2',
          title: 'Pengembangan Perangkat Lunak',
          description: 'Butuh solusi yang tidak tersedia di pasaran? Tim pengembang kami siap merancang dan membangun perangkat lunak kustom yang sesuai dengan kebutuhan unik bisnis Anda.',
          details: [
            'Analisis kebutuhan dan desain sistem.',
            'Pengembangan aplikasi web dan mobile.',
            'Jaminan kualitas dan pengujian menyeluruh.',
            'Dukungan dan pengembangan berkelanjutan.',
          ],
        },
        {
          icon: 'Bot',
          title: 'Penyewaan atau Outsourcing',
          description: 'Dapatkan akses ke teknologi terbaru tanpa beban investasi modal yang besar. Layanan penyewaan dan outsourcing kami memberikan fleksibilitas untuk pertumbuhan bisnis Anda.',
          details: [
            'Opsi sewa perangkat keras (kiosk, dll).',
            'Pengelolaan operasional IT oleh tim kami.',
            'Skalabilitas sesuai kebutuhan.',
            'Fokus pada bisnis inti Anda, serahkan IT pada kami.',
          ],
        },
      ],
      ctaHeadline: 'Ready to take your business to the next level?',
      ctaDescription: "Let's discuss how our IT solutions can help you achieve your goals.",
      ctaImageUrl: 'https://placehold.co/1920x1080.png',
      ctaButtonText: 'Get a Quote',
      ctaButtonLink: '/hubungi-kami',
      trustedByText: "Trusted by the world's leading companies",
      trustedByLogos: [
          { src: '/logo-placeholder-1.svg', alt: 'Client Logo 1' },
          { src: '/logo-placeholder-2.svg', alt: 'Client Logo 2' },
          { src: '/logo-placeholder-3.svg', alt: 'Client Logo 3' },
          { src: '/logo-placeholder-4.svg', alt: 'Client Logo 4' },
          { src: '/logo-placeholder-5.svg', alt: 'Client Logo 5' },
          { src: '/logo-placeholder-6.svg', alt: 'Client Logo 6' },
      ],
    },
  });
  console.log('Web settings seeded.');

  console.log('Seeding categories and sub-categories...');
  const hardwareCategory = await prisma.productCategory.upsert({
    where: { name: 'Perangkat Keras' },
    update: {
        description: 'Solusi perangkat keras inovatif untuk perbankan dan layanan keuangan, dirancang untuk keandalan dan efisiensi.',
        imageUrl: 'https://placehold.co/600x400.png'
    },
    create: { 
      name: 'Perangkat Keras',
      description: 'Solusi perangkat keras inovatif untuk perbankan dan layanan keuangan, dirancang untuk keandalan dan efisiensi.',
      imageUrl: 'https://placehold.co/600x400.png'
    },
  });

  const softwareCategory = await prisma.productCategory.upsert({
    where: { name: 'Perangkat Lunak' },
    update: {
        description: 'Aplikasi dan platform canggih untuk mengoptimalkan operasional, meningkatkan layanan, dan mendorong transformasi digital.',
        imageUrl: 'https://placehold.co/600x400.png'
    },
    create: { 
      name: 'Perangkat Lunak',
      description: 'Aplikasi dan platform canggih untuk mengoptimalkan operasional, meningkatkan layanan, dan mendorong transformasi digital.',
      imageUrl: 'https://placehold.co/600x400.png'
    },
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
      images: [],
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
      tokopediaUrl: '',
      shopeeUrl: '',
      subCategoryId: kioskSubCategory.id,
    },
    {
      title: 'SmartQ Queue System',
      slug: 'smartq-queue-system',
      description: 'Sistem antrian cerdas yang mengurangi waktu tunggu dan mengoptimalkan alur layanan pelanggan di cabang.',
      longDescription: 'Tinggalkan sistem antrian konvensional dan beralih ke SmartQ. Solusi manajemen antrian kami tidak hanya mengatur alur nasabah, tetapi juga mengumpulkan data berharga untuk analisis performa layanan. Nasabah dapat mengambil nomor antrian dari jarak jauh melalui aplikasi mobile, memantau status antrian secara real-time, dan mendapatkan estimasi waktu tunggu yang akurat. Ini adalah kunci untuk meningkatkan kepuasan dan loyalitas nasabah.',
      images: [],
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
      tokopediaUrl: '',
      shopeeUrl: '',
      subCategoryId: queueSubCategory.id,
    },
    {
      title: 'ForexRate Display F-32',
      slug: 'forexrate-display-f-32',
      description: 'Tampilan informasi kurs mata uang asing yang akurat, real-time, dan profesional untuk cabang bank Anda.',
      longDescription: 'Sajikan informasi kurs valuta asing dengan cara yang modern dan dapat diandalkan menggunakan ForexRate Display F-32. Dengan layar 32 inci beresolusi tinggi, informasi kurs menjadi jelas terbaca dari berbagai sudut. Sistem kami terhubung langsung ke sumber data terpercaya untuk memastikan kurs selalu up-to-date secara real-time. Konten tambahan seperti video promosi atau berita juga dapat ditampilkan, menjadikannya alat komunikasi yang efektif di dalam cabang.',
      images: [],
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
      tokopediaUrl: '',
      shopeeUrl: '',
      subCategoryId: displaySubCategory.id,
    }
  ];

  for (const productData of productsToSeed) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
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
