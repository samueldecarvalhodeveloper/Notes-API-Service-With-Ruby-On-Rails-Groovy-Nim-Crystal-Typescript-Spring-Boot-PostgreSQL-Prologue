import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../../server/server";
import { USERS_INDEX_ROUTE } from "../../constants/routes_constants";
import { StatusCodes } from "http-status-codes";

describe("Test Module Server Behavior", () => {
  test("Test If Server Is Setup", async () => {
    const requestOnApp = request(app);

    const response = await requestOnApp.get(USERS_INDEX_ROUTE);

    expect(response.status).toEqual(StatusCodes.OK);
  });
});
