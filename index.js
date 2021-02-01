var canvasWidth = 1000;
var canvasHeight = 500;
var keys = []; // keys currently pressed

var tank = {
  x: 0,              // x position of player tank
  y: 0,              // y position of player tank
  turn: 0,           // angle of player tank body
  aim: 0,            // angle of player tank cannon
  rockets: [],       // array of rocket objects
  
  enemy: [],

  draw: function() {
    translate(this.x,this.y); // center on tank for drawing
    rectMode(CENTER);         // center rectangle draw mode
    rotate(this.turn);        // rotate drawing 
    
    // tank body
    if (this === tank) {
      fill(245, 207, 110);      // tank color
    } else {
      fill(96, 125, 85);        // enemy color
    }
    rect(0, 0, 34, 42);        
    rect(12, 0, 10, 51);
    rect(-12, 0, 10, 51);
    point(0, -15);
    rotate(-1 * this.turn);

    // tank cannon
    rotate(this.aim);
    rect(0, -17, 6, 34);
    ellipse(0,0,25,25);
    rotate(-1 * this.aim);
    translate(-1*this.x, -1*this.y);
  }
};

/*
var x = canvasWidth/2;        // x position of tank
var y = canvasHeight/2;        // y position of tank
var turn = 0;       // angle of tank body 
var aim = 0;        // angle of tank cannon
var rocketX = [];   // x positions of rockets
var rocketY = [];   // y positions of rockets
var rocketAim = []; // aim angles of cannon when rockets were created

// tank function draws tank
var tank = function(x,y,turn,aim) {
  translate(x,y);
  rectMode(CENTER);
  rotate(turn);
  
  // tank body
  fill(245, 207, 110);
  rect(0, 0, 30,45);
  rect(12,0, 10, 55);
  rect(-12,0,10,55);
  point(0,-15);
  resetMatrix();

  // tank cannon
  translate(x,y); 
  rotate(aim);
  rect(0, -17, 6, 34);
  ellipse(0,0,25,25);
  resetMatrix();
};
*/


var enemy = {
  x: [],           // enemy x positions
  y: [],           // enemy y positions
  turn:[],         // angles of enemy tank bodies
  aim: [],         // angles of enemy tank cannons
  rocketX: [],     // x positions of enemy rockets
  rocketY: [],     // y positions of enemy rockets
  rocketAim: [],   // trajectories of enemy rockeys
  draw: function(n) {
    translate(this.x[n],this.y[n]); // center on tank for drawing
    rectMode(CENTER);         // center rectangle draw mode
    rotate(this.turn[n]);        // rotate drawing 
    
    // tank body
    fill(96, 125, 85);      // tank color
    rect(0, 0, 34,42);        
    //noFill();
    rect(12,0, 10, 51);
    rect(-12,0, 10, 51);
    point(0,-15);
    rotate(-1 * this.turn[n]);

    // tank cannon
    rotate(this.aim[n]);
    rect(0, -17, 6, 34);
    ellipse(0,0,25,25);
    rotate(-1 * this.aim[n])
    translate(-1*this.x[n], -1*this.y[n]);
  } 
};

keyPressed = function() {
  if (key == " ") { 
    // if space is pressed, create new rocket
    tank.rockets.push({
      x: tank.x + 34 * sin(tank.aim),
      y: tank.y - 34 * cos(tank.aim),
      aim: tank.aim
    });  
  } else if(keys[keys.length-1]!== key) {
    // if key pressed is not in keys, add it to keys
    keys.push(key);
  }
};

keyReleased = function() {
  for (var k = 0; k < keys.length; k++) {
    if (keys[k] === key) {
      keys.splice(k, 1);
    }
  }
};

function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

function draw() {
  translate(canvasWidth/2, canvasHeight/2); // make center of screen have coordinates (0,0)
 
  background(21, 148, 42);  

  if (frameCount % 200 == 0) {
      switch(Date.now() % 4) {
        case 0: 
          enemy.x.push(random(-1 * canvasWidth/2, canvasWidth/2));
          enemy.y.push(-1 * canvasHeight/2 - 25);
          enemy.turn.push(random(2*PI/3, 4*PI/3));
          enemy.aim.push(0);
          break;
        
        case 1: 
          enemy.x.push(canvasWidth/2 + 25);
          enemy.y.push(random(-1 * canvasHeight/2, canvasHeight/2));
          enemy.turn.push(random(4*PI/3, 5*PI/3));
          enemy.aim.push(0);
          break;
        
        case 2:
          enemy.x.push(random(-1 * canvasWidth/2, canvasWidth/2));
          enemy.y.push(canvasHeight/2 + 25);
          enemy.turn.push(random(-1*PI/3, PI/3));
          enemy.aim.push(0);
          break;
        
        case 3:
          enemy.x.push(-1 * canvasWidth/2 - 25);
          enemy.y.push(random(-1 * canvasHeight/2, canvasHeight/2));
          enemy.turn.push(random(PI/3, 2*PI/3));
          enemy.aim.push(0);
          break;
      }
  }

  //animate rocket trajectories 
  fill(0, 0, 0); 
  for (var i = 0; i < tank.rockets.length; i++) {
    ellipse(tank.rockets[i].x, tank.rockets[i].y, 5, 5);
    tank.rockets[i].x += 8*sin(tank.rockets[i].aim);
    tank.rockets[i].y += -8*cos(tank.rockets[i].aim);
    if (abs(tank.rockets[i].x) > canvasWidth/2 || abs(tank.rockets[i].y) > canvasHeight/2){
      tank.rockets.splice(i, 1);
    }   
  }

  //respond to key presses  
  for (var j = 0; j < keys.length; j++) {
    switch(keys[j].toString()) {
      case "A": //A key: turn left
        tank.aim -= PI/180;
        tank.turn -= PI/180;
        break;
            
      case "D": //D key: turn right
        tank.turn +=PI/180;
        tank.aim += PI/180;
        break;
                
      case "W": //W key: drive forward
        if(abs(tank.x + sin(tank.turn)) < canvasWidth/2) {
          tank.x += sin(tank.turn);
        }
        if(abs(tank.y - cos(tank.turn)) < canvasHeight/2) {
          tank.y -= cos(tank.turn);
        }
        break;
                
      case "S": //S key: drive backward
        if(abs(tank.x - sin(tank.turn)) < canvasWidth/2) {
          tank.x -= sin(tank.turn);
        }
        if(abs(tank.y + cos(tank.turn)) < canvasHeight/2) {
          tank.y += cos(tank.turn);
        }
        break;

      case "%": //Left Arrow key: aim left
        tank.aim -= PI/180;
        break;

      case "'": // Right Arrow key: aim right
        tank.aim += PI/180;
        break;
      }
  }

  tank.draw();

  for(e = 0; e < enemy.x.length; e++) {
    enemy.draw(e);
    enemy.x[e] += 1/2 * sin(enemy.turn[e]);
    enemy.y[e] -= 1/2 * cos(enemy.turn[e]);
    enemy.aim[e] = atan2(tank.x - enemy.x[e], enemy.y[e] - tank.y);
    
    if (abs(enemy.x[e]) > canvasWidth/2 + 50 || abs(enemy.y[e]) > canvasHeight/2 + 50) {
      enemy.x.splice(e, 1);
      enemy.y.splice(e, 1);
      enemy.turn.splice(e, 1);
      enemy.aim.splice(e, 1);
    }
  }

  for (i = 0; i < tank.rockets.length; i++) {
    for (e = 0; e < enemy.x.length; e++) {
      if (abs(enemy.x[e] - tank.rockets[i].x) < 20 && abs(enemy.y[e] - tank.rockets[i].y) < 20) {
        enemy.x.splice(e, 1);
        enemy.y.splice(e, 1);
        enemy.turn.splice(e, 1);
        enemy.aim.splice(e, 1);
        tank.rockets.splice(i, 1);
      }
    }
  }
/*//optional features{ 
  //view tank coordinates on screen
  */
  //text(enemy.x, 10, 10);
  //text(enemy.y, 10, 30);
  

  /*
  //view keys pressed as text on screen  
  for(var m = 0; m < keys.length; m++) {
    fill(255, 0, 0);
    text(keys[m], 10, 20*m+10);
  }
//}*/

}