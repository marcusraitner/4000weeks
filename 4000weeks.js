const DAY_COLOR = "#ffffff";
const COLUMNS = 100;
const ROWS = 40;
const CELL_SIZE = 6;
const PADDING = 4;
const BORDER_RADIUS = 1;

// Create and configure the widget with the heatmap
async function createWidget() {
  const widget = new ListWidget();
  widget.setPadding(0, 10, 0, 10);

  const vStack = widget.addStack();
  vStack.layoutVertically();
  vStack.setPadding(0, 0, 0, 0);
  const drawContext = new DrawContext();
  drawContext.size = new Size(1000, 500);
  drawContext.opaque = false;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const path = new Path();
      const rect = new Rect(
        col * (CELL_SIZE + PADDING),
        row * (CELL_SIZE + PADDING),
        CELL_SIZE,
        CELL_SIZE,
      );
      path.addRoundedRect(rect, BORDER_RADIUS, BORDER_RADIUS);
      drawContext.addPath(path);
      drawContext.setFillColor(new Color(DAY_COLOR));
      drawContext.fillPath();
    }
  }

  vStack.addSpacer(null);
  vStack.addImage(drawContext.getImage());
  vStack.addSpacer(null);

  return widget;
}

const widget = await createWidget();
if (config.runsInAccessoryWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();
