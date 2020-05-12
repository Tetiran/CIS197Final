// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application()


document.getElementById('pane').appendChild(app.view)

let sendScore = function sendScore(number) {
  //does nothing until defined
}

let speed = 4
let clock = 100 / 60
let last = 0
let current = 0
let gameover= false;
// load the texture we need
app.loader.add('ship', '../Game/ship.png').load((loader, resources) => {

  // This creates a texture from a 'bunny.png' image
  const ship = new PIXI.Sprite(resources.ship.texture)

  // Setup the position of the bunny
  ship.x = app.renderer.width / 2
  ship.y = app.renderer.height / 2

  // Rotate around the center
  ship.anchor.x = 0.5
  ship.anchor.y = 0.5

  // Add the bunny to the scene we are building
  app.stage.addChild(ship)


  // Listen for frame updates
  app.ticker.add((delta) => {
    current += delta
    if (current > last + clock && gameover!==true) {
      last = current

      if (pkeys[65]) {
        ship.rotation += 0.1
      }
      if (pkeys[68]) {
        ship.rotation -= 0.1
      }
      ship.position.x += Math.cos(ship.rotation) * speed
      if (ship.position.x > app.renderer.width) {
        ship.position.x = app.renderer.width
      } else if (ship.position.x < 0) {
        ship.position.x = 0
      }
      ship.position.y += Math.sin(ship.rotation) * speed
      if (ship.position.y > app.renderer.height) {
        ship.position.y = app.renderer.height
      } else if (ship.position.y < 0) {
        ship.position.y = 0
      }
    }
  })
})


let pkeys = []
window.onkeydown = function(e) {
  let code = e.keyCode ? e.keyCode : e.which
  pkeys[code] = true

}
window.onkeyup = function(e) {
  let code = e.keyCode ? e.keyCode : e.which
  pkeys[code] = false
}

$(document).ready(function() {
  sendScore = function(score) {
    $.ajax({
      url: '/api/score/add',
      data: { score: score },
      type: 'POST',
      success: function(res) {
        console.log(res)
        $('.modal').css('display', 'none')
      },
    })
  }

})

