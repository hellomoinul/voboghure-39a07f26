export interface Community {
  id: string;
  name: string;
  nameBn?: string;
  logo: string;
  description: string;
  descriptionBn?: string;
  tagline?: string;
  memberCount: number;
  type: 'private' | 'invite-only';
  coverImage: string;
  themeColor?: string;
  createdAt: string;
  tags: string[];
  code: string;
}

export const mockCommunities: Community[] = [
  {
    id: 'voboghure',
    name: 'Voboghure— ভবঘুরে',
    nameBn: 'ভবঘুরে',
    logo: '😎',
    description: 'A close-knit travel community exploring Bangladesh and beyond. We turn every trip into a story and every story into a lasting memory.',
    descriptionBn: 'একটি ঘনিষ্ঠ ভ্রমণ সম্প্রদায় যারা বাংলাদেশ এবং তার বাইরে অন্বেষণ করে।',
    tagline: 'Wander together, remember forever',
    memberCount: 12,
    type: 'invite-only',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&fit=crop',
    themeColor: '#6366f1',
    createdAt: '2019-01-15',
    tags: ['travel', 'adventure', 'bangladesh'],
    code: 'CM-00001-BD-19-01-15',
  },
  {
    id: 'shutterbug',
    name: 'ShutterBug Collective',
    logo: '📸',
    description: 'A photography enthusiast group capturing the beauty of everyday life through street, landscape, and portrait photography.',
    tagline: 'Frame the moment',
    memberCount: 34,
    type: 'private',
    coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&fit=crop',
    createdAt: '2021-06-01',
    tags: ['photography', 'art', 'creative'],
    code: 'CM-00002-BD-21-06-01',
  },
  {
    id: 'trail-blazers',
    name: 'Trail Blazers',
    logo: '🥾',
    description: 'Hikers and trekkers pushing boundaries on mountain trails across South Asia. From Himalayas to Western Ghats.',
    tagline: 'Every peak has a story',
    memberCount: 21,
    type: 'invite-only',
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&fit=crop',
    createdAt: '2020-03-10',
    tags: ['hiking', 'trekking', 'mountains'],
    code: 'CM-00003-BD-20-03-10',
  },
  {
    id: 'foodie-caravan',
    name: 'Foodie Caravan',
    logo: '🍜',
    description: 'Foodies on the move — discovering local cuisines, street food gems, and hidden restaurants across cities.',
    tagline: 'Taste the journey',
    memberCount: 45,
    type: 'private',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&fit=crop',
    createdAt: '2022-01-20',
    tags: ['food', 'travel', 'culture'],
    code: 'CM-00004-BD-22-01-20',
  },
  {
    id: 'river-runners',
    name: 'River Runners',
    logo: '🚣',
    description: 'Kayaking, rafting, and river exploration group. We chase currents and sunsets on the waterways of Bangladesh.',
    tagline: 'Go with the flow',
    memberCount: 8,
    type: 'invite-only',
    coverImage: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&fit=crop',
    createdAt: '2023-05-12',
    tags: ['kayaking', 'rivers', 'adventure'],
    code: 'CM-00005-BD-23-05-12',
  },
];
