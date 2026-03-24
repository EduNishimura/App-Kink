import { addDoc, collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Cria um novo usuário na coleção 'users'.
 * @returns O ID do documento gerado pelo Firestore.
 */
export async function createUser(name: string): Promise<string> {

    if (name === "") {
        throw new Error("Nome do usuário não pode ser vazio.");
    }

    if (name.length > 20) {
        throw new Error("Nome do usuário deve ter no máximo 20 caracteres.");
    }

    const docRef = await addDoc(collection(db, 'users'), {
        name,
        createdAt: new Date(),
    });
    return docRef.id;
}

/**
 * Busca o nome de um usuário pelo ID.
 * @returns O nome do usuário ou null se não encontrado.
 */
export async function getUserName(userId: string): Promise<string | null> {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (!docSnap.exists()) return null;
    return docSnap.data()?.name ?? null;
}

/**
 * Busca o nome de múltiplos usuários por uma lista de IDs.
 * @returns Array de objetos { id, name }.
 */
export async function getUserNames(
    userIds: string[]
): Promise<{ id: string; name: string }[]> {
    const results = await Promise.all(
        userIds.map(async (userId) => {
            const snap = await getDoc(doc(db, 'users', userId));
            const name = snap.exists() ? (snap.data()?.name ?? userId) : userId;
            return { id: userId, name };
        })
    );
    return results;
}


/** Deletar usuário */
export async function deleteUser(userId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId));
}