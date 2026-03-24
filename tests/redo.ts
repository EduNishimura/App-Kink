import { createRoom } from "@/services/roomService";
import { likeKink, removeKinkVote } from "../services/kinkService";
import { createUser } from "../services/userService";

async function runTest() {
    const userName = "asdasdasdasdasd";
    const kinkName = "teste";   // Add your kink name here

    // 1. Add "await" to unpack the Promise<string> into a normal string
    try {
        const userId = await createUser(userName);
        console.log(`User created with ID: ${userId}`);

        // 2. Create a room for the user
        try {
            const roomId = await createRoom(userId);
            console.log(`Room created with ID: ${roomId}`);

            // 3. Dislike a kink for the user
            try {
                await likeKink(roomId, userId, kinkName);
                console.log(`Liked kink for user ${userId}`);
            } catch (error) {
                console.error(error);
            }

            setTimeout(() => {

            }, 1000);

            try {
                await removeKinkVote(roomId, userId, kinkName);
                console.log(`Removed kink vote for user ${userId}`);
            } catch (error) {
                console.error(error);
            }

        } catch (error) {
            console.error(error);
        }

    } catch (error) {
        console.error(error);
    }
}

// Execute the test function
runTest();
