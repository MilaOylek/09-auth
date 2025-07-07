"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";
import type { Note } from "@/types/note";

type NotePreviewProps = {
  id: number;
};

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !isNaN(id),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false, 
  });

  const handleClose = () => {
    router.back();
  };

  if (isNaN(id)) {
    return <p className={css.messageError}>Invalid note ID.</p>;
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        {isLoading && <p className={css.message}>Loading, please wait...</p>}
        {isError && (
          <p className={css.messageError}>
            Could not fetch note. {error?.message}
          </p>
        )}
        {note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              {note.tag && <span className={css.tag}>{note.tag}</span>}
            </div>
            <div className={css.content}>{note.content}</div>
            <div className={css.date}>
              {note.createdAt
                ? new Date(note.createdAt).toLocaleString("uk-UA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "No date"}
            </div>
            <button onClick={handleClose} className={css.backBtn}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
