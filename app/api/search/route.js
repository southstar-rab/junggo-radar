export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get("q") || "").trim();
  return Response.json({ query, count: 0, items: [], warning: "실제 검색 연결은 다음 단계에서 강화합니다." });
}
