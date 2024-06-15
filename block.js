class Block{
  constructor(x,y){
    this.x = x;
    this.y = y;
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = [];
    let texture;
    for(let f=0; f<6; f++){

      texture = new THREE.TextureLoader().load('assets/images/brick.png');

      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      material.push(new THREE.MeshStandardMaterial( { map: texture, dithering:true, shadowSide:THREE.FrontSide} ));
    }

    //RLTBFB

    this.block = new THREE.Mesh(geometry, material);
    this.block.castShadow = true;
    this.block.receiveShadow = true;

    this.block.position.x = this.x;
    this.block.position.y = this.y;
    this.block.position.z = this.z;

    scene.add(this.block);
  }

  collide(){
    
    let inx;
    let iny;
    let inxnext;
    let inynext;
    let angle = Math.atan2(player.y - this.y, player.x - this.x);
    if(player.x + hw > this.x-0.5 && player.x - hw < this.x + 0.5){
      inx = true;
    }
    if(player.y + hw > this.y-0.5 && player.y - hw < this.y + 0.5){
      iny = true;
    }
    if(player.dir === player.inputDir){
      if(player.nextx + hw > this.x - 0.5 && player.nextx - hw < this.x + 0.5){
        inxnext = true;
      }
      if(player.nexty + hw > this.y - 0.5 && player.nexty - hw < this.y + 0.5){
        inynext = true;
      }
    }
    
    
  }
}