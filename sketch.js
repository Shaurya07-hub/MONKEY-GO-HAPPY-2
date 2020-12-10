  var PLAY = 1;
  var END = 0;
  var gameState = PLAY;
  var monkey, monkey_running,monkey_collided;
  var banana, bananaImage, obstacle, obstacleImage;
  var FoodGroup, obstaclesGroup;
  var score;
  var ground,groundimage;
  var gameOver, GameOverSound, GameOverImage;
  var reset1, resetImage;
  var JumpSound;
  var eatSound;
  var count=0;
  var bg,bgImage;
  var junglesound,gamoversound,jumpsound;
  var c=0;

function preload() {

  monkey_running = loadAnimation("sprite_0.png","sprite_1.png", "sprite_2.png","sprite_3.png","sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  resetImage= loadImage("reset.jpg");
  GameOverImage = loadImage("gameover.png");
  monkey_collided = loadImage("sprite_1.png");
  bgImage = loadImage("jungle.jpg");
  groundimage = loadImage("ground.png");
  junglesound = loadSound("jungle.mp3");
  gameoversound = loadSound("gameover.wav");
  jumpsound = loadSound("jump.mp3");

}

function setup() {
  
  createCanvas(600,600);
  
  // creating bg
  bg=createSprite(0,300,0,0);
  bg.addImage("bg",bgImage);
  bg.scale=1.43;
  
  //creating ground
  ground = createSprite(0,570,100, 100);
  ground.addImage("ground",groundimage);
  ground.scale=0.6;
  
  //creating monkey
  monkey = createSprite(80,560,80,50);
  monkey.setCollider("rectangle",50,10,300,470);
  monkey.addAnimation("running",monkey_running);
  //monkey.debug = true;  
  monkey.scale=0.18;

  //creating gameover
  gameOver = createSprite(290, 220, 20, 20);
  gameOver.addImage(GameOverImage);
  gameOver.scale = 0.27;

  //creating reset
  reset1 = createSprite(307,360, 20, 20);
  reset1.addImage(resetImage);
  reset1.scale=0.16;
  
  //creating groups
  obstaclesGroup = new Group();
  FoodGroup = new Group();

  //creating score's initial value as 0
  score = 0;
  
  // sound
  junglesound.loop();
  
}


function draw() {

  background("skyblue");
    
  //collide
  monkey.collide(ground);
  
  //ground moving
  if (ground.x<0) {
    ground.x =700;
  }
  
  //bg moving
  if (bg.x<0) {
    bg.x=700;
  }
  
  //isTouching function
  if (FoodGroup.isTouching(monkey)) {
    FoodGroup.destroyEach();
    count=count+1;
  }
  
  if (gameState === PLAY) {

    //visiblity
    gameOver.visible = false;
    reset1.visible = false;
    reset1.x=3070;
    reset1.y=3600;
    c=0;
    gameoversound.stop();
        
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //jump when the space key is pressed
    if (keyDown("space") && monkey.y >=470) {
      monkey.velocityY = -20;
      jumpsound.play();
    }
  
    //speed
    ground.velocityX=-(5+score /100);
    bg.velocityX=-(5+score /100);

    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8;

    //spawn obstacles on the ground
    spawnObstacles();
    spawnBanana();

    //isTouching function
    if (obstaclesGroup.isTouching(monkey)) {
      gameState = END;
      
    }

  } else if (gameState === END) {
    
    //visiblity
    gameOver.visible = true;
    reset1.visible = true;
    reset1.x=307;
    reset1.y=360;
    c=c+1;
   
    if(c===1){
    gameoversound.play();  
    }
    
    //sound
    junglesound.stop();
    jumpsound.stop();
    
    //monkey image
    monkey.addAnimation("running", monkey_collided);
      
    //velocity  
    ground.velocityX = 0;
    monkey.velocityY = 0;
    bg.velocityX = 0;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    FoodGroup.setVelocityXEach(0);
  
   }

  //restart
  if (mousePressedOver(reset1)) {
  reset();       
  }
   
  drawSprites();

  //text
  fill("white");
  textSize(30);
  text("SURVIVAL TIME: " + score,190,50);
  text("SCORE:"+count,250,90)
  
  
}

function reset() {
  
  //game is restarted
  junglesound.loop();
  gameState = PLAY;
  score = 0;
  count = 0;
  obstaclesGroup.destroyEach();
  FoodGroup.destroyEach();
  monkey.addAnimation("running",monkey_running);
  monkey.y=470;
  monkey.x=80;
}

function spawnObstacles() {
  
    if (frameCount % 123 === 0) {
    var  obstacle = createSprite(600, 460, 10, 40);
    obstacle.velocityX = -(8+ score / 100);
    obstacle.addImage(obstacleImage);
    obstacle.setCollider("circle",0,20,40)
    //obstacle.debug=true;  

    //generate random obstacles
    var rand = Math.round(random(1, 6));

    obstacle.scale = 1.1;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);

  }
}

function spawnBanana() {
  
    //write code here to spawn the food
    if (frameCount % 85 === 0) {
    var banana = createSprite(600, 450, 40, 10);
    banana.y = Math.round(random(250 ,400));
    banana.addImage(bananaImage);
    banana.scale = 0.13;
    banana.velocityX = -(8+score/100);
      
    //assign lifetime to the variable
    banana.lifetime = 200;

    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    //add each cloud to the group
    FoodGroup.add(banana);
  }
}

