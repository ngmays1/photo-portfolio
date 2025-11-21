export enum Category {
  PORTRAITS = 'Portraits',
  LANDSCAPES = 'Landscapes',
  EVENTS = 'Events',
  ABSTRACT = 'Abstract'
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  category: Category;
  dateAdded: number;
}

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ImageMetadata {
  title: string;
  description: string;
  suggestedCategory: Category;
}