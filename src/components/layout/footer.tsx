import { getSettings } from '@/lib/settings';
import { FooterClient } from './footer-client';

export async function Footer() {
    const settings = await getSettings();
    
    return <FooterClient settings={settings} />;
}
