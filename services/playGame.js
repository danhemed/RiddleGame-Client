import Riddle from "../../Server/class/Riddle.js";
import Player from "../../Server/class/Player.js";
import { api } from "./api.js";
import { MenuPlayer } from "../menus.js";


async function PlayerEntry() {
    const jsonPlayer = MenuPlayer();
    const players = await api.getFetch("players");

    let playerExists = players.find(p => Number(p.id) === Number(jsonPlayer.id));
    if (!playerExists) {
        playerExists = {...jsonPlayer, times: []};
        await api.postFetch(playerExists, "players");
        console.log(`Create a new Player: ${playerExists.name} in ID: ${playerExists.id}`);
    } else {
        console.log(`welcome again ${playerExists.name} ID: ${playerExists.id} `)
    }
    const player = new Player(playerExists.name);
    player.id = Number(playerExists.id);
    player.times = playerExists.times || [];

    return player;
}

async function PlayRiddles(player) {
    const allRiddles = await api.getFetch("riddles");
    if (allRiddles.length === 0) {
        console.log(`There is no data at all.\n`)
        return null;
    }
    const riddles = allRiddles.map(r => new Riddle(r.id, r.name, r.taskDescription, r.correctAnswer));

    const start = Date.now();
    let mistakes = 0;
    let level = 1;

    for (const riddle of riddles) {
        console.log(`level ${level}: ${riddle.name}`);

        let answeredCorrectly = false;
        
        while (!answeredCorrectly) {
            const answer = riddle.ask();
            if (answer.toLowerCase() !== riddle.correctAnswer.toLowerCase()) {
                mistakes++;
                console.log(`You Were Wrong! Mistake ${mistakes}! Try again!\n`)
    
                if (mistakes >=3) {
                    console.log(`Game over!\n`);
                    return false;
                }
            } else {
                console.log(`You are right!\n`)
                answeredCorrectly = true;
                level++;
            }
        } 
    }
    console.log(`YOU ARE A CHAMPION! YOU WON!!\n`);

    const end = Date.now();
    player.recordTime(start, end);
    player.showStats();
    console.log();

    return true;
}

export async function PlayGame() {
    const player = await PlayerEntry();
    const won = await PlayRiddles(player);

    if (won === null) {
        return null;
    }

    if (won) {
        await api.putFetch(player.id, {
            name : player.name,
            times : player.times
        }, "players");
    }
}