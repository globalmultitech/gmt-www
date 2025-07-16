
'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';

const stats = [
  { label: 'Kantor Pusat', color: 'text-sky-blue' },
  { label: '6 Kantor Cabang', color: 'text-cyan-500' },
  { label: '100+ Titik Layanan', color: 'text-red-500' },
];

export function HomeMapSection() {
  return (
    <section className="bg-dark-slate py-20 md:py-28">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary">
          Kelancaran Bisnis Anda adalah Prioritas Kami
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Untuk memastikan respon yang cepat tanggap bagi setiap klien, kami didukung oleh Helpdesk 24 Jam dan jaringan layanan di seluruh Indonesia.
        </p>
        
        <div className="flex justify-center items-center gap-4 md:gap-8 my-8 flex-wrap">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <MapPin className={`h-5 w-5 ${stat.color}`} />
              <span className="font-semibold text-sm text-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="relative mt-8 w-full max-w-5xl mx-auto">
          <Image
            src="/indonesia-map.svg"
            alt="Peta Jangkauan Layanan di Indonesia"
            width={1024}
            height={500}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
