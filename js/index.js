/* Module Importation */
import "./utils/settings.js";
import { items, checkInputs } from "./utils/create.js";
import { Compiler } from "./utils/compile.js";


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

    // Creates the compiler
    const compiler = new Compiler(items, {
        name: document.querySelector("#mod_name").value.replace((/  |\r\n|\n|\r/gm),"") ? document.querySelector("#mod_name").value : "Generated Mod",
        author: document.querySelector("#mod_author").value.replace((/  |\r\n|\n|\r/gm),"") ? document.querySelector("#mod_author").value : "PPG Mod Creator",
        description: document.querySelector("#mod_description").value.replace((/  |\r\n|\n|\r/gm),"") ? document.querySelector("#mod_description").value : "Made with PPG Mod Creator"
    });

    document.querySelector("#mod_download").innerText = "Generating your mod! Wait a few minute.";
    try {
        await compiler.start(document.querySelector("#createCategory").checked); // Check if checked to see if we wanne create a new category in the PPG sidebar
    } catch(e) {
        console.log(e);
        document.querySelector("#settings_warning").innerHTML = "Ah... Something bad happened, try again!";
    }
    return document.querySelector("#mod_download").innerText = "Download your mod!"
});


/* Update alert things, I know I could put it directly in the html or do some more elaborate stuff but I'm lazy. */
(() => {

    const updateContent = `
    <h2>UPDATE</h2>
    <span>Here's the latest change logs:</span>
    <ul>
        <li><span class="detail">[03/05/2022]</span> Added more explosive and weapon types.</li>
        <li><span class="detail">[03/03/2022]</span> Added more weapon types.</li>
        <li><span class="detail">[02/28/2022]</span> Fixed the save button, now it's supposed to work.</li>
        <li><span class="detail">[02/27/2022]</span> Fixed some requirements, so you're not forced to put an audio when creating an object.</li>
        <li><span class="detail">[02/22/2022]</span> You can now change entities' health and regeneration speed.</li>
        <li><span class="detail">[02/22/2022]</span> You can now change object materials and weight.</li>
    </ul>
    <span>Custom category provided with the script from <a href="https://github.com/Azule-RS">AZULE</a>, so thanks to him and his amazing script.</span>
    <span style="color: #ff2b2b;"><b>If bugs are happening, please open an issue on github or contact me through steam, and explain me how to achieve the bug in details so I can take a look at it.</b></span>
    <span>If you're actually sick enough, you can also try to optimize the source code of this website on github.</span>
    <span>It's kinda trash tbh, and surely not optimized at all but it still does the job. If you try to optimize things, I wish you good luck and a lot of coffee.</span>
    <h4>You can also submit your ideas!</h4>
    <span>If you wanna help me, give me some of your ideas in <a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLScbHfIQZGH6lYh36BHUNsR70Eo5v74Qu9GzSbI-WFvuDAbsFA/viewform">this form below</a>.</span>
    <span>Finally, if you wanna support me (and not my shitty code), you can still buy me a coffee <a href="https://ko-fi.com/cheeteau">here!</a></span>
    <span>Thank you for reading and have fun modding stuff!</span>
    `

    const alertDiv = document.createElement("div");
    alertDiv.classList.add("modalAlert");

    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = updateContent;

    const validate = document.createElement("button");
    validate.innerHTML = "Got it!"
    validate.addEventListener("click", () => {
        document.body.removeChild(alertDiv);
    });

    contentDiv.appendChild(validate);
    alertDiv.appendChild(contentDiv);
    document.body.appendChild(alertDiv);
})();
