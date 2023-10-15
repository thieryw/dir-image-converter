import { crawl } from "../tools/crawl";
import { compressImages } from "./compressImages";
import type { CompressImagesParams } from "./compressImages";
import { createNewImageFolder } from "../tools/createNewImageFolder";

export async function generateConvertedImages(
    params: Omit<CompressImagesParams, "data"> & {
        overrideExisting: boolean;
    }
) {
    const { pathToAssets, pathToCompressedImages, quality, overrideExisting } = params;

    const data = crawl({
        "path": pathToAssets
    });

    const path = createNewImageFolder({
        "pathToConvertedImages": pathToCompressedImages,
        overrideExisting
    });

    await compressImages({
        data,
        pathToAssets,
        "pathToCompressedImages": path,
        quality
    });
}
