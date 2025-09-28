import type { Unzipped } from "fflate";
import { unzip } from "fflate";
import mime from "mime/lite";

export function importBoardFile(file: File): Promise<void> {
  if (file.name.endsWith(".obz")) {
    return importOBZFile(file);
  }

  if (file.name.endsWith(".obf")) {
    return importOBFFile(file);
  }

  return Promise.reject(new Error("Unsupported file type"));
}

async function importOBZFile(file: File) {
  
}

async function importOBFFile(file: File) {
  // Implementation for importing .obf files
}
