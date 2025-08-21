import prologue
from ../constants/routes_constants import USER_ROUTE, INDEX_ROUTE, USER_ROUTE_BY_ID
from ../controllers/user_controller import getAllUsers, getUser, createUser, updateUser, deleteUser

proc createUserRoutes*(app: Prologue) =
  var userRouteGroup = newGroup(app, USER_ROUTE, @[])

  userRouteGroup.get(INDEX_ROUTE, getAllUsers)
  userRouteGroup.get(USER_ROUTE_BY_ID, getUser)
  userRouteGroup.post(INDEX_ROUTE, createUser)
  userRouteGroup.patch(USER_ROUTE_BY_ID, updateUser)
  userRouteGroup.delete(USER_ROUTE_BY_ID, deleteUser)
