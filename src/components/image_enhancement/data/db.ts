// db.ts
import Dexie, { type EntityTable } from "dexie";
import { EnchantedImage } from "./types";

const db = new Dexie("EnchantedImagesDatabase") as Dexie & {
  enchantedImages: EntityTable<EnchantedImage, "id">;
};

db.version(1).stores({
  enchantedImages: "++id, name, data",
});

export { db };
