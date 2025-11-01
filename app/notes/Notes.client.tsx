"use client";

import { fetchNotes } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import css from "./App.module.css";
import NoteList from "../../components/NoteList/NoteList";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import SearchBox from "../../components/SearchBox/SearchBox";

export default function NoteClient() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const {
    data: notesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", query, page],
    queryFn: () => fetchNotes(query, page),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const [isModal, setIsModal] = useState(false);

  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  const handleSearch = useDebouncedCallback((query: string) => {
    setQuery(query);
    setPage(1);
  }, 300);

  return (
    <>
      {isLoading && <p>Loading your notes...</p>}
      {isError && <p>Sorry, error happened...</p>}
      {!isLoading && !isError && notesData && (
        <div className={css.app}>
          <header className={css.toolbar}>
            <SearchBox onSearch={handleSearch} />
            {notesData.totalPages > 1 && (
              <Pagination
                totalPages={notesData.totalPages}
                page={page}
                setPage={setPage}
              />
            )}
            <button className={css.button} onClick={openModal}>
              Create note +
            </button>
            {isModal && (
              <Modal onClose={closeModal}>
                <NoteForm setPage={setPage} closeModal={closeModal} />
              </Modal>
            )}
          </header>
          {notesData && notesData.notes.length > 0 && (
            <NoteList notes={notesData.notes} />
          )}
        </div>
      )}
    </>
  );
}
