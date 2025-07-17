export async function ShowPlayerVictories() {
    const players = await playerCrud.GetAll();

    console.log(`LeaderBoard:`);
    console.log(`=`.repeat(30));

    const playerBestTime = players.map(p => {
        const bestTime = p.times && p.times.length > 0 ? Math.min(...p.times) : Infinity;
        return {...p, bestTime};
    })

    playerBestTime.sort((a, b) => a.bestTime - b.bestTime);

    playerBestTime.forEach((p, i) => {
        if (p.bestTime === Infinity) {
            console.log(`${i+1}. ${p.name} - No wins yet`);
        } else {
            console.log(`${i+1}. ${p.name} - ${p.bestTime} seconds`);
        }
    });
}