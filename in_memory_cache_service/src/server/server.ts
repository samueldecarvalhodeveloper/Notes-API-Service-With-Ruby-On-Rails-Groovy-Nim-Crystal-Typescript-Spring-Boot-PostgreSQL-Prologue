import express from "express";
import configureNoteRoutes from "../routes/note_route";
import configureUserRoutes from "../routes/user_route";
import {
  SERVER_PORT,
  SERVER_RUNNING_MESSAGE,
} from "../constants/application_constants";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configureUserRoutes(app);
configureNoteRoutes(app);

function runServer(): void {
  app.listen(SERVER_PORT, () => {
    console.log(SERVER_RUNNING_MESSAGE);
  });
}

export { app, runServer };
