import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ClaimBusinessForm from '@/components/ClaimBusinessForm';
import PageHeader from '@/components/PageHeader';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: biz } = await supabase
        .from('business_profiles')
        .select('business_name')
        .eq('id', id)
        .single();

    return {
        title: `Claim ${biz?.business_name || 'Business'} — Marinduque Market Hub`,
        description: `Claim and verify ${biz?.business_name || 'your business'} on Marinduque Market Hub to get a verified badge and reach more customers.`,
    };
}

// Next.js 15: params is a Promise and must be awaited
export default async function ClaimBusinessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: business, error } = await supabase
        .from('business_profiles')
        .select('id, business_name, location, is_verified')
        .eq('id', id)
        .single();

    if (error || !business) {
        notFound();
    }

    // If already verified, show a message instead
    if (business.is_verified) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-900 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-5">
                    <span className="material-symbols-outlined text-5xl text-teal-600" style={{ fontVariationSettings: '"FILL" 1' }}>
                        verified
                    </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Already Verified</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{business.business_name}</span> is already a verified business on Ang Marinduque.
                </p>
                <Link
                    href={`/directory/${business.id}`}
                    className="mt-8 bg-teal-700 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition-all"
                >
                    View Business
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900 pb-24">
            <PageHeader title="Claim Business" subtitle={business.business_name} />

            {/* Content */}
            <div className="max-w-md mx-auto px-4 py-6">
                {/* Info Banner */}
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-2xl p-4 mb-6 flex gap-3">
                    <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 shrink-0 text-xl mt-0.5">info</span>
                    <div>
                        <p className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-0.5">Why claim your business?</p>
                        <p className="text-xs text-teal-700 dark:text-teal-400 leading-relaxed">
                            Verified businesses get a <strong>Verified badge</strong>, allowing customers to trust your listing. Once submitted, an admin will review and approve your request.
                        </p>
                    </div>
                </div>

                <ClaimBusinessForm businessId={business.id} businessName={business.business_name} />
            </div>
        </div>
    );
}
