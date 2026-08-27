'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Send,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PINTEREST_ICON = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.608 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

export function SiteFooter() {
  const [email, setEmail] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Welcome to the Sri Harshini circle. Check your inbox.');
    setEmail('');
  };

  return (
    <footer className="relative mt-24 overflow-hidden bg-maroon-deep text-cream">
      {/* decorative top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl"
        aria-hidden
      />

      {/* newsletter */}
      <div className="container-luxe relative border-b border-white/10 py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Sparkles className="mb-3 h-6 w-6 text-gold" />
          <h3 className="font-display text-2xl text-cream sm:text-3xl">
            Join the Sri Harshini Circle
          </h3>
          <p className="mt-2 max-w-xl text-sm text-cream/70">
            Early access to limited editions, private trunk shows and styling
            notes from our atelier.
          </p>
          <form
            onSubmit={subscribe}
            className="mt-6 flex w-full max-w-md items-center gap-2"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="border-white/20 bg-white/10 text-cream placeholder:text-cream/50 focus:border-gold"
            />
            <Button
              type="submit"
              className="btn-gold shrink-0"
              size="lg"
            >
              <Send className="h-4 w-4" /> Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* main */}
      <div className="container-luxe relative grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex flex-col">
            <span className="font-display text-2xl text-gold">
              Sri Harshini
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-cream/60">
              Boutique
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            Tradition woven with elegance. A luxury South Indian boutique
            specialising in bridal silk, maggam work and hand-embroidered
            couture, crafted in Hyderabad since 1998.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Facebook, label: 'Facebook' },
              { Icon: Youtube, label: 'YouTube' },
              { Icon: PINTEREST_ICON, label: 'Pinterest' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream/80 transition-all hover:border-gold hover:bg-gold hover:text-maroon-deep"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            { label: 'Collections', href: '/collections' },
            { label: 'All Products', href: '/products' },
            { label: 'Bridal', href: '/collections/bridal' },
            { label: 'Maggam Work', href: '/collections/maggam-work' },
            { label: 'Limited Edition', href: '/collections/limited-edition' },
            { label: 'Wishlist', href: '/wishlist' },
          ]}
        />
        <FooterCol
          title="Atelier"
          links={[
            { label: 'Tailoring', href: '/tailoring' },
            { label: 'Custom Design', href: '/custom-design' },
            { label: 'Book Appointment', href: '/appointments' },
            { label: 'Track Order', href: '/track-order' },
            { label: 'My Dashboard', href: '/dashboard' },
          ]}
        />
        <FooterCol
          title="House"
          links={[
            { label: 'About Us', href: '/about' },
            { label: 'Gallery', href: '/gallery' },
            { label: 'Blog', href: '/blog' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact', href: '/contact' },
          ]}
        />

        <div className="lg:col-span-1">
          <h4 className="font-display text-lg text-gold">Visit Us</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                No. 24, Banjara Hills Road No. 12,
                <br /> Hyderabad, Telangana 500034
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold" />
              <a href="tel:+919876543210" className="hover:text-gold">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 shrink-0 text-gold" />
              <a
                href="https://wa.me/919876543210"
                className="hover:text-gold"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold" />
              <a href="mailto:hello@scriharshini.com" className="hover:text-gold">
                hello@sriharshini.com
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-cream/50">
            Mon–Sat: 10:30 AM – 8:00 PM
            <br />
            Sunday: By appointment
          </p>
        </div>
      </div>

      {/* policies */}
      <div className="border-t border-white/10 py-6">
        <div className="container-luxe flex flex-col items-center justify-between gap-4 text-center text-xs text-cream/50 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Sri Harshini Boutique. Crafted with care.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-gold">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gold">
              Terms
            </Link>
            <Link href="/refund-policy" className="hover:text-gold">
              Refund
            </Link>
            <Link href="/shipping-policy" className="hover:text-gold">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-lg text-gold">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center text-cream/70 transition-colors hover:text-gold"
            >
              <span className="mr-0 w-0 overflow-hidden text-gold transition-all duration-300 group-hover:mr-2 group-hover:w-3">
                →
              </span>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
