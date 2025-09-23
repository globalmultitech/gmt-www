
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem,
} from '@/components/ui/command';
import { DialogDescription, DialogTitle } from './ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

type Product = { id: number; title: string; slug: string };
type SubCategory = { id: number; name: string; Product: Product[] };
type Category = { id: number; name: string; ProductSubCategory: SubCategory[] };

interface GlobalSearchProps {
  searchProducts: Category[];
}

export default function GlobalSearch({ searchProducts }: GlobalSearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Cari produk</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Ketik nama produk..." />
        <CommandList>
          <CommandEmpty>Produk tidak ditemukan.</CommandEmpty>
          <Accordion type="multiple" className="w-full">
            {searchProducts.map((category) => (
              <AccordionItem value={`category-${category.id}`} key={category.id}>
                <AccordionTrigger className="px-2 py-2 text-sm font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-90">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4">
                  {category.ProductSubCategory.map((subCategory) => (
<<<<<<< HEAD
                    subCategory.Product.length > 0 && (
=======
                    subCategory.Product && subCategory.Product.length > 0 && (
>>>>>>> cbc88e2afc27f31724ff1c7b5d8002d88d12dd28
                        <div key={subCategory.id}>
                             <p className="text-xs font-medium text-muted-foreground px-2 pt-2 pb-1">{subCategory.name}</p>
                             {subCategory.Product.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.title}
                                    onSelect={() => {
                                    runCommand(() => router.push(`/produk/${product.slug}`));
                                    }}
                                    className="pl-4"
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    <span>{product.title}</span>
                                </CommandItem>
                             ))}
                        </div>
                    )
                  ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CommandList>
      </CommandDialog>
    </>
  );
}
