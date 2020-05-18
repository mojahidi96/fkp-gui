export class TabLink {
  active? = false;
  name: string;
  url: string;
}

export class TopBar {
  shop: { name: string, number: string , banExist: any};
  tabs: TabLink[];
  menus: MenuItem[];
  vfUser: boolean;
  ssoUser: boolean;
  ssoKeepAliveUrl: string;
  isReadOnlyUser: boolean;
  isReadOnlyVodafoneUser: boolean;
  permissions = [];
  techfundEnabled?: boolean;

}


export class MenuLinkItem {
  name: string;
  url?: string;
  target: string;
  routerLink?: boolean;
  queryParam: any;
}

export class MenuSubmenuItem {
  title: string;
  links: MenuLinkItem[];
}

export class MenuItem extends MenuLinkItem {
  active: boolean;
  menuOrder: number;
  submenus: MenuSubmenuItem[];
}