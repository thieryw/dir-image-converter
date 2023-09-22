export const imageExtensions = ["png", "jpeg", "webp", "avif", "heif", "tiff", "jp2", "jxl"] as const;

export type ImageExtensions = (typeof imageExtensions)[number];
