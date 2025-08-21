import {
  IN_MEMORY_DATABASE_HOST_NAME,
  IN_MEMORY_DATABASE_HOST_PORT,
} from "../../constants/application_constants";
import InMemoryDatabaseFactory from "../in_memory_database/in_memory_database_factory";
import NoteActiveRecordDecorator from "./note_active_record_decorator";
import NoteRepository from "./note_repository";

class NoteRepositoryFactory {
  private static instance: NoteRepository | null = null;

  private constructor() {}

  public static async getInstance(): Promise<NoteRepository> {
    if (this.instance === null) {
      const inMemoryDatabase = await InMemoryDatabaseFactory.getInstance(
        IN_MEMORY_DATABASE_HOST_NAME,
        IN_MEMORY_DATABASE_HOST_PORT,
      );

      const noteActiveRecord = new NoteActiveRecordDecorator(inMemoryDatabase);

      this.instance = new NoteRepository(noteActiveRecord);
    }

    return this.instance;
  }
}

export default NoteRepositoryFactory;
