function getCanvas() {
    return document.getElementById("board")
}

function convertCanvasImageToBlob(callback) {
    getCanvas().toBlob(callback, "image/jpeg");
}

function rotateImage(dataURL, degrees, callback) {
    var image = new Image();
    image.src = dataURL;
    image.onload =
        function (event) {
            var canvas = getCanvas()
            var context = canvas.getContext('2d');

            context.save();

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            switch (degrees) {
                case 90:
                    canvas.height = image.naturalWidth;
                    canvas.width = image.naturalHeight;
                    rotateBy90Degrees(canvas, context);
                    break;
                case 180:
                    rotateBy180Degrees(canvas, context);
                    break;
                case 270:
                    canvas.height = image.naturalWidth;
                    canvas.width = image.naturalHeight;
                    rotateBy270Degrees(canvas, context);
                    break;
            }

            context.drawImage(image, 0, 0);

            const imageURL = canvas.toDataURL("image/jpeg");

            context.restore();

            callback(imageURL);
        };
}

function rotateBy270Degrees(canvas, context) {
    translateAndRotate(context, 0, canvas.height - (canvas.height / canvas.width), -Math.PI / 2);
}

function rotateBy90Degrees(canvas, context) {
    translateAndRotate(context, canvas.width, canvas.height / canvas.width, Math.PI / 2);
}

function rotateBy180Degrees(canvas, context) {
    translateAndRotate(context, canvas.width / 2, canvas.height / 2, Math.PI);
    context.translate(-canvas.width / 2, -canvas.height / 2);
}

function translateAndRotate(
    context,
    xTranslation,
    yTranslation,
    rotationRadians) {
    context.translate(xTranslation, yTranslation);
    context.rotate(rotationRadians);
}

function uploadImageToServer(imageBlob, callback) {
    var fd = new FormData()
    fd.append('img_data', imageBlob)


    fetch(document.location.origin + '/u', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-length': imageBlob.size
        },
        body: fd
    }).then(callback)
}

function uploadDoneCallback(response) {
    console.log(response)
}

var photo = document.getElementById("photo")
var fileinput = document.getElementById("fp")
var rotDegInput = document.getElementById("rotDeg") || {}
var reader = new FileReader()
reader.addEventListener("loadend", function(e) {
    // alert("loaded to fp: " + e.target.result)
    var imageAsDataURL = e.target.result
    rotateImage(imageAsDataURL, parseInt(rotDegInput.value, 10), function(ri) {
        // console.log(ri)
        photo.src = ri
        convertCanvasImageToBlob(function(imageBlob) {
            uploadImageToServer(imageBlob, uploadDoneCallback)
        })
    })
})

var handle = function(e) {
    const selectedFile = fileinput.files[0]
    if (selectedFile) {
        reader.readAsDataURL(selectedFile)
    }
}

fileinput.addEventListener("change", handle)
