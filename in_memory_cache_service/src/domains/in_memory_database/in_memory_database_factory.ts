import { createClient } from "redis";
import InMemoryDatabase from "./in_memory_database";
import { IN_MEMORY_DATABASE_URL } from "../../constants/application_constants";
import { RedisClientType } from "@redis/client";
import InMemoryDatabaseDecorator from "./in_memory_database_decorator";

class InMemoryDatabaseFactory {
  private static instance: InMemoryDatabase | null = null;

  private constructor() {}

  public static async getInstance(
    host: string,
    port: number,
  ): Promise<InMemoryDatabase> {
    if (this.instance === null) {
      const inMemoryDatabaseImplementation = (await createClient({
        url: IN_MEMORY_DATABASE_URL(host, port),
      }).connect()) as RedisClientType<any>;

      this.instance = new InMemoryDatabaseDecorator(
        inMemoryDatabaseImplementation,
      );
    }

    return this.instance;
  }
}

export default InMemoryDatabaseFactory;
