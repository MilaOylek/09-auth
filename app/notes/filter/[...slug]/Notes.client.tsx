"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import styles from "./notes.module.css";
import Link from "next/link";

const PER_PAGE = 12;

interface NotesClientProps {
  initialData?: FetchNotesResponse;
  tag?: string;
}

export default function Notes({ initialData, tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const { data, isError, isLoading, isFetching, error } = useQuery({
    queryKey: ["notes", debouncedQuery, page, tag],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedQuery, tag }),
    placeholderData: initialData,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
  });

  const handlePageChange = useCallback((pageNumber: number) => {
    setPage(pageNumber);
  }, []);

  const totalPages = data
    ? data.totalPages ?? Math.ceil(data.total / PER_PAGE)
    : 0;

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={query} onChange={(query) => setQuery(query)} />
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

      {(isLoading || isFetching) && <LoadingSpinner />}
      {isError && <ErrorMessage message={error?.message || "Unknown error"} />}
      {!isError && data?.notes && data.notes.length === 0 && (
        <ErrorMessage message="No notes found." />
      )}
      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}