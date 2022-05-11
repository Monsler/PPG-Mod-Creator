/**
 * This class is made to handle all the file inputs I've created
 */
class FileInputHandler {
    /**
     * @param {HTMLElement} queryButton Button that will trigger the file input.
     * @param {HTMLElement} queryFile The file input we wanna trigger.
     * @param {Boolean} changeText If we wanna change the buttons text with the file name.
     */
    constructor(queryButton, queryFile, changeText=false, limit){
        // Gets stuff
        this.button = document.querySelector(queryButton);
        this.file = document.querySelector(queryFile);
        this.baseText = this.button.innerText;

        // This variable will save the previous file, will allow us to handle some errors if for example, someone triggers the file input but cancels 
        this.oldFile = null;

        this.button.addEventListener("click", () => this.file.click()); // Opens the file input when the button is clicked

        // On file input change
        this.file.addEventListener("change", () => {

            // If no files have been selected, check if we have something in "this.oldFile", if yes we use it, if not we just ask to select a file.
            if (!this.file.files[0]){
                if (this.oldFile != null){
                    // Creates a new file list
                    const list = new DataTransfer();
                    list.items.add(this.oldFile);

                    return this.file.files = list.files;
                }
                return this.button.innerText = this.baseText;
            }

            // Checks the extensions & filename
            const extensions = this.file.accept.split(", ");
            const filename = this.file.files[0].name;
            const _extension = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;

            // Updates "this.oldFile"
            this.oldFile = this.file.files[0];

            // Error
            if(!extensions.includes(`.${_extension}`)) {
                this.reset();
                return this.button.innerText = `PLEASE Select ${extensions.join("/")} file`;
            }

            // Too big
            if(this.file.files[0].size > 1048576 && limit){
                this.reset();
                return this.button.innerText = "Sorry, your file is too big (1MB max)";
            }

            // No files
            if(this.file.files[0] == undefined) return this.button.innerText = this.baseText;
            if(changeText) return this.button.innerText = filename;
        });
    }


    /**
     * Returns the width of an image by giving its data.
     * @param {ImageData} base64file Base64 image data.
     * @returns Promise (Containing images width)
     */
    getImageWidth(base64file){
        return new Promise(res => {
            const img = new Image();

            img.onload = () => res(img.width);
            img.src = base64file;
        });
    }


    /**
     * Returns the base64 image data from a file.
     * @returns Promise (Containing images data)
     */
    getBase64File(){
        return new Promise(res => {
            const reader = new FileReader();

            reader.onload = e => res(e.target.result);
            reader.readAsDataURL(this.file.files[0]);
        });
    }


    /**
     * Resets the file input
     */
    reset(){ 
        this.button.innerText = this.baseText; 
        this.file.value = "";
    }


    /**
     * Allows us to use callbacks on the file input
     * @param {String} method Methods like "click", "change"
     * @param {Function} callback Function
     * @returns AddEventListener
     */
    on(method, callback){
        return this.file.addEventListener(method, callback);
    }
}
export { FileInputHandler }