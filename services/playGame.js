import Riddle from "../../Server/class/Riddle.js";
import Player from "../../Server/class/Player.js";
import { api } from "./api.js";
import { MenuPlayer } from "../menus.js";


async function PlayerEntry() {
    const jsonPlayer = MenuPlayer();
    const players = await api.getFetch("players");

    const playerExists = players.find(p => p.username === jsonPlayer.username);

    if (playerExists === undefined) {
        const newPlayer = { username: jsonPlayer.username };
        try {
            await api.postFetch(newPlayer, "players");
        } catch (err) {
            console.log(`post player ${err.message}`);
        }
        let newPlayerGet;
        try {
            newPlayerGet = await api.getFetch(`players/${jsonPlayer.username}`);
        } catch (err) {
            console.log(`get new player ${err.message}`);
        }
        if (newPlayerGet) {
            console.log(`Create a new Player: ${newPlayerGet.username} and ID: ${newPlayerGet.id}`);
            const player = new Player(newPlayerGet.id, newPlayerGet.username);
            return player;
        }
    }
    console.log(`Welcome again ${playerExists.username}\n`)
    const player = new Player(playerExists.id, playerExists.username);
    player.bestTime = playerExists.best_time;
    player.wins = playerExists.wins;
    return player;
}

async function playerScoreEntry(playerID, riddleID, timeToSolve) {
    try {
        await api.postFetch(
        {
            player_id : playerID,
            riddle_id : riddleID,
            time_to_solve : timeToSolve 
        }
        , "scores/submit-score");
    } catch (err) {
        console.log(err.message);
    }
}

async function PlayRiddles(player) {
    const allRiddles = await api.getFetch("riddles");
    if (allRiddles.length === 0) {
        console.log(`There is no data at all.\n`)
        return null;
    }
    const riddles = allRiddles.map(r => new Riddle(r._id, r.name, r.taskDescription, r.correctAnswer));

    let mistakes = 0;
    let level = 1;
    
    for (const riddle of riddles) {
        console.log(`level ${level}: ${riddle.name}`);
        const start = Date.now();

        let answeredCorrectly = false;

        while (!answeredCorrectly) {
            const answer = riddle.ask();
            if (answer.toLowerCase() !== riddle.correctAnswer.toLowerCase()) {
                mistakes++;
                console.log(`You Were Wrong! Mistake ${mistakes}! Try again!\n`)
                
                if (mistakes >= 5) {
                    return false;
                }
            } else {
                console.log(`You are right!\n`)
                answeredCorrectly = true;
                level++;
                
                const end = Date.now();
                await player.recordTime(start, end);
                await playerScoreEntry(player.id, riddle.id, player.bestTime);
            }
        }
    }
    return true;
}

export async function PlayGame() {
    const player = await PlayerEntry();
    const won = await PlayRiddles(player);

    if (won === false) {
        console.log("Game Over!!\n")
    }

    if (won === null) {
        return null;
    }

    if (won) {
        const playerScores = await api.getFetch(`scores/${player.id}`);
        let bestTime = playerScores[0].time_to_solve;
        for (const score of playerScores) {
            if (score.time_to_solve < bestTime){
                bestTime = score.time_to_solve;
            }
        }
        const playerwins = player.wins + 1;
        await api.putFetch(player.id, {
            best_time: bestTime,
            wins: playerwins
        }, `players`);

        console.log(`\n<<< YOU ARE A CHAMPION! YOU WON!! >>>\n`);
        console.log(`>>> Youre Score:`)
        console.table(playerScores);
        const { wins } = await api.getFetch(`players/wins/${player.id}`);
        console.log(`>>> Youre Wins: ${wins}`);
    }
}