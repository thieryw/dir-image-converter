import { join } from "path";
import { mkdirSync } from "fs";
import type { Tree } from "../tools/crawl";
import { formatImage } from "./formatImage";
import type { FormatImageParams } from "./formatImage";

export type FormatImagesParams = Omit<FormatImageParams, "file"> & {
    data: Tree;
};

export async function formatImages(params: FormatImagesParams) {
    const { data, pathToAssets, pathToConvertedImages, outputSizes, format, quality } = params;

    for (const file of data.files) {
        await (async () => {
            formatImage({
                file,
                pathToAssets,
                pathToConvertedImages,
                outputSizes,
                format,
                quality
            });
        })();
    }

    if (Object.keys(data.directories).length === 0) {
        return;
    }

    let index = 0;

    for (const dirData of Object.values(data.directories)) {
        const currentDirName = Object.keys(data.directories)[index];
        const newPath = join(pathToAssets, currentDirName);
        mkdirSync(join(pathToConvertedImages, currentDirName));
        await formatImages({
            "data": dirData,
            "pathToAssets": newPath,
            "pathToConvertedImages": join(pathToConvertedImages, currentDirName),
            outputSizes,
            format,
            quality
        });
        index++;
    }
}
