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
// Modal Tutorial
// Get the modal
let modal = document.getElementById("myModal");
// Get saya mengerti button
let mengerti = document.getElementsByClassName("mengerti")[0];
// Get the button that opens the modal
let btn = document.getElementsByClassName("webcam-custom")[0];
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
// Get the input element
let webcamUploadInput = document.getElementById("webcamUpload");
// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};
// When the user clicks on Saya Mengerti, close the modal
mengerti.onclick = function () {
  modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it and trigger the input
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    webcamUploadInput.click(); // Trigger the click event of the input element
  }
};

// ============Modal Warning============
function initializeModalWarning(
  bestPredictionIndex,
  secondBestPredictionIndex
) {
  // Get the modal
  let modalWarning = document.getElementById("modalWarning");
  // Get the button that opens the modal
  let btnWarning = document.getElementById("myBtn");
  // Get the <span> element that closes the modal
  let spanWarning = document.getElementsByClassName("closeWarning")[0];
  let lanjutkan = document.getElementsByClassName("lanjutkanModal")[0];
  let unggahUlang = document.getElementsByClassName("unggahulangModal")[0];

  modalWarning.style.display = "block";

  // When the user clicks on the button, open the modal
  // btnWarning.onclick = function () {
  //   modalWarning.style.display = "block";
  // };

  // When the user clicks on <span> (x), close the modal
  spanWarning.onclick = function () {
    modalWarning.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modalWarning) {
      modalWarning.style.display = "none";
    }
  };
  // When the user clicks Lanjutkan, go to predict result page
  lanjutkan.onclick = function () {
    if (bestPredictionIndex == 3) {
      goToResultPage(secondBestPredictionIndex);
    } else {
      goToResultPage(bestPredictionIndex);
    }
  };
  // When the user clicks Unggah Ulang, close the modal and reset web state
  unggahUlang.onclick = function () {
    modalWarning.style.display = "none";
    resetWebState();
  };
}

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
function resetWebState() {
  document.getElementById("imagePreview").src = "";
  document.getElementsByClassName("clickTo")[0].style.visibility = "hidden";
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
      document.getElementsByClassName("clickTo")[0].style.visibility =
        "visible";
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
    document.getElementsByClassName("clickTo")[0].style.visibility = "visible";
    document.getElementById("reuploadButton").style.visibility = "visible";
    document.getElementById("generateButton").style.visibility = "visible";
    document.getElementById("imagePreview").hidden = false;
    document.querySelector(".webcam").style.display = "none";
    document.getElementById("or").style.display = "none";
    document.querySelector(".file").style.display = "none";
  });

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
  document
    .getElementsByClassName("clickTo")[0]
    .addEventListener("click", toggleBlur);
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
  let secondBestPredictionIndex = 0;
  let secondBestPredictionValue = 0;

  for (let i = 1; i < maxPredictions; i++) {
    if (prediction[i].probability > bestPredictionValue) {
      secondBestPredictionIndex = bestPredictionIndex;
      secondBestPredictionValue = bestPredictionValue;
      bestPredictionIndex = i;
      bestPredictionValue = prediction[i].probability;
    } else if (prediction[i].probability > secondBestPredictionValue) {
      secondBestPredictionIndex = i;
      secondBestPredictionValue = prediction[i].probability;
    }
  }

  // for (let i = 0; i < maxPredictions; i++) {
  //   const classPrediction =
  //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);

  //   let classPredictionElement = document.createElement("div");
  //   classPredictionElement.innerHTML = classPrediction;

  //   if (i === bestPredictionIndex) {
  //     classPredictionElement.style.fontWeight = "bold";
  //   }

  //   labelContainer.childNodes[i].innerHTML = "";
  //   labelContainer.childNodes[i].appendChild(classPredictionElement);

  //   let progressBarElement = document.createElement("div");
  //   progressBarElement.className = "progress-bar";
  //   labelContainer.childNodes[i].appendChild(progressBarElement);
  // }

  // const bestPrediction = bestPredictionIndex;
  // document.getElementById("result").innerHTML =
  //   "Masuk ke class: " + bestPrediction;
  // -----------------
  // if (bestPredictionIndex === 0) {
  //   window.location.href = "sembelit.html";
  //   // alert("sembelit");
  // } else if (bestPredictionIndex === 1) {
  //   window.location.href = "normal.html";
  //   // alert("normal");
  // } else if (bestPredictionIndex === 2) {
  //   window.location.href = "diare.html";
  //   // alert("diare");
  // }

  // if (
  //   bestPredictionValue <= 0.6 ||
  //   bestPredictionIndex == 0 ||
  //   bestPredictionIndex == 1 ||
  //   bestPredictionIndex == 2 ||
  //   bestPredictionIndex == 3
  // ) {
  if (bestPredictionValue <= 0.6 || bestPredictionIndex == 3) {
    initializeModalWarning(bestPredictionIndex, secondBestPredictionIndex);
  } else {
    goToResultPage(bestPredictionIndex);
  }
}
function goToResultPage(bestPredictionIndex) {
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
