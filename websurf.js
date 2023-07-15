/*************** 
 * WebSurf Task *
 ***************/

import { core, data, sound, util, visual } from './lib/psychojs-2021.2.3.js';
const { PsychoJS } = core;
const { TrialHandler } = data;
const { Scheduler } = util;
//some handy aliases as in the psychopy scripts;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;

const psychoJS = new PsychoJS({
  debug: true
});

let expName = 'WebSurf'; 
let expInfo = {'Participant': '', 'session': '001', "group": ""};

psychoJS.start({
  expName: expName,
  expInfo: expInfo
})

psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([0, 0, 0]),
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
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
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
    newInstruction(INSTD.format(sec), {y: -0.3})
    var skipButton = newImage(SKIP, {style: {
      width: "200px", height: "150px"}, x: 0.3, y: 0.45})
    var stayButton = newImage(STAY, {style: {
      width: "200px", height: "150px"}, x: -0.3, y: 0.45})
    newImage(logo, {style: {
      width: "150px", height: "150px"}, y: -0.65})
    var bar = newProgressBar(sec, {y: -0.05});
    var key, start = new Date();
    if (keys === 'Digit2') key = await KeyPress(keys);
    else {
      //while (key = await KeyPress(keys)) console.log(key);
      key = await KeyPress(keys);
      answer.reactionTime = timeFrom(start)
      answer.keyPress = key.code.slice(-1)
      if (key.code === 'Digit1') {
        skipButton.style.display = "none"
        stayButton.style.display = "none"
        bar()
        newImage(QUIT, {style: {
          width: "200px", height: "150px"}, x: 0.3, y: 0.45})
        var quitKey = await KeyPress('Digit2', sec)
        answer.code = quitKey.code === 'Digit2' ? "quit" : "stay"
      } else answer.code = "skip";
    }
    answer.offsetOfOffer = timeFrom(start);
    return answer;
}

var breakList = [0, 40, 60, 140, 999999], blockNum = 0; 
//var breakList = [0, 480, 960, 1440, 999999], blockNum = 0; 
var baseTime;
var nTrial = 1;

async function showNumbers() {
  var numbers = []
  for (var i = 0; i < 5; ++ i) {
      var number = randint(1, 4)
      numbers.push(number)
      newInstruction(number, {
        style: { fontSize: "70px" },
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
    for (var i = 0; i < 4; ++ i) {
      perm.push(Array.from({length: 62}, (_, index) => index + 1));
      shuffleArray(perm[i])
    }
    var counter = [0, 0, 0, 0]

    baseTime = Date.now()

    while (true) {
      addData("trial", nTrial)
      addData("onset of trial", timeFrom(baseTime))

      if (timeFrom(baseTime) >= breakList[blockNum]) {
        newInstruction("+", {style: {fontSize: "100px", fontWeight: "bold"}})
        await Timer(1) //test only, change to 40s for final copy
        clearScreen()
        blockNum++
      }

      var cue = nTrial % 4
      var delay = randint(3, 30)
      if (cue === 1) shuffleArray(BLOCKORDER)

      addData("delay", delay)

      var logo = BLOCKORDER[cue].Logo, order = BLOCKORDER[cue].Order
      var vidnum = perm[cue][counter[cue]++]

      addData("onset of offer", timeFrom(baseTime))
      var reaction = await showOffer(delay, ['Digit1', 'Digit2'], logo)
      clearScreen()
      addData("offset of offer", timeFrom(baseTime))
      addData("cuelogo", logo)
      addData("keypress", reaction.keyPress)
      addData("decision", reaction.code)
      addData("rt decision", reaction.reactionTime)

      if (reaction.code === 'stay') {
        var clipStart = Date.now()
        addData("onset of clip", timeFrom(baseTime))
        var videoDOM = newVideo(VIDPATH.format(order, vidnum), {
          y: -0.05, style: { width: "1000px", height: "562.5px" }
        });
        newImage(logo, {style: {
        width: "150px", height: "150px"}, y: -0.65})
        await VideoEnded(videoDOM)
        addData("offset of clip", timeFrom(baseTime))
        addData("duration of clip", timeFrom(clipStart))
        var scale = newRatingScale(4, {y: 0.5})
        var scaleResponse = await scale()

        addData("rating", scaleResponse.code)
        addData("rt rating", scaleResponse.reactionTime)

        clearScreen()
        addData("onset of numbers", timeFrom(baseTime))
        var numbers = await showNumbers()
        addData("travelcost", numbers)
        addData("cost key", numbers)
        addData("offset of numbers", timeFrom(baseTime))
      }
      nTrial++;
      addData("offset of trial", timeFrom(baseTime))

      if (timeFrom(baseTime) > 3 * 60) { //change to 35*60
        clearScreen()
        newInstruction(INSTK)
        await Timer(3) //change to 20 later
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
  document.body.style.background = "rgb(145, 145, 145)"
  return main()
}

psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); }, experiment);
