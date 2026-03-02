import {
    DocumentSnapshot,
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export type RoomData = {
    hostId: string;
    participants: string[];
    status: string;
};

/**
 * Cria uma nova sala na coleção 'rooms'.
 * @returns O ID do documento gerado pelo Firestore.
 */
export async function createRoom(hostId: string): Promise<string> {
    const docRef = await addDoc(collection(db, 'rooms'), {
        createdAt: new Date(),
        hostId,
        participants: [hostId],
        status: 'waiting',
        matchedKinks: [],
    });
    return docRef.id;
}

/**
 * Verifica se uma sala existe e adiciona o usuário à lista de participantes.
 * Lança um erro se a sala não for encontrada.
 */
export async function joinRoom(roomId: string, userId: string): Promise<void> {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap: DocumentSnapshot = await getDoc(roomRef);

    if (!roomSnap.exists()) {
        throw new Error('Sala não encontrada.');
    }

    await updateDoc(roomRef, {
        participants: arrayUnion(userId),
    });
}

/**
 * Assina em tempo real as atualizações de uma sala.
 * @returns Função de cancelamento da assinatura (unsubscribe).
 */
export function subscribeToRoom(
    roomId: string,
    onUpdate: (data: RoomData) => void
): () => void {
    const roomRef = doc(db, 'rooms', roomId);
    return onSnapshot(roomRef, (snap) => {
        if (snap.exists()) {
            onUpdate(snap.data() as RoomData);
        }
    });
}
