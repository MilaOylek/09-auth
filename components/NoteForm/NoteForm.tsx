"use client";

import { useNoteStore } from "@/lib/store/noteStore";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useState } from "react";
import { type CreateNotePayload, type Tag } from "@/types/note";
import styles from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const [formState, setFormState] = useState(draft);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
    onError: (err) => {
      console.error("Error creating note:", err);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const updated = { ...formState, [name]: value };
    setFormState(updated);
    setDraft(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateNotePayload = {
      title: formState.title,
      content: formState.content,
      tag: formState.tag as Tag,
    };

    mutation.mutate(payload);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          type="text"
          value={formState.title}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          rows={6}
          value={formState.content}
          onChange={handleChange}
          className={styles.textarea}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          name="tag"
          value={formState.tag}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      {mutation.isError && (
        <p className={styles.error}>Failed to create note. Try again.</p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}