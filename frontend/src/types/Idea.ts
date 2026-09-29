export type Idea = {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  userId: string | null;
  userName: string | null;
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
};