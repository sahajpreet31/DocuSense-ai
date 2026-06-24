export function getCachedTabDataSync(cache, documentId, tabName) {
  return cache.current[documentId]?.[tabName];
}

export async function getCachedTabData(cache, documentId, tabName, fetchFn) {
  if (!cache.current[documentId]) {
    cache.current[documentId] = {};
  }

  if (cache.current[documentId][tabName] !== undefined) {
    return cache.current[documentId][tabName];
  }

  const data = await fetchFn();
  cache.current[documentId][tabName] = data;
  return data;
}
