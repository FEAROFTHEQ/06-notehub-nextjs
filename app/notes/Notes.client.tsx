"use client";

import { fetchNotes } from "@/lib/api";
import App from "./App";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function NoteClient() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const { data: notesData, isLoading } = useQuery({
    queryKey: ["notes", query, page],
    queryFn: () => fetchNotes(query, page),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });
  return (
    <>
      {isLoading && <p>Loading your notes...</p>}
      {!isLoading && notesData && (
        <App
          setPage={setPage}
          setQuery={setQuery}
          notesData={notesData}
          page={page}
        />
      )}
    </>
  );
}
