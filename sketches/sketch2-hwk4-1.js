// Instance-mode sketch for tab 2
// HWK #4 Clock A: Interactive Tea Brewing Clock
// Context: cooking / tea brewing
// Audience: tea lovers and people who are not familiar with tea brewing time

registerSketch('sk2', function (p) {
  const CANVAS_SIZE = 800;

  let teas;
  let selectedTeaIndex = 0;
  let brewStartMillis = 0;
  let isBrewing = false;

  // Visual feedback variables
  let cupClickPulse = 0;
  let readyPulse = 0;

  // Button layout
  let teaButtons = [];

  // Cup position and size
  const cup = {
    x: 400,
    y: 470,
    topW: 270,
    bottomW: 190,
    h: 320
  };

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    p.textFont('monospace');
    p.angleMode(p.RADIANS);

    // Different teas have different colors and brewing times.
    teas = [
      {
        name: 'Green Tea',
        shortName: 'Green',
        brewSeconds: 120,
        lightColor: [195, 220, 155],
        darkColor: [70, 125, 60],
        accentColor: [95, 145, 75]
      },
      {
        name: 'Red / Black Tea',
        shortName: 'Red',
        brewSeconds: 240,
        lightColor: [215, 145, 85],
        darkColor: [105, 48, 28],
        accentColor: [150, 72, 45]
      },
      {
        name: 'Oolong Tea',
        shortName: 'Oolong',
        brewSeconds: 180,
        lightColor: [220, 185, 105],
        darkColor: [130, 82, 42],
        accentColor: [170, 115, 60]
      },
      {
        name: 'Herbal Tea',
        shortName: 'Herbal',
        brewSeconds: 300,
        lightColor: [235, 178, 175],
        darkColor: [165, 75, 105],
        accentColor: [190, 95, 125]
      }
    ];

    createTeaButtons();
  };

  p.draw = function () {
    const h = p.hour();
    const m = p.minute();
    const s = p.second();

    const selectedTea = teas[selectedTeaIndex];

    // Timer does not move until the user clicks the tea cup.
    let elapsedSeconds = 0;

    if (isBrewing) {
      elapsedSeconds = (p.millis() - brewStartMillis) / 1000;
    }

    const brewProgress = p.constrain(
      elapsedSeconds / selectedTea.brewSeconds,
      0,
      1
    );

    // After the tea is ready, this value slowly increases and makes the tea look over-brewed.
    const overBrewProgress = p.constrain(
      (elapsedSeconds - selectedTea.brewSeconds) / 60,
      0,
      1
    );

    drawKitchenBackground(h, m);
    drawTitle(h, m, s);
    drawTeaStatus(selectedTea, elapsedSeconds, brewProgress);
    drawSteam(brewProgress, s);
    drawTeaCup(selectedTea, brewProgress, overBrewProgress, elapsedSeconds);
    drawTeaButtons();
    drawFrame();
  };

  p.mousePressed = function () {
    // First check if user clicked one of the tea type buttons.
    for (let i = 0; i < teaButtons.length; i++) {
      const b = teaButtons[i];

      if (
        p.mouseX >= b.x &&
        p.mouseX <= b.x + b.w &&
        p.mouseY >= b.y &&
        p.mouseY <= b.y + b.h
      ) {
        selectedTeaIndex = i;

        // Choosing a new tea resets the clock and waits for cup click.
        isBrewing = false;
        brewStartMillis = 0;
        return;
      }
    }

    // Then check if user clicked the tea cup.
    if (isMouseInsideCup()) {
      brewStartMillis = p.millis();
      isBrewing = true;
    }
  };

  p.keyPressed = function () {
    // Press R to reset the current tea timer.
    // It returns to waiting mode instead of starting automatically.
    if (p.key === 'r' || p.key === 'R') {
      isBrewing = false;
      brewStartMillis = 0;
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE);
  };

  // ------------------------------------------------------------
  // Setup helper
  // ------------------------------------------------------------

  function createTeaButtons() {
    teaButtons = [];

    const buttonW = 145;
    const buttonH = 44;
    const gap = 18;
    const totalW = teas.length * buttonW + (teas.length - 1) * gap;
    const startX = (p.width - totalW) / 2;
    const y = 700;

    for (let i = 0; i < teas.length; i++) {
      teaButtons.push({
        x: startX + i * (buttonW + gap),
        y: y,
        w: buttonW,
        h: buttonH
      });
    }
  }

  function isMouseInsideCup() {
    const topY = cup.y - cup.h / 2;
    const bottomY = cup.y + cup.h / 2;
    const leftX = cup.x - cup.topW / 2;
    const rightX = cup.x + cup.topW / 2;

    return (
      p.mouseX >= leftX &&
      p.mouseX <= rightX &&
      p.mouseY >= topY &&
      p.mouseY <= bottomY
    );
  }

  // ------------------------------------------------------------
  // Drawing functions
  // ------------------------------------------------------------

  function drawKitchenBackground(currentHour, currentMinute) {
  // hour() and minute() change the mood of the background.
  // This connects the brewing timer to the real time of day.
  const dayProgress = (currentHour * 60 + currentMinute) / 1440;

  const morning = p.color(255, 241, 211);
  const afternoon = p.color(240, 231, 205);
  const evening = p.color(215, 226, 238);

  let bg;

  if (dayProgress < 0.5) {
    bg = p.lerpColor(morning, afternoon, dayProgress * 2);
  } else {
    bg = p.lerpColor(afternoon, evening, (dayProgress - 0.5) * 2);
  }

  p.background(bg);

  // Table surface moved lower so it does not cut through the cup.
  p.noStroke();
  p.fill(220, 198, 165, 150);
  p.rect(0, 690, p.width, 110);

  // Removed the pale background circle behind the cup.
}

  function drawTitle(currentHour, currentMinute, currentSecond) {
    p.noStroke();
    p.fill(45, 40, 35);
    p.textAlign(p.CENTER, p.CENTER);

    p.textSize(30);
    p.text('Interactive Tea Brewing Clock', p.width / 2, 45);

    p.textSize(14);
    p.text(
      'Current time: ' +
        p.nf(currentHour, 2) +
        ':' +
        p.nf(currentMinute, 2) +
        ':' +
        p.nf(currentSecond, 2),
      p.width / 2,
      78
    );

    p.textSize(13);
    p.fill(80, 72, 64);
    p.text(
      'Choose a tea type, then click the tea cup to start brewing. Press R to reset.',
      p.width / 2,
      105
    );
  }

  function getStrengthLabel(brewProgress, elapsedSeconds, selectedTea) {
  if (elapsedSeconds > selectedTea.brewSeconds + 60) {
    return 'Over-brewed';
  } else if (brewProgress < 0.2) {
    return 'Very light';
  } else if (brewProgress < 0.45) {
    return 'Light';
  } else if (brewProgress < 0.75) {
    return 'Medium';
  } else if (brewProgress < 1) {
    return 'Strong';
  } else {
    return 'Ready';
  }
}

  function drawTeaStatus(selectedTea, elapsedSeconds, brewProgress) {
  const timeLeft = selectedTea.brewSeconds - elapsedSeconds;
  const strength = getStrengthLabel(brewProgress, elapsedSeconds, selectedTea);

  let status = 'Waiting to start';

  if (isBrewing) {
    if (brewProgress < 0.05) {
      status = 'Just started';
    } else if (brewProgress < 0.5) {
      status = 'Brewing';
    } else if (brewProgress < 1) {
      status = 'Almost ready';
    } else if (elapsedSeconds < selectedTea.brewSeconds + 60) {
      status = 'Ready to drink';
    } else {
      status = 'Over-brewed';
    }
  }

  // Wider and taller card so all information stays inside.
  const cardX = 85;
  const cardY = 125;
  const cardW = 630;
  const cardH = 145;

  p.noStroke();
  p.fill(255, 255, 255, 205);
  p.rect(cardX, cardY, cardW, cardH, 18);

  p.textAlign(p.LEFT, p.CENTER);

  // Main title
  p.fill(35, 32, 28);
  p.textSize(17);
  p.text('Selected tea: ' + selectedTea.name, cardX + 28, cardY + 30);

  // Serving assumption
  p.fill(85, 78, 70);
  p.textSize(12);
  p.text('Based on one standard cup serving.', cardX + 28, cardY + 56);

  // Brew time
  p.fill(45, 40, 35);
  p.textSize(13);
  p.text(
    'Recommended brew time: ' + formatTime(selectedTea.brewSeconds),
    cardX + 28,
    cardY + 84
  );

  let timerText;

  if (!isBrewing) {
    timerText = 'Click the tea cup to start';
  } else if (timeLeft > 0) {
    timerText = 'Time left: ' + formatTime(timeLeft);
  } else {
    timerText = 'Extra time: +' + formatTime(Math.abs(timeLeft));
  }

  // Time left and strength are now on separate lines.
  // This prevents the text from running outside the card.
  p.fill(35, 32, 28);
  p.textSize(14);
  p.text(timerText, cardX + 28, cardY + 112);

  p.fill(70, 62, 55);
  p.textSize(13);
  p.text(
    'Strength: ' + strength + '   |   Status: ' + status,
    cardX + 28,
    cardY + 134
  );
}

  function drawTeaCup(selectedTea, brewProgress, overBrewProgress, elapsedSeconds) {
    const topY = cup.y - cup.h / 2;
    const bottomY = cup.y + cup.h / 2;
    const topLeftX = cup.x - cup.topW / 2;
    const topRightX = cup.x + cup.topW / 2;
    const bottomLeftX = cup.x - cup.bottomW / 2;
    const bottomRightX = cup.x + cup.bottomW / 2;

    // Cup shadow
    p.noStroke();
    p.fill(80, 55, 35, 40);
    p.ellipse(cup.x, bottomY + 35, 330, 42);

    // Cup glass body
    p.noStroke();
    p.fill(255, 255, 255, 90);
    p.quad(topLeftX, topY, topRightX, topY, bottomRightX, bottomY, bottomLeftX, bottomY);

    // Tea color changes based on selected tea type and brewing progress.
    const lightTea = p.color(
      selectedTea.lightColor[0],
      selectedTea.lightColor[1],
      selectedTea.lightColor[2]
    );

    const darkTea = p.color(
      selectedTea.darkColor[0],
      selectedTea.darkColor[1],
      selectedTea.darkColor[2]
    );

    let teaColor = p.lerpColor(lightTea, darkTea, brewProgress);

    // If tea goes past recommended time, it becomes darker and muddy.
    if (overBrewProgress > 0) {
      teaColor = p.lerpColor(teaColor, p.color(55, 35, 25), overBrewProgress);
    }

    // Water level shows timer progress.
    const liquidTopY = p.map(brewProgress, 0, 1, bottomY - 8, topY + 38);

    const liquidLeftX = p.lerp(bottomLeftX, topLeftX, (bottomY - liquidTopY) / cup.h) + 9;
    const liquidRightX = p.lerp(bottomRightX, topRightX, (bottomY - liquidTopY) / cup.h) - 9;

    const wave = p.sin(p.millis() * 0.004) * 4;

    p.noStroke();
    p.fill(teaColor);
    p.beginShape();
    p.vertex(liquidLeftX, liquidTopY + wave);
    p.vertex((liquidLeftX + liquidRightX) / 2, liquidTopY - wave);
    p.vertex(liquidRightX, liquidTopY + wave);
    p.vertex(bottomRightX - 10, bottomY - 8);
    p.vertex(bottomLeftX + 10, bottomY - 8);
    p.endShape(p.CLOSE);

    drawBubbles(liquidTopY, topY, bottomY, topLeftX, topRightX, bottomLeftX, bottomRightX);

    // Cup outline
    p.noFill();
    p.stroke(65, 58, 50);
    p.strokeWeight(4);
    p.line(topLeftX, topY, bottomLeftX, bottomY);
    p.line(topRightX, topY, bottomRightX, bottomY);
    p.line(bottomLeftX, bottomY, bottomRightX, bottomY);

    // Cup rim
    p.ellipse(cup.x, topY, cup.topW, 42);

    drawBrewStageMarkers(topRightX, topY, bottomY);
    drawTimerOnCup(selectedTea, elapsedSeconds);
  }

  function drawTimerOnCup(selectedTea, elapsedSeconds) {
    const timeLeft = selectedTea.brewSeconds - elapsedSeconds;

    let mainText;
    let subText;

    if (!isBrewing) {
      mainText = 'START';
      subText = 'click cup';
    } else if (timeLeft > 0) {
      mainText = formatTime(timeLeft);
      subText = 'brew left';
    } else {
      mainText = 'READY';
      subText = 'drink now';
    }

    // Small translucent label on the cup so the timer stays readable.
    p.noStroke();
    p.fill(255, 255, 255, 180);
    p.rect(cup.x - 86, cup.y - 36, 172, 72, 16);

    p.textAlign(p.CENTER, p.CENTER);
    p.fill(45, 40, 35);
    p.textSize(26);
    p.text(mainText, cup.x, cup.y - 10);

    p.textSize(13);
    p.fill(75, 68, 60);
    p.text(subText, cup.x, cup.y + 19);
  }

  function drawBrewStageMarkers(topRightX, topY, bottomY) {
  // Move the top marker slightly lower so it does not get hidden by the rim/lid
  const stages = [
    { label: 'Ready', y: topY + 52 },
    { label: 'Halfway', y: (topY + bottomY) / 2 + 5 },
    { label: 'Start', y: bottomY - 6 }
  ];

  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(12);

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];

    p.stroke(70, 62, 55);
    p.strokeWeight(1.8);
    p.line(topRightX + 14, stage.y, topRightX + 58, stage.y);

    p.noStroke();
    p.fill(45, 40, 35);
    p.text(stage.label, topRightX + 66, stage.y);
  }
}

  function drawBubbles(liquidTopY, topY, bottomY, topLeftX, topRightX, bottomLeftX, bottomRightX) {
    const liquidHeight = bottomY - liquidTopY;

    if (!isBrewing || liquidHeight < 20) return;

    // second() affects how many bubbles are visible.
    const bubbleCount = p.floor(p.map(p.second(), 0, 59, 5, 16));

    for (let i = 0; i < bubbleCount; i++) {
      const bubbleY = bottomY - ((p.millis() * 0.04 + i * 38) % liquidHeight);

      const sideAmount = (bottomY - bubbleY) / cup.h;
      const leftX = p.lerp(bottomLeftX, topLeftX, sideAmount) + 22;
      const rightX = p.lerp(bottomRightX, topRightX, sideAmount) - 22;

      const x = p.lerp(leftX, rightX, p.noise(i * 8, p.frameCount * 0.01));
      const size = p.map(p.noise(i * 3.5), 0, 1, 4, 11);

      p.noStroke();
      p.fill(255, 255, 255, 90);
      p.ellipse(x, bubbleY, size, size);
    }
  }

  function drawSteam(brewProgress, currentSecond) {
    if (!isBrewing || brewProgress < 0.03) return;

    const steamAlpha = p.map(brewProgress, 0, 1, 45, 150);

    p.noFill();
    p.stroke(255, 255, 255, steamAlpha);
    p.strokeWeight(3);

    for (let i = 0; i < 5; i++) {
      const startX = 300 + i * 48;
      const startY = 250;
      const steamHeight = 75 + i * 6;

      // millis() makes steam smooth.
      // second() slightly changes the steam pattern each second.
      const motion = p.millis() * 0.002 + i + currentSecond * 0.03;

      p.beginShape();
      for (let j = 0; j < 9; j++) {
        const y = startY - j * (steamHeight / 8);
        const x = startX + p.sin(motion + j * 0.85) * 13;
        p.curveVertex(x, y);
      }
      p.endShape();
    }
  }

  function drawTeaButtons() {
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);

    for (let i = 0; i < teaButtons.length; i++) {
      const b = teaButtons[i];
      const tea = teas[i];
      const selected = i === selectedTeaIndex;

      const accent = p.color(
        tea.accentColor[0],
        tea.accentColor[1],
        tea.accentColor[2]
      );

      if (selected) {
        p.fill(accent);
        p.stroke(45, 40, 35);
        p.strokeWeight(2);
      } else {
        p.fill(255, 255, 255, 170);
        p.stroke(130, 118, 105);
        p.strokeWeight(1);
      }

      p.rect(b.x, b.y, b.w, b.h, 12);

      if (selected) {
        p.fill(255);
      } else {
        p.fill(55, 48, 42);
      }

      p.noStroke();
      p.text(tea.shortName, b.x + b.w / 2, b.y + b.h / 2);
    }
  }

  function drawFrame() {
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  }

  function formatTime(seconds) {
    const totalSeconds = Math.max(0, Math.ceil(seconds));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return p.nf(mins, 2) + ':' + p.nf(secs, 2);
  }
});