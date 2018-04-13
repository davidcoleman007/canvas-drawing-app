const SELECTION_THRESHOLD = 10;
const TOOL_SELECT = 'TOOL_SELECT';
const TOOL_MOVE   = 'TOOL_MOVE';
const TOOL_ERASE  = 'TOOL_ERASE';
const TOOL_LINE   = 'TOOL_LINE';

var app = {
  initDone     : false,
  isEraseMode  : false,
  isMoving     : false,
  lines        : [],
  pos          : null,
  selectedLine : null,
  selectedTool : TOOL_LINE,
  resetToolbar : () => {
    document.querySelector('.toolbar button.active').className = '';
  },
  init: function() {
    var self = this;

    if(self.initDone) {
      return;
    }

    // event binding
    document.getElementById('btn-select').addEventListener('click', function() {
      this.selectedTool = TOOL_SELECT;
      this.pos          = null;
      this.resetToolbar();
      document.getElementById('btn-select').className = 'active';
    }.bind(this));

    document.getElementById('btn-move').addEventListener('click', function() {
      this.selectedTool = TOOL_MOVE;
      this.pos          = null;
      this.resetToolbar();
      document.getElementById('btn-move').className = 'active';
    }.bind(this));

    document.getElementById('btn-erase').addEventListener('click', function() {
      if(this.selectedLine && this.selectedLine.selected) {
        this.selectedLine.eraseFromCanvas();
        const idx = this.lines.indexOf(this.selectedLine);
        console.log('erase lines before', [...this.lines]);
        this.lines = this.lines.reduce(
          (a, c, i) => {
            console.log('reducer', a, c, i);
            if(i !== idx) {
              a.push(c);
            }
            return a;
          }, []
        );
        console.log('erase this.lines after', this.lines);
        this.selectedLine = null;
      }
    }.bind(this));

    document.getElementById('btn-line').addEventListener('click', function() {
      this.selectedTool = TOOL_LINE;
      this.pos          = null;
      this.resetToolbar();
      document.getElementById('btn-line').className = 'active';
    }.bind(this));

    document.getElementById('canvas').addEventListener('mouseDown', function(e) {
      var x = e.offsetX, y = e.offsetY;
      if(this.selectedTool === TOOL_MOVE &&
        this.selectedLine &&
        this.selectedLine.isNear(x, y, SELECTION_THRESHOLD)
      ) {
        this.enableMoveHandler();
      }
    });

    document.getElementById('canvas').addEventListener('mouseOut', function(e) {
      // if we are moving, cancel it
    });

    document.getElementById('canvas').addEventListener('mouseUp', function(e) {
      var x = e.offsetX, y = e.offsetY;
      if(this.selectedTool === TOOL_MOVE &&
        this.selectedLine &&
        this.selectedLine.isNear(x, y, SELECTION_THRESHOLD)
      ) {
        this.enableMoveHandler();
      }
    });

    document.getElementById('canvas').addEventListener('click', function(e) {
      var x = e.offsetX, y = e.offsetY;
      switch(this.selectedTool) {
        case TOOL_SELECT:
          let closestLine;
          let dist = SELECTION_THRESHOLD + 1;
          const {lines} = this;
          lines.forEach(
            ((line) => {
              const isClose = line.isNear(x, y, SELECTION_THRESHOLD)
              if(isClose) {
                const lineDist = line.distanceFrom(x,y);
                if(lineDist < dist) {
                  closestLine = line;
                  dist        = lineDist;
                }
              }
            }).bind(this)
          );
          if(!closestLine && this.selectedLine) {
            this.selectedLine.deSelect();
            this.selectedLine = null;
          }
          if(closestLine) {
            if(this.selectedLine && this.selectedLine !== closestLine) {
              this.selectedLine.deSelect();
              this.selectedLine = null;
            }
            if(!closestLine.selected) {
              this.selectedLine = closestLine;
              closestLine.select();
            } else {
              this.selectedLine = null;
              closestLine.deSelect();
            }
          }
          break;
        case TOOL_LINE:
          if(!self.pos) {
            // save first click of the line
            self.pos = [ x, y ];
          } else {
            // create the line and add to the list
            var x0   = self.pos[0], y0 = self.pos[1];
            var line = new Line(x0, y0, x, y);
            line.drawToCanvas();
            self.lines.push(line);
            self.pos = null;
          }
          break;
      }
    }.bind(this));

    self.initDone = true;
  },
  clearCanvas: function() {
    const canvas = this.getCanvas();
    const ctx = this.getContext();
    ctx.clearRect(0,0,canvas.width, canvas.height);
  },
  redrawAll: function () {
    this.clearCanvas();
    this.lines.forEach(
      (line) => {
        line.drawToCanvas();
      }
    );
  }.bind(this),
  getCanvas: function() {
    return document.getElementById('canvas');
  }.bind(this),
  getContext: function() {
    return this.getCanvas().getContext('2d');
  }
};
