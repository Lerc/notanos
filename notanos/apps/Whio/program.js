var player = {x:300,y:400}   // The starting position of the player

var alien = {x:200,y:100}    // The starting position of the alien

var anotherAlien = {x:350, y:100}

var aliens = [alien,anotherAlien];

var bullet = {x:400, y:200}

var ship = loadImage('ship_29x64.png',4);
ship.handleX=14;

var alienship = loadImage('alien_40x30.png');
alienship.handleX=20;
alienship.handleY=15;

var mouse;

function move() {
  //37 is the key code of the left arrow key
  if ( keyIsDown(37) ) {
    player.x-=2;
  }  

  //39 is the key code of the right arrow key
  if ( keyIsDown(39) ) {
    player.x+=2;
  }  

    //player.x+=2;

  // player.x less than 20 means it is off the left hand size
  if (player.x < 20) {
    player.x=20;
  }

  //player.x greater than 620 means it is off the right hand side
  if (player.x > 620) {
    player.x=620;
  }

  //key number 32 is the space bar.
  //So keyIsDown(32) is asking if the space bar is held down
  if ( keyIsDown(32) ) {
    bullet.x=player.x;
    bullet.y=player.y;
  }

  //moveAlienShip(aliens[0]);
  //moveAlienShip(aliens[1]);
  aliens.each(moveAlienShip);
  
  //move the bullet up
  bullet.y-=6;
  
  mouse=getMouseInfo();
}

function draw() {
   clear();

    
   drawImage(alienship,0,0);
   print("player");
   print(player.x);
   
   print(stringify(mouse));
   drawPlayerShip(player.x,player.y);

   drawAlienShip(aliens[0]);
   drawAlienShip(aliens[1]);

   drawBullet(bullet.x,bullet.y)
   
   print(distance(alien,bullet));
   
}

function drawPlayerShip(x,y) {
  drawImage(ship,x,y,Number.random(0,3));
  setColour("blue");
  drawLine(x,y-30, x+10,y+30);
  drawLine(x,y-30, x-10,y+30);
}


function moveAlienShip(theAlien) {
  if (distance (theAlien,bullet) < 13) {
    theAlien.dead=true;
    bullet.dead=true;
  }
}

function drawAlienShip(theAlien) {
   setColour("green")
   if (theAlien.dead) {
     setColour("red")
   }
  fillCircle(theAlien.x,theAlien.y,20);
}

function drawBullet(x,y) {
  setColour("orange")
  fillCircle(x,y,3);
}

run(move,draw);