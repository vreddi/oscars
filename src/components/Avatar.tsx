import { getAvatarUrl } from '../utils/avatarUrl';

interface AvatarProps {
  seed: string;
  size?: number;
}

export function Avatar({ seed, size = 48 }: AvatarProps) {
  return (
    <img
      src={getAvatarUrl(seed, size)}
      alt="Avatar"
      width={size}
      height={size}
      style={{ borderRadius: '50%', background: '#333' }}
    />
  );
}
