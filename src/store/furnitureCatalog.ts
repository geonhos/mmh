import type { FurnitureCatalogItem } from '../types';

export const furnitureCatalog: FurnitureCatalogItem[] = [
  // 침실
  { id: 'bed', name: '침대 (더블)', category: '침실', dimensions: { width: 1.6, depth: 2.0, height: 0.5 }, color: '#8B6F47' },
  { id: 'bed-single', name: '침대 (싱글)', category: '침실', dimensions: { width: 1.0, depth: 2.0, height: 0.5 }, color: '#8B6F47' },
  { id: 'bed-queen', name: '침대 (퀸)', category: '침실', dimensions: { width: 1.5, depth: 2.0, height: 0.5 }, color: '#7B5F37' },
  { id: 'bed-king', name: '침대 (킹)', category: '침실', dimensions: { width: 1.8, depth: 2.0, height: 0.5 }, color: '#6B4F27' },
  { id: 'nightstand', name: '협탁', category: '침실', dimensions: { width: 0.45, depth: 0.4, height: 0.55 }, color: '#A0825A' },
  { id: 'dresser', name: '화장대', category: '침실', dimensions: { width: 1.0, depth: 0.45, height: 0.75 }, color: '#B8956A' },
  { id: 'wardrobe', name: '옷장', category: '침실', dimensions: { width: 1.2, depth: 0.6, height: 2.0 }, color: '#8B7355' },
  { id: 'wardrobe-large', name: '옷장 (대형)', category: '침실', dimensions: { width: 2.0, depth: 0.6, height: 2.2 }, color: '#7B6345' },

  // 거실
  { id: 'sofa', name: '소파 (3인)', category: '거실', dimensions: { width: 2.0, depth: 0.9, height: 0.8 }, color: '#4A6741' },
  { id: 'sofa-2', name: '소파 (2인)', category: '거실', dimensions: { width: 1.4, depth: 0.85, height: 0.8 }, color: '#5A7751' },
  { id: 'sofa-l', name: 'L자 소파', category: '거실', dimensions: { width: 2.5, depth: 1.8, height: 0.8 }, color: '#3A5731' },
  { id: 'armchair', name: '안락의자', category: '거실', dimensions: { width: 0.8, depth: 0.8, height: 0.9 }, color: '#6B5B4B' },
  { id: 'coffee-table', name: '커피 테이블', category: '거실', dimensions: { width: 1.0, depth: 0.5, height: 0.4 }, color: '#A0522D' },
  { id: 'tv-stand', name: 'TV 거치대', category: '거실', dimensions: { width: 1.6, depth: 0.4, height: 0.5 }, color: '#333333' },
  { id: 'tv', name: 'TV (55인치)', category: '거실', dimensions: { width: 1.25, depth: 0.08, height: 0.72 }, color: '#1a1a1a' },
  { id: 'bookshelf', name: '책장', category: '거실', dimensions: { width: 0.8, depth: 0.3, height: 1.8 }, color: '#C4A882' },

  // 식당/주방
  { id: 'table', name: '식탁 (4인)', category: '식당', dimensions: { width: 1.2, depth: 0.8, height: 0.75 }, color: '#A0522D' },
  { id: 'table-6', name: '식탁 (6인)', category: '식당', dimensions: { width: 1.8, depth: 0.9, height: 0.75 }, color: '#90421D' },
  { id: 'table-round', name: '원형 테이블', category: '식당', dimensions: { width: 1.0, depth: 1.0, height: 0.75 }, color: '#B0623D' },
  { id: 'chair', name: '의자', category: '식당', dimensions: { width: 0.45, depth: 0.45, height: 0.85 }, color: '#D2691E' },
  { id: 'stool', name: '스툴', category: '식당', dimensions: { width: 0.35, depth: 0.35, height: 0.65 }, color: '#C0691E' },

  // 주방 가전
  { id: 'fridge', name: '냉장고', category: '주방', dimensions: { width: 0.7, depth: 0.7, height: 1.8 }, color: '#C0C0C0' },
  { id: 'fridge-large', name: '냉장고 (양문형)', category: '주방', dimensions: { width: 0.9, depth: 0.7, height: 1.8 }, color: '#D0D0D0' },
  { id: 'sink', name: '싱크대', category: '주방', dimensions: { width: 1.2, depth: 0.6, height: 0.85 }, color: '#E8E0D8' },
  { id: 'gas-range', name: '가스레인지', category: '주방', dimensions: { width: 0.6, depth: 0.6, height: 0.85 }, color: '#555555' },
  { id: 'microwave', name: '전자레인지', category: '주방', dimensions: { width: 0.5, depth: 0.35, height: 0.3 }, color: '#444444' },
  { id: 'kitchen-counter', name: '주방 조리대', category: '주방', dimensions: { width: 1.5, depth: 0.6, height: 0.85 }, color: '#E0D0C0' },
  { id: 'dishwasher', name: '식기세척기', category: '주방', dimensions: { width: 0.6, depth: 0.6, height: 0.85 }, color: '#BEBEBE' },

  // 욕실
  { id: 'bathtub', name: '욕조', category: '욕실', dimensions: { width: 0.75, depth: 1.7, height: 0.6 }, color: '#F0F0F0' },
  { id: 'toilet', name: '변기', category: '욕실', dimensions: { width: 0.4, depth: 0.65, height: 0.4 }, color: '#FFFFFF' },
  { id: 'bathroom-sink', name: '세면대', category: '욕실', dimensions: { width: 0.6, depth: 0.45, height: 0.85 }, color: '#F5F5F5' },
  { id: 'shower', name: '샤워 부스', category: '욕실', dimensions: { width: 0.9, depth: 0.9, height: 2.0 }, color: '#E0E8F0' },

  // 수납
  { id: 'shelf', name: '선반', category: '수납', dimensions: { width: 0.8, depth: 0.35, height: 1.8 }, color: '#C4A882' },
  { id: 'cabinet', name: '수납장', category: '수납', dimensions: { width: 0.8, depth: 0.4, height: 0.8 }, color: '#B09070' },
  { id: 'shoe-rack', name: '신발장', category: '수납', dimensions: { width: 0.9, depth: 0.35, height: 1.0 }, color: '#A08060' },
  { id: 'drawer', name: '서랍장', category: '수납', dimensions: { width: 0.8, depth: 0.45, height: 1.0 }, color: '#C0A080' },

  // 사무
  { id: 'desk', name: '책상', category: '사무', dimensions: { width: 1.2, depth: 0.6, height: 0.75 }, color: '#9B8B7B' },
  { id: 'desk-l', name: 'L자 책상', category: '사무', dimensions: { width: 1.6, depth: 1.4, height: 0.75 }, color: '#8B7B6B' },
  { id: 'office-chair', name: '사무용 의자', category: '사무', dimensions: { width: 0.6, depth: 0.6, height: 1.0 }, color: '#333333' },
  { id: 'filing-cabinet', name: '파일 캐비닛', category: '사무', dimensions: { width: 0.4, depth: 0.5, height: 1.0 }, color: '#777777' },
  { id: 'monitor', name: '모니터', category: '사무', dimensions: { width: 0.6, depth: 0.2, height: 0.4 }, color: '#222222' },

  // 가전
  { id: 'washer', name: '세탁기', category: '가전', dimensions: { width: 0.6, depth: 0.6, height: 0.85 }, color: '#E8E8E8' },
  { id: 'dryer', name: '건조기', category: '가전', dimensions: { width: 0.6, depth: 0.6, height: 0.85 }, color: '#D8D8D8' },
  { id: 'air-conditioner', name: '에어컨 (스탠드)', category: '가전', dimensions: { width: 0.35, depth: 0.35, height: 1.7 }, color: '#F0F0F0' },
  { id: 'air-purifier', name: '공기청정기', category: '가전', dimensions: { width: 0.35, depth: 0.35, height: 0.6 }, color: '#E0E0E0' },
  { id: 'vacuum-robot', name: '로봇청소기', category: '가전', dimensions: { width: 0.35, depth: 0.35, height: 0.1 }, color: '#333333' },
];

export const categories = [...new Set(furnitureCatalog.map((c) => c.category))];
