import "./utils/settings.js";
import { items, checkInputs } from "./utils/create.js";
import { Creator } from "./utils/creator.js";


/* Handle number input */
const numberInputs = document.querySelectorAll("input[type='number']");
for (const input of numberInputs){
    input.addEventListener("change", () => {
        input.value = input.value.replace(/[^.\d]/g, "");
    });
}


/* Tab Change Handler */
const buttons = document.querySelectorAll("i, button");
for (const button of buttons){
    button.addEventListener("click", () => {
        if(!button.dataset.page) return;

        const actives = document.querySelectorAll("article > .active, li > .active");
        for (const active of actives){active.classList.remove("active");}

        button.classList.add("active");
        document.getElementById(button.dataset.page).classList.add("active");
    });
}


/* Download Mod */
document.querySelector("#mod_download").addEventListener("click", async () => {
    if(!checkInputs("#settings .left")) return document.querySelector("#settings_warning").innerHTML = "Please fill all the inputs."; 
    if(items.length == 0) return document.querySelector("#settings_warning").innerHTML = "Please add some mod elements."; 

    // Creates the creator
    const creator = new Creator(items, {
        name: document.querySelector("#mod_name").value.replace((/  |\r\n|\n|\r/gm),"") ? document.querySelector("#mod_name").value : "Generated Mod",
        author: document.querySelector("#mod_author").value.replace((/  |\r\n|\n|\r/gm),"") ? document.querySelector("#mod_author").value : "PPG Mod Creator",
        description: document.querySelector("#mod_description").value.replace((/  |\r\n|\n|\r/gm),"") ? document.querySelector("#mod_description").value : "Made with PPG Mod Creator"
    });

    // Changes the buttons text
    document.querySelector("#mod_download").innerText = "Generating your mod! Wait a few minute.";

    // Could create the mod
    try {
        await creator.start(document.querySelector("#createCategory").checked); // Check if checked to see if we wanne create a new category in the PPG sidebar
    } catch(e) {
        // Bruh.
        console.log(e);
        document.querySelector("#settings_warning").innerHTML = "Ah... Something bad happened, try again!";
    }
    return document.querySelector("#mod_download").innerText = "Download your mod!"
});