#!/usr/bin/env node

import { generateResizedImages } from "../lib/generateResizedImages";
import yargs from "yargs";

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
})();
