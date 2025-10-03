// import type { Unzipped } from "fflate";
// import { unzip } from "fflate";
// import mime from "mime/lite";

export function importBoardFile(file: File): Promise<void> {
  if (file.name.endsWith(".obz")) {
    return importOBZFile();
  }

  if (file.name.endsWith(".obf")) {
    return importOBFFile();
  }

  return Promise.reject(new Error("Unsupported file type"));
}

async function importOBZFile() {
  // TODO: Implement .obz file import
}

async function importOBFFile() {
  // TODO: Implement .obf file import
}
