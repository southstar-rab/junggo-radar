import "./globals.css";

export const metadata = {
  title: "중고레이더 - 중고 검색의 끝판왕",
  description: "중고 통합검색 MVP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
