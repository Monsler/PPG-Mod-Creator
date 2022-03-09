import { FileInputHandler } from "./fileHandler.js";
import { resizeImage } from "./functions.js";


/* File Event Handler */
const fileHandler = new FileInputHandler("#mod_thumbnail", "#mod_thumb_file");

fileHandler.on("change", async () => {
    // Gets the image
    const dataSRC = await fileHandler.getBase64File();
    const image = new Image;

    // Resizes the mod thumbnail and shows it
    image.addEventListener("load", () => {
        const resized = resizeImage(200, image);
        document.querySelector("#preview_mod_thumb").src = resized;
    });
    image.src = dataSRC;
});

export default null; // Exports nothing because nothing to export.