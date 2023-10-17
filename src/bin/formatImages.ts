#!/usr/bin/env node

import { generateFormatedImages } from "../lib/generateFormatedImages";
import yargs from "yargs";
import { imageExtensions } from "../tools/imageExtensions";
import type { ImageExtensions } from "../tools/imageExtensions";

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
    .option("quality", {
        "alias": "q",
        "description": "Quality. give a number between 0 and 100",
        "type": "number",
        "demandOption": false
    })
    .help()
    .alias("help", "h").argv;

(async () => {
    const args = await argv;
    /*    if (args.sizes === undefined) {
        return;
    }*/

    const parsedSizes =
        args.sizes === undefined
            ? undefined
            : args.sizes.map(size => {
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
    await generateFormatedImages({
        "pathToAssets": args.assets,
        "pathToConvertedImages": args.output,
        "overrideExisting": args.override ?? false,
        "outputSizes": parsedSizes,
        "quality": args.quality,
        "format": (() => {
            if (!imageExtensions.includes(args.format as ImageExtensions)) {
                throw new Error("Error! The format you have specified is not supported!");
            }
            return (args.format as ImageExtensions) || undefined;
        })()
    });
})();
