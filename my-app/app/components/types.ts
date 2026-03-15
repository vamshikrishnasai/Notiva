// Shared types for Notiva components
export type ItemType = 'note' | 'article' | 'link' | 'research';
export type SortBy = 'date' | 'title' | 'pinned';
export type SidebarView = 'all' | 'recent' | 'notes' | 'articles' | 'links' | 'research' | 'starred' | 'archived';

export interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  summary: string | null;
  tags: string | null;
  type: ItemType;
  is_pinned?: boolean;
  is_starred?: boolean;
  is_archived?: boolean;
  notebook?: string;
  created_at?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

export interface FormData {
  title: string;
  content: string;
  type: ItemType;
  tags: string;
  is_pinned: boolean;
  is_starred: boolean;
  is_archived: boolean;
  notebook: string;
}

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
}
