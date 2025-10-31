"use client";

import { useState } from "react";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import toast, { Toaster } from "react-hot-toast";
import { fetchNotes } from "../../lib/api";
import NoteList from "../../components/NoteList/NoteList";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import SearchBox from "../../components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";

function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isModal, setIsModal] = useState(false);

  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  const { data: notesData } = useQuery({
    queryKey: ["notes", query, page],
    queryFn: () => fetchNotes(query, page),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearch = useDebouncedCallback((query: string) => {
    setQuery(query);
    setPage(1);
  }, 300);

  return (
    <>
      {/* <Toaster /> */}
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
        {notesData && notesData.notes.length > 0 && (
          <NoteList notes={notesData.notes} />
        )}
      </div>
    </>
  );
}

export default App;
