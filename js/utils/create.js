import { FileInputHandler } from "./fileHandler.js";
import { ItemManager } from "./itemManager.js";
const elementsList = document.querySelector("#createdElements");


/* Savins Section */
const _ItemManager = new ItemManager(elementsList);


/* Files */
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
        sprite_file: new FileInputHandler("#object_sprite", "#object_sprite_file", true)
    },

    melee: {
        thumbnail_file: new FileInputHandler("#melee_thumbnail", "#melee_thumbnail_file", true),
        sprite_file: new FileInputHandler("#melee_sprite", "#melee_sprite_file", true)
    }
}

function resetFiles(object){ 
    for (const file of Object.keys(object)){ object[file].reset(); }
}
function checkInputs(divID){
    const inputs = document.querySelectorAll(`${divID} input`);
    for (const input of inputs){ if(input.value.replace(/ /g, "") == "") return false; }
    return true;
}


/* Element Selection */
const availableElements = ["Click to select a type", "Firearm", "Explosive", "Entity", "Object", "Melee"];
for (const option of availableElements){
    const selectOption = document.createElement("option");
    selectOption.value = option; selectOption.innerText = option;
    document.querySelector("#createElement select:first-of-type").appendChild(selectOption);
}


/* Will handle the creator changes */
document.querySelector("#createElement select:first-of-type").addEventListener("change", () => {
    const newValue = document.querySelector("#createElement select:first-of-type").value;
    const elementPage = document.querySelector(`#${newValue.toLowerCase()}`);

    const actives = document.querySelectorAll("#createElement .active");
    for (const active of actives){active.classList.remove("active");}
    if(!elementPage) return null;

    elementPage.classList.add("active");
});


/* Item Saving */
const itemSaveButtons = document.querySelectorAll("#createElement button.save");
const categories = {
    firearm: "Firearms",
    explosive: "Explosives",
    entity: "Entities",
    object: "Misc.",
    melee: "Melee"
}

for (const button of itemSaveButtons){
    button.addEventListener("click", async () => {
        const itemToSave = button.dataset.item;
        const filesInput = files[itemToSave];
        let newItem;
        
        if(button.dataset.item != "entity"){
            newItem = {
                type: document.querySelector(`#${itemToSave} .type`).value,
                audio: filesInput.sound_file != undefined ? await filesInput.sound_file.getBase64File() : null,
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


        const inputsNotFile = document.querySelectorAll(`#${itemToSave} input:not([type=file])`);
        if(!checkInputs(`#${itemToSave}`)) return document.querySelector(`#${itemToSave} .warning`).innerHTML = "Please fill all the inputs.";

        for (const input of inputsNotFile){
            const inputClass = input.classList[0];
            newItem[inputClass] = input.value
        }

        const avoidSameNames = _ItemManager.items.filter(item => item.data.name == newItem.name);
        if(avoidSameNames.length > 0) return alert(`The name "${newItem.name}" is already used by another of your mod elements. Please use a different name.`);

        
        _ItemManager.save({
            category: categories[itemToSave],
            item: newItem
        });

        resetFiles(files[itemToSave])
        return document.querySelector("i[data-page='create']").click();
    });
}


_ItemManager.load();
const items = _ItemManager.items;
export { items, checkInputs };
