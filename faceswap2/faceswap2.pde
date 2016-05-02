import gab.opencv.*;
import java.awt.*;
  
//img urls
String urls [];
String usernames [];
//String urls [] = {"face1.png", "face2.jpg"};

//opencv instances
OpenCV[] opencv = new OpenCV[10];
//empty images
PImage selfie;
PImage selfie2;
PImage mask;
PImage mask2;
PImage icon;
//store captured faces
PImage[] captured = new PImage[10];

//store face detection coordinates
Rectangle[] faces = new Rectangle[10];
Rectangle[] faces2 = new Rectangle[10];

//how many faces have been found
int count = 0;
int found = 0;

//make font
PFont font;
  
PrintWriter output;

//if all else fails
boolean planB = false;

void setup() {
  size(500, 500);
  urls = loadStrings("list.txt");
  usernames = loadStrings("usernames.txt");
  output = createWriter("usednames.txt");
  font = createFont("Archive.otf", 42);
}

void draw () {
  if (found < 2) {
    println(count);
    getface();
  } else if (found == 2){
    output.flush();
    output.close();
    makebaby();
  }
}

void getface() {
  selfie = loadImage(urls[count]);
  float w = selfie.width;
  float h = selfie.height;
  float newH = h*(500/w);
  opencv[count] = new OpenCV(this, selfie);
  opencv[count].loadCascade(OpenCV.CASCADE_FRONTALFACE);
  faces = opencv[count].detect();
  image(selfie, 0, 0);
  //println(faces.length);
  if (faces.length > 0) {
    selfie.resize(500,int(newH));
    captured[found] = get(faces[0].x, faces[0].y, faces[0].width, faces[0].height);
    output.println(usernames[count]);
    count = count + 1;
    found = found + 1;
  } else {
    count = count + 1;
  }
}

void makebaby() {
    mask = loadImage("mask13.jpg");
    mask2 = loadImage("mask12.jpg");
    float w = selfie.width;
    float h = selfie.height;
    float newH = h*(300/w);
    float top = (500 - newH)/2;
    captured[0].resize(300, int(newH));
    captured[1].resize(captured[0].width, captured[0].height);
    mask.resize(captured[0].width, captured[0].height);
    captured[0].mask(mask);
    captured[1].mask(mask);
    
    fill(255, 255, 128);
    rect(0,0,500,500);
    //tint(255, 175);
    image(captured[0],100,top);
    blendMode(MULTIPLY);
    //tint(255, 160);
    image(captured[1],100,top);
    blendMode(BLEND);
    //tint(255,255);
    fill(86, 186, 236);
    textFont(font);
    text("#selfiebaby", 20, 480);
    icon = loadImage("selfiebabie-icon.png");
    image(icon,400,20,80,80);
    save("selfiebaby.jpg");
    exit();
}