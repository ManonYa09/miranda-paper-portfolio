
    function is_touch_device() {
        try {
            return document.createEvent("TouchEvent"), !0;
        } catch (o) {
            return !1;
        }
    }
    if (!window.mirandaReducedMotion && !is_touch_device()) {
        function initSmoothScroll() {
            const el = document.querySelector("[data-scroll-container]")
            const isHorizontal = el.dataset.scrollDirection === 'horizontal'
            window.locomotive = new LocomotiveScroll({
                el,
                smooth: true,
                direction: isHorizontal ? 'horizontal' : 'vertical',
                gestureDirection: isHorizontal ? 'both' : 'vertical'
            })
        }

        document.addEventListener("DOMContentLoaded", function () {
            initSmoothScroll();
        });
    }
