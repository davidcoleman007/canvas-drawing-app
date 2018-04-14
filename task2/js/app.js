const SELECTION_THRESHOLD = 10;
const TOOL_ERASE          = 'TOOL_ERASE';
const TOOL_LINE           = 'TOOL_LINE';
const TOOL_MOVE           = 'TOOL_MOVE';
const TOOL_PENCIL         = 'TOOL_PENCIL';
const TOOL_SELECT         = 'TOOL_SELECT';

var app = {
  initDone        : false,
  isEraseMode     : false,
  isMoving        : false,
  elements        : [],
  pos             : null,
  selectedElement    : null,
  selectedTool    : TOOL_LINE,
  resetToolbar    : () => {
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
      if(this.selectedElement && this.selectedElement.selected) {
        // this.selectedElement.eraseFromCanvas();
        const idx = this.elements.indexOf(this.selectedElement);
        console.log('erase elements before', [...this.elements]);
        this.elements = this.elements.reduce(
          (a, c, i) => {
            console.log('reducer', a, c, i);
            if(i !== idx) {
              a.push(c);
            }
            return a;
          }, []
        );
        console.log('erase this.elements after', this.elements);
        this.selectedElement = null;
        this.redrawAll();
      }
    }.bind(this));

    document.getElementById('btn-line').addEventListener('click', function() {
      this.selectedTool = TOOL_LINE;
      this.pos          = null;
      this.resetToolbar();
      document.getElementById('btn-line').className = 'active';
    }.bind(this));

    document.getElementById('btn-pencil').addEventListener('click', function() {
      this.selectedTool = TOOL_PENCIL;
      this.pos          = null;
      this.resetToolbar();
      document.getElementById('btn-pencil').className = 'active';
    }.bind(this));

    document.getElementById('canvas').addEventListener('mousedown', function(e) {
      var x = e.offsetX, y = e.offsetY;
      console.log('mouse-down');
      switch(this.selectedTool) {
        case TOOL_MOVE:
          if(this.selectedElement &&
            this.selectedElement.isNear(new Point(x, y), SELECTION_THRESHOLD)
          ) {
            console.log('enable move');
            this.startMovePoint = {x,y}
            this.isMoving = true;
            this.enableMoveHandler();
          }
          break;
        case TOOL_PENCIL:
          this.selectedElement = new Pencil(new Point(x,y));
          this.elements.push(this.selectedElement);
          this.enablePencilHandler();
          break;
      }
    }.bind(this));

    document.getElementById('canvas').addEventListener('mouseout', function(e) {
      const {isMoving} = this;
      var x = e.offsetX, y = e.offsetY;
      if(isMoving) {
        const {startMovePoint:start} = this;
      }
      // if we are moving, cancel it
    }.bind(this));

    document.getElementById('canvas').addEventListener('mouseup', function(e) {
      var x = e.offsetX, y = e.offsetY;
      switch(this.selectedTool) {
        case TOOL_MOVE:
          if(this.selectedElement &&
            this.isMoving
          ) {
            this.isMoving = false;
            this.disableMoveHandler();
          }
          break;
        case TOOL_PENCIL:
          this.disablePencilHandler();
          break;
      }
    }.bind(this));

    document.getElementById('canvas').addEventListener('click', function(e) {
      var x = e.offsetX, y = e.offsetY;
      const clickPoint = new Point(x,y);
      switch(this.selectedTool) {
        case TOOL_SELECT:
          let closestElement;
          let dist = SELECTION_THRESHOLD + 1;
          const {elements} = this;
          elements.forEach(
            (line) => {
              if(line.isNear(clickPoint, SELECTION_THRESHOLD)) {
                const lineDist = line.distanceFrom(new Point(x,y));
                if(lineDist < dist) {
                  closestElement = line;
                  dist           = lineDist;
                }
              }
            }
          );
          if(!closestElement && this.selectedElement) {
            this.selectedElement.deSelect();
            this.selectedElement = null;
          }
          if(closestElement) {
            if(this.selectedElement && this.selectedElement !== closestElement) {
              this.selectedElement.deSelect();
              this.selectedElement = null;
            }
            if(!closestElement.selected) {
              this.selectedElement = closestElement;
              closestElement.select();
            } else {
              this.selectedElement = null;
              closestElement.deSelect();
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
            self.elements.push(line);
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
    document.getElementById('canvas').onmousemove = null;
  },

  enableMoveHandler: function() {
    console.log('enableMoveListener');
    document.getElementById('canvas').onmousemove = this.onMoveElement.bind(this);
  },

  disablePencilHandler: function() {
    console.log('disablePencilListener');
    document.getElementById('canvas').onmousemove = null;
  },

  enablePencilHandler: function() {
    console.log('enablePencilListener');
    document.getElementById('canvas').onmousemove = this.onPencilMove.bind(this);
  },

  onMoveElement: function(e) {
    const {isMoving} = this;
    var x = e.offsetX, y = e.offsetY;
    if(isMoving) {
      const {startMovePoint:start} = this;
      const delta = new Point(
        x - start.x,
        y - start.y
      );
      console.log('translating', delta);
      this.selectedElement.translate(delta.x, delta.y);
      this.redrawAll();
      this.startMovePoint = {x,y};
    }
  },

  onPencilMove: function(e) {
    var x = e.offsetX, y = e.offsetY;
    this.selectedElement.addPoint(new Point(x,y));
  },

  redrawAll: function () {
    this.clearCanvas();
    this.elements.forEach(
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
