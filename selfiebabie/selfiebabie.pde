PImage selfie1;
PImage selfie2;

void setup() {
  size(500, 500);
  String urls [] = loadStrings("list.txt");
  // Load image from a web server
  selfie2 = loadImage(urls[1], "jpg");
  selfie1 = loadImage(urls[0], "jpg");
  blendMode(MULTIPLY);
  image(selfie1, 0, 0);
  image(selfie2, 0, 0);
}

void draw() {
 save("selfiebaby.png");
 exit();
}