"use client";
import css from "./NotesClient.module.css";
import Loader from "@/components/Loader/Loader";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";

function NotesClient() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isModal, setIsModal] = useState(false);

  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  const {
    data: notesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", query, page],
    queryFn: () => fetchNotes(query, page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Sorry, error happened", {
        position: "top-left",
      });
    }
  }, [isError]);

  const handleSearch = useDebouncedCallback((query: string) => {
    setQuery(query);
    setPage(1);
  }, 300);

  return (
    <>
      <Toaster />
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={handleSearch} />
          {notesData && notesData.totalPages > 1 && (
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
        {isLoading && <Loader />}
        {notesData && notesData.notes.length > 0 && (
          <NoteList notes={notesData.notes} />
        )}
      </div>
    </>
  );
}

export default NotesClient;
