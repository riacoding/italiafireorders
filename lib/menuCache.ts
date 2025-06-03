import QuickLRU from 'quick-lru'
import { fetchMenuWithItems } from '@/lib/fetchMenuWithItems'

type MenuCacheKey = string
type MenuCacheValue = Awaited<ReturnType<typeof fetchMenuWithItems>>

let version = 0

const lru = new QuickLRU<MenuCacheKey, MenuCacheValue>({
  maxSize: 100,
})

export function bumpCacheVersion() {
  version++
}

export async function getCachedMenu(loc: string) {
  const key = `${loc}:${version}`
  const cached = lru.get(key)
  if (cached) {
    console.log('cache hit')
    return cached
  }

  const data = await fetchMenuWithItems(loc)

  // ✅ Set TTL per entry (5 minutes = 300_000 ms)
  lru.set(loc, data, { maxAge: 1000 * 60 * 5 })

  return data
}
