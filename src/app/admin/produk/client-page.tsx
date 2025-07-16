
'use client';

import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { PlusCircle, Trash2, Loader2, Pencil, Image as ImageIcon } from 'lucide-react';
import type { Product, ProductCategory, ProductSubCategory } from '@prisma/client';
import { deleteProduct } from './actions';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

type ProductWithSubCategory = Product;

type SubCategoryWithProducts = ProductSubCategory & {
  products: ProductWithSubCategory[];
};

type CategoryWithSubCategoriesAndProducts = ProductCategory & {
  subCategories: SubCategoryWithProducts[];
};

function DeleteButton({ productId }: { productId: number }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(productId);
      toast({
        title: result.message.includes('berhasil') ? 'Sukses' : 'Gagal',
        description: result.message,
        variant: result.message.includes('berhasil') ? 'default' : 'destructive',
      });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            {isPending ? <Loader2 className="animate-spin" /> : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function ProductManagementClientPage({ groupedProducts }: { groupedProducts: CategoryWithSubCategoriesAndProducts[] }) {

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Produk</h1>
        <Button asChild>
          <Link href="/admin/produk/tambah">
            <PlusCircle className="mr-2" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {groupedProducts.map(category => (
          <Accordion key={category.id} type="single" collapsible className="w-full bg-card border rounded-lg">
            <AccordionItem value={`category-${category.id}`} className="border-b-0">
              <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                {category.name}
              </AccordionTrigger>
              <AccordionContent className="p-1">
                <div className="mx-4 mb-2 space-y-1">
                  {category.subCategories.map(subCategory => (
                     <Accordion key={subCategory.id} type="single" collapsible className="w-full">
                       <AccordionItem value={`subcategory-${subCategory.id}`} className="border-b-0">
                         <AccordionTrigger className="p-3 text-base font-medium hover:no-underline bg-secondary/50 rounded-md">
                           {subCategory.name}
                         </AccordionTrigger>
                         <AccordionContent className="p-2">
                            {subCategory.products.length > 0 ? (
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead className="w-[80px]">Gambar</TableHead>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Tanggal Dibuat</TableHead>
                                    <TableHead className="text-right w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subCategory.products.map(product => {
                                        const mainImage = (product.images as string[])?.[0];
                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                {mainImage ? (
                                                    <Image src={mainImage} alt={product.title} width={64} height={64} className="rounded-md object-cover bg-muted" />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center">
                                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                                </TableCell>
                                                <TableCell className="font-medium">{product.title}</TableCell>
                                                <TableCell>{format(new Date(product.createdAt), "d MMMM yyyy", { locale: id })}</TableCell>
                                                <TableCell className="text-right">
                                                <Button asChild variant="ghost" size="icon">
                                                    <Link href={`/admin/produk/edit/${product.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteButton productId={product.id} />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center text-muted-foreground p-4">
                                    Belum ada produk di sub-kategori ini.
                                </div>
                            )}
                         </AccordionContent>
                       </AccordionItem>
                     </Accordion>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
