'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

const stats = [
  { label: 'Kantor Pusat', color: 'text-sky-blue', href: 'https://maps.app.goo.gl/ApoZr1QN7tottejP6' },
  { label: '6 Kantor Cabang', color: 'text-cyan-500', dialog: 'branch' },
  { label: '100+ Titik Layanan', color: 'text-red-500', dialog: 'service-points' },
];

const branchOffices = [
    {
        city: 'Medan',
        addressLines: [
            'Jl. Brigjend Katamso',
            'Komplek Istana Prima 2, Blok E No.20-21',
            'Medan 20159, Indonesia'
        ]
    },
    {
        city: 'Bandung',
        addressLines: [
            'Jl. Garuda No. 5A',
            'Bandung 40183',
            'Indonesia'
        ]
    },
    {
        city: 'Semarang',
        addressLines: [
            'Jl. Pusponjolo Tengah 1 No. 25-G',
            'Semarang 50141',
            'Indonesia'
        ]
    },
    {
        city: 'Yogyakarta',
        addressLines: [
            'Jl. Bima No. 164 B',
            'Yogyakarta 55182',
            'Indonesia'
        ]
    },
    {
        city: 'Surabaya',
        addressLines: [
            'Ruko Mega Galaxy Blok 16/C-17',
            'Jl. Kertajaya Indah Timur',
            'Surabaya 60116, Indonesia'
        ]
    },
    {
        city: 'Denpasar',
        addressLines: [
            'Rukan Imam Bonjol Square',
            'Blok A No. 37 – 39, Jl. Imam Bonjol 555',
            'Denpasar 80119, Indonesia'
        ]
    }
];

const servicePointCities = [
    "Jakarta", "Surabaya", "Bandung", "Medan", "Bekasi", "Tangerang", "Depok",
    "Semarang", "Palembang", "Makassar", "Batam", "Pekanbaru", "Bogor", "Bandar Lampung",
    "Padang", "Malang", "Denpasar", "Samarinda", "Yogyakarta", "Banjarmasin", "Pontianak",
    "Manado", "Balikpapan", "Jambi", "Ambon", "Mataram", "Kupang", "Jayapura"
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
          {stats.map((stat, index) => {
            if (stat.dialog) {
              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="bg-white text-foreground hover:bg-white/90 px-4 py-2 rounded-full shadow-md transition-transform hover:scale-105 h-auto">
                       <MapPin className={`h-5 w-5 mr-2 ${stat.color}`} />
                       <span className="font-semibold text-sm">{stat.label}</span>
                    </Button>
                  </DialogTrigger>
                  {stat.dialog === 'branch' ? (
                    <DialogContent className="sm:max-w-[650px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-headline">Lokasi Kantor Cabang Kami</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                        {branchOffices.map((office) => (
                          <div key={office.city}>
                            <h4 className="font-bold text-lg text-primary">{office.city}</h4>
                            <address className="text-sm text-muted-foreground not-italic mt-1">
                              {office.addressLines.map((line, i) => (
                                  <span key={i}>{line}<br/></span>
                              ))}
                            </address>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  ) : (
                     <DialogContent className="sm:max-w-[650px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-headline">Jangkauan Titik Layanan</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                             {servicePointCities.sort().map((city) => (
                                <li key={city} className="text-muted-foreground">{city}</li>
                             ))}
                          </ul>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              )
            }
            
            return (
               <a
                key={index}
                href={stat.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                <MapPin className={`h-5 w-5 ${stat.color}`} />
                <span className="font-semibold text-sm text-foreground">{stat.label}</span>
              </a>
            )
          })}
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
