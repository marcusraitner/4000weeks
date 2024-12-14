///<reference-path="scriptable.d.ts" /> 

const DAY_COLOR = "#979797";
const REMAINING_DAY_COLOR = "#D2FF72";
const COLUMNS = 80;
const ROWS = 50;
const CELL_SIZE = 6;
const PADDING = 2;
const BORDER_RADIUS = 2;
let birthday = new Date("1974-12-01");
const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
const LIFE_SPAN = 4000;

// Quotes
const quotes = [
  {
    author: "Seneca",
    quote: "It is not that we have a short time to live, but that we waste a lot of it."
  },
  {
    author: "Seneca",
    quote: "It is not that we have so little time but that we lose so much."
  },
  {
    author: "Seneca",
    quote: "While we are postponing, life speeds by."
  },
  {
    author: "Marcus Aurelius",
    quote: "It is not death that a man should fear, but he should fear never beginning to live."
  },
  {
    author: "Seneca",
    quote: "You act like mortals in all that you fear, and like immortals in all that you desire."
  },
  {
    author: "Oliver Burkeman",
    quote: "The average human lifespan is absurdly, terrifyingly, insultingly short."
  },
  {
    author: "Greg McKeown",
    quote: "The quantity of our noes dictates the quality of our yeses."
  },
  {
    author: "Greg McKeown",
    quote: "If you don't prioritize your life, someone else will."
  }
];

// Create and configure the widget with the heatmap
async function createWidget() {

  // First parse the arguments
  if (args.widgetParameter) {
    const params = args.widgetParameter.split(';');

    for (var i = 0; i < params.length; i++) {
      const p = params[i].split('=');
      if (p[0].trim().toLowerCase() == "bday") {
        birthday = new Date(p[1].trim());
      }
    }
  }

  // calculate where we are
  const WEEKS_GONE = Math.floor((new Date() - birthday) / (MS_PER_WEEK));
  const REMAINING_WEEKS = LIFE_SPAN - WEEKS_GONE;
  const DEATHDAY = new Date(
    birthday.valueOf() + LIFE_SPAN * MS_PER_WEEK
  );

  const widget = new ListWidget();
  widget.setPadding(0, 10, 0, 10);
  widget.backgroundColor = new Color("#000000");

  // A vertical stack; the image will be in the middle 
  const vStack = widget.addStack();
  vStack.layoutVertically();
  vStack.setPadding(0, 0, 0, 0);

  // Drawing the central image
  const context = new DrawContext();
  context.size = new Size((CELL_SIZE + PADDING) * COLUMNS, (CELL_SIZE + PADDING) * ROWS);
  context.opaque = false;

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
      context.addPath(path);
      if (row * COLUMNS + col < WEEKS_GONE) {
        context.setFillColor(new Color(DAY_COLOR));
      } else {
        context.setFillColor(new Color(REMAINING_DAY_COLOR));
      }
      context.fillPath();
    }
  }

  // Now the layout
  vStack.addSpacer(null);

  // A horizontal stack on top to place the text left aligned
  const topStack = vStack.addStack()
  topStack.layoutHorizontally();
  topStack.centerAlignContent();
  topStack.setPadding(0, 0, 0, 0);
  const birthText = topStack.addText("❊ " + birthday.getFullYear().toString());
  birthText.font = Font.blackSystemFont(16);
  birthText.textColor = new Color(DAY_COLOR);
  birthText.leftAlignText();
  topStack.addSpacer(null);
  const title = topStack.addText("memento mori");
  title.font = Font.lightSystemFont(12);
  title.textColor = new Color(DAY_COLOR);
  title.rightAlignText();

  // Then the central image
  vStack.addSpacer(null);
  vStack.addImage(context.getImage());
  vStack.addSpacer(null);

  // Another horizontal stack at the bottom to place the text right aligned
  const bottomStack = vStack.addStack();
  bottomStack.layoutHorizontally();
  bottomStack.centerAlignContent();
  bottomStack.setPadding(0, 0, 0, 0);

  // Add a stack for the quote
  const quoteStack = bottomStack.addStack();
  quoteStack.layoutVertically();
  quoteStack.centerAlignContent();
  quoteStack.setPadding(0, 0, 0, 0)
  const index = Math.floor(Math.random() * quotes.length);
  const quote = quoteStack.addText(quotes[index].quote);
  quote.font = Font.lightSystemFont(12);
  quote.textColor = new Color(REMAINING_DAY_COLOR);
  quote.leftAlignText();
  quoteStack.addSpacer(5);
  const author = quoteStack.addText(quotes[index].author);
  author.font = Font.lightSystemFont(12);
  author.textColor = new Color(DAY_COLOR);
  author.rightAlignText();

  bottomStack.addSpacer(null);
  const death = bottomStack.addText("✝︎ " + DEATHDAY.getFullYear().toString());
  death.font = Font.blackSystemFont(16);
  death.textColor = new Color(REMAINING_DAY_COLOR);
  death.rightAlignText();

  vStack.addSpacer(null);

  return widget;
}

const widget = await createWidget();
widget.presentLarge();
Script.complete();