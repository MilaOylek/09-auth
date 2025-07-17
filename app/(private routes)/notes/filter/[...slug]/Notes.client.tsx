// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useDebounce } from "use-debounce";
// import { useQuery } from "@tanstack/react-query";
// import { fetchNotes } from "@/lib/api/clientApi";
// import { type FetchNotesResponse } from "@/types/note";
// import NoteList from "@/components/NoteList/NoteList";
// import Pagination from "@/components/Pagination/Pagination";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
// import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
// import styles from "./notes.module.css";
// import Link from "next/link";

// const PER_PAGE = 12;

// interface NotesClientProps {
//   initialData?: FetchNotesResponse;
//   tag?: string;
// }

// export default function Notes({ initialData, tag }: NotesClientProps) {
//   const [page, setPage] = useState(1);
//   const [query, setQuery] = useState("");
//   const [debouncedQuery] = useDebounce(query, 500);

//   useEffect(() => {
//     setPage(1);
//   }, [debouncedQuery]);

//   const { data, isError, isLoading, isFetching, error } = useQuery({
//     queryKey: ["notes", debouncedQuery, page, tag],
//     queryFn: () =>
//       fetchNotes({ page, perPage: PER_PAGE, search: debouncedQuery, tag }),
//     placeholderData: initialData,
//     refetchOnMount: false,
//     staleTime: 5 * 60 * 1000,
//   });

//   const handlePageChange = useCallback((pageNumber: number) => {
//     setPage(pageNumber);
//   }, []);

//   const totalPages = data ? data.totalPages : 0;

//   return (
//     <div className={styles.app}>
//       <header className={styles.toolbar}>
//         <SearchBox value={query} onChange={(query) => setQuery(query)} />
//         {data && totalPages > 1 && (
//           <Pagination
//             totalPages={totalPages}
//             currentPage={page}
//             onPageChange={handlePageChange}
//           />
//         )}

//         <Link href="/notes/action/create" className={styles.button}>
//           Create note +
//         </Link>
//       </header>

//       {(isLoading || isFetching) && <LoadingSpinner />}
//       {isError && <ErrorMessage message={error?.message || "Unknown error"} />}
//       {!isError && data?.notes && data.notes.length === 0 && (
//         <ErrorMessage message="No notes found." />
//       )}
//       {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}
//     </div>
//   );
// }
// components/Notes/Notes.client.tsx
"use client"; // Обов'язковий прапорець для клієнтського компонента

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce"; // Переконайтеся, що цей пакет встановлено
import { useQuery } from "@tanstack/react-query"; // Переконайтеся, що React Query встановлено та налаштовано Provider у layout.tsx
import { fetchNotes } from "@/lib/api/clientApi"; // Шлях до вашого clientApi.ts
import { type FetchNotesResponse } from "@/types/note"; // Шлях до типу FetchNotesResponse
import NoteList from "@/components/NoteList/NoteList"; // Шлях до NoteList компонента
import Pagination from "@/components/Pagination/Pagination"; // Шлях до Pagination компонента
import SearchBox from "@/components/SearchBox/SearchBox"; // Шлях до SearchBox компонента
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner"; // Шлях до LoadingSpinner
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage"; // Шлях до ErrorMessage
import styles from "./notes.module.css"; // Шлях до CSS-модуля
import Link from "next/link";

const PER_PAGE = 12;

interface NotesClientProps {
  initialData?: FetchNotesResponse; // Може бути undefined, якщо Server Component не передав
  tag?: string;
}

export default function NotesClient({ initialData, tag }: NotesClientProps) {
  // Використовуємо початкові дані або дефолтні значення
  const [page, setPage] = useState(initialData?.currentPage || 1);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  // Скидаємо сторінку на 1 при зміні пошукового запиту
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  // React Query для завантаження та кешування даних
  const { data, isError, isLoading, isFetching, error } = useQuery<
    FetchNotesResponse,
    Error // Тип помилки
  >({
    queryKey: ["notes", debouncedQuery, page, tag], // Ключ, що визначає унікальність запиту
    queryFn: async () => {
      // Логуємо клієнтський запит
      console.log("Client Component: Fetching notes with params:", {
        page,
        perPage: PER_PAGE,
        search: debouncedQuery,
        tag,
      });
      const result = await fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedQuery,
        tag,
      });
      console.log("Client Component: Notes fetched (data):", result);
      return result;
    },
    // placeholderData відображається, поки queryFn не поверне дані.
    // Це забезпечує плавний перехід від SSR до CSR.
    placeholderData: initialData,
    // staleTime: Якщо дані молодші за staleTime, вони вважаються "свіжими"
    // і не будуть перевантажуватися на mount.
    staleTime: 5 * 60 * 1000, // 5 хвилин
    // refetchOnMount: 'false' означає, що запит не буде автоматично виконуватися при кожному маунті
    // якщо дані вже є і вони не "stale". Це запобігає зайвим запитам після SSR.
    refetchOnMount: false,
    // refetchOnWindowFocus: Зазвичай корисно залишити 'true'
    refetchOnWindowFocus: true,
    // initialData: Забезпечує, що дані від SSR будуть використовуватись як початкові,
    // і useQuery не буде робити запит, якщо initialData вже є.
    // Важливо: initialData не оновлюється при зміні queryKey.
    // placeholderData краще для вашого випадку, бо дані можуть змінюватись.
    // initialData: initialData ? initialData : undefined, // Якщо ви не використовуєте placeholderData
  });

  const handlePageChange = useCallback((pageNumber: number) => {
    setPage(pageNumber);
    // Можете додати refetch(), якщо ви хочете негайно оновити дані
    // refetch();
  }, []);

  // Визначення загальної кількості сторінок
  const totalPages = data?.totalPages || 0; // Використовуйте data?.totalPages

  // Логування стану React Query
  useEffect(() => {
    console.log(
      "Client Component State: isLoading:",
      isLoading,
      "isFetching:",
      isFetching,
      "isError:",
      isError,
      "data:",
      data,
      "error:",
      error
    );
  }, [isLoading, isFetching, isError, data, error]);

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={query} onChange={(newQuery) => setQuery(newQuery)} />
        {/* Показуємо пагінацію тільки якщо є дані та більше однієї сторінки */}
        {data && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <Link href="/notes/action/create" className={styles.button}>
          Create note +
        </Link>
      </header>

      {/* Умовний рендеринг: спочатку завантаження, потім помилка, потім відсутність нотаток, потім список нотаток */}
      {(isLoading || isFetching) && <LoadingSpinner />}

      {!isLoading && !isFetching && isError && (
        <ErrorMessage message={error?.message || "Failed to load notes."} />
      )}

      {/* Якщо немає помилок і дані завантажені, але нотаток немає */}
      {!isLoading &&
        !isFetching &&
        !isError &&
        data?.notes &&
        data.notes.length === 0 && (
          <ErrorMessage message="No notes found for this filter." />
        )}

      {/* Якщо немає помилок, дані завантажені і є нотатки */}
      {!isLoading &&
        !isFetching &&
        !isError &&
        data?.notes &&
        data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
