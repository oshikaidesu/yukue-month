import HomeClient from './HomeClient';

export const dynamic = 'force-static';

export default async function Home() {
  // サーバーではデータ取得せず、クライアントで Worker から取得
  return <HomeClient />;
} 