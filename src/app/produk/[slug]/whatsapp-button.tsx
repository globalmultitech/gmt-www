
'use client';

import type { Product } from '@prisma/client';
import type { WebSettings } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { Smartphone, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type WhatsAppButtonProps = {
    product: Product;
    settings: WebSettings;
};

export default function WhatsAppButton({ product, settings }: WhatsAppButtonProps) {
    const [whatsappLink, setWhatsappLink] = useState('');

    useEffect(() => {
        // This code runs only on the client, after the component has mounted.
        const productUrl = window.location.href;
        const whatsappNumber = settings.whatsappSales.replace(/[^0-9]/g, '');

        let messageBody = `Yth. Tim Sales ${settings.companyName},\n\nSaya tertarik dengan produk berikut:\n- Nama Produk: ${product.title}\n- Tautan Produk: ${productUrl}`;
        
        if (product.image) {
            messageBody += `\n- Gambar: ${product.image}`;
        }

        messageBody += `\n\nSaya ingin meminta informasi lebih lanjut mengenai penawaran dan ketersediaan.\n\nTerima kasih.`;

        const encodedMessage = encodeURIComponent(messageBody);
        setWhatsappLink(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`);
    }, [product, settings]);

    if (!whatsappLink) {
        // Show a disabled button while the link is generated on the client
        return (
             <Button size="lg" disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Minta Penawaran
            </Button>
        );
    }
    
    return (
        <Button asChild size="lg">
            <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Smartphone className="mr-2 h-5 w-5" />
                Minta Penawaran
            </Link>
        </Button>
    );
}
