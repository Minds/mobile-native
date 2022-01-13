import {
  AdenCompat,
  _1977Compat,
  InkwellCompat,
  MayfairCompat,
  ReyesCompat,
  RiseCompat,
  WillowCompat,
  Xpro2Compat,
  // BrannanCompat,
  // BrooklynCompat,
  // ClarendonCompat,
  // EarlybirdCompat,
  // GinghamCompat,
  // HudsonCompat,
  // KelvinCompat,
  // LarkCompat,
  // LofiCompat,
  // MavenCompat,
  // MoonCompat,
  // NashvilleCompat,
  // PerpetuaCompat,
  // SlumberCompat,
  // StinsonCompat,
  // ToasterCompat,
  // ValenciaCompat,
  // WaldenCompat,
} from 'react-native-image-filter-kit';

export type PhotoFilter = {
  title: string;
  filterComponent: any;
};

const FILTERS: Array<PhotoFilter> = [
  {
    title: 'Normal',
    filterComponent: undefined,
  },
  {
    title: 'Aden',
    filterComponent: AdenCompat,
  },

  {
    title: 'Rise',
    filterComponent: RiseCompat,
  },

  {
    title: '1977',
    filterComponent: _1977Compat,
  },

  {
    title: 'Mayfair',
    filterComponent: MayfairCompat,
  },

  {
    title: 'Inkwell',
    filterComponent: InkwellCompat,
  },

  {
    title: 'Reyes',
    filterComponent: ReyesCompat,
  },

  // {
  //   title: 'Maven',
  //   filterComponent: MavenCompat,
  // },
  // {
  //   title: 'Moon',
  //   filterComponent: MoonCompat,
  // },
  // {
  //   title: 'Nashville',
  //   filterComponent: NashvilleCompat,
  // },
  // {
  //   title: 'Perpetua',
  //   filterComponent: PerpetuaCompat,
  // },
  // {
  //   title: 'Reyes',
  //   filterComponent: ReyesCompat,
  // },
  // {
  //   title: 'Rise',
  //   filterComponent: RiseCompat,
  // },
  // {
  //   title: 'Slumber',
  //   filterComponent: SlumberCompat,
  // },
  // {
  //   title: 'Stinson',
  //   filterComponent: StinsonCompat,
  // },
  // {
  //   title: 'Brooklyn',
  //   filterComponent: BrooklynCompat,
  // },
  // {
  //   title: 'Earlybird',
  //   filterComponent: EarlybirdCompat,
  // },
  // {
  //   title: 'Clarendon',
  //   filterComponent: ClarendonCompat,
  // },
  // {
  //   title: 'Gingham',
  //   filterComponent: GinghamCompat,
  // },
  // {
  //   title: 'Hudson',
  //   filterComponent: HudsonCompat,
  // },
  // // {
  // //   title: 'Inkwell',
  // //   filterComponent: InkwellCompat,
  // // },
  // {
  //   title: 'Kelvin',
  //   filterComponent: KelvinCompat,
  // },
  // {
  //   title: 'Lark',
  //   filterComponent: LarkCompat,
  // },
  // {
  //   title: 'Lofi',
  //   filterComponent: LofiCompat,
  // },
  // {
  //   title: 'Toaster',
  //   filterComponent: ToasterCompat,
  // },
  // {
  //   title: 'Valencia',
  //   filterComponent: ValenciaCompat,
  // },
  // {
  //   title: 'Walden',
  //   filterComponent: WaldenCompat,
  // },
  {
    title: 'Willow',
    filterComponent: WillowCompat,
  },
  {
    title: 'Xpro2',
    filterComponent: Xpro2Compat,
  },
  // {
  //   title: 'Aden',
  //   filterComponent: AdenCompat,
  // },
  // {
  //   title: '_1977',
  //   filterComponent: _1977Compat,
  // },
  // {
  //   title: 'Brannan',
  //   filterComponent: BrannanCompat,
  // },
];

export default FILTERS;
