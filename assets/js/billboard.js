// billboard.js
(function () {
  // Only run on pages with the billboard
  const container = document.querySelector('.main-swiper');
  if (!container || typeof Swiper === 'undefined') return;

  // Slide data
  const slides = [
    { img: 'assets/images/shirt/mixed/shirt1.JPG', title: 'General Merch', text: 'T Shirts' },
    { img: 'kkfsmerch/assets/images/shirt/mixed/shirt9.JPG', title: 'General Merch', text: 'T Shirts' },
    { img: './assets/images/shirt/mixed/shirt15.JPG', title: 'General Merch', text: 'T Shirts' },
    { img: '../assets/images/shirt/mixed/shirt24.JPG', title: 'General Merch', text: 'T Shirts' },
    { img: 'kkfsmerch/assets/images/house shirts/mixed/_DSC0019.webp', title: 'General Merch', text: 'T Shirts' },
    { img: 'kkfsmerch/assets/images/house shirts/mixed/_DSC0074.webp', title: 'General Merch', text: 'T Shirts' },
    // Add more slides here if needed
  ];

  // Build slides in the DOM
  const swiperWrapper = container.querySelector('.swiper-wrapper');
  slides.forEach(slide => {
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';
    slideEl.style.backgroundImage = `url('${slide.img}')`;
    slideEl.style.backgroundRepeat = 'no-repeat';
    slideEl.style.backgroundSize = 'cover';
    slideEl.style.backgroundPosition = 'center';
    slideEl.innerHTML = `
      <div class="banner-content">
        <div class="container">
          <div class="row">
            <div class="col-md-8">
              <h2 class="banner-title">${slide.title}</h2>
              <p>${slide.text}</p>
              <div class="btn-wrap">
                <a href="general.html" class="btn btn-light btn-medium d-flex align-items-center">
                  Shop it now <i class="icon icon-arrow-io"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    swiperWrapper.appendChild(slideEl);
  });

  // Initialize Swiper
  new Swiper(container, {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: { delay: 4000, disableOnInteraction: false },
    keyboard: { enabled: true },
    pagination: { el: container.querySelector('.swiper-pagination') || '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.button-next', prevEl: '.button-prev' }
  });
})();









