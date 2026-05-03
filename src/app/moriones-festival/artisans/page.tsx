import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { hreflangAlternates } from '@/utils/seo';

export const metadata: Metadata = {
    title: 'Moryon Artisan Directory — Meet the Mask Makers of Marinduque',
    description: 'A comprehensive directory of master Morion carvers and artisans in Mogpog and Boac. Explore the unique styles, traditional techniques, and sustainable carving initiatives.',
    keywords: ['Moryon artisans', 'Marinduque mask makers', 'Mogpog masks', 'Boac masks', 'Buddy Liwanagan', 'Eric Morales', 'Edgardo Santiago', 'Damaso Palmero', 'mask carving Marinduque', 'Moriones craftsmanship'],
    openGraph: {
        title: 'Moryon Artisan Directory — Marinduque Market Hub',
        description: 'Meet the master carvers behind the world-famous Moriones masks.',
        url: 'https://marinduquemarket.com/moriones-festival/artisans',
        type: 'article',
    },
    alternates: hreflangAlternates('/moriones-festival/artisans'),
};

const DATA = {
  "province": "Marinduque",
  "subject": "Moryon Artisan Directory",
  "categories": [
    {
      "region": "Mogpog",
      "style_description": "Known for the 'Bulaklakan' (floral) headgear and 'smiling' or human-like facial expressions.",
      "color": "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
      "artisans": [
        {
          "name": "Salvador 'Buddy' Liwanagan",
          "title": "Master Carver",
          "specialty": "Custom high-end masks, celebrity likenesses, and intricate realism.",
        },
        {
          "name": "Eric Morales",
          "location": "Barangay Sibukaw",
          "specialty": "Legacy Roman centurion armor and mask sets; son of Renato 'Atong' Morales.",
        },
        {
          "name": "Dick Malapote",
          "location": "Barangay Janagdong",
          "specialty": "Traditional 'fierce' smiling masks using Dapdap wood and lacquer layering.",
        },
        {
          "name": "Gilbert Monsanto",
          "specialty": "Contemporary and traditional fusion; global exhibition artist.",
        },
        {
          "name": "James Liwanagan",
          "specialty": "Green TVET sustainable carving and modern artisan leadership.",
        },
        {
          "name": "Alexander Luna",
          "location": "Barangay Nangka 1",
          "specialty": "Traditional smiling masks; one of the oldest active practitioners.",
        },
        {
          "name": "Jhun Mazon",
          "location": "Barangay Capayang",
          "specialty": "High-volume, high-quality traditional mask production.",
        }
      ]
    },
    {
      "region": "Boac",
      "style_description": "Known for the 'fierce' frowning Roman soldier aesthetic with plumed helmets.",
      "color": "text-moriones-red bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",
      "heritage_note": "Boac is the home of the KMMK collective. While legacy figures like Ka Oti defined the style, today the craft is carried by hundreds of practitioners as a personal 'panata' (vow).",
      "artisans": [
        {
          "name": "Jose 'Ka Oti' Manay",
          "status": "Legacy Master",
          "specialty": "The 'Dean' of Boac carvers; defined the fierce, bearded Roman aesthetic."
        }
      ]
    },
    {
      "region": "Gasan",
      "style_description": "A blend of traditional and creative modernism; home to the 'Giant Morion' (Higante) tradition.",
      "color": "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800",
      "artisans": [
        {
          "name": "Edgardo Santiago",
          "title": "Traditional Artisan",
          "specialty": "Gasan-style Roman masks and authentic wooden craftsmanship."
        }
      ]
    },
    {
      "region": "Torrijos",
      "style_description": "Eastern style focusing on durability and local santol wood carving.",
      "color": "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800",
      "artisans": [
        {
          "name": "Damaso 'Ka Dasoy' Palmero",
          "status": "Master Carver",
          "specialty": "Traditional Eastern Marinduque masks; veteran festival practitioner."
        }
      ]
    }
  ],
  "organizations": [
    {
      "name": "MISTAH",
      "full_name": "Morion Itong Sarili nating Tradisyon at Atin",
      "role": "Artisan collective and Morion association."
    },
    {
      "name": "KMMK",
      "full_name": "Kapatirang Moryon ng Marinduque",
      "role": "Boac-based fraternity of mask makers and practitioners."
    }
  ],
  "technical_specs": {
    "materials": ["Dapdap Wood (lightweight)", "Santol Wood (durable)", "Japanese Paper", "Abaca", "Horse hair"],
    "economic_cycle": "November to April (Lenten Peak)",
    "sustainability": "Transitioning to Green TVET (reclaimed wood and non-toxic finishes)."
  }
};

export default function ArtisanDirectoryPage() {
    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pb-24 font-sans">
            <PageHeader title="Moryon Artisan Directory" subtitle="The Masters Behind the Masks" />

            <main className="max-w-4xl mx-auto px-6 py-12">
                
                {/* Intro Section */}
                <header className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95] mb-6">
                        Meet the <span className="text-moriones-red italic">Architects</span> of Our Tradition.
                    </h2>
                    <p className="text-slate-600 dark:text-zinc-400 text-lg leading-relaxed font-medium max-w-2xl">
                        Behind every Morion is a master carver. This directory showcases the artisans who transform wood and tradition into the iconic symbols of Marinduque's Holy Week.
                    </p>
                </header>

                {/* Style Comparison Card */}
                <section className="mb-20">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-[2.5rem] p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <h3 className="text-xl font-black text-blue-900 dark:text-blue-300 tracking-tight uppercase">Mogpog Style</h3>
                            </div>
                            <p className="text-blue-800/70 dark:text-blue-400 text-sm font-bold leading-tight mb-4">Friendly, smiling, human-like expressions with 'Bulaklakan' floral headgear.</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 px-2.5 py-1 rounded-lg">Softwood</span>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 px-2.5 py-1 rounded-lg">Intricate Realism</span>
                            </div>
                        </div>
                        <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[2.5rem] p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-3 h-3 rounded-full bg-moriones-red shadow-[0_0_10px_rgba(185,28,28,0.5)]" />
                                <h3 className="text-xl font-black text-red-900 dark:text-red-300 tracking-tight uppercase">Boac Style</h3>
                            </div>
                            <p className="text-red-800/70 dark:text-red-400 text-sm font-bold leading-tight mb-4">Fierce, frowning, intimidating Roman soldier aesthetic with plumed helmets.</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-moriones-red px-2.5 py-1 rounded-lg">Hardwood</span>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-moriones-red px-2.5 py-1 rounded-lg">Roman Imperial</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Artisan Grid */}
                <section className="space-y-20">
                    {DATA.categories.map((category: any) => (
                        <div key={category.region} className="relative">
                            <div className="flex items-baseline gap-4 mb-10 border-b border-slate-100 dark:border-zinc-800 pb-6">
                                <h3 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{category.region}</h3>
                                <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Artisan Hub</span>
                            </div>
                            
                            {category.heritage_note && (
                                <div className="mb-10 p-6 bg-slate-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                                    <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 leading-relaxed italic">
                                        <span className="text-moriones-red mr-2">✦</span>
                                        {category.heritage_note}
                                    </p>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {category.artisans.map((artisan: any) => (
                                    <div key={artisan.name} className="group relative bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                                        {/* Artisan Card Content */}
                                        
                                        <div className="relative mb-6">
                                            {(artisan.title || artisan.status) && (
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border mb-2 inline-block ${category.color}`}>
                                                    {artisan.title || artisan.status}
                                                </span>
                                            )}
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                                {artisan.name}
                                            </h4>
                                            {artisan.location && (
                                                <div className="flex items-center gap-1.5 mt-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                                    {artisan.location}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-slate-600 dark:text-zinc-400 text-sm font-medium leading-relaxed italic">
                                            "{artisan.specialty}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Technical Specs & Green Initiative */}
                <section className="mt-32 grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-[3rem] p-10 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-emerald-500 text-white p-2 rounded-2xl material-symbols-outlined">eco</span>
                                <h3 className="text-2xl font-black tracking-tight uppercase">Green Artisan Initiative</h3>
                            </div>
                            <p className="text-zinc-400 dark:text-zinc-600 font-bold mb-8 leading-relaxed italic">
                                "{DATA.technical_specs.sustainability}"
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 dark:bg-black/5 rounded-2xl p-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Materials Used</h5>
                                    <p className="text-xs font-black">{DATA.technical_specs.materials.join(', ')}</p>
                                </div>
                                <div className="bg-white/5 dark:bg-black/5 rounded-2xl p-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Peak Cycle</h5>
                                    <p className="text-xs font-black">{DATA.technical_specs.economic_cycle}</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                            <span className="material-symbols-outlined text-[300px]">forest</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[3rem] p-10">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-6">Organizations</h3>
                        <div className="space-y-6">
                            {DATA.organizations.map(org => (
                                <div key={org.name}>
                                    <h4 className="text-moriones-red font-black text-2xl tracking-tighter leading-none">{org.name}</h4>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{org.full_name}</p>
                                    <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 leading-tight">{org.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


            </main>
        </div>
    );
}
