/**
 * CORE IMAGE OPTIMIZATION UTILITY
 * Handles client-side compression and resizing to preserve battery/data
 * while ensuring high-quality visuals across Marinduque Connect.
 */

export interface OptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    type?: string;
}

/**
 * Compresses an image file while preserving its aspect ratio.
 * Fits the image within the specified maxWidth/maxHeight.
 */
export async function optimizeImage(
    file: File,
    options: OptimizationOptions = {}
): Promise<File> {
    const {
        maxWidth = 1200,
        maxHeight = 1200,
        quality = 0.85,
        type = 'image/jpeg'
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
                let width = img.width;
                let height = img.height;

                // Preserve Aspect Ratio while fitting into bounds
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Canvas context could not be created'));
                    return;
                }

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                                type: type,
                                lastModified: Date.now(),
                            });
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
