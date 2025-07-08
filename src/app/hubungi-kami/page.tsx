import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export default function HubungiKamiPage() {
  return (
    <>
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Hubungi Kami</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Kami siap membantu. Hubungi kami untuk pertanyaan, permintaan demo, atau dukungan teknis.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            {/* Contact Form */}
            <div className="md:col-span-7 lg:col-span-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-3xl">Kirim Pesan</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nama Belakang</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input id="phone" type="tel" placeholder="+62 812 3456 7890" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="interest">Topik yang diminati</Label>
                      <Select>
                        <SelectTrigger id="interest">
                          <SelectValue placeholder="Pilih topik..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Pertanyaan Penjualan</SelectItem>
                          <SelectItem value="demo">Permintaan Demo Produk</SelectItem>
                          <SelectItem value="support">Dukungan Teknis</SelectItem>
                          <SelectItem value="partnership">Kemitraan</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="message">Pesan Anda</Label>
                      <Textarea id="message" placeholder="Tuliskan pesan Anda di sini..." rows={5} />
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" className="w-full" size="lg">
                        Kirim Pesan
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-5 lg:col-span-4 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-2xl text-primary">Kantor Pusat</h3>
                </div>
                <p className="text-muted-foreground pl-16">
                  Jl. Teknologi Raya No. 123,
                  <br />
                  Jakarta Selatan, Indonesia 12345
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-2xl text-primary">Email</h3>
                </div>
                <p className="text-muted-foreground pl-16">
                    <a href="mailto:sales@gmt.co.id" className="hover:text-accent">sales@gmt.co.id</a>
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-2xl text-primary">Telepon</h3>
                </div>
                <p className="text-muted-foreground pl-16">
                    <a href="tel:+62211234567" className="hover:text-accent">+62 (21) 123 4567</a>
                </p>
              </div>
              <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-md mt-6">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Lokasi Kantor"
                  fill
                  className="object-cover"
                  data-ai-hint="map"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
