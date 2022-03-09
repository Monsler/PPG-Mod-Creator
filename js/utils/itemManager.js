/**
 * This class allows us to store every single items (mod elements) in the local storage.
 */
class ItemManager {
    /**
     * @param {HTMLElement} elementsList Div that contains all the mod elements.
     */
    constructor(elementsList){ 
        this.items = localStorage.getItem("items") != undefined ? JSON.parse(localStorage.getItem("items")) : [];
        this.elementsList = elementsList 
    }

    /**
     * This function will load all the items from the local storage and will display them in "elementsList".
     * @returns Void
     */
    load(){
        this.elementsList.innerHTML = ""; // Empty

        // I forgot why I did that
        const inputs = document.querySelectorAll("#createElement input[type='text']");
        for (const input of inputs){input.value = "";}

        // No elements
        if(this.items.length == 0) return this.elementsList.innerHTML = "No Elements Created"; 

        // Displays each element
        let i = 0;
        for (const item of this.items){
            const container = document.createElement("div");
            container.classList.add("container");
            
            container.innerHTML = `
            <header><i class="zmdi zmdi-close deleteElement" data-close="${i}"></i></header>
            <div>
                <div class="left">
                    <img decoding="async" loading="lazy" src="${item.data.thumbnail}">
                </div>
                <div class="right">
                    <span>${item.data.name}</span>
                    <span class="detail">${item.data.type}</span>
                </div>
            </div>`;
            this.elementsList.appendChild(container);
            i++
        }

        // Creates the delete button
        const deleteButtons = document.querySelectorAll(".deleteElement");
        for (const deleteBtn of deleteButtons){ deleteBtn.addEventListener("click", () => this.delete(deleteBtn.dataset.close)); }
        window.localStorage.setItem("items", JSON.stringify(this.items));
    }


    /**
     * Deletes a certain element from the local storage.
     * @param {Number} index Index of the item we wanna remove.
     * @returns Void
     */
    delete(index){
        this.items.splice(index, 1); // Removes
        window.localStorage.setItem("items", JSON.stringify(this.items)); // Saves the new array
        this.load(); // Reloads the list
    }


    /**
     * Will add a new item in the local storage.
     * @param {Object} info Item's infos and category
     */
    save({ item, category }){
        this.items.push({
            category: category,
            data: item
        }); // Adds

        window.localStorage.setItem("items", JSON.stringify(this.items)); // Saves the new array
        this.load(); // Reloads the list
    }


    /**
     * Cleat everything.
     */
    clear(){
        this.items = []; // Clears
        window.localStorage.setItem("items", JSON.stringify(this.items)); // Saves the new array
        this.load(); // Reloads the list
    }
}
export { ItemManager }