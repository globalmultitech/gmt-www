
import prisma from '@/lib/db';
import bcryptjs from 'bcryptjs';

const toSlug = (name: string) => {
  if (!name) return '';
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
        { label: 'Knowledge Center', href: '/resources' },
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
      servicesPageTitle: 'Layanan Profesional Kami',
      servicesPageSubtitle: 'Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda. Temukan bagaimana layanan kami dapat mendukung kesuksesan Anda.',
      servicesPageCommitmentTitle: 'Komitmen Kami Pada Keamanan',
      servicesPageCommitmentText: 'Dalam setiap layanan yang kami berikan, keamanan adalah prioritas utama. Kami menerapkan standar keamanan industri tertinggi untuk melindungi data dan aset berharga Anda, memastikan ketenangan pikiran dalam setiap langkah transformasi digital Anda.',
      servicesPageHeaderImageUrl: 'https://placehold.co/600x400.png',
      
      solutionsPageTitle: 'Solusi Teknologi Unggulan',
      solutionsPageSubtitle: 'Kami menyediakan solusi end-to-end yang dirancang untuk mengatasi tantangan spesifik dalam industri layanan keuangan dan perbankan.',
      
      aboutPageTitle: 'Tentang Global Multi Technology',
      aboutPageSubtitle: 'Mendorong Inovasi, Memberdayakan Pertumbuhan Bisnis Anda.',
      missionTitle: 'Misi Kami', // This field is no longer displayed but we keep it for now
      missionText: 'Menyediakan solusi teknologi inovatif dan layanan profesional yang andal untuk membantu klien kami bertransformasi secara digital, meningkatkan efisiensi, dan mencapai keunggulan kompetitif di era modern.',
      visionTitle: 'Visi Kami', // This field is no longer displayed but we keep it for now
      visionText: 'Menjadi mitra teknologi terdepan dan terpercaya di Asia Tenggara, yang dikenal karena inovasi, kualitas layanan, dan komitmen kami terhadap kesuksesan setiap pelanggan.',
      
      resourcesPageTitle: 'Knowledge Center',
      resourcesPageSubtitle: 'Dapatkan wawasan terbaru dari industri, berita perusahaan, dan artikel mendalam dari para ahli kami.',

      contactPageTitle: 'Hubungi Kami',
      contactPageSubtitle: 'Kami siap membantu. Hubungi kami untuk pertanyaan, permintaan demo, atau dukungan teknis.',
      contactPageMapImageUrl: 'https://placehold.co/600x400.png',
    },
  });
  console.log('Web settings seeded.');

  // The following deleteMany calls are commented out to prevent accidental data loss.
  // Uncomment them only if you need to completely reset this data during seeding.
  /*
  console.log('Clearing old page data...');
  await prisma.professionalService.deleteMany({});
  await prisma.solution.deleteMany({});
  await prisma.partnerLogo.deleteMany({});
  await prisma.customerLogo.deleteMany({});
  await prisma.newsItem.deleteMany({});
  console.log('Old page data cleared.');
  */

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
    

    
