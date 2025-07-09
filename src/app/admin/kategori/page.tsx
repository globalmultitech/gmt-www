import CategoryManagementClientPage from './client-page';
import { getCategoriesWithSubcategories } from './actions';

export const dynamic = 'force-dynamic';

export default async function CategoryManagementPage() {
  const categories = await getCategoriesWithSubcategories();

  return <CategoryManagementClientPage categories={categories} />;
}
