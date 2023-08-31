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
INSTPRAC1 = [`Welcome to the Websurf task!

Press space to continue`,

`In this task, you will be selecting short video clips to watch. This task will last for 30 minutes. 

During this time, you'll be deciding which video clips to watch from 4 video galleries.

Press space to continue`,
`Each gallery will show videos from a different category, which is indicated by the symbols shown 
below. The sequence of the galleries will remain the same through the whole task.

Press space to continue`, `Please make sure that you have your sound on and adjusted to a comfortable volume. 

Throughout this task, do not hit the back button on your browser, or else it may not record your participation.

Press space to continue`] 

INSTPRAC2 = `When you arrive at each gallery, you will be told how long you will have to wait before viewing the video 
clip. You will then have the option to stay and wait for the video to load, or skip to move on to the next video gallery. 

Press '1' to stay or '2' to skip to make your choice.

Press space to continue.`

INSTSKIP = [`If you choose to skip, you will be presented with a new video from the next gallery and a new wait time.

Press space to continue.`, `Now please practice pressing '2' to skip.

Press space to continue.`]

INSTNUM = [`As you pass between galleries, numbers will appear randomly around the screen. Press the corresponding 
numbers once to continue on to the next video gallery.

Press space to continue.`, `Now push the keys that correspond to the numbers.

Press space to continue.`]

INSTSTAY = [`If you choose to stay, you will be presented with a wait time before you can watch the video. As soon as 
the countdown starts, you will see the option to quit. 

Press space to continue`, `Now please practice 
pressing '1' to stay; and '2' to quit.

Press space to continue.`]

INSTPRAC3 = [`For each video you watch, please rate how much you liked the video. 1 is the lowest, and 4 is the highest.

Press space to continue.`,

`You will now practice giving ratings to 4 videos. After that, the experiment will begin.

Press space to continue.`]


INSTA = [`The experiment is about to begin.

Remember you will have 30 minutes to decide which videos to watch.`, 
`REMINDERS: 
    
1) Press '1' to STAY or '2' to SKIP. 

2) If you choose to stay, you can quit at any point after the countdown begins. To QUIT, press '2'.  
 
3) The numbers between galleries may randomly appear twice in the same location; in these cases, push the button twice to advance 
 
Press space to continue. `]

PROMPT = ` Video in {0} seconds ...`


INSTB = `
In this task, you will be selecting short video clips to watch.  

This task will last for 30 minutes. 

During this time, you'll be deciding which video clips to watch from 4 video galleries. 

Each gallery will show videos from a different category, which is indicated by the symbols shown below. 

The sequence of the galleries will remain the same through the whole task.
`

INSTC = `Push the SKIP button with your MIDDLE finger.`
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

GALLERY = "CategorySymbols/labelled_gallery.jpg"
STAY = "CategorySymbols/StayButton.jpg"
SKIP = "CategorySymbols/SkipButton.jpg"
QUIT = "CategorySymbols/QuitButton.jpg"
VIDPATH = "Stimuli/{0}/{0}{1}.mp4"
PRACVIDPATH = "Stimuli/PRACTICE/{0}{1}.mp4"
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

