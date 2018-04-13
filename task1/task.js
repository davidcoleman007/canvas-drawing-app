// GOAL:
// Fill in the function below in a way that completely satisfies the requirements.
//
// Inputs:
//  - canvasWidth, canvasHeight: width and height of canvas (area to be covered)
//    in pixels
//  - imageApsect: aspect ratio of image (width / height)
//
// Output:
//  - Array containing the following:
//    - sizex, sizey: calculated image size in pixels
//    - xpos, ypos: calculated image position offset relative to canvas in
//      pixels
//
// Coordinate system: 0,0 is upper left
//
// REQUIREMENTS:
// 1. Size the image to cover the canvas area completely.
// 2. Covering should be minimal - image should be no larger than necessary to
//    cover the canvas area.
// 3. Must maintain original aspect ratio of the image.
// 4. Center the image on the canvas
//
// The function should only return the values specified under Output above.
//

function sizeImage(canvasWidth, canvasHeight, imageAspect) {
    let xpos,
        ypos,
        sizex,
        sizey;
    const wider = imageAspect>=(canvasWidth/canvasHeight);
    if(wider) {
        //  source aspect wider
        sizey = canvasHeight;
        sizex = canvasHeight * imageAspect;
    } else {
        //  source aspect taller
        sizex = canvasWidth;
        sizey = canvasWidth / imageAspect;
    }
    xpos = wider?((canvasWidth-sizex)/2):0;
    ypos = wider?0:((canvasHeight-sizey)/2);
    // final image position and size
    return [xpos, ypos, sizex, sizey];
}

console.log(sizeImage(300,400,1));
console.log(sizeImage(400,173,4));
console.log(sizeImage(400,200,0.5));