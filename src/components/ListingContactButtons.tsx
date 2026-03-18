'use client';

type Props = {
    phone?: string;
    fbUsername?: string;
};

export default function ListingContactButtons({ phone, fbUsername }: Props) {
    const noPhone = () => alert('No phone number listed for this seller.');
    const noMessenger = () => alert('No Messenger listed for this seller.');

    return (
        <div className="flex gap-2">
            {/* Call */}
            {phone ? (
                <a
                    href={`tel:${phone}`}
                    className="flex-1 bg-green-600 text-white font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-sm shadow-green-600/30"
                >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    Call
                </a>
            ) : (
                <button disabled className="flex-1 bg-slate-200 dark:bg-zinc-700 text-slate-400 font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    Call
                </button>
            )}

            {/* SMS */}
            {phone ? (
                <a
                    href={`sms:${phone}`}
                    className="flex-1 bg-slate-800 dark:bg-zinc-600 text-white font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">sms</span>
                    Text
                </a>
            ) : (
                <button disabled className="flex-1 bg-slate-200 dark:bg-zinc-700 text-slate-400 font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <span className="material-symbols-outlined text-[18px]">sms</span>
                    Text
                </button>
            )}

            {/* Messenger */}
            {fbUsername ? (
                <a
                    href={`https://m.me/${fbUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-500 text-white font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/30"
                >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                    </svg>
                    Chat
                </a>
            ) : (
                <button disabled className="flex-1 bg-slate-200 dark:bg-zinc-700 text-slate-400 font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" />
                    </svg>
                    Chat
                </button>
            )}
        </div>
    );
}
