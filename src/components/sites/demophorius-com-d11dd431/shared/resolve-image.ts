import imageMap from "@/data/demophorius-com-d11dd431/image-url-map.json";

const map = imageMap as Record<string, string>;

export function resolveImage(url: string): string {
  return map[url] ?? url;
}
