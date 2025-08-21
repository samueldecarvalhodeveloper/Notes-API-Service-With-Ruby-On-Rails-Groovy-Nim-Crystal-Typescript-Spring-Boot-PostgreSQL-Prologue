import NoteEntity from "./infrastructure/entities/note_entities";

class NoteEntityFactory {
  private constructor() {}

  public static getInstance(
    id: number,
    title: string,
    body: string,
    createdAt: number,
    updatedAt: number,
    userId: number,
  ): NoteEntity {
    return new NoteEntity(id, title, body, createdAt, updatedAt, userId);
  }
}

export default NoteEntityFactory;
