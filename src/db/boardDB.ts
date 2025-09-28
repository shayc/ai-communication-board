import type { DBSchema, IDBPDatabase } from "idb";

export type BoardSetId = string;
export type BoardId = string;
export type FilePath = string;

export interface FileEntry {
  setId: BoardSetId;
  filePath: FilePath;
  blob: Blob;
  mimeType: string;
}

export interface BoardSetEntry {
  setId: BoardSetId;
  rootBoardPath?: FilePath;
  name?: string;
}

export interface BoardEntry {
  setId: BoardSetId;
  boardPath: FilePath;
  boardId: BoardId;
  name?: string;
}

export interface BoardDB extends DBSchema {
  files: {
    key: [BoardSetId, FilePath];
    value: FileEntry;
    indexes: { bySetId: BoardSetId };
  };
  boardSets: {
    key: BoardSetId;
    value: BoardSetEntry;
  };
  boards: {
    key: [BoardSetId, FilePath];
    value: BoardEntry;
    indexes: {
      bySetId: BoardSetId;
      byBoardId: [BoardSetId, BoardId];
    };
  };
}

export async function openBoardDB(
  name = "board-db",
  version = 1,
): Promise<IDBPDatabase<BoardDB>> {
  const { openDB } = await import("idb");

  return openDB<BoardDB>(name, version, {
    upgrade(db) {
      const files = db.createObjectStore("files", {
        keyPath: ["setId", "filePath"],
      });
      files.createIndex("bySetId", "setId");

      db.createObjectStore("boardSets", { keyPath: "setId" });

      const boards = db.createObjectStore("boards", {
        keyPath: ["setId", "boardPath"],
      });
      boards.createIndex("bySetId", "setId");
      boards.createIndex("byBoardId", ["setId", "boardId"]);
    },
  });
}
