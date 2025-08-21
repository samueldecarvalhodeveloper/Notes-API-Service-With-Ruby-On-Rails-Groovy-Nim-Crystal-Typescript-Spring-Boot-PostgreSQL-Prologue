export function IN_MEMORY_DATABASE_URL(host: string, port: number) {
  return `redis://:@${host}:${port}`;
}

export const IN_MEMORY_DATABASE_HOST_NAME = process.env.IN_MEMORY_DATABASE_HOST_NAME as string;

export const IN_MEMORY_DATABASE_HOST_PORT = Number(process.env.IN_MEMORY_DATABASE_HOST_PORT);

export const SERVER_PORT = Number(process.env.SERVER_PORT);

export const SERVER_RUNNING_MESSAGE =`Server Is Running`;
