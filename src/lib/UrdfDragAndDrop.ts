/**
 * URDF Drag and Drop Utility
 *
 * This file provides functionality for handling drag and drop of URDF folders.
 * It converts the dropped files into accessible blobs for visualization.
 */

/**
 * Converts a DataTransfer structure into an object with all paths and files.
 * @param dataTransfer The DataTransfer object from the drop event
 * @returns A promise that resolves with the file structure object
 */
export function dataTransferToFiles(
  dataTransfer: DataTransfer
): Promise<Record<string, File>> {
  if (!(dataTransfer instanceof DataTransfer)) {
    throw new Error('Data must be of type "DataTransfer"');
  }

  const files: Record<string, File> = {};

  /**
   * Recursively processes a directory entry to extract all files
   * Using type 'unknown' and then type checking for safety with WebKit's non-standard API
   */
  function recurseDirectory(item: unknown): Promise<void> {
    // Type guard for file entries
    const isFileEntry = (
      entry: unknown
    ): entry is {
      isFile: boolean;
      fullPath: string;
      file: (callback: (file: File) => void) => void;
    } =>
      entry !== null &&
      typeof entry === "object" &&
      "isFile" in entry &&
      typeof (entry as Record<string, unknown>).file === "function" &&
      "fullPath" in entry;

    // Type guard for directory entries
    const isDirEntry = (
      entry: unknown
    ): entry is {
      isFile: boolean;
      createReader: () => {
        readEntries: (callback: (entries: unknown[]) => void) => void;
      };
    } =>
      entry !== null &&
      typeof entry === "object" &&
      "isFile" in entry &&
      typeof (entry as Record<string, unknown>).createReader === "function";

    if (isFileEntry(item) && item.isFile) {
      return new Promise((resolve) => {
        item.file((file: File) => {
          files[item.fullPath] = file;
          resolve();
        });
      });
    } else if (isDirEntry(item) && !item.isFile) {
      const reader = item.createReader();

      return new Promise((resolve) => {
        const promises: Promise<void>[] = [];

        // Exhaustively read all directory entries
        function readNextEntries() {
          reader.readEntries((entries: unknown[]) => {
            if (entries.length === 0) {
              Promise.all(promises).then(() => resolve());
            } else {
              entries.forEach((entry) => {
                promises.push(recurseDirectory(entry));
              });
              readNextEntries();
            }
          });
        }

        readNextEntries();
      });
    }

    return Promise.resolve();
  }

  return new Promise((resolve) => {
    // Process dropped items
    const dtitems = dataTransfer.items && Array.from(dataTransfer.items);
    const dtfiles = Array.from(dataTransfer.files);

    if (dtitems && dtitems.length && "webkitGetAsEntry" in dtitems[0]) {
      const promises: Promise<void>[] = [];

      for (let i = 0; i < dtitems.length; i++) {
        const item = dtitems[i] as unknown as {
          webkitGetAsEntry: () => unknown;
        };

        if (typeof item.webkitGetAsEntry === "function") {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            promises.push(recurseDirectory(entry));
          }
        }
      }

      Promise.all(promises).then(() => resolve(files));
    } else {
      // Add a '/' prefix to match the file directory entry on webkit browsers
      dtfiles
        .filter((f) => f.size !== 0)
        .forEach((f) => (files["/" + f.name] = f));

      resolve(files);
    }
  });
}

/**
 * Cleans a file path by removing '..' and '.' tokens and normalizing slashes
 */
export function cleanFilePath(path: string): string {
  return path
    .replace(/\\/g, "/")
    .split(/\//g)
    .reduce((acc, el) => {
      if (el === "..") acc.pop();
      else if (el !== ".") acc.push(el);
      return acc;
    }, [] as string[])
    .join("/");
}

/**
 * Interface representing the structure of an URDF processor
 */
export interface UrdfProcessor {
  loadUrdf: (path: string) => void;
  setUrlModifierFunc: (func: (url: string) => string) => void;
  getPackage: () => string;
}

// Reference to hold the package path
const packageRef = { current: "" };

/**
 * Reads the content of a URDF file
 * @param file The URDF file object
 * @returns A promise that resolves with the content of the file as a string
 */
export function readUrdfFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read URDF file content"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading URDF file"));
    reader.readAsText(file);
  });
}

/**
 * Processes dropped files and returns information about available URDF models
 */
export async function processDroppedFiles(
  dataTransfer: DataTransfer,
  urdfProcessor: UrdfProcessor
): Promise<{
  files: Record<string, File>;
  availableModels: string[];
  blobUrls: Record<string, string>;
}> {
  // Reset the package reference
  packageRef.current = "";

  // Convert dropped files into a structured format
  const files = await dataTransferToFiles(dataTransfer);

  // Get all file paths and clean them
  const fileNames = Object.keys(files).map((n) => cleanFilePath(n));

  // Filter all files ending in URDF
  const availableModels = fileNames.filter((n) => /urdf$/i.test(n));

  // Create blob URLs for URDF files
  const blobUrls: Record<string, string> = {};
  availableModels.forEach((path) => {
    blobUrls[path] = URL.createObjectURL(files[path]);
  });

  // Extract the package base path from the first URDF model for reference
  let packageBasePath = "";
  if (availableModels.length > 0) {
    // Extract the main directory path (e.g., '/cassie_description/')
    const firstModel = availableModels[0];
    const packageMatch = firstModel.match(/^(\/[^/]+\/)/);
    if (packageMatch && packageMatch[1]) {
      packageBasePath = packageMatch[1];
    }
  }

  // Store the package path for future reference
  const packagePathRef = packageBasePath;
  urdfProcessor.setUrlModifierFunc((url) => {
    // Find the matching file given the requested URL

    // Store package reference for future use
    if (packagePathRef) {
      packageRef.current = packagePathRef;
    }

    // Simple approach: just find the first file that matches the end of the URL
    const cleaned = cleanFilePath(url);

    // Get the filename from the URL
    const urlFilename = cleaned.split("/").pop() || "";

    // Find the first file that ends with this filename
    let fileName = fileNames.find((name) => name.endsWith(urlFilename));

    // If no match found, just take the first file with a similar extension
    if (!fileName && urlFilename.includes(".")) {
      const extension = "." + urlFilename.split(".").pop();
      fileName = fileNames.find((name) => name.endsWith(extension));
    }

    if (fileName !== undefined && fileName !== null) {
      // Extract file extension for content type
      const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

      // Create blob URL with extension in the searchParams to help with format detection
      const blob = new Blob([files[fileName]], {
        type: getMimeType(fileExtension),
      });
      const blobUrl = URL.createObjectURL(blob) + "#." + fileExtension;

      // Don't revoke immediately, wait for the mesh to be loaded
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      return blobUrl;
    }

    console.warn(`No matching file found for: ${url}`);
    return url;
  });

  return {
    files,
    availableModels,
    blobUrls,
  };
}

/**
 * Get the MIME type for a file extension
 */
function getMimeType(extension: string): string {
  switch (extension.toLowerCase()) {
    case "stl":
      return "model/stl";
    case "obj":
      return "model/obj";
    case "gltf":
    case "glb":
      return "model/gltf+json";
    case "dae":
      return "model/vnd.collada+xml";
    case "urdf":
      return "application/xml";
    default:
      return "application/octet-stream";
  }
}
