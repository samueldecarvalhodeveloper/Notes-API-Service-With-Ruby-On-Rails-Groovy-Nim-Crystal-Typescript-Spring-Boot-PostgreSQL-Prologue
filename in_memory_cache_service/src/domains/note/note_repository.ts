import NoteEntity from "./infrastructure/entities/note_entities";
import NoteActiveRecord from "./note_active_record";

class NoteRepository {
  private noteActiveRecord: NoteActiveRecord;

  constructor(noteActiveRecord: NoteActiveRecord) {
    this.noteActiveRecord = noteActiveRecord;
  }

  public getNotes(userId: number): Promise<Array<NoteEntity>> {
    return this.noteActiveRecord.getAllNotesFromInMemoryDatabase(userId);
  }

  public getNote(noteId: number): Promise<NoteEntity> {
    return this.noteActiveRecord.getNoteFromInMemoryDatabase(noteId);
  }

  public async createNote(note: NoteEntity): Promise<void> {
    await this.noteActiveRecord.createNoteOnInMemoryDatabase(note);
  }

  public async updateNote(note: NoteEntity): Promise<void> {
    await this.noteActiveRecord.updateNoteOnInMemoryDatabase(note);
  }

  public async deleteNote(noteId: number, userId: number): Promise<void> {
    await this.noteActiveRecord.deleteNoteOnInMemoryDatabase(noteId, userId);
  }
}

export default NoteRepository;
