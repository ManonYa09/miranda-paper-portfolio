if (!window.mirandaReducedMotion) {

    window.scrollTo(0, 0)
		if(window.innerWidth >= 768){
      document.documentElement.classList.add('no-scroll')

      setTimeout(() => {
          const nav = document.querySelector('nav.nav').style.removeProperty('transform')
          document.documentElement.classList.remove('no-scroll')
      }, 5000)
		}

}