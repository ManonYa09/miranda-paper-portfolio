
    function setPathnameClass() {
        const regex = /(?<=work\/).*$/gm;
        const match = regex.exec(window.location.pathname)
        if (!match) return
        document.querySelector('body').classList.add(match[0])
    }
    setPathnameClass()
