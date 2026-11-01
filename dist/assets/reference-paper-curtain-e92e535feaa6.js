
    import PaperCurtainEffect from "/assets/paper-curtain.mjs";

    const isMobile = window.innerWidth <= 991
    const isHorizontal = document.querySelector('[data-scroll-container]').dataset.scrollDirection === 'horizontal'

    const belowCanvas = document.querySelector("#below-canvas");
    const aboveCanvas = document.querySelector("#above-canvas");

    // console.log('canvas: ', aboveCanvas);
    // console.log('is Horizontal: ', isHorizontal && !isMobile)

    const paperCurtainEffect = new PaperCurtainEffect(aboveCanvas, {
        color: "#1D1D1B",
        background: "#000000",
        backgroundOpacity: 0,
        ease: "power3.inOut",
        duration: 2,
        texture:
            "/assets/14e41d7377-614f353f1e11a6a7afdd8b74_6059a3e2b9ae6d2bd508685c_pt-texture-2.jpg",
        amplitude: 0.25,
        rippedFrequency: 3.5,
        rippedAmplitude: 0.05,
        curveFrequency: 1,
        curveAmplitude: 0.1,
        rippedDelta: 1,
        rippedHeight: 0.07,
        horizontal: isHorizontal && !isMobile
    });

    // console.log('effect: ', paperCurtainEffect);

    window.paperCurtainEffect = paperCurtainEffect;

    if (window.location.href.includes('?')) { document.querySelector('#app')?.classList.add('appear') }
    if (window.location.pathname !== '/' && !window.location.pathname.includes('/work/') && !window.location.href.includes('?')) {
        window.belowPaperCurtainEffect = new PaperCurtainEffect(belowCanvas, {
            color: "#cdc6be",
            background: "#1D1D1B",
            backgroundOpacity: 1,
            ease: "power3.inOut",
            duration: 2,
            texture:
                "/assets/14e41d7377-614f353f1e11a6a7afdd8b74_6059a3e2b9ae6d2bd508685c_pt-texture-2.jpg",
            amplitude: 0.25,
            rippedFrequency: 3.5,
            rippedAmplitude: 0.05,
            curveFrequency: 1,
            curveAmplitude: 0.1,
            rippedDelta: 1,
            rippedHeight: 0.07,
            horizontal: false
        });

        //const image = document.querySelector("[data-image]")
        //if(image) {
        //  const src = image.getAttribute("data-image")
        //  window.belowPaperCurtainEffect.curtain.setImage(image)
        //}

        // console.log('in init')
        window.belowPaperCurtainEffect.in()
        const app = document.querySelector('#app')
        setTimeout(() => {
            app.classList.add('appear')
        }, 2000)
    }

    //Work page
    const navWorkPage = document.querySelector(".nav.work")
    if (navWorkPage) {
        const workCanvas = navWorkPage.querySelector('.gl-canvas canvas')
        window.workPaperCurtainEffect = new PaperCurtainEffect(workCanvas, {
            color: "#1D1D1B",
            background: "#000000",
            backgroundOpacity: 0,
            ease: "power3.inOut",
            duration: 2,
            texture:
                "/assets/14e41d7377-614f353f1e11a6a7afdd8b74_6059a3e2b9ae6d2bd508685c_pt-texture-2.jpg",
            amplitude: 0.25,
            rippedFrequency: 3.5,
            rippedAmplitude: 0.05,
            curveFrequency: 1,
            curveAmplitude: 0.1,
            rippedDelta: 1,
            rippedHeight: 0.07,
            horizontal: isHorizontal && !isMobile
        });
    }
