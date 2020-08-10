const startDisplay = document.querySelector('.start');
const startGame = document.querySelector('#startGame')
const main = document.querySelector('.main');
const end = document.querySelector('.end');
const span = document.querySelector('span');
const restart = document.querySelector('#restart');
const replay = document.querySelector('#replay');

const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 600;
canvas.style.backgroundColor = "black";
let startTime = new Date().getTime();
class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.shadowBlur = this.radius;
        c.shadowColor = this.color;
        c.fill();
    }

    collision(ball) {
        return Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)) < (this.radius + ball.radius);
    }

}

class Boss extends Circle {
    constructor(x, y, radius, color, text, score) {
        super(x, y, radius, color);
        this.text = text;
        this.score = score;
        this.direction = 'right';
    }
    draw() {
        super.draw();
        c.fillStyle = 'red';
        c.font = '10px Arial';
        c.fillText(this.text, this.x - 10, this.y + 2);
        c.beginPath();
        c.fillStyle = 'white';
        c.font = '20px Arial';
        c.fillText(this.score.toString(), 10, canvas.height - 20);
    }

    update() {
        if (this.x + this.radius > canvas.width)
            this.direction = 'left';
        else if (this.x - this.radius < 0)
            this.direction = 'right';
        else if (this.y + this.radius > canvas.height)
            this.direction = 'up';
        else if (this.y - this.radius < 0)
            this.direction = 'down';
        switch (this.direction) {
            case 'right':
                this.x += 5;
                break;
            case 'left':
                this.x -= 5;
                break;
            case 'down':
                this.y += 5;
                break;
            case 'up':
                this.y -= 5;
                break;
        }
        this.draw();
    }

}

let boss = new Boss(25, 25, 25, 'yellow', 'Boss', 0);
boss.draw();

let balls = [];
for (let i = 0; i < 50; i++) {
    let ball = new Circle(randomPosition(boss.radius * 2, canvas.width - 2 * boss.radius), randomPosition(boss.radius * 2, canvas.height - boss.radius * 2), 10, 'red');
    balls.push(ball);
}

addEventListener('keydown', e => {
    if (e.keyCode == 39) {
        if (boss.x < canvas.width - boss.radius) {
            boss.direction = 'right'
        }

    }
    if (e.keyCode == 37) {
        if (boss.x > boss.radius) {
            boss.direction = 'left';
        }

    }

    if (e.keyCode == 40) {
        if (boss.y < canvas.height - boss.radius) {
            boss.direction = 'down';
        }

    }

    if (e.keyCode == 38) {
        if (boss.y > 0) {
            boss.direction = 'up';
        }

    }
})


function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    let action = requestAnimationFrame(animate);
    boss.update();
    balls.forEach((ball, index) => {
        ball.draw();
        if (boss.collision(ball)) {
            boss.score++;
            balls.splice(index, 1);
            let x = document.getElementById("ball_hit");
            x.play();
        }
    });

    if (balls.length === 0) {
        let endTime = new Date().getTime();
        c.clearRect(0, 0, canvas.width, canvas.height);
        boss.update();
        cancelAnimationFrame(action);
        main.style.opacity = '0.5';
        end.style.display = 'flex';
        span.textContent = (endTime - startTime) / 1000;
    }
    if (boss.score !== 0 && boss.score % 5 == 0)
        boss.radius *= 1.001;
}

animate();




function randomPosition(min, max) {
    return Math.random() * (max - min) + min;
}

startGame.addEventListener('click', e => {
    main.style.display = 'block';
    startDisplay.style.display = 'none';
})



restart.addEventListener('click', e => {
    // main.style.display = 'block';
    main.style.display = 'none';
    startDisplay.style.display = 'flex';
    main.style.opacity = '1';
    end.style.display = 'none';
    restartGame();
})

replay.addEventListener('click', e => {
    main.style.display = 'block';
    main.style.opacity = '1';
    end.style.display = 'none';
    restartGame();
});

function restartGame(){
    boss = new Boss(25, 25, 25, 'yellow', 'Boss', 0);
    boss.draw();
    for (let i = 0; i < 50; i++) {
        let ball = new Circle(randomPosition(boss.radius * 2, canvas.width - 2 * boss.radius), randomPosition(boss.radius * 2, canvas.height - boss.radius * 2), 10, 'red');
        balls.push(ball);
    }
    animate();
}