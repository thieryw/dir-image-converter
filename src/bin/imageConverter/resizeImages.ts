import { join, extname, parse } from "path";
import { mkdirSync } from "fs";
import type { Tree } from "../crawl";
import sharp from "sharp";
import { isImagePr } from "./isImage";

export async function resizeImages(params: {
    data: Tree;
    pathToAssets: string;
    pathToConvertedImages: string;
    outputSizes: {
        length: number;
        sizeLabel?: string;
    }[];
}) {
    const { data, pathToAssets, pathToConvertedImages, outputSizes } = params;

    for (const file of data.files) {
        await (async () => {
            const pathToAsset = join(pathToAssets, file);
            const isImage = await isImagePr(pathToAsset);

            if (!isImage) {
                return;
            }

            const imageMetaData = await sharp(pathToAsset).metadata();
            const width = imageMetaData.width;
            const height = imageMetaData.height;
            const format = imageMetaData.format;

            if (height === undefined || width === undefined || format === undefined) {
                throw new Error(
                    "something went wrong !!! File must be something else than an image !!!"
                );
            }
            const resize = async (side: "width" | "height", value: number, outPath: string) => {
                await sharp(pathToAsset)
                    .resize({
                        [`${side}`]: value
                    })
                    .toFile(outPath);
            };

            const nameComplement =
                outputSizes[0].sizeLabel === undefined ? "" : `${outputSizes[0].sizeLabel}_`;

            const fileName = parse(file).name;
            const newImagePath = join(pathToConvertedImages, `${nameComplement}${file}` ?? file);
            if (outputSizes.length === 1) {
                if (width >= height) {
                    await resize(
                        "width",
                        outputSizes[0].length < width ? outputSizes[0].length : width,
                        newImagePath
                    );

                    return;
                }
                await resize(
                    "height",
                    outputSizes[0].length < height ? outputSizes[0].length : height,
                    newImagePath
                );

                return;
            }

            mkdirSync(join(pathToConvertedImages, fileName));

            for (const newImageLengthAndName of outputSizes) {
                await (async () => {
                    const newImagePath = join(
                        pathToConvertedImages,
                        fileName,
                        `${
                            newImageLengthAndName.sizeLabel === undefined
                                ? ""
                                : `${newImageLengthAndName.sizeLabel}_`
                        }${file}` ?? `${fileName}_${newImageLengthAndName.length}${extname(file)}`
                    );
                    if (width >= height) {
                        await resize(
                            "width",
                            newImageLengthAndName.length < width ? newImageLengthAndName.length : width,
                            newImagePath
                        );

                        return;
                    }
                    await resize(
                        "height",
                        newImageLengthAndName.length < height ? newImageLengthAndName.length : height,
                        newImagePath
                    );

                    return;
                })();
            }
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
        await resizeImages({
            "data": dirData,
            "pathToAssets": newPath,
            "pathToConvertedImages": join(pathToConvertedImages, currentDirName),
            outputSizes
        });
        index++;
    }
}
