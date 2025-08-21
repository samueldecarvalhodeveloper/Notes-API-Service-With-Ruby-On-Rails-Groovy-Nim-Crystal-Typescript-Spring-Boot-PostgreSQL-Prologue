class NoteEntity {
  public readonly id: number;
  public readonly title: string;
  public readonly body: string;
  public readonly createdAt: number;
  public readonly updatedAt: number;
  public readonly userId: number;

  constructor(
    id: number,
    title: string,
    body: string,
    createdAt: number,
    updatedAt: number,
    userId: number,
  ) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
  }
}

export default NoteEntity;
