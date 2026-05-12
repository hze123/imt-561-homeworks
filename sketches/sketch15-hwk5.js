registerSketch('sk15', function (p) {
  let table;
  let cells = [];

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
    drawNote();
    drawTooltip();

    // Frame
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
    p.text("The Risky Corner", 55, 45);

    p.textSize(23);
    p.textStyle(p.NORMAL);
    p.text("High Social Media Use + Short Sleep", 55, 95);

    p.fill("#555555");
    p.textSize(16);
    p.text("Depression-label rate by social media use and sleep duration", 55, 130);
  }

  function drawGrid() {
    let gridX = 190;
    let gridY = 250;
    let cellW = 215;
    let cellH = 145;

    p.fill("#222222");
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);

    p.textSize(23);
    p.textStyle(p.BOLD);
    p.text("Sleep", gridX + cellW, gridY - 70);

    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.text("6h or more", gridX + cellW / 2, gridY - 35);
    p.text("Under 6h", gridX + cellW + cellW / 2, gridY - 35);

    p.push();
    p.translate(70, gridY + cellH);
    p.rotate(-p.HALF_PI);
    p.textSize(20);
    p.textStyle(p.BOLD);
    p.text("Daily social media use", 0, 0);
    p.pop();

    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.text("Less than 6h", gridX - 25, gridY + cellH / 2);
    p.text("6h or more", gridX - 25, gridY + cellH + cellH / 2);

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

    let cellColor;

    if (rate === 0) {
      cellColor = p.color("#EFE8E1");
    } else if (rate < 5) {
      cellColor = p.color("#F2B8AD");
    } else {
      cellColor = p.color("#A83333");
    }

    p.stroke("#FFFFFF");
    p.strokeWeight(4);
    p.fill(cellColor);
    p.rect(x, y, w, h, 18);

    if (isRisky) {
      p.noFill();
      p.stroke("#5B1515");
      p.strokeWeight(6);
      p.rect(x + 4, y + 4, w - 8, h - 8, 18);
    }

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);

    if (rate >= 10) {
      p.fill("#FFFFFF");
    } else {
      p.fill("#222222");
    }

    p.textSize(isRisky ? 50 : 38);
    p.text(rate.toFixed(1) + "%", x + w / 2, y + h / 2 - 15);

    p.textStyle(p.NORMAL);
    p.textSize(14);

    if (rate >= 10) {
      p.fill("#FBEAEA");
    } else {
      p.fill("#555555");
    }

    p.text(data.depressed + " of " + data.total + " teens", x + w / 2, y + h / 2 + 32);

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
    let y = gridY + cellH + 20;

    p.noStroke();
    p.fill("#222222");
    p.textAlign(p.LEFT, p.TOP);
    p.textStyle(p.BOLD);
    p.textSize(18);
    p.text("Highest rate", x, y);

    p.textStyle(p.NORMAL);
    p.textSize(15);
    p.fill("#444444");
    p.text("appears when high\nsocial media use and\nshort sleep overlap.", x, y + 32);

    p.stroke("#222222");
    p.strokeWeight(2);
    p.line(x - 10, y + 63, gridX + cellW * 2 - 20, gridY + cellH + 65);

    p.fill("#222222");
    p.noStroke();
    p.triangle(
      gridX + cellW * 2 - 20,
      gridY + cellH + 65,
      gridX + cellW * 2 - 5,
      gridY + cellH + 58,
      gridX + cellW * 2 - 6,
      gridY + cellH + 75
    );
  }

  function drawNote() {
  let x = 55;
  let y = 640;
  let w = 690;
  let h = 95;

  p.fill("#FFFFFF");
  p.stroke("#D3C6BC");
  p.strokeWeight(2);
  p.rect(x, y, w, h, 16);

  p.noStroke();
  p.fill("#333333");
  p.textAlign(p.LEFT, p.CENTER);
  p.textStyle(p.NORMAL);
  p.textSize(14);

  p.text("Note: This visualization shows an association in this dataset only.", x + 20, y + 25);
  p.text("It does not prove that social media use or short sleep causes depression.", x + 20, y + 48);

  p.fill("#666666");
  p.textSize(12);
  p.text("Source: Teen Mental Health Dataset. Groups use 6h/day social media and 6h/night sleep cutoffs.", x + 20, y + 73);
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