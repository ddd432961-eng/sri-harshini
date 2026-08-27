'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Ruler, Calendar, Check, Plus, Trash2, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/layout/page-header';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const DRESS_TYPES = ['Blouse', 'Lehenga', 'Saree', 'Kurti', 'Gown', 'Half Saree'];

type MeasurementProfile = {
  id?: string;
  label: string;
  dress_type: string;
  shoulder: string;
  chest: string;
  waist: string;
  hip: string;
  length: string;
  sleeve_length: string;
  neck_depth: string;
  notes: string;
};

const EMPTY: MeasurementProfile = {
  label: '',
  dress_type: 'Blouse',
  shoulder: '',
  chest: '',
  waist: '',
  hip: '',
  length: '',
  sleeve_length: '',
  neck_depth: '',
  notes: '',
};

export default function TailoringPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<MeasurementProfile[]>([EMPTY]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<MeasurementProfile[]>([]);

  const active = profiles[activeIdx];

  const update = (key: keyof MeasurementProfile, value: string) => {
    setProfiles((prev) =>
      prev.map((p, i) => (i === activeIdx ? { ...p, [key]: value } : p)),
    );
  };

  const addProfile = () => {
    setProfiles((prev) => [...prev, { ...EMPTY }]);
    setActiveIdx(profiles.length);
  };

  const removeProfile = (idx: number) => {
    if (profiles.length === 1) return;
    setProfiles((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx(0);
  };

  const save = async () => {
    if (!user) {
      toast.error('Please sign in to save measurements');
      window.location.href = '/login';
      return;
    }
    if (!active.label) {
      toast.error('Please name this measurement profile');
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      user_id: user.id,
      label: active.label,
      dress_type: active.dress_type,
      shoulder: active.shoulder ? Number(active.shoulder) : null,
      chest: active.chest ? Number(active.chest) : null,
      waist: active.waist ? Number(active.waist) : null,
      hip: active.hip ? Number(active.hip) : null,
      length: active.length ? Number(active.length) : null,
      sleeve_length: active.sleeve_length ? Number(active.sleeve_length) : null,
      neck_depth: active.neck_depth ? Number(active.neck_depth) : null,
      notes: active.notes || null,
    };
    const { error } = await supabase.from('measurements').insert(payload);
    setSaving(false);
    if (error) {
      toast.error('Could not save. Please try again.');
      return;
    }
    toast.success(`${active.label} saved to your profiles`);
    setSavedProfiles((prev) => [...prev, active]);
  };

  return (
    <>
      <PageHeader
        label="The Atelier"
        title="Tailoring & Measurements"
        subtitle="Save multiple measurement profiles, book a tailoring slot, and let our master karigars craft pieces made just for you."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tailoring' }]}
        image="https://images.pexels.com/photos/28943543/pexels-photo-28943543.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <div className="container-luxe py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* form */}
          <Reveal>
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-maroon dark:text-gold" />
                  <h2 className="font-serif text-xl font-semibold">
                    Measurement Form
                  </h2>
                </div>
                <Button variant="outline" size="sm" onClick={addProfile}>
                  <Plus className="h-4 w-4" /> New Profile
                </Button>
              </div>

              {/* profile tabs */}
              <div className="mb-6 flex flex-wrap gap-2">
                {profiles.map((p, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveIdx(i)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-sm transition-all',
                        i === activeIdx
                          ? 'bg-maroon text-cream dark:bg-gold dark:text-maroon-deep'
                          : 'bg-muted/50 hover:bg-muted',
                      )}
                    >
                      {p.label || `Profile ${i + 1}`}
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={() => removeProfile(i)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove profile"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-5"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Profile Name *</Label>
                      <Input
                        value={active.label}
                        onChange={(e) => update('label', e.target.value)}
                        placeholder="e.g. My Bridal Blouse"
                      />
                    </div>
                    <div>
                      <Label>Dress Type</Label>
                      <select
                        value={active.dress_type}
                        onChange={(e) => update('dress_type', e.target.value)}
                        className="input-luxe"
                      >
                        {DRESS_TYPES.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ['shoulder', 'Shoulder (in)'],
                      ['chest', 'Chest / Bust (in)'],
                      ['waist', 'Waist (in)'],
                      ['hip', 'Hip (in)'],
                      ['length', 'Length (in)'],
                      ['sleeve_length', 'Sleeve Length (in)'],
                      ['neck_depth', 'Neck Depth (in)'],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <Label>{label}</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={(active as any)[key]}
                          onChange={(e) => update(key as any, e.target.value)}
                          placeholder="0.0"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label>Special Notes</Label>
                    <Textarea
                      value={active.notes}
                      onChange={(e) => update('notes', e.target.value)}
                      placeholder="Any fit preferences, padding, loose fitting, etc."
                      rows={3}
                    />
                  </div>

                  <Button onClick={save} disabled={saving} className="btn-luxe w-full sm:w-auto">
                    <Check className="h-4 w-4" />
                    {saving ? 'Saving…' : 'Save Measurement Profile'}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* sidebar */}
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="glass-card p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-maroon dark:text-gold" />
                  <h3 className="font-serif text-lg font-semibold">
                    Book a Slot
                  </h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Visit our atelier or request a home measurement visit.
                </p>
                <Link href="/appointments" className="btn-outline-luxe mt-4 w-full justify-center">
                  Book Appointment
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="glass-card p-6">
                <div className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-maroon dark:text-gold" />
                  <h3 className="font-serif text-lg font-semibold">
                    How It Works
                  </h3>
                </div>
                <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {[
                    'Save your measurements or book a measurement visit.',
                    'Choose a piece from our catalogue or request custom design.',
                    'Our karigars craft your piece in 3–6 weeks.',
                    'Quality check, pack and ship — or collect from boutique.',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-xs font-semibold text-maroon dark:bg-gold/10 dark:text-gold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            {savedProfiles.length > 0 && (
              <Reveal delay={0.3}>
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-maroon dark:text-gold" />
                    <h3 className="font-serif text-lg font-semibold">
                      Saved Profiles
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {savedProfiles.map((p, i) => (
                      <li key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                        <span className="font-medium">{p.label}</span>
                        <span className="text-xs text-muted-foreground">{p.dress_type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
