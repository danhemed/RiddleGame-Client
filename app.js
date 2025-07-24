import { PlayGame } from "./services/playGame.js";
import { api } from "./services/api.js";
import { ShowPlayerScores } from "./utile/ShowPlayerScores.js";
import { Menu, MenuCreateRiddle, MenuUpdateRiddle, } from "./menus.js";
import { checkID } from "../Server/services/checkID.js";

let choice;

do {
    choice = Menu();

    switch (choice) {
        case '1':
            const playGame = await PlayGame();
            if (playGame === null) {
                break;
            }
            break;
        case '2':
            const createRiddle = await api.postFetch(MenuCreateRiddle(), "riddles");
            if (createRiddle) {
                console.log(`Create a new riddle`);
            }
            break;
        case '3':
            console.table(await api.getFetch("riddles"));
            break;
        case '4':
            const allriddles = await api.getFetch("riddles");
            const idExists = await checkID(allriddles);
            if (idExists === null) {
                break;
            }
            const updateRiddle = await api.putFetch(idExists, MenuUpdateRiddle(), "riddles");
            if (updateRiddle) {
                console.log(`Update the riddle`);
            }
            break;
        case '5':
            const allriddles2 = await api.getFetch("riddles");
            console.log(await api.deleteFetch(await checkID(allriddles2), "riddles"));
            break;
        case '6':
            await ShowPlayerScores();
            break;
        case '0':
            console.log(`BYE BYE!! `);
            break;
        default:
            console.log(`plase choose only number from 0 to 6!!`);
            break;
    }
} while (choice !== '0');