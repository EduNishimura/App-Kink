import { arrayUnion, arrayRemove, collection, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function getKinks() {
    const kinksCollection = collection(db, "kink");
    const kinksSnapshot = await getDocs(kinksCollection);
    const kinks = kinksSnapshot.docs.map((doc) => doc.data());
    return kinks.map((kink) => kink.name);
}

export async function likeKink(roomId: string, userId: string, kink: string): Promise<void> {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
        [`votes.${userId}.likes`]: arrayUnion(kink)
    });
}

export async function dislikeKink(roomId: string, userId: string, kink: string): Promise<void> {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
        [`votes.${userId}.dislikes`]: arrayUnion(kink)
    });
}

export async function neutralKink(roomId: string, userId: string, kink: string): Promise<void> {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
        [`votes.${userId}.neutral`]: arrayUnion(kink)
    });
}

/**
 * Remove o kink de todas as listas de votos (likes, dislikes e neutral)
 */
export async function removeKinkVote(roomId: string, userId: string, kink: string): Promise<void> {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
        [`votes.${userId}.likes`]: arrayRemove(kink),
        [`votes.${userId}.dislikes`]: arrayRemove(kink),
        [`votes.${userId}.neutral`]: arrayRemove(kink)
    });
}




/**
 * Escuta em tempo real os votos da sala. Assim que houver votos de 2 ou mais pessoas,
 * calcula a interseção (match) dos kinks que todos curtiram e grava na propriedade `matchedKinks`.
 * @returns Função para cancelar o listener (unsubscribe).
 */
export function getMatchedKinks(roomId: string): () => void {
    const roomRef = doc(db, "rooms", roomId);

    return onSnapshot(roomRef, async (snap) => {
        if (!snap.exists()) return;

        const data = snap.data();
        const votes = data.votes;

        if (!votes) return; // Ninguém votou ainda

        const userIds = Object.keys(votes);

        // Só há match se pelo menos 2 pessoas tiverem votado
        if (userIds.length < 2) return;

        // Pegamos um array com as listas de likes de todo mundo
        const allLikesLists: string[][] = Object.values(votes).map((userVotes: any) => userVotes.likes || []);

        // Calcular a interseção de kinks curtidos entre TODOS os usuários da sala
        let matched = allLikesLists[0];
        for (let i = 1; i < allLikesLists.length; i++) {
            matched = matched.filter((kink) => allLikesLists[i].includes(kink));
        }

        const currentMatchedKinks = data.matchedKinks || [];

        // Verifica se o resultado novo é diferente do que já está no banco.
        // Isso é SUPER IMPORTANTE para evitar um loop infinito de updates! (update dispara novo snapshot)
        const hasChanges =
            matched.length !== currentMatchedKinks.length ||
            !matched.every((k) => currentMatchedKinks.includes(k));

        if (hasChanges) {
            await updateDoc(roomRef, {
                matchedKinks: matched,
            });
        }
    });
}


