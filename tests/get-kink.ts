import { getKinks } from "../services/kinkService";

getKinks().then((kinks) => console.log(kinks));