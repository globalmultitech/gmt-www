'use client';

import { useState, useActionState, useEffect, useTransition } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
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

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Loader2, Pencil } from 'lucide-react';
import type { User } from '@prisma/client';
import { createUser, deleteUser, updateUser } from './actions';
import { useFormStatus } from 'react-dom';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan'}
    </Button>
  );
}

function DeleteButton({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUser(userId);
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
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus user secara permanen.
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


export default function UserManagementClientPage({ users }: { users: User[] }) {
  const { toast } = useToast();
  // State for Add User Dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [createState, createFormAction] = useActionState(createUser, undefined);

  // State for Edit User Dialog
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updateState, updateFormAction] = useActionState(updateUser, undefined);

  // Effect for Create User
  useEffect(() => {
    if (createState?.message) {
      const isSuccess = createState.message.includes('berhasil');
      toast({
        title: isSuccess ? 'Sukses' : 'Gagal',
        description: createState.message,
        variant: isSuccess ? 'default' : 'destructive',
      });
      if(isSuccess) {
        setIsAddDialogOpen(false);
      }
    }
  }, [createState, toast]);

  // Effect for Update User
  useEffect(() => {
    if (updateState?.message) {
        const isSuccess = updateState.message.includes('berhasil');
        toast({
            title: isSuccess ? 'Sukses' : 'Gagal',
            description: updateState.message,
            variant: isSuccess ? 'default' : 'destructive',
        });
        if (isSuccess) {
            setEditingUser(null); // Close the dialog on success
        }
    }
  }, [updateState, toast]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen User</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
              <DialogDescription>
                Isi formulir di bawah ini untuk menambahkan akun user baru.
              </DialogDescription>
            </DialogHeader>
            <form action={createFormAction} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input id="password" name="password" type="password" required placeholder="Minimal 6 karakter" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button variant="ghost">Batal</Button>
                </DialogClose>
                <SubmitButton />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

       {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        {editingUser && (
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Ubah detail user. Kosongkan kata sandi jika tidak ingin diubah.
                    </DialogDescription>
                </DialogHeader>
                <form action={updateFormAction} className="space-y-4">
                    <input type="hidden" name="id" value={editingUser.id} />
                    <div className="space-y-1">
                        <Label htmlFor="name-edit">Nama Lengkap</Label>
                        <Input id="name-edit" name="name" defaultValue={editingUser.name} required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email-edit">Email</Label>
                        <Input id="email-edit" name="email" type="email" defaultValue={editingUser.email} required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password-edit">Kata Sandi Baru</Label>
                        <Input id="password-edit" name="password" type="password" placeholder="Minimal 6 karakter" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>Batal</Button>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        )}
      </Dialog>


      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                  Belum ada data user.
                </TableCell>
              </TableRow>
            ) : (
               users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{format(new Date(user.createdAt), "d MMMM yyyy", { locale: id })}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteButton userId={user.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
