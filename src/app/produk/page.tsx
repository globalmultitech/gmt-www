import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

const products = [
  {
    title: 'Digital Kiosk Seri-A',
    description: 'Kiosk interaktif serbaguna untuk layanan mandiri, pendaftaran, dan pembayaran.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'interactive kiosk',
    features: ['Layar sentuh 21.5" Full HD', 'Printer thermal terintegrasi', 'Scanner QR Code & Barcode', 'Desain modular dan kokoh'],
  },
  {
    title: 'Sistem Antrian Cerdas Q-Flow',
    description: 'Manajemen alur pelanggan yang efisien untuk mengurangi waktu tunggu dan meningkatkan kepuasan.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'queue management',
    features: ['Tiket antrian digital & fisik', 'Panggilan suara multi-bahasa', 'Dashboard analitik real-time', 'Integrasi dengan layar display'],
  },
  {
    title: 'Display Kurs Valas D-Rate',
    description: 'Tampilan informasi kurs mata uang asing yang modern, jelas, dan mudah diperbarui.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'currency exchange board',
    features: ['Layar LED kecerahan tinggi', 'Update kurs via jaringan', 'Desain elegan dan profesional', 'Tampilan multi-mata uang'],
  },
  {
    title: 'Mesin Setor Tunai C-Deposit',
    description: 'Solusi setoran tunai mandiri yang aman dan andal, beroperasi 24/7.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'cash deposit machine',
    features: ['Validasi uang palsu tingkat lanjut', 'Kapasitas besar', 'Notifikasi transaksi instan', 'Standar keamanan perbankan'],
  },
   {
    title: 'Software CRM BankPro',
    description: 'Platform Customer Relationship Management yang dirancang khusus untuk industri perbankan.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'crm software dashboard',
    features: ['Manajemen profil nasabah 360°', 'Pelacakan interaksi', 'Otomatisasi Pemasaran', 'Analitik dan Pelaporan'],
  },
  {
    title: 'Aplikasi Mobile Banking M-Connect',
    description: 'Platform white-label untuk membangun aplikasi mobile banking yang aman dan kaya fitur.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'mobile banking app',
    features: ['Biometric login', 'Transfer dana & pembayaran', 'Fitur QRIS', 'Keamanan berlapis'],
  },
];

export default function ProdukPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Produk Kami</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Jelajahi rangkaian produk perangkat keras dan lunak kami yang dirancang untuk inovasi dan efisiensi.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.title} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-56 w-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    data-ai-hint={product.aiHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{product.title}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h4 className="font-semibold text-primary mb-3">Fitur Utama:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
