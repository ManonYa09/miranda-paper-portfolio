
    //Content Reflow
    [...document.querySelectorAll('.aw1-title')]
    .forEach((element) => {
        element.addEventListener('click', () => {
	        	console.log('listener awl title')
            setTimeout(() => {
                window.locomotive.update()
            }, 500)
        })
    })
