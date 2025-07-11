
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
      address: '139 Baker St, E1 7PT, London',
      contactEmail: 'contacts@example.com',
      contactPhone: '(02) 123 333 444',
      openingHours: '8am-5pm Mon - Fri',
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
        { label: 'Blog', href: '/resources' },
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
            icon: 'Users',
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
      ctaHeadline: 'Ready to take your business to the next level?',
      ctaDescription: "Let's discuss how our IT solutions can help you achieve your goals.",
      ctaImageUrl: 'https://placehold.co/1920x1080.png',
      ctaButtonText: 'Get a Quote',
      ctaButtonLink: '/hubungi-kami',
      trustedByText: "Trusted by the world's leading companies",
      trustedByLogos: [
          { src: 'https://placehold.co/200x80.png', alt: 'Client Logo 1' },
          { src: 'https://placehold.co/200x80.png', alt: 'Client Logo 2' },
          { src: 'https://placehold.co/200x80.png', alt: 'Client Logo 3' },
          { src: 'https://placehold.co/200x80.png', alt: 'Client Logo 4' },
          { src: 'https://placehold.co/200x80.png', alt: 'Client Logo 5' },
          { src: 'https://placehold.co/200x80.png', alt: 'Client Logo 6' },
      ],
      testimonials: [
        {
            quote: "We've been using Daltech for a few years now, and we're very happy with the results. They're a great team to work with, and they're always willing to go the extra mile to help us succeed.",
            name: 'John Doe',
            role: 'CEO, Company',
            image: 'https://placehold.co/100x100.png',
            aiHint: 'professional man portrait',
        },
        {
            quote: "The team at Daltech is incredibly talented and passionate about what they do. They took the time to understand our business and our goals, and they delivered a solution that exceeded our expectations.",
            name: 'Jane Smith',
            role: 'CTO, Another Corp',
            image: 'https://placehold.co/100x100.png',
            aiHint: 'professional woman portrait',
        },
      ],
      servicesPageTitle: 'Layanan Profesional Kami',
      servicesPageSubtitle: 'Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda. Temukan bagaimana layanan kami dapat mendukung kesuksesan Anda.',
      servicesPageCommitmentTitle: 'Komitmen Kami Pada Keamanan',
      servicesPageCommitmentText: 'Dalam setiap layanan yang kami berikan, keamanan adalah prioritas utama. Kami menerapkan standar keamanan industri tertinggi untuk melindungi data dan aset berharga Anda, memastikan ketenangan pikiran dalam setiap langkah transformasi digital Anda.',
      servicesPageHeaderImageUrl: 'https://placehold.co/600x400.png',
      
      solutionsPageTitle: 'Solusi Teknologi Unggulan',
      solutionsPageSubtitle: 'Kami menyediakan solusi end-to-end yang dirancang untuk mengatasi tantangan spesifik dalam industri layanan keuangan dan perbankan.',
      
      aboutPageTitle: 'Tentang Global Multi Technology',
      aboutPageSubtitle: 'Mendorong Inovasi, Memberdayakan Pertumbuhan Bisnis Anda.',
      missionTitle: 'Misi Kami',
      missionText: 'Menyediakan solusi teknologi inovatif dan layanan profesional yang andal untuk membantu klien kami bertransformasi secara digital, meningkatkan efisiensi, dan mencapai keunggulan kompetitif di era modern.',
      visionTitle: 'Visi Kami',
      visionText: 'Menjadi mitra teknologi terdepan dan terpercaya di Asia Tenggara, yang dikenal karena inovasi, kualitas layanan, dan komitmen kami terhadap kesuksesan setiap pelanggan.',
      
      resourcesPageTitle: 'Wawasan & Berita',
      resourcesPageSubtitle: 'Dapatkan wawasan terbaru dari industri, berita perusahaan, dan artikel mendalam dari para ahli kami.',
    },
  });
  console.log('Web settings seeded.');

  // Clear existing page-specific data
  await prisma.professionalService.deleteMany({});
  await prisma.solution.deleteMany({});
  await prisma.timelineEvent.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.newsItem.deleteMany({});

  console.log('Seeding Professional Services...');
  await prisma.professionalService.createMany({
    data: [
      {
        icon: 'Headphones',
        title: 'Layanan Purna Jual',
        description: 'Kami memastikan investasi teknologi Anda beroperasi secara optimal dengan dukungan teknis yang responsif dan andal.',
        details: [
          'Dukungan teknis on-site dan remote.',
          'Kontrak pemeliharaan preventif.',
          'Ketersediaan suku cadang asli.',
        ],
      },
      {
        icon: 'Layers',
        title: 'Integrasi Sistem',
        description: 'Hubungkan semua komponen teknologi Anda menjadi satu ekosistem yang solid dan efisien untuk kelancaran alur kerja.',
        details: [
          'Integrasi dengan Core Banking System.',
          'Penyatuan platform hardware dan software.',
          'Pengembangan API kustom.',
        ],
      },
      {
        icon: 'Code2',
        title: 'Pengembangan Perangkat Lunak',
        description: 'Butuh solusi yang tidak tersedia di pasaran? Tim kami siap merancang dan membangun perangkat lunak kustom.',
        details: [
          'Analisis kebutuhan dan desain sistem.',
          'Pengembangan aplikasi web dan mobile.',
          'Jaminan kualitas dan pengujian menyeluruh.',
        ],
      },
      {
        icon: 'Bot',
        title: 'Penyewaan atau Outsourcing',
        description: 'Dapatkan akses ke teknologi terbaru tanpa beban investasi modal yang besar. Fleksibel untuk pertumbuhan bisnis Anda.',
        details: [
          'Opsi sewa perangkat keras (kiosk, dll).',
          'Pengelolaan operasional IT oleh tim kami.',
          'Skalabilitas sesuai kebutuhan.',
        ],
      },
    ]
  });

  console.log('Seeding Solutions...');
  await prisma.solution.createMany({
    data: [
      {
          icon: 'Briefcase',
          title: 'Solusi Transformasi Cabang',
          description: 'Revolusikan cabang konvensional menjadi pusat layanan digital yang efisien dan modern. Kami membantu bank mengurangi biaya operasional sambil meningkatkan kualitas layanan.',
          image: "https://placehold.co/600x400.png",
          aiHint: "modern bank interior",
          keyPoints: [
            'Implementasi Digital Kiosk untuk layanan mandiri.',
            'Sistem Antrian Cerdas untuk mengurangi waktu tunggu.',
            'Peningkatan efisiensi dan produktivitas cabang.',
          ],
      },
      {
          icon: 'Smartphone',
          title: 'Digital Onboarding (e-KYC)',
          description: 'Permudah proses akuisisi nasabah baru dengan solusi pembukaan rekening secara digital, cepat, dan aman, langsung dari smartphone.',
          image: "https://placehold.co/600x400.png",
          aiHint: "person using phone app",
          keyPoints: [
            'Verifikasi identitas dengan pengenalan wajah.',
            'Proses 100% online, tanpa perlu ke cabang.',
            'Sesuai dengan regulasi OJK.',
          ],
      },
      {
          icon: 'ShieldCheck',
          title: 'Deteksi Penipuan Berbasis AI',
          description: 'Lindungi aset dan nasabah Anda dengan sistem deteksi anomali dan penipuan secara real-time yang didukung oleh kecerdasan buatan canggih.',
          image: "https://placehold.co/600x400.png",
          aiHint: "security data analysis",
          keyPoints: [
            'Analisis transaksi mencurigakan secara otomatis.',
            'Mengurangi risiko kerugian akibat fraud.',
            'Model machine learning yang terus belajar.',
          ],
      },
      {
          icon: 'Gem',
          title: 'Platform Wealth Management',
          description: 'Sediakan platform digital yang intuitif bagi nasabah prioritas untuk mengelola investasi dan portofolio mereka dengan mudah dan transparan.',
          image: "https://placehold.co/600x400.png",
          aiHint: "financial dashboard charts",
          keyPoints: [
            'Dasbor portofolio yang komprehensif.',
            'Fitur robo-advisory untuk rekomendasi investasi.',
            'Laporan performa investasi yang mudah dipahami.',
          ],
      }
    ]
  });
  
  console.log('Seeding Timeline Events...');
  await prisma.timelineEvent.createMany({
    data: [
      { year: '2010', event: 'Global Multi Technology didirikan dengan fokus pada penyediaan perangkat keras perbankan.' },
      { year: '2015', event: 'Memperluas layanan ke pengembangan perangkat lunak kustom dan solusi sistem antrian.' },
      { year: '2018', event: 'Meluncurkan solusi Digital Kiosk pertama yang diadopsi oleh bank nasional terkemuka.' },
      { year: '2021', event: 'Meraih penghargaan sebagai Penyedia Solusi Teknologi Perbankan Terbaik.' },
    ]
  });

  console.log('Seeding Team Members...');
  await prisma.teamMember.createMany({
    data: [
      { name: 'Budi Santoso', role: 'Chief Executive Officer', image: 'https://placehold.co/400x400.png', linkedin: '#' },
      { name: 'Citra Dewi', role: 'Chief Technology Officer', image: 'https://placehold.co/400x400.png', linkedin: '#' },
      { name: 'Agus Setiawan', role: 'Head of Sales', image: 'https://placehold.co/400x400.png', linkedin: '#' },
      { name: 'Rina Kartika', role: 'Head of Operations', image: 'https://placehold.co/400x400.png', linkedin: '#' },
    ]
  });

  console.log('Seeding News Items...');
  await prisma.newsItem.createMany({
    data: [
      {
          title: 'GMT Hadiri Pameran Teknologi Finansial Terbesar di Asia',
          category: 'Acara Perusahaan',
          image: 'https://placehold.co/600x400.png',
          aiHint: 'conference technology',
          content: 'Tim Global Multi Technology dengan bangga berpartisipasi dalam pameran teknologi finansial terbesar di Asia, menampilkan inovasi terbaru kami dalam solusi perbankan digital dan keamanan siber. Acara ini menjadi platform penting bagi kami untuk berinteraksi dengan para pemimpin industri dan calon mitra strategis.'
      },
      {
          title: 'Studi Kasus: Bank XYZ Meningkatkan Efisiensi Cabang 40% dengan Kiosk GMT',
          category: 'Studi Kasus',
          image: 'https://placehold.co/600x400.png',
          aiHint: 'bank kiosk customer',
          content: 'Implementasi 50 unit Digital Kiosk GMT-K1 di seluruh cabang Bank XYZ berhasil meningkatkan efisiensi operasional hingga 40%. Waktu antrian nasabah berkurang secara drastis, dan staf cabang dapat lebih fokus pada layanan konsultatif yang bernilai tambah tinggi. Baca selengkapnya tentang keberhasilan transformasi ini.'
      },
      {
          title: 'Prediksi Tren Teknologi Perbankan di Tahun 2025',
          category: 'Analisis Industri',
          image: 'https://placehold.co/600x400.png',
          aiHint: 'futuristic banking',
          content: 'Tahun 2025 akan menjadi era hiper-personalisasi dan perbankan proaktif. Kecerdasan buatan akan memainkan peran sentral dalam menganalisis data nasabah untuk menawarkan produk yang relevan secara real-time. Selain itu, adopsi teknologi blockchain untuk keamanan transaksi diperkirakan akan semakin meluas. Simak analisis lengkap dari para ahli kami.'
      },
       {
          title: 'Webinar: Memanfaatkan AI untuk Mencegah Penipuan Finansial',
          category: 'Webinar',
          image: 'https://placehold.co/600x400.png',
          aiHint: 'AI security analysis',
          content: 'Dalam webinar eksklusif ini, kami membahas bagaimana solusi deteksi penipuan berbasis AI dari GMT dapat membantu lembaga keuangan mengurangi risiko kerugian akibat fraud. Kami mendemonstrasikan kemampuan sistem dalam menganalisis jutaan transaksi secara real-time untuk mendeteksi pola anomali yang mencurigakan.'
      },
      {
          title: 'GMT Meluncurkan Program Kemitraan untuk Startup Fintech',
          category: 'Siaran Pers',
          image: 'https://placehold.co/600x400.png',
          aiHint: 'startup partnership handshake',
          content: 'Sebagai komitmen kami untuk mendorong inovasi, Global Multi Technology meluncurkan program kemitraan yang dirancang khusus untuk startup fintech. Program ini menawarkan akses ke teknologi, mentoring dari para ahli, dan potensi investasi bagi startup yang memiliki visi sejalan dengan misi kami untuk mentransformasi lanskap keuangan digital.'
      },
    ]
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
        images: ['https://placehold.co/800x800.png', 'https://placehold.co/800x800.png'],
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
        tokopediaUrl: '#',
        shopeeUrl: '#',
        subCategoryId: kioskSubCategory.id,
      },
      {
        title: 'SmartQ Queue System',
        slug: 'smartq-queue-system',
        description: 'Sistem antrian cerdas yang mengurangi waktu tunggu dan mengoptimalkan alur layanan pelanggan di cabang.',
        longDescription: 'Tinggalkan sistem antrian konvensional dan beralih ke SmartQ. Solusi manajemen antrian kami tidak hanya mengatur alur nasabah, tetapi juga mengumpulkan data berharga untuk analisis performa layanan. Nasabah dapat mengambil nomor antrian dari jarak jauh melalui aplikasi mobile, memantau status antrian secara real-time, dan mendapatkan estimasi waktu tunggu yang akurat. Ini adalah kunci untuk meningkatkan kepuasan dan loyalitas nasabah.',
        images: ['https://placehold.co/800x800.png', 'https://placehold.co/800x800.png'],
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
        tokopediaUrl: '#',
        shopeeUrl: '#',
        subCategoryId: queueSubCategory.id,
      },
      {
        title: 'ForexRate Display F-32',
        slug: 'forexrate-display-f-32',
        description: 'Tampilan informasi kurs mata uang asing yang akurat, real-time, dan profesional untuk cabang bank Anda.',
        longDescription: 'Sajikan informasi kurs valuta asing dengan cara yang modern dan dapat diandalkan menggunakan ForexRate Display F-32. Dengan layar 32 inci beresolusi tinggi, informasi kurs menjadi jelas terbaca dari berbagai sudut. Sistem kami terhubung langsung ke sumber data terpercaya untuk memastikan kurs selalu up-to-date secara real-time. Konten tambahan seperti video promosi atau berita juga dapat ditampilkan, menjadikannya alat komunikasi yang efektif di dalam cabang.',
        images: ['https://placehold.co/800x800.png'],
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
        tokopediaUrl: '#',
        shopeeUrl: '',
        subCategoryId: displaySubCategory.id,
      },
      {
        title: 'KYC-Flow Engine',
        slug: 'kyc-flow-engine',
        description: 'Platform perangkat lunak untuk otomasi proses Know Your Customer (e-KYC) yang aman dan sesuai regulasi.',
        longDescription: 'KYC-Flow Engine adalah solusi perangkat lunak end-to-end yang memungkinkan lembaga keuangan melakukan proses verifikasi identitas nasabah secara digital. Dengan teknologi pengenalan wajah (face recognition), liveness detection, dan koneksi ke database kependudukan, platform ini memastikan proses onboarding yang cepat, akurat, dan aman, mengurangi risiko penipuan serta mematuhi peraturan yang berlaku.',
        images: ['https://placehold.co/800x800.png'],
        features: [
          "Liveness detection untuk mencegah spoofing",
          "Verifikasi KTP dan pengenalan wajah (biometrik)",
          "Dapat diintegrasikan dengan aplikasi mobile atau web",
          "Dasbor monitoring dan audit trail lengkap"
        ],
        specifications: {
          "Tipe": "Perangkat Lunak (SaaS/On-premise)",
          "Modul Utama": "Face Recognition, OCR, Liveness Detection",
          "SDK Tersedia": "Android, iOS, Web (JavaScript)",
          "Keamanan": "Enkripsi AES-256"
        },
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
        images: ['https://placehold.co/800x800.png', 'https://placehold.co/800x800.png'],
        features: [
          "Cetak satu sisi atau dua sisi (full color/monochrome)",
          "Kemampuan encoding magnetic stripe dan smart chip",
          "Kecepatan cetak tinggi (hingga 180 kartu/jam)",
          "Desain ringkas cocok untuk meja teller"
        ],
        specifications: {
          "Resolusi Cetak": "300 dpi",
          "Kapasitas Hopper": "100 kartu",
          "Konektivitas": "USB, Ethernet",
          "Tipe Kartu": "PVC, PET, Composite PVC, 30-40 mil"
        },
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

    