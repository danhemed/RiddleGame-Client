import { api } from "./services/api.js";

// await api.postFetch({id:7, name:"dan"},"players");

const players = await api.getFetch("players");
console.table(players);
