import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { useId } from "react";
import type { NoteFormValues, NoteTag } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createNote } from "../../lib/api";

interface NoteFormProps {
  setPage: (page: number) => void;
  closeModal: () => void;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Personal",
};

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Content is too long!").optional(),
  tag: Yup.string<NoteTag>().required(),
});

export default function NoteForm({ setPage, closeModal }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutateSubmit = useMutation({
    mutationFn: async (values: NoteFormValues) => {
      const res = await createNote(values);
      return res;
    },
    onSuccess: (data) => {
      toast.success(`Successfully created note "${data.title}"!`);
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setPage(1);
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-left",
      });
    },
  });

  function handleSubmit(
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) {
    mutateSubmit.mutate(values);
    actions.resetForm();
  }
  const id = useId();

  function handleCancel() {
    closeModal();
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`title-${id}`}>Title</label>
          <Field
            id={`title-${id}`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`content-${id}`}>Content</label>
          <Field
            as="textarea"
            id={`content-${id}`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`tag-${id}`}>Tag</label>
          <Field as="select" id={`tag-${id}`} name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            {mutateSubmit.isPending ? "Creating note..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
