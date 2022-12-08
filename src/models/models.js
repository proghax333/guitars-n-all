
import { Sequelize } from "sequelize";

const { DB_CONNECTION_STRING } = process.env;

export const sequelize = new Sequelize(DB_CONNECTION_STRING, {
  dialect: "mysql"
});
export const db = sequelize;

export async function connectToDatabase() {
  const result = await sequelize.authenticate();
  return result;
}

export async function loadModels() {
  const [accounts, meta] = await db.query(
    `
      select * from accounts;
    `
  );
}