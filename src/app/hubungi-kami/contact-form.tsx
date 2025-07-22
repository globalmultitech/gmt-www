

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WhatsAppIcon } from './whatsapp-icon';
import type { Product } from '@prisma/client';

type ContactFormProps = {
    whatsappNumber: string;
    companyName: string;
    products: Pick<Product, 'title' | 'slug'>[];
}

export default function ContactForm({ whatsappNumber, companyName, products }: ContactFormProps) {
    const [name, setName] = useState('');
    const [clientCompany, setClientCompany] = useState('');
    const [selectedProductSlug, setSelectedProductSlug] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const selectedProduct = products.find(p => p.slug === selectedProductSlug);
        if (!selectedProduct) return;

        const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');
        const productUrl = `${window.location.origin}/produk/${selectedProduct.slug}`;

        let messageBody = 
`Yth. Tim Sales ${companyName},

Saya ${name} dari ${clientCompany} meminta penawaran untuk produk berikut:
${selectedProduct.title} (${productUrl}).

Mohon informasinya. Terima kasih.`;
        
        const encodedMessage = encodeURIComponent(messageBody);
        const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
                <Label htmlFor="name">Nama Anda</Label>
                <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi" 
                    required 
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="clientCompany">Nama Perusahaan</Label>
                <Input 
                    id="clientCompany" 
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="Contoh: PT Sejahtera" 
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="interest">Produk yang diminati</Label>
                <Select onValueChange={setSelectedProductSlug} required value={selectedProductSlug}>
                    <SelectTrigger id="interest">
                        <SelectValue placeholder="Pilih produk..." />
                    </SelectTrigger>
                    <SelectContent>
                        {products.map((product) => (
                            <SelectItem key={product.slug} value={product.slug}>
                                {product.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={!name || !clientCompany || !selectedProductSlug}
                >
                    <WhatsAppIcon className="mr-2 h-5 w-5" />
                    Kirim via WhatsApp
                </Button>
            </div>
        </form>
    );
}
