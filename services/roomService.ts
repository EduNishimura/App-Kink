import {
    DocumentSnapshot,
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getUserName } from './userService';

export type RoomData = {
    hostId: string;
    participants: string[];
    status: string;
    code: string;
    matchedKinks?: string[];
    votes?: Record<string, string[]>;
};

/**
 * Gera um código alfanumérico de 6 caracteres em maiúsculas.
 */
function generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Gera um código único verificando colisões no Firestore.
 */
async function generateUniqueCode(): Promise<string> {
    const roomsCollection = collection(db, 'rooms');

    while (true) {
        const code = generateRoomCode();
        const q = query(roomsCollection, where('code', '==', code));
        const snap = await getDocs(q);

        if (snap.empty) {
            return code;
        }
        // Colisão improvável (36^6 = ~2 bilhões de combinações), mas trata mesmo assim
    }
}

/**
 * Cria uma nova sala na coleção 'rooms' com um código alfanumérico de 6 dígitos.
 * @returns Objeto com o ID do documento e o código da sala.
 */
export async function createRoom(hostId: string): Promise<{ id: string; code: string }> {
    const code = await generateUniqueCode();
    const hostName = await getUserName(hostId);

    const docRef = await addDoc(collection(db, 'rooms'), {
        createdAt: new Date(),
        hostId,
        participants: [hostName],
        status: 'waiting',
        code,
        matchedKinks: [],
        votes: [],
    });

    return { id: docRef.id, code };
}

/**
 * Busca uma sala pelo código de 6 dígitos.
 * @returns Os dados da sala e seu ID, ou null se não encontrada.
 */
export async function getRoomByCode(
    code: string
): Promise<{ id: string; data: RoomData } | null> {
    const normalizedCode = code.trim().toUpperCase();
    const roomsCollection = collection(db, 'rooms');
    const q = query(roomsCollection, where('code', '==', normalizedCode));
    const snap = await getDocs(q);

    if (snap.empty) return null;

    const docSnap = snap.docs[0];
    return { id: docSnap.id, data: docSnap.data() as RoomData };
}

/**
 * Verifica se uma sala existe pelo código e adiciona o usuário à lista de participantes.
 * Lança um erro se a sala não for encontrada.
 * @returns O ID do documento da sala.
 */
export async function joinRoomByCode(code: string, userId: string): Promise<string> {
    const room = await getRoomByCode(code);
    const guestName = await getUserName(userId);

    if (!room) {
        throw new Error('Sala não encontrada. Verifique o código e tente novamente.');
    }

    if (room.data.status !== 'waiting') {
        throw new Error('Esta sala já está em andamento ou encerrada.');
    }

    const roomRef = doc(db, 'rooms', room.id);
    await updateDoc(roomRef, {
        participants: arrayUnion(guestName),
    });

    return room.id;
}

/**
 * Verifica se uma sala existe pelo ID e adiciona o usuário à lista de participantes.
 * Lança um erro se a sala não for encontrada.
 * @deprecated Prefira `joinRoomByCode` para entrada via código.
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
 * Busca as informações de uma sala pelo ID.
 * @returns As informações da sala ou null se não encontrada.
 */
export async function getRoom(roomId: string): Promise<RoomData | null> {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap: DocumentSnapshot = await getDoc(roomRef);
    if (!roomSnap.exists()) return null;
    return roomSnap.data() as RoomData;
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

export async function startGame(roomId: string): Promise<void> {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
        status: 'active',
    });
}