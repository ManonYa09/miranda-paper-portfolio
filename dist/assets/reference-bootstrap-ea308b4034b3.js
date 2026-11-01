
// brands accordions
document.addEventListener("DOMContentLoaded", function () {
	const brands = [...document.querySelectorAll('.brand-item')]
  	.map((element)=>{
  		return {
      	element,
      	link: element.querySelector('.brand-inner'),
        wrap: element.querySelector('.book-wrap')
      }
  	})
    
  brands.forEach(({ link,element,wrap })=>{
  	link.addEventListener('click', ()=>{

    	//brands.forEach(({element})=>{
        // close all
      	// element.classList.remove('open')
      //})
    	const toggle = element.classList.toggle('open')
      wrap.addEventListener('transitionend',()=>{
      	
      	window.locomotive?.update()
      },{once:true})

      if(toggle) window.locomotive?.scrollTo(element,{offset: -122})
    })
  })
})

