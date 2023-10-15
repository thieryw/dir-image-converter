import sharp from "sharp";

export async function isValidImage(path: string) {
    try {
        await sharp(path).metadata();
        return true;
    } catch {
        return false;
    }
}
