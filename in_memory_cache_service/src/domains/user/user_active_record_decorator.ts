import InMemoryDatabase from "../in_memory_database/in_memory_database";
import NoteRepositoryFactory from "../note/note_repository_factory";
import UserActiveRecord from "./user_active_record";

class UserActiveRecordDecorator extends UserActiveRecord {
  public constructor(inMemoryDatabase: InMemoryDatabase) {
    super(inMemoryDatabase);
  }

  public async deleteUserOnInMemoryDatabase(id: number): Promise<void> {
    try {
      const noteRepository = await NoteRepositoryFactory.getInstance();

      const notesOfUserToBeDeleted = await noteRepository.getNotes(id);

      for (const note of notesOfUserToBeDeleted) {
        await noteRepository.deleteNote(note.id, id);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}

    await super.deleteUserOnInMemoryDatabase(id);
  }
}

export default UserActiveRecordDecorator;
