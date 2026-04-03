'use client';
import React, { useState } from 'react';
import ContactSection from './ContactSection';
import { filterAllFields } from '@/utils/contentFilter';
import SuccessToast from '@/components/SuccessToast';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { createJob } from '@/app/actions/jobs';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '@/components/PageHeader';

export default function CreateNewJobPostScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fbUsername, setFbUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('Boac');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Casual'>('Full-time');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState(['', '']);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    async function fetchJob() {
      if (!editId) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', editId)
        .single();

      if (data && !error) {
        setTitle(data.title);
        setCompanyName(data.company_name);
        setLocation(data.location);
        setEmploymentType(data.employment_type as any);
        setDescription(data.description);
        setRequirements(data.requirements || ['', '']);

        if (data.contact) {
          setPhone(data.contact.phone || '');
          setEmail(data.contact.email || '');
          setFbUsername(data.contact.fbUsername || '');
          setWebsiteUrl(data.contact.websiteUrl || '');
        }

        // Try to parse salary range back into min/max if possible
        if (data.salary_range) {
          const match = data.salary_range.match(/₱([\d,]+) - ₱([\d,]+)/);
          if (match) {
            setSalaryMin(match[1].replace(/,/g, ''));
            setSalaryMax(match[2].replace(/,/g, ''));
          }
        }
      }
    }
    fetchJob();
  }, [editId]);

  const hasContact = fbUsername.trim() || phone.trim() || email.trim();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setFilterError(null);

    // 1. Content Filter
    const result = filterAllFields({ title, description, companyName });
    if (!result.passed) {
      setFilterError(result.reason ?? 'Content contains prohibited material.');
      return;
    }

    if (!hasContact) return;

    setIsSubmitting(true);

    try {
      const salaryRange = (salaryMin || salaryMax)
        ? `₱${parseFloat(salaryMin).toLocaleString() || '0'} - ₱${parseFloat(salaryMax).toLocaleString() || 'negotiable'}`
        : 'Competitive / Not Specified';

      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

      await createJob({
        title,
        company_name: companyName,
        location,
        employment_type: employmentType,
        salary_range: salaryRange,
        description,
        requirements: requirements.filter(r => r.trim() !== ''),
        contact: {
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          fbUsername: fbUsername.trim() || undefined,
          websiteUrl: websiteUrl.trim() || undefined
        },
        slug,
      }, editId || undefined);

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/jobs');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setFilterError(err.message || 'Something went wrong while posting.');
      setIsSubmitting(false);
    }
  };

  const addRequirement = () => setRequirements([...requirements, '']);
  const updateRequirement = (index: number, val: string) => {
    const next = [...requirements];
    next[index] = val;
    setRequirements(next);
  };


  return (
    <>
      <div>
        <SuccessToast visible={showSuccess} message={editId ? 'Job post updated!' : 'Job posted successfully!'} />
        {/* Header / Navigation */}
        <PageHeader title="Post a Job" subtitle="Employer Listing" />

        {/* Auto-approved notice */}
        <div className="mx-4 mt-4 flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-xs text-green-700 dark:text-green-400">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">check_circle</span>
          <span>Job openings go <strong>live immediately</strong> after passing our content guidelines check.</span>
        </div>

        {/* Filter error */}
        {filterError && (
          <div className="mx-4 mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-400">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">block</span>
            <span><strong>Post blocked:</strong> {filterError}</span>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 pb-24 px-4 pt-6 max-w-lg mx-auto w-full">
          <form onSubmit={handlePost} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Job Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full h-14 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-4 text-base text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-moriones-red/50 focus:ring-1 focus:ring-moriones-red/20 focus:outline-none transition-all" placeholder="e.g. Sales Associate" type="text" />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Company / Establishment Name</label>
              <input value={companyName} onChange={e => setCompanyName(e.target.value)} required className="w-full h-14 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-4 text-base text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-moriones-red/50 focus:ring-1 focus:ring-moriones-red/20 focus:outline-none transition-all" placeholder="e.g. Marinduque Garden Resort" type="text" />
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Job Type</label>
              <div className="flex flex-wrap gap-3">
                {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Casual'].map((type) => (
                  <label key={type} className="cursor-pointer">
                    <input
                      className="peer sr-only"
                      name="job_type"
                      type="radio"
                      checked={employmentType === type}
                      onChange={() => setEmploymentType(type as any)}
                    />
                    <div className="px-5 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-moriones-red peer-checked:bg-moriones-red/10 peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:ring-1 peer-checked:ring-moriones-red">
                      {type}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Salary Range (PHP)</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Min</span>
                  <input value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className="w-full h-14 pl-12 pr-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-moriones-red/50 focus:ring-1 focus:ring-moriones-red/20 focus:outline-none" placeholder="0" type="number" />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Max</span>
                  <input value={salaryMax} onChange={e => setSalaryMax(e.target.value)} className="w-full h-14 pl-12 pr-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-moriones-red/50 focus:ring-1 focus:ring-moriones-red/20 focus:outline-none" placeholder="0" type="number" />
                </div>
              </div>
            </div>

            {/* Town Picker */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Location (Town)</label>
              <div className="relative">
                <select value={location} onChange={e => setLocation(e.target.value)} className="w-full h-14 appearance-none rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-4 text-base text-slate-900 dark:text-slate-100 focus:border-moriones-red/50 focus:ring-1 focus:ring-moriones-red/20 focus:outline-none">
                  <option value="Boac">Boac</option>
                  <option value="Buenavista">Buenavista</option>
                  <option value="Gasan">Gasan</option>
                  <option value="Mogpog">Mogpog</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Torrijos">Torrijos</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full min-h-[140px] resize-none rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-4 text-base text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-moriones-red/50 focus:ring-1 focus:ring-moriones-red/20 focus:outline-none" placeholder="Describe the role, responsibilities, and what you're looking for..." />
            </div>

            {/* Requirements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-slate-900 dark:text-slate-100 text-sm font-semibold">Requirements (Optional)</label>
                <button onClick={addRequirement} className="text-moriones-red text-sm font-medium hover:text-moriones-red/80 flex items-center gap-1" type="button">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> Add more
                </button>
              </div>
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-moriones-red material-symbols-outlined" style={{ fontSize: 20 }}>{req ? 'check_circle' : 'radio_button_unchecked'}</span>
                  <input
                    value={req}
                    onChange={e => updateRequirement(idx, e.target.value)}
                    className="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 focus:border-moriones-red focus:outline-none"
                    placeholder="e.g. Valid Driver's License"
                    type="text"
                  />
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <ContactSection
              fbUsername={fbUsername} setFbUsername={setFbUsername}
              phone={phone} setPhone={setPhone}
              email={email} setEmail={setEmail}
              websiteUrl={websiteUrl} setWebsiteUrl={setWebsiteUrl}
              hint="At least one contact method required — job seekers will reach you here."
              colorClass="text-moriones-red"
            />

            {/* Post Button */}
            <div className="pt-4 pb-8">
              <button
                type="submit"
                disabled={!hasContact || isSubmitting}
                className={`block w-full text-center rounded-xl py-4 text-base font-bold shadow-lg transition-all active:scale-[0.98] ${(hasContact && !isSubmitting)
                  ? 'bg-moriones-red text-white hover:bg-moriones-red/90 shadow-moriones-red/20'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {editId ? 'Saving Changes...' : 'Broadcasting Job Post...'}
                  </div>
                ) : (
                  hasContact ? (editId ? '✓ Save Changes' : '✓ Post Job Opportunity') : 'Add contact info to post'
                )}
              </button>
            </div>
          </form>
        </main>

        {/* Bottom Navigation */}
      </div>

    </>
  );
}
