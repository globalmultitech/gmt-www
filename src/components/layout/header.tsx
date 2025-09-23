
import { getSettings } from '@/lib/settings';
import { HeaderClient } from './header-client';
import type { MenuItem } from '@/lib/settings';
import { getGroupedProductsForSearch } from '@/app/produk/actions';

export async function Header() {
  const settings = await getSettings();
  const searchProductsRaw = await getGroupedProductsForSearch();

  const searchProducts = searchProductsRaw.map(category => ({
    id: category.id,
    name: category.name,
    subCategories: category.subCategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      products: sub.products || [] 
    }))
  }));


  const navItems = (settings.menuItems as MenuItem[]) || [];
  const companyName = settings.companyName;
  const logoUrl = settings.logoUrl;
  const whatsappNumber = settings.whatsappSales;

  return <HeaderClient 
    navItems={navItems} 
    companyName={companyName} 
    logoUrl={logoUrl} 
    whatsappNumber={whatsappNumber}
    searchProducts={searchProducts}
  />;
}
