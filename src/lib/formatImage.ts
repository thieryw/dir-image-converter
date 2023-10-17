import { join, parse } from "path";
import { statSync, mkdirSync } from "fs";
import { isValidImage } from "../tools/isValidImage";
import sharp from "sharp";
import type { ImageExtensions } from "../tools/imageExtensions";
import { compressImage } from "./compressImage";

export type FormatImageParams = {
    file: string;
    pathToAssets: string;
    format?: ImageExtensions;
    quality?: number;
    outputSizes?: {
        length: number;
        sizeLabel?: string;
    }[];
    pathToConvertedImages: string;
};

export async function formatImage(params: FormatImageParams) {
    const {
        file,
        pathToAssets,
        outputSizes,
        pathToConvertedImages,
        format: convertedFormat,
        quality
    } = params;

    const pathToAsset = (() => {
        if (!statSync(pathToAssets).isDirectory()) {
            return pathToAssets;
        }
        return join(pathToAssets, file);
    })();

    const isImage = await isValidImage(pathToAsset);

    if (!isImage) {
        return;
    }

    if (outputSizes === undefined && convertedFormat !== undefined) {
        await sharp(join(pathToAsset))
            [convertedFormat]({ quality })
            .toFile(join(pathToConvertedImages, `${file.replace(/.\w+$/g, "")}.${convertedFormat}`));
        return;
    }

    if (outputSizes === undefined && convertedFormat === undefined) {
        await compressImage({
            "path": pathToAsset,
            "outPath": join(pathToConvertedImages, file),
            "quality": quality ?? 100
        });
        return;
    }

    if (outputSizes === undefined) {
        return;
    }

    const imageMetaData = await sharp(pathToAsset).metadata();
    const width = imageMetaData.width;
    const height = imageMetaData.height;
    const format = imageMetaData.format;

    if (height === undefined || width === undefined || format === undefined) {
        throw new Error("something went wrong !!! File must be something else than an image !!!");
    }
    const resize = async (side: "width" | "height", value: number, outPath: string) => {
        await sharp(pathToAsset)
            .resize({
                [`${side}`]: value
            })
            [convertedFormat ?? (format as ImageExtensions)]({ quality })
            .toFile(outPath);
    };

    const sizeLabel = outputSizes[0].sizeLabel === undefined ? "" : `${outputSizes[0].sizeLabel}_`;

    const fileName = parse(file).name;
    console.log(file);
    const newImagePath = join(
        pathToConvertedImages,
        `${sizeLabel}${fileName}.${convertedFormat ?? format}` ??
            `${fileName}.${convertedFormat ?? format}`
    );
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
                        ? `${newImageLengthAndName.length}px_`
                        : `${newImageLengthAndName.sizeLabel}_`
                }${fileName}.${convertedFormat ?? format}` ??
                    `${fileName}_${newImageLengthAndName.length}.${convertedFormat ?? format}`
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
}
