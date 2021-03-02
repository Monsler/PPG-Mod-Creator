import { FileInputHandler } from "./fileHandler.js";

/* File Event Handler */
const fileHandler = new FileInputHandler("#mod_thumbnail", "#mod_thumb_file");
fileHandler.on("change", async () => {
    document.querySelector("#preview_mod_thumb").src = await fileHandler.getBase64File();
});

export default null; // Exports nothing because nothing to export, I just wanted to make differents js files for each pages.