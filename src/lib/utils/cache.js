// Простая реализация кэша с TTL
const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 минут

export function getCached(key) {
	const entry = cache.get(key);
	if (entry && Date.now() - entry.time < TTL) {
		return entry.value;
	}
	return null;
}

export function setCached(key, value) {
	cache.set(key, { value, time: Date.now() });
}
