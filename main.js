/*
TITLE: Zenith I
AUTHOR: Andrew Smith
VERSION HISTORY:
    (02/03/2021) V1.0.0 - Initial game release (Java)
    (09/12/2021) V1.0.1 - Changed tavern name to The Ugly Duckling
    (02/06/2022) V1.0.2 - Added the Zenith Main Theme Song (V1.2)
    (04/17/2022) V1.0.3 - Created ESC input to main code
    (04/18/2025) V1.1.0 - Remastered game for Javascript release
    (04/21/2025) V1.1.1 - Added missing levels for Arcada fight and Galadore maze
*/

// General settings
var isMobile = true; // based on screen orientation, used for formatting window display

// Game controls
var game_position = 0;
// -1 = credits screen
// 0 = title screen
// 1 = initial position
// # = general position, binary coding (see game_positions function)
var mouse_state = [0,0]; // 0 = no click, 1 = click for [previous frame, current frame]

// Color palette
var color_screen_bkgd       = '#3c4042';      // for horizontal orientations, seperate background is shown
var color_bkgd              = '#121212';      // dark mode background
var color_prompt            = '#e0e0e0';      // pure white with 87% opacity applied
var color_choice            = color_prompt;   // text for left and right choices
var color_choice_highlight  = '#86ce80';      // light green accent
var color_opt_line = color_choice_highlight;  // line over option text
var color_title             = '#466744';      // title during game (mobile only)
var color_title_highlight   = '#364933';      // tap title to restart (mobile only)


// Graphics display
var w, h;                           // screen dimensions
var title_font, main_font;          // game fonts
var txt_sz, title_txt_sz;           // prompt & option and title text size
var prompt_x_max, prompt_y_max;     // maximum width and height for prompt text
var img_x_pos, img_y_pos, img_wd;   // position and dimensions of image on screen
var opt_x_pos, opt_y_pos;           // position of left option (right is mirrored about w/2)
const pos_img_nums = [
    0,
    1,
    2,
    3,
    4,
    6,
    7,
    8,
    10,
    13,
    17,
    25,
    50,
    53,
    100,
    101,
    450,
    1618,
    1619,
    1702,
    3236,
    3237,
    3404,
    3861,
    7722,
    13616,
    103627,
    207106,
    414212,
    828424,
    26509656
];                                  // list of all image numbers -> see Images folder
var pos_imgs = [];                  // all images in game, to be preloaded                    
var wnd_mrg = 0.03;                 // margin around screen as percentage of width and height



function preload() {
    // Load all graphics before running rest of code

    // Load fonts
    title_font = loadFont("Fonts/UnifrakturCook-Bold.ttf");
    main_font = loadFont("Fonts/PirataOne-Regular.ttf");

    // Determine screen orientation
    w = windowWidth;
    h = windowHeight;

    // Load all images
    for(var i=0; i<pos_img_nums.length; i++){
        append(pos_imgs, loadImage('Images/'+pos_img_nums[i]+'.png'));
    }
}

function setup() {
    createCanvas(w, h);
}

function windowResized() {
    // Reset screen orientation
    w = windowWidth;
    h = windowHeight;

    // Reset screen size
    resizeCanvas(w, h);
}



function draw() {

    // Graphics options
    if(isMobile){
        background(color_bkgd);
    } else {
        background(color_screen_bkgd);
    }
    set_scale();

    // Main game code
    dsp_background(); // only for horizontal orientation
    game_positions(); // load all position data

    // Title and credits screen
    if(game_position==0){ title_screen(); }
    if(game_position==-1){ credits_screen(); }

    // Update mouse state
    mouse_state[0] = mouse_state[1];

    //fill(0,255,0);
    //rect(0,opt_y_pos,w,1);
    //rect(0,opt_y_pos-txt_sz*1.1-h*wnd_mrg*1,w,1);
    //rect(0,prompt_y_max,w,1);
}



function set_scale() {
    // Determines positions and sizes for text and images

    // Check screen orientation
    if(w/h>1.00){ isMobile=false; }
    else{ isMobile = true;}

    // Set dimensions and scale
    if(isMobile){ // vertical format

        // Set text size
        //txt_sz = w*h*0.00008; // scales with area
        //if(txt_sz > 40){ txt_sz = 40; } // lower bound
        //if(txt_sz > 55){ txt_sz = 55; } // upper bound
        txt_sz = 65;
        title_txt_sz = 3*txt_sz;

        // Set text positions
        prompt_x_max = w - w*wnd_mrg*2; 
        prompt_y_max = 1.3*txt_sz*4 + 2*h*wnd_mrg; // up to 4 lines of text, equal margin above and below
        opt_x_pos = prompt_x_max/4+(w-prompt_x_max)/2; opt_y_pos = h-h*wnd_mrg - h*0.02; 

        // Set image size and position
        img_wd = (opt_y_pos-txt_sz*1.3*2-2*h*wnd_mrg) - (prompt_y_max+h*wnd_mrg); 
        if(img_wd>w*0.8){img_wd=w*0.8;}
        img_x_pos = w/2; img_y_pos = ( (opt_y_pos-txt_sz*1.2-h*wnd_mrg) + (prompt_y_max) )/2; 

    } 
    else { // horizontal format

        // Set text size
        txt_sz = w*h*0.00005;     // scales with area
        if(txt_sz<15){txt_sz=15;} // lower bound
        if(txt_sz>40){txt_sz=40;} // upper bound
        title_txt_sz = 3*txt_sz;

        // Set text positions
        prompt_x_max = w * 0.6; 
        prompt_y_max = 1.3*txt_sz*3 + 2*h*wnd_mrg; // max 3 lines of text
        opt_x_pos = (prompt_x_max*1.1/4)+(w-prompt_x_max*1.1)/2; opt_y_pos = h-h*wnd_mrg*1.5; 

        // Set image size and position
        img_wd = (opt_y_pos-txt_sz*1.3*2-2*h*wnd_mrg*1) - (prompt_y_max);
        if(img_wd>prompt_x_max*0.6){img_wd=prompt_x_max*0.6;}
        img_x_pos = w/2; img_y_pos = prompt_y_max + img_wd/2; 
 
    }
}

function dsp_background(){
    // Show game window for horizontal orientation

    if(isMobile==false){
        var screen_wd = prompt_x_max * 1.1; 
        var screen_ht = h-h*wnd_mrg*1; 
        fill(color_bkgd); noStroke(); rectMode(CENTER); 
        rect( w/2, h/2, screen_wd, screen_ht, screen_ht*0.02); 
    }
}



function position_prompt(prompt_txt){
    // Displays prompt for current game position

    // General text parameters
    textSize(txt_sz); fill(color_prompt); noStroke(); rectMode(CENTER); textAlign(LEFT, TOP); textFont(main_font);
    var prompt_y_pos; 
    if(isMobile){
      prompt_y_pos = h*wnd_mrg + txt_sz*1+(h*wnd_mrg);
    } else {
      prompt_y_pos = h*wnd_mrg;
    }

    // Prompt text
    text(prompt_txt.toUpperCase(), w/2, prompt_y_pos, prompt_x_max); // capitalize text, left justified

    // Title text (mobile only)
    if(isMobile){
      textAlign(CENTER, TOP); textFont(title_font);

      // Display text
      if(mouseY<prompt_y_max && mouse_state[1]==1) {
        fill(color_title_highlight); // highlight title text when clicked
      } else {
        fill(color_title);
      }
      text('ZENITH', w/2, h*wnd_mrg);

      // Return to title screen
      if(mouseY<prompt_y_max && mouse_state[0]==1 && mouse_state[1]==0){ // tap released
        game_position = 0;  // return to title screen
        mouse_state[0]=0;   // reset mouse states
        mouse_state[1]=0;   // " "
      }
    }

}

function display_img(image_number) {
    // Shows the image for each position 

    // Retrieve image
    var curr_img; 
    var img_index = 0; 
    for(let i=0; i<pos_img_nums.length; i++){
        if(pos_img_nums[i]==image_number){
            img_index = i; 
        }
    }
    curr_img = pos_imgs[img_index]; 

    // Display image
    imageMode(CENTER); noSmooth(); 
    curr_img.resize(img_wd, img_wd);       // resize image
    image(curr_img, img_x_pos, img_y_pos); // display image
}

function player_choice(left_txt, left_pos, right_txt, right_pos){
    // Displays options and allows player to choose
    // left_txt, right_txt = text to display on screen (will be capitalized)
    // left_pos, right_pos = position to send player if option is selected

    // General text settings
    textSize(txt_sz); noStroke(); rectMode(CENTER); textAlign(CENTER, BOTTOM); textFont(main_font);
    var option_txt_width = 0.9*prompt_x_max/2; // max width of text before wrapping to new line

    // Display left option
    if(mouse_state[1]==1 && mouseX < w/2 && mouseY>prompt_y_max){ // change color when text is highlighted
        fill(color_choice_highlight);
    } else {
        fill(color_choice);
    }
    text(left_txt, opt_x_pos, opt_y_pos, option_txt_width);

    // Display right option
    if(mouse_state[1]==1 && mouseX > w/2 && mouseY>prompt_y_max){
        fill(color_choice_highlight);
    } else {
        fill(color_choice);
    }
    text(right_txt, w-opt_x_pos, opt_y_pos, option_txt_width);

    // Button controls
    if(mouse_state[0]==1 && mouse_state[1]==0 && mouseY>prompt_y_max){ // mouse/tap released
        if(mouseX < w/2) { // left option
            game_position = left_pos;
        } 
        if(mouseX > w/2) { // right option
            game_position = right_pos;
        }
    }

    // Option bars
    var bar_y_min, bar_y_max, bar_wd;

    // get bar width
    var left_txt_wd, right_txt_wd, max_txt_wd;
    rectMode(CORNER); textAlign(LEFT, TOP); textSize(txt_sz); 
    left_txt_wd = textWidth(left_txt+'  ');     // draw text off screen to get dimensions
    right_txt_wd = textWidth(right_txt+'  ');  // " "
    if(left_txt_wd >= right_txt_wd) { // maximum width of option text
      max_txt_wd = left_txt_wd;
    } else {
      max_txt_wd = right_txt_wd;
    }
    bar_wd = max_txt_wd * 1.1; // width of line over options
    if(bar_wd > option_txt_width) { bar_wd = option_txt_width; } // bound size
    // set bar positions
    bar_y_min = opt_y_pos; // bottom of line
    if(max_txt_wd>option_txt_width){ // move top of line if either option has text wrapped
      bar_y_max = opt_y_pos - 2*1.3*txt_sz;
    } else {
      bar_y_max = opt_y_pos - 1.3*txt_sz;
    }

    //print(round(option_txt_width), round(left_txt_wd), round(right_txt_wd));
    
    stroke(color_choice); strokeWeight(1); 
    line(opt_x_pos-bar_wd/2, bar_y_min, opt_x_pos+bar_wd/2, bar_y_min);
    line(opt_x_pos-bar_wd/2, bar_y_max, opt_x_pos+bar_wd/2, bar_y_max);
    line((w-opt_x_pos)-bar_wd/2, bar_y_min, (w-opt_x_pos)+bar_wd/2, bar_y_min);
    line((w-opt_x_pos)-bar_wd/2, bar_y_max, (w-opt_x_pos)+bar_wd/2, bar_y_max);

}



function title_screen(){
    // Displays title screen and instructions

    // Title text
    textSize(title_txt_sz); fill(color_prompt); noStroke(); rectMode(CENTER); textAlign(CENTER, CENTER); textFont(title_font);
    let title_y_pos = (h*wnd_mrg + prompt_y_max)/2 - title_txt_sz*0.2; 
    text("ZENITH", w/2, title_y_pos);

    // Subtitle (mobile only)
    if(isMobile){
      textFont(main_font); textSize(txt_sz); textAlign(CENTER, BOTTOM);
      text("BY ANDREW SMITH", w/2, title_y_pos+title_txt_sz*1.1)
    }

    // Instructions
    textFont(main_font); textSize(txt_sz); textAlign(CENTER, BOTTOM);
    if(mouse_state[1]==1){
        fill(color_choice_highlight);
    } else {
        fill(color_choice);
    }
    text('TAP ANYWHERE TO BEGIN', w/2, opt_y_pos);

    // Title image
    display_img(0);

    // Start game
    if(mouse_state[0]==1 && mouse_state[1]==0){
        game_position = 1; 
    }

}

function credits_screen(){
    // Displays credit screen

    // Credits text
    var credits_txt = '';
    credits_txt += 'Zenith is a high fantasy, interactive fiction game initially created in 2021 and remastered in 2025. This game was designed using the p5js JavaScript library; visit p5js.org for more information. ';
    credits_txt += '\n \n';
    credits_txt += 'All game code, sprites, and artwork were created by Andrew Smith. The title logo text uses the "UnifrakturCook" font designed by Peter Wiegel (C) 2009. All text shown otherwise uses the "Pirata" font designed by Rodrigo Fuenzalida and Nicolas Massi (C) 2007. ';
    credits_txt += '\n \n';
    credits_txt += 'This game is licensed under CC BY 4.0 Creative Commons Attribution 4.0 International. Others may distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes with credit given to Andrew Smith. Visit https://creativecommons.org/licenses/by/4.0/ for more information.';
    
    textSize(txt_sz * 0.7); fill(color_prompt); noStroke(); rectMode(CENTER); textAlign(LEFT, TOP); textFont(main_font);
    text(credits_txt, w/2, h*wnd_mrg, prompt_x_max);

    // Instructions
    textFont(main_font); textSize(txt_sz); textAlign(CENTER, BOTTOM);
    if(mouse_state[1]==1){
        fill(color_choice_highlight);
    } else {
        fill(color_choice);
    }
    text('TAP ANYWHERE TO RESTART', w/2, opt_y_pos);

    // Restart game
    if(mouse_state[0]==1 && mouse_state[1]==0){
        game_position = 0; 
    }
}


function mousePressed(){
    // Update mouse state
    mouse_state[1] = 1; 
}
function mouseReleased(){
    // Update mouse state
    mouse_state[1] = 0; 
}



// ======================================================================================================



function game_positions() {
    // All levels/positions in the game
    // Game positions are written in binary based on path to reach position
    // E.g., right,left,right,right = (1)1011 = 27 (first digit=1 is default)
    // 
    // Format for each position is given below
    //      position_prompt("TEXT TO APPEAR AT TOP OF SCREEN");
    //      display_img(#); -> image file to display, "Images/#.png"
    //      player_choice("LEFT TEXT", [position for left option], "RIGHT TEXT", [position for right option]);
  
    switch (game_position) {
        
      case 1:
        position_prompt("YOU APPROACH THE FOOT OF THE TRECHEROUS MT. ZENITH. THE PATH DIVIDES TWO WAYS. TAP THE LEFT OR RIGHT SIDE OF THE SCREEN TO BEGIN.");
        display_img(1); 
        player_choice("GO LEFT", 2, "GO RIGHT", 3);
        break;
        
      case 2:
        position_prompt("YOU HAVE ENTERED THE DARK WOODS. A WOUNDED GOBLIN IS SEEN LYING BESIDE AN OVERTURNED CART.");
        display_img(2); 
        player_choice("IGNORE", 4, "HELP", 5);
        break;
        
      case 3:
        position_prompt("YOU WALK INTO THE GREEN MEADOWS OF NASDORF. THE AIR IS CALM AS YOU OVERLOOK THE SUNRISE ABOVE THE MOUNTAIN FACE.");
        display_img(3); 
        player_choice("FOLLOW MEADOW NORTH", 6, "FOLLOW MEADOW SOUTH", 7);
        break;
        
      case 4:
        position_prompt("THE WIND HOWLS THROUGH THE WOODS. NIGHT FALL QUICKLY APPROACHES.");
        display_img(4); 
        player_choice("GO ON", 8, "SET UP CAMP", 9);
        break;
        
      case 5:
        position_prompt("BEHIND THE CART, A GROUP OF GOBLINS AMBUSH YOU WITH DAGGERS. THEY DEMAND YOUR GOLD.");
        display_img(2); 
        player_choice("PAY THE GOBLINS OFF", 10, "FIGHT THE GOBLINS", 11);
        break;
  
      case 6:
        position_prompt("A FEIRCELY ROLLING RIVER LIES BEFORE YOU, TOO DEEP TO CROSS ON FOOT.");
        display_img(6); 
        player_choice("BUILD RAFT TO CROSS", 12, "FOLLOW RIVER UPSTREAM", 13);
        break;
        
      case 7:
        position_prompt("A CAVE ENTRANCE IS SURROUNDED BY SKELETONS. ETCHED IN THE WALL WRITES THE CAVE OF THE ARCADA.");
        display_img(3861); 
        player_choice("LOOT ROPE", 14, "LOOT TORCH", 15);
        break;
        
      case 8:
        position_prompt("THE PATH APPROACHES A LONE MYERWOOD, SPLITTING THE PATH ON EITHER SIDE.");
        display_img(8); 
        player_choice("GO LEFT", 16, "GO RIGHT", 17);
        break;
        
      case 9:
        position_prompt("YOU AWAKEN TO THE FOOTSTEPS OF FLEEING GLOBLIN BANDITS. IN YOUR SLEEP THEY CAME BACK AND ROBBED YOU BARE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
  
      case 10:
        position_prompt("THE GOBLINS TAKE YOUR GOLD AND ALL POSESSIONS. YOU CANNOT CONTINUE YOUR QUEST.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 11:
        position_prompt("THE GOBLINS FLEE AT THE SIGHT OF YOUR BLADE. NIGHT FALL QUICKLY APPROACHES.");
        display_img(2); 
        player_choice("GO ON", 8, "SET UP CAMP", 9);
        break;
        
      case 12:
        position_prompt("THE STRONG CURRENT SENDS YOU TOWARDS THE RIVER NYMPHS, THEY RESCUE YOU BEFORE ASKING YOU FOR HELP GATHERING FOOD.");
        display_img(6); 
        player_choice("FORAGE FOR WILD ENDORBERRIES", 24, "SEARCH RIVERBANK FOR ONIONROOT", 25);
        break;
        
      case 13:
        position_prompt("THE RIVER OPENS TO LAKE KRAITOS, FOG COVERS THE EERY WATERFRONT.");
        display_img(13); 
        player_choice("ENTER MOSSY COTTAGE", 26, "ENTER WOODEN FISHING HUT", 27);
        break;
        
      case 14:
        position_prompt("THE CAVE ECHOES YOUR FOOTSTEPS AS YOU ENTER. A PILLAR DIVIDES THE ENTRANCE WAY.");
        display_img(7); 
        player_choice("GO LEFT", 28, "GO RIGHT", 29);
        break;
        
      case 15:
        position_prompt("THE CAVE ECHOES YOUR FOOTSTEPS AS YOU ENTER.");
        display_img(7); 
        player_choice("GO LEFT", 30, "GO RIGHT", 31);
        break;
        
      case 16:
        position_prompt("THE GOBLINS MAKE EASY PREY TO THOSE LOST IN THE DAR WOODS.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 17:
        position_prompt("YOU ENTER A SECLUDED TAVERN CALLED THE UGLY DUCKLING; ORCS, GOBLINS AND OGRES FILL THE DIMLY LIT TABLES.");
        display_img(17); 
        player_choice("APPROACH FLAIRMAN", 34, "APPROACH LUTE PLAYER", 35);
        break;
  
      case 24:
        position_prompt("THE ENDORBERRIES WERE POISONOUS, SICKENING THE ENTIRE VILLAGE INCLUDING YOURSELF.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 25:
        position_prompt("THE VILLAGE FEASTS ON YOUR ONIONROOT AND OFFER YOU THE LOST SWORD OF RAVENSHEADE AS A TOKEN OF KINDNESS.");
        display_img(25); 
        player_choice("ACCEPT GIFT", 50, "REFUSE GIFT", 51);
        break;
        
      case 26:
        position_prompt("THE DOOR CREAKS OPEN WHEN YOU ARE STOPPED BY A WARRIOR ELF, SHE WEILDS A MYSTIC BOW DRAWN TOWARDS YOU.");
        display_img(53); 
        player_choice("FIGHT", 52, "PLEA", 53);
        break;
        
      case 27:
        position_prompt("IN THE HIGHLAND LAKE THE HEAD OF THE SERPANT IGRO SKIMS THE WATER OUTSIDE THE FISHING HUT.");
        display_img(13); 
        player_choice("HIDE UNDER DOCK", 54, "HIDE UNDERWATER", 55);
        break;
        
      case 28:
        position_prompt("YOUR FOOT STEPS IN A PUDDLE OF WAILING DRET DROPPINGS, THE STARTLED CLOUD OF DRETS BEGIN TO FLY TOWARDS YOU.");
        display_img(7); 
        player_choice("DUCK", 56, "YELL", 57);
        break;
        
      case 29:
        position_prompt("A WIDE CRACK IN THE CAVE FLOOR STOPS YOUR MOVEMENT, THE GAP IS TOO WIDE TO JUMP.");
        display_img(7); 
        player_choice("SWING ACROSS", 58, "ATTEMPT TO CLIMB SIDES", 59);
        break;
        
      case 30:
        position_prompt("YOUR FOOT STEPS IN A PUDDLE OF WAILING DRET DROPPINGS, THE STARTLED CLOUD OF DRETS BEGIN TO FLY TOWARDS YOU.");
        display_img(7); 
        player_choice("DUCK", 60, "YELL", 61);
        break;
        
      case 31:
        position_prompt("A WIDE CRACK IN THE CAVE FLOOR STOPS YOUR MOVEMENT, THE GAP IS TOO WIDE TO JUMP.");
        display_img(7); 
        player_choice("SWING ACROSS", 62, "ATTEMPT TO CLIMB SIDES", 63);
        break;
        
      case 34:
        position_prompt("THE ANXIOUS FLAIRMAN SERVES YOU A HOGSMEADE AND SHARES A RUMOR THAT A MERCANARY WILL KILL IN HIS TAVERN.");
        display_img(17); 
        player_choice("APPROACH GOBLIN ON BARSTOOL", 68, "APPROACH OGRE AT BACK TABLE", 69);
        break;
        
      case 35:
        position_prompt("THE MYSTERIOUS ORC PLAYING THE LUTE MUMBLES, WHICH WEATHER FAIRS A SAFE VOYAGE NORTH?");
        display_img(17); 
        player_choice("ONLY IN SHINING SUN", 70, "GENTLE RAIN WILL SUFFICE", 71);
        break;
        
      case 50:
        position_prompt("THE RIVER NYMPHS LASTLY ESCORT YOU TO THE BASE OF THE MOUNTAIN TRAIL. A ROCKY FACE STOPS YOU ON THE TRAIL.");
        display_img(50); 
        player_choice("TAKE THE STEEP PATH", 100, "TAKE THE FLAT PATH", 101);
        break;      
  
      case 51:
        position_prompt("THE RIVER NYMPHS BANISH YOU FOR YOUR INSOLENCE, LEAVING YOU TO STARVE WITHOUT FOOD.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 52:
        position_prompt("THE EXPERT MARKSMEN FIRES A SINGLE ARROW, STOPPING YOU DEAD IN YOUR TRACKS BEFORE YOU CAN MOVE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 53:
        position_prompt("THE ELF OFFERS A RIDDLE TO PROVE YOUR WORTH, WHICH HIGHLAND BEAST BARES CLOVEN FEET?");
        display_img(53); 
        player_choice("DRAELON", 106, "HAILUS", 107);
        break;
        
      case 54:
        position_prompt("THE RIPPLES IN THE WATER FROM YOUR STEP ALERTS THE SERPANT IGRO, POUNCING WITH A GREAT WAVE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 55:
        position_prompt("IGRO'S HEAD DUCKS UNDERWATER AS YOU HOLD YOUR BREATH IN ANTICIPATION, SHE STRIKES WITHOUT WARNING.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 56:
        position_prompt("THE DRETS FLY OUT OF THE CAVE. BEFORE YOU ARE THE REMNANTS OF AN OLD LADONIAN ORE MINE.");
        display_img(7); 
        player_choice("TAKE SHUTTLECART DOWN", 112, "TAKE ORC LIFT DOWN", 113);
        break;
        
      case 57:
        position_prompt("YOUR CRIES ARE TRIUMPHED BY THE CRIES OF THE WAILING DRETS, THEY SWARM AROUND YOU AS YOUR POSESSIONS ARE LOST IN THE DARK.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 58:
        position_prompt("YOUR FEET JUST REACH THE OTHER SIDE TO LAND. BEFORE YOU ARE THE REMNANTS OF AN OLD LADONIAN ORE MINE.");
        display_img(7); 
        player_choice("TAKE SHUTTLECART DOWN", 112, "TAKE ORC LIFT DOWN", 113);
        break;
        
      case 59:
        position_prompt("AS YOU BEGIN TO SPELUNK ACROSS THE GAP, YOU LOSE YOUR GRIP TO THE MOSSY CAVE WALLS.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 60:
        position_prompt("THE DRETS FLY OUT OF THE CAVE. BEFORE YOU ARE THE REMNANTS OF AN OLD LADONIAN ORE MINE.");
        display_img(7); 
        player_choice("TAKE SHUTTLECART DOWN", 120, "TAKE ORC LIFT DOWN", 113);
        break;
        
      case 61:
        position_prompt("YOUR CRIES ARE TRIUMPHED BY THE CRIES OF THE WAILING DRETS, THEY SWARM AROUND YOU AS YOUR POSESSIONS ARE LOST IN THE DARK.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 62:
        position_prompt("YOU JUMP IN ATTEMPT TO GRAB A LOW HANGING VINE BUT ARE UNABLE TO REACH THE SHORT STEM.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 63:
        position_prompt("AS YOU BEGIN TO SPELUNK ACROSS THE GAP, YOU LOSE YOUR GRIP TO THE MOSSY CAVE WALLS.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 68:
        position_prompt("THE GOBLIN SNARLS AT YOUR APPROACH. A LOUD COMMOTION STARTLES YOU FROM BEHIND AS YOU SEE AN OGRE ESCAPING.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 69:
        position_prompt("THE OGRE GLARES AS WALK NEAR, YOU SEE HIS HAND SLYLY REACH BENEATH THE TABLE.");
        display_img(17); 
        player_choice("GRAB HIS HAND", 138, "REACH FOR DAGGER", 139);
        break;
        
      case 70:
        position_prompt("THE ORC SHOOS YOU AWAY. THE HUSHED WHISPERS OF THE TAVERN FILL THE AIR.");
        display_img(17); 
        player_choice("EXIT TAVERN", 8, "APPROACH FLAIRMAN", 34);
        break;
        
      case 71:
        position_prompt("THE ORC WHISPERS A STRANGE NUMBER 2650-9656. THE HUSHED WHISPERS OF THE TAVERN FILL THE AIR.");
        display_img(17); 
        player_choice("EXIT TAVERN", 8, "APPROACH FLAIRMAN", 34);
        break;
        
      case 100:
        position_prompt("YOU ARE STOPPED IN YOUR ASCENT BY THE LARGE AETHON EAGLE, FURIOUS FOR YOU TRESPASSING HIS PROTECTED MOUNTAINSIDE.");
        display_img(100); 
        player_choice("TURN BACK", 200, "FIGHT AETHON", 201);
        break;
        
      case 101:
        position_prompt("THE FLAT PATH IS BLOCKED BY THE GUARDIAN BASILISK, YOU ARE SURROUNDED BY HIS SERPTINE BODY AS HE POUNCES TOWARDS YOU");
        display_img(101); 
        player_choice("PARRY LEFT", 202, "PARRY RIGHT", 203);
        break;
        
      case 106:
        position_prompt("THE WARRIOR ELF LOWERS HER AIM PLEASED AS A FELLOW HUNTER. SHE DIRECTS YOU TO THE MOUTAIN PATH AND LEAVES YOU HER ELVISH BOW.");
        display_img(50); 
        player_choice("TAKE THE STEEP PATH", 212, "TAKE THE FLAT PATH", 213);
        break;
        
      case 107:
        position_prompt("THE WARRIOR ELF IS DISPLEASED WITH THE ANSWER, YOU HEAR THE SNAP OF THE BOWSTRING AS SHE FIRES AN ARROW.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 112:
        position_prompt("THE CART RACES DOWN THE NARROW PATH INTO THE CENTRAL MINE. THE TRACK APPROACHES A FORK.");
        display_img(7); 
        player_choice("LEAN LEFT", 224, "LEAN RIGHT", 225);
        break;
        
      case 113:
        position_prompt("YOU ENTER THE ORC LIFT AS YOU HEAR THE STRAIN OF THE OLD CABLE ROPE BREAKING.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;   
     
      case 120:
        position_prompt("THE CART RACES DOWN THE NARROW PATH INTO THE CENTRAL MINE. THE TRACK APPROACHES A FORK.");
        display_img(7); 
        player_choice("LEAN LEFT", 224, "LEAN RIGHT", 241);
        break;
        
      case 138:
        position_prompt("YOU STOP HIS HAND FROM SLIDING UNDER THE TABLE, BUT YOU DO NOT EXPECT THE HARD PUNCH OF HIS FREE HAND AFTER.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 139:
        position_prompt("YOU GRAB THE WOODEN HANDLE OF HIS CURVED DAGGER. HE LOOKS NERVOUS AS YOU WEILD IT TO HIS CHEST.");
        display_img(17); 
        player_choice("QUESTION OGRE", 278, "KILL OGRE", 279);
        break;
      
      case 200:
        position_prompt("YOU RUSH DOWN THE PATH, NEARLY SLIPPING OFF THE ROCKY FACE. YOU RETURN TO THE FOOT OF THE MOUNTAIN TRAIL.");
        display_img(50); 
        player_choice("TAKE THE STEEP PATH", 100, "TAKE THE FLAT PATH", 101);
        break;
  
      case 201:
        position_prompt("YOU WITHDRAWAL YOUR SWORD BUT ARE UNABLE TO HIT AETHON FROM AFAR. HE SWIPES YOU WITH HIS WINGS DOWN THE ROCKY EDGE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 202:
        position_prompt("THE BASILISK'S FANGS JUST MISS YOU. YOU QUICKLY WITHDRAWAL THE LOST SWORD OF RAVENSHEADE AS HE RECOVERS.");
        display_img(101); 
        player_choice("CUT EYES", 404, "STAB HEART", 405);
        break;
        
      case 203:
        position_prompt("YOU STUMBLE FROM THE FAST ATTACK, LOSING YOUR FOOTING ON THE PATH AND SLIPPING OFF THE EDGE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 212:
        position_prompt("YOU ARE STOPPED IN YOUR ASCENT BY THE LARGE AETHON EAGLE, FURIOUS FOR YOU TRESPASSING HIS PROTECTED MOUNTAINSIDE.");
        display_img(100); 
        player_choice("TURN BACK", 424, "FIGHT AETHON", 425);
        break;
        
      case 213:
        position_prompt("THE FLAT PATH IS BLOCKED BY THE GUARDIAN BASILISK, YOU ARE SURROUNDED BY HIS SERPTINE BODY AS HE POUNCES TOWARDS YOU");
        display_img(101); 
        player_choice("PARRY LEFT", 426, "PERRY RIGHT", 427);
        break;
        
      case 224:
        position_prompt("THE CART LEANS INTO THE TURN BUT IS SOON MET WITH LOOSE FLOORBOARDS COLLAPSING THE TRACKS.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 225:
        position_prompt("THE CART MAKES ITS WAY TO THE BOTTOM OF THE MINE AS YOU LEAP OUT. YOU FACE TWO LARGE DOORS AT THE BOTTOM.");
        display_img(7); 
        player_choice("ENTER LARGE DOOR", 450, "ENTER SMALL DOOR", 451);
        break;
        
      case 241:
        position_prompt("THE CART MAKES ITS WAY TO THE BOTTOM OF THE MINE AS YOU LEAP OUT. YOU FACE TWO LARGE DOORS AT THE BOTTOM.");
        display_img(7); 
        player_choice("ENTER LARGE DOOR", 482, "ENTER SMALL DOOR", 451);
        break;
        
      case 278:
        position_prompt("YOU FORCE HIM TO CONFESS TO HIS PLOT. HE SAYS HE WAS SENT BY HIS BOSS TO KILL AN ORC.");
        display_img(17); 
        player_choice("APPROACH BAR SEATS", 556, "APPROACH BAND AREA", 557);
        break;
        
      case 279:
        position_prompt("THE TAVERN IS IN COMMOTION AFTER YOUR KILL. OGRES AND GOBLINS DRUNK ON HOGSMEADE ATTACK YOU IN A TAVERN WIDE BRAWL.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 405:
        position_prompt("THE BLADE JABS THROUGH THE BASILISK'S THICK SKIN. AS HE SWAYS IN A FAINT, HIS TREMENDOUS DEAD BODY CRUSHES ON TOP OF YOU.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 404:
        position_prompt("BLINDED BY THE CUT OF YOUR SWORD, THE BASILISK ATTEMPTS ONE LAST JAB AS HE TRIES TO FIND YOU.");
        display_img(101); 
        player_choice("PARRY LEFT", 808, "PARRY RIGHT", 809);
        break;
        
      case 424:
        position_prompt("YOU STUMBLE DOWN THE STEEP FACE BARELY HOLDING ONTO YOUR BOW. THE ROCKY MOUNTAIN FACE STOPS YOU.");
        display_img(50); 
        player_choice("TAKE THE STEEP PATH", 212, "TAKE THE FLAT PATH", 213);
        break;
        
      case 425:
        position_prompt("THE EAGLE SPREADS ITS WINGS AND SOARS FOR AN ATTACK, DIVING TOWARDS YOU.");
        display_img(100); 
        player_choice("DIVE LEFT", 850, "DIVE RIGHT", 851);
        break;
        
      case 426:
        position_prompt("THE BASILISK MISSES HIS FIRST ATTACK AS YOU FUMBLE AWAY. HE POUNCES AGAIN BEFORE YOU CAN MOVE OR FIRE AN ARROW.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 427:
        position_prompt("THE BASILISK PUSHES YOU OFF THE EDGE WITH HIS FEIRCESOME ATTACK.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 450:
        position_prompt("YOU OPEN THE LARGE DOOR TO FIND THE ICE DEN OF THE ARCADA. HE LAUNCHES ICESICKLES AT YOU BUT YOU CANNOT EVADE.");
        display_img(450); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 451:
        position_prompt("THE SMALL DOOR OPENS EASILY TO FIND A PIT BELOW FILLED WITH SPIKES. A SIGN READS BEWARE THE NON-DARING.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;    
        
      case 482:
        position_prompt("YOU OPEN THE LARGE DOOR TO FIND THE ICE DEN OF THE ARCADA. HE LAUNCHES A STORM OF ICESICKLES AT YOU.");
        display_img(450); 
        player_choice("USE TORCH", 964, "HIDE BEHIND ROCKS", 965);
        break; 
        
      case 556:
        position_prompt("ALL BUT TWO SEATS AT THE BAR ARE FILLED, NONE SEATING AN ORC. THE BACK DOOR BURSTS OPEN AS SOMEONE FLEES.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 557:
        position_prompt("YOU RUSH TO THE ORC PLAYING LUTE JUST BEFORE HE ESCAPES AND ESCORT HIM TO THE FLAIRMAN FOR SAFETY.");
        display_img(17); 
        player_choice("QUESTION FLAIRMAN", 1114, "QUESTION ORC", 1115);
        break;
    
      case 808:
        position_prompt("THE BASILISK LUNGES IN YOUR DIRECTION, BARELY CUTTING YOU WITH HIS POISONOUS FANGS. THE VENOM SEAPS TO THE WOUND.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 809:
        position_prompt("THE BASILISK LUNGES FEIRCELY IN YOUR DIRECTION, YOU PARRY AWAY AS HE FALLS OFF THE MOUNTAIN TRAIL. BEHIND HIS BODY YOU SEE TWO GATES.");
        display_img(7722); 
        player_choice("SILVER GATE", 1618, "BRONZE GATE", 1619);
        break;
        
      case 850:
        position_prompt("AETHON DIVES AT YOU AS YOU DODGE TO THE LEFT, KNOCKING THE BOW FROM OUT OF YOUR GRIP LEAVING YOU DEFENSELESS.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 851:
        position_prompt("AETHON MISSES HIS ATTACK BY A DWARF'S TOE AS YOU FUMBLE AN ARROW ONTO YOUR MYSTICAL ELVISH BOW.");
        display_img(100); 
        player_choice("SHOOT WING", 1702, "SHOOT HEAD", 1703);
        break;
        
      case 964:
        position_prompt("THE ICESICKLES MELT BUT EXTINGUISH YOUR TORCH. YOU FIND A PIECE OF LADONIAN ORE.");
        display_img(450); 
        player_choice("THROW AT CEILING", 1930, "THROW AT WALL", 1929);
        break;
        
      case 965:
        position_prompt("THE ICESICKLES MISS YOU AS YOU FIND A PIECE OF LADORIAN ORE BEHIND THE ROCKS.");
        display_img(450); 
        player_choice("THROW AT CEILING", 1930, "THROW AT WALL", 1929);
        break;
        
      case 1114:
        position_prompt("THE FLAIRMAN CONFESSES HE IS A FAIRY WING SMUGGLER WHO HIRED THE OGRE, THE ORC HAD BEGUN TO CATCH ON.");
        display_img(17); 
        player_choice("THREATEN FLAIRMAN", 2228, "KILL FLAIRMAN", 2229);
        break;
        
      case 1115:
        position_prompt("THE ORC REVEALS HE HAD FOUND A SECRET ABOUT THE FLAIRMAN, ALL BUT TOO LATE AS YOU FEEL THE FLAIRMAN'S BLADE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 1618:
        position_prompt("YOU APPROACH A STRANGE SET OF ROCK PILLARS, INSCRIBED ON ONE READS THE MAZE OF GALADORE.");
        display_img(1618); 
        player_choice("ENTER MAZE", 3236, "PONDER EXISTANCE", 3237);
        break;
        
      case 1619:
        position_prompt("YOU APPROACH A DEEP ABYSS IN THE ROCK FACE, JOINED ONLY BY A SHAKEY WOODEN BRIDGE.");
        display_img(1619); 
        player_choice("CROSS BRIDGE", 3238, "CLIMB DOWN", 3239);
        break;
        
      case 1702:
        position_prompt("THE ARROW SOARS CLIPPING AETHON'S WING, HE SPIRALS UNBALANCED TO THE GROUND. YOU CONTINUE UP THE PATH BEFORE IT SPLITS.");
        display_img(1702); 
        player_choice("GO LEFT", 3404, "GO RIGHT", 3405);
        break;
        
      case 1703:
        position_prompt("THE AGILE EAGLE TURNS HIS HEAD TO DEFLECT THE ARROW OFF HIS BEAK, YOU ARE OUT OF ARROWS.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 1928:
        position_prompt("THE LADONIAN KNOCKS THE ICESICKLES FREE IMPALING THE ARCADA. HE LAUNCHES A SNOW STORM YOU ARE UNABLE TO MELT.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 1929:
        position_prompt("THE ARCADA LAUGHS AS YOU HAVE COMPLETELY MISSED YOUR TARGET. HE LAUNCHES A FURIOUS SNOW STORM.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 1930:
        position_prompt("THE ARCADA IS IMPALED BY THE FALLING ICE SICKLES. YOU GRAB YOUR TORCH AND IGNITE THE END.");
        display_img(450); 
        player_choice("THROW TORCH", 3860, "FLANK WITH TORCH", 3861);
        break;
        
      case 2228:
        position_prompt("THE FLAIRMAN COWARDS AND REVEALS THE LOCATION OF THE SMUGGLING ROUTE, IN THE FOREST BEHIND THE TAVERN.");
        display_img(17); 
        player_choice("GO WEST FROM TAVERN", 4456, "GO NORTH FROM TAVERN", 4457);
        break;
        
      case 2229:
        position_prompt("YOU KILL THE FLAIRMAN, ALONG WITH YOUR ONLY CHANCE TO FIND A PATH TO MT. ZENITH.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 3236:
        position_prompt("YOU HAVE ENTERED THE MAZE. PILLARS LIE EAST AND WEST OF YOU.");
        display_img(3236); 
        player_choice("GO NORTH", 6472, "GO NORTH", 6472);
        break;
        
      case 3237:
        position_prompt("YOU PONDER THE MEANING OF LIFE. DO YOU HAVE CONTROL? IS THIS SOME GAME?");
        display_img(3237); 
        player_choice("ENTER MAZE ANYWAYS", 3236, "THINK SOME MORE", 3237);
        break;
        
      case 3238:
        position_prompt("A BRIDGEKEEPER STOPS YOU IN YOUR TRACKS, ONLY THOSE WORTHY MAY CROSS. HE ASKS WHAT IS YOUR QUEST?");
        display_img(1619); 
        player_choice("ETERNAL GLORY", 6476, "ENDLESS RICHES", 6477);
        break;
        
      case 3239:
        position_prompt("THE ROCKY EDGE CRUMBLES AT YOUR FEET, YOU ATTEMPT TO SCALE DOWN BUT ONLY SLIP INTO THE DEEP CHASM.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 3404:
        position_prompt("YOU MAKE YOUR WAY UP THE GROOLING PATH AS YOU CLENCH YOUR STOMACH IN HUNGER.");
        display_img(3404); 
        player_choice("HUNT FOR FOOD", 6808, "FORAGE FOR FOOD", 6809);
        break;
        
      case 3405:
        position_prompt("YOU CONTINUE YOUR WAY UP THE STEEP MOUNTAIN PATH BEFORES LOSING YOUR FOOTING AND SLIPPING OFF A LEDGE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 3860:
        position_prompt("THE ARCADA BURNS FROM THE TORCH AS HIS ICE DEN MELTS. WATER FLOODS THE DEN BLOCKING ALL EXITS.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 3861:
        position_prompt("THE ARCADA JUMPS BACK IN FEAR OF YOUR FLAME. HE OPENS THE DEN EXIT AND YOU FOLLOW THE TUNNEL TO MT. ZENITH.");
        display_img(3861); 
        player_choice("GO LEFT", 7722, "GO RIGHT", 7723);
        break;
        
      case 4456:
        position_prompt("YOU WALK THROUGH THE FOREST FOR DAYS BEFORE DISCOVERING YOU HAVE TRAVELED THE WRONG WAY.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 4457:
        position_prompt("BEHIND THE FOREST REVEALS THE SMUGGLER'S ROUTE UP THE MOUNTAIN. IT BRINGS YOU TO A LARGE ROCK SPLITTING YOUR PATH.");
        display_img(1702); 
        player_choice("GO LEFT", 3404, "GO RIGHT", 3405);
        break;
        
      case 6472:
        position_prompt("A PILLAR LIES NORTH OF YOU.");
        display_img(3236); 
        player_choice("GO EAST", 12944, "GO WEST", 12945);
        break;
        
      case 6476:
        position_prompt("THE BRIDGEKEEPER THINKS OVER YOUR RESPONSE. HE THEN ASKS WHO MAY CLIMB MT. ZENITH?");
        display_img(1619); 
        player_choice("THE STRONGEST FIGHTERS", 12952, "THE STRONGEST WILLED", 12953);
        break;
        
      case 6477:
        position_prompt("GREED IS A CHOLAR TO MAN, THE ENDLESS TOIL OF DISSATISFACTION. YOU MAY NOT CONTINUE YOUR QUEST.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 6808:
        position_prompt("YOU WEILD YOUR BOW AND STALK THE MOUNTAIN SIDE, THE AIR IS COOL AND STILL.");
        display_img(53); 
        player_choice("SHOOT OXYLHORN", 13616, "SHOOT TERRACAW", 13617);
        break;
        
      case 6809:
        position_prompt("YOU SEARCH THE PATH SPARCELY COVERED WITH BERRIES. THE MOUNTAINOUS BEASTS HAVE CONSUMED THEM ALL.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
             
      case 7722:
        position_prompt("YOU EXIT THE CAVE TO BE GREETED BY FRESH AIR. YOU ARE MUCH HIGHER NOW AND ARE STANDING IN FRONT OF TWO GATES.");
        display_img(7722); 
        player_choice("SILVER GATE", 1618, "BRONZE GATE", 1619);
        break;
        
      case 7723:
        position_prompt("YOU TRAVEL DOWN THE MOUNTAIN PATH TO FIND A BASILISK WAITING FOR YOU. YOU ARE LEFT DEFENCELESS.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 12944:
        position_prompt("YOU REACH A DEAD END.");
        display_img(3236); 
        player_choice("RETRY", 3236, "RETRY", 3236);
        break;
        
      case 12945:
        position_prompt("A PILLAR LIES SOUTH OF YOU.");
        display_img(3236); 
        player_choice("GO NORTH", 25888, "GO WEST", 25889);
        break;
        
      case 12952:
        position_prompt("MAN IS BUT HIS OWN ENEMY, A STRONGEST FIGHTER AGAINST HIMSELF. YOU MAY NOT CONTINUE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 12953:
        position_prompt("THE BRIDGEKEEPER IS PLEASED BY YOUR RESPONSE. WHO IS TO RULE MT. ZENITH?");
        display_img(1619); 
        player_choice("NOONE", 25906, "EVERYONE", 25907);
        break;
        
      case 13616:
        position_prompt("THE OXYLHORN REFUELS YOU TO CONTINUE ONWARD. YOU START TO FEEL SICK AS YOU FIND AN ELDER WIZARDS DWELLING.");
        display_img(13616); 
        player_choice("GO ON", 27232, "ENTER", 27233);
        break;
        
      case 13617:
        position_prompt("THE TERRACLAW REFUELS YOU TO CONTINUE ONWARD. YOU START TO FEEL SICK AS YOU FIND AN ELDER WIZARDS DWELLING.");
        display_img(13616); 
        player_choice("GO ON", 27234, "ENTER", 27235);
        break;
        
      case 25888:
        position_prompt("A PILLAR LIES SOUTH OF YOU.");
        display_img(3236); 
        player_choice("GO NORTH", 51776, "GO WEST", 51777);
        break;
        
      case 25889:
        position_prompt("A PILLAR LIES NORTH OF YOU.");
        display_img(3236); 
        player_choice("GO SOUTH", 12944, "GO WEST", 12944);
        break;
        
      case 25906:
        position_prompt("AFTER CONSIDERING CAREFULLY THE BRIDGEKEEPER ASKS, WHAT IS YOUR FAVORITE COLOR?");
        display_img(1619); 
        player_choice("RED", 51812, "BLUE", 51813);
        break;
        
      case 25907:
        position_prompt("THE LAMENTATIONS OF THE WORLD DERIVE FROM THE REIGN OF MAN. YOU MAY NOT CONTINUE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;      
        
      case 27232:
        position_prompt("YOUR SYMPTOMS WORSEN AS YOU DEVELOPE A TERRIBLE CASE OF THE OXYL BUMPS, YOU ARE LEFT WITHOUT MEDICINE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 27233:
        position_prompt("THE TOWER HAS A SINESTER TONE, YOU LOOK FOR THE WIZARD TO HELP YOUR CASE OF THE OXYL BUMPS.");
        display_img(13616); 
        player_choice("GO TO THIRD FLOOR", 54466, "GO TO FOURTH FLOOR", 54467);
        break;
        
      case 27234:
        position_prompt("YOUR SYMPTOMS WORSEN AS YOU DEVELOPE A TERRIBLE CASE OF THE TERRA FLU, YOU ARE LEFT WITHOUT MEDICINE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 27235:
        position_prompt("THE TOWER HAS A SINESTER TONE, YOU LOOK FOR THE WIZARD TO HELP YOUR CASE OF THE TERRA FLU.");
        display_img(13616); 
        player_choice("GO TO THIRD FLOOR", 27234, "GO TO FOURTH FLOOR", 54471);
        break;
        
      case 51776:
        position_prompt("YOU REACH AN OPENING.");
        display_img(3236); 
        player_choice("GO EAST", 103552, "GO WEST", 103553);
        break;

      case 51777:
        position_prompt("YOU REACH A DEAD END.");
        display_img(3236); 
        player_choice("RETRY", 3236, "RETRY", 3236);
        break;
        
      case 51779:
        position_prompt("A PILLAR LIES WEST OF YOU.");
        display_img(3236); 
        player_choice("GO NORTH", 12944, "GO SOUTH", 12944);
        break;
        
      case 51812:
        position_prompt("BLOOD WILL STAIN THE WORLD RED FROM WAR. NI! YOU MAY NOT CONINTUE.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 51813:
        position_prompt("YOU HAVE PROVED WORTHY TO CROSS THE CHASM. BE WARE, AN ORACLE NEEDS YOUR HELP IF YOU SO CHOOSE NOT TO CROSS.");
        display_img(1619); 
        player_choice("CROSS BRIDGE", 103626, "RESCUE ORACLE", 103627);
        break;
        
      case 54466:
        position_prompt("YOUR SYMPTOMS WORSEN AS YOU CANNOT FIND THE WIZARD, YOU CANNOT CONTINUE YOUR JOUNEY.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 54467:
        position_prompt("THE WIZARD NOTICES YOUR SYMPTOMS AND GRANTS YOU HELP. HE ASKS FOR HIS O'KELLY ELIXAR ON THE THIRD FLOOR.");
        display_img(13616); 
        player_choice("PICK UP BOTTLE ON FLOOR", 108934, "PICK UP BOTTLE ON SHELF", 108935);
        break;
        
      case 54471:
        position_prompt("THE WIZARD NOTICES YOUR SYMPTOMS AND GRANTS YOU HELP. HE ASKS FOR HIS MAUVE ELIXAR ON THE THIRD FLOOR.");
        display_img(13616); 
        player_choice("PICK UP BOTTLE ON FLOOR", 108943, "PICK UP BOTTLE ON SHELF", 108943);
        break;
        
      case 103552:
        position_prompt("A PILLAR LIES EAST OF YOU.");
        display_img(3236); 
        player_choice("GO NORTH", 12944, "GO SOUTH", 12944);
        break;
        
      case 103553:
        position_prompt("A PILLAR LIES SOUTH OF YOU.");
        display_img(3236); 
        player_choice("GO NORTH", 207106, "GO WEST", 12944);
        break;
        
      case 103626:
        position_prompt("IT SEEMS YOUR OWN GREED OF CONQUEST HAS BLURRED YOUR HEROISM. THE BRIDGEKEEPER CUTS THE BRIDGE AS YOU CROSS.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 103627:
        position_prompt("YOU CONTINUE DOWN THE PATH OPPOSING FROM THE BRIDGE. AN OLD STONE OUTPOST STANDS, GUARDED BY THE GUARDIAN DRAGON HIX.");
        display_img(103627); 
        player_choice("FIGHT HIX", 207254, "SNEAK UPSTAIRS", 207255);
        break;
        
      case 108934:
        position_prompt("YOU RETURN WITH THE ELIXAR. HE THEN ASKS FOR YOLK OF THE GRIFFITH EGG.");
        display_img(13616); 
        player_choice("FIRST FLOOR", 217868, "SECOND FLOOR", 108935);
        break;
        
      case 108935:
        position_prompt("THE WIZARD BREWS HIS POTION, BUT IT SEEMS YOU USED THE WRONG INGREDIENTS AS YOUR SYMPTOMS WORSEN.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 108942:
        position_prompt("THE WIZARD BREWS HIS POTION, BUT IT SEEMS YOU USED THE WRONG INGREDIENTS AS YOUR SYMPTOMS WORSEN.");
        display_img(10); 
        player_choice("RESTART", 1, "RESTART", 1);
        break;
        
      case 108943:
        position_prompt("YOU RETURN WITH THE ELIXAR. HE THEN ASKS FOR YOLK OF THE GRIFFITH EGG.");
        display_img(13616); 
        player_choice("FIRST FLOOR", 217886, "SECOND FLOOR", 108942);
        break;
        
      case 207106:
        position_prompt("YOU REACH THE EXIT OF THE MAZE OF GALADORE. DUSK BEGINS TO SETTLE AS YOU SET BACK ON THE TRAIL, YOU APPROACH A FORK.");
        display_img(207106); 
        player_choice("FOLLOW THE HIGHCROFT ROUTE", 414212, "FOLLOW THE PARRYHOG PASS", 414213);
        break;
        
      case 207254:
        position_prompt("THE GREAT HIX FALLS WITH A SWIFT BLOW TO THE HEAD. THE ORACLE ADMIRES YOUR BRAVERY AND LEADS YOU TO THE HIGH MOUNTAIN.");
        display_img(207106); 
        player_choice("FOLLOW THE HIGHCROFT ROUTE", 414212, "FOLLOW THE PARRYHOG PASS", 414213);
        break;
        
      case 207255:
        position_prompt("YOU RESCUE THE ORACLE WITHOUT BEING SEEN BY HIX. THE ORACLE ADMIRES YOUR CUNNING AND LEADS YOU TO THE HIGH MOUNTAIN.");
        display_img(207106); 
        player_choice("FOLLOW THE HIGHCROFT ROUTE", 414212, "FOLLOW THE PARRYHOG PASS", 414213);
        break;
        
      case 217868:
        position_prompt("YOU RETURN WITH THE GRIFFITH EGG. THE LAST INGREDIENT HE ASKS FOR IS THE APRICOT ANTIPOTION ON THE SECOND FLOOR.");
        display_img(13616); 
        player_choice("PICK UP LEFT BOTTLE", 435736, "PICK UP RIGHT BOTTLE", 108935);
        break;
        
      case 217886:
        position_prompt("YOU RETURN WITH THE GRIFFITH EGG. THE LAST INGREDIENT HE ASKS FOR IS THE VERMILION ANTIPOTION ON THE SECOND FLOOR.");
        display_img(13616); 
        player_choice("PICK UP LEFT BOTTLE", 108942, "PICK UP RIGHT BOTTLE", 435736);
        break;
        
      case 414212:
        position_prompt("THE HIGHCROFT ROUTE IS SLOW AND BRINGS YOU TO THE ZENITH GATES AFTER DUSK. YOU APPEAR BEFORE TWO LEGENDARY SWORDS.");
        display_img(414212); 
        player_choice("SWORD OF TERRA", 828424, "SWORD OF ATGALE", 828425);
        break;
        
      case 414213:
        position_prompt("THE PARRYHOG ROUTE IS QUICK AND BRINGS YOU TO THE ZENITH GATES AFTER DAWN. YOU APPEAR BEFORE TWO LEGENDARY SWORDS.");
        display_img(414212); 
        player_choice("SWORD OF TERRA", 828426, "SWORD OF ATGALE", 828427);
        break;
        
      case 435736:
        position_prompt("THE WIZARD BREWS HIS POTION AND YOU FEEL YOUR SYMPTOMS CLEAR. YOU THANK THE WIZARD AND RETURN TO THE PATH BEFORE IT SPLITS.");
        display_img(207106); 
        player_choice("FOLLOW THE HIGHCROFT ROUTE", 414212, "FOLLOW THE PARRYHOG PASS", 414213);
        break;
        
      case 828424:
        position_prompt("YOU WEILD THE SWORD OF TERRA. YOU HEAR ARAGON, THE SPIRIT OF THE MOUNTAIN APPROACH. HE CHARGES AT YOU.");
        display_img(828424); 
        player_choice("JUMP", 1656848, "BLOCK", 1656849);
        break;
        
      case 828425:
        position_prompt("YOU WEILD THE SWORD OF ATGALE. YOU HEAR ARAGON, THE SPIRIT OF THE MOUNTAIN APPROACH. HE CHARGES AT YOU.");
        display_img(828424); 
        player_choice("JUMP", 1656848, "BLOCK", 1656851);
        break;
        
      case 828426:
        position_prompt("YOU WEILD THE SWORD OF TERRA. YOU HEAR ARAGON, THE SPIRIT OF THE MOUNTAIN APPROACH. HE CHARGES AT YOU.");
        display_img(828424); 
        player_choice("JUMP", 1656848, "BLOCK", 1656853);
        break;
        
      case 828427:
        position_prompt("YOU WEILD THE SWORD OF ATGALE. YOU HEAR ARAGON, THE SPIRIT OF THE MOUNTAIN APPROACH. HE CHARGES AT YOU.");
        display_img(828424); 
        player_choice("JUMP", 1656848, "BLOCK", 1656855);
        break;
        
      case 1656848:
        position_prompt("AS YOU JUMP, ARAGON LEAPS WITH HIS MIGHTY LEGS AND KNOCKS YOU TO THE GROUND IN A GREAT THUD.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 1656849:
        position_prompt("ARAGONS FANGS CLASH WITH THE SWORD OF TERRA, MAKING A THUNDEROUS BOOM.");
        display_img(828424); 
        player_choice("STAB CHEST", 3313698, "STAB HEAD", 3313699);
        break;
              
      case 1656851:
        position_prompt("ARAGONS FANGS CLASH WITH THE SWORD OF ATGALE, MAKING A THUNDEROUS BOOM.");
        display_img(828424); 
        player_choice("STAB CHEST", 3313702, "STAB HEAD", 3313703);
        break;
        
      case 1656853:
        position_prompt("ARAGONS FANGS CLASH WITH THE SWORD OF TERRA, MAKING A THUNDEROUS BOOM.");
        display_img(828424); 
        player_choice("STAB CHEST", 3313706, "STAB HEAD", 3313707);
        break;
              
      case 1656855:
        position_prompt("ARAGONS FANGS CLASH WITH THE SWORD OF ATGALE, MAKING A THUNDEROUS BOOM.");
        display_img(828424); 
        player_choice("STAB CHEST", 3313710, "STAB HEAD", 3313711);
        break;
        
      case 3313696:
        position_prompt("YOU RUSH TO SAFETY FROM THE MOUNTAIN PEAK. YOU STAND BEFORE TWO PATHS LEADING BACK TO THE TOP.");
        display_img(207106); 
        player_choice("FOLLOW THE HIGHCROFT ROUTE", 414212, "FOLLOW THE PARRYHOG PASS", 414213);
        break;
        
      case 3313698:
        position_prompt("THE THICK SKIN OF ARAGON MAKES LITTLE DAMAGE, HE ATTACKS YOU AFTER YOUR HIT.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 3313699:
        position_prompt("ARAGON WINCES IN PAIN. YOU WEILD THE LEGENDARY SWORD, ITS POWER RADIATES THROUGH YOU.");
        display_img(828424); 
        player_choice("SUMMON STRENGTH OF THE EARTH", 6627398, "SUMMON STRENGTH OF THE WINDS", 6627399);
        break;
        
      case 3313702:
        position_prompt("THE THICK SKIN OF ARAGON MAKES LITTLE DAMAGE, HE ATTACKS YOU AFTER YOUR HIT.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 3313703:
        position_prompt("ARAGON WINCES IN PAIN. YOU WEILD THE LEGENDARY SWORD, ITS POWER RADIATES THROUGH YOU.");
        display_img(828424); 
        player_choice("SUMMON STRENGTH OF THE EARTH", 6627399, "SUMMON STRENGTH OF THE WINDS", 6627407);
        break;
        
      case 3313706:
        position_prompt("THE THICK SKIN OF ARAGON MAKES LITTLE DAMAGE, HE ATTACKS YOU AFTER YOUR HIT.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 3313707:
        position_prompt("ARAGON WINCES IN PAIN. YOU WEILD THE LEGENDARY SWORD, ITS POWER RADIATES THROUGH YOU.");
        display_img(828424); 
        player_choice("SUMMON STRENGTH OF THE EARTH", 6627414, "SUMMON STRENGTH OF THE WINDS", 6627399);
        break;
        
      case 3313710:
        position_prompt("THE THICK SKIN OF ARAGON MAKES LITTLE DAMAGE, HE ATTACKS YOU AFTER YOUR HIT.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 3313711:
        position_prompt("ARAGON WINCES IN PAIN. YOU WEILD THE LEGENDARY SWORD, ITS POWER RADIATES THROUGH YOU.");
        display_img(828424); 
        player_choice("SUMMON STRENGTH OF THE EARTH", 6627399, "SUMMON STRENGTH OF THE WINDS", 6627422);
        break;
        
      case 6627398:
        position_prompt("THE STRENGTH OF THE EARTH RUNS THROUGH YOU AS YOUR SWORD BEGINS TO GLOW. YOU EYE ARAGON DOWN.");
        display_img(828424); 
        player_choice("CRUSH WITH BOULDER", 13254796, "ATTACK WITH EARTHQUAKE", 13254797);
        break;
        
      case 6627399:
        position_prompt("YOUR SWORD IS NOT ABLE TO SUMMON THAT STRENGTH, YOU ARE DEFENSELESS TO ARAGON'S ATTACK.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 6627407:
        position_prompt("THE STRENGTH OF THE WINDS RUN THROUGH YOU AS YOUR SWORD BEGINS TO GLOW. YOU EYE ARAGON DOWN.");
        display_img(828424); 
        player_choice("BLOW WITH HURRICANE", 13254814, "ATTACK WITH LIGHTNING", 13254815);
        break;
        
      case 6627414:
        position_prompt("THE STRENGTH OF THE EARTH RUNS THROUGH YOU AS YOUR SWORD BEGINS TO GLOW. YOU EYE ARAGON DOWN.");
        display_img(828424); 
        player_choice("CRUSH WITH BOULDER", 13254828, "ATTACK WITH EARTHQUAKE", 13254829);
        break;
        
      case 6627422:
        position_prompt("THE STRENGTH OF THE WINDS RUN THROUGH YOU AS YOUR SWORD BEGINS TO GLOW. YOU EYE ARAGON DOWN.");
        display_img(828424); 
        player_choice("CRUSH WITH BOULDER", 13254844, "ATTACK WITH EARTHQUAKE", 13254845);
        break;
        
      case 13254796:
        position_prompt("THE SWORD OF TERRA LIFTS A BOULDER TO CRUSH ARAGON. HOWEVER, YOU DO NOT SEE HIS ARACHNID OFFSPRING AS THEY ATTACK.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 13254797:
        position_prompt("THE SWORD OF TERRA SHAKES THE EARTH WITH MIGHT, ARAGON'S LEGS KEEP HIM BALANCED AS HIS FANGS PIERCE YOUR SKIN.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 13254814:
        position_prompt("THE SWORD OF ATGALE WHIRLS A HURRICANE AT ATGALE. HE SHOOTS A WEB TO CATCH HIMSELF, THEN ONE TO CATCH YOU.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 13254815:
        position_prompt("THE SWORD OF ATGALE STRIKES LIGHTNING DOWN ON ARAGON, BUT DARKNESS HIDES HIS ARACHNID OFFSPRING AS THEY ATTACK.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 13254828:
        position_prompt("THE SWORD OF TERRA LIFTS A GREAT BOULDER OVER ARAGON CRUSHING HIM. HIS HEAD POKES OUT FROM THE BOULDER.");
        display_img(828424); 
        player_choice("KILL ARAGON", 26509656, "SHOW MERCY", 26509657);
        break;
        
      case 13254829:
        position_prompt("THE SWORD OF TERRA SHAKES THE EARTH WITH MIGHT, ARAGON'S LEGS KEEP HIM BALANCED AS HIS FANGS PIERCE YOUR SKIN.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 13254844:
        position_prompt("THE SWORD OF ATGALE WHIRLS A HURRICANE AT ATGALE. HE SHOOTS A WEB TO CATCH HIMSELF, THEN ONE TO CATCH YOU.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      case 13254845:
        position_prompt("THE SWORD OF ATGALE STRIKES ARAGON DOWN WITH A LARGE LIGHTNING STRIKE, HIS LEGS TWITCH AS HE LIES.");
        display_img(828424); 
        player_choice("KILL ARAGON", 26509656, "SHOW MERCY", 26509657);
        break;
        
      case 26509656:
        position_prompt("ARAGON IS DEFEATED. A BURST OF ENERGY SURGES THROUGH MT. ZENITH AS A NEW WARRIOR HAS ARISEN. CONGRATULATIONS BRAVE WARRIOR.");
        display_img(26509656); 
        player_choice("CREDITS", -1, "RESTART GAME", 1);
        break;
        
      case 26509657:
        position_prompt("YOU SPARE ARAGON'S LIFE, BUT HIS ARMY OF ARACHNID OFFSPRING DO NOT SPARE YOURS.");
        display_img(10); 
        player_choice("RETRY", 3313696, "RETRY", 3313696);
        break;
        
      default:
        break; 
    }
  }

