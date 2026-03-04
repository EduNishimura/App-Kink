import { createUser } from "../services/userService";

createUser("Eduardo teste backend").then((userId) => console.log(userId));
