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
    this.block.position.z = this.y;

    scene.add(this.block);
  }

  collide(){
    
    let inx;
    let iny;
    let inxnext;
    let inynext;
    let angle = Math.atan2(player.y - this.y, player.x - this.x)*Math.PI/4;
    if(player.x + hw > this.x-0.5 && player.x - hw < this.x + 0.5){
      inx = true;
    }
    if(player.y + hw > this.y-0.5 && player.y - hw < this.y + 0.5){
      iny = true;
    }
    if(player.nextx + hw > this.x - 0.5 && player.nextx - hw < this.x + 0.5){
      inxnext = true;
    }
    if(player.nexty + hw > this.y - 0.5 && player.nexty - hw < this.y + 0.5){
      inynext = true;
    }

    if(!inx && iny && inxnext && inynext){
      if(player.x < this.x){
        player.nextx = this.x - 0.5 - hw;
      } else {
        player.nextx = this.x + 0.5 + hw;
      }
    }
    if(inx && !iny && inxnext && inynext){
      if(player.y < this.y){
        player.nexty = this.y - 0.5 - hw;
      } else {
        player.nexty = this.y + 0.5 + hw;
      }
    }

    if(!inx && !iny && inxnext && inynext){
      if(angle < 1 || angle >= 7){
        player.nexty = this.y - 0.5 - hw;
      } else if(angle < 3){
        player.nextx = this.x - 0.5 - hw;
      } else if(angle < 5){
        player.nexty = this.y + 0.5 + hw;
      } else if(angle < 7){
        player.nextx = this.x + 0.5 + hw;
      }
    }
    
  }
}