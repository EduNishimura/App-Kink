import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const test = async (roomId: string) => {
    const roomRef = await doc(db, "rooms", roomId);
    try {
        await updateDoc(roomRef, {
            participants: ["123"],
        });
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
    }
}

test("J4bBqgKkBW3KkxnzqOsU");