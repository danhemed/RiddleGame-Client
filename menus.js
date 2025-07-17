import readline from "readline-sync";

export function Menu() {
    return readline.question(
    "What do you want to do?\n" +
    "1. Play the game >>\n" +
    "2. Create a new riddle >>\n" +
    "3. Read all riddles >>\n" +
    "4. Update an existing riddle >>\n" +
    "5. Delete a riddle >>\n" +
    "6. View leaderboard >>\n" +
    "0. Exit >>\n:"
    );
}

export function MenuCreateRiddle() {
    const id = readline.question('Enter ID: ');
    const name = readline.question('Enter Name: ');
    const taskDescription = readline.question('Enter task Description: ');
    const correctAnswer = readline.question('Enter correct Answer: ');

    return {
        id,
        name,
        taskDescription,
        correctAnswer
    };
}

export function MenuId() {
    return readline.question('Enter ID: ');
}

export function MenuUpdateRiddle() {
    const name = readline.question('Enter Name: ');
    const taskDescription = readline.question('Enter task Description: ');
    const correctAnswer = readline.question('Enter correct Answer: ');

    return {
        name,
        taskDescription,
        correctAnswer
    };
}

export function MenuPlayer() {
    console.log(`Hey player, enter your details >>`)
    const id = readline.question('Enter ID: ');
    const name = readline.question('Enter Name: ');

    return {
        id,
        name
    };
}
