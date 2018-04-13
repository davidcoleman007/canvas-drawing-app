# Take-home assignment #2

In this assignment, you will be working on an existing canvas-based drawing application.

In its current state, the application supports a toolbar, with 2 modes:
- _Line_: the user can draw a line by clicking at 2 positions on the canvas,
- _Erase_: the user can erase a line by clicking within 10 pixels of it.

We have 4 new requirements for this drawing application. You should read all the requirements first, but we recommend you to work on them in order.

General guidelines:
- There is no expectation to support touch devices.
- You may not use any external libraries.
- You should not change Geometry.js (which is bug-free).
- You may need to make minor changes to index.html.
- You do not need to adjust styles.
- You can find additional svgs in the svg folder.

## New requirements

### 1. Review code and address issues

The provided code has multiple issues that you should clean up before adding new functionality.

Instructions:
- Address issues that you would point out during code review and ask another developer to fix. This includes general best practices, poor design patterns, etc.
- Keep in mind that there are further requirements below that will need more code changes.
- We are not expecting a complete refactoring, so for example, you do not need to re-write everything to ES6.

### 2. Make deletion more deterministic

As is, the _Erase_ mode can make it hard for the user to pick the right line, because if several lines are within 10 pixels of the clicking point, then it is easy to delete the wrong line.

To solve this, we want to revamp how deletion works.

Requirements:
- Add a new _Select_ button to the toolbar
  - When a line is selected, its ends should show as small circles to provide feedback on the which line is selected.
  - If several lines are within 10 pixels of the clicking point, the closest line should be selected.
  - If no line is within 10 pixels of the clicking point, no line should be selected, and any currently selected line should be de-selected.
- Clicking on the _Erase_ button should simply delete the currently selected line and leave the user in _Select_ mode with no line selected.

### 3. Add new _Pencil_ mode

To provide a second option to draw, we want to add a new _Pencil_ mode.

Requirements:
- Add a new _Pencil_ button to the toolbar.
- In this mode, the user can draw by holding down the left button of their mouse and moving it over the canvas. When the mouse button is released, drawing stops.
- The drawn object is a series of connected lines to approximate the path of the mouse, with a new segment being added on every mousemove event.
- In _Select_ mode, the full object becomes selected and can be deleted.

### 4. Support moving lines

Lastly, users have asked to be able to move existing objects.

Requirements:
- Add a new _Move_ button to the toolbar.
- In this mode, the closest object should become selected when you mouse down to start dragging it.
- Only the whole object can be moved, not points or segments from the _Pencil_ mode.
