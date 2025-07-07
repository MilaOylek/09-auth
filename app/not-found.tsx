import { Metadata } from "next";
import NotFoundClient from "./not-found-client";


 export const metadata: Metadata = {
   title: '404 — Page Not Found | NoteHub',
  description: 'The page you are looking for does not exist on NoteHub.',
  openGraph: {
    title: '404 — NoteHub',
    description: 'Page not found on NoteHub',
    url: 'https://08-zustand-plum.vercel.app/not-found',
      
    siteName: "NoteHub",
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoteHub',
    description: 'Manage your personal notes efficiently',
      
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
