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
var nTrial = 1

async function showNumbers() {
  for (var i = 0; i < 4; ++ i) {
      var number = randint(1, 4)
      newInstruction(number, {
        style: { fontSize: "70px" },
        x: uniform(-0.8, 0.8),
        y: uniform(-0.8, 0.8)
      })
      await KeyPress("Digit" + number)
      clearScreen()
  }
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
      if (timeFrom(baseTime) >= breakList[blockNum]) {
        newInstruction("+", {style: {fontSize: "100px", fontWeight: "bold"}});
        await Timer(1) //test only, change to 40s for final copy
        clearScreen()
        blockNum++
      }

      var cue = nTrial % 4
      var delay = randint(3, 30)
      if (cue === 1) shuffleArray(BLOCKORDER)

      var logo = BLOCKORDER[cue].Logo, order = BLOCKORDER[cue].Order
      var vidnum = perm[cue][counter[cue]++]

      var reaction = await showOffer(delay, ['Digit1', 'Digit2'], logo)
      clearScreen()

      if (reaction.code === 'stay') {
        var videoDOM = newVideo(VIDPATH.format(order, vidnum), {
          y: -0.05, style: { width: "1000px", height: "562.5px" }
        });
        newImage(logo, {style: {
        width: "150px", height: "150px"}, y: -0.65})
        await VideoEnded(videoDOM)
        var scale = newRatingScale(4, {y: 0.5})
        var scaleResponse = await scale()
        clearScreen()
        await showNumbers()
      }
      nTrial++;

      if (timeFrom(baseTime) > 3 * 60) { //change to 35*60
        clearScreen()
        newInstruction(INSTK)
        await Timer(3) //change to 20 later
        clearScreen()
        break 
      }

    }
    /* Examples
    var bar = newProgressBar(5.0, {y: -0.05});
    bar()
    await KeyPress("Digit2")
    await Timer(5.0)
    clearScreen()
    newInstruction("init");
    await KeyPress("Space")
    clearScreen()
    newImage("images/Art.png", {y: -0.5})
    newVideo("ART1.mp4")
    var t = await KeyPress("Space")
    console.log(`${JSON.stringify(t)}`)
    clearScreen()
    newInstruction("This will appear for 1 second")
    await Timer(1)
    clearScreen()
    newInstruction("Ended")*/
  }

