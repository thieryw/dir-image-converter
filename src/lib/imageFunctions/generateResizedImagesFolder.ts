import { crawl } from "../crawl";
import { mkdirSync, rmSync, existsSync, readdirSync } from "fs";
import { resizeImages } from "./resizeImages";
import { sep, join } from "path";

export async function generateResizedImagesFolder(params: {
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

        const splitPath = path.split(sep);
        const imageFolderName = splitPath[splitPath.length - 1];

        splitPath.pop();

        splitPath.push(
            (() => {
                const unSplitPath = splitPath.join(sep);
                const copies = readdirSync(unSplitPath.length === 0 ? "." : unSplitPath).filter(file =>
                    file.includes(imageFolderName)
                );
                const newName = `${imageFolderName}(${copies.length})`;

                if (existsSync(join(unSplitPath, newName))) {
                    return `${newName}(${copies.length})`;
                }
                return `${imageFolderName}(${copies.length})`;
            })()
        );

        path = splitPath.join(sep);

        mkdirSync(path);
    })();

    await resizeImages({
        data,
        pathToAssets,
        "pathToConvertedImages": path,
        outputSizes
    });
}
