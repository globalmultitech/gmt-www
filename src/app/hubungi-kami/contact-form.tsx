
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WhatsAppIcon } from './whatsapp-icon';
import type { Product, ProductCategory, ProductSubCategory } from '@prisma/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';


type ProductWithSubCategory = Product & {
    subCategory: ProductSubCategory & {
        category: ProductCategory;
    };
};

type CategoryWithProducts = ProductCategory & {
    subCategories: (ProductSubCategory & {
        products: Product[];
    })[];
};

type ContactFormProps = {
    whatsappNumber: string;
    companyName: string;
    categories: CategoryWithProducts[];
}

export default function ContactForm({ whatsappNumber, companyName, categories }: ContactFormProps) {
    const [name, setName] = useState('');
    const [clientCompany, setClientCompany] = useState('');
    const [selectedProductSlug, setSelectedProductSlug] = useState('');
    
    const [open, setOpen] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let selectedProduct: Product | undefined;
        for (const category of categories) {
            for (const subCategory of category.subCategories) {
                const found = subCategory.products.find(p => p.slug === selectedProductSlug);
                if (found) {
                    selectedProduct = found;
                    break;
                }
            }
            if (selectedProduct) break;
        }

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

    const getProductTitleBySlug = (slug: string) => {
        for (const category of categories) {
            for (const subCategory of category.subCategories) {
                const product = subCategory.products.find(p => p.slug === slug);
                if (product) return product.title;
            }
        }
        return "Pilih produk...";
    }

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
                 <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between font-normal"
                        >
                        <span className="truncate">
                           {selectedProductSlug ? getProductTitleBySlug(selectedProductSlug) : "Pilih produk..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Cari produk..." />
                            <CommandList>
                                <CommandEmpty>Produk tidak ditemukan.</CommandEmpty>
                                {categories.map((category) => (
                                    <CommandGroup key={category.id} heading={category.name}>
                                        {category.subCategories.map((subCategory) => (
                                            <React.Fragment key={subCategory.id}>
                                                {subCategory.products.map((product) => (
                                                    <CommandItem
                                                        key={product.slug}
                                                        value={product.title}
                                                        onSelect={() => {
                                                            setSelectedProductSlug(product.slug);
                                                            setOpen(false);
                                                        }}
                                                        className="pl-8"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedProductSlug === product.slug ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {product.title}
                                                    </CommandItem>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </CommandGroup>
                                ))}
                             </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
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
