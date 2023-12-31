import { readdirSync, statSync } from "fs";
import { join, basename } from "path";

export type Tree = {
    files: string[];
    directories: Record<string, Tree>;
};

export function crawl(params: { path: string }): Tree {
    const { path } = params;
    const files: string[] = [];
    const directories: Tree["directories"] = {};
    if (!statSync(path).isDirectory()) {
        return {
            "files": [basename(path)],
            "directories": {}
        };
    }
    readdirSync(path).forEach(fileOrDir => {
        const completePath = join(path, fileOrDir);

        if (statSync(completePath).isDirectory()) {
            directories[fileOrDir] = crawl({ "path": completePath });
            return;
        }

        files.push(fileOrDir);
    });

    return {
        files,
        directories
    };
}
