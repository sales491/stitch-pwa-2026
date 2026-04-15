/**
 * CORE IMAGE OPTIMIZATION UTILITY
 * Handles client-side compression, resizing, and aspect-ratio cropping
 * to preserve battery/data while ensuring high-quality visuals across Marinduque Connect.
 */

export interface OptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    type?: string;
    /**
     * Target aspect ratio for center-crop (width / height).
     * Examples: 1 = square, 4/3 = landscape, 3/4 = portrait, 16/9 = widescreen.
     * If omitted, the original aspect ratio is preserved.
     */
    aspectRatio?: number;
}

/**
 * Compresses an image file, optionally center-cropping to a target aspect ratio
 * before fitting within the specified maxWidth/maxHeight bounds.
 */
export async function optimizeImage(
    file: File,
    options: OptimizationOptions = {}
): Promise<File> {
    const {
        maxWidth = 1200,
        maxHeight = 1200,
        quality = 0.85,
        type = 'image/jpeg',
        aspectRatio,
    } = options;

    // Skip if not an image
    if (!file.type.startsWith('image/')) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Canvas context could not be created'));
                    return;
                }

                // ── Step 1: Determine source crop region ────────────────────
                let srcX = 0;
                let srcY = 0;
                let srcW = img.width;
                let srcH = img.height;

                if (aspectRatio) {
                    const naturalRatio = img.width / img.height;
                    if (naturalRatio > aspectRatio) {
                        // Image is wider than target — crop sides
                        srcW = Math.round(img.height * aspectRatio);
                        srcX = Math.round((img.width - srcW) / 2);
                    } else if (naturalRatio < aspectRatio) {
                        // Image is taller than target — crop top/bottom
                        srcH = Math.round(img.width / aspectRatio);
                        srcY = Math.round((img.height - srcH) / 2);
                    }
                }

                // ── Step 2: Scale to fit within maxWidth / maxHeight ────────
                let destW = srcW;
                let destH = srcH;

                const widthScale = maxWidth / destW;
                const heightScale = maxHeight / destH;
                const scale = Math.min(1, widthScale, heightScale); // Never upscale

                destW = Math.round(destW * scale);
                destH = Math.round(destH * scale);

                canvas.width = destW;
                canvas.height = destH;

                // ── Step 3: Draw cropped + scaled image ─────────────────────
                ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, destW, destH);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const optimizedFile = new File(
                                [blob],
                                file.name.replace(/\.[^/.]+$/, '') + '.jpg',
                                { type, lastModified: Date.now() }
                            );
                            resolve(optimizedFile);
                        } else {
                            reject(new Error('Image optimization failed (Blob error)'));
                        }
                    },
                    type,
                    quality
                );
            };
            img.onerror = () => reject(new Error('Failed to load image for optimization'));
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
    });
}
