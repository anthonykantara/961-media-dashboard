export interface TeamMember {
  id: string;
  username: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Contributor';
  joinedDate: string;
  avatar: string;
  bio?: string;
  socialLink?: string;
}
