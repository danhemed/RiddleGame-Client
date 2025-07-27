import { api } from "./api.js";
import { MenuCreateRiddle, MenuUpdateRiddle, } from "../menus.js";
import { checkID } from "../../Server/services/checkID.js";

export async function CreateRiddleApp() {
    const createRiddle = await api.postFetch(MenuCreateRiddle(), "riddles");
    if (createRiddle) {
        console.log(`Create a new riddle`);
    }
}

export async function ShowAllRiddleApp() {
    console.table(await api.getFetch("riddles"));
}

export async function UpdateRiddleApp() {
    const allriddles = await api.getFetch("riddles");
    const idExists = await checkID(allriddles);
    if (idExists === null) {
        return null;
    }
    const updateRiddle = await api.putFetch(idExists, MenuUpdateRiddle(), "riddles");
    if (updateRiddle) {
        console.log(`Update the riddle`);
    }
}

export async function DeleteRiddleApp() {
    const allriddles = await api.getFetch("riddles");
    const idExists = await checkID(allriddles);
    if (idExists === null) {
        return null;
    }
    const deleteRiddle = await api.deleteFetch(idExists, "riddles");
    if (deleteRiddle) {
        console.log(`Delete the riddle`);
    }
}