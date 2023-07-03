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

// Panggil fungsi resize sekali untuk memperbarui teks label saat halaman dimuat
window.dispatchEvent(new Event("resize"));
