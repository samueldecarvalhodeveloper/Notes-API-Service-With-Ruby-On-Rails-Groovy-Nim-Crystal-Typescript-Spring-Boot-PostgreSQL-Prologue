class UserEntity {
  public readonly id: number;
  public readonly username: string;

  constructor(id: number, username: string) {
    this.id = id;
    this.username = username;
  }
}

export default UserEntity;
