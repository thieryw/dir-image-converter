import sharp from "sharp";
import { isValidImage } from "./isValidImage";

export async function compress(params: { path: string; outPath: string; quality: number }) {
    const { outPath, path, quality } = params;
    const isImage = await isValidImage(path);
    if (!isImage) {
        return;
    }
    const format = (await sharp(path).metadata()).format;
    switch (format) {
        case "jpeg":
            await sharp(path).jpeg({ quality }).toFile(outPath);
            return;
        case "jp2":
            await sharp(path).jp2({ quality }).toFile(outPath);
            return;
        case "jxl":
            await sharp(path).jxl({ quality }).toFile(outPath);
            return;
        case "png":
            await sharp(path).png({ quality }).toFile(outPath);
            return;
        case "webp":
            await sharp(path).webp({ quality }).toFile(outPath);
            return;
        default:
            throw new Error("Incompatible image format");
    }
}
