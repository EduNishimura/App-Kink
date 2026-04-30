import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import kinksData from "./kink.json";

async function populateKinks() {
    console.log("Iniciando a inserção dos kinks...");

    const kinksCollection = collection(db, "kink");
    const tags = kinksData.kink_tags;

    for (const tag of tags) {

        const receivingTag = /\breceiving\b/i;
        const givingTag = /\bgiving\b/i;

        if (receivingTag.test(tag)) {
            try {
                const docRef = doc(kinksCollection);
                await setDoc(docRef, {
                    name: tag,
                    type: "receiving",
                    createdAt: new Date().toISOString()
                });
                console.log(`Inserido: ${tag}`);
            } catch (error) {
                console.error(`Erro ao inserir ${tag}:`, error);
            }
        }

        if (givingTag.test(tag)) {
            try {
                const docRef = doc(kinksCollection);
                await setDoc(docRef, {
                    name: tag,
                    type: "giving",
                    createdAt: new Date().toISOString()
                });
                console.log(`Inserido: ${tag}`);
            } catch (error) {
                console.error(`Erro ao inserir ${tag}:`, error);
            }
        }

        if (!(receivingTag.test(tag) || givingTag.test(tag))) {
            try {
                const docRef = doc(kinksCollection);
                await setDoc(docRef, {
                    name: tag,
                    createdAt: new Date().toISOString()
                });
                console.log(`Inserido: ${tag}`);
            } catch (error) {
                console.error(`Erro ao inserir ${tag}:`, error);
            }
        }
    }

    console.log("Finalizado!");
    process.exit(0);
}

populateKinks();
