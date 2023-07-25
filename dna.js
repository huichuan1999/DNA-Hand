class DNA {
  constructor(x, y, length, physics) {
    this.particles = [];
    this.springs = [];
    this.length = length;

    for (let i = 0; i < this.length; i++) {
      let particleA = new toxi.physics2d.VerletParticle2D(x, y + i * 40);
      let particleB = new toxi.physics2d.VerletParticle2D(x + 40, y + i * 40);
      physics.addParticle(particleA);
      physics.addParticle(particleB);
      this.particles.push(particleA, particleB);

      if (i > 0) {
        let springA = new toxi.physics2d.VerletSpring2D(this.particles[(i - 1) * 2], particleA, 40, 0.01);
        let springB = new toxi.physics2d.VerletSpring2D(this.particles[(i - 1) * 2 + 1], particleB, 40, 0.01);
        let crossSpring = new toxi.physics2d.VerletSpring2D(this.particles[(i - 1) * 2], particleB, 56.57, 0.01);
        let crossSpring2 = new toxi.physics2d.VerletSpring2D(this.particles[(i - 1) * 2 + 1], particleA, 56.57, 0.01);
        
        physics.addSpring(springA);
        physics.addSpring(springB);
        physics.addSpring(crossSpring);
        physics.addSpring(crossSpring2);
        this.springs.push(springA, springB, crossSpring, crossSpring2);
      }
    }
  }

  display() {
    for (let i = 0; i < this.particles.length; i++) {
      fill(255, 100);
      stroke(255);
      strokeWeight(1);
      if(i < 2 || i > this.particles.length - 3) {
        ellipse(this.particles[i].x, this.particles[i].y, 20);
      } else {
        ellipse(this.particles[i].x, this.particles[i].y, 10);
      }
    }
    
    for (let i = 0; i < this.springs.length; i++) {
      line(this.springs[i].a.x, this.springs[i].a.y, this.springs[i].b.x, this.springs[i].b.y);
    }
  }
}
