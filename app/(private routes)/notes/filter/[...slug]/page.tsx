// import NotesClient from "./Notes.client";
// import { fetchNotes } from "@/lib/api/clientApi";
// import { notFound } from "next/navigation";
// import type { Metadata } from "next";

// type Props = {
//   params: Promise<{ slug: string[] }>;
// };

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { slug } = await params;
//   const tag = slug[0] === "All" || !slug[0] ? undefined : slug[0];
//   const tagTitle = tag || "All";

//   try {
//     await fetchNotes({ page: 1, tag });

//     return {
//       title: `${tagTitle} | NoteHub`,
//       description: `Browse notes tagged with "${tagTitle}".`,
//       openGraph: {
//         title: `${tagTitle} | NoteHub`,
//         description: `Browse notes tagged with "${tagTitle}".`,
//         url: `https://09-auth-rose.vercel.app/notes/filter/${slug.join("/")}`,
//         siteName: "NoteHub",
//         images: [
//           {
//             url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
//             width: 1200,
//             height: 630,
//             alt: "NoteHub",
//           },
//         ],
//         type: "website",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: `${tagTitle} | NoteHub`,
//         description: `Browse notes tagged with "${tagTitle}".`,
//         images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
//       },
//     };
//   } catch {
//     return {
//       title: "Not Found | NoteHub",
//       description: "The requested notes could not be found.",
//     };
//   }
// }

// export default async function NotesPage({ params }: Props) {
//   const { slug } = await params;
//   const tag = slug[0] === "All" || !slug[0] ? undefined : slug[0];

//   try {
//     const notes = await fetchNotes({ page: 1, tag });
//     return <NotesClient initialData={notes} tag={tag} />;
//   } catch {
//     return notFound();
//   }
// }

import NotesClient from "./Notes.client"; // Переконайтеся, що шлях до компонента NotesClient правильний
import { fetchNotes } from "@/lib/api/clientApi"; // Це функція fetchNotes з вашого clientApi.ts
import { notFound } from "next/navigation"; // Функція Next.js для відображення сторінки 404
import type { Metadata } from "next"; // Тип для метаданих Next.js

// --- Типи ---
// Визначення типів для пропсів сторінки.
// У Next.js App Router, `params` передається без `Promise`.
type NotesPageProps = {
  params: { slug: string[] };
};

// --- Генерація метаданих (SEO) ---
// Ця асинхронна функція створює метадані для сторінки на основі її вмісту.
// Вона виконується на сервері.
export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  // Визначаємо тег на основі першого елемента slug.
  // Якщо slug[0] - "All" або відсутній, тег буде undefined.
  const tag =
    params.slug[0] === "All" || !params.slug[0] ? undefined : params.slug[0];
  const tagTitle = tag || "All"; // Заголовок для використання в метаданих

  try {
    // Намагаємося отримати нотатки, щоб перевірити їхнє існування
    // та створити відповідні метадані.
    // Якщо тут виникне помилка, ми повернемо загальні метадані "Not Found".
    // Ми не викликаємо `notFound()` тут напряму, щоб не переривати рендеринг основної сторінки.
    await fetchNotes({ page: 1, tag });

    // Повертаємо детальні метадані, якщо дані були успішно завантажені або тег існує.
    return {
      title: `${tagTitle} | NoteHub`, // Заголовок сторінки
      description: `Browse notes tagged with "${tagTitle}".`, // Опис сторінки
      openGraph: {
        title: `${tagTitle} | NoteHub`,
        description: `Browse notes tagged with "${tagTitle}".`,
        // **Важливо:** Замініть URL на ваш актуальний розгорнутий домен.
        url: `https://09-auth-rose.vercel.app/notes/filter/${params.slug.join(
          "/"
        )}`,
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
  } catch (error) {
    // Якщо виникла помилка під час отримання даних для метаданих,
    // логуємо її та повертаємо загальні метадані "Not Found".
    console.error(
      "Server-side generateMetadata error fetching initial notes:",
      error
    );
    return {
      title: "Not Found | NoteHub",
      description:
        "The requested notes could not be found or an error occurred.",
    };
  }
}

// --- Основний компонент сторінки ---
// Цей асинхронний компонент виконується на сервері для отримання даних
// та початкового рендерингу.
export default async function NotesPage({ params }: NotesPageProps) {
  // Знову визначаємо тег.
  const tag =
    params.slug[0] === "All" || !params.slug[0] ? undefined : params.slug[0];

  try {
    // Виконуємо запит до API для отримання нотаток. Цей запит відбувається на сервері.
    const initialNotesData = await fetchNotes({ page: 1, tag });

    // Логуємо отримані дані, щоб перевірити їхню структуру у терміналі сервера.
    console.log(
      "Server Component: Data fetched (initialNotesData):",
      initialNotesData
    );

    // Перевіряємо, чи дані отримано та чи є масив нотаток.
    // Якщо дані відсутні або нотатки не є масивом (наприклад, null/undefined),
    // це вказує на проблему з API або типізацією, тому повертаємо 404.
    if (!initialNotesData || !initialNotesData.notes) {
      console.warn(
        "Server Component: initialNotesData or initialNotesData.notes is undefined/null. Calling notFound().",
        initialNotesData
      );
      return notFound(); // Відображаємо сторінку 404
    }

    // Якщо запит був успішним, але нотаток для даного тегу немає (порожній масив),
    // ми просто логуємо це і передаємо порожні дані клієнтському компоненту.
    // Це дозволить NotesClient відобразити повідомлення "No notes found.",
    // а не перенаправляти на 404, що краще для UX.
    if (initialNotesData.notes.length === 0) {
      console.log(
        "Server Component: No notes found for this tag, but API call was successful. Passing empty array to client."
      );
    }

    // Передаємо отримані дані та тег клієнтському компоненту NotesClient.
    // Він буде використовувати initialData для початкового рендерингу.
    return <NotesClient initialData={initialNotesData} tag={tag} />;
  } catch (error) {
    // Якщо під час `fetchNotes` на сервері виникла будь-яка помилка
    // (наприклад, помилка мережі, помилка сервера API, CORS на бекенді),
    // логуємо її та повертаємо 404 сторінку.
    console.error("Server Component: Error during fetchNotes:", error);
    return notFound(); // Відображаємо сторінку 404 при помилці завантаження
  }
}
