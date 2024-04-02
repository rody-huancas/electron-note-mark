import { atom } from 'jotai'
import { NoteInfo } from '@shared/models'
import { notesMock } from './mocks'
import { unwrap } from 'jotai/utils'
import { NoteContent } from '../../../shared/models';

const loadNotes = async() => {
  const notes = await window.context.getNotes();
  return notes.sort((a,b) => b.lastEditTime - a.lastEditTime);
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes());

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev);

export const selectedNoteIndexAtom = atom<number | null>(null);

const selectedNoteAtomAsync = atom(async(get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  if (selectedNoteIndex === null || !notes) return null

  const selectedNote = notes[selectedNoteIndex];

  const noteContent = await window.context.readNote(selectedNote.title);

  return {
    ...selectedNote,
    content: noteContent
  }
});

export const saveNoteAtom = atom(null, async(get, set, newContent: NoteContent) => {
  const notes = get(notesAtom);
  const selectedNote = get(selectedNoteAtom);

  if(!selectedNote || !notes) return;

  // guardar en el disco
  await window.context.writeNote(selectedNote.title, newContent);
  
  set(
    notesAtom,
    notes.map((note) => {
      if (note.title === selectedNote.title) {
        return {
          ...note,
          lastEditTime: Date.now(),
        }
      }
      return note;
    })
  )
})

export const selectedNoteAtom = unwrap(selectedNoteAtomAsync, (prev) => prev ?? {
  title: '',
  content: '',
  lastEditTime: Date.now()
});

export const createEmptyNoteAtom = atom(null, async(get, set) => {
  const notes = get(notesAtom);

  if(!notes) return;

  const title = await window.context.createNote();

  if(!title) return;

  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now()
  }

  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])
  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom);
  const selectedNote = get(selectedNoteAtom);

  if (!selectedNote || !notes) return;

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})
