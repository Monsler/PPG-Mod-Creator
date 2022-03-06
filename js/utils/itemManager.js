class ItemManager { // Allows us to store and create items in the cache.
    constructor(elementsList){ 
        this.items = localStorage.getItem("items") != undefined ? JSON.parse(localStorage.getItem("items")) : [];
        this.elementsList = elementsList 
    }

    /* Loads all the items stored in the local storage and displays them in the accurate div */
    load(){
        this.elementsList.innerHTML = "";

        const inputs = document.querySelectorAll("#createElement input[type='text']");
        for (const input of inputs){input.value = "";}

        if(this.items.length == 0) return this.elementsList.innerHTML = "No Elements Created"; 

        let i = 0;
        for (const item of this.items){
            const container = document.createElement("div");
            container.classList.add("container");
            
            container.innerHTML = `
            <header><i class="zmdi zmdi-close deleteElement" data-close="${i}"></i></header>
            <div>
                <div class="left">
                    <img src="${item.data.thumbnail}">
                </div>
                <div class="right">
                    <span>${item.data.name}</span>
                    <span class="detail">${item.data.type}</span>
                </div>
            </div>`;
            this.elementsList.appendChild(container);
            i++
        }

        const deleteButtons = document.querySelectorAll(".deleteElement");
        for (const deleteBtn of deleteButtons){ deleteBtn.addEventListener("click", () => this.delete(deleteBtn.dataset.close)); }
        window.localStorage.setItem("items", JSON.stringify(this.items));
    }


    /* Deletes a certain item from the storage */
    delete(index){
        this.items.splice(index, 1);

        window.localStorage.setItem("items", JSON.stringify(this.items));
        return this.load();
    }


    /* Saves a new item and its category in the storage */
    save({ item, category }){
        this.items.push({
            category: category,
            data: item
        });

        window.localStorage.setItem("items", JSON.stringify(this.items));
        return this.load();
    }


    /* Clear all of the items */
    clear(){
        this.items = [];
        return this.load();
    }
}
export { ItemManager }