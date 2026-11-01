if (!window.mirandaReducedMotion) {

    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(() => {
            if (!window.locomotive) return
            // prevent scroll durin appear animation
            window.locomotive.stop()

            setTimeout(() => {
                window.locomotive.update()
            }, 0)

            setTimeout(() => {
                window.locomotive.update()
                window.locomotive.start()
            }, 5000)
            // prevent scroll durin appear animation



        }, 0)
    })

}