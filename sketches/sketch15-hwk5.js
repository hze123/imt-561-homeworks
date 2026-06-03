// Instance-mode sketch for HWK 5
// Interactive version: hover, click-to-inspect, rate/count toggle

registerSketch('sk15', function (p) {
  let table;
  let cells = [];

  let selectedCell = null;
  let viewMode = "rate"; // "rate" or "count"

  let toggleButton = {
    x: 55,
    y: 735,
    w: 160,
    h: 38
  };

  let resetButton = {
    x: 230,
    y: 735,
    w: 120,
    h: 38
  };

  p.preload = function () {
    table = p.loadTable("data/hwk5_summary.csv", "csv", "header");
  };

  p.setup = function () {
    p.createCanvas(800, 800);
    p.textFont("Arial");
  };

  p.draw = function () {
    p.background("#F8F3EE");
    cells = [];

    drawTitle();
    drawGrid();
    drawDetailPanel();
    drawNote();
    drawButtons();
    drawTooltip();

    // Simple border
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  function drawTitle() {
    p.noStroke();
    p.fill("#1F1F1F");

    p.textAlign(p.LEFT, p.TOP);
    p.textSize(42);
    p.textStyle(p.BOLD);
    p.text("The Risky Corner", 55, 40);

    p.textSize(23);
    p.textStyle(p.NORMAL);
    p.text("High Social Media Use + Short Sleep", 55, 88);

    p.fill("#555555");
    p.textSize(16);
    p.text("Depression-label rate by social media use and sleep duration", 55, 120);

    p.fill("#777777");
    p.textSize(13);
    p.text("Hover over a cell for details. Click a cell to keep it selected.", 55, 148);
  }

  function drawGrid() {
    let gridX = 160;
    let gridY = 245;
    let cellW = 190;
    let cellH = 125;

    p.fill("#222222");
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);

    p.textSize(22);
    p.textStyle(p.BOLD);
    p.text("Sleep", gridX + cellW, gridY - 68);

    p.textSize(15);
    p.textStyle(p.NORMAL);
    p.text("6h or more", gridX + cellW / 2, gridY - 34);
    p.text("Under 6h", gridX + cellW + cellW / 2, gridY - 34);

    p.push();
    p.translate(52, gridY + cellH);
    p.rotate(-p.HALF_PI);
    p.textSize(17);
    p.textStyle(p.BOLD);
    p.text("Daily social media use", 0, 0);
    p.pop();

    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(14);
    p.textStyle(p.NORMAL);
    p.text("Less than 6h", gridX - 18, gridY + cellH / 2);
    p.text("6h or more", gridX - 18, gridY + cellH + cellH / 2);

    drawOneCell(gridX, gridY, cellW, cellH, "Less than 6h", "6h or more");
    drawOneCell(gridX + cellW, gridY, cellW, cellH, "Less than 6h", "Under 6h");
    drawOneCell(gridX, gridY + cellH, cellW, cellH, "6h or more", "6h or more");
    drawOneCell(gridX + cellW, gridY + cellH, cellW, cellH, "6h or more", "Under 6h");

    drawAnnotation(gridX, gridY, cellW, cellH);
  }

  function drawOneCell(x, y, w, h, socialGroup, sleepGroup) {
    let data = getData(socialGroup, sleepGroup);
    let rate = data.rate;

    let isRisky = socialGroup === "6h or more" && sleepGroup === "Under 6h";
    let isHovered = isMouseInside(x, y, w, h);
    let isSelected =
      selectedCell &&
      selectedCell.socialGroup === socialGroup &&
      selectedCell.sleepGroup === sleepGroup;

    let cellColor;

    if (rate === 0) {
      cellColor = p.color("#EFE8E1");
    } else if (rate < 5) {
      cellColor = p.color("#F2B8AD");
    } else {
      cellColor = p.color("#A83333");
    }

    // Hover/selected effect
    let drawX = x;
    let drawY = y;
    let drawW = w;
    let drawH = h;

    if (isHovered || isSelected) {
      drawX = x - 5;
      drawY = y - 5;
      drawW = w + 10;
      drawH = h + 10;
    }

    p.stroke("#FFFFFF");
    p.strokeWeight(4);
    p.fill(cellColor);
    p.rect(drawX, drawY, drawW, drawH, 18);

    if (isRisky || isSelected) {
      p.noFill();
      p.stroke(isSelected ? "#111111" : "#5B1515");
      p.strokeWeight(isSelected ? 7 : 6);
      p.rect(drawX + 4, drawY + 4, drawW - 8, drawH - 8, 18);
    }

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);

    if (rate >= 10) {
      p.fill("#FFFFFF");
    } else {
      p.fill("#222222");
    }

    if (viewMode === "rate") {
      p.textSize(isRisky ? 46 : 36);
      p.text(rate.toFixed(1) + "%", x + w / 2, y + h / 2 - 14);

      p.textStyle(p.NORMAL);
      p.textSize(13);

      if (rate >= 10) {
        p.fill("#FBEAEA");
      } else {
        p.fill("#555555");
      }

      p.text(data.depressed + " of " + data.total + " teens", x + w / 2, y + h / 2 + 29);
    } else {
      p.textSize(isRisky ? 38 : 30);
      p.text(data.depressed + "/" + data.total, x + w / 2, y + h / 2 - 12);

      p.textStyle(p.NORMAL);
      p.textSize(13);

      if (rate >= 10) {
        p.fill("#FBEAEA");
      } else {
        p.fill("#555555");
      }

      p.text("depression-labeled teens", x + w / 2, y + h / 2 + 29);
    }

    cells.push({
      x: x,
      y: y,
      w: w,
      h: h,
      socialGroup: socialGroup,
      sleepGroup: sleepGroup,
      rate: rate,
      total: data.total,
      depressed: data.depressed
    });
  }

  function drawAnnotation(gridX, gridY, cellW, cellH) {
    let x = gridX + cellW * 2 + 25;
    let y = gridY + cellH + 6;

    p.noStroke();
    p.fill("#222222");
    p.textAlign(p.LEFT, p.TOP);
    p.textStyle(p.BOLD);
    p.textSize(17);
    p.text("Highest rate", x, y);

    p.textStyle(p.NORMAL);
    p.textSize(13);
    p.fill("#444444");
    p.text("appears when high\nsocial media use and\nshort sleep overlap.", x, y + 30);

    p.stroke("#222222");
    p.strokeWeight(2);
    p.line(x - 8, y + 62, gridX + cellW * 2 - 18, gridY + cellH + 62);

    p.fill("#222222");
    p.noStroke();
    p.triangle(
      gridX + cellW * 2 - 18,
      gridY + cellH + 62,
      gridX + cellW * 2 - 4,
      gridY + cellH + 55,
      gridX + cellW * 2 - 5,
      gridY + cellH + 72
    );
  }

  function drawDetailPanel() {
    let panelX = 55;
    let panelY = 525;
    let panelW = 690;
    let panelH = 105;

    p.fill("#FFFFFF");
    p.stroke("#D3C6BC");
    p.strokeWeight(2);
    p.rect(panelX, panelY, panelW, panelH, 16);

    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);

    if (!selectedCell) {
      p.fill("#333333");
      p.textStyle(p.BOLD);
      p.textSize(17);
      p.text("Click any cell to inspect that group", panelX + 20, panelY + 18);

      p.textStyle(p.NORMAL);
      p.fill("#666666");
      p.textSize(14);
      p.text("This panel will show the selected group's rate, count, and comparison.", panelX + 20, panelY + 50);
      return;
    }

    p.fill("#333333");
    p.textStyle(p.BOLD);
    p.textSize(17);
    p.text("Selected group", panelX + 20, panelY + 15);

    p.textStyle(p.NORMAL);
    p.textSize(14);
    p.fill("#444444");
    p.text(
      selectedCell.socialGroup + " social media + " + selectedCell.sleepGroup + " sleep",
      panelX + 20,
      panelY + 42
    );

    p.textStyle(p.BOLD);
    p.textSize(22);
    p.fill(selectedCell.rate >= 10 ? "#A83333" : "#333333");
    p.text(
      selectedCell.rate.toFixed(1) + "% depression-label rate",
      panelX + 20,
      panelY + 68
    );

    drawMiniBars(panelX + 420, panelY + 18, selectedCell);
  }

  function drawMiniBars(x, y, selected) {
    let labels = ["0.0", "2.3", "0.0", "16.5"];
    let rates = [0.0, 2.3, 0.0, 16.5];
    let names = ["L+Enough", "L+Short", "H+Enough", "H+Short"];

    p.textAlign(p.LEFT, p.TOP);
    p.textStyle(p.NORMAL);
    p.textSize(11);
    p.fill("#666666");
    p.text("Quick comparison", x, y - 2);

    for (let i = 0; i < rates.length; i++) {
      let barY = y + 18 + i * 18;
      let barW = p.map(rates[i], 0, 16.5, 0, 120);

      p.fill("#E6DDD5");
      p.noStroke();
      p.rect(x + 70, barY, 120, 8, 4);

      p.fill(rates[i] >= 10 ? "#A83333" : "#F2B8AD");
      p.rect(x + 70, barY, barW, 8, 4);

      p.fill("#555555");
      p.textSize(10);
      p.text(names[i], x, barY - 3);
      p.text(labels[i] + "%", x + 198, barY - 3);
    }
  }

  function drawNote() {
    let x = 55;
    let y = 650;
    let w = 690;
    let h = 70;

    p.fill("#FFFFFF");
    p.stroke("#D3C6BC");
    p.strokeWeight(2);
    p.rect(x, y, w, h, 16);

    p.noStroke();
    p.fill("#333333");
    p.textAlign(p.LEFT, p.CENTER);
    p.textStyle(p.NORMAL);
    p.textSize(13);

    p.text("Note: This visualization shows an association in this dataset only.", x + 18, y + 22);
    p.text("It does not prove that social media use or short sleep causes depression.", x + 18, y + 42);

    p.fill("#666666");
    p.textSize(10.5);
    p.text("Source: Teen Mental Health Dataset. Groups use 6h/day social media and 6h/night sleep cutoffs.", x + 18, y + 60);
  }

  function drawButtons() {
    drawButton(
      toggleButton.x,
      toggleButton.y,
      toggleButton.w,
      toggleButton.h,
      viewMode === "rate" ? "Show counts" : "Show rates"
    );

    drawButton(
      resetButton.x,
      resetButton.y,
      resetButton.w,
      resetButton.h,
      "Reset"
    );

    p.noStroke();
    p.fill("#777777");
    p.textAlign(p.LEFT, p.CENTER);
    p.textStyle(p.NORMAL);
    p.textSize(12);
    p.text("Tip: Press R to switch rate/count view.", 370, 754);
  }

  function drawButton(x, y, w, h, label) {
    let hovered = isMouseInside(x, y, w, h);

    p.fill(hovered ? "#222222" : "#FFFFFF");
    p.stroke("#222222");
    p.strokeWeight(1.5);
    p.rect(x, y, w, h, 10);

    p.noStroke();
    p.fill(hovered ? "#FFFFFF" : "#222222");
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(13);
    p.text(label, x + w / 2, y + h / 2);
  }

  function drawTooltip() {
    // Do not show tooltip if mouse is over buttons
    if (
      isMouseInside(toggleButton.x, toggleButton.y, toggleButton.w, toggleButton.h) ||
      isMouseInside(resetButton.x, resetButton.y, resetButton.w, resetButton.h)
    ) {
      return;
    }

    for (let cell of cells) {
      if (isMouseInside(cell.x, cell.y, cell.w, cell.h)) {
        let boxX = p.mouseX + 15;
        let boxY = p.mouseY + 15;

        if (boxX + 270 > p.width) {
          boxX = p.mouseX - 285;
        }

        if (boxY + 110 > p.height) {
          boxY = p.mouseY - 125;
        }

        p.fill("#FFFFFF");
        p.stroke("#222222");
        p.strokeWeight(2);
        p.rect(boxX, boxY, 270, 110, 12);

        p.noStroke();
        p.fill("#222222");
        p.textAlign(p.LEFT, p.TOP);
        p.textStyle(p.BOLD);
        p.textSize(14);
        p.text(cell.socialGroup + " social media", boxX + 15, boxY + 15);

        p.textStyle(p.NORMAL);
        p.textSize(13);
        p.fill("#444444");
        p.text(cell.sleepGroup + " sleep", boxX + 15, boxY + 40);
        p.text("Depression-label rate: " + cell.rate.toFixed(1) + "%", boxX + 15, boxY + 65);
        p.text(cell.depressed + " of " + cell.total + " teens", boxX + 15, boxY + 88);

        return;
      }
    }
  }

  p.mousePressed = function () {
    if (isMouseInside(toggleButton.x, toggleButton.y, toggleButton.w, toggleButton.h)) {
      toggleViewMode();
      return;
    }

    if (isMouseInside(resetButton.x, resetButton.y, resetButton.w, resetButton.h)) {
      selectedCell = null;
      return;
    }

    for (let cell of cells) {
      if (isMouseInside(cell.x, cell.y, cell.w, cell.h)) {
        selectedCell = cell;
        return;
      }
    }
  };

  p.keyPressed = function () {
    if (p.key === "r" || p.key === "R") {
      toggleViewMode();
    }
  };

  function toggleViewMode() {
    if (viewMode === "rate") {
      viewMode = "count";
    } else {
      viewMode = "rate";
    }
  }

  function isMouseInside(x, y, w, h) {
    return p.mouseX >= x && p.mouseX <= x + w && p.mouseY >= y && p.mouseY <= y + h;
  }

  function getData(socialGroup, sleepGroup) {
    for (let i = 0; i < table.getRowCount(); i++) {
      let row = table.getRow(i);

      if (
        row.getString("social_media_group") === socialGroup &&
        row.getString("sleep_group") === sleepGroup
      ) {
        return {
          total: row.getNum("total_teens"),
          depressed: row.getNum("depression_labeled"),
          rate: row.getNum("depression_rate_percent")
        };
      }
    }

    return {
      total: 0,
      depressed: 0,
      rate: 0
    };
  }

  p.windowResized = function () {
    p.resizeCanvas(800, 800);
  };
});