import { crawl } from "../tools/crawl";
import { formatImages } from "./formatImages";
import { createNewImageFolder } from "../tools/createNewImageFolder";
import type { FormatImageParams } from "./formatImage";

export async function generateFormatedImages(
    params: Omit<FormatImageParams, "file"> & { overrideExisting: boolean }
) {
    const { pathToAssets, pathToConvertedImages, overrideExisting, ...rest } = params;

    const data = crawl({
        "path": pathToAssets
    });

    const path = createNewImageFolder({
        pathToConvertedImages,
        overrideExisting
    });

    await formatImages({
        data,
        pathToAssets,
        "pathToConvertedImages": path,
        ...rest
    });
}
