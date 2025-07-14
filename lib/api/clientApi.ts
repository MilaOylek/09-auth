import axios from "axios";
import { type Note, Category, type FetchNotesParams } from "@/types/note";
import { User } from "@/types/user";
import { nextServer as api, FetchNotesResponse } from "@/lib/api/api";

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type CreateNoteRequest = {
  title: string;
  content: string;
  categoryId?: string;
  tag?: string;
};

export type UpdateProfileRequest = {
  username?: string;
  email?: string;
  avatar?: string;
};
export type ServerBoolResponse = {
  success: boolean;
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

    const res = await api.get<FetchNotesResponse>("/notes", { params });
    return res.data;
  } catch (error) {
    handleApiError(error, "Error fetching notes");
    throw error;
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const res = await api.get<Note>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    handleApiError(error, "Error fetching note by id");
    throw error;
  }
};

export const createNote = async (payload: CreateNoteRequest): Promise<Note> => {
  try {
    const res = await api.post<Note>("/notes", payload);
    return res.data;
  } catch (error) {
    handleApiError(error, "Error creating note");
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const res = await api.delete<Note>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    handleApiError(error, "Error deleting note");
    throw error;
  }
};

export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async () => {
  const res = await api.get<ServerBoolResponse>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const res = await api.get<User>("/users/me");
  return res.data;
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

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  } catch (error) {
    handleApiError(error, "Error fetching categories");
    throw error;
  }
};

export const updateProfile = async (data: UpdateProfileRequest) => {
  const res = await api.put<User>("/users/me", data);
  return res.data;
};
