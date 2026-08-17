import { TeamMember } from './types';

export const initialTeam: TeamMember[] = [
  { 
    id: '1', 
    username: 'anthony', 
    name: 'Anthony Rahayel', 
    role: 'Admin', 
    joinedDate: 'Jan 2024',
    avatar: 'https://picsum.photos/seed/anthony/100/100',
    bio: 'Editor-in-Chief at 961, passionate about Lebanese culture and food.',
    socialLink: 'https://961.com/anthony'
  },
  { 
    id: '2', 
    username: 'sarah_k', 
    name: 'Sarah Khoury', 
    role: 'Editor', 
    joinedDate: 'Feb 2024',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    bio: 'Senior Editor focusing on lifestyle and travel.',
    socialLink: 'https://961.com/sarah_k'
  },
  { 
    id: '3', 
    username: 'jdoe', 
    name: 'John Doe', 
    role: 'Contributor', 
    joinedDate: 'Mar 2024',
    avatar: 'https://picsum.photos/seed/john/100/100',
    bio: 'Freelance writer and photographer.',
    socialLink: 'https://961.com/jdoe'
  },
];
