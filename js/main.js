document.addEventListener('DOMContentLoaded', function() {
    // Функция для установки background-image из src картинки внутри .ibg
    function ibg() {
        let ibg = document.querySelectorAll(".ibg");
        for (let i = 0; i < ibg.length; i++) {
            let img = ibg[i].querySelector("img");
            if (img) {
                ibg[i].style.backgroundImage = `url(${img.getAttribute("src")})`;
            }
        }
    }

    ibg(); // Вызываем функцию, чтобы обработать все .ibg элементы
    
    // Инициализация основного слайдера (если нужен)
    new Swiper('.image-slider', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        slideToClickedSlide: true,
        hashNavigation: {
            watchState: true,
        },
        slidesPerView: 3.5,
        spaceBetween: 20,
        slidesPerGroup: 1,
        loop: true,
    });

    // Галерея с модальным окном
    const galleryItems = document.querySelectorAll('.gallery__item');
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.modal__close');
    const swiperWrapper = document.querySelector('.modal-swiper .swiper-wrapper');
    let modalSwiper = null;

    // Функция инициализации модального слайдера
    const initModalSwiper = () => {
        const isMobile = window.innerWidth < 768;
        
        return new Swiper('.modal-swiper', {
            loop: true,
            slidesPerView: isMobile ? 1.2 : 3,
            centeredSlides: true,
            spaceBetween: isMobile ? 10 : 20,
            effect: 'coverflow',
            coverflowEffect: {
                rotate: isMobile ? 10 : 20,
                stretch: isMobile ? 10 : 0,
                depth: isMobile ? 50 : 150,
                modifier: isMobile ? 1 : 1.5,
                slideShadows: !isMobile
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            // Плавные переходы
            speed: 600,
            grabCursor: true
        });
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Собираем все изображения галереи
            const images = Array.from(document.querySelectorAll('.gallery__item img'));
            
            // Очищаем слайдер перед добавлением новых слайдов
            swiperWrapper.innerHTML = '';
            
            // Добавляем все изображения в слайдер
            images.forEach(img => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `
                    <div class="slide-container">
                        <img src="${img.src}" alt="${img.alt}">
                    </div>
                `;
                swiperWrapper.appendChild(slide);
            });
            
            // Открываем модальное окно
            modal.style.display = 'block';
            document.body.classList.add('modal-open');

            
            // Инициализируем/пересоздаем Swiper
            if (modalSwiper) {
                modalSwiper.destroy();
            }
            modalSwiper = initModalSwiper();
            
            // Находим индекс текущего изображения
            const currentIndex = images.findIndex(img => img.src === item.querySelector('img').src);
            
            // Переключаем Swiper на нужный слайд
            modalSwiper.slideToLoop(currentIndex);

            closeBtn.style.zIndex = '1001';
        });
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

    // Обновление при ресайзе
    window.addEventListener('resize', function() {
        if (modalSwiper && modal.style.display === 'block') {
            modalSwiper.destroy();
            modalSwiper = initModalSwiper();
            
            // Сохраняем текущую позицию
            const activeIndex = modalSwiper.realIndex;
            modalSwiper.slideToLoop(activeIndex);
        }
    });

    const photoContainer = document.querySelector('.fullscreen-intro__photo-container');
    const cameraSound = document.getElementById('cameraSound');

    if (photoContainer) {
        setTimeout (() => {
            if (cameraSound) {
                cameraSound.play();
            }
            
            photoContainer.classList.add('flash-animate');

            setTimeout(() => {
                photoContainer.classList.remove('flash-animate');
                photoContainer.classList.add('show-image');
            }, 200);
    }, 200);
    };

    const menuLinks = document.querySelectorAll(".header__link[data-goto]");
    // Находим элементы для работы с меню
    const iconMenu = document.querySelector(".menu__icon"); // Иконка меню
    const menuBody = document.querySelector(".header__links"); // Тело меню
    const menuList = document.querySelector(".header__item"); // Список меню

    if (menuLinks.length > 0) {
        menuLinks.forEach((menuLink) => {
            menuLink.addEventListener("click", onMenuLinkClick);
        });

        // Функция для плавного перехода к нужному блоку при клике на ссылку меню
        function onMenuLinkClick(e) {
            const menuLink = e.target;
            if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
                const gotoBlock = document.querySelector(menuLink.dataset.goto); // Находим нужный блок
                const gotoBlockValue =
                    gotoBlock.getBoundingClientRect().top + // Расстояние до блока относительно окна
                    pageYOffset - // Текущий скролл страницы
                    document.querySelector("header").offsetHeight; // Учитываем высоту хедера

                if (iconMenu.classList.contains("_active")) { // Если меню открыто
                    closeMenu(); // Закрываем меню
                }

                window.scrollTo({
                    top: gotoBlockValue, // Скроллим к нужному блоку
                    behavior: "smooth", // Делаем плавную прокрутку
                });
                e.preventDefault(); // Отменяем стандартное поведение ссылки
            }
        }
    }

    

    // Функция для закрытия меню
    function closeMenu() {
        document.body.classList.remove("_lock"); // Убираем блокировку скролла страницы
        iconMenu.classList.remove("_active"); // Убираем активный класс с иконки меню
        menuBody.classList.remove("_active"); // Убираем активный класс с самого меню
        //menuList.classList.remove("_menu-anime"); // Убираем класс анимации
    }

    // Если иконка меню существует
    if (iconMenu) {
        // Добавляем обработчик клика на иконку меню
        iconMenu.addEventListener("click", function () {
            // Переключаем класс _lock для блокировки/разблокировки скролла
            document.body.classList.toggle("_lock");
            // Переключаем активный класс для иконки меню
            iconMenu.classList.toggle("_active");
            // Переключаем активный класс для тела меню
            menuBody.classList.toggle("_active");

            // Если меню открыто
            if (menuBody.classList.contains("_active")) {
                // Добавляем задержку для анимации пунктов меню
                setTimeout(() => {
                    menuList.classList.add("_menu-anime"); // Добавляем класс анимации
                }, 300); // Задержка 300 мс
            } else {
                // Если меню закрыто, убираем класс анимации
                menuList.classList.remove("_menu-anime");
            }
        });

        // Добавляем обработчик клика по документу для закрытия меню при клике вне его области
        document.addEventListener("click", function (e) {
            // Проверяем, открыто ли меню, и был ли клик вне меню и иконки
            if (
                menuBody.classList.contains("_active") && // Меню открыто
                !menuBody.contains(e.target) && // Клик не по меню
                !iconMenu.contains(e.target) // Клик не по иконке меню
            ) {
                closeMenu(); // Закрываем меню
            }
        });

    // Находим все секции на странице
    const sections = document.querySelectorAll("section");
    // Создаем IntersectionObserver для отслеживания видимости секций
    const observer = new IntersectionObserver(
        (entries) => {
            // Для каждой секции
            entries.forEach((entry) => {
                // Если секция видна и меню открыто
                if (entry.isIntersecting && menuBody.classList.contains("_active")) {
                    closeMenu(); // Закрываем меню
                }
            });
        },
        { threshold: 0.3 } // Секция считается видимой, если 30% её высоты в области видимости
    );

    // Начинаем отслеживать все секции
    sections.forEach((section) => observer.observe(section));
}

});