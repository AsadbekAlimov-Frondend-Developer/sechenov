// Header dropdown functionality
$(document).ready(function () {



    $('.header__menu-item').each(function () {
        const $item = $(this);
        const $dropdown = $item.find('.header__dropdown');

        // Agar dropdown topilmasa, keyingisiga o'tish
        // if (!$dropdown.length) return;

        $item.hover(
            function () {
                // Boshqa ochiq dropdown'larni yopish
                $('.header__menu-item').not($(this)).removeClass('show');
                $(this).addClass('show')
                $('.header__nav').css('--dropdown-height', '0px');

                // Height olish uchun vaqtincha ko'rsatish
                $dropdown.css({
                    display: 'block',
                    visibility: 'hidden',
                    position: 'absolute',
                    opacity: 0
                });

                const dropdownHeight = $dropdown.outerHeight() + 40;

                // Normal holatga qaytarish va animatsiya
                $dropdown.css({
                    display: 'none',
                    visibility: 'visible',
                    position: '',
                    opacity: 1
                });

                $('.header__nav').css('--dropdown-height', dropdownHeight + 'px');
            }
        );

        $item.on('mouseleave', function (e) {
            $('.header__menu-item').removeClass('show');
        })

    });

    $('body').on('mouseover', function (e) {

        if ($(e.target).parents('.header__menu').length < 1) {
            $('.header__nav').css('--dropdown-height', '0px');
        }
    });
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileMenu = document.getElementById('closeMobileMenu');

    // Element mavjudligini tekshirish
    if (!mobileToggle || !mobileMenu) {
        console.warn('Mobile menu elementlari topilmadi');
        return;
    }

    // Mobile menu ochish funksiyasi
    function openMobileMenu() {
        mobileToggle.classList.add('active');
        mobileMenu.classList.add('active');

        // Accessibility uchun
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileToggle.setAttribute('aria-expanded', 'true');
    }

    // Mobile menu yopish funksiyasi
    function closeMobileMenuFunc() {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';

        // Accessibility uchun
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');

        // Barcha dropdown'larni yopish
        const activeItems = document.querySelectorAll('.header_mobile-menu__item.active');
        activeItems.forEach(item => item.classList.remove('active'));
    }

    // Toggle button event
    mobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenuFunc();
        } else {
            openMobileMenu();
        }
    });

    // Close button event (agar mavjud bo'lsa)
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenuFunc();
        });
    }

    // Tashqarida bosishda yopish
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenuFunc();
        }
    });

    // ESC tugmasini bosishda yopish
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenuFunc();
        }
    });

    // Mobile dropdown functionality
    const mobileDropdownToggles = document.querySelectorAll('[data-toggle]');

    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const targetId = toggle.getAttribute('data-toggle');
            const target = document.getElementById(targetId);
            const parentItem = toggle.closest('.header_mobile-menu__item');

            if (!parentItem || !target) {
                console.warn('Mobile dropdown elementi topilmadi:', targetId);
                return;
            }

            const isActive = parentItem.classList.contains('active');

            // Boshqa barcha dropdown'larni yopish
            mobileDropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    const otherParent = otherToggle.closest('.header_mobile-menu__item');
                    if (otherParent) {
                        otherParent.classList.remove('active');
                        const otherIcon = otherToggle.querySelector('.dropdown-icon');
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                }
            });

            // Joriy dropdown'ni toggle qilish
            parentItem.classList.toggle('active');

            // Icon animatsiyasi (agar mavjud bo'lsa)
            const icon = toggle.querySelector('.dropdown-icon');
            if (icon) {
                icon.style.transform = parentItem.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }

            // Accessibility
            const expanded = parentItem.classList.contains('active');
            toggle.setAttribute('aria-expanded', expanded.toString());
            target.setAttribute('aria-hidden', (!expanded).toString());
        });
    });
});

// Modal functionality (Bootstrap bilan ishlash uchun yaxshilangan)
document.addEventListener('DOMContentLoaded', function () {
    const consultationModal = document.getElementById('consultationModal');

    if (consultationModal) {
        // Modal ochilganda
        consultationModal.addEventListener('show.bs.modal', function (e) {
            console.log('Modal ochilmoqda');

            // Mobile menu yopish (agar ochiq bo'lsa)
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileToggle = document.getElementById('mobileToggle');

            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.classList.remove('active');
                }
            }

            // Form reset qilish (agar form bo'lsa)
            const form = consultationModal.querySelector('form');
            if (form) {
                form.reset();
                // Validation classlarini tozalash
                form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                    el.classList.remove('is-valid', 'is-invalid');
                });
            }
        });

        // Modal yopilganda
        consultationModal.addEventListener('hide.bs.modal', function (e) {
            console.log('Modal yopilmoqda');
        });

        // Modal to'liq yopilganda
        consultationModal.addEventListener('hidden.bs.modal', function (e) {
            // Focus'ni qaytarish
            const trigger = document.querySelector('[data-bs-toggle="modal"][data-bs-target="#consultationModal"]');
            if (trigger) {
                trigger.focus();
            }
        });

        // Form submission (agar form bo'lsa)
        const form = consultationModal.querySelector('form');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                // Basic validation
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');

                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('is-invalid');
                        field.classList.add('is-valid');
                    }
                });

                if (isValid) {
                    // Form ma'lumotlarini yuborish
                    console.log('Form yuborilmoqda...');

                    // Bu yerda AJAX so'rov yoki boshqa amallarni bajarish mumkin
                    // Masalan:
                    // submitForm(new FormData(form));

                    // Modal yopish
                    const modal = bootstrap.Modal.getInstance(consultationModal);
                    modal.hide();

                    // Success message
                    alert('So\'rov muvaffaqiyatli yuborildi!');
                }
            });
        }
    }

    // Barcha modal triggerlar uchun
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            // Loading holatini ko'rsatish (agar kerak bo'lsa)
            const targetModal = document.querySelector(this.getAttribute('data-bs-target'));
            if (targetModal) {
                // Modal ochilishdan oldin ba'zi amallar
                console.log('Modal ochilish uchun trigger bosildi');
            }
        });
    });
});

// Global event handlers (IIFE ichida o'ralgan)
(function () {
    // Scroll event uchun optimizatsiya
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Header sticky qilish uchun
            const header = document.querySelector('.header');
            if (header) {
                if (scrollTop > 100) {
                    header.classList.add('header--scrolled');
                } else {
                    header.classList.remove('header--scrolled');
                }
            }
        }, 10);
    });

    // Resize event optimizatsiyasi
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Desktop'da mobile menu yopish
            if (window.innerWidth > 991) {
                const mobileMenu = document.getElementById('mobileMenu');
                const mobileToggle = document.getElementById('mobileToggle');

                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    if (mobileToggle) {
                        mobileToggle.classList.remove('active');
                    }
                    document.body.style.overflow = '';
                }
            }
        }, 250);
    });
})();

// ========================================================================specialists-section====
// Initialize Swiper for mobile
if (window.innerWidth <= 768) {
    const swiper = new Swiper('.specialists-swiper', {
        slidesPerView: 1.1,
        spaceBetween: 0,
    });
}

// ================================================================ vrach page Отзывы section

document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        grabCursor: true,

        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 24,
            },
            640: {
                slidesPerView: 1,
                spaceBetween: 24,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 32,
            },
            1024: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
        },

        navigation: {
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
        },

        
    });
});