export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export type Note = {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
};

export type FetchNotesResponse = {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
};
export interface CreateNotePayload {
  title: string;
  content: string;
  categoryId: string;
  tag: Tag;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type FetchNotesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
};

export type NoteType = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
};

export type NoteListType = {
  notes: NoteType[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
};
export type CategoryType = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteRequest = {
  title: string;
  content: string;
  categoryId?: string;
  tag?: string;
};
