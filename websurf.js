/*************** 
 * WebSurf Task 
 * This experiment was created in JavaScript on Jul.14, 2023 by Serena J. Gu *
 ***************/

import { core, data, sound, util, visual } from './lib/psychojs-2021.2.3.js';
const { PsychoJS } = core;
const { TrialHandler } = data;
const { Scheduler } = util;
//some handy aliases as in the psychopy scripts;
const { round } = util;

const psychoJS = new PsychoJS({
  debug: true
});

const BUTTON_WIDTH = "11vw";
const BUTTON_HEIGHT = "13vh";
const LOGO_WIDTH = "7.875vw";
const LOGO_HEIGHT = "12vh";

let expName = 'WebSurf';
let expInfo = { 'participant': '', 'session': '001', "group": "" };

psychoJS.start({
  expName: expName,
  expInfo: expInfo
})

psychoJS.openWindow({
  fullscr: true,
  color: new util.Color("#919191"),
  units: 'height',
  waitBlanking: true
});

psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

async function quitPsychoJS(message, isCompleted) {
  // Check for and save orphaned data
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  psychoJS.window.close();
  psychoJS.quit({ message: message, isCompleted: isCompleted });

  return Scheduler.Event.QUIT;
}

var addData = (a, b) => psychoJS.experiment.addData(a, b);
var nextEntry = () => psychoJS.experiment.nextEntry();

function timeFrom(start) {
  return (Date.now() - start) / 1000;
}

async function showOffer(sec, keys, logo = PRACLOGO) {
  var answer = {}
  clearScreen()
  newInstruction(INSTD.format(sec), { y: -0.3 })
  var skipButton = newImage(SKIP, {
    style: {
      width: BUTTON_WIDTH, height: BUTTON_HEIGHT
    }, x: 0.3, y: 0.45
  })
  var stayButton = newImage(STAY, {
    style: {
      width: BUTTON_WIDTH, height: BUTTON_HEIGHT
    }, x: -0.3, y: 0.45
  })
  newImage(logo, {
    style: {
      width: "7.875vw", height: "12vh"
    }, y: -0.7
  })
  var bar = newProgressBar(sec, { y: -0.05 });
  var key, start = new Date();
  if (keys === 'Digit2') key = await KeyPress(keys);
  else {
    key = await KeyPress(keys);
    answer.reactionTime = timeFrom(start)
    answer.keyPress = key.code.slice(-1)
    if (key.code === 'Digit1') {
      skipButton.style.display = "none"
      stayButton.style.display = "none"
      bar()
      newImage(QUIT, {
        style: {
          width: BUTTON_WIDTH, height: BUTTON_HEIGHT
        }, x: 0.3, y: 0.45
      })
      var quitKey = await KeyPress('Digit2', sec)
      answer.code = quitKey.code === 'Digit2' ? "Quit" : "Stay"
    } else answer.code = "Skip";
  }
  answer.offsetOfOffer = timeFrom(start);
  return answer;
}

// test var breakList = [0, 40, 60, 140, 999999], blockNum = 0; 
// var breakList = [0, 480, 960, 1440, 999999], blockNum = 0;
var baseTime;
var nTrial = 1;

async function showNumbers() {
  var numbers = []
  for (var i = 0; i < 5; ++i) {
    var number = randint(1, 4)
    numbers.push(number)
    newInstruction(number, {
      style: { fontSize: "9vh" },
      x: uniform(-0.8, 0.8),
      y: uniform(-0.8, 0.8)
    })
    await KeyPress("Digit" + number)
    clearScreen()
  }
  return numbers
}

async function main() {
  clearScreen()
  await manyInstructions([INSTA, INSTB, INSTC])
  await showOffer(5.0, 'Digit2')
  clearScreen()
  newInstruction(INSTF)
  clearScreen()
  await showNumbers()
  clearScreen()
  newInstruction(INSTG)
  await KeyPress('Space')
  clearScreen()
  var status = await showOffer(5.0, ['Digit1', 'Digit2'])
  clearScreen()
  await manyInstructions([INSTH, INSTI, INSTJ])

  var perm = []
  for (var i = 0; i < 4; ++i) {
    perm.push(Array.from({ length: 62 }, (_, index) => index + 1));
    shuffleArray(perm[i])
  }
  var counter = [0, 0, 0, 0]

  baseTime = Date.now()

  while (true) {
    addData("trial", nTrial)
    addData("onset of trial", timeFrom(baseTime))

    // if (timeFrom(baseTime) >= breakList[blockNum]) {
    //   newInstruction("+", {style: {fontSize: "100px", fontWeight: "bold"}})
    //   await Timer(40) //test only for 1s, change to 40s for final copy
    //   clearScreen()
    //   blockNum++
    // }

    var cue = nTrial % 4
    var delay = randint(3, 30) // change back to 3, 30
    // if (cue === 1) shuffleArray(BLOCKORDER)

    addData("delay", delay)

    var logo = BLOCKORDER[cue].Logo, order = BLOCKORDER[cue].Order
    var vidnum = perm[cue][counter[cue]++]

    addData("onset of offer", timeFrom(baseTime))
    var reaction = await showOffer(delay, ['Digit1', 'Digit2'], logo)
    clearScreen()
    addData("offset of offer", timeFrom(baseTime))
    addData("cuelogo", order)
    addData("video number", vidnum)
    addData("keypress", reaction.keyPress)
    addData("decision", reaction.code)
    addData("rt decision", reaction.reactionTime)

    if (reaction.code === 'Stay') {
      var clipStart = Date.now()
      addData("onset of clip", timeFrom(baseTime))
      var videoDOM = newVideo(VIDPATH.format(order, vidnum), {
        y: -0.05, style: { width: "50vw", height: "50vh", "object-fit": "cover" }
      });
      newImage(logo, {
        style: {
          width: "7.875vw", height: "12vh"
        }, y: -0.7
      })
      await VideoEnded(videoDOM)
      addData("offset of clip", timeFrom(baseTime))
      addData("duration of clip", timeFrom(clipStart))
      var scale = newRatingScale(4, { y: 0.62 })
      var scaleResponse = await scale()

      addData("rating", scaleResponse.code)
      addData("rt rating", scaleResponse.reactionTime)

      clearScreen()
    }
    nTrial++;
    addData("onset of numbers", timeFrom(baseTime))
    var numbers = await showNumbers()
    addData("travelcost", numbers)
    addData("cost key", numbers)
    addData("offset of numbers", timeFrom(baseTime))

    addData("offset of trial", timeFrom(baseTime))

    if (timeFrom(baseTime) > 30 * 60) { //change to 30*60
      clearScreen()
      newInstruction(INSTK)
      await Timer(20) //change to 20 later
      clearScreen()
      break
    }

    nextEntry()
  }
  quitPsychoJS(INSTK, true);

}


async function experiment() {
  document.getElementById("root").style.display = "none"
  document.getElementById("container").style.display = "initial"
  console.log("background changed");
  document.body.style.background = "rgb(145, 145, 145)"
  return main()
}

psychoJS.scheduleCondition(function () { return (psychoJS.gui.dialogComponent.button === 'OK'); }, experiment);
