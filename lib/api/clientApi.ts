import axios from "axios";
import {
  type Note,
  type FetchNotesParams,
  type FetchNotesResponse,
} from "@/types/note";
import { nextServer } from "./api";

export type NoteType = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteListType = {
  notes: NoteType[];
  total: number;
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
  categoryId: string;
};

export type User = {
  id: string;
  email: string;
  userName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type RegisterRequest = {
  userName: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ServerBoolResponse = {
  success: boolean;
};

export const getNotes = async (categoryId?: string, title?: string) => {
  const { data } = await nextServer<NoteListType>("/notes", {
    params: { categoryId, title },
  });
  return data;
};

export const getSingleNote = async (id: string) => {
  const { data } = await nextServer<NoteType>(`/notes/${id}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await nextServer<CategoryType[]>(`/categories`);
  return data;
};

export const createNote = async (payload: CreateNoteRequest) => {
  const { data } = await nextServer.post<NoteType>(`/notes`, payload);
  return data;
};

export const register = async (payload: RegisterRequest) => {
  const { data } = await nextServer.post<User>(`/auth/register`, payload);
  return data;
};

export const login = async (payload: LoginRequest) => {
  const { data } = await nextServer.post<User>(`/auth/login`, payload);
  return data;
};

export const checkSession = async () => {
  const { data } = await nextServer<ServerBoolResponse>(`/auth/session`);
  return data.success;
};

export const getMe = async () => {
  const { data } = await nextServer<User>(`/auth/me`);
  return data;
};

export const logOut = async () => {
  await nextServer.post<ServerBoolResponse>(`/auth/logout`);
};

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    console.error(defaultMessage, error.response?.data || error.message);
    throw new ApiError(message, error.response?.status, error.response?.data);
  }
  throw error;
};

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  try {
    const params: Record<string, string | number> = { page, perPage };
    if (search) params.search = search;
    if (tag && tag.toLowerCase() !== "all") params.tag = tag;

    const res = await nextServer.get<FetchNotesResponse>("/notes", { params });
    return res.data;
  } catch (error) {
    handleApiError(error, "Error fetching notes");
    throw error;
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};
