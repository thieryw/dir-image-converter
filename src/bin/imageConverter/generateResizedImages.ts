import { crawl } from "../crawl";
import { mkdirSync, rmSync, existsSync, readdirSync } from "fs";
import { resizeImages } from "./resizeImages";
import { join } from "path";

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

    let path = pathToConvertedImages;

    (() => {
        if (!existsSync(pathToConvertedImages)) {
            mkdirSync(pathToConvertedImages);
            return;
        }
        if (overrideExisting) {
            rmSync(pathToConvertedImages, { "recursive": true, "force": true });
            mkdirSync(pathToConvertedImages);
            return;
        }

        const newPath = path.substring(0, path.search(/\w+$/g));
        const copies = readdirSync(newPath).filter(file => {
            return file.search(/^convertedImage/g) !== -1;
        });

        path = join(
            newPath,
            `convertedImage(${(() => {
                if (copies.length === 0) {
                    return 0;
                }

                return copies.length;
            })()})`
        );

        mkdirSync(path);
    })();

    await resizeImages({
        data,
        pathToAssets,
        "pathToConvertedImages": path,
        outputSizes
    });
}
