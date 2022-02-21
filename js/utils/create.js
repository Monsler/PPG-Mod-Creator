import { FileInputHandler } from "./fileHandler.js";
import { ItemManager } from "./itemManager.js";
const elementsList = document.querySelector("#createdElements");


/* Savins Section */
const _ItemManager = new ItemManager(elementsList); // Defines a new item manager


/* Files */
const files = { // All the files inputs required.
    firearm: {
        thumbnail_file: new FileInputHandler("#firearm_thumbnail", "#firearm_thumbnail_file", true),
        sprite_file: new FileInputHandler("#firearm_sprite", "#firearm_sprite_file", true),
        sound_file: new FileInputHandler("#firearm_shotsound", "#firearm_shotsound_file", true)
    },

    explosive: {
        thumbnail_file: new FileInputHandler("#explosive_thumbnail", "#explosive_thumbnail_file", true),
        sprite_file: new FileInputHandler("#explosive_sprite", "#explosive_sprite_file", true)
    },

    entity: {
        thumbnail_file: new FileInputHandler("#entity_thumbnail", "#entity_thumbnail_file", true),
        skin_file: new FileInputHandler("#entity_skin", "#entity_skin_file", true),
        flesh_file: new FileInputHandler("#entity_flesh", "#entity_flesh_file", true),
        bone_file: new FileInputHandler("#entity_bone", "#entity_bone_file", true)
    },

    object: {
        thumbnail_file: new FileInputHandler("#object_thumbnail", "#object_thumbnail_file", true),
        sprite_file: new FileInputHandler("#object_sprite", "#object_sprite_file", true),
        sound_file: new FileInputHandler("#object_spawn", "#object_spawn_file", true)
    },

    melee: {
        thumbnail_file: new FileInputHandler("#melee_thumbnail", "#melee_thumbnail_file", true),
        sprite_file: new FileInputHandler("#melee_sprite", "#melee_sprite_file", true)
    }
}

function resetFiles(object){  // Resets the file inputs
    for (const file of Object.keys(object)){ object[file].reset(); }
}
function checkInputs(divID){ // Checks if all the inputs are filled
    const inputs = document.querySelectorAll(`${divID} input.required`);
    for (const input of inputs){ 
        if(input.value.replace(/ /g, "") == "") return "Please fill all of the inputs."; 
        if(input.type == "text" && /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(input.value)) return "Please do not use special characters.";
    }
    return true;
}

/* Element Selection */
const availableElements = ["Click to select a type", "Firearm", "Explosive", "Entity", "Object", "Melee"];
for (const option of availableElements){
    const selectOption = document.createElement("option");
    selectOption.value = option; selectOption.innerText = option;
    document.querySelector("#createElement select:first-of-type").appendChild(selectOption);
} // Will append all the available elements in the <select> dom element


/* Will handle the creator changes */
document.querySelector("#createElement select:first-of-type").addEventListener("change", () => {
    const newValue = document.querySelector("#createElement select:first-of-type").value;
    const elementPage = document.querySelector(`#${newValue.toLowerCase()}`);

    const actives = document.querySelectorAll("#createElement .active");
    for (const active of actives){active.classList.remove("active");}
    if(!elementPage) return null;

    elementPage.classList.add("active");
}); // Changes the "page" when selecting an element


/* Item Saving */
const itemSaveButtons = document.querySelectorAll("#createElement button.save");
const categories = {
    firearm: "Firearms",
    explosive: "Explosives",
    entity: "Entities",
    object: "Misc.",
    melee: "Melee"
} // Will help to find the correct type from the div id.

for (const button of itemSaveButtons){
    button.addEventListener("click", async () => { // Saves the current item
        const itemToSave = button.dataset.item;
        const filesInput = files[itemToSave];
        let newItem;

        // Checks about the inputs
        if(typeof checkInputs(`#${itemToSave}`) != "boolean") return document.querySelector(`#${itemToSave} .warning`).innerHTML = checkInputs(`#${itemToSave}`);
        
        // I need to do this if-else statement because the files are not the same for the entity
        console.log(filesInput.sound_file != undefined && filesInput.sound_file.file.files[0] != undefined, filesInput.sound_file.file.files[0])
        if(button.dataset.item != "entity"){
            newItem = {
                type: document.querySelector(`#${itemToSave} .type`).value,
                audio: filesInput.sound_file != undefined && filesInput.sound_file.file.files[0] != undefined ? await filesInput.sound_file.getBase64File() : null,
                sprite: await filesInput.sprite_file.getBase64File(),
                thumbnail: await filesInput.thumbnail_file.getBase64File()
            }
        }else{
            newItem = {
                type: document.querySelector(`#${itemToSave} .type`).value,
                audio: null,
                skin: await filesInput.skin_file.getBase64File(),
                flesh: await filesInput.flesh_file.getBase64File(),
                bone: await filesInput.bone_file.getBase64File(),
                thumbnail: await filesInput.thumbnail_file.getBase64File()
            }
        }
        console.log(newItem)

        // Retrieves all the inputs/select that are not file, and save their values in the "newItem" JSON Object
        // Like that, if I ever add some fields on a page, I won't have to deal with puting them in the script as well since it's automatic.
        const elementsNotFile = document.querySelectorAll(`#${itemToSave} *:not([type=file]):not(span):not(button):not(option)`);
        for (const element of elementsNotFile){
            const elementClass = element.classList[0];
            newItem[elementClass] = element.value
        }

        // Prevents the user from creating two items with the same name
        const avoidSameNames = _ItemManager.items.filter(item => item.data.name == newItem.name);
        if(avoidSameNames.length > 0) return alert(`The name "${newItem.name}" is already used by another of your mod elements. Please use a different name.`);

        // Saves the item in the local storage
        _ItemManager.save({
            category: categories[itemToSave],
            item: newItem
        });

        // Resets input files
        resetFiles(files[itemToSave])
        return document.querySelector("i[data-page='create']").click();
    });
}


_ItemManager.load(); // Loads the item manager
const items = _ItemManager.items; // And exports it items
export { items, checkInputs };
