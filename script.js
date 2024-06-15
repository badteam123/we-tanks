const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 80);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

scene.background = new THREE.Color(0x7abdff);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

const playerWidth = 0.8;
const hw = playerWidth / 2;

const loader = new THREE.GLTFLoader();

var player = {
  x: -10,
  y: 0,
  nextx: -10,
  nexty: 0,
  dir: 2,
  inputDir: -1
};

var blocks = [];

loader.load('assets/models/playertank.glb', function(gltf) {
  player.model = gltf.scene;
  player.barrel = player.model.children[0].children[1];
  console.log(player.model)
  scene.add(player.model);
});

// Load the model and assign it to player

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.position(0, 0);
  frameRate(999999);
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

  if (player.dir != player.inputDir && player.inputDir != -1) {
    let temp = player.inputDir - 8;
    let temp2 = player.inputDir + 8;
    
    let wtf = Math.min(Math.abs(player.dir - player.inputDir));
    console.log(wtf)
    console.log(player.inputDir)
    
    player.dir = lerp(player.dir, wtf, Math.min((1 / wtf) * 0.01 * deltaTime, 1));
  } else if (player.inputDir != 0) {
    player.nextx = player.x + Math.sin(player.dir*Math.PI/4);
    player.nexty = player.y + Math.cos(player.dir*Math.PI/4);
  }

  console.log(player.dir)

  if(player.dir < 0){
    player.dir += 8;
  }
  if(player.dir >= 8){
    player.dir -= 8;
  }

  for (let b = 0; b < blocks.length; b++) {
    blocks[b].collide();
  }

  camera.position.set(0, 30, 0);
  camera.lookAt(0, 0, 0);
  camera.rotateZ(Math.PI);

  player.model.position.set(0, 0, 0);
  player.model.rotation.set(0, 0, 0);
  player.model.rotateY(-player.dir*Math.PI/4);

  player.barrel.rotation.y = Math.atan2(mouseY - player.model.position.y, mouseX - player.model.position.x) + player.dir*Math.PI/4;
  player.model.scale.set(30,30,30);

  //console.log(player.dir);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  //animate();

}

function windowResized() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  resizeCanvas(window.innerWidth, window.innerHeight);
}