import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "All" || !slug[0] ? undefined : slug[0];
  const tagTitle = tag || "All";

  try {
    await fetchNotes({ page: 1, tag });

    return {
      title: `${tagTitle} | NoteHub`,
      description: `Browse notes tagged with "${tagTitle}".`,
      openGraph: {
        title: `${tagTitle} | NoteHub`,
        description: `Browse notes tagged with "${tagTitle}".`,
        url: `https://08-zustand-plum.vercel.app/notes/filter/${slug.join("/")}`,
        siteName: "NoteHub",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${tagTitle} | NoteHub`,
        description: `Browse notes tagged with "${tagTitle}".`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  } catch {
    return {
      title: "Not Found | NoteHub",
      description: "The requested notes could not be found.",
    };
  }
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0] === "All" || !slug[0] ? undefined : slug[0];

  try {
    const notes = await fetchNotes({ page: 1, tag });
    return <NotesClient initialData={notes} tag={tag} />;
  } catch {
    return notFound();
  }
}
