import { getPathsOfImagesThatAreToHeavy } from "./getIPathsOfImagesThatAreToHeavy";
import path from "path";
import fs from "fs";
import { compressImage } from "./compressImage";

async function compressHeavyImagesRec(params: {
    pathToAssets: string;
    fileSizeLimitInKb: number;
    quality: number;
}) {
    const { fileSizeLimitInKb, pathToAssets, quality } = params;
    const heavyImagePaths = getPathsOfImagesThatAreToHeavy({
        pathToAssets,
        fileSizeLimitInKb
    });

    if (heavyImagePaths.length === 0) {
        return;
    }

    for (const imagePath of heavyImagePaths) {
        const splitPath = imagePath.split(path.sep);
        const imagePathFirstChar = imagePath[0];
        const imageName = splitPath[splitPath.length - 1];
        const tempImageName = `${imageName.split(".")[0]}min${path.extname(imageName)}`;
        splitPath.pop();
        const pathToImageDir = (() => {
            if (imagePathFirstChar === path.sep) {
                return path.join(imagePathFirstChar, ...splitPath);
            }
            return path.join(...splitPath);
        })();
        if (fs.existsSync(pathToImageDir))
            await compressImage({
                "path": imagePath,
                "outPath": path.join(pathToImageDir, tempImageName),
                quality
            });

        fs.rmSync(imagePath, { "force": true, "recursive": true });
        fs.renameSync(path.join(pathToImageDir, tempImageName), imagePath);
    }

    await compressHeavyImagesRec({
        pathToAssets,
        fileSizeLimitInKb,
        "quality": quality - 10
    });
}

export async function compressHeavyImages(params: { pathToAssets: string; fileSizeLimitInKb: number }) {
    const { fileSizeLimitInKb, pathToAssets } = params;

    await compressHeavyImagesRec({
        fileSizeLimitInKb,
        pathToAssets,
        "quality": 90
    });
}
