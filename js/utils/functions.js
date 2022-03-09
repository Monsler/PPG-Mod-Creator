// Allows us to get the base64 uri from an image element. Useful uh?
function getBase64Image(img) {
    const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

    const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

    const dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


/* Resizes an image */
function resizeImage(sizePX, image){
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = sizePX;
    canvas.height = sizePX;

    ctx.drawImage(image, 0, 0, sizePX, sizePX); // Square
    return canvas.toDataURL("image/png");
}


/* Converts hex to rgb */
function hex2rgb(hex) {
    const r = parseInt(hex.substr(1,2), 16)
    const g = parseInt(hex.substr(3,2), 16)
    const b = parseInt(hex.substr(5,2), 16)
    return [r, g, b];
}

export {
    getBase64Image,
    resizeImage,
    hex2rgb
}