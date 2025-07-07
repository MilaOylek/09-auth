import NoteForm from '@/components/NoteForm/NoteForm';
import { Metadata } from 'next';
import css from "./CreateNote.module.css";

export const metadata: Metadata = {
  title: "Create Note | NoteHub",
  description: "Create a new note in NoteHub.",
  openGraph: {
    title: "Create Note — NoteHub",
    description: "Create a new note in NoteHub.",
    url: "https://08-zustand-plum.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create New Note",
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
