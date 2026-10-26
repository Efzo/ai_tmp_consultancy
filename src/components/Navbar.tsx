"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import type { NavigationItem } from '@/lib/site-settings';

const defaultItems: NavigationItem[] = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/case-studies" },
  { label: "Engagements", href: "/engagements" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/blog" },
  { label: "Videos", href: "/videos" },
  { label: "Contact", href: "/contact" },
];

const Navbar = ({ items = defaultItems }: { items?: NavigationItem[] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-panel px-6 py-3 flex items-center justify-between">
          <Link href="/" aria-label="Efosa Ojomo home" className="flex items-center gap-3 text-xl font-bold tracking-tighter hover:text-electric transition-colors">
            <Image src="/logo_pack/logo.png" alt="Efosa Ojomo logo" width={38} height={38} priority className="h-9 w-9 rounded-lg object-cover" />
            <span>Efosa <span className="text-electric">Ojomo</span></span>
          </Link>
          
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-muted md:flex">
            {items.map((item) => <Link key={`${item.label}-${item.href}`} href={item.href} className="hover:text-white transition-colors">{item.label}</Link>)}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/book" className="btn-primary hidden px-4 py-2 text-sm md:inline-block">
              Book a Call
            </Link>
            <button type="button" aria-expanded={isOpen} aria-label="Toggle navigation" onClick={() => setIsOpen(!isOpen)} className="rounded-lg border border-glass px-3 py-2 text-white md:hidden">☰</button>
          </div>
        </div>
        {isOpen && <div className="glass-panel mt-2 grid gap-2 p-4 text-sm text-slate-muted md:hidden">{items.map((item) => <Link key={`${item.label}-${item.href}`} onClick={() => setIsOpen(false)} href={item.href}>{item.label}</Link>)}<Link onClick={() => setIsOpen(false)} href="/book" className="text-cyan-ai">Book a Call →</Link></div>}
      </div>
    </nav>
  );
};

export default Navbar;
