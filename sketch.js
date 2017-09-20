var spaceShip;
var starAliens = [];
var lasers = [];
var asteroids = [];
var currentLaser = 5;

function setup() {
    createCanvas(1000, 900);
    // any additional setup code goes here
    spaceShip = new SpaceShip();
}

function draw() {
    background(100);
    spaceShip.show();
    spaceShip.move();

    for (var l = 0; l < lasers.length; l++) {
        lasers[l].show();
        lasers[l].move();
        for (var h = 0; h < starAliens.length; h++) {
            if (lasers[l].hits(starAliens[h])) {
                lasers.splice(l, 1);
                starAliens.splice(h, 1);
            }
        }
    }

    // Erase lasers from the array to save memory.
    for (var l = 0; l < lasers.length; l++) {
        if (lasers[l].getY() < -50) {
            lasers.splice(l, 1);
        }
    }

    for (var a = 0; a < asteroids.length; a++) {
        asteroids[a].show();
        asteroids[a].move();
    }

    // Erase asteroids from the array to save memory.
    for (var a = 0; a < asteroids.length; a++) {
        if (asteroids[a].getY() > 1200) {
            asteroids.splice(a, 1);
        }
    }

    for (var s = 0; s < starAliens.length; s++) {
        starAliens[s].show();
        starAliens[s].move();
    }

    // Erase starAliens from the array to save memory.
    for (var s = 0; s < starAliens.length; s++) {
        if (starAliens[s].getY() > 1200) {
            starAliens.splice(s, 1);
        }
    }

    if (frameCount % 50 === 0) {
        starAlienGenerator(random(-1,1));
    }

    if (frameCount % 1 === 0) {
        asteroidsGenerator(1);
    }

}

function SpaceShip() {
    this.x = 500;
    this.y = height - 100;
    this.xDir = 0;

    this.show = function () {
        push();
        if (currentLaser === 5) {
            fill('#56dfff');
        } else if (currentLaser === 6) {
            fill('#ffbc61');
        } else if (currentLaser === 7) {
            fill('#ff6352');
        } else if (currentLaser === 8) {
            fill('#f850ff');
        }
        triangle(this.x, height - 170, this.x - 15,  this.y, this.x + 15, this.y);
        pop();
    };

    this.move = function () {
        this.x += this.xDir * 25;
    };

    this.setDir = function (dir) {
        this.xDir = dir;
    }
}

function StarAlien(x, y, r1, r2, p) {
    this.x = x;
    this.y = y;
    this.r1 = r1;
    this.r2 = r2;
    this.p = p;
    this.velocity = random(5, 15);
    
    this.show = function () {
        push();
        if (this.p === 5) {
            fill('#56dfff');
        } else if (this.p === 6) {
            fill('#ffbc61');
        } else if (this.p === 7) {
            fill('#ff6352');
        } else if (this.p === 8) {
            fill('#f850ff');
        }
        starMaker(this.x, this.y, this.r1, this.r2, this.p);
        pop();
    };

    this.move = function () {
        this.y += this.velocity;
    };

    this.getY = function () {
        return this.y;
    };
}

function Asteroid(x, y, r1, r2, p) {
    this.x = x;
    this.y = y;
    this.r1 = r1;
    this.r2 = r2;
    this.p = p;
    this.velocity = random(5, 10);

    this.show = function () {
        starMaker(this.x, this.y, this.r1, this.r2, this.p);
    };

    this.move = function () {
        this.y += this.velocity;
    };

    this.getY = function () {
        return this.y;
    };
}

function Laser(x, y, r1, r2, p) {
    this.x = x;
    this.y = y;
    this.r1 = r1;
    this.r2 = r2;
    this.p = p;

    this.show = function () {
        push();
        if (this.p === 5) {
            fill('#56dfff');
        } else if (this.p === 6) {
            fill('#ffbc61');
        } else if (this.p === 7) {
            fill('#ff6352');
        } else if (this.p === 8) {
            fill('#f850ff');
        }
        starMaker(this.x, this.y, this.r1, this.r2, this.p);
        pop();
    };

    this.move = function () {
        this.y -= 10;
    };

    this.getY = function () {
        return this.y;
    };
    
    this.hits = function (alien) {
        if (this.p === alien.p) {
            var d = dist(this.x, this.y, alien.x, alien.y);
            return d < this.r1 + alien.r1;
        }
    }
}


function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        // if (spaceShip.x > 50) {
        //     print(spaceShip.x);
            spaceShip.setDir(-1);
        // }
    } else if (keyCode === RIGHT_ARROW) {
        // if (spaceShip.x < 1000) {
            spaceShip.setDir(1);
        // }
    }

    if (keyCode === 32) {
        var laser = new Laser(spaceShip.x, spaceShip.y, 30, 15, currentLaser);
        lasers.push(laser);
    }

    if (keyCode === UP_ARROW) {
        if (currentLaser === 5) {
            currentLaser = 6;
        } else if (currentLaser === 6) {
            currentLaser = 7;
        } else if (currentLaser === 7) {
            currentLaser = 8;
        } else {
            currentLaser = 5;
        }
    }

    if (keyCode === DOWN_ARROW) {
        if (currentLaser === 5) {
            currentLaser = 8;
        } else if (currentLaser === 6) {
            currentLaser = 5;
        } else if (currentLaser === 7) {
            currentLaser = 6;
        } else {
            currentLaser = 7;
        }
    }
}

function keyReleased() {
    if (keyCode !== 32) {
        spaceShip.setDir(0);
    }
}

function starMaker(x, y, outerRadius, innerRadius, numberOfPoints) {

    var fullAngle = TWO_PI / numberOfPoints;
    var semiAngle = fullAngle/2.0;

    beginShape();
    for (var i = 0; i < TWO_PI; i += fullAngle) {
        var line1 = x + cos(i) * innerRadius;
        var line2 = y + sin(i) * innerRadius;
        vertex(line1, line2);
        line1 = x + cos(i+semiAngle) * outerRadius;
        line2 = y + sin(i+semiAngle) * outerRadius;
        vertex(line1, line2);
    }
    endShape(CLOSE);
}

function starAlienGenerator(numberOfStarAliens) {
    for (var s = 0; s < numberOfStarAliens; s++) {
        var starAlien = new StarAlien(random(0, 1000), 0, 60, 30, getRandomInt(5, 8));
        starAliens.push(starAlien);
    }
}

function asteroidsGenerator(numberOfAsteroids) {
    for (var a = 0; a < numberOfAsteroids; a++) {
        var asteroid = new Asteroid(random(0, 1000), 0, random(5,15), random(1,5), random(5,10));
        asteroids.push(asteroid);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
