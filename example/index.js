import Muya from '../lib'

const container = document.querySelector('#editor')
const muya = new Muya(container)
window.muya = muya

muya.on('json-change', changes => console.log(JSON.stringify(changes, null, 2)))
