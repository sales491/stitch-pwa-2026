import Link from 'next/link';
import Image from 'next/image';

export interface NewArrival {
  id: string;
  title: string;
  price_value: number | null;
  town: string | null;
  image: string | null;
}

const MOCK_ARRIVALS: NewArrival[] = [
  {
    id: "mock-1",
    title: "Honda Click 125i (2023) Excellent Condition",
    price_value: 65000,
    town: "Boac",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80",
  },
  {
    id: "mock-2",
    title: "Fresh Mangoes from Buenavista - Per Kilo",
    price_value: 80,
    town: "Buenavista",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80",
  },
  {
    id: "mock-3",
    title: "Handmade Buntal Hat (Authentic Marinduque)",
    price_value: 450,
    town: "Gasan",
    image: "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=500&q=80",
  },
  {
    id: "mock-4",
    title: "House for Rent near Capitol (2 Bedrooms)",
    price_value: 8000,
    town: "Boac",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80",
  },
  {
    id: "mock-5",
    title: "Seafood Platter Delivery / Paluto",
    price_value: 1200,
    town: "Santa Cruz",
    image: "https://images.unsplash.com/photo-1559742811-822873691fc8?w=500&q=80",
  }
];

export default function NewArrivalsCarousel({ arrivals }: { arrivals: NewArrival[] }) {
  // Pad the real arrivals with mock data, then slice to exactly 5 slots.
  // When 'arrivals' gets more real items, they naturally push the mock items out!
  const displayArrivals = [...(arrivals || []), ...MOCK_ARRIVALS].slice(0, 5);

  if (displayArrivals.length === 0) return null;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between px-4 mb-3">
         <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-white flex items-center gap-1.5">
             <span className="text-moriones-red">🔥</span> New Arrivals
         </h2>
         <Link href="/marketplace" className="text-[10px] font-black text-moriones-red hover:underline uppercase tracking-wider">
             View Feed
         </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-2 snap-x snap-mandatory scroll-smooth">
        {displayArrivals.map((item) => (
          <Link
            key={item.id}
            href={`/marketplace/${item.id}`}
            className="group relative flex-shrink-0 w-36 h-48 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm active:scale-[0.97] transition-all snap-start flex flex-col"
          >
            {/* Image Container */}
            <div className="relative w-full h-32 bg-slate-100 dark:bg-zinc-900 overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  fill
                  sizes="150px"
                  loading="lazy" 
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-zinc-800">
                  <span className="material-symbols-outlined text-slate-300 text-3xl">image</span>
                </div>
              )}
              {/* Overlapping Price Badge */}
              {item.price_value && (
                <div className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-2 py-1 backdrop-blur-sm shadow-lg border border-white/10">
                  <p className="text-[10px] font-black tracking-wide text-white">₱{item.price_value.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="flex flex-col p-2.5 flex-1 justify-center">
              <h3 className="text-[11px] font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-moriones-red transition-colors">
                {item.title}
              </h3>
              {item.town && (
                <p className="text-[9px] font-medium text-slate-500 dark:text-zinc-400 mt-0.5 truncate">
                  📍 {item.town}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
