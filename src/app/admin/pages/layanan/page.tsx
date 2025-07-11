import { getSettings } from '@/lib/settings';
import LayananPageClientPage from './client-page';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LayananSettingsPage() {
  const settings = await getSettings();

  if (!settings) {
    console.error("Web settings not found! Please seed the database.");
    redirect('/admin/dashboard?error=settings_not_found');
  }

  return <LayananPageClientPage settings={settings} />;
}
