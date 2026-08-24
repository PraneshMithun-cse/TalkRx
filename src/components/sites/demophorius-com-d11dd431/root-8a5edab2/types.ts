export interface NavBrandLink {
  label: string;
  href: string;
  fillColor: string;
  logoSrc: string;
}

export interface HeroCard {
  title: string;
  subtitle: string;
  href: string;
  imageSrc: string;
}

export interface CtaRow {
  title: string;
  subtitle: string;
  href: string;
}

export interface ProductSubcategory {
  name: string;
  count: number;
  href: string;
}

export interface ProductCategory {
  brand: string;
  href: string;
  imageSrc: string;
  dotColor: string;
  fillColor: string;
  logoSrc: string;
  subcategories: ProductSubcategory[];
  totalCount: number;
}

export interface NewsItem {
  category: string;
  date: string;
  title: string;
  href: string;
  imageSrc: string;
  size: "large" | "small";
}
