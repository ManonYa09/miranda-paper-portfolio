
    //Content Reflow
    [...document.querySelectorAll('.aw1-title')]
    .forEach((element) => {
        element.addEventListener('click', () => {

            setTimeout(() => {
                window.locomotive?.update()
            }, 500)
        })
    })
