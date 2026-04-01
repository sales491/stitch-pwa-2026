'use client';

// Marinduque Market — Product Spotlight Card
// Shown as an overlay on the buyer's video stream when seller spotlights an item.
// Displays: product image, name, price in bold.
// Triggers MineButton to appear.
// Updates via PRODUCT_SPOTLIGHT Realtime broadcast.

interface ProductSpotlightProps {
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export function ProductSpotlight({ name, price, imageUrl, quantity }: ProductSpotlightProps) {
  // TODO — Phase 1 implementation

  return (
    <div className="absolute bottom-32 left-4 right-4 z-40
                    bg-black/70 backdrop-blur-sm rounded-2xl p-4
                    flex gap-3 items-center">
      {imageUrl && (
        <img src={imageUrl} alt={name} className="w-16 h-16 rounded-xl object-cover" />
      )}
      <div className="flex-1">
        <p className="text-white font-black text-base leading-tight">{name}</p>
        {quantity > 1 && (
          <p className="text-yellow-400 text-xs font-bold">{quantity} available</p>
        )}
        <p className="text-green-400 font-black text-xl mt-1">
          ₱{price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
