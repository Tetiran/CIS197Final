// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application()


document.getElementById('pane').appendChild(app.view)

let sendScore = function sendScore(number) {
  //does nothing until defined
}

let updateScore = function updateScore(number) {
  //does nothing until defined
}
let speed = 4
let clock = 100 / 60
let last = 0
let current = 0
let gameOver = false
let asteroids = []
let score = 0
let asteroidTime = 10
let asteroidNext = 10
let collDist = 70


function testCollision(obj, ship) {
  return Math.sqrt(Math.pow(ship.position.x - obj.position.x, 2) + Math.pow(ship.position.y - obj.position.y, 2)) < collDist

}


app.loader.add('ship', '../Game/ship.png').add('asteroid', '../Game/asteroid.png').load((loader, resources) => {

  // This creates a texture from a 'ship.png' image
  const ship = new PIXI.Sprite(resources.ship.texture)

  // Setup the position of the ship
  ship.x = app.renderer.width / 2
  ship.y = app.renderer.height / 2

  // Rotate around the center
  ship.anchor.x = 0.5
  ship.anchor.y = 0.5

  // Add the ship to the scene we are building
  app.stage.addChild(ship)


  // Listen for frame updates
  app.ticker.add((delta) => {
    current += delta
    // only run at game clock speed
    if (current > last + clock && gameOver !== true) {
      score++
      updateScore(score)

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

      // move all the asteroids and check for collisions
      for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].rotation += asteroids[i].data.rspeed
        asteroids[i].position.x += Math.cos(asteroids[i].data.direction) * asteroids[i].data.speed
        asteroids[i].position.y += Math.sin(asteroids[i].data.direction) * asteroids[i].data.speed

        if (testCollision(asteroids[i], ship)) {
          // game over
          sendScore(score)
          gameOver = true
        }// remove asteroids if they are going off screen
        if (asteroids[i].position.x > 3 * app.renderer.width ||
          asteroids[i].position.x < -2 * app.renderer.width ||
          asteroids[i].position.y > 3 * app.renderer.height ||
          asteroids[i].position.y < -2 * app.renderer.height) {
          app.stage.removeChild(asteroids[i])
          asteroids.splice(i, 1)
        }
      }

      // spawn new asteroids
      asteroidNext--
      if (asteroidNext === 0) {
        if (asteroidTime > 5) {
          asteroidTime--
        }
        asteroidNext = asteroidTime
        let asteroid = new PIXI.Sprite(resources.asteroid.texture)

        asteroid.rotation = Math.random() * Math.PI * 2
        asteroid.data = {}
        asteroid.data.rspeed = Math.random() * .2
        asteroid.data.speed = Math.random() * 5 + 2
        asteroid.data.direction = Math.random() * Math.PI * 2
        asteroid.x = app.renderer.width / 2
        asteroid.y = app.renderer.height / 2

        asteroid.position.x = Math.cos(asteroid.rotation) * 1.1 * app.renderer.width
        asteroid.position.y += Math.sin(asteroid.rotation) * 1.1 * app.renderer.height

        asteroid.anchor.x = 0.5
        asteroid.anchor.y = 0.5

        app.stage.addChild(asteroid)
        asteroids.push(asteroid)
      }
    }
  })
})


// key events
let pkeys = []
window.onkeydown = function(e) {
  let code = e.keyCode ? e.keyCode : e.which
  pkeys[code] = true

}
window.onkeyup = function(e) {
  let code = e.keyCode ? e.keyCode : e.which
  pkeys[code] = false
}

// update scores and send post requests
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

  updateScore = function(score) {
    $('#score').html(score,
    )
  }

})

