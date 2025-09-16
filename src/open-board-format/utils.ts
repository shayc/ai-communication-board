import type { Unzipped } from "fflate";
import { unzip } from "fflate";
import mime from "mime/lite";
import * as OBF from "./types";

export interface OBZContent {
  manifest: OBF.Manifest;
  boards: Record<string, OBF.Board>;
  images: Record<string, Blob>;
  sounds: Record<string, Blob>;
}

export async function unzipOBZ(obz: Uint8Array): Promise<OBZContent> {
  const unzippedOBZ = await unzipAsync(obz);

  const content: OBZContent = {
    manifest: {} as OBF.Manifest,
    boards: {},
    images: {},
    sounds: {},
  };

  for (const [path, data] of Object.entries(unzippedOBZ)) {
    try {
      if (path === "manifest.json") {
        content.manifest = parseJson(data);
      } else if (path.endsWith(".obf")) {
        content.boards[path] = parseJson(data);
      } else {
        const type = mime.getType(path) ?? "";
        const blob = new Blob([data as BlobPart], { type });

        if (type.startsWith("image/")) {
          content.images[path] = blob;
        } else if (type.startsWith("audio/")) {
          content.sounds[path] = blob;
        }
      }
    } catch (parseError) {
      console.error(`Error processing file ${path}:`, parseError);
    }
  }

  return content;
}

function unzipAsync(data: Uint8Array): Promise<Unzipped> {
  return new Promise((resolve, reject) =>
    unzip(data, (err, unzippedOBZ) => {
      if (err) {
        reject(err);
      }

      resolve(unzippedOBZ);
    }),
  );
}

function parseJson<T>(data: Uint8Array): T {
  return JSON.parse(new TextDecoder().decode(data)) as T;
}
