/* ============================
   Interactivity for minimal UI
   ============================ */

/* -- Tab selection (Rent/Buy/etc.) -- */
function selectTab(el) {
  // remove active from siblings
  const parent = el.parentElement;
  if (!parent) return;
  parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  el.classList.add('active');
}

/* -- Simple smooth scroll for nav anchors -- */
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.pageYOffset - 72,
      behavior: 'smooth'
    });
  });
});

/* -- Mobile nav toggle -- */
(function setupMobileNav(){
  const content = document.querySelector('.nav-content');
  if(!content) return;
  // create a toggle button
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.innerHTML = '&#9776;'; // hamburger
  content.appendChild(toggle);

  const navLinks = document.querySelector('.nav-links');
  let open = false;
  toggle.addEventListener('click', ()=>{
    open = !open;
    if(open){
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.right = '18px';
      navLinks.style.top = '64px';
      navLinks.style.background = 'white';
      navLinks.style.padding = '12px';
      navLinks.style.borderRadius = '12px';
      navLinks.style.boxShadow = '0 10px 30px rgba(36,28,70,0.08)';
    } else {
      navLinks.style.display = '';
      navLinks.style.position = '';
      navLinks.style.top = '';
      navLinks.style.right = '';
      navLinks.style.background = '';
      navLinks.style.padding = '';
      navLinks.style.borderRadius = '';
      navLinks.style.boxShadow = '';
    }
  });

  // close on click outside
  document.addEventListener('click', (ev)=>{
    if(!open) return;
    if(!content.contains(ev.target) && !navLinks.contains(ev.target)){
      toggle.click();
    }
  });
})();

/* -- Initialize Swiper slider if available -- */
(function initSwiper(){
  try {
    if (typeof Swiper !== 'undefined') {
      new Swiper('.mySwiper', {
        loop: true,
        autoplay: { delay: 4200, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        slidesPerView: 1,
        spaceBetween: 18,
        breakpoints: {
          760: { slidesPerView: 1.2, spaceBetween: 20 },
          1024: { slidesPerView: 1.5, spaceBetween: 22 }
        }
      });
    }
  } catch (e) {
    console.warn('Swiper init failed:', e);
  }
})();

/* -- Contact form "send" handler (demo: no backend) -- */
function sendMessage(ev){
  ev.preventDefault();
  const form = ev.target;
  const name = form.querySelector('input[type="text"]')?.value?.trim();
  const email = form.querySelector('input[type="email"]')?.value?.trim();
  const message = form.querySelector('textarea')?.value?.trim();

  if(!name || !email || !message){
    alert('Please fill all fields before sending.');
    return;
  }
  // Simple fake "send": show success and reset
  form.querySelector('button[type="submit"]')?.classList.add('sending');
  form.querySelector('button[type="submit"]').innerText = 'Sending...';
  setTimeout(()=>{
    alert('Thanks, ' + name + '! Your message has been received. We will contact you soon.');
    form.reset();
    form.querySelector('button[type="submit"]').classList.remove('sending');
    form.querySelector('button[type="submit"]').innerText = 'Send Message';
  }, 900);
}

/* -- Small enhancement: press Enter in search field triggers search button -- */
(function searchEnter(){
  const input = document.querySelector('.search-input input');
  const btn = document.querySelector('.search-input button');
  if(!input || !btn)
