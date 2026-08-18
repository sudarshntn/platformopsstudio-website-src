document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      header.classList.toggle("nav-open");
    });
  }

  var cookieBanner = document.querySelector(".cookie-banner");
  var cookieAccept = document.querySelector(".cookie-accept");
  if (cookieBanner) {
    if (localStorage.getItem("pos-cookie-consent") === "accepted") {
      cookieBanner.classList.add("hidden");
    }
    if (cookieAccept) {
      cookieAccept.addEventListener("click", function () {
        localStorage.setItem("pos-cookie-consent", "accepted");
        cookieBanner.classList.add("hidden");
      });
    }
  }

  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var name = form.querySelector("#name").value.trim();
      var email = form.querySelector("#email").value.trim();
      var message = form.querySelector("#message").value.trim();

      var subject = encodeURIComponent("Message from " + (name || "PlatformOpsStudio site visitor"));
      var body = encodeURIComponent(
        message + "\n\n---\nName: " + name + "\nEmail: " + email
      );
      window.location.href = "mailto:ramsudarsan@gmail.com?subject=" + subject + "&body=" + body;

      if (status) {
        status.textContent = "Opening your email client to send this message…";
      }
    });
  }
});
