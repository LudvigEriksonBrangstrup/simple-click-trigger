
export interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  categories: string[];
  urdfPath: string;
}

export interface Category {
  id: string;
  name: string;
}
