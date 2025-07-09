import { getWebSettings } from './actions';
import SettingsClientPage from './client-page';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await getWebSettings();

  if (!settings) {
    // This should not happen if seed is run, but as a fallback
    console.error("Web settings not found! Please seed the database.");
    redirect('/admin/dashboard?error=settings_not_found');
  }

  return <SettingsClientPage settings={settings} />;
}
