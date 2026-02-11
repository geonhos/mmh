import type { FurnitureCatalogItem } from '../types';

export const furnitureCatalog: FurnitureCatalogItem[] = [
  {
    id: 'bed',
    name: '침대',
    category: '침실',
    dimensions: { width: 1.6, depth: 2.0, height: 0.5 },
    color: '#8B6F47',
  },
  {
    id: 'table',
    name: '테이블',
    category: '거실',
    dimensions: { width: 1.2, depth: 0.8, height: 0.75 },
    color: '#A0522D',
  },
  {
    id: 'chair',
    name: '의자',
    category: '거실',
    dimensions: { width: 0.45, depth: 0.45, height: 0.85 },
    color: '#D2691E',
  },
  {
    id: 'sofa',
    name: '소파',
    category: '거실',
    dimensions: { width: 2.0, depth: 0.9, height: 0.8 },
    color: '#4A6741',
  },
  {
    id: 'shelf',
    name: '선반',
    category: '수납',
    dimensions: { width: 0.8, depth: 0.35, height: 1.8 },
    color: '#C4A882',
  },
];
