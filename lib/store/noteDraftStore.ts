import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateNoteRequest } from "../../types/note";

type NoteDraftStore = {
  draft: CreateNoteRequest;
  setDraft: (newNoteDraft: CreateNoteRequest) => void;
  clearDraft: () => void;
};

export const useNoteDraft = create<NoteDraftStore>()(
  persist(
    (set) => {
      return {
        draft: {
          title: "",
          content: "",
          categoryId: "",
        },
        setDraft: (newNoteDraft: CreateNoteRequest) => {
          return set({
            draft: newNoteDraft,
          });
        },
        clearDraft: () => {
          return set({
            draft: {
              title: "",
              content: "",
              categoryId: "",
            },
          });
        },
      };
    },
    {
      name: "draft",
      partialize: (store) => {
        return { draft: store.draft };
      },
    }
  )
);
