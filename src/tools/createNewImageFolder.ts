import { existsSync, mkdirSync, rmSync, readdirSync } from "fs";
import { sep, join } from "path";

export type CreateNewImageFolderParams = {
    pathToConvertedImages: string;
    overrideExisting: boolean;
};

export function createNewImageFolder(params: CreateNewImageFolderParams) {
    const { overrideExisting, pathToConvertedImages } = params;
    let path = pathToConvertedImages;
    if (!existsSync(pathToConvertedImages)) {
        mkdirSync(pathToConvertedImages);
        return path;
    }
    if (overrideExisting) {
        rmSync(pathToConvertedImages, { "recursive": true, "force": true });
        mkdirSync(pathToConvertedImages);
        return path;
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

    return path;
}
