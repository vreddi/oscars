export function getAvatarUrl(seed: string, size = 80): string {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
}
