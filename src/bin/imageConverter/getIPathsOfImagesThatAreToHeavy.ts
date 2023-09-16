import fs from "fs";
import { crawl } from "../crawl";
import path from "path";

function getImageSize(filePath: string) {
    try {
        return fs.statSync(filePath).size / 1024;
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

export function getPathsOfImagesThatAreToHeavy(params: {
    pathToAssets: string;
    fileSizeLimitInKb: number;
}): string[] {
    const { fileSizeLimitInKb, pathToAssets } = params;
    const data = crawl({
        "path": pathToAssets
    });
    let out: string[] = [];

    data.files.forEach(file => {
        const imagePath = path.join(pathToAssets, file);
        const imageSize = getImageSize(imagePath);
        if (imageSize === undefined) {
            throw new Error("Image does not exist !!");
        }
        if (imageSize <= fileSizeLimitInKb) {
            return;
        }
        out.push(imagePath);
    });

    if (Object.keys(data.directories).length === 0) {
        return out;
    }

    Object.values(data.directories).forEach((_value, index) => {
        const currentDirName = Object.keys(data.directories)[index];
        const newPath = path.join(pathToAssets, currentDirName);
        out = [
            ...out,
            ...getPathsOfImagesThatAreToHeavy({
                "pathToAssets": newPath,
                fileSizeLimitInKb
            })
        ];
    });

    return out;
}
