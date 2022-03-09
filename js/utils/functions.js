/**
 * Allows us to get the base64 data from an image.
 * @param {ImageData} img The image we wanna convert
 * @returns Base64
 */
function getBase64Image(img) {
    const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

    const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

    const dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


/**
 * Allows us to resize an image.
 * @param {Number} sizePX The size we want (Square ratio)
 * @param {ImageData} image The image we wanna resize
 * @returns Base64
 */
function resizeImage(sizePX, image){
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = sizePX;
    canvas.height = sizePX;

    ctx.drawImage(image, 0, 0, sizePX, sizePX); // Square
    return canvas.toDataURL("image/png");
}

export {
    getBase64Image,
    resizeImage
}