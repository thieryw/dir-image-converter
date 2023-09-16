import sharp from "sharp";

export async function isImagePr(path: string) {
    try {
        await sharp(path).metadata();
        return true;
    } catch {
        return false;
    }
}
