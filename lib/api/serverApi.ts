import { cookies } from "next/headers";
import { nextServer as api, FetchNotesResponse } from "./api";
import { ServerBoolResponse } from "./clientApi";
import { User } from "@/types/user";
import { FetchNotesParams, Note } from "@/types/note";

export const fetchNotes = async ({
  search = "",
  page = 1,
  perPage = 12,
  tag = "",
}: FetchNotesParams) => {
  const cookieStore = await cookies();
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      ...(search !== "" ? { search } : {}),
      ...(tag ? { tag } : {}),
      page,
      perPage,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const fetchNoteById = async (noteId: string) => {
  const cookieStore = await cookies();
  const response = await api.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const checkServerSession = async () => {
  const cookieData = await cookies();
  const response = await api<ServerBoolResponse>(`/auth/session`, {
    headers: { Cookie: cookieData.toString() },
  });
  return response;
};

export const getServerMe = async () => {
  const cookieData = await cookies();
  const { data } = await api<User>(`/users/me`, {
    headers: { Cookie: cookieData.toString() },
  });
  return data;
};

export const getServerNoteById = async (id: string): Promise<Note> => {
  const cookieData = await cookies();
  const { data } = await api<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieData.toString() },
  });
  return data;
};
