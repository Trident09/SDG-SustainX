/*****************************
*                            *
*       Cursor Parking       *
*                            *
******************************/

let photo, locationValue = false;


document.addEventListener('DOMContentLoaded', function () {
  // let video, canvas, photo, startbutton, backbutton, streaming, submit = false;
  let video, canvas, startbutton, backbutton, streaming, submit = false;

  function startup() {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
      backbutton = document.getElementById('backbutton');
      submit = document.getElementById('submit');
      note = document.getElementById('note');
      recycle = document.getElementById('recycle');

      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then(function (stream) {
              video.srcObject = stream;
              video.play();
          })
          .catch(function (err) {
              console.log("An error occurred: " + err);
          });

      video.addEventListener('canplay', function (ev) {
          if (!streaming) {
              const width = video.videoWidth;
              const height = video.videoHeight;

              video.setAttribute('width', width);
              video.setAttribute('height', height);
              canvas.setAttribute('width', width);
              canvas.setAttribute('height', height);
              streaming = true;
          }
      }, false);

      startbutton.addEventListener('click', function (ev) {
          takepicture();
          ev.preventDefault();
      }, false);

      backbutton.addEventListener('click', function (ev) {
          showWebcam();
          ev.preventDefault();
      }, false);

      submit.addEventListener('click', function (ev) {
          analyze_pic();
    }, false);

      clearphoto();
  }

  function analyze_pic() {
    // predict();
    init();
    submit.style.display = 'none';
  }

  // on take picture
  function takepicture() {
      canvas.width = video.width;
      canvas.height = video.height;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      // Hide the video element and show the photo element
      video.style.display = 'none';
    //   highestConfidence.style.display = 'none';
    //   sortCategory.style.display = 'none';
      photo.style.display = 'block';
      backbutton.style.display = 'block';
      submit.style.display = 'block';
      startbutton.style.display = 'none';

      photo.src = canvas.toDataURL('image/png');
  }

  // on retake
  function showWebcam() {
      // Show the video element and hide the photo element
      video.style.display = 'block';
      backbutton.style.display = 'none';
      submit.style.display = 'none';
      startbutton.style.display = 'block';
      photo.style.display = 'none';
      note.style.display = 'none';
      
      recycle.style.display = 'none';
      garbage.style.display = 'none';
      sortCategory.style.display = 'none';
      highestConfidence.style.display = 'none';
  }

  function clearphoto() {
      const context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
  }

//   init();

  startup();
});

async function init() {
    //response.addHeader("Access-Control-Allow-Origin", "*");

    // const modelURL = URL + "model.json";
    // const metadataURL = URL + "metadata.json";
    const modelURL = "model.json";
    const metadataURL = "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    // const flip = true; // whether to flip the webcam
    // webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    // await webcam.setup(); // request access to the webcam
    // await webcam.play();
    // window.requestAnimationFrame(loop);

    // // append elements to the DOM
    // document.getElementById("webcam-container").appendChild(webcam.canvas);
    
    // this imagePath will later be: canvas.toDataURL('image/png');
    const imagePath = photo.src //'../images/PlasticWaterBottle.png'; // Replace with the path to your local image
    const img = new Image();
    img.src = imagePath;
    img.crossOrigin = 'anonymous'; // Set crossOrigin attribute if loading image from a different domain

    // Display the image (image already displayed lol)
    // document.getElementById("webcam-container").appendChild(img);


    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    highestConfidence = document.getElementById("highest-confidence");
    highestConfidence.label = "";
    highestConfidence.confidence = 0.0;

    sortCategory = document.getElementById("sort-category");

    let location = document.getElementById("location");
    let locationSelect = document.getElementById("locationSelect");
    locationValue = locationSelect.options[locationSelect.selectedIndex].value;
    // var text = location.options[location.selectedIndex].text;
    //location.innerHTML = value;
    console.log(locationValue);

    await predict();
}

// async function loop() {
//     webcam.update(); // update the webcam frame
//     await predict();
//     window.requestAnimationFrame(loop);
//     console.log("looploop")
// }

async function predict() {
    // predict can take in an image, video, or canvas HTML element
    const prediction = await model.predict(photo);
    console.log(prediction);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            console.log(prediction[i].className + ": " + prediction[i].probability.toFixed(2));
        labelContainer.childNodes[i].innerHTML = classPrediction;
        if (prediction[i].probability.toFixed(2) > highestConfidence.confidence) {
            highestConfidence.label = prediction[i].className;
            highestConfidence.confidence = prediction[i].probability.toFixed(2);
            //console.log("here");
        }
    }
    console.log("RESULT = " + highestConfidence.label + ": " + highestConfidence.confidence);
    note.style.display = 'block';
    highestConfidence.style.display = 'block';
    sortCategory.style.display = 'block';

    let itemNameMap = new Map();

    // Adding key-value pairs to the map
    itemNameMap.set("glass", "glass container");
    itemNameMap.set("clear_containers", "clear container");
    itemNameMap.set("food_containers", "food container");
    itemNameMap.set("plastic_cups", "plastic cup");
    itemNameMap.set("beverage_bottles", "beverage bottle");
    itemNameMap.set("shampoo_bottles", "shampoo bottle");
    itemNameMap.set("clear_cd_dvd_cases", "clear case");
    // itemNameMap.set("soft_plastics", "soft plastic");
    itemNameMap.set("plastic_foil_wrappers", "plastic and/or foil wrapper");
    itemNameMap.set("hot_drink_cups", "hot drink cup");
    itemNameMap.set("metal_cans", "metal can");
    itemNameMap.set("paper_products", "paper product");

    highestConfidence.innerHTML = "This item is a " + itemNameMap.get
    (highestConfidence.label) + ".";

    let itemCategoryMap = new Map();

    // Adding key-value pairs to the map
    itemCategoryMap.set("glass", "recycling");
    itemCategoryMap.set("clear_containers", "recycling");
    itemCategoryMap.set("food_containers", "recycling");
    itemCategoryMap.set("plastic_cups", "recycling");
    itemCategoryMap.set("beverage_bottles", "recycling");
    itemCategoryMap.set("shampoo_bottles", "recycling");
    itemCategoryMap.set("clear_cd_dvd_cases", "recycling");
    if (locationValue == "hamilton") {
        itemCategoryMap.set("clear_cd_dvd_cases", "garbage");
    }
    // itemCategoryMap.set("soft_plastics", "recycling");
    itemCategoryMap.set("plastic_foil_wrappers", "garbage");
    itemCategoryMap.set("hot_drink_cups", "garbage");
    itemCategoryMap.set("metal_cans", "recycling");
    itemCategoryMap.set("paper_products", "recycling");

    console.log(itemCategoryMap.get("clear_cd_dvd_cases"));
    console.log(itemCategoryMap.get(highestConfidence.label)); 
    sortCategory.innerHTML = "It should go in the " + itemCategoryMap.get(highestConfidence.label) + ".";

    if(itemCategoryMap.get(highestConfidence.label) == "recycling"){
        recycle.style.display = 'block';
    }
    if(itemCategoryMap.get(highestConfidence.label) == "garbage"){
        garbage.style.display = 'block';
    }

    return(
        console.log("its cooking")
    )
}

/*

hashmap vs sql
- must use cause different areas have different recycling/garbage/compost rules

hash map
- faster request
- cant support too many entires

sql 
- better for indexing
- more impressive for resume 


- cans
- paper products

- plastic foil wrapper
- paper hot drink cup 

*/

/*
DROP TABLE IF EXISTS toronto_sort;
CREATE TABLE toronto_sort(id integer, item text, category text);

INSERT INTO toronto_sort VALUES (1,'metal_cans','recycling');
INSERT INTO toronto_sort VALUES (2,'plastic_foil_wrappers', 'garbage');

SELECT category FROM toronto_sort WHERE item = 'metal_cans';
*/