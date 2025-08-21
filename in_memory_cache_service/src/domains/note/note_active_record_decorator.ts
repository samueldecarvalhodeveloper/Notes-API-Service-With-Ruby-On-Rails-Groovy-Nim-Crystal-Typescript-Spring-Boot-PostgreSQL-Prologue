import InMemoryDatabase from "../in_memory_database/in_memory_database";
import NoteEntity from "./infrastructure/entities/note_entities";
import AlreadyExistingNoteError from "./infrastructure/errors/already_existing_note_error";
import NotExistingNoteError from "./infrastructure/errors/not_existing_note_error";
import NoteActiveRecord from "./note_active_record";
import VerifyIfUserExistsAdapter from "./verify_if_user_exists_adapter";

class NoteActiveRecordDecorator extends NoteActiveRecord {
  public constructor(inMemoryDatabase: InMemoryDatabase) {
    super(inMemoryDatabase);
  }

  public async getAllNotesFromInMemoryDatabase(
    userId: number,
  ): Promise<Array<NoteEntity>> {
    await VerifyIfUserExistsAdapter.verifyIfUserExists(userId);

    return super.getAllNotesFromInMemoryDatabase(userId);
  }

  public async getNoteFromInMemoryDatabase(
    noteId: number,
  ): Promise<NoteEntity> {
    try {
      const noteFromInMemoryDatabase = await super.getNoteFromInMemoryDatabase(
        noteId,
      );

      return noteFromInMemoryDatabase;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotExistingNoteError();
    }
  }

  public async createNoteOnInMemoryDatabase(note: NoteEntity): Promise<void> {
    await VerifyIfUserExistsAdapter.verifyIfUserExists(note.userId);

    try {
      await super.createNoteOnInMemoryDatabase(note);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AlreadyExistingNoteError();
    }
  }

  public async updateNoteOnInMemoryDatabase(note: NoteEntity): Promise<void> {
    await VerifyIfUserExistsAdapter.verifyIfUserExists(note.userId);

    try {
      await super.updateNoteOnInMemoryDatabase(note);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotExistingNoteError();
    }
  }

  public async deleteNoteOnInMemoryDatabase(
    noteId: number,
    userId: number,
  ): Promise<void> {
    await VerifyIfUserExistsAdapter.verifyIfUserExists(userId);

    try {
      await super.deleteNoteOnInMemoryDatabase(noteId, userId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotExistingNoteError();
    }
  }
}

export default NoteActiveRecordDecorator;
