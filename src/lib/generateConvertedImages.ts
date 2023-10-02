import { crawl } from "../tools/crawl";
import { convertImages } from "./convertImages";
import type { ConvertImagesParams } from "./convertImages";
import { createNewImageFolder } from "../tools/createNewImageFolder";

export async function generateConvertedImages(
    params: Omit<ConvertImagesParams, "data"> & {
        overrideExisting: boolean;
    }
) {
    const { pathToAssets, pathToConvertedImages, format, overrideExisting } = params;

    const data = crawl({
        "path": pathToAssets
    });

    const path = createNewImageFolder({
        pathToConvertedImages,
        overrideExisting
    });

    await convertImages({
        data,
        pathToAssets,
        "pathToConvertedImages": path,
        format
    });
}
