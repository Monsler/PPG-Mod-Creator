import { FileInputHandler } from "./fileHandler.js";
import { ItemManager } from "./itemManager.js";
const elementsList = document.querySelector("#createdElements");


/**
 * Defines a new item manager in order to save all the created mod elements in the local storage.
 */
const _ItemManager = new ItemManager(elementsList);


/**
 * This object contains all the file inputs in order to select them rapidly without having to have a big switch for each ones.
 */
const files = {
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


/**
 * This function resets all the file inputs.
 * @param {Object} object The json object containing all the inputs (const files)
 */
function resetFiles(object){
    for (const file of Object.keys(object)){ object[file].reset(); }
}


/**
 * This function checks if all the required inputs are filled.
 * @param {String} divID The div's ID we want to check
 * @returns {Boolean/String} True if everything is filled, a string containing an error if not. (I know I could do simpler but I don't know)
 */
function checkInputs(divID){
    const inputs = document.querySelectorAll(`${divID} input.required`);
    for (const input of inputs){ 
        if(input.value.replace(/ /g, "") == "") return "Please fill all of the inputs."; 
        if(input.type == "text" && /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(input.value)) return "Please do not use special characters.";
    }
    return true;
}


/**
 * This code will add all the available "elements" (Mod content as Firearm, Entity, etc...) in a <select> DOM element.
 * No need to create all of these by hand.
 */
const availableElements = ["Click to select a type", "Firearm", "Explosive", "Entity", "Object", "Melee"];
for (const option of availableElements){
    const selectOption = document.createElement("option");
    selectOption.value = option; selectOption.innerText = option;
    document.querySelector("#createElement select:first-of-type").appendChild(selectOption);
}


/**
 * This code will handle the change of elements. 
 * Example: If the user switchs from Firearm to Explosive, the page content will change.
 */
document.querySelector("#createElement select:first-of-type").addEventListener("change", () => {
    const newValue = document.querySelector("#createElement select:first-of-type").value;
    const elementPage = document.querySelector(`#${newValue.toLowerCase()}`);

    const actives = document.querySelectorAll("#createElement .active");
    for (const active of actives){active.classList.remove("active");}
    if(!elementPage) return null;

    elementPage.classList.add("active");
});


/**
 * This code will handle the save of a mod element.
 * Example: If the user has created an entity, when he will click the save button, this code will be executed.
 */
const itemSaveButtons = document.querySelectorAll("#createElement button.save");
const categories = {
    firearm: "Firearms",
    explosive: "Explosives",
    entity: "Entities",
    object: "Misc.",
    melee: "Melee"
} // Will help to find the correct type of element from the div id.

for (const button of itemSaveButtons){
    // An item is getting saved:
    button.addEventListener("click", async () => {
        const itemToSave = button.dataset.item;
        const filesInput = files[itemToSave];
        let newItem;

        // Checks all the inputs to see if they are actually filled:
        if(typeof checkInputs(`#${itemToSave}`) != "boolean") return document.querySelector(`#${itemToSave} .warning`).innerHTML = checkInputs(`#${itemToSave}`);
        
        // Forced to do a if/else statement, the content saved in the mod element aren't the same depending on if it's an entity or not.
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
                skinWidth: await filesInput.skin_file.getImageWidth(await filesInput.skin_file.getBase64File()),
                thumbnail: await filesInput.thumbnail_file.getBase64File()
            }
        }

        // Retrieves all the inputs/select that are not file, and save their values in the "newItem" JSON Object
        // Like that, if I ever add some fields on a page, I won't have to deal with puting them in the script as well since it's automatic.
        const elementsNotFile = document.querySelectorAll(`#${itemToSave} *:not([type=file]):not(span):not(button):not(option)`);
        for (const element of elementsNotFile){
            const elementClass = element.classList[0];

            newItem[elementClass] = element.value;
        }

        // Prevents the user from creating two items with the same name
        const avoidSameNames = _ItemManager.items.filter(item => item.data.name == newItem.name);
        if(avoidSameNames.length > 0) return alert(`The name "${newItem.name}" is already used by another of your mod elements. Please use a different name.`);

        // Saves the item with the Item Manager
        _ItemManager.save({
            category: categories[itemToSave],
            item: newItem
        });

        // Resets file inputs
        resetFiles(files[itemToSave])
        return document.querySelector("i[data-page='create']").click();
    });
}


_ItemManager.load(); // Loads the item manager
const items = _ItemManager.items; // And exports it items

export { items, checkInputs, _ItemManager };