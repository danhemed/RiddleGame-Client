import Riddle from "../../Server/class/Riddle.js";
import Player from "../../Server/class/Player.js";
import { api } from "./api.js";
import { MenuPlayer } from "../menus.js";


async function PlayerEntry() {
    const jsonPlayer = MenuPlayer();
    const players = await api.getFetch("players");

    const playerExists = players.find(p => p.username === jsonPlayer.username);

    console.log(playerExists);

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
        console.log(newPlayerGet);
        if (newPlayerGet) {
            console.log(`Create a new Player: ${newPlayerGet.username} and ID: ${newPlayerGet.id}`);
            const player = new Player(newPlayerGet.id, newPlayerGet.username);
            return player;
        }
    }
    console.log(`Welcome again ${playerExists.username}\n`)
    const player = new Player(playerExists.id, playerExists.username, playerExists.bestTime, playerExists.wins);
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

    console.log(player);

    if (won === false) {
        console.log("Game Over!!\n")
    }

    if (won === null) {
        return null;
    }

    if (won) {
        const playerScores = await api.getFetch(`scores/${player.id}`);
        for (const score of playerScores) {
            console.log(score);
            console.log(score.time_to_solve);
            if (score.time_to_solve < player.bestTime){
                player.bestTime = score.time_to_solve;
            }
        }
        player.wins = player.wins + 1;
        await api.putFetch(player.id, {
            bestTime: player.bestTime,
            wins : player.wins
        }, `players`);

        console.log(`\n<<< YOU ARE A CHAMPION! YOU WON!! >>>\n`);
        console.log(`>>> Youre Score:`)
        console.table(playerScores);
        const { wins } = await api.getFetch(`players/wins/${player.id}`);
        console.log(`>>> Youre Wins: ${wins}`);
    }
}