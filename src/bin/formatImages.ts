#!/usr/bin/env node

import { generateResizedImages } from "../lib/generateResizedImages";
import { generateConvertedImages } from "../lib/generateConvertedImages";
import yargs from "yargs";
import { imageExtensions } from "../tools/imageExtensions";

const argv = yargs
    .option("assets", {
        "alias": "a",
        "description": "Path to the assets",
        "type": "string",
        "demandOption": true
    })
    .option("output", {
        "alias": "o",
        "description": "Path to save the converted images",
        "type": "string",
        "demandOption": true
    })
    .option("sizes", {
        "alias": "s",
        "description": "Sizes and size aliases (e.g., 2500,large)",
        "type": "array",
        "demandOption": false
    })
    .option("format", {
        "alias": "f",
        "description":
            "Format you wish to convert image to: png | jpeg | webp | avif | heif | tiff | jp2 | jxl",
        "type": "string",
        "demandOption": false
    })
    .option("override", {
        "alias": "ov",
        "description": "Override existing output folder",
        "type": "boolean",
        "demandOption": false
    })
    .help()
    .alias("help", "h").argv;

(async () => {
    const args = await argv;
    resize: {
        if (args.sizes === undefined) {
            break resize;
        }

        const parsedSizes = args.sizes.map(size => {
            if (typeof size === "number") {
                return {
                    "length": size
                };
            }
            const [length, sizeLabel] = size.split(",");
            return {
                length: parseInt(length, 10),
                "sizeLabel": sizeLabel === "" ? undefined : sizeLabel
            };
        });
        await generateResizedImages({
            "pathToAssets": args.assets,
            "pathToConvertedImages": args.output,
            "overrideExisting": args.override ?? false,
            "outputSizes": parsedSizes
        });
    }

    convert: {
        if (args.format === undefined) {
            break convert;
        }

        if (!imageExtensions.includes(args.format as any)) {
            throw new Error(`Error! The format you have specified is not supported!`);
        }

        await generateConvertedImages({
            "pathToAssets": args.assets,
            "pathToConvertedImages": args.output,
            "format": args.format as any,
            "overrideExisting": args.override ?? false
        });
    }
})();
