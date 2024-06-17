var aspectRatio = 11/6;
var screenWidth = 0;
var screenHeight = 0;

if(window.innerWidth/window.innerHeight > aspectRatio){
  screenHeight = window.innerHeight;
  screenWidth = screenHeight*aspectRatio;
} else if (window.innerWidth/window.innerHeight < aspectRatio){
  screenWidth = window.innerWidth;
  screenHeight = screenWidth/aspectRatio;
} else {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
}

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-8*aspectRatio, 8*aspectRatio, 8, -8, 0.01, 80);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;

renderer.setSize(screenWidth, screenHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

scene.background = new THREE.Color(0x7abdff);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

const playerWidth = 0.8;
const hw = playerWidth / 2;
const moveSpeed = 0.005;
const turnSpeed = 0.010;

const loader = new THREE.GLTFLoader();

var player = {
  x: -5,
  y: 0,
  nextx: -5,
  nexty: 0,
  dir: 2,
  inputDir: -1
};

var blocks = [];
var bullets = [];

loader.load('assets/models/playertank.glb', function(gltf) {
  player.model = gltf.scene;
  player.barrel = player.model.children[0].children[1];
  //console.log(player.model)
  scene.add(player.model);
});

// Load the model and assign it to player

var rayPlane = new THREE.Mesh(new THREE.PlaneGeometry(50,50), new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  color: 0xffffff,
  transparent: true,
  opacity: 0
}));
rayPlane.rotateX(Math.PI/2);
rayPlane.position.set(0, -0.01, 0);
scene.add(rayPlane);

// resolution of 1837 x 1002 just so happens to be (167*11) x (167*6) lol // waht
var backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(11*2.42,6*2.42), new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  map: new THREE.TextureLoader().load('assets/images/background.png')
}));
backgroundPlane.rotateX(-Math.PI/4);
backgroundPlane.position.set(0, -20, -20);
scene.add(backgroundPlane);

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.position(0, 0);
  frameRate(999999);
  blocks.push(new Block(0, 0));

  for(let b=-8; b<9; b++){
    blocks.push(new Block(b, 8));
  }
}

function draw() {
  if (!player.model) {
    console.log("Player model not loaded yet...");
    return;
  }
  // IF YOU PUT SOMETHING BEFORE THIS I WILL BOMB ISRAEL

  switch (-keyIsDown(87) + keyIsDown(83) + -(keyIsDown(65) * 10) + (keyIsDown(68) * 10) + 11) {
    case 11://no
      player.inputDir = -1;
      break;
    case 10://W
      player.inputDir = 0;
      break;
    case 20://WD
      player.inputDir = 1;
      break;
    case 21://D
      player.inputDir = 2;
      break;
    case 22://SD
      player.inputDir = 3;
      break;
    case 12://S
      player.inputDir = 4;
      break;
    case 2://SA
      player.inputDir = 5;
      break;
    case 1://A
      player.inputDir = 6;
      break;
    case 0://WA
      player.inputDir = 7;
      break;
  }

  if ((player.dir%4) != (player.inputDir%4) && player.inputDir != -1) {
    let temp = (player.inputDir%4) - 4;
    let temp2 = (player.inputDir%4) + 4;
    let temp3 = 0;
    let temp4 = 100;

    if(Math.abs(player.dir - temp) < temp4){
      temp3 = 1;
      temp4 = Math.abs(player.dir - temp);
    }
    if(Math.abs(player.dir - temp2) < temp4){
      temp3 = 2;
      temp4 = Math.abs(player.dir - temp2);
    }
    if(Math.abs(player.dir - (player.inputDir%4)) < temp4){
      temp3 = 3;
      temp4 = Math.abs(player.dir - (player.inputDir%4));
    }
    switch(temp3){
      case 1:
        player.dir = lerp(player.dir, temp, Math.min((1 / Math.abs(player.dir - temp)) * turnSpeed * deltaTime, 1));
        break;
      case 2:
        player.dir = lerp(player.dir, temp2, Math.min((1 / Math.abs(player.dir - temp2)) * turnSpeed * deltaTime, 1));
        break;
      case 3:
        player.dir = lerp(player.dir, (player.inputDir%4), Math.min((1 / Math.abs(player.dir - (player.inputDir%4))) * turnSpeed * deltaTime, 1));
        break;
    }
  } else if (player.inputDir != -1) {
    player.nextx = player.x + Math.sin(player.inputDir*Math.PI/4) * moveSpeed * deltaTime;
    player.nexty = player.y - Math.cos(player.inputDir*Math.PI/4) * moveSpeed * deltaTime;
  }

  if(player.dir < 0){
    player.dir += 4;
  }
  if(player.dir >= 4){
    player.dir -= 4;
  }

  for (let b = 0; b < blocks.length; b++) {
    blocks[b].collide();
  }

  for (let b = 0; b < bullets.length; b++) {
    //bullets[b].move();
  }

  player.x = player.nextx;
  player.y = player.nexty;

  camera.position.set(0, 20, 20);
  camera.lookAt(0, 0, 0);

  player.model.position.set(player.x, -0.45, player.y);
  player.model.rotation.set(0, 0, 0);
  player.model.rotateY(-player.dir*Math.PI/4);

  let ray = raycastPlane();
  if(ray[0] != undefined){
    player.barrel.rotation.y = -Math.atan2(ray[0].point.z - player.model.position.z, ray[0].point.x - player.model.position.x) + (player.dir+2)*Math.PI/4;
  }
  
  player.model.scale.set(4,4,4);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

}

function mousePressed(){
  let ray = raycastPlane();
  if(mouseButton === LEFT){
    if(ray[0] != undefined){
      bullets.push(new Bullet(player.x, player.y, -Math.atan2(ray[0].point.z - player.model.position.z, ray[0].point.x - player.model.position.x)+(Math.PI/2)));
    }
  }
}

function windowResized() {
  if(window.innerWidth/window.innerHeight > aspectRatio){
    screenHeight = window.innerHeight;
    screenWidth = screenHeight*aspectRatio;
  } else if (window.innerWidth/window.innerHeight < aspectRatio){
    screenWidth = window.innerWidth;
    screenHeight = screenWidth/aspectRatio;
  } else {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
  }
  renderer.setSize(screenWidth, screenHeight);
  resizeCanvas(window.innerWidth, window.innerHeight);
}