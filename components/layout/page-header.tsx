'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ProductImage } from '@/components/ui/product-image';

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  image,
  label,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  image?: string;
  label?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-maroon-deep py-20 text-cream sm:py-28">
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-deep via-maroon-deep/80 to-maroon-deep/50" />
        </>
      )}
      <div
        className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
        aria-hidden
      />
      <div className="container-luxe relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {breadcrumb && (
            <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-cream/60">
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {b.href ? (
                    <Link href={b.href} className="hover:text-gold">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-gold-light">{b.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </span>
              ))}
            </nav>
          )}
          {label && (
            <span className="section-label text-gold">{label}</span>
          )}
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-base text-cream/75 sm:text-lg">
              {subtitle}
            </p>
          )}
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
