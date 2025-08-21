import { Express } from "express";
import {
  USERS_INDEX_ROUTE,
  SPECIFIC_USERS_ROUTE,
} from "../constants/routes_constants";
import UserController from "../controllers/user_controller";

function configureUserRoutes(app: Express): void {
  app.get(USERS_INDEX_ROUTE, UserController.getAllUsers);
  app.get(SPECIFIC_USERS_ROUTE, UserController.getUser);
  app.post(USERS_INDEX_ROUTE, UserController.createUser);
  app.patch(SPECIFIC_USERS_ROUTE, UserController.updateUser);
  app.delete(SPECIFIC_USERS_ROUTE, UserController.deleteUser);
}

export default configureUserRoutes;
