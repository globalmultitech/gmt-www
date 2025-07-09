import prisma from '@/lib/db';
import UserManagementClientPage from './client-page';

export const dynamic = 'force-dynamic';

export default async function UserManagementPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <UserManagementClientPage users={users} />;
}
