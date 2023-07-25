let physics;
let dnas = [];

function setup() {
  createCanvas(windowWidth,windowHeight);
  physics = new toxi.physics2d.VerletPhysics2D();
  physics.setWorldBounds(new toxi.geom.Rect(0, 0, width, height));
  physics.setDrag(0.2);
  
  for(let i = 0; i < 4; i++) {
    dnas.push(new DNA(100 + i * 200, 100, 10, physics));
  }
}

function draw() {
  background(0);
  physics.update();
  
  for(let dna of dnas) {
    dna.display();
  }
}

function mouseDragged() {
  for(let dna of dnas) {
    for(let i = 0; i < 2; i++) { 
      let d = dist(mouseX, mouseY, dna.particles[i].x, dna.particles[i].y);
      
      if(d < 20) {
        dna.particles[i].set(mouseX, mouseY);
      }
    }//只探测最开始的粒子

    for(let i = dna.particles.length - 2; i < dna.particles.length; i++) {
      let d = dist(mouseX, mouseY, dna.particles[i].x, dna.particles[i].y);
      
      if(d < 20) {
        dna.particles[i].set(mouseX, mouseY);
      }
    }//只探测倒数两个的粒子
    
  }
}
