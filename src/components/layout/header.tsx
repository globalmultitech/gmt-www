import { getSettings } from '@/lib/settings';
import { HeaderClient } from './header-client';
import type { MenuItem } from '@/lib/settings';

export async function Header() {
  const settings = await getSettings();
  
  const navItems = (settings.menuItems as MenuItem[]) || [];
  const companyName = settings.companyName;

  return <HeaderClient navItems={navItems} companyName={companyName} />;
}
