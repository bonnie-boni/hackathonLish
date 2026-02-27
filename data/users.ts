import { User, CollaborativeShop } from '@/types';

export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'D Marto',
  email: 'marto@gmail.com',
  initials: 'MJ',
};

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Marto', email: 'marto@gmail.com', initials: 'MJ' },
  { id: 'user-3', name: 'Wangui', email: 'josphinekimani819@gmail.com', initials: 'WS' },
  { id: 'user-2', name: 'Bonnie', email: 'bonnie@gmail.com', initials: 'BM' },
  { id: 'user-4', name: 'Sydney', email: 'sydney@gmail.com', initials: 'SL' },
];

export const mockCollaborativeShop: CollaborativeShop = {
  id: 'shop-1',
  name: 'Summer Party Planning',
  createdBy: mockUsers[0],
  lastActive: '2 mins ago',
  collaborators: [
    { user: mockUsers[0], status: 'active' },
    { user: mockUsers[1], status: 'active' },
    { user: mockUsers[2], status: 'active' },
    { user: mockUsers[3], status: 'pending' },
  ],
  cartTotal: 325.00,
  cartGoal: 500.00,
  products: [
    {
      id: '9',
      name: 'Festoon Party Lights (25m)',
      price: 1.00,
      description: 'Weatherproof outdoor string lights, perfect for summer nights.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
      category: 'Home',
      badge: 'POPULAR',
      inStock: true,
      addedBy: mockUsers[0],
      votedBy: [mockUsers[0], mockUsers[1]],
    },
    {
      id: '10',
      name: 'Waterproof JBL Speaker',
      price: 1.00,
      description: 'Bass-heavy portable speaker with 12-hour battery life and IPX7 rating.',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      category: 'Electronics',
      inStock: true,
      addedBy: mockUsers[2],
      votedBy: [mockUsers[2]],
    },
    {
      id: '11',
      name: 'Instax Mini 11 Bundle',
      price: 1.00,
      description: 'Capture memories instantly. Bundle includes 20 film sheets and a carry case.',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
      category: 'Electronics',
      badge: 'LOW STOCK',
      inStock: true,
      addedBy: mockUsers[0],
      votedBy: [mockUsers[0]],
    },
  ],
};

export const mockLoginCredentials = [
  { email: 'marto@gmail.com', password: 'password123', user: mockUsers[0] },
  { email: 'bonnie@gmail.com', password: 'password123', user: mockUsers[2] },
  { email: 'josphinekimani819@gmail.com', password: 'password123', user: mockUsers[1] },
  { email: 'sydney@gmail.com', password: 'password123', user: mockUsers[3] },
];
