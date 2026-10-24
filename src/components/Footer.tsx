import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FooterSettings } from '@/lib/site-settings';

const Footer = ({ settings }: { settings?: FooterSettings }) => {
  const footerSettings = settings ?? {
    linkedinUrl: 'https://linkedin.com/in/efosa-o-4882a015a/',
    articlesUrl: '/blog',
    allServicesUrl: '/services',
    aiStrategyUrl: '/services/ai-strategy',
    fractionalTpmUrl: '/services/fractional-tpm',
    aiArchitectureUrl: '/services/solution-architecture',
    aboutUrl: '/about',
    processUrl: '/process',
    caseStudiesUrl: '/case-studies',
    contactUrl: '/contact',
    privacyUrl: '/privacy',
    termsUrl: '/terms',
  } satisfies FooterSettings;
  return (
    <footer className="bg-midnight border-t border-glass pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" aria-label="Efosa Ojomo home" className="mb-6 flex items-center gap-3 text-2xl font-bold tracking-tighter">
              <Image src="/logo_pack/logo.png" alt="Efosa Ojomo logo" width={44} height={44} className="h-11 w-11 rounded-xl object-cover" />
              <span>Efosa <span className="text-electric">Ojomo</span></span>
            </Link>
            <p className="text-slate-muted max-w-sm mb-6">
              AI Product Strategy. Technical Leadership. Real Business Outcomes. 
              Helping organizations move from AI ideas to validated product strategies.
            </p>
            <div className="flex gap-4 text-slate-muted">
              <a href={footerSettings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-electric transition-colors">
                LinkedIn
              </a>
              <Link href={footerSettings.articlesUrl} className="hover:text-electric transition-colors">
                Articles
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Services</h4>
            <ul className="space-y-4 text-slate-muted text-sm">
              <li><Link href={footerSettings.allServicesUrl} className="hover:text-white transition-colors">All Services</Link></li>
              <li><Link href={footerSettings.aiStrategyUrl} className="hover:text-white transition-colors">AI Strategy</Link></li>
              <li><Link href={footerSettings.fractionalTpmUrl} className="hover:text-white transition-colors">Fractional TPM</Link></li>
              <li><Link href={footerSettings.aiArchitectureUrl} className="hover:text-white transition-colors">AI Architecture</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-slate-muted text-sm">
              <li><Link href={footerSettings.aboutUrl} className="hover:text-white transition-colors">About</Link></li>
              <li><Link href={footerSettings.processUrl} className="hover:text-white transition-colors">How We Work</Link></li>
              <li><Link href={footerSettings.caseStudiesUrl} className="hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link href={footerSettings.contactUrl} className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-glass pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-muted">
          <p>&copy; {new Date().getFullYear()} Efosa Ojomo. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href={footerSettings.privacyUrl} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href={footerSettings.termsUrl} className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
