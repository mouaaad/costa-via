const COMPANY = {
  name: "Costa Via",
  whatsappNumber: "212600000000",
  domain: "your-domain.com",
};

document.body.classList.add("loading");

const loader = document.querySelector("#loader");
const header = document.querySelector(".site-header");
const reservationForm = document.querySelector("#reservationForm");
const rideSelect = document.querySelector("#ride");
const routeButtons = document.querySelectorAll(".route-card");
const scrollVideo = document.querySelector("[data-scroll-video] video");
const rideTransition = document.querySelector("#rideTransition");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("is-hidden");
    document.body.classList.remove("loading");
  }, 900);
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

routeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const route = button.dataset.route || "";
    rideSelect.value = route;
    routeButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
    playRideTransition();
  });
});

if ("IntersectionObserver" in window && scrollVideo) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        scrollVideo.play().catch(() => {});
      } else {
        scrollVideo.pause();
      }
    },
    { threshold: 0.35 }
  );
  observer.observe(scrollVideo);
}

reservationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(reservationForm);
  const name = cleanValue(formData.get("customerName"));
  const phone = cleanValue(formData.get("customerPhone"));
  const ride = cleanValue(formData.get("ride"));
  const travelDate = cleanValue(formData.get("travelDate")) || "Not selected";
  const passengers = cleanValue(formData.get("passengers")) || "1";
  const notes = cleanValue(formData.get("notes")) || "No notes";

  const message = [
    `Hello ${COMPANY.name}, I want to reserve a bus ride.`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Ride: ${ride}`,
    `Travel date: ${travelDate}`,
    `Passengers: ${passengers}`,
    `Notes: ${notes}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

function cleanValue(value) {
  return String(value || "").trim();
}

function playRideTransition() {
  const reservation = document.querySelector("#reservation");

  if (!rideTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reservation?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  /* Réinitialise l'état précédent */
  rideTransition.classList.remove("is-active", "is-leaving");
  void rideTransition.offsetWidth;

  /* Phase 1 — entrée (voile + logo + barre) */
  rideTransition.classList.add("is-active");

  /* Scroll pendant que l'écran est couvert */
  window.setTimeout(() => {
    reservation?.scrollIntoView({ behavior: "instant" });
  }, 350);

  /* Phase 2 — sortie (contenu disparaît, voile remonte) */
  window.setTimeout(() => {
    rideTransition.classList.add("is-leaving");
  }, 680);

  /* Nettoyage final */
  window.setTimeout(() => {
    rideTransition.classList.remove("is-active", "is-leaving");
  }, 1050);
}
