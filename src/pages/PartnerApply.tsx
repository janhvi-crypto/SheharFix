import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PartnerApply: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    focusAreas: '', // comma separated
    city: '',
    country: '',
    howHelp: '',
    pastImpact: '',
  });

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Organization name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email';
    if (!form.howHelp.trim()) return 'Please describe how you will help';
    return '';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/ngos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          address: [form.address, form.city, form.country].filter(Boolean).join(', '),
          website: form.website || undefined,
          focus_areas: form.focusAreas || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      toast.success('Congratulations! You are family now 🎉');
      // Small celebratory animation using a transient overlay
      const confetti = document.createElement('div');
      confetti.className = 'fixed inset-0 pointer-events-none flex items-center justify-center z-50';
      confetti.innerHTML = `
        <div class="animate-in zoom-in fade-in duration-700 bg-primary/10 rounded-2xl p-6 flex items-center gap-3">
          <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5l-4 4V5a2 2 0 0 1 2-2h11"/></svg>
          <span class="font-semibold">Welcome to the SheharFix partner network!</span>
        </div>`;
      document.body.appendChild(confetti);
      setTimeout(() => {
        confetti.remove();
        navigate('/admin-dashboard');
      }, 1200);
    } catch (e) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Become a SheharFix Partner</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin-dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
          </Button>
        </div>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>Tell us about your NGO and how we can collaborate.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input id="name" value={form.name} onChange={onChange('name')} placeholder="e.g., Green City Trust" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={onChange('email')} placeholder="partner@example.org" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={onChange('phone')} placeholder="+91-90000-00000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={form.website} onChange={onChange('website')} placeholder="https://example.org" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={form.address} onChange={onChange('address')} placeholder="Street, Area" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={onChange('city')} placeholder="Bengaluru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={form.country} onChange={onChange('country')} placeholder="India" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="focus">Focus Areas (comma separated)</Label>
                  <Input id="focus" value={form.focusAreas} onChange={onChange('focusAreas')} placeholder="sanitation, roads, drainage" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="howHelp">How will you help? *</Label>
                <Textarea id="howHelp" value={form.howHelp} onChange={onChange('howHelp')} placeholder="Describe your programs, resources, and how you plan to contribute." className="min-h-[120px]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pastImpact">Past Impact (optional)</Label>
                <Textarea id="pastImpact" value={form.pastImpact} onChange={onChange('pastImpact')} placeholder="Key achievements, partnerships, or case studies." className="min-h-[100px]" />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PartnerApply;
