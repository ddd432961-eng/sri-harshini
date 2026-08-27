'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useStore } from '@/components/providers/store-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const NAV = [
  { label: 'Home', href: '/' },
  {
    label: 'Collections',
    href: '/collections',
    children: [
      { label: 'Bridal', href: '/collections/bridal' },
      { label: 'Wedding', href: '/collections/wedding' },
      { label: 'Reception', href: '/collections/reception' },
      { label: 'Half Saree', href: '/collections/half-saree' },
      { label: 'Designer', href: '/collections/designer' },
      { label: 'Traditional', href: '/collections/traditional' },
      { label: 'Temple', href: '/collections/temple' },
      { label: 'Party Wear', href: '/collections/party-wear' },
      { label: 'Festival', href: '/collections/festival' },
      { label: 'Kids', href: '/collections/kids' },
      { label: 'Maggam Work', href: '/collections/maggam-work' },
      { label: 'Embroidery', href: '/collections/embroidery' },
      { label: 'Limited Edition', href: '/collections/limited-edition' },
    ],
  },
  { label: 'Products', href: '/products' },
  {
    label: 'Atelier',
    href: '/tailoring',
    children: [
      { label: 'Tailoring & Measurement', href: '/tailoring' },
      { label: 'Custom Design', href: '/custom-design' },
      { label: 'Book Appointment', href: '/appointments' },
    ],
  },
  {
    label: 'Discover',
    href: '/gallery',
    children: [
      { label: 'Photo Gallery', href: '/gallery' },
      { label: 'Video Gallery', href: '/video-gallery' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { cartCount, wishlist } = useStore();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(null);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* announcement bar */}
      <div className="relative z-40 overflow-hidden bg-gradient-to-r from-maroon-deep via-maroon to-maroon-deep text-cream">
        <div className="flex whitespace-nowrap py-2 text-[11px] font-medium uppercase tracking-[0.25em]">
          <div className="flex animate-marquee items-center gap-12 pr-12">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex items-center gap-12">
                <span>Free shipping across South India</span>
                <span className="text-gold-light">•</span>
                <span>Bridal trials by appointment</span>
                <span className="text-gold-light">•</span>
                <span>Handcrafted in Hyderabad</span>
                <span className="text-gold-light">•</span>
                <span>Custom maggam work in 21 days</span>
                <span className="text-gold-light">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-500',
          scrolled
            ? 'bg-background/85 shadow-luxe backdrop-blur-xl'
            : 'bg-background/40 backdrop-blur-md',
        )}
        onMouseLeave={() => setMegaOpen(null)}
      >
        <div className="container-luxe flex h-20 items-center justify-between gap-4">
          {/* mobile menu btn */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* logo */}
          <Link
            href="/"
            className="group flex flex-col items-center leading-none"
          >
            <span className="font-display text-xl font-semibold tracking-wide text-maroon dark:text-gold sm:text-2xl">
              Sri Harshini
            </span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.35em] text-gold-deep dark:text-gold/80">
              Boutique
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <div
                key={item.href}
                onMouseEnter={() => setMegaOpen(item.children ? item.label : null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'relative px-3 py-2 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors',
                    isActive(item.href)
                      ? 'text-maroon dark:text-gold'
                      : 'text-foreground/75 hover:text-maroon dark:hover:text-gold',
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-maroon to-gold dark:from-gold dark:to-gold-light"
                    />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2.5 text-foreground/80 transition-all hover:bg-maroon/10 hover:text-maroon dark:hover:bg-gold/10 dark:hover:text-gold"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full p-2.5 text-foreground/80 transition-all hover:bg-maroon/10 hover:text-maroon dark:hover:bg-gold/10 dark:hover:text-gold"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <Link
              href="/wishlist"
              className="relative rounded-full p-2.5 text-foreground/80 transition-all hover:bg-maroon/10 hover:text-maroon dark:hover:bg-gold/10 dark:hover:text-gold"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-maroon-deep">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href={user ? '/dashboard' : '/login'}
              className="rounded-full p-2.5 text-foreground/80 transition-all hover:bg-maroon/10 hover:text-maroon dark:hover:bg-gold/10 dark:hover:text-gold"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className="relative rounded-full p-2.5 text-foreground/80 transition-all hover:bg-maroon/10 hover:text-maroon dark:hover:bg-gold/10 dark:hover:text-gold"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-bold text-cream">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 top-full hidden border-t border-border/60 bg-background/95 backdrop-blur-xl lg:block"
            >
              <div className="container-luxe py-8">
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                  {NAV.find((n) => n.label === megaOpen)?.children?.map(
                    (child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="group/mega flex flex-col gap-1 rounded-xl p-3 transition-colors hover:bg-maroon/5 dark:hover:bg-gold/5"
                      >
                        <span className="text-sm font-medium text-foreground transition-colors group-hover/mega:text-maroon dark:group-hover/mega:text-gold">
                          {child.label}
                        </span>
                        <span className="h-px w-0 bg-gradient-to-r from-maroon to-gold transition-all duration-300 group-hover/mega:w-full" />
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay onClose={() => setSearchOpen(false)} />
        )}
      </AnimatePresence>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileNav onClose={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const suggestions = [
    'Bridal Silk Saree',
    'Maggam Work Blouse',
    'Designer Lehenga',
    'Festival Saree',
    'Kids Lehenga',
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-maroon-deep/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="mt-24 w-full max-w-2xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-card p-6 shadow-luxe-lg">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Search className="h-5 w-5 text-gold-deep" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees, lehengas, blouses…"
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && q.trim()) {
                  window.location.href = `/products?q=${encodeURIComponent(q)}`;
                }
              }}
            />
            <button onClick={onClose} aria-label="Close search">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">
            <p className="section-label mb-3">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Link
                  key={s}
                  href={`/products?q=${encodeURIComponent(s)}`}
                  className="rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm transition-all hover:border-maroon hover:text-maroon dark:hover:border-gold dark:hover:text-gold"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MobileNav({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] lg:hidden"
    >
      <div
        className="absolute inset-0 bg-maroon-deep/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-background shadow-luxe-lg"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <span className="font-display text-lg text-maroon dark:text-gold">
              Menu
            </span>
          </div>
          <button onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          {NAV.map((item) => (
            <div key={item.href}>
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  className="flex-1 rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-wide text-foreground hover:bg-maroon/5 dark:hover:bg-gold/5"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <button
                    onClick={() =>
                      setExpanded(expanded === item.label ? null : item.label)
                    }
                    className="p-2"
                    aria-label="Expand"
                  >
                    <span
                      className={cn(
                        'block h-2 w-2 border-b-2 border-r-2 border-gold transition-transform',
                        expanded === item.label ? 'rotate-45' : '-rotate-45',
                      )}
                    />
                  </button>
                )}
              </div>
              {item.children && expanded === item.label && (
                <div className="ml-3 border-l border-border pl-3">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-maroon dark:hover:text-gold"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </motion.div>
    </motion.div>
  );
}
