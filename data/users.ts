import { User, CollaborativeShop } from '@/types';

export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  initials: 'AJ',
};

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', initials: 'AJ' },
  { id: 'user-2', name: 'Jordan Smith', email: 'jordan@example.com', initials: 'JS' },
  { id: 'user-3', name: 'Taylor Morgan', email: 'taylor@example.com', initials: 'TM' },
  { id: 'user-4', name: 'Casey Lee', email: 'casey@example.com', initials: 'CL' },
];

export const mockCollaborativeShop: CollaborativeShop = {
  id: 'shop-1',
  name: 'Summer Party Planning',
  createdBy: mockUsers[0],
  lastActive: '2 mins ago',
  collaborators: [
    { user: mockUsers[0], role: 'Owner', status: 'active' },
    { user: mockUsers[1], role: 'Editor', status: 'active' },
    { user: mockUsers[2], role: 'Viewer', status: 'active' },
    { user: mockUsers[3], role: 'Viewer', status: 'pending' },
  ],
  cartTotal: 325.00,
  cartGoal: 500.00,
  products: [
    {
      id: '9',
      name: 'Festoon Party Lights (25m)',
      price: 45.00,
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
      price: 89.99,
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
      price: 110.00,
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

export const mockLoginCredentials = {
  email: 'alex@example.com',
  password: 'password123',
};
