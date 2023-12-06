const map = {
  visibility_off: 'eye_off',
  trending_up: 'boost',
  add_to_queue: 'queue',
  '/badges/proDark.svg': 'pro',
  '/icons/network-pos.svg': 'network',
  '/icons/binoculars.svg': 'binoculars',
  palette: 'creator',
  '/icons/web-plus.svg': 'web_plus',
  '/icons/palette-swatch.svg': 'palette_swatch',
  '/icons/account-edit.svg': 'account_edit',
};

export default function iconMap(name?: string | null) {
  return name ? map[name.trim()] || 'boost' : 'boost';
}
