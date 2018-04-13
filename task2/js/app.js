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

    document.getElementById('canvas').addEventListener('mousedown', function(e) {
      var x = e.offsetX, y = e.offsetY;
      console.log('mouse-down');
      if(this.selectedTool === TOOL_MOVE &&
        this.selectedLine &&
        this.selectedLine.isNear(x, y, SELECTION_THRESHOLD)
      ) {
        console.log('enable move');
        this.startMovePoint = {x,y}
        this.isMoving = true;
        this.enableMoveHandler();
      }
    }.bind(this));

    document.getElementById('canvas').addEventListener('mouseout', function(e) {
      const {isMoving} = this;
      var x = e.offsetX, y = e.offsetY;
      if(isMoving) {
        const {startMovePoint:start} = this;
        console.log('start', start);
        console.log('cur', {x,y});
        console.log('delta', {
          x: start.x-x,
          y: start.y-y
        });
      }
      // if we are moving, cancel it
    }.bind(this));

    document.getElementById('canvas').addEventListener('mouseup', function(e) {
      var x = e.offsetX, y = e.offsetY;
      if(this.selectedTool === TOOL_MOVE &&
        this.selectedLine &&
        this.isMoving
      ) {
        this.isMoving = false;
        this.disableMoveHandler();
      }
    }.bind(this));

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

  disableMoveHandler: function() {
    console.log('disableMoveListener');
    document.getElementById('canvas').removeEventListener('mousemove', this.onMoveElement);
  },

  enableMoveHandler: function() {
    console.log('enableMoveListener');
    document.getElementById('canvas').addEventListener('mousemove', this.onMoveElement.bind(this));
  },

  onMoveElement: function(e) {
    const {isMoving} = this;
    var x = e.offsetX, y = e.offsetY;
    if(isMoving) {
      const {startMovePoint:start} = this;
      console.log('start', start);
      console.log('cur', {x,y});
      const delta = {
        x: x - start.x,
        y: y - start.y
      };
      console.log('delta', delta);
      this.selectedLine.translate(delta.x, delta.y);
      this.clearCanvas();
      this.lines.forEach(
        (line) => {
          line.drawToCanvas();
        }
      );
      console.log(this.selectedLine);
      this.startMovePoint = {x,y};
    }
    // if we are moving, cancel it
  },

  redrawAll: function () {
    this.clearCanvas();
    this.lines.forEach(
      (line) => {
        line.drawToCanvas();
      }
    );
  },

  getCanvas: function() {
    return document.getElementById('canvas');
  },

  getContext: function() {
    return this.getCanvas().getContext('2d');
  }
};
