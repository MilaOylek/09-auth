import { cookies } from "next/headers";
import { nextServer } from "./api";
import { ServerBoolResponse } from "./clientApi";
import { User } from "@/types/user";
import { Note } from "@/types/note";

export const checkServerSession = async () => {
  const cookieData = await cookies();
  const response = await nextServer<ServerBoolResponse>(`/auth/session`, {
    headers: { Cookie: cookieData.toString() },
  });
  return response;
};

export const getServerMe = async () => {
  const cookieData = await cookies();
  const { data } = await nextServer<User>(`/users/me`, {
    headers: { Cookie: cookieData.toString() },
  });
  return data;
};

export const getServerNoteById = async (id: string): Promise<Note> => {
  const cookieData = await cookies();
  const { data } = await nextServer<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieData.toString() },
  });
  return data;
};
