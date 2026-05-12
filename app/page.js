"use client";

import { useMemo, useState } from "react";

const sampleItems = [
  {
    id:1,title:"PXG 배틀레디 배트어택 퍼터",price:420000,platform:"번개장터",location:"경기 성남시 분당구",region:"경기",time:"5분 전",condition:"거의 새상품",views:24,likes:12,chats:5,
    image:"https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop",
    badge:"시세보다 18% 저렴",cheap:true,new:true,hidden:false,safe:true,
    desc:"현재 시세보다 약 18% 저렴해요. 컨디션이 매우 좋아 빠른 판매가 예상돼요!"
  },
  {
    id:2,title:"PXG 클로저 GEN2 퍼터 34인치",price:350000,platform:"번개장터",location:"서울 강남구",region:"서울",time:"7분 전",condition:"사용감 적음",views:18,likes:8,chats:2,
    image:"https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1200&auto=format&fit=crop",
    badge:"시세보다 12% 저렴",cheap:true,new:true,hidden:false,safe:true,
    desc:"최근 평균가보다 저렴한 편이에요. 등록된 지 얼마 되지 않아 먼저 확인해볼 만해요."
  },
  {
    id:3,title:"PXG 헬캣 퍼터 33인치",price:300000,platform:"중고나라",location:"인천 연수구",region:"인천",time:"15분 전",condition:"사용감 있음",views:32,likes:5,chats:1,
    image:"https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop",
    badge:"평균 시세 수준",cheap:false,new:true,hidden:false,safe:false,
    desc:"가격은 평균 시세 수준이에요. 상태 사진을 꼼꼼히 확인하는 것이 좋아요."
  },
  {
    id:4,title:"PXG 스파이더 퍼터 일자형",price:280000,platform:"네이버카페",location:"골프사랑 카페",region:"서울",time:"20분 전",condition:"사용감 적음",views:13,likes:3,chats:0,
    image:"https://images.unsplash.com/photo-1530028828-25e8270793c5?q=80&w=1200&auto=format&fit=crop",
    badge:"숨은 매물",cheap:true,new:false,hidden:true,safe:false,
    desc:"조회수는 낮지만 가격이 좋은 숨은 매물이에요. 카페 거래 특성상 판매자 확인이 필요해요."
  },
  {
    id:5,title:"PXG 트랜스포머 퍼터 33인치",price:450000,platform:"당근마켓",location:"경기 용인시 수지구",region:"경기",time:"25분 전",condition:"거의 새상품",views:41,likes:9,chats:4,
    image:"https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop",
    badge:"인기 상승",cheap:false,new:false,hidden:false,safe:false,
    desc:"조회와 찜 반응이 빠르게 올라가고 있어요. 가격 협상 가능 여부를 확인해보세요."
  },
  {
    id:6,title:"아이폰 15 프로 256GB 내추럴 티타늄",price:980000,platform:"번개장터",location:"서울 마포구",region:"서울",time:"12분 전",condition:"사용감 적음",views:305,likes:27,chats:11,
    image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
    badge:"인기 검색 매물",cheap:false,new:true,hidden:false,safe:true,
    desc:"조회수가 빠르게 올라가고 있는 인기 매물이에요."
  }
];

const platformIcon = (platform) => {
  if (platform === "번개장터") return "⚡";
  if (platform === "중고나라") return "●";
  if (platform === "당근마켓") return "🥕";
  if (platform === "네이버카페") return "N";
  return "●";
};

const formatPrice = (price) => price.toLocaleString("ko-KR") + "원";

export default function Home() {
  const [query, setQuery] = useState("PXG 퍼터");
  const [submittedQuery, setSubmittedQuery] = useState("PXG 퍼터");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["번개장터", "중고나라", "당근마켓"]);
  const [sort, setSort] = useState("latest");
  const [region, setRegion] = useState("전체");
  const [condition, setCondition] = useState("전체");
  const [cheapOnly, setCheapOnly] = useState(true);
  const [newOnly, setNewOnly] = useState(true);
  const [safeOnly, setSafeOnly] = useState(false);
  const [hiddenOnly, setHiddenOnly] = useState(false);
  const [liked, setLiked] = useState([1]);
  const [selectedId, setSelectedId] = useState(1);
  const [saved, setSaved] = useState(["PXG 퍼터", "아이폰 15", "플레이스테이션5", "골프 드라이버"]);

  const filtered = useMemo(() => {
    const q = submittedQuery.trim().toLowerCase();
    let list = sampleItems.filter((item) => {
      const matchQ = !q || item.title.toLowerCase().includes(q) || (q.includes("퍼터") && item.title.includes("퍼터")) || (q.includes("pxg") && item.title.includes("PXG"));
      const matchPlatform = selectedPlatforms.includes(item.platform);
      const matchRegion = region === "전체" || item.region === region;
      const matchCondition = condition === "전체" || item.condition === condition;
      const matchCheap = !cheapOnly || item.cheap;
      const matchNew = !newOnly || item.new;
      const matchSafe = !safeOnly || item.safe;
      const matchHidden = !hiddenOnly || item.hidden;
      return matchQ && matchPlatform && matchRegion && matchCondition && matchCheap && matchNew && matchSafe && matchHidden;
    });

    if (!list.length) {
      list = sampleItems.filter((item) => selectedPlatforms.includes(item.platform));
    }

    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "popular") return [...list].sort((a, b) => b.likes - a.likes);
    return list;
  }, [submittedQuery, selectedPlatforms, sort, region, condition, cheapOnly, newOnly, safeOnly, hiddenOnly]);

  const selectedItem = sampleItems.find((item) => item.id === selectedId) || filtered[0];

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) => prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]);
  };

  const search = () => {
    setSubmittedQuery(query.trim() || "PXG 퍼터");
    setSelectedId(null);
  };

  const toggleLike = (id) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]);
  };

  const saveSearch = () => {
    if (!submittedQuery) return;
    setSaved((prev) => prev.includes(submittedQuery) ? prev : [submittedQuery, ...prev]);
  };

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="logo" aria-label="중고레이더 로고">
            <div className="radar">
              <span className="ring r1"></span>
              <span className="ring r2"></span>
              <span className="ring r3"></span>
              <span className="sweep"></span>
              <span className="dot"></span>
              <span className="box">🎁</span>
            </div>
            <span className="handle"></span>
          </div>
          <div>
            <div className="brand-title">중고<span>레이더</span></div>
            <div className="brand-sub">여러 플랫폼을 한눈에, 좋은 중고를 빠르게</div>
          </div>
        </div>

        <div className="main-search">
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} placeholder="찾고 싶은 상품을 검색하세요" />
          <button onClick={search}>검색</button>
        </div>

        <nav className="topnav">
          <button>♡<small>찜 목록</small></button>
          <button>▱<small>저장 검색</small></button>
          <button className="bell">🔔<i>3</i><small>알림</small></button>
          <button>◎<small>마이페이지</small></button>
        </nav>
      </header>

      <section className="platform-row">
        <button className="select-all">전체 플랫폼 ▾</button>
        {["번개장터", "중고나라", "당근마켓", "네이버카페"].map((platform) => (
          <label key={platform}>
            <input type="checkbox" checked={selectedPlatforms.includes(platform)} onChange={() => togglePlatform(platform)} />
            <span>{platformIcon(platform)}</span> {platform}
          </label>
        ))}
        <div className="sort-box">
          <span>정렬 :</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">최신순</option>
            <option value="low">낮은 가격순</option>
            <option value="high">높은 가격순</option>
            <option value="popular">찜 많은 순</option>
          </select>
        </div>
      </section>

      <main className="layout">
        <aside className="filter-panel">
          <div className="panel-title">
            <h3>필터</h3>
            <button onClick={() => {
              setRegion("전체"); setCondition("전체"); setCheapOnly(true); setNewOnly(true); setSafeOnly(false); setHiddenOnly(false);
            }}>초기화 ↻</button>
          </div>

          <div className="filter-group">
            <label>가격</label>
            <div className="price-inputs">
              <input placeholder="최소" />
              <span>~</span>
              <input placeholder="최대" />
              <span>원</span>
            </div>
          </div>

          <div className="filter-group">
            <label>지역</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="전체">전체 지역</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
            </select>
          </div>

          <div className="filter-group">
            <label>상품 상태</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value)}>
              <option value="전체">전체</option>
              <option value="거의 새상품">거의 새상품</option>
              <option value="사용감 적음">사용감 적음</option>
              <option value="사용감 있음">사용감 있음</option>
            </select>
          </div>

          <label className="switch-row">시세보다 저렴 <input checked={cheapOnly} onChange={(e) => setCheapOnly(e.target.checked)} type="checkbox" /><span></span></label>
          <label className="switch-row">방금 등록 <input checked={newOnly} onChange={(e) => setNewOnly(e.target.checked)} type="checkbox" /><span></span></label>
          <label className="switch-row">안전결제만 보기 <input checked={safeOnly} onChange={(e) => setSafeOnly(e.target.checked)} type="checkbox" /><span></span></label>
          <label className="switch-row">숨은 매물만 보기 <input checked={hiddenOnly} onChange={(e) => setHiddenOnly(e.target.checked)} type="checkbox" /><span></span></label>
        </aside>

        <section className="results-section">
          <div className="result-head">
            <h2><span>'{submittedQuery}'</span> 검색 결과 <em>{filtered.length}개</em></h2>
            <div className="tabs">
              {[
                ["latest", "최신순"],
                ["low", "낮은 가격순"],
                ["high", "높은 가격순"],
                ["popular", "찜 많은 순"],
              ].map(([value, label]) => (
                <button key={value} className={sort === value ? "active" : ""} onClick={() => setSort(value)}>{label}</button>
              ))}
            </div>
          </div>

          <div className="results-list">
            {filtered.map((item) => (
              <article key={item.id} className={`card ${item.id === selectedId ? "active" : ""}`} onClick={() => setSelectedId(item.id)}>
                <img src={item.image} alt={item.title} />
                <div>
                  <div className="badges">
                    <span className="platform-badge">{platformIcon(item.platform)} {item.platform}</span>
                    {item.new && <span className="new-badge">NEW</span>}
                    {item.hidden && <span className="hidden-badge">숨은 매물</span>}
                  </div>
                  <h3>{item.title}</h3>
                  <p className="price">{formatPrice(item.price)}</p>
                  <div className="meta"><span>◷ {item.time}</span><span>⌖ {item.location}</span><span>조회 {item.views}</span></div>
                  <span className="deal-badge">{item.badge}</span>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <button className={`like ${liked.includes(item.id) ? "on" : ""}`} onClick={() => toggleLike(item.id)}>{liked.includes(item.id) ? "♥" : "♡"}</button>
                  <div className="like-count">{item.likes}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="saved-box">
            <strong>저장된 검색어</strong>
            <div className="saved-keywords">
              {saved.map((word) => <button key={word} className="keyword" onClick={() => { setQuery(word); setSubmittedQuery(word); }}>{word} ×</button>)}
            </div>
            <button className="saveSearchBtn" onClick={saveSearch}>+ 현재 검색어 저장</button>
          </div>
        </section>

        <aside className="detail-panel">
          {selectedItem ? (
            <>
              <div className="hero">
                <img src={selectedItem.image} alt={selectedItem.title} />
                <span className="counter">1 / 6</span>
              </div>
              <div className="detail-body">
                <div className="badges"><span className="platform-badge">{platformIcon(selectedItem.platform)} {selectedItem.platform}</span><span className="new-badge">{selectedItem.new ? "방금 등록" : "추천 매물"}</span></div>
                <h2>{selectedItem.title}</h2>
                <p className="detail-price">{formatPrice(selectedItem.price)}</p>
                <span className="deal-badge">{selectedItem.badge}</span>
                <div className="detail-stats">
                  <div><span>지역</span><strong>{selectedItem.location}</strong></div>
                  <div><span>등록</span><strong>{selectedItem.time}</strong></div>
                  <div><span>조회수</span><strong>{selectedItem.views}</strong></div>
                  <div><span>찜</span><strong>{selectedItem.likes}</strong></div>
                </div>
                <div className="ai-box">
                  <strong>🤖 AI 한줄평</strong>
                  <p>{selectedItem.desc}</p>
                </div>
                <button className="primary">원본 보기 ({selectedItem.platform}) ↗</button>
                <div className="detail-actions">
                  <button onClick={() => toggleLike(selectedItem.id)}>{liked.includes(selectedItem.id) ? "♥ 찜해제" : "♡ 찜하기"}</button>
                  <button>💬 판매자 채팅</button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-detail">상품을 선택하면 상세 정보가 표시됩니다.</div>
          )}
        </aside>
      </main>

      <footer className="mobile-nav">
        <button>⌂<span>홈</span></button>
        <button className="active">⌕<span>검색</span></button>
        <button>🔔<span>알림</span></button>
        <button>♡<span>찜</span></button>
        <button>◎<span>MY</span></button>
      </footer>
    </>
  );
}
