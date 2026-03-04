import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import kinksData from "./kink.json";

async function populateKinks() {
    console.log("Iniciando a inserção dos kinks...");

    const kinksCollection = collection(db, "kink");
    const tags = kinksData.kink_tags;

    for (const tag of tags) {
        try {
            // Firestore não permite barras no ID do documento (interpreta como subcoleção)
            // Vamos substituir "/" por "-" no ID, mas manter o nome original no campo 'name'
            const slug = tag.replace(/\//g, "-");
            const docRef = doc(kinksCollection, slug);
            await setDoc(docRef, {
                name: tag,
                createdAt: new Date().toISOString()
            });
            console.log(`Inserido: ${tag}`);
        } catch (error) {
            console.error(`Erro ao inserir ${tag}:`, error);
        }
    }

    console.log("Finalizado!");
    process.exit(0);
}

populateKinks();
