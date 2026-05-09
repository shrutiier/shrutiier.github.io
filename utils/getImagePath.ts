export function getImagePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}
