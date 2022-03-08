/* File Input Handler */
class FileInputHandler { // Will handle the custom file input I made
    constructor(queryButton, queryFile, changeText=false){
        this.button = document.querySelector(queryButton);
        this.file = document.querySelector(queryFile);
        this.baseText = this.button.innerText;

        this.button.addEventListener("click", () => this.file.click());
        this.file.addEventListener("change", () => {
            const extensions = this.file.accept.split(", ");
            const filename = this.file.files[0].name;
            const _extension = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;

            if(!extensions.includes(`.${_extension}`)) {
                this.reset();
                return this.button.innerText = `PLEASE Select ${extensions.join("/")} file`;
            }

            if(this.file.files[0].size > 1048576){
                this.reset();
                return this.button.innerText = "Sorry, your file is too big (1MB max)";
            }

            if(this.file.files[0] == undefined) return this.button.innerText = this.baseText;
            if(changeText) return this.button.innerText = filename;
        });
    }
    getImageWidth(base64file){
        return new Promise(res => {
            const img = new Image();

            img.onload = () => res(img.width);
            img.src = base64file;
        });
    }
    getBase64File(){
        return new Promise(res => {
            const reader = new FileReader();

            reader.onload = e => res(e.target.result);
            reader.readAsDataURL(this.file.files[0]);
        });
    }
    reset(){ 
        this.button.innerText = this.baseText; 
        this.file.value = "";
    }
    on(method, callback){
        return this.file.addEventListener(method, callback);
    }
}
export { FileInputHandler }