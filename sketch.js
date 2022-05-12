let spaceShip
let starAliens = []
let lasers = []
let asteroids = []
let currentLaser = 5
let gameIsStarted = true
let gameIsPaused = false
let gameIsOver = false
let seeGameInstructions = false
let myCustomFont
let myArcadeFont
let laserSound
let newRecordSound
let score = 0
let highestScore = 0
let song

class SpaceShip {
    constructor() {
        this.x = 500
        this.y = height - 100
        this.xDir = 0
        this.damageArea = 10
    }
    show() {
        fill('#707375')
        triangle(this.x, height - 170, this.x - 15,  this.y, this.x + 15, this.y)
        push()
        if (currentLaser === 5) {
            fill('#56dfff')
        } else if (currentLaser === 6) {
            fill('#ffbc61')
        } else if (currentLaser === 7) {
            fill('#ff6352')
        } else if (currentLaser === 8) {
            fill('#f850ff')
        }
        beginShape()
        triangle(this.x - 20, height - 140, this.x - 35,  this.y, this.x - 15, this.y)
        triangle(this.x + 20, height - 140, this.x + 15,  this.y, this.x + 35, this.y)
        endShape(CLOSE)
        pop()
    }
    move() {
        this.x += this.xDir * 25
    }
    setDir(dir) {
        this.xDir = dir
    }
    crashes(alien) {
        return dist(this.x, this.y, alien.x, alien.y) < this.damageArea + alien.r1
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
    getY() {
        return this.y
    }
    setToDelete() {
        this.hasToBeDeleted = true
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
    getY() {
        return this.y
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
    getY() {
        return this.y
    }
    setToDelete() {
        this.hasToBeDeleted = true
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
    createCanvas(1000, 900)
    spaceShip = new SpaceShip()
    song.loop()
}

function draw() {

    if (seeGameInstructions) {

        background('#2b2b2b')

        push()
        textFont(myCustomFont)
        textSize(40)
        text('DO NOT LET THE STAR ALIENS TOUCH YOUR SPACESHIP', 5, 50)
        text('USE THE LEFT AND RIGHT ARROWS TO MOVE', 5, 100)
        text('THE STAR ALIENS CAN BE DEFEATED ONLY SHOOTING A', 5, 150)
        text('LASER OF THE SAME COLOUR', 5, 200)
        text('USE THE UP AND DOWN ARROWS TO CHANGE THE COLOUR OF', 5, 250)
        text('THE LASER', 5, 300)
        text('PRESS THE SPACE BAR TO SHOOT A LASER', 5, 350)
        text('BLUE ALIENS ARE WORTH FIFTY POINTS', 5, 400)
        text('YELLOW ALIENS ARE WORTH SIXTY POINTS', 5, 450)
        text('ORANGE ALIENS ARE WORTH SEVENTY POINTS', 5, 500)
        text('PINK ALIENS ARE WORTH EIGHTY POINTS', 5, 550)
        text('YOU RECEIVE ONE POINT IF THE ALIEN DOES NOT HIT YOU', 5, 600)
        text('PRESS M TO TURN OFF THE MUSIC', 5, 650)
        text('PRESS R TO RESET THE GAME', 5, 700)
        text('PRESS P TO PAUSE THE GAME', 5, 750)
        text('PRESS I TO GO BACK', 5, 800)
        pop()

    } else if (gameIsStarted) {

        background('#2b2b2b')
        for (let asteroid of asteroids) {
            asteroid.show()
            asteroid.move()
        }

        // Erase asteroids from the array to save memory.
        for (let a = 0; a < asteroids.length; a++) {
            if (asteroids[a].getY() > 1200) {
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
        text('PRESS I TO SEE THE INSTRUCTIONS', 195, 600)
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

    } else {
        background('#2b2b2b')

        for (let asteroid of asteroids) {
            asteroid.show()
            asteroid.move()
        }

        spaceShip.show()
        spaceShip.move()

        // Erase asteroids from the array to save memory.
        for (let a = 0; a < asteroids.length; a++) {
            if (asteroids[a].getY() > 1200) {
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
                    laser.setToDelete()
                    starAlien.setToDelete()
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
            if (lasers[l].getY() < -50) {
                lasers.splice(l, 1)
            }
        }

        // Erase starAliens from the array to save memory.
        for (let s = 0; s < starAliens.length; s++) {
            if (starAliens[s].getY() > 1200) {
                starAliens.splice(s, 1)
                score += 1
            }
        }

        push()
        fill('#56dfff')
        if (currentLaser === 5) {
            strokeWeight(10)
            stroke('#1a00ff')
        }
        rect(50, 812, 75, 75)
        pop()

        push()
        fill('#ffbc61')
        if (currentLaser === 6) {
            strokeWeight(10)
            stroke('#1a00ff')
        }
        rect(150, 812, 75, 75)
        pop()

        push()
        fill('#ff6352')
        if (currentLaser === 7) {
            strokeWeight(10)
            stroke('#1a00ff')
        }
        rect(250, 812, 75, 75)
        pop()

        push()
        fill('#f850ff')
        if (currentLaser === 8) {
            strokeWeight(10)
            stroke('#1a00ff')
        }
        rect(350, 812, 75, 75)
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
        text('HIGH  SCORE  ' + highestScore, 550, 850)
        text('YOUR  SCORE  ' + score, 550, 880)
        pop()
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        // if (spaceShip.x > 50) {
        //     print(spaceShip.x)
            spaceShip.setDir(-1)
        // }
    } else if (keyCode === RIGHT_ARROW) {
        // if (spaceShip.x < 1000) {
            spaceShip.setDir(1)
        // }
    }

    if (keyCode === 32 && !gameIsOver && !gameIsPaused && !gameIsStarted) {
        laserSound.play()
        let laser = new Laser(spaceShip.x, spaceShip.y, 30, 15, currentLaser)
        lasers.push(laser)
    }

    if (keyCode === 80 && !gameIsStarted && !gameIsOver) {
        if (!gameIsPaused) {
            gameIsPaused = true
            song.pause()
        } else {
            gameIsPaused = false
            song.play()
        }
    }

    if (keyCode === UP_ARROW) {
        if (currentLaser === 5) {
            currentLaser = 6
        } else if (currentLaser === 6) {
            currentLaser = 7
        } else if (currentLaser === 7) {
            currentLaser = 8
        } else {
            currentLaser = 5
        }
    }

    if (keyCode === DOWN_ARROW) {
        if (currentLaser === 5) {
            currentLaser = 8
        } else if (currentLaser === 6) {
            currentLaser = 5
        } else if (currentLaser === 7) {
            currentLaser = 6
        } else {
            currentLaser = 7
        }
    }

    if (keyCode === 67 && gameIsOver) {
        for (let s = 0; s < starAliens.length; s++) {
            starAliens.splice(s, 1)
            score = 0
        }
        gameIsOver = false
    }

    if (keyCode === 77) {
        if (song.isPlaying()) {
            song.pause()
        } else {
            song.play()
        }
    }

    if (keyCode === 83 && gameIsStarted && !gameIsOver) {
        gameIsStarted = false
    }
    // reset the game
    if (keyCode === 82 && !gameIsStarted && !gameIsOver && !gameIsPaused) {
        gameIsStarted = true
        if (score > highestScore) {
            highestScore = score
        }
        score = 0
    }

    // see the instructions (i)
    if (keyCode === 73 && !gameIsOver) {
        seeGameInstructions = !seeGameInstructions
    }
}

function keyReleased() {
    if (keyCode !== 32) {
        spaceShip.setDir(0)
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
        line1 = x + cos(i+semiAngle) * outerRadius
        line2 = y + sin(i+semiAngle) * outerRadius
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
