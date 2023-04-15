import { Sequelize } from 'sequelize-typescript';
import ToDo from './models/ToDo.model';

//Создаем instance Sequelize
const sequelizeInstance = new Sequelize({
  dialect: "postgres",
  //   host: "21.23.35.4",
  port: 5050,
  database: "postgres",
  username: "evgenia.udalova",
  password: "",
  models: [ToDo]
  // storage: "Users/evgenia.udalova/Library/Application Support/Postgres/JS", //Путь до файла с данными
});

export const initDB = async () => {
  try {
    await sequelizeInstance.authenticate(); //Авторизация нашей ORM в БД
    // await sequelize.dropSchema('public', {});
    // await sequelize.createSchema('public', {});
    await sequelizeInstance.sync(); //Синхронизация МОДЕЛЕЙ
    console.log("Sequelize was initialized");
  } catch (error) {
    console.log("Sequelize ERROR (initDB)", error);
    process.exit();
  }
};
