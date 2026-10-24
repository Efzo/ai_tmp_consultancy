"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';

const Navbar = () => {
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
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/process" className="hover:text-white transition-colors">Process</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/book" className="btn-primary hidden px-4 py-2 text-sm md:inline-block">
              Book a Call
            </Link>
            <button type="button" aria-expanded={isOpen} aria-label="Toggle navigation" onClick={() => setIsOpen(!isOpen)} className="rounded-lg border border-glass px-3 py-2 text-white md:hidden">☰</button>
          </div>
        </div>
        {isOpen && <div className="glass-panel mt-2 grid gap-2 p-4 text-sm text-slate-muted md:hidden"><Link onClick={() => setIsOpen(false)} href="/services">Services</Link><Link onClick={() => setIsOpen(false)} href="/case-studies">Case Studies</Link><Link onClick={() => setIsOpen(false)} href="/about">About</Link><Link onClick={() => setIsOpen(false)} href="/process">Process</Link><Link onClick={() => setIsOpen(false)} href="/blog">Blog</Link><Link onClick={() => setIsOpen(false)} href="/book" className="text-cyan-ai">Book a Call →</Link></div>}
      </div>
    </nav>
  );
};

export default Navbar;
