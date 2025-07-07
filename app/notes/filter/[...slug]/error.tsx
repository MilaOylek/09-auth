'use client';

import { useEffect } from 'react';

export default function NotesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}