import sharp from "sharp";
import { isValidImage } from "./isValidImage";
import { imageExtensions } from "../tools/imageExtensions";
import type { ImageExtensions } from "../tools/imageExtensions";

export async function compress(params: { path: string; outPath: string; quality: number }) {
    const { outPath, path, quality } = params;
    const isImage = await isValidImage(path);
    if (!isImage) {
        return;
    }
    const format = (await sharp(path).metadata()).format;
    if (format === undefined || !(imageExtensions as unknown as string[]).includes(format)) {
        throw new Error("Error! Invalid format!");
    }
    await sharp(path)[format as ImageExtensions]({ quality }).toFile(outPath);
}
