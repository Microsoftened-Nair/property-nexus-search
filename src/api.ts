// Simple API utility for backend requests
export async function fetchSearchResults(query: string, type: string = "all") {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (type && type !== "all") params.append("type", type);
  // Use the correct API prefix
  const url = `http://localhost:5000/api/search?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch search results");
  return res.json();
}
