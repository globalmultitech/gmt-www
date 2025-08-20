
import { getSettings } from '@/lib/settings';
import TentangKamiClientPage from './tentang-kami-client-page';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.aboutPageTitle} | ${settings.companyName}`;
  const description = settings.aboutPageSubtitle;

  return {
    title,
    description,
  };
}

export default async function TentangKamiPage() {
  const settings = await getSettings();

  return (
    <TentangKamiClientPage settings={settings} />
  );
}
