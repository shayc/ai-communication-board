import type { DBSchema, IDBPDatabase } from "idb";
import { openDB } from "idb";
import type { ZodType } from "zod";
import type { Board, Manifest, UUID } from "../open-board-format/schema";
import { BoardSchema, ManifestSchema, UUIDSchema } from "../open-board-format/schema";
import type { OBZContent } from "../open-board-format/utils";
import { unzipOBZ } from "../open-board-format/utils";

// ===== CONSTANTS =====

const DATABASE_NAME = "boards-db";
const DATABASE_VERSION = 1;
const MANIFEST_ID = "manifest";

const STORE_NAMES = {
  MANIFESTS: "manifests",
  BOARDS: "boards",
  IMAGES: "images",
  SOUNDS: "sounds",
} as const;

const INDEX_NAMES = {
  BY_PATH: "byPath",
} as const;

// ===== TYPE DEFINITIONS =====

interface BoardRecord {
  id: UUID;
  path: string;
  data: Board;
}

interface MediaRecord {
  id: UUID;
  path: string;
  data: Blob;
}

interface ManifestRecord {
  id: "manifest";
  data: Manifest;
}

interface BoardsDB extends DBSchema {
  [STORE_NAMES.MANIFESTS]: {
    value: ManifestRecord;
    key: string;
  };
  [STORE_NAMES.BOARDS]: {
    value: BoardRecord;
    key: string;
    indexes: { [INDEX_NAMES.BY_PATH]: string };
  };
  [STORE_NAMES.IMAGES]: {
    value: MediaRecord;
    key: string;
    indexes: { [INDEX_NAMES.BY_PATH]: string };
  };
  [STORE_NAMES.SOUNDS]: {
    value: MediaRecord;
    key: string;
    indexes: { [INDEX_NAMES.BY_PATH]: string };
  };
}

// ===== CUSTOM ERRORS =====

class BoardsDBError extends Error {
  public readonly operation: string;
  public readonly cause?: Error;

  constructor(message: string, operation: string, cause?: Error) {
    super(message);
    this.name = "BoardsDBError";
    this.operation = operation;
    this.cause = cause;
  }
}

class BoardNotFoundError extends BoardsDBError {
  constructor(identifier: string, cause?: Error) {
    super(`Board not found: ${identifier}`, "GET_BOARD", cause);
    this.name = "BoardNotFoundError";
  }
}

class ManifestNotFoundError extends BoardsDBError {
  constructor(cause?: Error) {
    super("Manifest not found", "GET_MANIFEST", cause);
    this.name = "ManifestNotFoundError";
  }
}

class ValidationError extends BoardsDBError {
  constructor(field: string, value: unknown, cause?: Error) {
    super(`Invalid ${field}: ${JSON.stringify(value)}`, "VALIDATION", cause);
    this.name = "ValidationError";
  }
}

class TransactionError extends BoardsDBError {
  constructor(stores: string[], cause?: Error) {
    super(
      `Transaction failed for stores: ${stores.join(", ")}`,
      "TRANSACTION",
      cause,
    );
    this.name = "TransactionError";
  }
}

class StorageQuotaError extends BoardsDBError {
  constructor(requestedSize: number, cause?: Error) {
    super(
      `Storage quota exceeded. Requested: ${requestedSize} bytes`,
      "STORAGE_QUOTA",
      cause,
    );
    this.name = "StorageQuotaError";
  }
}

class MediaNotFoundError extends BoardsDBError {
  constructor(type: "image" | "sound", identifier: string, cause?: Error) {
    super(
      `${type} not found: ${identifier}`,
      `GET_${type.toUpperCase()}`,
      cause,
    );
    this.name = "MediaNotFoundError";
  }
}

// ===== DATABASE INITIALIZATION =====

let dbPromise: Promise<IDBPDatabase<BoardsDB>> | null = null;
let isInitializing = false;

/**
 * Singleton database initialization with race condition protection.
 * Uses locking to prevent multiple initialization attempts.
 */
async function initializeDatabase(): Promise<IDBPDatabase<BoardsDB>> {
  if (dbPromise) return dbPromise;
  
  if (isInitializing) {
    // Wait for ongoing initialization
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    if (dbPromise) return dbPromise;
  }

  isInitializing = true;
  try {
    dbPromise = openDB<BoardsDB>(DATABASE_NAME, DATABASE_VERSION, {
      upgrade(database) {
        // Manifests store
        if (!database.objectStoreNames.contains(STORE_NAMES.MANIFESTS)) {
          database.createObjectStore(STORE_NAMES.MANIFESTS, { keyPath: "id" });
        }

        // Boards store - unique path index prevents duplicate board paths
        if (!database.objectStoreNames.contains(STORE_NAMES.BOARDS)) {
          const boardsStore = database.createObjectStore(STORE_NAMES.BOARDS, {
            keyPath: "id",
          });
          boardsStore.createIndex(INDEX_NAMES.BY_PATH, "path", {
            unique: true,
          });
        }

        // Images store - unique path index prevents duplicate media paths
        if (!database.objectStoreNames.contains(STORE_NAMES.IMAGES)) {
          const imagesStore = database.createObjectStore(STORE_NAMES.IMAGES, {
            keyPath: "id",
          });
          imagesStore.createIndex(INDEX_NAMES.BY_PATH, "path", {
            unique: true,
          });
        }

        // Sounds store - unique path index prevents duplicate media paths
        if (!database.objectStoreNames.contains(STORE_NAMES.SOUNDS)) {
          const soundsStore = database.createObjectStore(STORE_NAMES.SOUNDS, {
            keyPath: "id",
          });
          soundsStore.createIndex(INDEX_NAMES.BY_PATH, "path", {
            unique: true,
          });
        }
      },
    });
    return await dbPromise;
  } catch (error) {
    dbPromise = null;
    throw new BoardsDBError(
      "Failed to initialize database",
      "INIT_DATABASE",
      error as Error,
    );
  } finally {
    isInitializing = false;
  }
}

/** Close database connection. Used for cleanup and testing. */
export async function closeDatabase(): Promise<void> {
  if (dbPromise) {
    try {
      const db = await dbPromise;
      db.close();
    } catch (error) {
      console.error("Error closing database:", error);
    } finally {
      dbPromise = null;
    }
  }
}

// ===== HELPER FUNCTIONS =====

/**
 * Wraps database operations with error handling.
 * Database is initialized automatically before operations.
 */
async function withErrorHandling<T>(
  operation: string,
  fn: (db: IDBPDatabase<BoardsDB>) => Promise<T>,
): Promise<T> {
  try {
    const database = await initializeDatabase();
    return await fn(database);
  } catch (error) {
    console.error(`Database operation failed: ${operation}`, error);
    if (error instanceof BoardsDBError) {
      throw error;
    }
    throw new BoardsDBError(
      `Failed to ${operation}`,
      operation,
      error as Error,
    );
  }
}

/** Validates data using Zod schema. Throws ValidationError on failure. */
function validateData<T>(
  schema: ZodType<T>,
  data: unknown,
  fieldName: string,
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new ValidationError(fieldName, data, error as Error);
  }
}

/** Validates ID format. Throws ValidationError if invalid. */
function validateId(id: string, context: string): UUID {
  try {
    return UUIDSchema.parse(id);
  } catch (error) {
    throw new ValidationError(`${context} ID`, id, error as Error);
  }
}

function createIdPathMapping(
  paths: Record<UUID, string>,
): Record<string, UUID> {
  return Object.fromEntries(
    Object.entries(paths).map(([id, path]) => [path, id]),
  );
}

/** Validates file size. Default limit: 50MB. Throws StorageQuotaError if exceeded. */
function validateFileSize(
  size: number,
  maxSize: number = 50 * 1024 * 1024,
): void {
  if (size > maxSize) {
    throw new StorageQuotaError(size);
  }
}

/** Sanitizes file path to prevent directory traversal attacks. */
function sanitizePath(path: string): string {
  return path.replace(/\.\./g, "").replace(/\/+/g, "/").trim();
}

// ===== MANIFEST OPERATIONS =====

/** Gets manifest from database. Returns null if not found. */
export async function getManifest(): Promise<Manifest | null> {
  return withErrorHandling("get manifest", async (database) => {
    const tx = database.transaction([STORE_NAMES.MANIFESTS], "readonly");
    const manifestsStore = tx.objectStore(STORE_NAMES.MANIFESTS);
    const result = await manifestsStore.get(MANIFEST_ID);
    return result?.data ?? null;
  });
}

/** Stores manifest with validation. Overwrites existing manifest. */
export async function storeManifest(manifest: Manifest): Promise<void> {
  return withErrorHandling("store manifest", async (database) => {
    const validatedManifest = validateData(
      ManifestSchema,
      manifest,
      "manifest",
    );

    const tx = database.transaction([STORE_NAMES.MANIFESTS], "readwrite");

    try {
      const manifestsStore = tx.objectStore(STORE_NAMES.MANIFESTS);
      const record: ManifestRecord = {
        id: MANIFEST_ID,
        data: validatedManifest,
      };
      await manifestsStore.put(record);
      await tx.done;
    } catch (error) {
      try {
        await tx.abort();
      } catch (abortError) {
        console.error("Failed to abort manifest transaction:", abortError);
      }
      throw new TransactionError([STORE_NAMES.MANIFESTS], error as Error);
    }
  });
}

// ===== BOARD OPERATIONS =====

/** Gets board by ID. Returns null if not found. */
export async function getBoardById(id: string): Promise<Board | null> {
  return withErrorHandling("get board by id", async (database) => {
    const validId = validateId(id, "board");
    const tx = database.transaction([STORE_NAMES.BOARDS], "readonly");
    const boardsStore = tx.objectStore(STORE_NAMES.BOARDS);
    const result = await boardsStore.get(validId);
    return result?.data ?? null;
  });
}

/** Gets board by file path. Returns null if not found. */
export async function getBoardByPath(path: string): Promise<Board | null> {
  return withErrorHandling("get board by path", async (database) => {
    const tx = database.transaction([STORE_NAMES.BOARDS], "readonly");
    const boardsStore = tx.objectStore(STORE_NAMES.BOARDS);
    const result = await boardsStore.index(INDEX_NAMES.BY_PATH).get(path);
    return result?.data ?? null;
  });
}

/** Gets root board from manifest. Returns null if manifest or root board not found. */
export async function getRootBoard(): Promise<Board | null> {
  return withErrorHandling("get root board", async () => {
    const manifest = await getManifest();

    if (!manifest?.root) {
      return null;
    }

    const board = await getBoardByPath(manifest.root);
    return board;
  });
}

/** Gets root board from manifest. Throws errors if manifest or board missing. */
export async function getRootBoardOrThrow(): Promise<Board> {
  return withErrorHandling("get root board (strict)", async () => {
    const manifest = await getManifest();

    if (!manifest?.root) {
      throw new ManifestNotFoundError();
    }

    const board = await getBoardByPath(manifest.root);
    if (!board) {
      throw new BoardNotFoundError(manifest.root);
    }

    return board;
  });
}

/** Stores board with validation and path sanitization. Overwrites existing board. */
export async function storeBoard(path: string, board: Board): Promise<void> {
  return withErrorHandling("store board", async (database) => {
    const sanitizedPath = sanitizePath(path);
    const validatedBoard = validateData(BoardSchema, board, "board");

    const tx = database.transaction([STORE_NAMES.BOARDS], "readwrite");

    try {
      const boardsStore = tx.objectStore(STORE_NAMES.BOARDS);
      const record: BoardRecord = {
        id: validatedBoard.id,
        path: sanitizedPath,
        data: validatedBoard,
      };
      await boardsStore.put(record);
      await tx.done;
    } catch (error) {
      try {
        await tx.abort();
      } catch (abortError) {
        console.error("Failed to abort board transaction:", abortError);
      }
      throw new TransactionError([STORE_NAMES.BOARDS], error as Error);
    }
  });
}

/** Gets multiple boards by IDs. Batch operation - more efficient than individual calls. */
export async function getBoardsByIds(ids: string[]): Promise<(Board | null)[]> {
  return withErrorHandling("get boards by ids", async (database) => {
    const validIds = ids.map(id => validateId(id, "board"));
    const tx = database.transaction([STORE_NAMES.BOARDS], "readonly");
    const boardsStore = tx.objectStore(STORE_NAMES.BOARDS);

    const results = await Promise.all(
      validIds.map(async (id) => {
        const result = await boardsStore.get(id);
        return result?.data ?? null;
      }),
    );

    return results;
  });
}

// ===== MEDIA OPERATIONS =====

/** Gets image by ID. Returns null if not found. */
export async function getImageById(id: string): Promise<Blob | null> {
  return withErrorHandling("get image by id", async (database) => {
    const validId = validateId(id, "image");
    const tx = database.transaction([STORE_NAMES.IMAGES], "readonly");
    const imagesStore = tx.objectStore(STORE_NAMES.IMAGES);
    const result = await imagesStore.get(validId);
    return result?.data ?? null;
  });
}

/** Gets image by ID. Throws MediaNotFoundError if not found. */
export async function getImageByIdOrThrow(id: string): Promise<Blob> {
  return withErrorHandling("get image by id (strict)", async () => {
    const image = await getImageById(id);
    if (!image) {
      throw new MediaNotFoundError("image", id);
    }
    return image;
  });
}

/** Gets sound by ID. Returns null if not found. */
export async function getSoundById(id: string): Promise<Blob | null> {
  return withErrorHandling("get sound by id", async (database) => {
    const validId = validateId(id, "sound");
    const tx = database.transaction([STORE_NAMES.SOUNDS], "readonly");
    const soundsStore = tx.objectStore(STORE_NAMES.SOUNDS);
    const result = await soundsStore.get(validId);
    return result?.data ?? null;
  });
}

/** Gets sound by ID. Throws MediaNotFoundError if not found. */
export async function getSoundByIdOrThrow(id: string): Promise<Blob> {
  return withErrorHandling("get sound by id (strict)", async () => {
    const sound = await getSoundById(id);
    if (!sound) {
      throw new MediaNotFoundError("sound", id);
    }
    return sound;
  });
}

/** Gets multiple images by IDs. Batch operation - more efficient than individual calls. */
export async function getImagesByIds(ids: string[]): Promise<(Blob | null)[]> {
  return withErrorHandling("get images by ids", async (database) => {
    const validIds = ids.map(id => validateId(id, "image"));
    const tx = database.transaction([STORE_NAMES.IMAGES], "readonly");
    const imagesStore = tx.objectStore(STORE_NAMES.IMAGES);

    const results = await Promise.all(
      validIds.map(async (id) => {
        const result = await imagesStore.get(id);
        return result?.data ?? null;
      }),
    );

    return results;
  });
}

/** Gets multiple sounds by IDs. Batch operation - more efficient than individual calls. */
export async function getSoundsByIds(ids: string[]): Promise<(Blob | null)[]> {
  return withErrorHandling("get sounds by ids", async (database) => {
    const validIds = ids.map(id => validateId(id, "sound"));
    const tx = database.transaction([STORE_NAMES.SOUNDS], "readonly");
    const soundsStore = tx.objectStore(STORE_NAMES.SOUNDS);

    const results = await Promise.all(
      validIds.map(async (id) => {
        const result = await soundsStore.get(id);
        return result?.data ?? null;
      }),
    );

    return results;
  });
}

/** Stores multiple media records concurrently. More efficient than individual stores. */
export async function storeMediaRecords(
  type: keyof Pick<typeof STORE_NAMES, "IMAGES" | "SOUNDS">,
  records: MediaRecord[],
): Promise<void> {
  const storeName = STORE_NAMES[type];
  return withErrorHandling(`store ${storeName}`, async (database) => {
    // Validate all records before storing
    records.forEach(record => {
      validateId(record.id, type.toLowerCase().slice(0, -1)); // "images" -> "image"
      sanitizePath(record.path);
    });

    const tx = database.transaction([storeName], "readwrite");

    try {
      const store = tx.objectStore(storeName);
      await Promise.all(records.map((record) => store.put(record)));
      await tx.done;
    } catch (error) {
      try {
        await tx.abort();
      } catch (abortError) {
        console.error(`Failed to abort ${storeName} transaction:`, abortError);
      }
      throw new TransactionError([storeName], error as Error);
    }
  });
}

// ===== HIGH-LEVEL OPERATIONS =====

/**
 * Imports OBZ file into database.
 * Limit: 50MB. Common fails: corrupted zip, invalid OBF schema, quota exceeded.
 */
export async function importOBZFile(file: File): Promise<void> {
  return withErrorHandling("import OBZ file", async () => {
    validateFileSize(file.size);

    const buffer = await file.arrayBuffer();
    const obz = new Uint8Array(buffer);
    const content = await unzipOBZ(obz);
    await storeOBZContent(content);
  });
}

/**
 * Stores complete OBZ content with validation and concurrent operations.
 * High-performance bulk import - validates all data before storing.
 */
export async function storeOBZContent(content: OBZContent): Promise<void> {
  return withErrorHandling("store OBZ content", async (database) => {
    const { manifest, boards, images, sounds } = content;

    const validatedManifest = validateData(
      ManifestSchema,
      manifest,
      "manifest",
    );

    const allStores = [
      STORE_NAMES.MANIFESTS,
      STORE_NAMES.BOARDS,
      STORE_NAMES.IMAGES,
      STORE_NAMES.SOUNDS,
    ];
    const tx = database.transaction(allStores, "readwrite");

    try {
      // Store manifest
      const manifestsStore = tx.objectStore(STORE_NAMES.MANIFESTS);
      const manifestRecord: ManifestRecord = {
        id: MANIFEST_ID,
        data: validatedManifest,
      };
      await manifestsStore.put(manifestRecord);

      // Create ID mappings
      const imageIdsByPath = createIdPathMapping(
        validatedManifest.paths.images,
      );
      const soundIdsByPath = createIdPathMapping(
        validatedManifest.paths.sounds,
      );

      // Store boards with validation and concurrent operations
      const boardsStore = tx.objectStore(STORE_NAMES.BOARDS);
      const boardOperations = Object.entries(boards).map(([path, board]) => {
        const validatedBoard = validateData(
          BoardSchema,
          board,
          `board at ${path}`,
        );
        const boardRecord: BoardRecord = {
          id: validatedBoard.id,
          path: sanitizePath(path),
          data: validatedBoard,
        };
        return boardsStore.put(boardRecord);
      });

      // Store images concurrently
      const imagesStore = tx.objectStore(STORE_NAMES.IMAGES);
      const imageOperations = Object.entries(images).map(([path, image]) => {
        const imageRecord: MediaRecord = {
          id: imageIdsByPath[path],
          path: sanitizePath(path),
          data: image,
        };
        return imagesStore.put(imageRecord);
      });

      // Store sounds concurrently
      const soundsStore = tx.objectStore(STORE_NAMES.SOUNDS);
      const soundOperations = Object.entries(sounds).map(([path, sound]) => {
        const soundRecord: MediaRecord = {
          id: soundIdsByPath[path],
          path: sanitizePath(path),
          data: sound,
        };
        return soundsStore.put(soundRecord);
      });

      // Execute all operations concurrently
      await Promise.all([
        ...boardOperations,
        ...imageOperations,
        ...soundOperations,
      ]);

      await tx.done;
    } catch (error) {
      console.error("OBZ content transaction failed", error);
      try {
        await tx.abort();
      } catch (abortError) {
        console.error("Failed to abort OBZ transaction:", abortError);
      }
      throw new TransactionError(allStores, error as Error);
    }
  });
}

// Database will be initialized on first use - no module-level side effects
