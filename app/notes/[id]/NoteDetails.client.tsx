"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import css from "./NoteDetails.module.css";
import { fetchNoteById } from "@/lib/api";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });
  return (
    <>
      {isLoading && <p>Loading, please wait...</p>}
      {error && !note && <p>Something went wrong.</p>}
      {!isLoading && !error && note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              Created date: {new Date(note.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
