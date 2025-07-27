import { api } from "../services/api.js";

export async function ShowPlayerScores() {
    console.log(`\nLeaderBoard:`);
    console.table(await api.getFetch("scores/leaderboard"));
}