import { PlayGame } from "./services/playGame.js";
import { api } from "./services/api.js";
import { ShowPlayerScores } from "./utile/ShowPlayerScores.js";
import { Menu, MenuCreateRiddle, MenuUpdateRiddle, } from "./menus.js";
import { checkID } from "../Server/services/checkID.js";
import { dalRiddles } from "../Server/dal/dal.riddles.js";


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
            await dalRiddles.insertRiddle(MenuCreateRiddle());
            break;
        case '3':
            console.table(await dalRiddles.getRiddles());
            break;
        case '4':
            const allriddles = await dalRiddles.getRiddles();
            const idExists = await checkID(allriddles);
            if (idExists === null) {
                break;
            }
            await dalRiddles.updateRiddle(idExists, MenuUpdateRiddle())
            break;
        case '5':
            console.log(await dalRiddles.deleteRiddle(await checkID(await dalRiddles.getRiddles())));
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