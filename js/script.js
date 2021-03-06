window.addEventListener("DOMContentLoaded", () => {
  // tabs
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  function hideTabsContent() {
    tabContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });
    
    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabsContent(i = 0) {
    tabContent[i].classList.add("show", "fade");
    tabs[i].classList.add("tabheader__item_active");
    tabContent[i].classList.remove("hide");
  }

  hideTabsContent();
  showTabsContent();

  tabsParent.addEventListener("click", (event) => {
    const target = event.target;

    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabsContent();
          showTabsContent(i);
        }
      });
    }
  });

  //Timer

  const deadline = "2023-01-01";

  function getRemaningTime(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / (1000 * 60)) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = document.querySelector("#days"),
      hours = document.querySelector("#hours"),
      minutes = document.querySelector("#minutes"),
      seconds = document.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getRemaningTime(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(".timer", deadline);

  // modal

  const btnTrigger = document.querySelectorAll("[data-modal]"),
      modal = document.querySelector(".modal");


  function showModal() {
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerID);
  }

 

  btnTrigger.forEach((btn) => {
    btn.addEventListener("click", showModal);
  });

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  

  const modalTimerID = setTimeout(showModal, 50000);

  function showModalScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) { 
        showModal();
        window.removeEventListener('scroll', showModalScroll);
    }
  }

  window.addEventListener('scroll', showModalScroll);

  // ???????????????????? ???????????? ?????? ????????????????

  class MenuCard {
      constructor(src, alt, title, descr, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.classes = classes;
        this.transfer = 27;
        this.parent = document.querySelector(parentSelector);
        this.changeToUAH();
      }

      changeToUAH() {
        this.price = this.price * this.transfer;
      }

      render() {
        const element = document.createElement('div');
        if (this.classes.length === 0 ) {
           this.element = 'menu__item';
           element.classList.add(this.element);
        } else {
          this.classes.forEach(className => element.classList.add(className));
        }
        element.innerHTML = `
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">????????:</div>
            <div class="menu__item-total"><span>${this.price}</span> ??????/????????</div>
        </div>
    </div>
        `;
        this.parent.append(element);
      }
  }

  const getResource = async (url) => {
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

  return await res.json();
};

// getResource('http://localhost:3000/menu')
// .then(data => {
//   data.forEach(({img, altimg, title, descr, price}) => {
//     new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
//   });
// });

axios.get('http://localhost:3000/menu')
.then(data => {
    data.data.forEach(({img, altimg, title, descr, price}) => {
      new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    });
  });

  //Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'C????????????! ?????????? ???? ?? ???????? ????????????????',
    failure: '??????-???? ?????????? ???? ??????...'
  };

  forms.forEach(item => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: data
  });

  return await res.json();
};

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;  
      `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      const object = {};
      formData.forEach(function(value, key) {
        object[key] = value;
      });

      postData('http://localhost:3000/requests', json)
      .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
      }).catch(() => {
          showThanksModal(message.failure);
      }).finally(() => {
        form.reset();
      });

    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    showModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
          <div class="modal__close" data-close>??</div>
          <div class="modal__title">${message}</div>
      </div>
      `;
      document.querySelector('.modal').append(thanksModal);
      setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.add('hide');
        closeModal();
      }, 4000);
  }

    fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(response => console.log(response));
 


//Slider

const slides = document.querySelectorAll('.offer__slide'),
      prev = document.querySelector('.offer__slider-prev'),
      next = document.querySelector('.offer__slider-next'),
      current = document.querySelector('#current'),
      total = document.querySelector('#total'),
      slidesWrapper = document.querySelector('.offer__slider-wrapper'),
      slidesField = document.querySelector('.offer__slides-inner'),
      width = window.getComputedStyle(slidesWrapper).width,
      slider = document.querySelector('.offer__slider');

let slideIndex = 1;
let offset = 0;

if (slides.length < 10) {
  total.textContent = `0${slides.length}`;
  current.textContent = `0${slideIndex}`;
} else {
  total.textContent = slides.length;
  total.textContent = slideIndex;
}


slidesField.style.width = 100 * slides.length + '%';
slidesField.style.display = 'flex';
slidesField.style.transition = '0.5s all';

slidesWrapper.style.overflow = 'hidden';

slides.forEach(slide => {
  slide.style.width = width;
});

slider.style.position = 'relative';

const indicators = document.createElement('ol'),
      dots = [];


indicators.classList.add('carousel-indicators');
indicators.style.cssText = ` position: absolute;
right: 0;
bottom: 0;
left: 0;
z-index: 15;
display: flex;
justify-content: center;
margin-right: 15%;
margin-left: 15%;
list-style: none;`;
slider.append(indicators);

for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement('li');
  dot.setAttribute('data-slide-to', i + 1);
  dot.style.cssText = `
    box-sizing: content-box;
    flex: 0 1 auto;
    width: 30px;
    height: 6px;
    margin-right: 3px;
    margin-left: 3px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: .5;
    transition: opacity .6s ease;
  `;
  if (i == 0) {
    dot.style.opacity = 1;
   }
  indicators.append(dot);
  dots.push(dot);
}

next.addEventListener('click', () => {
  if (offset == +width.slice(0, width.length - 2) * (slides.length -1)) {
    offset = 0;
  } else {
    offset += +width.slice(0, width.length - 2);
  }

  slidesFieldTransform();

  if (slideIndex == slides.length) {
    slideIndex = 1;
  } else {
    slideIndex++;
  }

  addCurrentNull();  

  dotsOpasity();

});

prev.addEventListener('click', () => {
    if (offset == 0) {
      offset == +width.slice(0, width.length - 2) * (slides.length -1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }
  

    slidesFieldTransform();

  if (slideIndex == 1) {
    slideIndex = slides.length;
  } else {
    slideIndex--;
  }

  addCurrentNull();  

  dotsOpasity();

});

function addCurrentNull() {
  if (slides.length < 10) {
    current.textContent = `0${slideIndex}`;
  } else {
    current.textContent = slideIndex;
  }
}

function dotsOpasity() {
  dots.forEach(dot => dot.style.opacity = '.5');
  dots[slideIndex - 1].style.opacity = 1;
}

function slidesFieldTransform() {
  slidesField.style.transform = `translateX(-${offset}px)`;
}

dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    const slideTo = e.target.qetAttribute('data-slide-to');

    
    slideIndex = slideTo;
    offset = +width.slice(0, width.length - 2) * (slideTo - 1);
 

    slidesFieldTransform();

  addCurrentNull();  

  dotsOpasity();
});
});
});