
import prisma from '@/lib/db';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';

const toSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

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
      whatsappSales: '+6281220819549',
      footerText: 'Menyediakan solusi dan layanan teknologi terdepan untuk transformasi digital.',
      address: 'Jl. Cikoneng raya pesona asri no B1. Bandung, Jawa Barat, Indonesia',
      contactEmail: 'helpdesk@globalmultitechnology.id',
      contactPhone: '+6281220819549',
      openingHours: '8:00 AM - 17:00 PM',
      socialMedia: JSON.stringify({
        twitter: '#',
        facebook: '#',
        instagram: '#',
        linkedin: '#',
      }),
      menuItems: JSON.stringify([
        { label: 'Beranda', href: '/' },
        { label: 'Produk', href: '/produk' },
        { label: 'Solusi', href: '/solusi' },
        { label: 'Layanan', href: '/layanan' },
        { label: 'Blog', href: '/resources' },
        { label: 'Tentang Kami', href: '/tentang-kami' },
        { label: 'Hubungi Kami', href: '/hubungi-kami' },
      ]),
      heroHeadline: 'Creative solutions to improve your business',
      heroDescription: 'We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses of all sizes succeed in the digital world.',
      heroImageUrl: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/0b518d15-d998-4574-af57-aac7224dc01f.jpg',
      heroButton1Text: 'Our services',
      heroButton1Link: '/layanan',
      heroButton2Text: 'Contact us',
      heroButton2Link: '/hubungi-kami',
      featureCards: JSON.stringify([
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
            icon: 'Users',
            title: 'Great experience',
            description: 'Lorem consectetur adipiscing elitsed pro.',
        },
      ]),
      aboutUsSubtitle: 'ABOUT US',
      aboutUsTitle: 'We are the best IT solution',
      aboutUsDescription: 'We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses of all sizes succeed in the digital world. We believe that technology can be a powerful tool for good, and we are dedicated to using our skills and expertise to make a positive impact.',
      aboutUsImageUrl: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/39bd11c5-f028-4edb-802d-32ebde954efd.jpg',
      aboutUsChecklist: JSON.stringify([
        "Bespoke software solutions",
        "Human-centered design",
        "Cloud-native architecture",
      ]),
      servicesSubtitle: 'WHAT WE DO',
      servicesTitle: 'Layanan Profesional Kami',
      servicesDescription: 'Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda. Temukan bagaimana layanan kami dapat mendukung kesuksesan Anda.',
      ctaHeadline: 'Ready to take your business to the next level?',
      ctaDescription: "Let's discuss how our IT solutions can help you achieve your goals.",
      ctaImageUrl: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/73620f84-f51b-4b88-915e-1d82fa5925c0.jpg',
      ctaButtonText: 'Get a Quote',
      ctaButtonLink: '/hubungi-kami',
      trustedByText: "Trusted by the world's leading companies",
      trustedByLogos: JSON.stringify([
          { src: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/c119b97e-52ac-4188-b1b7-83e8101c8740.jpeg', alt: 'Client Logo 1' },
          { src: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/257ded94-f09a-4d92-a2f1-3054a4cb5a77.jpeg', alt: 'Client Logo 2' },
          { src: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/d2834e54-33ee-43ee-bb59-489943bf46d0.jpeg', alt: 'Client Logo 3' },
          { src: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/96776f80-bdb8-4886-9d3c-cead98b2ebdb.jpeg', alt: 'Client Logo 4' },
          { src: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/797b0afb-03b1-4dad-8dd8-299cd9f151ce.jpeg', alt: 'Client Logo 5' },
          { src: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/2143fc3d-dd14-4739-93ea-cd909f06baba.jpeg', alt: 'Client Logo 6' },
      ]),
      testimonials: JSON.stringify([
        {
            quote: "We've been using Daltech for a few years now, and we're very happy with the results. They're a great team to work with, and they're always willing to go the extra mile to help us succeed.",
            name: 'John Doe',
            role: 'CEO, Company',
            image: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/b29d2c5b-d179-4034-92ee-a936537b5af9.png',
            aiHint: 'professional man portrait',
        },
        {
            quote: "The team at Daltech is incredibly talented and passionate about what they do. They took the time to understand our business and our goals, and they delivered a solution that exceeded our expectations.",
            name: 'Jane Smith',
            role: 'CTO, Another Corp',
            image: 'https://pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev/ea02196b-878c-43a7-bbd4-b0b847f51338.png',
            aiHint: 'professional woman portrait',
        },
      ]),
      servicesPageTitle: 'Layanan Profesional Kami',
      servicesPageSubtitle: 'Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda. Temukan bagaimana layanan kami dapat mendukung kesuksesan Anda.',
      servicesPageCommitmentTitle: 'Komitmen Kami Pada Keamanan',
      servicesPageCommitmentText: 'Dalam setiap layanan yang kami berikan, keamanan adalah prioritas utama. Kami menerapkan standar keamanan industri tertinggi untuk melindungi data dan aset berharga Anda, memastikan ketenangan pikiran dalam setiap langkah transformasi digital Anda.',
      servicesPageHeaderImageUrl: 'https://placehold.co/600x400.png',
      
      solutionsPageTitle: 'Solusi Teknologi Unggulan',
      solutionsPageSubtitle: 'Kami menyediakan solusi end-to-end yang dirancang untuk mengatasi tantangan spesifik dalam industri layanan keuangan dan perbankan.',
      
      aboutPageTitle: 'Tentang Global Multi Technology',
      aboutPageSubtitle: 'Bekerja Sama dengan Para Pemimpin Industri untuk Memberikan Solusi Terbaik',
      missionTitle: 'Misi Kami', // This field is no longer displayed but we keep it for now
      missionText: 'Menyediakan solusi teknologi inovatif dan layanan profesional yang andal untuk membantu klien kami bertransformasi secara digital, meningkatkan efisiensi, dan mencapai keunggulan kompetitif di era modern.',
      visionTitle: 'Visi Kami', // This field is no longer displayed but we keep it for now
      visionText: 'Menjadi mitra teknologi terdepan dan terpercaya di Asia Tenggara, yang dikenal karena inovasi, kualitas layanan, dan komitmen kami terhadap kesuksesan setiap pelanggan.',
      
      resourcesPageTitle: 'Wawasan & Berita',
      resourcesPageSubtitle: 'Dapatkan wawasan terbaru dari industri, berita perusahaan, dan artikel mendalam dari para ahli kami.',
    },
  });
  console.log('Web settings seeded.');

  // Clear existing page-specific data
  console.log('Clearing old page data...');
  await prisma.professionalService.deleteMany({});
  await prisma.solution.deleteMany({});
  await prisma.partnerLogo.deleteMany({});
  await prisma.customerLogo.deleteMany({});
  await prisma.newsItem.deleteMany({});
  console.log('Old page data cleared.');


  console.log('Seeding Professional Services...');
  await prisma.professionalService.createMany({
    data: [
      {
        icon: 'Headphones',
        title: 'Layanan Purna Jual',
        slug: 'layanan-purna-jual',
        description: 'Kami memastikan investasi teknologi Anda beroperasi secara optimal dengan dukungan teknis yang responsif dan andal.',
        details: JSON.stringify([
          'Dukungan teknis on-site dan remote.',
          'Kontrak pemeliharaan preventif.',
          'Ketersediaan suku cadang asli.',
        ]),
        longDescription: 'Dukungan purna jual kami dirancang untuk memberikan ketenangan pikiran. Kami memahami bahwa setiap detik downtime dapat merugikan. Oleh karena itu, tim teknis kami yang berpengalaman selalu siap sedia untuk memberikan solusi cepat dan efektif, baik melalui kunjungan langsung maupun bantuan jarak jauh, memastikan kelangsungan operasional bisnis Anda.',
        imageUrl: 'https://placehold.co/800x600.png',
        benefits: JSON.stringify([
            'Memperpanjang umur perangkat',
            'Mengurangi risiko downtime',
            'Respons cepat dari tim ahli'
        ])
      },
      {
        icon: 'Layers',
        title: 'Integrasi Sistem',
        slug: 'integrasi-sistem',
        description: 'Hubungkan semua komponen teknologi Anda menjadi satu ekosistem yang solid dan efisien untuk kelancaran alur kerja.',
        details: JSON.stringify([
          'Integrasi dengan Core Banking System.',
          'Penyatuan platform hardware dan software.',
          'Pengembangan API kustom.',
        ]),
        longDescription: 'Di dunia digital yang kompleks, sistem yang terisolasi adalah penghambat utama efisiensi. Layanan integrasi sistem kami menjembatani kesenjangan antara berbagai platform dan aplikasi yang Anda gunakan. Kami merancang arsitektur yang solid untuk memastikan aliran data yang lancar dan otomatisasi proses bisnis yang mulus, memungkinkan Anda mendapatkan gambaran utuh dari operasional perusahaan.',
        imageUrl: 'https://placehold.co/800x600.png',
        benefits: JSON.stringify([
            'Alur kerja yang lebih efisien',
            'Visibilitas data yang lebih baik',
            'Mengurangi pekerjaan manual'
        ])
      },
      {
        icon: 'Code2',
        title: 'Pengembangan Perangkat Lunak',
        slug: 'pengembangan-perangkat-lunak',
        description: 'Butuh solusi yang tidak tersedia di pasaran? Tim kami siap merancang dan membangun perangkat lunak kustom.',
        details: JSON.stringify([
          'Analisis kebutuhan dan desain sistem.',
          'Pengembangan aplikasi web dan mobile.',
          'Jaminan kualitas dan pengujian menyeluruh.',
        ]),
        longDescription: 'Ketika solusi siap pakai tidak memenuhi kebutuhan unik bisnis Anda, layanan pengembangan perangkat lunak kustom kami adalah jawabannya. Kami bekerja sama dengan Anda mulai dari tahap konsepsi hingga peluncuran untuk membangun aplikasi yang dirancang khusus untuk proses bisnis, tantangan, dan tujuan Anda. Dengan pendekatan agile, kami memastikan produk akhir tidak hanya fungsional tetapi juga skalabel dan mudah digunakan.',
        imageUrl: 'https://placehold.co/800x600.png',
        benefits: JSON.stringify([
            'Solusi yang 100% sesuai kebutuhan',
            'Keunggulan kompetitif',
            'Skalabilitas untuk masa depan'
        ])
      },
      {
        icon: 'Bot',
        title: 'Penyewaan atau Outsourcing',
        slug: 'penyewaan-atau-outsourcing',
        description: 'Dapatkan akses ke teknologi terbaru tanpa beban investasi modal yang besar. Fleksibel untuk pertumbuhan bisnis Anda.',
        details: JSON.stringify([
          'Opsi sewa perangkat keras (kiosk, dll).',
          'Pengelolaan operasional IT oleh tim kami.',
          'Skalabilitas sesuai kebutuhan.',
        ]),
        longDescription: 'Fokuskan sumber daya Anda pada bisnis inti dan biarkan kami yang mengurus kebutuhan teknologi Anda. Dengan model penyewaan atau outsourcing, Anda dapat mengakses teknologi dan keahlian terkini tanpa harus melakukan investasi modal yang besar. Ini adalah solusi fleksibel yang memungkinkan Anda beradaptasi dengan cepat terhadap perubahan pasar dan kebutuhan bisnis yang dinamis.',
        imageUrl: 'https://placehold.co/800x600.png',
        benefits: JSON.stringify([
            'Menghemat biaya investasi awal (CAPEX)',
            'Akses ke teknologi & keahlian terbaru',
            'Fokus pada bisnis inti'
        ])
      },
    ]
  });

  console.log('Seeding Solutions...');
  await prisma.solution.deleteMany({}); // Make sure table is empty before seeding
  
  const digitalBankingParent = await prisma.solution.create({
    data: {
      icon: 'Building',
      title: 'Solusi Perbankan Digital',
      slug: 'solusi-perbankan-digital',
      description: 'Modernisasi layanan perbankan Anda untuk era digital, meningkatkan efisiensi dan pengalaman nasabah.',
      image: "https://placehold.co/600x400.png",
      aiHint: "modern bank interior",
      keyPoints: JSON.stringify([]),
    }
  });

  const securityParent = await prisma.solution.create({
    data: {
      icon: 'ShieldCheck',
      title: 'Solusi Keamanan Siber',
      slug: 'solusi-keamanan-siber',
      description: 'Lindungi aset digital dan data nasabah dari ancaman siber dengan teknologi keamanan berlapis.',
      image: "https://placehold.co/600x400.png",
      aiHint: "cyber security",
      keyPoints: JSON.stringify([]),
    }
  });

  const subSolutions = [
      {
          icon: 'Briefcase',
          title: 'Transformasi Cabang Digital',
          slug: 'transformasi-cabang-digital',
          description: 'Revolusikan cabang konvensional menjadi pusat layanan digital yang efisien dan modern.',
          image: "https://placehold.co/600x400.png",
          aiHint: "modern bank interior",
          keyPoints: JSON.stringify([
            'Implementasi Digital Kiosk untuk layanan mandiri.',
            'Sistem Antrian Cerdas untuk mengurangi waktu tunggu.',
            'Peningkatan efisiensi dan produktivitas cabang.',
          ]),
          parentId: digitalBankingParent.id,
      },
      {
          icon: 'Smartphone',
          title: 'Digital Onboarding (e-KYC)',
          slug: 'digital-onboarding-ekyc',
          description: 'Permudah akuisisi nasabah baru dengan pembukaan rekening digital yang cepat dan aman.',
          image: "https://placehold.co/600x400.png",
          aiHint: "person using phone app",
          keyPoints: JSON.stringify([
            'Verifikasi identitas dengan pengenalan wajah.',
            'Proses 100% online, tanpa perlu ke cabang.',
            'Sesuai dengan regulasi OJK.',
          ]),
          parentId: digitalBankingParent.id,
      },
      {
          icon: 'Gem',
          title: 'Platform Wealth Management',
          slug: 'platform-wealth-management',
          description: 'Sediakan platform intuitif bagi nasabah prioritas untuk mengelola investasi mereka.',
          image: "https://placehold.co/600x400.png",
          aiHint: "financial dashboard charts",
          keyPoints: JSON.stringify([
            'Dasbor portofolio yang komprehensif.',
            'Fitur robo-advisory untuk rekomendasi investasi.',
            'Laporan performa investasi yang mudah dipahami.',
          ]),
          parentId: digitalBankingParent.id,
      },
       {
          icon: 'Lock',
          title: 'Deteksi Penipuan Berbasis AI',
          slug: 'deteksi-penipuan-berbasis-ai',
          description: 'Sistem deteksi anomali dan penipuan real-time didukung oleh kecerdasan buatan.',
          image: "https://placehold.co/600x400.png",
          aiHint: "security data analysis",
          keyPoints: JSON.stringify([
            'Analisis transaksi mencurigakan secara otomatis.',
            'Mengurangi risiko kerugian akibat fraud.',
            'Model machine learning yang terus belajar.',
          ]),
          parentId: securityParent.id,
      },
      {
          icon: 'Key',
          title: 'Manajemen Akses & Identitas',
          slug: 'manajemen-akses-identitas',
          description: 'Pastikan hanya pengguna yang berwenang yang dapat mengakses sistem dan data sensitif.',
          image: "https://placehold.co/600x400.png",
          aiHint: "digital identity security",
          keyPoints: JSON.stringify([
            'Implementasi Multi-Factor Authentication (MFA).',
            'Manajemen hak akses berbasis peran (Role-Based Access Control).',
            'Audit trail untuk semua aktivitas akses.',
          ]),
          parentId: securityParent.id,
      },
  ];
  await prisma.solution.createMany({
    data: subSolutions
  });
  
  console.log('Seeding Partner & Customer Logos...');
  await prisma.partnerLogo.createMany({
    data: [
        { src: 'https://placehold.co/200x100.png', alt: 'Partner A' },
        { src: 'https://placehold.co/200x100.png', alt: 'Partner B' },
        { src: 'https://placehold.co/200x100.png', alt: 'Partner C' },
        { src: 'https://placehold.co/200x100.png', alt: 'Partner D' },
    ]
  });

  await prisma.customerLogo.createMany({
    data: [
        { src: 'https://placehold.co/200x100.png', alt: 'Customer 1' },
        { src: 'https://placehold.co/200x100.png', alt: 'Customer 2' },
        { src: 'https://placehold.co/200x100.png', alt: 'Customer 3' },
        { src: 'https://placehold.co/200x100.png', alt: 'Customer 4' },
        { src: 'https://placehold.co/200x100.png', alt: 'Customer 5' },
        { src: 'https://placehold.co/200x100.png', alt: 'Customer 6' },
    ]
  });


  console.log('Seeding News Items...');
  const newsItemsToSeed = [
      {
          title: 'GMT Hadiri Pameran Teknologi Finansial Terbesar di Asia',
          category: 'Acara Perusahaan',
          image: 'https://placehold.co/600x400.png',
          content: 'Tim Global Multi Technology dengan bangga berpartisipasi dalam pameran teknologi finansial terbesar di Asia, menampilkan inovasi terbaru kami dalam solusi perbankan digital dan keamanan siber. Acara ini menjadi platform penting bagi kami untuk berinteraksi dengan para pemimpin industri dan calon mitra strategis.'
      },
      {
          title: 'Studi Kasus: Bank XYZ Meningkatkan Efisiensi Cabang 40% dengan Kiosk GMT',
          category: 'Studi Kasus',
          image: 'https://placehold.co/600x400.png',
          content: 'Implementasi 50 unit Digital Kiosk GMT-K1 di seluruh cabang Bank XYZ berhasil meningkatkan efisiensi operasional hingga 40%. Waktu antrian nasabah berkurang secara drastis, dan staf cabang dapat lebih fokus pada layanan konsultatif yang bernilai tambah tinggi. Baca selengkapnya tentang keberhasilan transformasi ini.'
      },
      {
          title: 'Prediksi Tren Teknologi Perbankan di Tahun 2025',
          category: 'Analisis Industri',
          image: 'https://placehold.co/600x400.png',
          content: 'Tahun 2025 akan menjadi era hiper-personalisasi dan perbankan proaktif. Kecerdasan buatan akan memainkan peran sentral dalam menganalisis data nasabah untuk menawarkan produk yang relevan secara real-time. Selain itu, adopsi teknologi blockchain untuk keamanan transaksi diperkirakan akan semakin meluas. Simak analisis lengkap dari para ahli kami.'
      },
       {
          title: 'Webinar: Memanfaatkan AI untuk Mencegah Penipuan Finansial',
          category: 'Webinar',
          image: 'https://placehold.co/600x400.png',
          content: 'Dalam webinar eksklusif ini, kami membahas bagaimana solusi deteksi penipuan berbasis AI dari GMT dapat membantu lembaga keuangan mengurangi risiko kerugian akibat fraud. Kami mendemonstrasikan kemampuan sistem dalam menganalisis jutaan transaksi secara real-time untuk mendeteksi pola anomali yang mencurigakan.'
      },
      {
          title: 'GMT Meluncurkan Program Kemitraan untuk Startup Fintech',
          category: 'Siaran Pers',
          image: 'https://placehold.co/600x400.png',
          content: 'Sebagai komitmen kami untuk mendorong inovasi, Global Multi Technology meluncurkan program kemitraan yang dirancang khusus untuk startup fintech. Program ini menawarkan akses ke teknologi, mentoring dari para ahli, dan potensi investasi bagi startup yang memiliki visi sejalan dengan misi kami untuk mentransformasi lanskap keuangan digital.'
      },
  ];

  await prisma.newsItem.createMany({
      data: newsItemsToSeed.map(item => ({
          ...item,
          slug: toSlug(item.title)
      }))
  });

  console.log('Seeding categories and sub-categories...');
  // Clear existing product data
  await prisma.product.deleteMany({});
  await prisma.productSubCategory.deleteMany({});
  await prisma.productCategory.deleteMany({});

  const hardwareCategory = await prisma.productCategory.create({
    data: { 
      name: 'Perangkat Keras',
      description: 'Solusi perangkat keras inovatif untuk perbankan dan layanan keuangan, dirancang untuk keandalan dan efisiensi.',
      imageUrl: 'https://placehold.co/600x400.png'
    },
  });

  const softwareCategory = await prisma.productCategory.create({
    data: { 
      name: 'Perangkat Lunak',
      description: 'Aplikasi dan platform canggih untuk mengoptimalkan operasional, meningkatkan layanan, dan mendorong transformasi digital.',
      imageUrl: 'https://placehold.co/600x400.png'
    },
  });

  const kioskSubCategory = await prisma.productSubCategory.create({
    data: { name: 'Kiosk Digital', categoryId: hardwareCategory.id },
  });

  const queueSubCategory = await prisma.productSubCategory.create({
    data: { name: 'Sistem Antrian', categoryId: hardwareCategory.id },
  });
  
  const displaySubCategory = await prisma.productSubCategory.create({
    data: { name: 'Display Informasi', categoryId: hardwareCategory.id },
  });
  
  const cardPrinterSubCategory = await prisma.productSubCategory.create({
    data: { name: 'Card Printer', categoryId: hardwareCategory.id },
  });

  const ekycSubCategory = await prisma.productSubCategory.create({
    data: { name: 'Solusi e-KYC', categoryId: softwareCategory.id },
  });

  console.log('Categories seeded.');


  console.log('Seeding products...');
  await prisma.product.createMany({
    data: [
      {
        title: 'Digital Kiosk GMT-K1',
        slug: 'digital-kiosk-gmt-k1',
        description: 'Solusi layanan mandiri interaktif untuk perbankan modern. Meningkatkan efisiensi dan pengalaman nasabah.',
        longDescription: 'Digital Kiosk GMT-K1 merupakan terobosan dalam layanan perbankan mandiri. Dirancang dengan desain yang elegan dan futuristik, kiosk ini memungkinkan nasabah untuk melakukan berbagai transaksi tanpa perlu antri di teller, mulai dari pembukaan rekening, transfer, hingga pembayaran tagihan. Dibangun dengan material berkualitas tinggi dan sistem keamanan berlapis, GMT-K1 adalah investasi cerdas untuk modernisasi cabang bank Anda.',
        images: JSON.stringify(['https://placehold.co/800x800.png', 'https://placehold.co/800x800.png']),
        features: JSON.stringify([
          "Layar sentuh 21.5 inci Full HD responsif",
          "Dilengkapi NFC dan QR Code Reader terintegrasi",
          "Desain modular yang kokoh dan mudah perawatannya",
          "Sistem operasi yang aman dan terkunci untuk perbankan"
        ]),
        specifications: JSON.stringify({
          "Ukuran Layar": "21.5 inci",
          "Resolusi": "1920 x 1080 (Full HD)",
          "Tipe Panel": "IPS, 10-point capacitive touch",
          "Prosesor": "Intel Core i5",
          "Memori": "8GB DDR4 RAM",
          "Penyimpanan": "256GB SSD NVMe",
          "Konektivitas": "Wi-Fi, Ethernet, Bluetooth"
        }),
        metaTitle: 'Jual Digital Kiosk GMT-K1 | Solusi Perbankan Modern',
        metaDescription: 'Digital Kiosk GMT-K1 adalah solusi layanan mandiri canggih untuk perbankan, dilengkapi fitur modern untuk meningkatkan efisiensi cabang.',
        tokopediaUrl: '#',
        shopeeUrl: '#',
        subCategoryId: kioskSubCategory.id,
      },
      {
        title: 'SmartQ Queue System',
        slug: 'smartq-queue-system',
        description: 'Sistem antrian cerdas yang mengurangi waktu tunggu dan mengoptimalkan alur layanan pelanggan di cabang.',
        longDescription: 'Tinggalkan sistem antrian konvensional dan beralih ke SmartQ. Solusi manajemen antrian kami tidak hanya mengatur alur nasabah, tetapi juga mengumpulkan data berharga untuk analisis performa layanan. Nasabah dapat mengambil nomor antrian dari jarak jauh melalui aplikasi mobile, memantau status antrian secara real-time, dan mendapatkan estimasi waktu tunggu yang akurat. Ini adalah kunci untuk meningkatkan kepuasan dan loyalitas nasabah.',
        images: JSON.stringify(['https://placehold.co/800x800.png', 'https://placehold.co/800x800.png']),
        features: JSON.stringify([
          "Manajemen antrian multi-layanan dan multi-teller",
          "Tiket antrian virtual via aplikasi mobile atau QR code",
          "Dasbor analitik dan laporan performa layanan real-time",
          "Panggilan suara otomatis dan display digital informatif"
        ]),
        specifications: JSON.stringify({
          "Komponen": "Mesin Tiket, Display Utama, Display Teller, Software Manajemen",
          "Integrasi": "API untuk Aplikasi Mobile, Notifikasi SMS/WhatsApp",
          "Kustomisasi": "Alur layanan, jenis layanan, branding display",
          "Platform": "Berbasis Web, dapat diakses dari mana saja"
        }),
        metaTitle: 'SmartQ Queue System | Sistem Antrian Cerdas',
        metaDescription: 'Kurangi waktu tunggu dan tingkatkan kepuasan nasabah dengan SmartQ, sistem antrian cerdas dari Global Multi Technology.',
        tokopediaUrl: '#',
        shopeeUrl: '#',
        subCategoryId: queueSubCategory.id,
      },
      {
        title: 'ForexRate Display F-32',
        slug: 'forexrate-display-f-32',
        description: 'Tampilan informasi kurs mata uang asing yang akurat, real-time, dan profesional untuk cabang bank Anda.',
        longDescription: 'Sajikan informasi kurs valuta asing dengan cara yang modern dan dapat diandalkan menggunakan ForexRate Display F-32. Dengan layar 32 inci beresolusi tinggi, informasi kurs menjadi jelas terbaca dari berbagai sudut. Sistem kami terhubung langsung ke sumber data terpercaya untuk memastikan kurs selalu up-to-date secara real-time. Konten tambahan seperti video promosi atau berita juga dapat ditampilkan, menjadikannya alat komunikasi yang efektif di dalam cabang.',
        images: JSON.stringify(['https://placehold.co/800x800.png']),
        features: JSON.stringify([
          "Layar 32 inci profesional dengan kecerahan tinggi",
          "Pembaruan kurs otomatis dan real-time dari sumber terpercaya",
          "Tampilan dapat dikustomisasi sepenuhnya dengan logo bank",
          "Manajemen konten terpusat berbasis web yang mudah digunakan"
        ]),
         specifications: JSON.stringify({
          "Ukuran Layar": "32 inci",
          "Resolusi": "1920 x 1080 (Full HD)",
          "Orientasi": "Potrait / Landscape",
          "Fitur Software": "Manajemen playlist, penjadwalan konten, template kurs",
          "Input Data": "API, XML, atau input manual"
        }),
        metaTitle: 'ForexRate Display F-32 | Papan Kurs Digital',
        metaDescription: 'Sajikan informasi kurs mata uang yang akurat dan real-time dengan ForexRate Display F-32. Profesional dan mudah dikelola.',
        tokopediaUrl: '#',
        shopeeUrl: '',
        subCategoryId: displaySubCategory.id,
      },
      {
        title: 'KYC-Flow Engine',
        slug: 'kyc-flow-engine',
        description: 'Platform perangkat lunak untuk otomasi proses Know Your Customer (e-KYC) yang aman dan sesuai regulasi.',
        longDescription: 'KYC-Flow Engine adalah solusi perangkat lunak end-to-end yang memungkinkan lembaga keuangan melakukan proses verifikasi identitas nasabah secara digital. Dengan teknologi pengenalan wajah (face recognition), liveness detection, dan koneksi ke database kependudukan, platform ini memastikan proses onboarding yang cepat, akurat, dan aman, mengurangi risiko penipuan serta mematuhi peraturan yang berlaku.',
        images: JSON.stringify(['https://placehold.co/800x800.png']),
        features: JSON.stringify([
          "Liveness detection untuk mencegah spoofing",
          "Verifikasi KTP dan pengenalan wajah (biometrik)",
          "Dapat diintegrasikan dengan aplikasi mobile atau web",
          "Dasbor monitoring dan audit trail lengkap"
        ]),
        specifications: JSON.stringify({
          "Tipe": "Perangkat Lunak (SaaS/On-premise)",
          "Modul Utama": "Face Recognition, OCR, Liveness Detection",
          "SDK Tersedia": "Android, iOS, Web (JavaScript)",
          "Keamanan": "Enkripsi AES-256"
        }),
        metaTitle: 'KYC-Flow Engine | Platform e-KYC Otomatis',
        metaDescription: 'Otomatiskan proses e-KYC Anda dengan KYC-Flow Engine. Solusi perangkat lunak yang aman, cepat, dan terintegrasi.',
        tokopediaUrl: '',
        shopeeUrl: '#',
        subCategoryId: ekycSubCategory.id,
      },
      {
        title: 'InstantCard Printer P-200',
        slug: 'instantcard-printer-p-200',
        description: 'Cetak kartu ATM, debit, atau kredit secara instan di cabang dengan printer kartu yang andal dan cepat.',
        longDescription: 'InstantCard Printer P-200 memungkinkan bank untuk memberikan kartu kepada nasabah secara langsung saat pembukaan rekening atau penggantian kartu. Ini menghilangkan waktu tunggu pengiriman kartu dan meningkatkan kepuasan nasabah. Dengan kemampuan cetak warna, embossing, dan encoding magnetic stripe/chip, P-200 adalah solusi lengkap untuk penerbitan kartu instan.',
        images: JSON.stringify(['https://placehold.co/800x800.png', 'https://placehold.co/800x800.png']),
        features: JSON.stringify([
          "Cetak satu sisi atau dua sisi (full color/monochrome)",
          "Kemampuan encoding magnetic stripe dan smart chip",
          "Kecepatan cetak tinggi (hingga 180 kartu/jam)",
          "Desain ringkas cocok untuk meja teller"
        ]),
        specifications: JSON.stringify({
          "Resolusi Cetak": "300 dpi",
          "Kapasitas Hopper": "100 kartu",
          "Konektivitas": "USB, Ethernet",
          "Tipe Kartu": "PVC, PET, Composite PVC, 30-40 mil"
        }),
        metaTitle: 'InstantCard Printer P-200 | Mesin Cetak Kartu Instan',
        metaDescription: 'Cetak kartu debit, kredit, atau member secara instan di cabang Anda dengan InstantCard Printer P-200. Cepat, aman, dan andal.',
        tokopediaUrl: '#',
        shopeeUrl: '#',
        subCategoryId: cardPrinterSubCategory.id,
      },
    ]
  });
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
    

    
