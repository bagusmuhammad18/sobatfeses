// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
// ketika hamburger menu diklik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

window.addEventListener("resize", function () {
  let labelCam = document.querySelector(".webcam-custom");
  let labelFile = document.querySelector(".file-custom");
  let maxWidth = 600;

  if (window.innerWidth <= maxWidth) {
    labelCam.innerText = "Kamera";
    labelFile.innerText = "Galeri";
  } else {
    labelCam.innerText = "Nyalakan Kamera";
    labelFile.innerText = "Ambil dari Galeri";
  }
});
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementsByClassName("webcam-custom")[0];

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the input element
var webcamUploadInput = document.getElementById("webcamUpload");

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it and trigger the input
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    webcamUploadInput.click(); // Trigger the click event of the input element
  }
};

if (window.innerWidth <= 1024) {
  document.getElementsByClassName("webcam-custom")[0].style.display =
    "inline-block";
  document.getElementById("or").style.display = "inline-block";
} else {
  document.getElementById("or").style.display = "none";
}

const URL = "./model/";
let model, labelContainer, maxPredictions;
let fileUploadInput; // Added variable for file input

// Starting the model immediately after page loads
window.addEventListener("load", init);
async function init() {
  document.getElementById("reuploadButton").addEventListener("click", () => {
    resetWebState();
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.classList.remove("unblur");
  });
  // Initialize fileUploadInput variable
  fileUploadInput = document.getElementById("fileUpload");

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  document
    .getElementById("webcamUpload")
    .addEventListener("change", async (event) => {
      const image = await loadImage(event.target.files[0]);
      document.getElementById("imagePreview").src = image.src;
      document.getElementById("reuploadButton").style.visibility = "visible";
      document.getElementById("generateButton").style.visibility = "visible";
      document.getElementById("imagePreview").hidden = false;
      document.querySelector(".webcam").style.display = "none";
      document.getElementById("or").style.display = "none";
      document.querySelector(".file").style.display = "none";
    });

  fileUploadInput.addEventListener("change", async (event) => {
    const image = await loadImage(event.target.files[0]);
    document.getElementById("imagePreview").src = image.src;
    document.getElementById("reuploadButton").style.visibility = "visible";
    document.getElementById("generateButton").style.visibility = "visible";
    document.getElementById("imagePreview").hidden = false;
    document.querySelector(".webcam").style.display = "none";
    document.getElementById("or").style.display = "none";
    document.querySelector(".file").style.display = "none";
  });

  function resetWebState() {
    document.getElementById("imagePreview").src = "";
    document.getElementById("reuploadButton").style.visibility = "hidden";
    document.getElementById("generateButton").style.visibility = "hidden";
    document.getElementById("imagePreview").hidden = true;
    document.querySelector(".webcam").style.display = "block";
    document.querySelector(".file").style.display = "block";
    if (window.innerWidth <= 1024) {
      document.getElementsByClassName("webcam-custom")[0].style.display =
        "inline-block";
      document.getElementById("or").style.display = "inline-block";
    } else {
      document.getElementById("or").style.display = "none";
    }

    clearFileInput(fileUploadInput); // Clear file input value
  }

  document
    .getElementById("reuploadButton")
    .addEventListener("click", resetWebState);

  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  document.getElementById("generateButton").addEventListener("click", () => {
    const image = document.getElementById("imagePreview");
    predict(image);
  });

  function toggleBlur() {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.classList.toggle("unblur");
    document.querySelector(".clickTo").classList.toggle("clickToIlang");
  }

  document.getElementById("imagePreview").addEventListener("click", toggleBlur);
}

async function loadImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function predict(image) {
  const prediction = await model.predict(image);

  let bestPredictionIndex = 0;
  let bestPredictionValue = prediction[0].probability;

  for (let i = 1; i < maxPredictions; i++) {
    if (prediction[i].probability > bestPredictionValue) {
      bestPredictionIndex = i;
      bestPredictionValue = prediction[i].probability;
    }
  }

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);

    // let classPredictionElement = document.createElement("div");
    // classPredictionElement.innerHTML = classPrediction;

    // if (i === bestPredictionIndex) {
    //   classPredictionElement.style.fontWeight = "bold";
    // }

    // labelContainer.childNodes[i].innerHTML = "";
    // labelContainer.childNodes[i].appendChild(classPredictionElement);

    // let progressBarElement = document.createElement("div");
    // progressBarElement.className = "progress-bar";
    // labelContainer.childNodes[i].appendChild(progressBarElement);
  }

  // const bestPrediction = bestPredictionIndex;
  // document.getElementById("result").innerHTML =
  //   "Masuk ke class: " + bestPrediction;
  if (bestPredictionIndex === 0) {
    window.location.href = "sembelit.html";
    // alert("sembelit");
  } else if (bestPredictionIndex === 1) {
    window.location.href = "normal.html";
    // alert("normal");
  } else if (bestPredictionIndex === 2) {
    window.location.href = "diare.html";
    // alert("diare");
  }
}

function clearFileInput(fileInput) {
  try {
    fileInput.value = ""; // For most browsers
    if (fileInput.value) {
      // For IE11, Opera, Safari, etc.
      fileInput.type = "text";
      fileInput.type = "file";
    }
  } catch (error) {
    console.log(error);
  }
}
if (innerWidth > 1024) {
  document.getElementsByClassName("file-custom")[0].style.color = "white";
  document.getElementsByClassName("file-custom")[0].style.backgroundColor =
    "#3f497f";
}
document.getElementById("imagePreview").addEventListener("click", unblurImage);
