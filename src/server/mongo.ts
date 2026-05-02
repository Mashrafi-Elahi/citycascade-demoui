import { MongoClient, type Db } from "mongodb";
import { env } from "./env";

let clientP: Promise<MongoClient> | null = null;

export async function getDb(): Promise<Db> {
  if (!clientP) {
    clientP = MongoClient.connect(env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });
  }
  const client = await clientP;
  return client.db(env.DB_NAME);
}

/** Collections used across the app. */
export const COLL = {
  SIMULATIONS: "simulations",
  SETTINGS: "settings",
  CITIES: "cities",
} as const;
