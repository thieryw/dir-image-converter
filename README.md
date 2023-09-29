# dir-image-converter

**dir-image-converter** is a utility that allows users to resize and convert images within a directory structure. The module provides two primary commands for this purpose: `convert-images` and `resize-images`.

## Installation

```bash
npm install dir-image-converter -g
```

## Features

### 1. Convert Images

Command: `convert-images`

This command will convert images from the specified directory to the desired format. Supported formats include: `png`, `jpeg`, `webp`, `avif`, `heif`, `tiff`, `jp2`, and `jxl`.

Usage:

```bash
convert-images -a [Path to the assets] -o [Path to save the converted images] -f [Format to convert to]
```

Options:

-   `-a, --assets`: Path to the assets (Required).
-   `-o, --output`: Path to save the converted images (Required).
-   `-f, --format`: Format to convert to (Required).
-   `-ov, --override`: Override existing output folder (Optional).

### 2. Resize Images

Command: `resize-images`

This command will resize images from the specified directory to the provided sizes.

Usage:

```bash
resize-images -a [Path to the assets] -o [Path to save the resized images] -s [Sizes and size aliases, e.g., 2500,large]
```

Options:

-   `-a, --assets`: Path to the assets (Required).
-   `-o, --output`: Path to save the resized images (Required).
-   `-s, --sizes`: Sizes and size aliases, e.g., `2500,large` (Required).
-   `-ov, --override`: Override existing output folder (Optional).

## Repository

For more details and to access the source code, visit the [GitHub Repository](https://github.com/thieryw/dir-image-converter).

## License

This project is licensed under the MIT License.
