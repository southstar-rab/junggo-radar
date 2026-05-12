"use client";

import { useMemo, useState } from "react";

const sampleItems = [
  {id:"sample-1",title:"PXG 배틀레디 배트어택 퍼터",price:420000,displayPrice:"420,000원",platform:"번개장터",location:"경기 성남시 분당구",region:"경기",time:"5분 전",condition:"거의 새상품",views:24,likes:12,chats:5,image:"https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop",badge:"시세보다 18% 저렴",cheap:true,new:true,hidden:false,safe:true,desc:"현재 시세보다 약 18% 저렴해요. 컨디션이 매우 좋아 빠른 판매가 예상돼요!"},
  {id:"sample-2",title:"PXG 클로저 GEN2 퍼터 34인치",price:350000,displayPrice:"350,000원",platform:"번개장터",location:"서울 강남구",region:"서울",time:"7분 전",condition:"사용감 적음",views:18,likes:8,chats:2,image:"https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1200&auto=format&fit=crop",badge:"시세보다 12% 저렴",cheap:true,new:true,hidden:false,safe:true,desc:"최근 평균가보다 저렴한 편이에요. 등록된 지 얼마 되지 않아 먼저 확인해볼 만해요."},
  {id:"sample-3",title:"PXG 헬캣 퍼터 33인치",price:300000,displayPrice:"300,000원",platform:"중고나라",location:"인천 연수구",region:"인천",time:"15분 전",condition:"사용감 있음",views:32,likes:5,chats:1,image:"https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop",badge:"평균 시세 수준",cheap:false,new:true,hidden:false,safe:false,desc:"가격은 평균 시세 수준이에요. 상태 사진을 꼼꼼히 확인하는 것이 좋아요."},
  {id:"sample-4",title:"아이폰 15 프로 256GB 내추럴 티타늄",price:980000,displayPrice:"980,000원",platform:"번개장터",location:"서울 마포구",region:"서울",time:"12분 전",condition:"사용감 적음",views:305,likes:27,chats:11,image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",badge:"인기 검색 매물",cheap:false,new:true,hidden:false,safe:true,desc:"조회수가 빠르게 올라가고 있는 인기 매물이에요."},
  {id:"sample-5",title:"플레이스테이션5 디스크 에디션 풀박스",price:430000,displayPrice:"430,000원",platform:"중고나라",location:"경기 고양시 덕양구",region:"경기",time:"9분 전",condition:"사용감 적음",views:112,likes:15,chats:6,image:"https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1200&auto=format&fit=crop",badge:"방금 등록",cheap:true,new:true,hidden:false,safe:true,desc:"최근 검색량이 높은 인기 상품이에요. 풀박스 구성이라 비교적 빠르게 판매될 수 있어요."}
];

const platformIcon = (platform) => {
  if (platform === "번개장터") return "⚡";
  if (platform === "중고나라") return "●";
  if (platform === "당근마켓") return "🥕";
  if (platform === "네이버카페") return "N";
  return "●";
};
const formatPrice = (item) => item.displayPrice || (item.price ? item.price.toLocaleString("ko-KR") + "원" : "가격 확인");

export default function Home() {
  const [query, setQuery] = useState("PXG 퍼터");
  const [submittedQuery, setSubmittedQuery] = useState("PXG 퍼터");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["번개장터", "중고나라", "당근마켓"]);
  const [sort, setSort] = useState("latest");
  const [region, setRegion] = useState("전체");
  const [condition, setCondition] = useState("전체");
  const [cheapOnly, setCheapOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [safeOnly, setSafeOnly] = useState(false);
  const [hiddenOnly, setHiddenOnly] = useState(false);
  const [liked, setLiked] = useState(["sample-1"]);
  const [selectedId, setSelectedId] = useState("sample-1");
  const [saved, setSaved] = useState(["PXG 퍼터", "아이폰 15", "플레이스테이션5", "골프 드라이버"]);
  const [activeMobileTab, setActiveMobileTab] = useState("검색");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [realItems, setRealItems] = useState([]);
  const [apiStatus, setApiStatus] = useState("대기 중: 검색하면 실제 API 연결을 먼저 시도합니다.");
  const [apiState, setApiState] = useState("idle");

  const sourceItems = realItems.length ? realItems : sampleItems;

  const filtered = useMemo(() => {
    const q = submittedQuery.trim().toLowerCase();
    let list = sourceItems.filter((item) => {
      const normalizedTitle = item.title.toLowerCase().replace(/\s/g, "");
      const normalizedQuery = q.replace(/\s/g, "");
      const matchQ = !q || normalizedTitle.includes(normalizedQuery) || item.title.toLowerCase().includes(q) || (q.includes("퍼터") && item.title.includes("퍼터")) || (q.includes("pxg") && item.title.includes("PXG")) || (q.includes("아이폰") && item.title.includes("아이폰")) || (q.includes("플레이스테이션") && item.title.includes("플레이스테이션")) || (q.includes("ps5") && item.title.includes("플레이스테이션"));
      return matchQ && selectedPlatforms.includes(item.platform) && (region === "전체" || item.region === region) && (condition === "전체" || item.condition === condition) && (!cheapOnly || item.cheap) && (!newOnly || item.new) && (!safeOnly || item.safe) && (!hiddenOnly || item.hidden);
    });
    if (realItems.length) list = sourceItems.filter((item) => selectedPlatforms.includes(item.platform));
    if (sort === "low") return [...list].sort((a, b) => (a.price || 999999999) - (b.price || 999999999));
    if (sort === "high") return [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "popular") return [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    return list;
  }, [submittedQuery, selectedPlatforms, sort, region, condition, cheapOnly, newOnly, safeOnly, hiddenOnly, sourceItems, realItems.length]);

  const selectedItem = sourceItems.find((item) => item.id === selectedId) || filtered[0];

  const search = async () => {
    const keyword = query.trim() || "PXG 퍼터";
    setSubmittedQuery(keyword);
    setCheapOnly(false); setNewOnly(false); setSafeOnly(false); setHiddenOnly(false);
    setSelectedId(null); setActiveMobileTab("검색");
    setApiState("loading");
    setApiStatus("실제 검색 API 연결 중...");

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      if (data.items && data.items.length) {
        const mapped = data.items.map((item, index) => ({
          id: `real-${index}-${item.url || item.title}`,
          title: item.title || "제목 없음",
          price: item.price || null,
          displayPrice: item.displayPrice || "가격 확인",
          platform: item.platform || "번개장터",
          location: item.location || "원본 확인",
          region: "전체",
          time: item.time || "원본 확인",
          condition: "전체",
          views: 0,
          likes: 0,
          chats: 0,
          image: item.image || "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop",
          badge: "실제 검색 결과",
          cheap: false,
          new: false,
          hidden: false,
          safe: false,
          url: item.url,
          desc: "실제 플랫폼에서 가져온 검색 결과입니다. 원본 페이지에서 상태와 판매자 정보를 꼭 확인하세요."
        }));
        setRealItems(mapped);
        setSelectedId(mapped[0].id);
        setApiState("success");
        setApiStatus(`실제 API 연결 성공: ${mapped.length}개 결과를 가져왔습니다.`);
      } else {
        setRealItems([]);
        setApiState("error");
        setApiStatus(data.warning || data.error || "실제 결과가 없어 샘플 데이터로 표시합니다.");
      }
    } catch (error) {
      setRealItems([]);
      setApiState("error");
      setApiStatus(`실제 API 연결 실패: ${error.message}. 샘플 데이터로 표시합니다.`);
    }
  };

  const toggleLike = (id) => setLiked((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]);
  const togglePlatform = (p) => setSelectedPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  const resetFilters = () => { setRegion("전체"); setCondition("전체"); setCheapOnly(false); setNewOnly(false); setSafeOnly(false); setHiddenOnly(false); };
  const saveSearch = () => { if (submittedQuery && !saved.includes(submittedQuery)) setSaved((prev) => [submittedQuery, ...prev]); };

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="logo"><div className="radar"><span className="ring r1"></span><span className="ring r2"></span><span className="ring r3"></span><span className="sweep"></span><span className="dot"></span><span className="box">🎁</span></div><span className="handle"></span></div>
          <div><div className="brand-title">중고<span>레이더</span></div><div className="brand-sub">여러 플랫폼을 한눈에, 좋은 중고를 빠르게</div></div>
        </div>
        <div className="main-search"><input value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && search()} placeholder="찾고 싶은 상품을 검색하세요" /><button onClick={search}>검색</button></div>
        <nav className="topnav"><button>♡<small>찜 목록</small></button><button>▱<small>저장 검색</small></button><button>🔔<i>3</i><small>알림</small></button><button>◎<small>마이페이지</small></button></nav>
      </header>

      <section className="platform-row">
        <button className="select-all">전체 플랫폼 ▾</button>
        {["번개장터","중고나라","당근마켓","네이버카페"].map((p)=><label key={p}><input type="checkbox" checked={selectedPlatforms.includes(p)} onChange={()=>togglePlatform(p)} /><span>{platformIcon(p)}</span> {p}</label>)}
        <div className="sort-box"><span>정렬 :</span><select value={sort} onChange={(e)=>setSort(e.target.value)}><option value="latest">최신순</option><option value="low">낮은 가격순</option><option value="high">높은 가격순</option><option value="popular">찜 많은 순</option></select></div>
      </section>

      <main className="layout">
        <aside className={`filter-panel ${showMobileFilters ? "mobile-open" : ""}`}>
          <div className="panel-title"><h3>필터</h3><button onClick={resetFilters}>초기화 ↻</button></div>
          <div className="filter-group"><label>가격</label><div className="price-inputs"><input placeholder="최소" /><span>~</span><input placeholder="최대" /><span>원</span></div></div>
          <div className="filter-group"><label>지역</label><select value={region} onChange={(e)=>setRegion(e.target.value)}><option value="전체">전체 지역</option><option value="서울">서울</option><option value="경기">경기</option><option value="인천">인천</option></select></div>
          <div className="filter-group"><label>상품 상태</label><select value={condition} onChange={(e)=>setCondition(e.target.value)}><option value="전체">전체</option><option value="거의 새상품">거의 새상품</option><option value="사용감 적음">사용감 적음</option><option value="사용감 있음">사용감 있음</option></select></div>
          <label className="switch-row">시세보다 저렴 <input checked={cheapOnly} onChange={(e)=>setCheapOnly(e.target.checked)} type="checkbox" /><span></span></label>
          <label className="switch-row">방금 등록 <input checked={newOnly} onChange={(e)=>setNewOnly(e.target.checked)} type="checkbox" /><span></span></label>
          <label className="switch-row">안전결제만 보기 <input checked={safeOnly} onChange={(e)=>setSafeOnly(e.target.checked)} type="checkbox" /><span></span></label>
          <label className="switch-row">숨은 매물만 보기 <input checked={hiddenOnly} onChange={(e)=>setHiddenOnly(e.target.checked)} type="checkbox" /><span></span></label>
        </aside>

        <section className="results-section">
          <div className="mobile-tools"><button onClick={()=>setShowMobileFilters(!showMobileFilters)}>필터 {showMobileFilters ? "닫기" : "열기"}</button><button onClick={resetFilters}>필터 초기화</button></div>
          <div className={`api-status ${apiState}`}>{apiStatus}</div>
          <div className="result-head">
            <h2><span>'{submittedQuery}'</span> 검색 결과 <em>{filtered.length}개</em></h2>
            <div className="tabs">{[["latest","최신순"],["low","낮은 가격순"],["high","높은 가격순"],["popular","찜 많은 순"]].map(([v,l])=><button key={v} className={sort===v ? "active":""} onClick={()=>setSort(v)}>{l}</button>)}</div>
          </div>
          <div className="results-list">
            {filtered.length===0 && <div className="no-result"><strong>검색 결과가 없습니다.</strong><p>필터를 초기화하거나 다른 검색어를 입력해보세요.</p><button onClick={resetFilters}>필터 초기화</button></div>}
            {filtered.map((item)=>(
              <article key={item.id} className={`card ${item.id===selectedId ? "active":""}`} onClick={()=>setSelectedId(item.id)}>
                <img src={item.image} alt={item.title} />
                <div><div className="badges"><span className="platform-badge">{platformIcon(item.platform)} {item.platform}</span>{item.new && <span className="new-badge">NEW</span>}{item.hidden && <span className="hidden-badge">숨은 매물</span>}</div><h3>{item.title}</h3><p className="price">{formatPrice(item)}</p><div className="meta"><span>◷ {item.time}</span><span>⌖ {item.location}</span><span>조회 {item.views}</span></div><span className="deal-badge">{item.badge}</span></div>
                <div onClick={(e)=>e.stopPropagation()}><button className={`like ${liked.includes(item.id) ? "on":""}`} onClick={()=>toggleLike(item.id)}>{liked.includes(item.id) ? "♥":"♡"}</button><div className="like-count">{item.likes}</div></div>
              </article>
            ))}
          </div>
          <div className="saved-box"><strong>저장된 검색어</strong><div className="saved-keywords">{saved.map((word)=><button key={word} className="keyword" onClick={()=>{setQuery(word);setSubmittedQuery(word);}}>{word} ×</button>)}</div><button className="saveSearchBtn" onClick={saveSearch}>+ 현재 검색어 저장</button></div>
        </section>

        <aside className="detail-panel">
          {selectedItem ? <><div className="hero"><img src={selectedItem.image} alt={selectedItem.title}/><span className="counter">1 / 6</span></div><div className="detail-body"><div className="badges"><span className="platform-badge">{platformIcon(selectedItem.platform)} {selectedItem.platform}</span><span className="new-badge">{selectedItem.new ? "방금 등록":"추천 매물"}</span></div><h2>{selectedItem.title}</h2><p className="detail-price">{formatPrice(selectedItem)}</p><span className="deal-badge">{selectedItem.badge}</span><div className="detail-stats"><div><span>지역</span><strong>{selectedItem.location}</strong></div><div><span>등록</span><strong>{selectedItem.time}</strong></div><div><span>조회수</span><strong>{selectedItem.views}</strong></div><div><span>찜</span><strong>{selectedItem.likes}</strong></div></div><div className="ai-box"><strong>🤖 AI 한줄평</strong><p>{selectedItem.desc}</p></div><button className="primary" onClick={()=>selectedItem.url ? window.open(selectedItem.url, "_blank") : alert("샘플 데이터입니다. 실제 연결 결과는 원본 링크가 열립니다.")}>원본 보기 ({selectedItem.platform}) ↗</button><div className="detail-actions"><button onClick={()=>toggleLike(selectedItem.id)}>{liked.includes(selectedItem.id) ? "♥ 찜해제":"♡ 찜하기"}</button><button>💬 판매자 채팅</button></div></div></> : <div className="empty-detail">상품을 선택하면 상세 정보가 표시됩니다.</div>}
        </aside>
      </main>

      <footer className="mobile-nav">
        {[["홈","⌂"],["검색","⌕"],["알림","🔔"],["찜","♡"],["MY","◎"]].map(([label,icon])=>(
          <button key={label} className={activeMobileTab===label ? "active":""} onClick={()=>{setActiveMobileTab(label); if(label==="홈"||label==="검색") window.scrollTo({top:0,behavior:"smooth"}); if(label==="알림") alert("알림 기능은 다음 단계에서 실제 저장 검색어와 연결할 예정입니다."); if(label==="찜") alert(`현재 찜한 상품은 ${liked.length}개입니다. 다음 단계에서 찜 목록 화면을 연결합니다.`); if(label==="MY") alert("마이페이지는 로그인 기능과 함께 다음 단계에서 연결합니다.");}}>
            {icon}<span>{label}</span>
          </button>
        ))}
      </footer>
    </>
  );
}
