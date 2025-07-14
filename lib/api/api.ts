import { Note } from "@/types/note";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const nextServer = axios.create({
  baseURL,
  withCredentials: true,
});

export interface FetchNotesProps {
  search?: string;
  page?: number;
  perPage?: number;
  tag: string;
}

export type FetchNotesResponse = {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
};

export interface CreateUserData {
  email: string;
  password: string;
}

export interface SessionResponseData {
  success: true;
}

export default nextServer;
