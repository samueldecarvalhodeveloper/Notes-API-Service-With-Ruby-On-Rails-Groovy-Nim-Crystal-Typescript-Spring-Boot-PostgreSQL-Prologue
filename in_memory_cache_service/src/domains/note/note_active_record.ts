import {
  NOTE_BODY_IN_MEMORY_DATABASE_KEY,
  NOTE_CREATED_AT_IN_MEMORY_DATABASE_KEY,
  NOTE_HASH_IN_MEMORY_DATABASE_KEY,
  NOTE_ID_IN_MEMORY_DATABASE_KEY,
  NOTE_IN_MEMORY_DATABASE_KEY,
  NOTE_TITLE_IN_MEMORY_DATABASE_KEY,
  NOTE_UPDATED_AT_IN_MEMORY_DATABASE_KEY,
  NOTE_USER_ID_IN_MEMORY_DATABASE_KEY,
} from "../../constants/domains/note_constants";
import HashItemEntityFactory from "../in_memory_database/hash_item_entity_factory";
import InMemoryDatabase from "../in_memory_database/in_memory_database";
import NoteEntity from "./infrastructure/entities/note_entities";
import NoteEntityFactory from "./note_entity_factory";

class NoteActiveRecord {
  private inMemoryDatabase: InMemoryDatabase;

  public constructor(inMemoryDatabase: InMemoryDatabase) {
    this.inMemoryDatabase = inMemoryDatabase;
  }

  public async getAllNotesFromInMemoryDatabase(
    userId: number,
  ): Promise<Array<NoteEntity>> {
    const listOfNotes: Array<NoteEntity> = [];

    const listOfNotesIdFromInMemoryDatabase =
      await this.inMemoryDatabase.getAllSetValues(
        NOTE_IN_MEMORY_DATABASE_KEY(userId),
      );

    for (const noteId of listOfNotesIdFromInMemoryDatabase) {
      const retrievedHashOfNoteFromInMemoryDatabase =
        await this.inMemoryDatabase.getHash(
          NOTE_HASH_IN_MEMORY_DATABASE_KEY(Number(noteId)),
        );

      const note = NoteEntityFactory.getInstance(
        Number(retrievedHashOfNoteFromInMemoryDatabase[0].value),
        retrievedHashOfNoteFromInMemoryDatabase[1].value,
        retrievedHashOfNoteFromInMemoryDatabase[2].value,
        Number(retrievedHashOfNoteFromInMemoryDatabase[3].value),
        Number(retrievedHashOfNoteFromInMemoryDatabase[4].value),
        Number(retrievedHashOfNoteFromInMemoryDatabase[5].value),
      );

      listOfNotes.push(note);
    }

    return listOfNotes;
  }

  public async getNoteFromInMemoryDatabase(
    noteId: number,
  ): Promise<NoteEntity> {
    const retrievedHashOfNoteFromInMemoryDatabase =
      await this.inMemoryDatabase.getHash(
        NOTE_HASH_IN_MEMORY_DATABASE_KEY(Number(noteId)),
      );

    const note = NoteEntityFactory.getInstance(
      Number(retrievedHashOfNoteFromInMemoryDatabase[0].value),
      retrievedHashOfNoteFromInMemoryDatabase[1].value,
      retrievedHashOfNoteFromInMemoryDatabase[2].value,
      Number(retrievedHashOfNoteFromInMemoryDatabase[3].value),
      Number(retrievedHashOfNoteFromInMemoryDatabase[4].value),
      Number(retrievedHashOfNoteFromInMemoryDatabase[5].value),
    );

    return note;
  }

  public async createNoteOnInMemoryDatabase(note: NoteEntity): Promise<void> {
    await this.inMemoryDatabase.addHash(
      NOTE_HASH_IN_MEMORY_DATABASE_KEY(note.id),
      [
        HashItemEntityFactory.getInstance(
          NOTE_ID_IN_MEMORY_DATABASE_KEY,
          note.id.toString(),
        ),
        HashItemEntityFactory.getInstance(
          NOTE_TITLE_IN_MEMORY_DATABASE_KEY,
          note.title,
        ),
        HashItemEntityFactory.getInstance(
          NOTE_BODY_IN_MEMORY_DATABASE_KEY,
          note.body,
        ),
        HashItemEntityFactory.getInstance(
          NOTE_CREATED_AT_IN_MEMORY_DATABASE_KEY,
          note.createdAt.toString(),
        ),
        HashItemEntityFactory.getInstance(
          NOTE_UPDATED_AT_IN_MEMORY_DATABASE_KEY,
          note.updatedAt.toString(),
        ),
        HashItemEntityFactory.getInstance(
          NOTE_USER_ID_IN_MEMORY_DATABASE_KEY,
          note.userId.toString(),
        ),
      ],
    );

    await this.inMemoryDatabase.addValueToSet(
      NOTE_IN_MEMORY_DATABASE_KEY(note.userId),
      note.id.toString(),
    );
  }

  public async updateNoteOnInMemoryDatabase(note: NoteEntity): Promise<void> {
    await this.inMemoryDatabase.updateHash(
      NOTE_HASH_IN_MEMORY_DATABASE_KEY(note.id),
      [
        HashItemEntityFactory.getInstance(
          NOTE_ID_IN_MEMORY_DATABASE_KEY,
          note.id.toString(),
        ),
        HashItemEntityFactory.getInstance(
          NOTE_TITLE_IN_MEMORY_DATABASE_KEY,
          note.title,
        ),
        HashItemEntityFactory.getInstance(
          NOTE_BODY_IN_MEMORY_DATABASE_KEY,
          note.body,
        ),
        HashItemEntityFactory.getInstance(
          NOTE_CREATED_AT_IN_MEMORY_DATABASE_KEY,
          note.createdAt.toString(),
        ),
        HashItemEntityFactory.getInstance(
          NOTE_UPDATED_AT_IN_MEMORY_DATABASE_KEY,
          note.updatedAt.toString(),
        ),
        HashItemEntityFactory.getInstance(
          NOTE_USER_ID_IN_MEMORY_DATABASE_KEY,
          note.userId.toString(),
        ),
      ],
    );
  }

  public async deleteNoteOnInMemoryDatabase(
    noteId: number,
    userId: number,
  ): Promise<void> {
    await this.inMemoryDatabase.deleteHash(
      NOTE_HASH_IN_MEMORY_DATABASE_KEY(noteId),
    );

    await this.inMemoryDatabase.deleteValueFromSet(
      NOTE_IN_MEMORY_DATABASE_KEY(userId),
      noteId.toString(),
    );
  }
}

export default NoteActiveRecord;
