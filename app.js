import { PlayGame } from "./services/playGame.js";
import { CreateRiddleApp, ShowAllRiddleApp, UpdateRiddleApp, DeleteRiddleApp  } from "./services/riddleApp.js";
import { ShowPlayerScores } from "./services/ShowPlayerScores.js";
import { Menu } from "./menus.js";

let choice;

do {
    choice = Menu();

    switch (choice) {
        case '1':
            const playGame = await PlayGame();
            // There isn't riddles
            if (playGame === null) {
                break;
            }
            break;
        case '2':
                await CreateRiddleApp();
            break;
        case '3':
                await ShowAllRiddleApp();
            break;
        case '4':
                const u = await UpdateRiddleApp();
                // id not found
                if (u === null) {
                    break;
                }
            break;
        case '5':
                const d = await DeleteRiddleApp();
                // id not found
                if (d === null) {
                    break;
                }
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