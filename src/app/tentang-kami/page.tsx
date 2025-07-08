import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Flag, Rocket, Users, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const timeline = [
  { year: '2010', event: 'Global Multi Technology didirikan dengan fokus pada penyediaan perangkat keras perbankan.' },
  { year: '2015', event: 'Memperluas layanan ke pengembangan perangkat lunak kustom dan solusi sistem antrian.' },
  { year: '2018', event: 'Meluncurkan produk Digital Kiosk pertama dan memulai transformasi digital untuk klien.' },
  { year: '2021', event: 'Menjadi mitra strategis bagi 5 bank nasional terbesar di Indonesia.' },
  { year: '2024', event: 'Meraih penghargaan "Best B2B Tech Solution" dan terus berinovasi.' },
];

const teamMembers = [
    { name: 'Budi Santoso', role: 'Chief Executive Officer', image: 'https://placehold.co/400x400.png', aiHint: "professional man portrait" },
    { name: 'Citra Dewi', role: 'Chief Technology Officer', image: 'https://placehold.co/400x400.png', aiHint: "professional woman portrait" },
    { name: 'Agus Wijaya', role: 'Head of Sales', image: 'https://placehold.co/400x400.png', aiHint: " smiling man portrait" },
    { name: 'Rina Kartika', role: 'Head of Product', image: 'https://placehold.co/400x400.png', aiHint: "smiling woman portrait" },
]

export default function TentangKamiPage() {
  return (
    <>
      <section className="relative h-[50vh] bg-primary text-primary-foreground flex items-center justify-center">
        <Image src="https://placehold.co/1920x1080.png" alt="Tim Global Multi Technology" layout="fill" objectFit="cover" className="opacity-20" data-ai-hint="office team working"/>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold">Tentang Kami</h1>
          <p className="mt-4 text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Mendorong Inovasi, Memberdayakan Pertumbuhan.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Rocket className="h-8 w-8 text-accent"/>
                <h2 className="text-3xl font-headline font-bold text-primary">Misi Kami</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Menyediakan solusi teknologi inovatif dan layanan profesional yang andal untuk membantu klien kami bertransformasi secara digital, meningkatkan efisiensi, dan mencapai keunggulan kompetitif.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-accent"/>
                <h2 className="text-3xl font-headline font-bold text-primary">Visi Kami</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Menjadi mitra teknologi terdepan dan terpercaya di Asia Tenggara, yang dikenal karena inovasi, kualitas, dan komitmen kami terhadap kesuksesan pelanggan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Perjalanan Kami</h2>
            <p className="mt-2 text-lg text-muted-foreground">Sejak 2010, kami terus berkembang dan berinovasi.</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 h-full w-0.5 bg-border -translate-x-1/2 hidden md:block"></div>
            {timeline.map((item, index) => (
              <div key={item.year} className="relative mb-8 md:mb-0">
                <div className="md:flex items-center" style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}>
                  <div className="md:w-5/12"></div>
                  <div className="hidden md:flex justify-center w-2/12">
                     <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-secondary"></div>
                  </div>
                  <div className="md:w-5/12">
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-accent text-2xl">{item.year}</CardTitle>
                            <p className="text-muted-foreground">{item.event}</p>
                        </CardHeader>
                     </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Tim Kepemimpinan Kami</h2>
                <p className="mt-2 text-lg text-muted-foreground">Orang-orang di balik kesuksesan Global Multi Technology.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {teamMembers.map(member => (
                    <div key={member.name} className="text-center group">
                        <div className="relative h-40 w-40 md:h-48 md:w-48 mx-auto rounded-full overflow-hidden shadow-lg mb-4 transform transition-transform duration-300 group-hover:scale-105">
                           <Image src={member.image} alt={member.name} layout="fill" objectFit="cover" data-ai-hint={member.aiHint}/>
                        </div>
                        <h3 className="font-headline font-bold text-primary text-xl">{member.name}</h3>
                        <p className="text-accent">{member.role}</p>
                        <Link href="#" className="mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary"/>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  );
}
