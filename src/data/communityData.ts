export interface Community {
  id: string;
  name: string;
  nameBn?: string;
  logo: string;
  description: string;
  descriptionBn?: string;
  memberCount: number;
  type: 'private' | 'invite-only';
  coverImage: string;
  createdAt: string;
  tags: string[];
}

export const mockCommunities: Community[] = [
  {
    id: 'voboghure',
    name: 'Voboghure— ভবঘুরে',
    nameBn: 'ভবঘুরে',
    logo: '😎',
    description: 'A close-knit travel community exploring Bangladesh and beyond. We turn every trip into a story and every story into a lasting memory.',
    descriptionBn: 'একটি ঘনিষ্ঠ ভ্রমণ সম্প্রদায় যারা বাংলাদেশ এবং তার বাইরে অন্বেষণ করে।',
    memberCount: 12,
    type: 'invite-only',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&fit=crop',
    createdAt: '2019-01-15',
    tags: ['travel', 'adventure', 'bangladesh'],
  },
  {
    id: 'shutterbug',
    name: 'ShutterBug Collective',
    logo: '📸',
    description: 'A photography enthusiast group capturing the beauty of everyday life through street, landscape, and portrait photography.',
    memberCount: 34,
    type: 'private',
    coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&fit=crop',
    createdAt: '2021-06-01',
    tags: ['photography', 'art', 'creative'],
  },
  {
    id: 'trail-blazers',
    name: 'Trail Blazers',
    logo: '🥾',
    description: 'Hikers and trekkers pushing boundaries on mountain trails across South Asia. From Himalayas to Western Ghats.',
    memberCount: 21,
    type: 'invite-only',
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&fit=crop',
    createdAt: '2020-03-10',
    tags: ['hiking', 'trekking', 'mountains'],
  },
  {
    id: 'foodie-caravan',
    name: 'Foodie Caravan',
    logo: '🍜',
    description: 'Foodies on the move — discovering local cuisines, street food gems, and hidden restaurants across cities.',
    memberCount: 45,
    type: 'private',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&fit=crop',
    createdAt: '2022-01-20',
    tags: ['food', 'travel', 'culture'],
  },
  {
    id: 'river-runners',
    name: 'River Runners',
    logo: '🚣',
    description: 'Kayaking, rafting, and river exploration group. We chase currents and sunsets on the waterways of Bangladesh.',
    memberCount: 8,
    type: 'invite-only',
    coverImage: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&fit=crop',
    createdAt: '2023-05-12',
    tags: ['kayaking', 'rivers', 'adventure'],
  },
];
