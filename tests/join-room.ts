import { joinRoom } from "../services/roomService";

const roomId = "8XFGefDPRpd0B2GwD1Zs";
const userId = 'tYHkDEt8AFLNzUcClKTS';

joinRoom(roomId, userId).then(() => console.log("Room joined"));
