import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    // Let kv-asset-handler serve files from the generated `public/` asset manifest.
    return await getAssetFromKV(event);
  } catch (e) {
    // Fallback: return a simple 404 for missing assets
    return new Response('Not Found', { status: 404 });
  }
}
