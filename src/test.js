
const atob = require("atob");
const fs = require('fs');
const base64 = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO 9TXL0Y4OHwAAAABJRU5ErkJggg==' // Place your base64 url here.
let base64Image = base64.split(';base64,').pop();
fs.writeFile('image.png', base64Image, {encoding: 'base64'}, function(err) {
    console.log('File created');
});

// function dataURLtoFile(dataurl, filename) {

//     var arr = dataurl.split(','),
//         mime = arr[0].match(/:(.*?);/)[1],
//         bstr = atob(arr[1]),
//         n = bstr.length,
//         u8arr = new Uint8Array(n);

//     while (n--) {
//         u8arr[n] = bstr.charCodeAt(n);
//     }

//     return fs.readFileSync([u8arr], filename, { type: mime });
// }

// //Usage example:
// var file = dataURLtoFile(base64, 'image.png');
// console.log(file);