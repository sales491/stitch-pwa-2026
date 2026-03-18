'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './AuthProvider';
import BarangayPicker from '@/components/BarangayPicker';

const TOWNS = ['Boac', 'Buenavista', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos'];

type ToastType = 'success' | 'error';

function Toast({ message, type, onDone }: { message: string; type: ToastType; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold animate-in slide-in-from-bottom-4 duration-300 ${type === 'success'
          ? 'bg-emerald-500 text-white'
          : 'bg-red-500 text-white'
        }`}
    >
      <span className="material-symbols-outlined text-[18px]">
        {type === 'success' ? 'check_circle' : 'error'}
      </span>
      {message}
    </div>
  );
}

export default function UserProfileDashboard2() {
  const router = useRouter();
  const { profile } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [town, setTown] = useState('');
  const [barangay, setBarangay] = useState('');
  const [messenger, setMessenger] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Fetch full profile on mount
  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, location, barangay, avatar_url, phone, notification_preferences')
        .eq('id', profile.id)
        .single();

      if (data) {
        setFullName(data.full_name || '');
        setTown(data.location || '');
        setBarangay(data.barangay || '');
        setAvatarUrl(data.avatar_url || '');
        setPhone(data.phone || '');
        const prefs = data.notification_preferences || {};
        setMessenger(prefs.messenger || '');
        setWhatsapp(prefs.whatsapp || '');
        setEmail(prefs.email || '');
      }
      setIsLoading(false);
    };
    load();
  }, [profile?.id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !profile?.id) return null;
    const ext = avatarFile.name.split('.').pop();
    const path = `avatars/${profile.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('listings').upload(path, avatarFile, { upsert: true });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(path);
    return publicUrl;
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    if (!fullName.trim()) {
      setToast({ message: 'Please enter your full name.', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) newAvatarUrl = uploadedUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          location: town,
          barangay: barangay.trim() || null,
          avatar_url: newAvatarUrl,
          phone: phone.trim(),
          notification_preferences: { messenger, whatsapp, email },
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      setToast({ message: 'Profile updated!', type: 'success' });
      // Navigate back after a short pause so the user sees the toast
      setTimeout(() => router.back(), 1400);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save profile.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const displayAvatar = avatarPreview || avatarUrl;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-moriones-red text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-900 dark:text-white transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">Edit Profile</h2>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-teal-600 dark:text-teal-400 font-semibold text-sm hover:opacity-80 transition-opacity disabled:opacity-40 flex items-center gap-1"
          >
            {isSaving ? (
              <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
            ) : (
              'Save'
            )}
          </button>
        </div>

        <form
          className="max-w-md mx-auto w-full px-4 pt-6 space-y-6 pb-32"
          onSubmit={(e) => { e.preventDefault(); handleSave(); }}
        >
          {/* Avatar Picker */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-32 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800 bg-cover bg-center border-4 border-white dark:border-neutral-700 shadow-md flex items-center justify-center overflow-hidden">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="material-symbols-outlined text-neutral-400 text-[48px]" style={{ fontVariationSettings: '"FILL" 1' }}>account_circle</span>
                )}
              </div>
              <div className="absolute bottom-1 right-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-2 rounded-full border-2 border-white dark:border-neutral-800 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[18px] leading-none">photo_camera</span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 font-medium">Tap to change profile picture</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[18px]">badge</span>
              Basic Info
            </h3>
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
              <div className="border-b border-neutral-100 dark:border-neutral-700">
                <label className="block px-4 pt-3 pb-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400" htmlFor="fullName">Full Name *</label>
                <input
                  className="w-full px-4 pb-3 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 sm:text-sm font-medium"
                  id="fullName"
                  placeholder="e.g. Juan dela Cruz"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block px-4 pt-3 pb-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400" htmlFor="town">Home Town</label>
                <select
                  value={town}
                  onChange={(e) => { setTown(e.target.value); setBarangay(''); }}
                  className="w-full px-4 pb-3 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white focus:ring-0 sm:text-sm font-medium appearance-none"
                  id="town"
                >
                  <option value="">Select your town</option>
                  {TOWNS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Barangay in its own card — overflow-visible so dropdown isn't clipped */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <label className="block px-4 pt-3 pb-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400" htmlFor="barangay">
                Barangay <span className="font-normal text-neutral-400">(optional)</span>
              </label>
              <BarangayPicker
                id="barangay"
                value={barangay}
                onChange={setBarangay}
                municipality={town}
                accentColor="teal"
                inputClassName="w-full px-4 pb-3 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Contact Methods */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[18px]">contact_phone</span>
                Contact Methods
              </h3>
              <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full font-medium">Pick at least one</span>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700">
              <div className="flex items-center px-4 py-1">
                <div className="flex-shrink-0 w-8 flex justify-center">
                  <span className="material-symbols-outlined text-blue-500">chat</span>
                </div>
                <div className="flex-grow">
                  <label className="block pt-2 text-[10px] font-semibold text-neutral-400" htmlFor="messenger">FB Messenger Link</label>
                  <input
                    className="w-full pb-2 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 text-sm"
                    id="messenger"
                    placeholder="m.me/username"
                    type="text"
                    value={messenger}
                    onChange={(e) => setMessenger(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center px-4 py-1">
                <div className="flex-shrink-0 w-8 flex justify-center">
                  <span className="material-symbols-outlined text-green-600">call</span>
                </div>
                <div className="flex-grow">
                  <label className="block pt-2 text-[10px] font-semibold text-neutral-400" htmlFor="phone">Phone Number</label>
                  <input
                    className="w-full pb-2 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 text-sm"
                    id="phone"
                    placeholder="09XX XXX XXXX"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center px-4 py-1">
                <div className="flex-shrink-0 w-8 flex justify-center">
                  <span className="material-symbols-outlined text-green-500">chat_bubble</span>
                </div>
                <div className="flex-grow">
                  <label className="block pt-2 text-[10px] font-semibold text-neutral-400" htmlFor="whatsapp">WhatsApp</label>
                  <input
                    className="w-full pb-2 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 text-sm"
                    id="whatsapp"
                    placeholder="+63 9XX XXX XXXX"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center px-4 py-1">
                <div className="flex-shrink-0 w-8 flex justify-center">
                  <span className="material-symbols-outlined text-red-500">mail</span>
                </div>
                <div className="flex-grow">
                  <label className="block pt-2 text-[10px] font-semibold text-neutral-400" htmlFor="email">Email Address</label>
                  <input
                    className="w-full pb-2 pt-0 border-0 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 focus:ring-0 text-sm"
                    id="email"
                    placeholder="juan@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-neutral-400 px-2 leading-relaxed">
              Your contact details will only be visible to verified members when you inquire about a listing.
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-2 pb-8">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary hover:bg-yellow-500 text-neutral-900 font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  Saving...
                </>
              ) : (
                <>
                  <span>Save Profile</span>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </>
  );
}
