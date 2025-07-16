export function getYearMonthFromPath(path: string): string | null {
  // 例: "src/data/2025/videos_05.json"
  const match = path.match(/(\d{4})\/videos_(\d{2})\.json$/);
  if (match) {
    return `${match[1]}.${match[2]}`;
  }
  return null;
} 