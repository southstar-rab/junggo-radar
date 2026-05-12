import * as cheerio from "cheerio";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
};

function cleanText(text = "") {
  return text.replace(/\s+/g, " ").trim();
}

function toNumberPrice(text = "") {
  const num = String(text).replace(/[^\d]/g, "");
  return num ? Number(num) : null;
}

async function searchBunjang(query) {
  const url = `https://m.bunjang.co.kr/search/products?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers, cache: "no-store" });

  if (!response.ok) {
    throw new Error(`번개장터 응답 실패: HTTP ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const results = [];
  const seen = new Set();

  $("a").each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = cleanText($(el).text());

    if (!href.includes("/products/")) return;
    if (!text || text.length < 3) return;

    const priceMatch = text.match(/([0-9,]+)\s*원/);
    const priceText = priceMatch ? priceMatch[0] : "";
    let title = cleanText(text.replace(priceText, ""));
    title = title.replace(/찜|광고|배송비포함/g, "").trim();

    if (title.length < 2) return;

    const image =
      $(el).find("img").attr("src") ||
      $(el).find("img").attr("data-src") ||
      $(el).find("img").attr("data-original") ||
      "";

    const fullUrl = href.startsWith("http") ? href : `https://m.bunjang.co.kr${href}`;
    const key = `${title}-${priceText}-${fullUrl}`;
    if (seen.has(key)) return;
    seen.add(key);

    results.push({
      title: title.slice(0, 90),
      price: toNumberPrice(priceText),
      displayPrice: priceText || "가격 확인",
      platform: "번개장터",
      image,
      url: fullUrl,
      time: "원본 확인",
      location: "원본 확인",
    });
  });

  return results.slice(0, 20);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get("q") || "").trim();

  if (!query) {
    return Response.json({ error: "검색어가 필요합니다.", count: 0, items: [] }, { status: 400 });
  }

  try {
    const bunjangItems = await searchBunjang(query);

    return Response.json({
      query,
      count: bunjangItems.length,
      items: bunjangItems,
      sourceStatus: [{ source: "번개장터", ok: true, count: bunjangItems.length }],
      warning: bunjangItems.length ? "" : "번개장터에서 결과를 찾지 못했습니다. 구조 변경 또는 차단 가능성이 있습니다.",
    });
  } catch (error) {
    return Response.json({
      query,
      count: 0,
      items: [],
      sourceStatus: [{ source: "번개장터", ok: false, error: error.message }],
      error: error.message,
      warning: "실제 검색 연결 실패. 플랫폼 차단 또는 구조 변경 가능성이 있습니다.",
    });
  }
}
