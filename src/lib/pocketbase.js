import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090');

// Keep auth token fresh across page reloads (PocketBase handles this automatically)
pb.autoCancellation(false);
