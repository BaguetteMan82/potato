 const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let frames = 0;
    const gravity = 0.25;
    const jump = -4.6;
    const bird = {
      x: 50,
      y: 150,
      w: 34,
      h: 24,
      velocity: 0,
      draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.w, this.h);
      },
      update() {
        this.velocity += gravity;
        this.y += this.velocity;

        if (this.y + this.h >= canvas.height) {
          this.y = canvas.height - this.h;
          this.velocity = 0;
        }

        if (this.y < 0) {
          this.y = 0;
          this.velocity = 0;
        }
      },
      flap() {
        this.velocity = jump;
      }
    };

    const pipes = [];
    const pipeWidth = 50;
    const pipeGap = 120;

    function createPipe() {
      const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
      pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - (topHeight + pipeGap)
      });
    }

    function drawPipes() {
      ctx.fillStyle = '#228B22';
      pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
      });
    }

    function updatePipes() {
      pipes.forEach(pipe => pipe.x -= 2);
      if (frames % 100 === 0) createPipe();
      if (pipes.length && pipes[0].x + pipeWidth < 0) pipes.shift();
    }

    function detectCollision() {
      return pipes.some(pipe => {
        const inXRange = bird.x < pipe.x + pipeWidth && bird.x + bird.w > pipe.x;
        const hitsTop = bird.y < pipe.top;
        const hitsBottom = bird.y + bird.h > canvas.height - pipe.bottom;
        return inXRange && (hitsTop || hitsBottom);
      });
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bird.update();
      bird.draw();
      updatePipes();
      drawPipes();

      if (detectCollision()) {
        alert('Game Over!');
        document.location.reload();
      }

      frames++;
      requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener('click', () => bird.flap());

    createPipe();
    gameLoop();
