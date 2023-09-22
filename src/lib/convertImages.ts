import { join } from "path";
import { mkdirSync } from "fs";
import type { Tree } from "../tools/crawl";
import sharp from "sharp";
import { isValidImage } from "./isValidImage";
import type { ImageExtensions } from "../tools/imageExtensions";

export type ConvertImagesParams = {
    data: Tree;
    pathToAssets: string;
    pathToConvertedImages: string;
    convertTo: ImageExtensions;
};

export async function convertImages(params: ConvertImagesParams) {
    const { data, pathToAssets, pathToConvertedImages, convertTo } = params;

    for (const file of data.files) {
        const isImage = await isValidImage(join(pathToAssets, file));
        if (!isImage) {
            console.log("ok");
            return;
        }
        await sharp(join(pathToAssets, file))
            [convertTo]()
            .toFile(join(pathToConvertedImages, `${file.replace(/.\w+$/g, "")}.${convertTo}`));
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
            convertTo
        });
        index++;
    }
}
