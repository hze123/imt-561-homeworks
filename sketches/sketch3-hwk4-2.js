// Instance-mode sketch for tab 3
// HWK #4 Clock B: Coffee Milk Steaming Clock
// Context: cooking / coffee making
// Audience: coffee lovers and beginners learning milk steaming

registerSketch('sk3', function (p) {
  const CANVAS_SIZE = 800;

  let coffeeStyles;
  let milkTypes;

  let selectedCoffeeIndex = 0;
  let selectedMilkIndex = 0;

  let isSteaming = false;
  let steamStartMillis = 0;

  let coffeeButtons = [];
  let milkButtons = [];

  let cupClickPulse = 0;
  let readyPulse = 0;

  // Moved cup lower and made it slightly smaller so it does not overlap text.
  const cup = {
    x: 400,
    y: 440,
    topW: 230,
    bottomW: 155,
    h: 245
  };

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    p.textFont('monospace');
    p.angleMode(p.RADIANS);

    coffeeStyles = [
      {
        name: 'Latte',
        shortName: 'Latte',
        steamSeconds: 45,
        baseColor: [155, 112, 72],
        accentColor: [156, 112, 72],
        milkBlend: 0.72,
        foamAmount: 0.45,
        foamPattern: 'latte'
      },
      {
        name: 'Cappuccino',
        shortName: 'Capp',
        steamSeconds: 55,
        baseColor: [143, 95, 58],
        accentColor: [128, 88, 54],
        milkBlend: 0.62,
        foamAmount: 0.82,
        foamPattern: 'cappuccino'
      },
      {
        name: 'Flat White',
        shortName: 'Flat',
        steamSeconds: 40,
        baseColor: [132, 88, 52],
        accentColor: [112, 78, 48],
        milkBlend: 0.67,
        foamAmount: 0.30,
        foamPattern: 'flatwhite'
      }
    ];

    milkTypes = [
      {
        name: 'Whole Milk',
        shortName: 'Whole',
        tint: [247, 240, 226],
        accentColor: [216, 204, 186]
      },
      {
        name: 'Oat Milk',
        shortName: 'Oat',
        tint: [235, 226, 205],
        accentColor: [205, 188, 162]
      },
      {
        name: 'Almond Milk',
        shortName: 'Almond',
        tint: [232, 220, 198],
        accentColor: [196, 176, 146]
      }
    ];

    createButtons();
  };

  p.draw = function () {
    const h = p.hour();
    const m = p.minute();
    const s = p.second();

    const selectedCoffee = coffeeStyles[selectedCoffeeIndex];
    const selectedMilk = milkTypes[selectedMilkIndex];

    let elapsedSeconds = 0;

    if (isSteaming) {
      elapsedSeconds = (p.millis() - steamStartMillis) / 1000;
    }

    const progress = p.constrain(
      elapsedSeconds / selectedCoffee.steamSeconds,
      0,
      1
    );

    if (cupClickPulse > 0) {
      cupClickPulse = Math.max(0, cupClickPulse - 0.035);
    }

    if (isSteaming && elapsedSeconds >= selectedCoffee.steamSeconds) {
      readyPulse = (p.sin(p.millis() * 0.008) + 1) / 2;
    } else {
      readyPulse = 0;
    }

    drawBackground(h, m);
    drawTitle(h, m, s);
    drawStatusPanel(selectedCoffee, selectedMilk, elapsedSeconds, progress);

    // Cup is now fully below the status panel.
    drawCup(selectedCoffee, selectedMilk, elapsedSeconds, progress);

    drawCoffeeButtons();
    drawMilkButtons();
    drawFrame();
  };

  p.mousePressed = function () {
    for (let i = 0; i < coffeeButtons.length; i++) {
      const b = coffeeButtons[i];

      if (isInsideRect(p.mouseX, p.mouseY, b)) {
        selectedCoffeeIndex = i;
        resetClock();
        return;
      }
    }

    for (let i = 0; i < milkButtons.length; i++) {
      const b = milkButtons[i];

      if (isInsideRect(p.mouseX, p.mouseY, b)) {
        selectedMilkIndex = i;
        resetClock();
        return;
      }
    }

    if (isMouseInsideCup()) {
      steamStartMillis = p.millis();
      isSteaming = true;
      cupClickPulse = 1;
    }
  };

  p.keyPressed = function () {
    if (p.key === 'r' || p.key === 'R') {
      resetClock();
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE);
  };

  function resetClock() {
    isSteaming = false;
    steamStartMillis = 0;
    cupClickPulse = 0;
    readyPulse = 0;
  }

  function createButtons() {
    coffeeButtons = [];
    milkButtons = [];

    const buttonW = 150;
    const buttonH = 42;
    const gap = 18;

    const totalCoffeeW = coffeeStyles.length * buttonW + (coffeeStyles.length - 1) * gap;
    const coffeeStartX = (p.width - totalCoffeeW) / 2;
    const coffeeY = 655;

    for (let i = 0; i < coffeeStyles.length; i++) {
      coffeeButtons.push({
        x: coffeeStartX + i * (buttonW + gap),
        y: coffeeY,
        w: buttonW,
        h: buttonH
      });
    }

    const totalMilkW = milkTypes.length * buttonW + (milkTypes.length - 1) * gap;
    const milkStartX = (p.width - totalMilkW) / 2;
    const milkY = 720;

    for (let i = 0; i < milkTypes.length; i++) {
      milkButtons.push({
        x: milkStartX + i * (buttonW + gap),
        y: milkY,
        w: buttonW,
        h: buttonH
      });
    }
  }

  function isInsideRect(x, y, rect) {
    return (
      x >= rect.x &&
      x <= rect.x + rect.w &&
      y >= rect.y &&
      y <= rect.y + rect.h
    );
  }

  function isMouseInsideCup() {
    const topY = cup.y - cup.h / 2;
    const bottomY = cup.y + cup.h / 2;
    const leftX = cup.x - cup.topW / 2 - 20;
    const rightX = cup.x + cup.topW / 2 + 20;

    return (
      p.mouseX >= leftX &&
      p.mouseX <= rightX &&
      p.mouseY >= topY &&
      p.mouseY <= bottomY
    );
  }

  function formatTime(seconds) {
    const totalSeconds = Math.max(0, Math.ceil(seconds));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return p.nf(mins, 2) + ':' + p.nf(secs, 2);
  }

  function drawBackground(currentHour, currentMinute) {
    const dayProgress = (currentHour * 60 + currentMinute) / 1440;

    const morning = p.color(245, 232, 214);
    const afternoon = p.color(235, 224, 206);
    const evening = p.color(215, 223, 236);

    let bg;

    if (dayProgress < 0.5) {
      bg = p.lerpColor(morning, afternoon, dayProgress * 2);
    } else {
      bg = p.lerpColor(afternoon, evening, (dayProgress - 0.5) * 2);
    }

    p.background(bg);

    // Bottom counter area only. It no longer touches the main status text.
    p.noStroke();
    p.fill(214, 193, 170, 150);
    p.rect(0, 625, p.width, 175);

    // Soft circle behind cup, moved lower.
    p.fill(255, 255, 255, 60);
    p.ellipse(400, 445, 390, 390);
  }

  function drawTitle(currentHour, currentMinute, currentSecond) {
    p.noStroke();
    p.fill(45, 40, 35);
    p.textAlign(p.CENTER, p.CENTER);

    p.textSize(30);
    p.text('Coffee Milk Steaming Clock', p.width / 2, 38);

    p.textSize(14);
    p.text(
      'Current time: ' +
        p.nf(currentHour, 2) +
        ':' +
        p.nf(currentMinute, 2) +
        ':' +
        p.nf(currentSecond, 2),
      p.width / 2,
      70
    );

    p.textSize(13);
    p.fill(78, 70, 62);
    p.text(
      'Choose a coffee style and milk type, then click the cup to start steaming. Press R to reset.',
      p.width / 2,
      100
    );
  }

  function drawStatusPanel(selectedCoffee, selectedMilk, elapsedSeconds, progress) {
    const timeLeft = selectedCoffee.steamSeconds - elapsedSeconds;

    let status = 'Waiting to start';

    if (isSteaming) {
      if (progress < 0.2) {
        status = 'Stretching milk';
      } else if (progress < 0.8) {
        status = 'Texturing milk';
      } else if (progress < 1) {
        status = 'Almost ready';
      } else if (elapsedSeconds < selectedCoffee.steamSeconds + 20) {
        status = 'Ready to pour';
      } else {
        status = 'Over-steamed';
      }
    }

    // Clear separate text panel.
    p.noStroke();
    p.fill(255, 255, 255, 175);
    p.rect(105, 125, 590, 95, 18);

    p.fill(45, 40, 35);
    p.textAlign(p.LEFT, p.CENTER);

    p.textSize(15);
    p.text('Coffee: ' + selectedCoffee.name, 130, 150);
    p.text('Milk: ' + selectedMilk.name, 410, 150);

    p.textSize(13);
    p.text('Recommended steaming time: ' + formatTime(selectedCoffee.steamSeconds), 130, 178);

    let timerText;

    if (!isSteaming) {
      timerText = 'Click the cup to start';
    } else if (timeLeft > 0) {
      timerText = 'Time left: ' + formatTime(timeLeft);
    } else {
      timerText = 'Extra time: +' + formatTime(Math.abs(timeLeft));
    }

    p.text(timerText + '   |   Status: ' + status, 130, 205);
  }

  function drawCup(selectedCoffee, selectedMilk, elapsedSeconds, progress) {
    const topY = cup.y - cup.h / 2;
    const bottomY = cup.y + cup.h / 2;
    const topLeftX = cup.x - cup.topW / 2;
    const topRightX = cup.x + cup.topW / 2;
    const bottomLeftX = cup.x - cup.bottomW / 2;
    const bottomRightX = cup.x + cup.bottomW / 2;

    drawProgressRing(selectedCoffee, progress);

    // Shadow
    p.noStroke();
    p.fill(80, 55, 35, 40);
    p.ellipse(cup.x, bottomY + 32, 300, 38);

    // Straw moved lower so it stays away from the status panel.
    p.stroke(108, 78, 50);
    p.strokeWeight(5);
    p.line(topLeftX + 55, topY - 55, topLeftX + 38, topY + 18);
    p.line(topLeftX + 25, topY - 55, topLeftX + 55, topY - 55);

    // Handle
    p.noFill();
    p.stroke(85, 72, 60);
    p.strokeWeight(7);
    p.ellipse(topRightX + 36, cup.y + 8, 75, 108);

    p.stroke(250, 245, 236);
    p.strokeWeight(15);
    p.ellipse(topRightX + 36, cup.y + 8, 45, 76);

    // Cup body
    p.noStroke();
    p.fill(255, 255, 255, 95);
    p.quad(topLeftX, topY, topRightX, topY, bottomRightX, bottomY, bottomLeftX, bottomY);

    const liquidTopY = p.map(progress, 0, 1, bottomY - 10, topY + 42);
    const sideAmount = (bottomY - liquidTopY) / cup.h;
    const liquidLeftX = p.lerp(bottomLeftX, topLeftX, sideAmount) + 10;
    const liquidRightX = p.lerp(bottomRightX, topRightX, sideAmount) - 10;

    const drinkColor = getDrinkColor(selectedCoffee, selectedMilk);
    const foamColor = p.color(
      selectedMilk.tint[0],
      selectedMilk.tint[1],
      selectedMilk.tint[2]
    );

    const wave = p.sin(p.millis() * 0.004) * 3;

    p.noStroke();
    p.fill(drinkColor);
    p.beginShape();
    p.vertex(liquidLeftX, liquidTopY + wave);
    p.vertex((liquidLeftX + liquidRightX) / 2, liquidTopY - wave);
    p.vertex(liquidRightX, liquidTopY + wave);
    p.vertex(bottomRightX - 10, bottomY - 8);
    p.vertex(bottomLeftX + 10, bottomY - 8);
    p.endShape(p.CLOSE);

    const foamH = p.map(progress, 0, 1, 6, 36) * selectedCoffee.foamAmount + 10;
    const foamY = liquidTopY;

    p.fill(foamColor);
    p.ellipse(cup.x, foamY, liquidRightX - liquidLeftX, foamH);

    drawFoamPattern(selectedCoffee, foamY, liquidRightX - liquidLeftX, foamH);
    drawSteam(progress, topY);
    drawCupTimer(selectedCoffee, elapsedSeconds);
    drawBubbles(liquidTopY, bottomY, topLeftX, topRightX, bottomLeftX, bottomRightX);

    p.noFill();
    p.stroke(65, 58, 50);
    p.strokeWeight(4);
    p.line(topLeftX, topY, bottomLeftX, bottomY);
    p.line(topRightX, topY, bottomRightX, bottomY);
    p.line(bottomLeftX, bottomY, bottomRightX, bottomY);
    p.ellipse(cup.x, topY, cup.topW, 42);

    drawStageLabels(topRightX, topY, bottomY);
  }

  function getDrinkColor(selectedCoffee, selectedMilk) {
    const coffeeBase = p.color(
      selectedCoffee.baseColor[0],
      selectedCoffee.baseColor[1],
      selectedCoffee.baseColor[2]
    );

    const milkTint = p.color(
      selectedMilk.tint[0],
      selectedMilk.tint[1],
      selectedMilk.tint[2]
    );

    return p.lerpColor(coffeeBase, milkTint, selectedCoffee.milkBlend);
  }

  function drawProgressRing(selectedCoffee, progress) {
    const accent = p.color(
      selectedCoffee.accentColor[0],
      selectedCoffee.accentColor[1],
      selectedCoffee.accentColor[2]
    );

    if (cupClickPulse > 0) {
      p.noStroke();
      p.fill(255, 255, 255, cupClickPulse * 90);
      p.ellipse(
        cup.x,
        cup.y,
        310 + cupClickPulse * 55,
        310 + cupClickPulse * 55
      );
    }

    p.noFill();
    p.stroke(255, 255, 255, 125);
    p.strokeWeight(9);
    p.arc(cup.x, cup.y, 325, 325, -p.HALF_PI, -p.HALF_PI + p.TWO_PI);

    p.stroke(accent);
    p.strokeWeight(9);
    p.arc(
      cup.x,
      cup.y,
      325,
      325,
      -p.HALF_PI,
      -p.HALF_PI + p.TWO_PI * progress
    );

    if (readyPulse > 0) {
      p.stroke(255, 255, 255, 80 + readyPulse * 130);
      p.strokeWeight(7 + readyPulse * 7);
      p.arc(cup.x, cup.y, 345, 345, -p.HALF_PI, -p.HALF_PI + p.TWO_PI);
    }
  }

  function drawFoamPattern(selectedCoffee, foamY, foamW, foamH) {
    const cx = cup.x;
    p.noFill();

    if (selectedCoffee.foamPattern === 'latte') {
      p.stroke(255, 255, 255, 210);
      p.strokeWeight(3);
      p.ellipse(cx, foamY, foamW * 0.28, foamH * 0.65);
      p.ellipse(cx, foamY - 6, foamW * 0.18, foamH * 0.38);
      p.line(cx, foamY + foamH * 0.1, cx, foamY + foamH * 0.32);
    }

    if (selectedCoffee.foamPattern === 'cappuccino') {
      p.stroke(255, 255, 255, 180);
      p.strokeWeight(2.5);

      for (let i = 0; i < 6; i++) {
        const x = cx - foamW * 0.2 + i * (foamW * 0.08);
        const y = foamY + p.sin(i + p.millis() * 0.002) * 2;
        p.ellipse(x, y, foamW * 0.12, foamH * 0.33);
      }
    }

    if (selectedCoffee.foamPattern === 'flatwhite') {
      p.stroke(255, 255, 255, 220);
      p.strokeWeight(3);
      p.ellipse(cx, foamY, foamW * 0.18, foamH * 0.45);
      p.ellipse(cx, foamY - 2, foamW * 0.10, foamH * 0.22);
    }
  }

  function drawSteam(progress, topY) {
    if (!isSteaming || progress < 0.03) return;

    const steamAlpha = p.map(progress, 0, 1, 35, 135);

    p.noFill();
    p.stroke(255, 255, 255, steamAlpha);
    p.strokeWeight(3);

    const extraLines = p.floor(p.map(p.second(), 0, 59, 0, 2));

    for (let i = 0; i < 4 + extraLines; i++) {
      const startX = 330 + i * 30;
      const startY = topY - 5;
      const steamHeight = 52 + i * 3;
      const motion = p.millis() * 0.002 + i;

      p.beginShape();
      for (let j = 0; j < 8; j++) {
        const y = startY - j * (steamHeight / 7);
        const x = startX + p.sin(motion + j * 0.8) * 10;
        p.curveVertex(x, y);
      }
      p.endShape();
    }
  }

  function drawCupTimer(selectedCoffee, elapsedSeconds) {
    const timeLeft = selectedCoffee.steamSeconds - elapsedSeconds;

    let mainText;
    let subText;
    let labelColor;

    if (!isSteaming) {
      mainText = 'START';
      subText = 'click cup';
      labelColor = p.color(255, 255, 255, 185);
    } else if (timeLeft > 0) {
      mainText = formatTime(timeLeft);
      subText = 'steam left';
      labelColor = p.color(255, 255, 255, 190);
    } else {
      mainText = 'READY';
      subText = 'pour now';
      labelColor = p.color(255, 245, 185, 215);
    }

    p.noStroke();
    p.fill(labelColor);
    p.rect(cup.x - 86, cup.y - 38, 172, 76, 18);

    p.textAlign(p.CENTER, p.CENTER);
    p.fill(45, 40, 35);
    p.textSize(25);
    p.text(mainText, cup.x, cup.y - 11);

    p.fill(75, 68, 60);
    p.textSize(12);
    p.text(subText, cup.x, cup.y + 18);
  }

  function drawBubbles(liquidTopY, bottomY, topLeftX, topRightX, bottomLeftX, bottomRightX) {
    const liquidHeight = bottomY - liquidTopY;

    if (!isSteaming || liquidHeight < 20) return;

    const bubbleCount = p.floor(p.map(p.second(), 0, 59, 4, 10));

    for (let i = 0; i < bubbleCount; i++) {
      const bubbleY = bottomY - ((p.millis() * 0.035 + i * 40) % liquidHeight);

      const sideAmount = (bottomY - bubbleY) / cup.h;
      const leftX = p.lerp(bottomLeftX, topLeftX, sideAmount) + 22;
      const rightX = p.lerp(bottomRightX, topRightX, sideAmount) - 22;

      const x = p.lerp(leftX, rightX, p.noise(i * 7.8, p.frameCount * 0.01));
      const size = p.map(p.noise(i * 3.4), 0, 1, 4, 10);

      p.noStroke();
      p.fill(255, 255, 255, 85);
      p.ellipse(x, bubbleY, size, size);
    }
  }

  function drawStageLabels(topRightX, topY, bottomY) {
    const stages = [
      { label: 'Ready', progress: 1 },
      { label: 'Mid', progress: 0.5 },
      { label: 'Start', progress: 0 }
    ];

    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const y = p.map(stage.progress, 0, 1, bottomY, topY + 42);

      p.stroke(80, 72, 64);
      p.strokeWeight(1.5);
      p.line(topRightX + 10, y, topRightX + 45, y);

      p.noStroke();
      p.fill(55, 50, 45);
      p.text(stage.label, topRightX + 52, y);
    }
  }

  function drawCoffeeButtons() {
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);

    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.fill(70, 62, 55);
    p.noStroke();
    p.text('Coffee style', coffeeButtons[0].x, coffeeButtons[0].y - 16);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);

    for (let i = 0; i < coffeeButtons.length; i++) {
      const b = coffeeButtons[i];
      const coffee = coffeeStyles[i];
      const selected = i === selectedCoffeeIndex;

      const accent = p.color(
        coffee.accentColor[0],
        coffee.accentColor[1],
        coffee.accentColor[2]
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

      p.noStroke();
      p.fill(selected ? 255 : 55);
      p.text(coffee.shortName, b.x + b.w / 2, b.y + b.h / 2);
    }
  }

  function drawMilkButtons() {
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.fill(70, 62, 55);
    p.noStroke();
    p.text('Milk type', milkButtons[0].x, milkButtons[0].y - 16);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);

    for (let i = 0; i < milkButtons.length; i++) {
      const b = milkButtons[i];
      const milk = milkTypes[i];
      const selected = i === selectedMilkIndex;

      const accent = p.color(
        milk.accentColor[0],
        milk.accentColor[1],
        milk.accentColor[2]
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

      p.noStroke();
      p.fill(selected ? 255 : 55);
      p.text(milk.shortName, b.x + b.w / 2, b.y + b.h / 2);
    }
  }

  function drawFrame() {
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  }
});