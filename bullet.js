class Bullet{
  constructor(x, y, dir){
    this.x = x + Math.sin(dir)*0.8;
    this.y = y + Math.cos(dir)*0.8;
    this.nextx = this.x + Math.sin(this.dir)*0.006*deltaTime;
    this.nexty = this.y + Math.cos(this.dir)*0.006*deltaTime;
    this.dir = dir;
    this.ricochet = 1;
    this.leftRay = new THREE.Raycaster();
    this.rightRay = new THREE.Raycaster();
    
    let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);

    this.block = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial( { color: 0xffffff, dithering:true, shadowSide:THREE.FrontSide} ));
    this.block.castShadow = true;
    this.block.receiveShadow = true;

    this.block.position.x = this.x;
    this.block.position.z = this.y;

    this.block.rotation.y = this.dir;
    scene.add(this.block);
  }

  move(){

    this.leftRay.set(new THREE.Vector3(this.x + Math.sin(this.dir-(Math.PI/2))*0.05, 0, this.y + Math.sin(this.dir-(Math.PI/2))*0.05));
    this.rightRay.set(new THREE.Vector3(this.x + Math.sin(this.dir+(Math.PI/2))*0.05, 0, this.y + Math.sin(this.dir+(Math.PI/2))*0.05));
    let intersect = raycaster.intersectObjects(scene.children, true);
    
  }
}