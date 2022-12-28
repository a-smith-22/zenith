/*
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
Zenith: Choose Your Destiny developed by Andrew Smith 01-25-2021, finished 02-03-2021. 

This game is inspired by 80's style graphics and choose your own adventure gameplay as seen in Netflix's original Bandersnatch. 
The objective of the game is to reach the top of the mountain by choosing the correct choices to get there.

Controls:
CTRL + R to launch the game
LEFT and RIGHT arrow keys to select decision
R to restart
ESC to exit

Patch Notes:
09/12/2021 Changed tavern name to The Ugly Duckling
02/06/2022 Added the Zenith Main Theme Song (V1.2)
04/17/2022 Created ESC input to main code

Copyright Andrew Smith 2021. 
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

import processing.sound.*; //Sound library to play theme song.
SoundFile song;
//Sets up code to allow music to play by loading library and creating path and file names for the main score. 

PFont title_font; //title screen only
PFont retro_font; //typwriter style font

float res; //fits graphics into window height, converts to 256 x 196 pixels




void setup() {
  fullScreen(); //final resolution of 256 x 192 pixels, graphics inspired by the ZX-81
  
  title_font = loadFont("Bauhaus93-48.vlw");
  retro_font = loadFont("Monotxt-48.vlw");

  res = height / 196; //used to convert between apparent pixel vs actual pixel
  
  song = new SoundFile(this, "zenith-main-theme.mp3");
  song.loop();
  //Load main theme song and loop throughout game. 
  
}

int game_position = 0;
/*
The game position changes throughout the game and is used to display the corresponding image, prompt, and choices. 
This is formed by converting the unique path to get there from binary to decimal, 0 for left choices and 1 for right choices.
For example, position 6 (110) is reached by choosing the right choice, the right choice again, then the left choice. 
Later paths may end/converge in which some numbers may not exist, e.g. if 6 (110) is a dead end then neither 12 (1100) nor 13 (1101) will exist. 
As default, 0 is the title screen. The first prompt after this has a position of 1. 
*/

void draw() {
  background(20);
  

  
  fill(0); rectMode( CENTER );
  rect( width/2, height/2, 256 * res, 196 * res); //draws game window
  
  if(game_position == 0){ title_screen(); }
  if(game_position == -1){ credits_screen(); }

  game_positions(); //function to display each game position, contains all path information
  
  //Restart with 'R'. End program with ESC key.
  if(key == 'r'){ game_position = 1; }
  if(keyCode == 27) { exit(); } 
}

void display_img(int image_number) {
  /*
  Displays the image associated with the index input, allows images to be reused for multiple game postions. 
  Images are drawn centered on the screen, image sizes are restricted to 128 x 98 pixels as drawn
  */
  imageMode( CENTER ); 
  int img_height = int(196 / 2 * res); //new image dimensions
  
  PImage position_img = loadImage(image_number + ".png"); //load in correct image
  position_img.resize(img_height, img_height); //resizes to square 
  image( position_img, width/2, height/2 + (196 / 32 * res)); //place image in center, adds room for prompt
}

int key_value = -1; //value of the key pressed (0=LEFT, 1=RIGHT), used to determine selection

void player_choice (String option_one, int outcome_one, String option_two, int outcome_two) {
  /*
  Displays the given choices and allows the player to choose.
  The string inputs (e.g. option_one) correspond to the text choices displayed on screen.
  The integer inputs correspond to the player position resulting from choosing the given path. 
  Keypressed functions are used for the LEFT and RIGHT arrow keys for choice selection. 
  The function modifies the game_position variable to progress the player based on their choice.
  */
  float choice_vert_pos = height / 2 + (3 * 196 / 8) * res; //height of choices on screen
  float choice_hor_bound = (196 / 2) * res; //max width of choice text on screen
  float choice_vert_bound = (196 / 4) * res; //max height of choice text on screen
  
  textFont( retro_font ); textAlign( CENTER, CENTER ); 
  textSize(48); fill(255);
  text(option_one, width/2 - (256 / 4) * res, choice_vert_pos, choice_hor_bound, choice_vert_bound); 
  text(option_two, width/2 + (256 / 4) * res, choice_vert_pos, choice_hor_bound, choice_vert_bound); //displays both choices on screen
  
  if (key_value == 0) {
    game_position = outcome_one; //left selection
  }
  if (key_value == 1) {
    game_position = outcome_two;
  }
  key_value = -1; //reset to waiting value until next prompt
}

void position_prompt (String prompt) {
  /*
  Takes an input prompt and displays it at the top of the screen.
  */
  float prompt_vert_pos = height / 2 - (3 * 196 / 8) * res; //vertical position of the prompt text
  textFont( retro_font ); textAlign( CENTER, CENTER ); 
  textSize(48); fill(255);
  text(prompt, width/2, prompt_vert_pos, 256 * res, (196 / 4) * res); //display the prompt centered in the upper quarter of the screen
}

void title_screen() {
  /*
  Displays the title screen, shows instructions then begins game on player input.
  */
  float title_vert_pos = height / 2 - (3 * 196 / 8) * res;
  textFont( title_font ); textAlign( CENTER, CENTER ); 
  textSize(250); fill(255); 
  text("ZENITH", width/2, title_vert_pos); //display title  
  float game_start_pos = height / 2 + (3 * 196 / 8) * res;
  textFont( retro_font ); textSize(48);
  text("Press any key to begin", width/2, game_start_pos); //game start prompt
  
  display_img(0); //title image

  if(keyPressed && game_position == 0){
    game_position = 1; //starts game from title screen
  }
}

void credits_screen() {
  String credits[] = loadStrings("credits.txt"); //load credits file, credits all on first line
  textFont( retro_font ); textAlign( LEFT, TOP ); 
  textSize(36); fill(255); 
  text(credits[0], width/2, height/2, 256 * res, 196 * res); //display title 
}

void keyReleased() {
  if (key == CODED) {
    if (keyCode == LEFT) {
      key_value = 0;
    }
    if (keyCode == RIGHT) {
      key_value = 1;
    }
  }
  if (key == 'r') {
    game_position = 0; //reset to title screen
  }
}
