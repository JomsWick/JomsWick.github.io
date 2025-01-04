function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const phrases = ["Web Developer", "Web Designer", "UI/UX Designer", "Graphic Designer"];
const $element = $("#text");

let sleepTime = 100;
let currentPhraseIndex = 0;

const writeLoop = async () => {
    while (true) {
        let currentWord = phrases[currentPhraseIndex];

        for (let i = 0; i < currentWord.length; i++) {
            $element.text(currentWord.substring(0, i + 1));
            await sleep(sleepTime);
        }

        await sleep(sleepTime * 10);

        for (let i = currentWord.length; i > 0; i--) {
            $element.text(currentWord.substring(0, i - 1));
            await sleep(sleepTime);
        }

        await sleep(sleepTime * 5);

        if (currentPhraseIndex === phrases.length - 1) {
            currentPhraseIndex = 0;
        } else {
            currentPhraseIndex++;
        }
    }
};

writeLoop();

let $menuIcon = $('#menu-icon');
let $navbar = $('.navbar');

$menuIcon.on('click', () => {
    $menuIcon.toggleClass('bx-x');
    $navbar.toggleClass('active');
});

let $sections = $('section');
let $navLinks = $('header nav a');

$(window).on('scroll', () => {
    $sections.each((index, sec) => {
        let $sec = $(sec);
        let top = $(window).scrollTop();
        let offset = $sec.offset().top - 150;
        let height = $sec.outerHeight();
        let id = $sec.attr('id');

        if (top >= offset && top < offset + height) {
            $navLinks.removeClass('active');
            $('header nav a[href*=' + id + ']').addClass('active');
        }
    });

    let $header = $('header');
    $header.toggleClass('sticky', $(window).scrollTop() > 100);

    $menuIcon.removeClass('bx-x');
    $navbar.removeClass('active');
});

$(document).ready(function() {
    ScrollReveal({
        distance: '80px',
        duration: 2000,
        delay: 200
    });

    ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
    ScrollReveal().reveal('.home-img, .skills-container, .portfolio-box, .contact-form', { origin: 'bottom' });
    ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
    ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });
    
});

document.addEventListener('DOMContentLoaded', function() {
    emailjs.init("DiYCwEJYiCo_dglXd");

    var modal = document.getElementById('modal');
    var closeButton = document.getElementsByClassName('close-button')[0];
    var modalMessage = document.getElementById('modal-message');
    var contactForm = document.getElementById('contact-form');

    document.getElementById('contact-form').addEventListener('submit', function(event) {
        console.log("Form submit handler triggered");
        event.preventDefault();

        emailjs.sendForm('service_z5we367', 'template_dl5rauw', this)
            .then(function(response) {
                console.log('Message sent successfully:', response);
                modalMessage.textContent = "Your message has been sent!";
                modal.classList.add('show');

                setTimeout(function() {
                    modal.classList.remove('show');
                    contactForm.reset();
                }, 3000); 
            }, function(error) {
                console.log('Error sending message:', error);
                modalMessage.textContent = "There was an error sending your message. Please try again.";
                modal.classList.add('show');

                setTimeout(function() {
                    modal.classList.remove('show');
                    contactForm.reset();
                }, 3000);
            });
    });

    closeButton.addEventListener('click', function() {
        modal.classList.remove('show');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
});
