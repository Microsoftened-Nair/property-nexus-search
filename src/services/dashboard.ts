// Service to fetch recent searches from the backend
export async function fetchRecentSearches(limit = 5) {
  const url = `http://localhost:5000/api/searches?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch recent searches");
  return res.json();
}
