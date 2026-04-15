/**
 * ImageUploadHint — inline guidance shown below every file upload button.
 * Tells the user the optimal aspect ratio, minimum size, and what the image
 * is used for, so they choose the right photo before uploading.
 */

type AspectRatioLabel = '1:1 Square' | '4:3 Landscape' | '3:4 Portrait' | '16:9 Widescreen' | 'Any';

interface ImageUploadHintProps {
    /** Human-friendly label for the target aspect ratio */
    aspectRatio: AspectRatioLabel;
    /** Recommended minimum dimensions, e.g. "400 × 400 px" */
    minSize: string;
    /** Short description of where this image is shown */
    usedFor: string;
    /** Optional extra tip */
    tip?: string;
}

const RATIO_ICON: Record<AspectRatioLabel, string> = {
    '1:1 Square': 'crop_square',
    '4:3 Landscape': 'crop_landscape',
    '3:4 Portrait': 'crop_portrait',
    '16:9 Widescreen': 'crop_16_9',
    'Any': 'image',
};

export default function ImageUploadHint({ aspectRatio, minSize, usedFor, tip }: ImageUploadHintProps) {
    return (
        <div className="mt-2 flex flex-col gap-1.5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl px-3 py-2.5">
            <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 text-[16px] mt-0.5 shrink-0">
                    {RATIO_ICON[aspectRatio]}
                </span>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">
                            {aspectRatio}
                        </span>
                        <span className="text-[10px] text-blue-400 dark:text-blue-500">·</span>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            Min {minSize}
                        </span>
                        <span className="text-[10px] text-blue-400 dark:text-blue-500">·</span>
                        <span className="text-[10px] text-blue-500 dark:text-blue-400 truncate">
                            {usedFor}
                        </span>
                    </div>
                    {tip && (
                        <p className="text-[10px] text-blue-500 dark:text-blue-500 mt-0.5 leading-relaxed">
                            💡 {tip}
                        </p>
                    )}
                </div>
            </div>
            <p className="text-[9px] text-blue-400 dark:text-blue-600 leading-relaxed">
                Image will be automatically cropped &amp; compressed before uploading.
            </p>
        </div>
    );
}
