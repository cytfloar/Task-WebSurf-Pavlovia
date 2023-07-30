if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

INSTA = `

In this task, you will be selecting short video clips to watch.  

This task will last for 30 minutes. 

During this time, you'll be deciding which video clips to watch from 4 video galleries. 

Each gallery will show videos from a different category, which is indicated by the symbols shown below. 

The sequence of the galleries will remain the same through the whole task.
`

INSTB = `
REMINDERS: 
    
1) If you choose to stay, you can quit at any point after the countdown begins. To QUIT, push the button with your POINTER finger.  

2) Otherwise, once you have pushed a button to stay or skip, DO NOT push another button until the rating bar has appeared 
 
3) You may have to push the button for your video rating twice to advance 
 
4) The numbers between galleries may randomly appear twice in the same location; in these cases, push the button twice to advance 
 
            Press any button to continue. 
`

INSTC = `Push the SKIP button with your MIDDLE finger.`
INSTD = ` Video in {0} seconds ...`
//INSTE = `PUSH BUTTON WITH YOUR MIDDLE FINGER`
INSTF = `Now push the buttons that correspond to the numbers`
INSTG = `Push the STAY button with your POINTER finger`

INSTH = `You will now begin the experiment. 
It will be 30 minutes in total.  
YOU get to decide how to spend your time. 

Press any button to continue.  
`
INSTI = `In between blocks, you will see a white cross-hair appear on the screen 
 
Please try and keep your eyes focused on the cross-hair 
 
Press any button to begin the trials. 
`

INSTJ = `Waiting for experimenter to push space bar...`

INSTK = `The task is now complete. Thank you for your participation!`

STAY = "CategorySymbols/StayButton.jpg"
SKIP = "CategorySymbols/SkipButton.jpg"
QUIT = "CategorySymbols/QuitButton.jpg"
VIDPATH = "Stimuli/{0}/{0}{1}.mp4"
PRACLOGO = "CategorySymbols/Baby_Animal.jpg"

BLOCKORDER = [
  {
    "Order": "ANIMAL",
    "Logo": "CategorySymbols/Baby_Animal.jpg"
  },
  {
    "Order": "DANCE",
    "Logo": "CategorySymbols/Dance.jpg"
  },
  {
    "Order": "LANDSCAPE",
    "Logo": "CategorySymbols/Landscape.jpg"
  },
  {
    "Order": "ART",
    "Logo": "CategorySymbols/Art.png"
  }
]

