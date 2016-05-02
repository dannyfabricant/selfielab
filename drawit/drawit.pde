
  size(640, 360, P3D);


  translate(width/2, height/2, -100);
  rotateX(random(360));
  rotateY(random(360));
  rotateZ(random(360));
  noStroke();
  fill(#E860CB);
  box(200);
  save("box.png");