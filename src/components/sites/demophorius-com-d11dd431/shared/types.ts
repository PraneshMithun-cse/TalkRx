export interface BreadcrumbLink {
  label: string;
  href: string;
}

export interface ProductSpecRow {
  label: string;
  value: string | string[] | BreadcrumbLink[];
}

export interface ProductVariant {
  label: string;
  href: string;
}

export interface ProductDetailData {
  slug: string;
  url: string;
  title: string;
  codes: string[];
  image: string;
  descriptionSmall: string;
  description: string;
  breadcrumb: BreadcrumbLink[];
  specRows: ProductSpecRow[];
  variants: ProductVariant[];
  currentVariant: string;
}

export interface NewsCredit {
  label: string;
  text: string;
  href: string;
}

export interface RelatedNews {
  href: string;
  category: string;
  date: string;
  title: string;
  image: string;
}

export interface NewsArticleData {
  slug: string;
  url: string;
  category: string;
  date: string;
  title: string;
  image: string;
  descriptionSmall: string;
  descriptionHtml: string;
  credits: NewsCredit[];
  related: RelatedNews[];
}

export interface CategorySubcategory {
  name: string;
  descriptionSmall: string;
  image: string;
  href: string;
}

export interface CategoryProduct {
  image: string;
  codes: string[];
  title: string;
  href: string;
}

export interface CategoryPageData {
  path: string;
  url: string;
  backHref: string;
  breadcrumb: BreadcrumbLink[];
  dropdownCurrent: string;
  dropdownOptions: ProductVariant[];
  title: string;
  description: string;
  subcategories: CategorySubcategory[];
  products: CategoryProduct[];
  hasBrandsCrossSell: boolean;
}

export interface TimelineEvent {
  year: string;
  month: string;
  title: string;
  description: string;
  image: string;
}
