import { arrayUnion, collection, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function getKinks() {
    const kinksCollection = collection(db, "kink");
    const kinksSnapshot = await getDocs(kinksCollection);
    const kinks = kinksSnapshot.docs.map((doc) => doc.data());
    return kinks.map((kink) => kink.name);
}

export async function likeKink(roomId: string, userId: string, kink: string): Promise<void> {
    const roomRef = doc(db, "rooms", roomId);

    // No Firestore, a forma mais eficiente de criar esse objeto na prop "votes"
    // é gravar como um Mapa (Map) onde a chave é o userId e o valor é a lista de kinks.
    // Exemplo no banco de dados: votes: { "user123": ["alcohol", "armpits"] }
    //
    // A notação de ponto ("votes.ID_DO_USUARIO") permite atualizar diretamente o array
    // do usuário sem precisar ler o documento antes, e o arrayUnion evita duplicadas.
    await updateDoc(roomRef, {
        [`votes.${userId}`]: arrayUnion(kink)
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

        // Pegamos um array com as listas de votos de todo mundo: [ ["k1", "k2"], ["k2", "k3"] ]
        const allVotesLists = Object.values(votes) as string[][];

        // Calcular a interseção de kinks entre TODOS os usuários da sala
        let matched = allVotesLists[0];
        for (let i = 1; i < allVotesLists.length; i++) {
            matched = matched.filter((kink) => allVotesLists[i].includes(kink));
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

