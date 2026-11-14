import type { MediaItem, Project } from '../../types';
import { uid } from '../../utils/format';

/**
 * IndexedDB persistence. Two stores:
 *  - projects: small JSON records
 *  - media: original video Blobs (browsers keep Blobs on disk, not in JS memory)
 * Browsers may evict this data; the UI warns users (see StorageNotice).
 */
const DB_NAME = 'clipforge';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('media')) db.createObjectStore('media', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error ?? new Error('IndexedDB is unavailable'));
    });
  }
  return dbPromise;
}

async function run<T>(store: 'projects' | 'media', mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const req = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error ?? new Error('Storage write failed'));
    tx.onabort = () => reject(tx.error ?? new Error('Storage is full or was blocked'));
  });
}

export async function listProjects(): Promise<Project[]> {
  const all = await run<Project[]>('projects', 'readonly', (s) => s.getAll());
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}
export const getProject = (id: string) => run<Project | undefined>('projects', 'readonly', (s) => s.get(id));
export const saveProject = (p: Project) => run('projects', 'readwrite', (s) => s.put({ ...p, updatedAt: Date.now() }));
export const saveMedia = (m: MediaItem) => run('media', 'readwrite', (s) => s.put(m));
export const getMedia = (id: string) => run<MediaItem | undefined>('media', 'readonly', (s) => s.get(id));
const deleteMedia = (id: string) => run('media', 'readwrite', (s) => s.delete(id));

export async function renameProject(id: string, name: string): Promise<void> {
  const p = await getProject(id);
  if (p) await saveProject({ ...p, name: name.trim() || p.name });
}

/** Copies the project record; the video file is shared, not duplicated on disk. */
export async function duplicateProject(id: string): Promise<void> {
  const p = await getProject(id);
  if (!p) return;
  const now = Date.now();
  await saveProject({ ...p, id: uid(), name: `${p.name} copy`, createdAt: now, updatedAt: now });
}

/** Deletes the project and any media no other project still uses. */
export async function deleteProject(id: string): Promise<void> {
  const p = await getProject(id);
  await run('projects', 'readwrite', (s) => s.delete(id));
  if (!p) return;
  const remaining = await listProjects();
  const inUse = new Set(remaining.flatMap((r) => r.mediaIds));
  for (const m of p.mediaIds) if (!inUse.has(m)) await deleteMedia(m);
}

export async function storageEstimate(): Promise<{ usage: number; quota: number; persisted: boolean | null } | null> {
  if (!navigator.storage?.estimate) return null;
  const e = await navigator.storage.estimate();
  const persisted = navigator.storage.persisted ? await navigator.storage.persisted() : null;
  return { usage: e.usage ?? 0, quota: e.quota ?? 0, persisted };
}

export async function requestPersistence(): Promise<boolean> {
  return navigator.storage?.persist ? navigator.storage.persist() : false;
}
