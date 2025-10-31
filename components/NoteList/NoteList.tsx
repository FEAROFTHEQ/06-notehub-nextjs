import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
import { deleteNote } from "../../lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const mutateDelete = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteNote(id);
      return res;
    },
    onSuccess: (data) => {
      toast.success(`Successfully deleted note "${data.title}"!`);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-left",
      });
    },
  });

  function handleDelete(id: string) {
    mutateDelete.mutate(id);
  }
  return (
    <ul className={css.list}>
      {notes.map((note) => {
        const { title, content, tag, id } = note;
        return (
          <li className={css.listItem} key={id}>
            <h2 className={css.title}>{title}</h2>
            <p className={css.content}>{content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{tag}</span>
              <Link href={`/notes/${id}`}>View details</Link>
              <button className={css.button} onClick={() => handleDelete(id)}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
