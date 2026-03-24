import { joinRoom } from "../services/roomService";

const roomId = "corMNfFWWkEpSZddxopf";
const userId = " 51opLUz3VzMTdHhNO3MZ";

joinRoom(roomId, userId).then(() => console.log("Room joined"));
