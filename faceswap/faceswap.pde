import gab.opencv.*;
import java.awt.*;
PImage selfie;
PImage selfie2;
PImage mask;
PImage mask2;
String urls [] = loadStrings("list.txt");
//String urls [] = {"face1.png", "face2.jpg"};
OpenCV[] opencv = new OpenCV[urls.length];
Rectangle[] faces = new Rectangle[urls.length];
Rectangle[] faces2 = new Rectangle[urls.length];
PImage[] captured = new PImage[2];
boolean planB = false;

size(500, 500);



mask = loadImage("mask12.jpg");
mask2 = loadImage("mask12.jpg");
//first img
selfie = loadImage(urls[0]);
float w = selfie.width;
float h = selfie.height;
float newH = h*(500/w);
opencv[0] = new OpenCV(this, selfie);
opencv[0].loadCascade(OpenCV.CASCADE_FRONTALFACE);
faces = opencv[0].detect();
image(selfie, 0, 0);
//println(faces.length);
if (faces.length > 0) {
  selfie.resize(500,int(newH));
  captured[0] = get(faces[0].x, faces[0].y, faces[0].width, faces[0].height);
} else {
  planB = true;
}
//second img
selfie = loadImage(urls[1]);
w = selfie.width;
h = selfie.height;
newH = h*(500/w);
opencv[1] = new OpenCV(this, selfie);
opencv[1].loadCascade(OpenCV.CASCADE_FRONTALFACE);
faces2 = opencv[1].detect();
image(selfie, 0, 0);
if (faces2.length > 0) {
selfie.resize(500,int(newH));
captured[1] = get(faces2[0].x, faces2[0].y, faces2[0].width, faces2[0].height);
} else {
planB = true;
}
//combine
if (planB == false) {
fill(255,255,255);
rect(0, 0, 500, 500);
mask.resize(captured[0].width, captured[0].height);
captured[0].mask(mask);
captured[0].resize(captured[1].width, captured[1].height);
int left = (500 - captured[1].width)/2;
int top = (500 - captured[1].height)/2;
blendMode(MULTIPLY);
mask2.resize(captured[1].width, captured[1].height);
captured[1].mask(mask2);
image(captured[1], left, top);
//tint(255, 175);
image(captured[0], left, top);
PImage watermark = loadImage("watermark.png");
//tint(255,255);
image(watermark, 10, 400, 100, 100);
save("selfiebaby.png");
exit();
} else {
selfie = loadImage(urls[0]);
selfie2 = loadImage(urls[1]);
image(selfie, 0, 0);
tint(255, 175);
image(selfie2, 0, 0);
captured[0] = get(0,0,500,500);
rect(0, 0, 500, 500);
image(captured[0], 125, 125, 250, 250);
PImage watermark = loadImage("watermark.png");
tint(255,255);
image(watermark, 10, 400, 100, 100);
save("selfiebaby.png");
exit();
}