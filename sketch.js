let physics;
let dnas = [];
let handParticles = [];
let handAttractions = [];
//let particles = [];

// Adjust the pinch threshold according to the actual situation
const pinchThreshold = 30;
let particleGrabRadius = 20;
let canvas;

function setup() {
  createCanvas(windowWidth,windowHeight);
  colorMode(HSB, 255);

  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.id("canvas");


  physics = new toxi.physics2d.VerletPhysics2D();
  physics.setWorldBounds(new toxi.geom.Rect(0, 0, width, height));
  physics.setDrag(0.2);
  
  for(let i = 0; i < 4; i++) {
    dnas.push(new DNA(random(width/6,width-width/6), random(height/6,height-height/6), random(3,20), physics));
  }
}

function draw() {
  clear();
  // background(0);
  physics.update();
  
  for(let dna of dnas) {
    dna.display();
  }

  //draw hand landmarks
  if (detections != undefined) {
    if (detections.multiHandLandmarks != undefined) {

      //draw landmarks 
      drawLines([0, 5, 9, 13, 17, 0]);//palm
      drawLines([0, 1, 2, 3, 4]);//thumb
      drawLines([5, 6, 7, 8]);//index finger
      drawLines([9, 10, 11, 12]);//middle finger
      drawLines([13, 14, 15, 16]);//ring finger
      drawLines([17, 18, 19, 20]);//pinky

      drawLandmarks([0, 1], 0);//palm base
      drawLandmarks([1, 5], 60);//thumb
      drawLandmarks([5, 9], 120);//index finger
      drawLandmarks([9, 13], 180);//middle finger
      drawLandmarks([13, 17], 240);//ring finger
      drawLandmarks([17, 21], 300);//pinky
    }
  }

  //If detected hand
  const allLandmarkIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const allLandmarkCoordinates = getLandmarkCoordinates(allLandmarkIndices, detections);
  for (let i = 0; i < handParticles.length; i++) {
    const index = allLandmarkIndices[i];
    if (index == 8 || index == 4) {
      continue; // // Skip keys with index 8 (index finger) or 4 (thumb)
    }
    const coord = allLandmarkCoordinates[index];
    if (coord) {
      handParticles[i].updatePosition(coord.x, coord.y);
    }
  }

  if (handParticles.length === 0) {
    addHandParticle(allLandmarkCoordinates);
  }

  for (let i = 0; i < handParticles.length; i++) {
    //there is maybe a better place and time to do this but it was looking like there were
    //19 handparticles so we only really want 19 physcis behaviors,
    //
    if(physics.behaviors.length < 19){
      handAttractions[i].attractor.set(handParticles[i].getPosition());
      handAttractions[i].strength = -20;//increase the strength because it was -0.5 so it's too small for each attractor to have an impact.
      physics.addBehavior(handAttractions[i]);
    }else{
      //comment out the line below, and you will see that while it's running, as long as the hand
      //is tracking the first time, the physcis behaviors work until the tracking of the hand is lost
//This is because in the if statement before it is enough to only say once, hey I want to set this hand particle as the attractor for my behaviour
      // so you could maybe make this even more efficient if you only do this bit every time the hand is first tracked
      // AFTER you lose tracking of the hand. you will need to investigate your hand tracking library
      handAttractions[i].attractor.set(handParticles[i].getPosition());

    }
  }
    //Add pinch interaction
  const landmarkIndices = [8, 4];
  const landmarkCoordinates = getLandmarkCoordinates(landmarkIndices, detections);

  if (landmarkCoordinates[8] && landmarkCoordinates[4]) {
    const distance = calculateDistance(landmarkCoordinates[8], landmarkCoordinates[4]);

    if (distance < pinchThreshold) {
      // The pinch action occurs
      const midpoint = {
        x: (landmarkCoordinates[8].x + landmarkCoordinates[4].x) / 2,
        y: (landmarkCoordinates[8].y + landmarkCoordinates[4].y) / 2
      };

      fill(255);
      noStroke();
      ellipse(midpoint.x, midpoint.y, 20, 20);

      for(let dna of dnas) {
        for(let i = 0; i < 2; i++) { 
          let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);
          
          if(d < 20) {
            dna.particles[i].set(width/2,height/2);
          }
        } //只探测最开始的粒子
        
        for(let i = dna.particles.length - 2; i < dna.particles.length; i++) {
          let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);
          
          if(d < 20) {
            dna.particles[i].set(width/2,height/2);
          }
        } 
      
      //只探测倒数两个的粒子
      //   for(let i = 0; i < dna.particles.length; i++) { 
      //   let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);
      //   if (d < particleGrabRadius) {
      //     dna.particles[i].lock();
      //     dna.particles[i].x = midpoint.x;
      //     dna.particles[i].y = midpoint.y;
      //     dna.particles[i].unlock();
      //   }
      // }
    }
    }
  }
}

function keyPressed(){
  //press the space to reload
  if(keyCode === 32){
    location.reload();
  }
}

// function mouseDragged() {
//   for(let dna of dnas) {
//     for(let i = 0; i < 2; i++) { 
//       let d = dist(mouseX, mouseY, dna.particles[i].x, dna.particles[i].y);
      
//       if(d < 20) {
//         dna.particles[i].set(mouseX, mouseY);
//       }
//     }//只探测最开始的粒子

//     for(let i = dna.particles.length - 2; i < dna.particles.length; i++) {
//       let d = dist(mouseX, mouseY, dna.particles[i].x, dna.particles[i].y);
      
//       if(d < 20) {
//         dna.particles[i].set(mouseX, mouseY);
//       }
//     }//只探测倒数两个的粒子
    
//   }
// }
