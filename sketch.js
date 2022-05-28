let buttonColour = '#c43535'
let spaceShip
let starAliens = []
let lasers = []
let asteroids = []
let showGameIntro = true
let gameIsStarted = false
let gameIsPaused = false
let gameIsOver = false
let showHowToPlay = false
let myCustomFont
let myArcadeFont
let laserSound
let newRecordSound
let score = 0
let highestScore = 0
let song
let songIsMuted = true

class SpaceShip {
    constructor() {
        this.x = 500
        this.y = 800
        this.xDir = 0
        this.damageArea = 10
        this.currentLaserType = 5
    }
    show() {
        fill('#707375')
        triangle(this.x, 900 - 170, this.x - 15,  this.y, this.x + 15, this.y)
        push()
        if (this.currentLaserType === 5) {
            fill('#56dfff')
        } else if (this.currentLaserType === 6) {
            fill('#ffbc61')
        } else if (this.currentLaserType === 7) {
            fill('#ff6352')
        } else if (this.currentLaserType === 8) {
            fill('#f850ff')
        }
        beginShape()
        triangle(this.x - 20, 900 - 140, this.x - 35,  this.y, this.x - 15, this.y)
        triangle(this.x + 20, 900 - 140, this.x + 15,  this.y, this.x + 35, this.y)
        endShape(CLOSE)
        pop()
    }
    move() {
        if (this.xDir === -1 && this.x >= 25) {
            this.x += this.xDir * 25
        } else if (this.xDir === 1 && this.x <= 975) {
            this.x += this.xDir * 25
        }
    }
    crashes(alien) {
        return dist(this.x, this.y, alien.x, alien.y) < this.damageArea + alien.r1
    }
    shoot() {
        laserSound.play()
        lasers.push(new Laser(this.x, this.y - 75, 30, 15, this.currentLaserType))
    }
    changeLaserType(keyCode) {
        if (keyCode === UP_ARROW) {
            if ([5, 6, 7].includes(spaceShip.currentLaserType)) {
                spaceShip.currentLaserType += 1
            } else (
                spaceShip.currentLaserType = 5
            )
        }
        if (keyCode === DOWN_ARROW) {
            if ([6, 7, 8].includes(spaceShip.currentLaserType)) {
                spaceShip.currentLaserType -= 1
            } else (
                spaceShip.currentLaserType = 8
            )
        }
    }
}

class StarAlien {
    constructor(x, y, r1, r2, p) {
        this.velocity = random(5, 15)
        this.xMovement = random(-2, 2)
        this.x = x
        this.y = y
        this.r1 = r1
        this.r2 = r2
        this.p = p
        this.hasToBeDeleted = false
    }
    show() {
        push()
        if (this.p === 5) {
            fill('#56dfff')
        } else if (this.p === 6) {
            fill('#ffbc61')
        } else if (this.p === 7) {
            fill('#ff6352')
        } else if (this.p === 8) {
            fill('#f850ff')
        }
        createStar(this.x, this.y, this.r1, this.r2, this.p)
        pop()
    }
    move() {
        this.y += this.velocity
        this.x += this.xMovement
    }
}

class Asteroid {
    constructor(x, y, r1, r2, p) {
        this.x = x
        this.y = y
        this.r1 = r1
        this.r2 = r2
        this.p = p
        this.velocity = random(5, 10)
    }
    show() {
        createStar(this.x, this.y, this.r1, this.r2, this.p)
    }
    move() {
        this.y += this.velocity
    }
}

class Laser {
    constructor(x, y, r1, r2, p) {
        this.x = x
        this.y = y
        this.r1 = r1
        this.r2 = r2
        this.p = p
        this.hasToBeDeleted = false
    }
    show() {
        push()
        if (this.p === 5) {
            fill('#56dfff')
        } else if (this.p === 6) {
            fill('#ffbc61')
        } else if (this.p === 7) {
            fill('#ff6352')
        } else if (this.p === 8) {
            fill('#f850ff')
        }
        createStar(this.x, this.y, this.r1, this.r2, this.p)
        pop()
    }
    move() {
        this.y -= 10
    }
    hits(alien) {
        if (this.p === alien.p) {
            return dist(this.x, this.y, alien.x, alien.y) < this.r1 + alien.r1
        }
    }
}

function preload() {
    myCustomFont = loadFont('justice.ttf')
    myArcadeFont = loadFont('arcade.ttf')
    laserSound = loadSound('laser.wav')
    newRecordSound = loadSound('new_record.wav')
    song = loadSound('soda_juego.mp3')
}

function setup() {
    createCanvas(1000, 1350)
    spaceShip = new SpaceShip()
    song.loop()
    song.pause()
}

function draw() {

    if (showHowToPlay) {
        background('#2b2b2b')

        push()
        textFont(myCustomFont)
        textSize(40)
        text('DO NOT LET THE STAR ALIENS HIT YOUR SPACESHIP', 5, 50)
        text('USE THE LEFT AND RIGHT ARROWS TO MOVE', 5, 100)
        text('THE STAR ALIENS CAN BE DEFEATED ONLY BY HITTING THEM', 5, 150)
        text('WITH A LASER OF THE SAME COLOUR', 5, 200)
        text('USE THE UP AND DOWN ARROWS TO CHANGE THE COLOUR OF', 5, 250)
        text('THE LASER', 5, 300)
        text('PRESS THE SPACE BAR TO SHOOT', 5, 350)
        text('BLUE ALIENS - FIFTY POINTS', 5, 400)
        text('YELLOW ALIENS - SIXTY POINTS', 5, 450)
        text('ORANGE ALIENS - SEVENTY POINTS', 5, 500)
        text('PINK ALIENS - EIGHTY POINTS', 5, 550)
        text('YOU GET ONE POINT IF YOU MANAGE TO DODGE AN ALIEN', 5, 600)
        text('PRESS M TO TURN OFF THE MUSIC', 5, 650)
        text('PRESS R TO RESET THE GAME', 5, 700)
        text('PRESS P TO PAUSE THE GAME', 5, 750)
        text('PRESS H TO GO BACK', 5, 800)
        pop()

        // Go back button:
        push()
        fill(buttonColour)
        rect(250, 912, 200, 100)
        pop()
        push()
        textSize(40)
        text('Go back', 305, 980)
        pop()
    } else if (showGameIntro) {
        background('#2b2b2b')
        for (let asteroid of asteroids) {
            asteroid.show()
            asteroid.move()
        }

        // Erase asteroids from the array to save memory.
        for (let a = 0; a < asteroids.length; a++) {
            if (asteroids[a].y > 900) {
                asteroids.splice(a, 1)
            }
        }

        if (frameCount % 1 === 0) {
            createAsteroids(1)
        }

        textFont(myCustomFont)
        fill(255)
        stroke(5)
        textSize(100)

        push()
        fill('#56dfff')
        text('S', 230, 475)
        pop()

        push()
        fill('#ffbc61')
        text('T', 275, 475)
        pop()

        push()
        fill('#ff6352')
        text('A', 320, 475)
        pop()

        push()
        fill('#f850ff')
        text('R', 370, 475)
        pop()

        push()
        fill('#f6fce9')
        text('*', 420, 475)
        pop()

        push()
        fill('#56dfff')
        text('A', 460, 475)
        pop()

        push()
        fill('#ff6352')
        text('L', 510, 475)
        pop()

        push()
        fill('#56dfff')
        text('I', 550, 475)
        pop()

        push()
        fill('#f850ff')
        text('E', 575, 475)
        pop()

        push()
        fill('#ff6352')
        text('N', 620, 475)
        pop()

        push()
        fill('#ffbc61')
        text('S', 670, 475)
        pop()


        push()
        textSize(40)
        text('PRESS S TO START A NEW GAME', 210, 540)
        text('PRESS H TO LEARN HOW TO PLAY', 205, 600)
        pop()

        // Start button:
        push()
        fill('#ba2b2b')
        rect(250, 912, 200, 100)
        pop()
        push()
        textSize(40)
        text('Start', 305, 980)
        pop()

        // How to play button:
        push()
        fill('#ba2b2b')
        rect(550, 912, 200, 100)
        pop()
        push()
        textSize(35)
        text('How to play', 560, 980)
        pop()

    } else if (gameIsPaused) {
        fill(255)
        stroke(5)
        push()
        textFont(myArcadeFont)
        textSize(50)
        text('PAUSED', 400, 475)
        pop()
    } else if (gameIsOver) {

        textFont(myCustomFont)
        fill(255)
        stroke(5)
        push()
        textSize(100)
        text('GAME OVER', 250, 475)
        pop()
        push()
        textSize(40)
        text('PRESS C TO CONTINUE', 309, 540)
        pop()

        if (highestScore < score) {
            newRecordSound.play()
            push()
            textFont(myCustomFont)
            textSize(40)
            fill('#ff0022')
            text('NEW HIGH SCORE', 353, 600)
            pop()
            highestScore = score
        }

        // Button to continue playing:
        push()
        fill(buttonColour)
        rect(450, 912, 100, 85, 10)
        pop()
        push()
        textFont(myCustomFont)
        textSize(50)
        fill('#ffffff')
        text('C', 488, 980)
        pop()

    } else if (gameIsStarted) {
        background('#2b2b2b')

        for (let asteroid of asteroids) {
            asteroid.show()
            asteroid.move()
        }

        spaceShip.show()
        spaceShip.move()

        // Erase asteroids from the array to save memory.
        for (let a = 0; a < asteroids.length; a++) {
            if (asteroids[a].y > 900) {
                asteroids.splice(a, 1)
            }
        }

        for (let laser of lasers) {
            laser.show()
            laser.move()
            for (let starAlien of starAliens) {
                if (laser.hits(starAlien)) {
                    if (starAlien.p === 5) {
                        score += 50
                    } else if (starAlien.p === 6) {
                        score += 60
                    } else if (starAlien.p === 7) {
                        score += 70
                    } else if (starAlien.p === 8) {
                        score += 80
                    }
                    laser.hasToBeDeleted = true
                    starAlien.hasToBeDeleted = true
                }
            }
        }

        for (let starAlien of starAliens) {
            starAlien.show()
            starAlien.move()
        }

        for (let l = 0; l < lasers.length; l++) {
            if (lasers[l].hasToBeDeleted) {
                lasers.splice(l, 1)
            }
        }

        for (let h = 0; h < starAliens.length; h++) {
            if (spaceShip.crashes(starAliens[h])) {
                gameIsOver = true
            }
            if (starAliens[h].hasToBeDeleted) {
                starAliens.splice(h, 1)
            }
        }

        // Erase lasers from the array to save memory.
        for (let l = 0; l < lasers.length; l++) {
            if (lasers[l].y < -50) {
                lasers.splice(l, 1)
            }
        }

        // Erase starAliens from the array to save memory.
        for (let s = 0; s < starAliens.length; s++) {
            if (starAliens[s].y > 900) {
                starAliens.splice(s, 1)
                score += 1
            }
        }

        push()
        fill('#56dfff')
        if (spaceShip.currentLaserType === 5) {
            strokeWeight(10)
            stroke('#1a00ff')
        }
        rect(50, 812, 75, 75)
        pop()

        push()
        fill('#ffbc61')
        if (spaceShip.currentLaserType === 6) {
            strokeWeight(10)
            stroke('#1a00ff')
        }
        rect(150, 812, 75, 75)
        pop()

        push()
        fill('#ff6352')
        if (spaceShip.currentLaserType === 7) {
            strokeWeight(10)
            stroke('#1a00ff')
        }
        rect(250, 812, 75, 75)
        pop()

        push()
        fill('#f850ff')
        if (spaceShip.currentLaserType === 8) {
            strokeWeight(10)
            stroke('#1a00ff')
        }
        rect(350, 812, 75, 75)
        pop()

        // Left button of the touch controller:
        push()
        fill(buttonColour)
        rect(50, 912, 175, 175, 20)
        pop()

        // Right button of the touch controller:
        push()
        fill(buttonColour)
        rect(250, 912, 175, 175, 20)
        pop()

        // Button to pause the game:
        push()
        fill(buttonColour)
        rect(450, 912, 100, 85, 10)
        pop()
        push()
        textFont(myCustomFont)
        textSize(50)
        fill('#ffffff')
        text('P', 488, 980)
        pop()

        // Change laser button of the touch controller:
        push()
        fill(buttonColour)
        rect(575, 912, 175, 175, 20)
        pop()

        // Shoot laser button of the touch controller:
        push()
        fill(buttonColour)
        rect(775, 912, 175, 175, 20)
        pop()

        if (frameCount % 50 === 0) {
            createStarAliens(random(-1, 1))
        }

        if (frameCount % 1 === 0) {
            createAsteroids(1)
        }

        fill(255)
        push()
        textFont(myArcadeFont)
        textSize(50)
        text(`HIGH  SCORE  ${highestScore}`, 550, 850)
        text(`YOUR  SCORE  ${score}`, 550, 880)
        pop()
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        spaceShip.xDir = -1
    } else if (keyCode === RIGHT_ARROW) {
        spaceShip.xDir = 1
    }

    if ([UP_ARROW, DOWN_ARROW].includes(keyCode)) {
        spaceShip.changeLaserType(keyCode)
    }

    if (keyCode === 32 && gameIsStarted && !gameIsOver) {  // shoot (Space bar)
        spaceShip.shoot()
    }

    if (keyCode === 80 && !showGameIntro && !gameIsOver) {  // pause the game (P)
        gameIsPaused = !gameIsPaused
        if (!songIsMuted) {
            if (gameIsPaused) {
                song.pause()
            } else {
                song.play()
            }
        }
    }

    if (keyCode === 67 && gameIsOver) {  // continue after game over (C)
        for (let s = 0; s < starAliens.length; s++) {
            starAliens.splice(s, 1)
            score = 0
        }
        gameIsOver = false
    }

    if (keyCode === 77) {  // mute/play song (M)
        song.isPlaying() ? song.pause() : song.play()
        songIsMuted = !songIsMuted
    }

    if (keyCode === 83 && showGameIntro && !gameIsOver) {  // start playing (S)
        showGameIntro = false
        gameIsStarted = true
    }

    if (keyCode === 82 && !showGameIntro && !gameIsOver && !gameIsPaused) {  // reset the game (R)
        showGameIntro = true
        if (score > highestScore) {
            highestScore = score
        }
        score = 0
        gameIsStarted = false
    }

    if (keyCode === 72 && !gameIsOver) {  // show how to play (H)
        showHowToPlay = !showHowToPlay
    }
}

function keyReleased() {
    if (keyCode !== 32) {
        spaceShip.xDir = 0
    }
}

function touchStarted() {
    if (gameIsStarted) {
        if (mouseX > 50 && mouseX < 225 && mouseY > 912 && mouseY < 1087) {  // Left button
            spaceShip.xDir = -1
        }
        if (mouseX > 250 && mouseX < 425 && mouseY > 912 && mouseY < 1087) {  // Right button
            spaceShip.xDir = 1
        }
        if (mouseX > 575 && mouseX < 750 && mouseY > 912 && mouseY < 1087) {  // Change laser button
            spaceShip.changeLaserType(UP_ARROW)
        }
        if (mouseX > 775 && mouseX < 950 && mouseY > 912 && mouseY < 1087) {  // Shoot button
            spaceShip.shoot()
        }
        if (mouseX > 450 && mouseX < 550 && mouseY > 912 && mouseY < 997 && !gameIsOver) {  // Pause game button
            gameIsPaused = !gameIsPaused
            if (!songIsMuted) {
                if (gameIsPaused) {
                    song.pause()
                } else {
                    song.play()
                }
            }
        }
    } else if (showGameIntro) {
        if (mouseX > 250 && mouseX < 450 && mouseY > 912 && mouseY < 1012) {  // Start button
            showGameIntro = false
            gameIsStarted = true
        }
        if (mouseX > 550 && mouseX < 750 && mouseY > 912 && mouseY < 1012) {  // How to play button
            showGameIntro = false
            showHowToPlay = true
        }
    } else if (showHowToPlay) {
        if (mouseX > 250 && mouseX < 450 && mouseY > 912 && mouseY < 1012) {  // Go back button
            showHowToPlay = false
            showGameIntro = true
        }
    }
    if (gameIsOver) {
        if (mouseX > 450 && mouseX < 550 && mouseY > 912 && mouseY < 997) {  // Continue playing button
            for (let s = 0; s < starAliens.length; s++) {
                starAliens.splice(s, 1)
                score = 0
            }
            gameIsOver = false
        }
    }
}

function touchEnded() {
    if (mouseX > 50 && mouseX < 225 && mouseY > 912 && mouseY < 1087) {  // Left button
        spaceShip.xDir = 0
    } else if (mouseX > 250 && mouseX < 425 && mouseY > 912 && mouseY < 1087) {  // Right button
        spaceShip.xDir = 0
    }
}

function createStar(x, y, outerRadius, innerRadius, numberOfPoints) {
    let fullAngle = TWO_PI / numberOfPoints
    let semiAngle = fullAngle/2.0
    beginShape()
    for (let i = 0; i < TWO_PI; i += fullAngle) {
        let line1 = x + cos(i) * innerRadius
        let line2 = y + sin(i) * innerRadius
        vertex(line1, line2)
        line1 = x + cos(i + semiAngle) * outerRadius
        line2 = y + sin(i + semiAngle) * outerRadius
        vertex(line1, line2)
    }
    endShape(CLOSE)
}

function createStarAliens(numberOfStarAliens) {
    for (let s = 0; s < numberOfStarAliens; s++) {
        let starAlien = new StarAlien(random(0, 1000), 0, 60, 30, getRandomInt(5, 8))
        starAliens.push(starAlien)
    }
}

function createAsteroids(numberOfAsteroids) {
    for (let a = 0; a < numberOfAsteroids; a++) {
        let asteroid = new Asteroid(random(0, 1000), 0, random(5,15), random(1,5), random(5,10))
        asteroids.push(asteroid)
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
