import "./globals.css";

export const metadata = {
  title: "중고레이더 - 중고 검색의 끝판왕",
  description: "당근, 번개장터, 중고나라를 한 번에 검색하는 중고 탐색 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
