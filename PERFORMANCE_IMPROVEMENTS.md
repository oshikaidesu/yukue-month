# パフォーマンス改善記録

## 概要

ゆくえレコーズ MONTHLY PICKUP PLAYLISTサイトのパフォーマンス改善に関する記録です。  
特にスマートフォンでのユーザー体験向上を目的とした最適化を実施しています。

## 現在確認されている問題

### 1. スマホでのズーム処理のカクつき

**問題箇所**: `VideoCards.tsx` のカードホバー時のアニメーション

**症状**: 
- スマホ環境でカードのスケール変更（1.0 → 1.1）時にフレームドロップが発生
- 複数カードの同時操作時にさらに顕著になる

**原因分析**:
- 複数の装飾図形（8個）が同時にアニメーション実行
- 各図形が複雑なtransformアニメーション（x, y, scale, rotate）を実行
- GPU合成が適切に働いていない可能性
- `will-change`プロパティの不適切な使用

**影響範囲**:
- 主にiOS Safari、Android Chrome
- 特に低～中スペック端末で顕著

### 2. サムネイル画像処理の課題

**問題箇所**: `NicovideoThumbnail.tsx` のサムネイル読み込み処理

**課題**:
- 外部API（ニコニコ動画、YouTube）への依存による読み込み遅延
- OGPサムネイルの取得タイミングが不安定
- ~~画像読み込み失敗時のフォールバック処理が重い（iframeを使用）~~ → 軽量なプレースホルダーに変更済み ✅
- 複数の画像読み込みが同時発生する際のメモリ使用量増大

## 実施済み改善

### ✅ 基本的な軽量化（2024年実施）

- Header/ Footer をサーバーコンポーネント化（`'use client'` を削除）
  - 共通ナビゲーション分のクライアント JS を削減
- VideoCards から `react-device-detect` の依存を除去し、`window.innerWidth` ベースの分岐に統一
  - 追加バンドルの削減、実行コストの低減
- `console.log` を本番コードから削除（`Hero.tsx` / `VideoCards.tsx` / `NicovideoThumbnail.tsx`）
  - JS サイズの縮小、メインスレッド処理の削減
- `PickupBackground.tsx` のスクロールリスナーを `passive: true` 化
  - スクロール時のメインスレッド負荷を低減

### ✅ サムネイル処理軽量化（2025年1月実施）

- iframeフォールバックの削除
  - 重いiframe処理を軽量なプレースホルダーに置き換え
  - メモリ使用量とレンダリング負荷を大幅削減

## 対策案（検討中・実装予定）

### A. アニメーション最適化

#### 1. GPU合成の強化
- [ ] `will-change: transform` の適用範囲を最適化
  - 現在：全装飾図形に常時適用
  - 改善案：アニメーション実行時のみ動的に適用
- [ ] `transform3d()` の活用でGPU合成を促進
- [ ] 不要な `will-change` の削除（アニメーション終了時）

#### 2. アニメーション簡素化
- [ ] スマホ時は装飾図形のアニメーションを削減
  - 8個 → 3-4個に削減
  - または簡素なアニメーションに変更
- [ ] 同時アニメーション数の制限
  - 視覚的に重要な図形のみアニメーション
- [ ] アニメーション duration の調整
  - 現在：0.3s - 1.0s
  - 改善案：0.2s - 0.5s（レスポンス向上）

#### 3. レスポンシブ対応
- [ ] デバイス性能に応じたアニメーション分岐
  - `navigator.hardwareConcurrency` による判定
  - 低スペック端末では最小限のアニメーション

### B. サムネイル処理改善

#### 1. 画像最適化
- [ ] WebP形式への変換
  - JPEG/PNG → WebP（ファイルサイズ30-50%削減）
- [ ] 適切なサイズでの配信（srcset活用）
  - 現在：固定サイズ
  - 改善案：デバイス解像度に応じた最適サイズ
- [ ] 遅延読み込みの改善
  - Intersection Observer の活用
  - プリロード優先度の調整

#### 2. キャッシュ戦略
- [ ] サムネイル画像のローカルキャッシュ
- [ ] Service Worker によるオフライン対応

### C. 全体的な最適化

#### 1. メモリ管理
- [ ] 不要なstate更新の削減
  - 現在の問題箇所の特定と修正
- [ ] useCallback/useMemoの適切な使用
  - 依存配列の最適化
- [ ] コンポーネントの仮想化検討
  - 大量のカード表示時のメモリ使用量削減

#### 2. レンダリング最適化
- [ ] React.memo の適用範囲拡大
- [ ] 条件付きレンダリングの改善
- [ ] 不要な再レンダリングの削除

## 測定・評価方法

### パフォーマンス計測

**本番環境での計測**:
```bash
npm run build
npm start
# http://localhost:3000 を Lighthouse/Pagespeed で計測
```

**重要**: 開発サーバー（`next dev --turbopack`）ではHMR用WebSocketにより「バックフォワードキャッシュ（bfcache）」が無効化されるため、正確な計測ができません。

### 目標値

- **Lighthouse Performance Score**: 90+ (現在: 70-80)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **スマホでのアニメーション**: 60fps維持

## 実装優先度

### 高優先度 🔴
1. GPU合成の強化（`will-change`最適化）
2. スマホ時のアニメーション簡素化
3. WebP形式への変換

### 中優先度 🟡
1. srcsetによるレスポンシブ画像
2. React.memoの適用拡大
3. 不要な再レンダリング削除

### 低優先度 🟢
1. Service Worker実装
2. コンポーネント仮想化
3. デバイス性能判定

## 2025年1月時点での根本原因特定

### 🔴 **確認済み**: サムネイル画像のズーム処理が主要因

**テスト結果**:
- 装飾図形コンポーネント化 → 多少改善
- **根本的な重さの原因 = サムネイル画像処理**

**問題箇所**: `VideoCards.tsx` line 462-466
```typescript
animate={{
  scale: isActive ? 1.55 : 1,  // ← この1.55倍拡大が重い
  y: isActive ? '26.5%' : '0%',
  transition: { duration: 0.2, ease: "easeOut" }
}}
```

**重い理由**:
1. **高解像度画像の拡大**: 400x225px → 620x349px (1.55倍)
2. **GPU合成の失敗**: 画像拡大でGPUからCPUに処理が移る
3. **頻繁な再計算**: 中央判定によるアクティブ状態の切り替え
4. **メモリ使用量増大**: 拡大された画像データの保持

## 緊急改善策（サムネイル最適化）

### D. サムネイル処理の根本改善

#### 1. スケール値の段階的削減 🔴🔴
```typescript
// 現在: scale: 1.55 (155%)
// 改善案1: scale: 1.3 (130%) - 30%軽量化
// 改善案2: scale: 1.2 (120%) - 50%軽量化  
// 改善案3: scale: 1.1 (110%) - 70%軽量化
```

#### 2. GPU合成の強制適用 🔴
```typescript
// サムネイル要素に追加
style={{
  willChange: 'transform',
  transform: 'translate3d(0, 0, 0)', // GPU合成を強制
  backfaceVisibility: 'hidden'
}}
```

#### 3. アニメーション時間の最適化 🔴
```typescript
// 現在: duration: 0.2s
// 改善案: duration: 0.15s (25%高速化)
transition: { 
  duration: isMobile ? 0.1 : 0.15, // スマホでさらに高速化
  ease: "easeOut" 
}
```

#### 4. 中央判定の最適化 🔴
```typescript
// 現在: 200px範囲で中央判定
// 改善案: 100px範囲に縮小
if (Math.abs(cardCenter - windowCenter) < 100) { // 200 → 100
  foundId = video.id;
}
```

#### 5. スマホ専用の軽量アニメーション 🔴🔴
```typescript
// スマホ時は別のアニメーション戦略
const mobileAnimation = {
  scale: 1.05, // 最小限の拡大
  transition: { duration: 0.1 }
};

const desktopAnimation = {
  scale: 1.3,
  y: '15%', // y移動も削減
  transition: { duration: 0.15 }
};
```

### E. 画像処理の根本改善

#### 1. サムネイル画像の事前最適化 🟡
```typescript
// NicovideoThumbnail.tsxで画像サイズを制限
width={isMobile ? 300 : 400}  // スマホ時は小さく
height={isMobile ? 169 : 225}
quality={isMobile ? 60 : 75}  // スマホ時は画質下げる
```

#### 2. レスポンシブ画像の活用 🟡
```typescript
sizes="(max-width: 768px) 300px, 400px"
srcSet={`
  ${thumbnailUrl}?w=300 300w,
  ${thumbnailUrl}?w=400 400w
`}
```

#### 3. プリロード戦略の見直し 🟢
```typescript
// 重要な画像のみプリロード
loading={index < 4 ? "eager" : "lazy"}
priority={index < 2} // 最初の2枚のみ優先読み込み
```

## 実装優先度（更新）

### 🔴🔴 緊急（即座に実装）
1. **D-1**: スケール値削減（1.55 → 1.2）
2. **D-3**: アニメーション時間短縮（0.2s → 0.15s）
3. **D-4**: 中央判定範囲縮小（200px → 100px）

### 🔴 高優先度（今週中）
1. **D-2**: GPU合成強制（transform3d追加）
2. **D-5**: スマホ専用軽量アニメーション
3. **E-1**: スマホ時の画像サイズ制限

### 🟡 中優先度（来週）
1. **E-2**: レスポンシブ画像実装
2. **A-1**: 既存のGPU合成強化
3. **E-3**: プリロード戦略見直し

## 期待される改善効果

### パフォーマンス指標
- **フレームレート**: 30-40fps → 50-60fps
- **メモリ使用量**: 30-50%削減
- **アニメーション遅延**: 50-80ms → 16-30ms
- **体感速度**: 明らかな改善

### 実装コスト
- **D-1～D-4**: 5分程度の簡単な修正
- **D-5**: 30分程度の条件分岐追加
- **E-1～E-3**: 1-2時間の画像処理改善

## 進捗管理（更新）

### 緊急対応
- [ ] D-1: スケール値削減（1.55→1.2）
- [ ] D-2: GPU合成強制
- [ ] D-3: アニメーション時間短縮
- [ ] D-4: 中央判定範囲最適化
- [ ] D-5: スマホ専用軽量アニメーション

### 既存項目
- [ ] A-1: GPU合成強化
- [ ] A-2: アニメーション簡素化  
- [ ] B-1: WebP変換
- [ ] B-2: srcset実装
- [ ] C-1: React.memo適用
- [ ] C-2: 再レンダリング最適化

## 参考資料

- [Web Vitals](https://web.dev/vitals/)
- [React Performance Best Practices](https://react.dev/learn/render-and-commit)
- [Framer Motion Performance](https://www.framer.com/motion/guide-reduce-bundle-size/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
