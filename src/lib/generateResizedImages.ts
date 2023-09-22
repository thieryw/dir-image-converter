import { crawl } from "../tools/crawl";
import { resizeImages } from "./resizeImages";
import { createNewImageFolder } from "../tools/createNewImageFolder";

export async function generateResizedImages(params: {
    pathToAssets: string;
    pathToConvertedImages: string;
    overrideExisting: boolean;
    outputSizes: {
        length: number;
        sizeLabel?: string;
    }[];
}) {
    const { pathToAssets, pathToConvertedImages, overrideExisting, outputSizes } = params;

    const data = crawl({
        "path": pathToAssets
    });

    const path = createNewImageFolder({
        pathToConvertedImages,
        overrideExisting
    });

    await resizeImages({
        data,
        pathToAssets,
        "pathToConvertedImages": path,
        outputSizes
    });
}
