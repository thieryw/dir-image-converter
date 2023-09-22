#!/usr/bin/env node

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
    .option("format", {
        "alias": "f",
        "description":
            "Format you wish to convert image to: png | jpeg | webp | avif | heif | tiff | jp2 | jxl",
        "type": "string",
        "demandOption": true
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

    if (!imageExtensions.includes(args.format as any)) {
        throw new Error(`Error! The format you have specified is not supported!`);
    }

    await generateConvertedImages({
        "pathToAssets": args.assets,
        "pathToConvertedImages": args.output,
        "convertTo": args.format as any,
        "overrideExisting": args.override ?? false
    });
})();
