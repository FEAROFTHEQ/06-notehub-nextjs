"use client";

import { useState } from "react";
import css from "./App.module.css";
// import toast, { Toaster } from "react-hot-toast";
import NoteList from "../../components/NoteList/NoteList";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import SearchBox from "../../components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import { Note } from "@/types/note";

interface AppProps {
  setPage: (page: number) => void;
  setQuery: (query: string) => void;
  notesData: { notes: Note[]; totalPages: number };
  page: number;
}

function App({ setPage, setQuery, notesData, page }: AppProps) {
  const [isModal, setIsModal] = useState(false);

  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

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
