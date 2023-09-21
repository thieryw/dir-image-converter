import { generateResizedImagesFolder } from "../lib/imageFunctions/generateResizedImagesFolder";
//import { crawl } from "../lib/crawl";
import * as fs from "fs";
import * as path from "path";
/*import sharp from "sharp";
import { number } from "yargs";*/

/*async function getImageDimensions(filePath: string){
    const metadata = await sharp(filePath).metadata();
    return {
        "width": metadata.width,
        "height": metadata.height
    }
};



async function testDimensionsForImagesInFolder(folderPath: string) {
    const fileNames = fs.readdirSync(folderPath);
    const imageFiles = fileNames.filter(fileName => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(fileName)));
  
  
    for (const imageFile of imageFiles) {
      const filePath = path.join(folderPath, imageFile);
      const dimension = await getImageDimensions(filePath);
      const width = dimension.width;
      const height = dimension.height;
      if(width === undefined || height === undefined){
        throw new Error("width or height is undefined");
        };


        if (imageFile.includes("medium")) {
            if(width >= height) {
                return width === 1500;
            }
            return width === 500;
        }

        if(width < height){
            return height === 1500;
        }
        return height === 500;

    }

}*/

const inputPath = path.join(__dirname, "..", "assets", "img");
const outputPath = path.join(__dirname, "..", "assets", "generated", "img-resized");

test("It should resize images to the specified dimensions", async () => {
    await generateResizedImagesFolder({
        "pathToAssets": inputPath,
        "pathToConvertedImages": outputPath,
        "outputSizes": [
            {
                "length": 1500,
                "sizeLabel": "medium"
            },
            {
                "length": 500,
                "sizeLabel": "small"
            }
        ],
        "overrideExisting": true
    });

    expect(fs.existsSync(outputPath)).toBe(true);
});

test("It should create a second copy of the resized image folder", async () => {
    await generateResizedImagesFolder({
        "pathToAssets": inputPath,
        "pathToConvertedImages": outputPath,
        "outputSizes": [
            {
                "length": 1000
            },
            {
                "length": 500
            }
        ],
        "overrideExisting": false
    });

    expect(fs.existsSync(path.join(__dirname, "..", "assets", "generated", "img-resized(1)"))).toBe(
        true
    );
    fs.rmSync(path.join(__dirname, "..", "assets", "generated", "img-resized"), {
        "force": true,
        "recursive": true
    });
    fs.rmSync(path.join(__dirname, "..", "assets", "generated", "img-resized(1)"), {
        "force": true,
        "recursive": true
    });
});
