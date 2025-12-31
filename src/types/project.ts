// Project-related types

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'residential' | 'commercial' | 'government' | 'religious';
  images: string[];
  year: number;
}


