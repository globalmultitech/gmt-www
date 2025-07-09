import { getSettings } from '@/lib/settings';
import { FooterClient } from './footer-client';
import type { SocialMediaLinks } from '@/lib/settings';

export async function Footer() {
    const settings = await getSettings();
    
    const companyName = settings.companyName;
    const footerText = settings.footerText;
    const socialLinksData = (settings.socialMedia as SocialMediaLinks) || {};
    const logoUrl = settings.logoUrl;

    return <FooterClient 
        companyName={companyName} 
        footerText={footerText} 
        socialLinksData={socialLinksData} 
        logoUrl={logoUrl}
    />;
}
