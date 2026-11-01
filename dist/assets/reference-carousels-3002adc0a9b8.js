
    document.addEventListener("DOMContentLoaded", function () {
        const sliders = butterSlider.autoInit()

        sliders[0].smoothAmount = 1
        sliders[0].setRelativePosition(window.innerWidth * (0.62 / sliders[0].dragSpeed))
        sliders[0].smoothAmount = 0.15
    })
