

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from '@/components/ui/command';
import { DialogDescription, DialogTitle } from './ui/dialog';

type Product = { id: number; title: string; slug: string };
type SubCategory = { id: number; name: string; products: Product[] };
type Category = { id: number; name: string; subCategories: SubCategory[] };

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
        <DialogTitle className="sr-only">Cari Produk Global</DialogTitle>
        <DialogDescription className="sr-only">Ketik untuk mencari produk di seluruh situs.</DialogDescription>
        <CommandInput placeholder="Ketik nama produk..." />
        <CommandList>
          <CommandEmpty>Produk tidak ditemukan.</CommandEmpty>
            {searchProducts.map((category) => (
              <CommandGroup key={category.id} heading={category.name}>
                  {category.subCategories?.map((subCategory) => (
                    subCategory.products && subCategory.products.length > 0 && (
                        <React.Fragment key={subCategory.id}>
                             <p className="text-xs font-medium text-muted-foreground px-2 pt-2 pb-1">{subCategory.name}</p>
                             {subCategory.products.map((product) => (
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
                        </React.Fragment>
                    )
                  ))}
              </CommandGroup>
            ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
