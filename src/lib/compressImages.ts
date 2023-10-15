import { join } from "path";
import { mkdirSync, statSync } from "fs";
import type { Tree } from "../tools/crawl";
import { compress } from "./compressImage";

export type CompressImagesParams = {
    data: Tree;
    pathToAssets: string;
    pathToCompressedImages: string;
    quality?: number;
};

export async function compressImages(params: CompressImagesParams) {
    const { data, pathToAssets, pathToCompressedImages, quality } = params;

    for (const file of data.files) {
        const pathToAsset = (() => {
            if (!statSync(pathToAssets).isDirectory()) {
                return pathToAssets;
            }
            return join(pathToAssets, file);
        })();
        compress({
            "path": pathToAsset,
            "outPath": join(pathToCompressedImages, file),
            "quality": (() => {
                if (quality === undefined || quality < 0 || quality > 100) {
                    return 100;
                }
                return quality;
            })()
        });
    }

    if (Object.keys(data.directories).length === 0) {
        return;
    }

    let index = 0;
    for (const value of Object.values(data.directories)) {
        const currentDirName = Object.keys(data.directories)[index];
        const newPath = join(pathToAssets, currentDirName);
        mkdirSync(join(pathToCompressedImages, currentDirName));
        await compressImages({
            "data": value,
            "pathToAssets": newPath,
            "pathToCompressedImages": join(pathToCompressedImages, currentDirName),
            quality
        });
        index++;
    }
}
