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

async function fetchHtml(url) {
  const res = await fetch(url, { headers, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

async function searchBunjang(query) {
  const url = `https://m.bunjang.co.kr/search/products?q=${encodeURIComponent(query)}`;
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);
  const results = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = cleanText($(el).text());
    if (!href.includes("/products/") || !text) return;

    const priceMatch = text.match(/([0-9,]+)\s*원/);
    const priceText = priceMatch ? priceMatch[0] : "";
    const title = cleanText(text.replace(priceText, "")).slice(0, 80);
    const image = $(el).find("img").attr("src") || $(el).find("img").attr("data-src") || "";
    const fullUrl = href.startsWith("http") ? href : `https://m.bunjang.co.kr${href}`;

    if (title.length < 2) return;
    results.push({ title, price: toNumberPrice(priceText), displayPrice: priceText || "가격 확인", platform: "번개장터", image, url: fullUrl });
  });

  return results.slice(0, 15);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get("q") || "").trim();

  if (!query) {
    return Response.json({ error: "검색어가 필요합니다." }, { status: 400 });
  }

  try {
    const bunjang = await searchBunjang(query);
    return Response.json({
      query,
      count: bunjang.length,
      items: bunjang,
      warning: "실제 플랫폼 연결은 테스트 단계입니다. 사이트 구조나 차단 여부에 따라 결과가 없을 수 있습니다.",
    });
  } catch (error) {
    return Response.json({
      query,
      count: 0,
      items: [],
      error: error.message,
      warning: "실제 검색 연결 실패. 플랫폼 차단 또는 구조 변경 가능성이 있습니다.",
    });
  }
}
