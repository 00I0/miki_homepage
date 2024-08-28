document.addEventListener("DOMContentLoaded", function () {
    // Helper function to get attribute value or use default
    function getOrDefault(element, attribute, defaultValue) {
        let value = element.getAttribute(attribute);
        return value !== null ? value : defaultValue;
    }

    // Function to initialize Lottie animations
    function initializeLottieAnimation(element) {
        let animationPath = element.getAttribute('lottie-path');
        let loop = getOrDefault(element, 'lottie-loop', 'true') === 'true';
        let autoplay = getOrDefault(element, 'lottie-autoplay', 'false') === 'true';
        let hover = getOrDefault(element, 'lottie-hover', 'true') === 'true';
        let speed = parseFloat(getOrDefault(element, 'lottie-speed', '1.0'));

        // Initialize Lottie animation
        let animation = lottie.loadAnimation({
            container: element,
            renderer: 'svg',
            loop: loop,
            autoplay: autoplay,
            path: animationPath
        });

        animation.setSpeed(speed);

        element.lottieAnimation = animation;

        return {element, hover};
    }

    // Find all elements with the 'lottie' class and initialize animations
    let lottieElements = document.querySelectorAll('.lottie');
    let hoverElements = [];

    lottieElements.forEach(function (element) {
        let animationData = initializeLottieAnimation(element);

        // If hover is enabled, add to hoverElements for potential parent hover handling
        if (animationData.hover) {
            hoverElements.push(animationData.element);
        }
    });

    // Check for parent elements with the .lottie-hover-target class
    hoverElements.forEach(function (element) {
        let parent = element.closest('.lottie-hover-target');

        if (parent) {
            parent.addEventListener('mouseenter', function () {
                hoverElements.forEach(function (el) {
                    if (el.closest('.lottie-hover-target') === parent) {
                        el.lottieAnimation.play();
                    }
                });
            });

            parent.addEventListener('mouseleave', function () {
                hoverElements.forEach(function (el) {
                    if (el.closest('.lottie-hover-target') === parent) {
                        el.lottieAnimation.stop();
                    }
                });
            });
        } else {
            // If no parent with .lottie-hover-target, attach hover to element itself
            element.addEventListener('mouseenter', function () {
                element.lottieAnimation.play();
            });
            element.addEventListener('mouseleave', function () {
                element.lottieAnimation.stop();
            });
        }
    });
});
