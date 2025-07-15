import { cookies } from "next/headers";
import { nextServer as api } from "./api";
import { ServerBoolResponse } from "./clientApi";
import { FetchNotesResponse, FetchNotesParams, Note } from "@/types/note";
import { User } from "@/types/user";

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
  const response = await api.get<ServerBoolResponse>(`/auth/session`, {
    headers: { Cookie: cookieData.toString() },
  });
  return response;
};

export const getServerMe = async () => {
  const cookieData = await cookies();
  const { data } = await api.get<User>(`/users/me`, {
    headers: { Cookie: cookieData.toString() },
  });
  return data;
};
