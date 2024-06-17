const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function raycastPlane() {

  pointer.x = (mouseX / screenWidth) * 2 - 1;
  pointer.y = - (mouseY / screenHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  let intersect = raycaster.intersectObject(rayPlane, true);
  return intersect;

}