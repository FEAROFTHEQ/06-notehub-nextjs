export type NoteTag = "Work" | "Personal" | "Todo" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
}

export interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}
