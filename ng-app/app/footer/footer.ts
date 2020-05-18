export class FooterLinkItem {
  name: string;
  url: string;
}

export class FooterItem {
  title: string;
  links: FooterLinkItem[];
}

export class Footer {
  footers: FooterItem [];
  copyrightLine: string;
  disclaimer: string;
}
