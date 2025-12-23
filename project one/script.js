// Load EmailJS
(function () {
  emailjs.init("dxzQGiSnDHkrCYKLm");
})();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // STOP page reload

    emailjs
      .sendForm(
        "service_zeg14gs",
        "template_161hxkj",
        form
      )
      .then(function () {
        alert("✅ Message sent successfully!");
        form.reset();
      })
      .catch(function (error) {
        alert("❌ Failed to send message");
        console.error("EmailJS Error:", error);
      });
  });
});

const projectCards = document.querySelectorAll(".project-card");
const modal = document.getElementById("project-modal");
const closeBtn = document.querySelector(".close-btn");

const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalTech = document.getElementById("modal-tech");

projectCards.forEach(card => {
  card.addEventListener("click", () => {
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.desc;
    modalTech.textContent = card.dataset.tech;

    modal.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

