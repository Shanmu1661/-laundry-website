// Inject a compact login icon/button into the navbar for md+ viewports
document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.navbar');
  if (!nav) return;

  // hide navbar entirely on login and register pages
  var page = (location.pathname || '').split('/').pop();
  if (page === 'login.html' || page === 'register.html') {
    nav.style.display = 'none';
    return;
  }

  // Replace any broken 'Laundry team' image with an inline SVG placeholder for reliability
  try {
    var teamImg = document.querySelector('img[alt="Laundry team"]');
    if (teamImg) {
      teamImg.src = 'assets/images/laundry-team.svg';
    }
  } catch (e) {}

  // On the about page, inject a 'How we work' images section dynamically
  if (page === 'about.html') {
    var main = document.querySelector('main');
    if (main) {
      var html = '\n  <section class="section">\n    <div class="container">\n      <div class="row align-items-center">\n        <div class="col-lg-6">\n          <h2 class="section-title">How we work</h2>\n          <p class="text-secondary">From pickup to delivery, we handle your laundry with care. Here are snapshots of our process and team in action.</p>\n        </div>\n        <div class="col-lg-6">\n          <div class="row g-3">\n            <div class="col-6"><img src="assets/images/work-1.svg" class="img-fluid rounded" alt="Sorting and washing"></div>\n            <div class="col-6"><img src="assets/images/work-2.svg" class="img-fluid rounded" alt="Quality check"></div>\n            <div class="col-6"><img src="assets/images/work-3.svg" class="img-fluid rounded mt-3" alt="Team packing orders"></div>\n            <div class="col-6"><img src="assets/images/work-4.svg" class="img-fluid rounded mt-3" alt="Delivery van"></div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n';
      main.insertAdjacentHTML('beforeend', html);
    }
  }

  // Add a right-side login icon to the navbar for larger viewports
  if (nav && !nav.querySelector('.nav-login-icon')) {
    var loginIcon = document.createElement('a');
    loginIcon.className =
      'btn btn-sm btn-outline-brand rounded-circle d-none d-lg-inline-flex align-items-center justify-content-center ms-2 nav-login-icon';
    loginIcon.href = 'login.html';
    loginIcon.setAttribute('aria-label', 'Login');
    loginIcon.title = 'Login';
    loginIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="8" r="5"></circle></svg>';

    var bookingButton = nav.querySelector('.nav-booking');
    bookingButton?.insertAdjacentElement('afterend', loginIcon);
  }
});
