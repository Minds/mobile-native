export default function isNsfw(entity) {
  return Boolean(entity && (isEntityNsfw(entity) || entity.is_parent_mature));
}

export function isEntityNsfw(entity) {
  return Boolean(entity && (entity.mature || (entity.nsfw && entity.nsfw.length > 0)));
}
