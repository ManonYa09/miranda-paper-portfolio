
    let toggle = false;
    let transition = false;

    function onNavClick(e) {
        // console.log('listener 1', transition)

        if (transition) return;
        toggle = !toggle;

        if (toggle) {
            // console.log('in menu')
            document.querySelector('nav.nav .menu').style.display = "flex"
            window.paperCurtainEffect.in();
        } else {
            // console.log('out menu')
            window.paperCurtainEffect.out();

            setTimeout(() => {
                document.querySelector('nav.nav .menu').style.display = "none"
            }, 400);
        }
    }

    function onWorkNavClick(e) {
        // console.log('listener 1', transition)

        if (transition) return;
        toggle = !toggle;

        if (toggle) {
            // console.log('in work nav')
            window.workPaperCurtainEffect.in();
        } else {
            // console.log('out work nav')
            window.workPaperCurtainEffect.out();
        }
    }

    document.querySelector(".nav-link").addEventListener("click", onNavClick);

    //Work page
    const navWorkPage = document.querySelector(".nav.work")
    if (navWorkPage) {
        navWorkPage.querySelector(".nav-block.r").addEventListener("click", onWorkNavClick);
    }

    const internalLinks = [...document.querySelectorAll("a")].filter((link) =>
        link.href.includes(document.location.host)
    );

    internalLinks.forEach((link) => {
        const href = link.href;

        // Work single page template, transition won't work for some reason so i'm disabling it on this button
        if (link.classList.contains('back-all')) return

        link.addEventListener(
            "click",
            async function (e) {
                let hrefPointer = location.href
                // console.log('listener 2', 'transition: ', transition, 'toggle: ', toggle)
                e.preventDefault();
                //debugger;
                if (transition) return;
                transition = true;
                //debugger;
                const color = link.getAttribute("data-color") || "#1D1D1B";
                const img = link.querySelector("[data-image]");
                let image = undefined;
                if (img) {
                    //debugger;
                    image = img.getAttribute("data-image");
                    //debugger;
                }

                if (toggle) {
                    //debugger;
                    // console.log('out')
                    if(navWorkPage){
                        window.workPaperCurtainEffect.curtain.setBackground(color, 1);
                        window.workPaperCurtainEffect.out();
                    }else{
                        window.paperCurtainEffect.curtain.setBackground(color, 1);
                        window.paperCurtainEffect.out();
                    }
                } else {
                    //debugger;
                    // console.log('in set image rotate')
                    window.paperCurtainEffect.curtain.setColor(color, 1);
                    window.paperCurtainEffect.curtain.uniforms.uHorizontal.value = 0
                    if (image) {
                        await window.paperCurtainEffect.curtain.setImage(image);
                    }

                    window.paperCurtainEffect.canvas.style.transform = "rotate(180deg)";
                    window.paperCurtainEffect.curtain.setInverted(true);
                    window.paperCurtainEffect.in();
                }

                // This is an attempt to fix bugs
                setTimeout(() => {
                    // console.log('transition false timeout')
                    transition = false
                    //   window.location.href = href;
                }, 1500);

                const nav = document.querySelector('nav.nav')
                let fadeEls

                const el = document.querySelector("[data-scroll-container]")
                const isHorizontal = el.dataset.scrollDirection === 'horizontal'

                if (toggle) {
                    // console.log('hide navbar toggle menu')
                    nav.classList.remove('hide') // fixes bug
                    if(navWorkPage){
                        fadeEls = navWorkPage.querySelectorAll(".nav-head, .nav-block, .menu-line, .paper-background")
                    }else{
                        fadeEls = nav.querySelectorAll(".nav-head, .nav-block, .menu-line, .paper-background")
                    }
                    if (nav || navWorkPage) {
                        fadeEls.forEach(el => { gsap.to(el, { opacity: 0, duration: 0.6, ease: Expo.easeOut }) })
                    } else {
                        console.warn('no navbar to hide')
                    }
                } else {
                    // console.log('hide navbar not menu')
                    if (nav) {
                        nav.querySelector('.gl-canvas').style.zIndex = '9999'
                    } else {
                        console.warn('no navbar to hide')
                    }
                }

                document.body.addEventListener(
                    "paper-curtain",
                    function (e) {
                        //debugger;
                        // console.log(href);
                        window.location.href = href;
                    },
                    { once: true }
                );

                setTimeout(() => {
                    //debugger;
                    // console.log('link timeout', href);
                    if (window.location.href === hrefPointer) return
                    window.location.href = href;
                }, 2500);
            }
        );
    });

