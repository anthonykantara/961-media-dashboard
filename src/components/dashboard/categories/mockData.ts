import { Category } from './types';

export const initialCategories: Category[] = [
  { id: '1', name: 'Breaking News', slug: 'breaking-news', description: 'Urgent and important news updates.', count: 124, color: '#FF0000' },
  { id: '2', name: 'News', slug: 'news', description: 'General news from Lebanon and around the world.', count: 842, color: '#000000' },
  { id: '3', name: 'Lifestyle', slug: 'lifestyle', description: 'Culture, fashion, and everyday living.', count: 456, color: '#666666' },
  { id: '4', name: 'Food & Drink', slug: 'food-drink', description: 'Restaurant reviews, recipes, and culinary news.', count: 289, color: '#999999' },
  { id: '5', name: 'Things To Do', slug: 'things-to-do', description: 'Events, activities, and entertainment.', count: 187, color: '#CCCCCC' },
  { id: '6', name: 'Travel', slug: 'travel', description: 'Tourism, destinations, and travel tips.', count: 156, color: '#E5E5E5' },
  { id: '7', name: 'Diaspora', slug: 'diaspora', description: 'News and stories from the Lebanese diaspora.', count: 98, color: '#F1F1F1' },
];
