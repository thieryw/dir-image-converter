import { join } from "path";
import { mkdirSync, statSync } from "fs";
import type { Tree } from "../tools/crawl";
import sharp from "sharp";
import { isValidImage } from "./isValidImage";
import type { ImageExtensions } from "../tools/imageExtensions";

export type ConvertImagesParams = {
    data: Tree;
    pathToAssets: string;
    pathToConvertedImages: string;
    format: ImageExtensions;
};

export async function convertImages(params: ConvertImagesParams) {
    const { data, pathToAssets, pathToConvertedImages, format } = params;

    for (const file of data.files) {
        const pathToAsset = (() => {
            if (!statSync(pathToAssets).isDirectory()) {
                return pathToAssets;
            }
            return join(pathToAssets, file);
        })();
        const isImage = await isValidImage(pathToAsset);
        if (!isImage) {
            continue;
        }
        await sharp(join(pathToAsset))
            [format]()
            .toFile(join(pathToConvertedImages, `${file.replace(/.\w+$/g, "")}.${format}`));
    }

    if (Object.keys(data.directories).length === 0) {
        return;
    }

    let index = 0;
    for (const value of Object.values(data.directories)) {
        const currentDirName = Object.keys(data.directories)[index];
        const newPath = join(pathToAssets, currentDirName);
        mkdirSync(join(pathToConvertedImages, currentDirName));
        await convertImages({
            "data": value,
            "pathToAssets": newPath,
            "pathToConvertedImages": join(pathToConvertedImages, currentDirName),
            format
        });
        index++;
    }
}
