var Line = function(x1, y1, x2, y2, length) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.length = Geometry.distance(x1, y1, x2, y2);
};

Line.prototype.getCanvas = function() {
  return document.getElementById('canvas');
}

Line.prototype.getContext = function() {
  return this.getCanvas().getContext('2d');
}

Line.prototype.drawToCanvas = function() {
  var ctx = this.getContext();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.stroke();
  if(this.selected) {
    this.drawSelect(ctx);
  }
};

Line.prototype.eraseFromCanvas = function() {
  if(this.selected) {
    this.deSelect();
  }
  var ctx = this.getContext();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3; // 1 and 2 are not enough to erase the line in full
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.stroke();
};

Line.prototype.select = function() {
  let ctx = this.getContext();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  this.drawSelect(ctx);
  this.selected = true;
}

Line.prototype.drawSelect = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.x1, this.y1, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(this.x2, this.y2, 5, 0, Math.PI * 2);
  ctx.stroke();
}

Line.prototype.deSelect = function() {
  let ctx = this.getContext();
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 3;
  this.drawSelect(ctx);
  this.selected = false;
  this.drawToCanvas();
}

Line.prototype.translate = function(dx, dy) {
  console.log(this, dx, dy);
  this.x1 += dx;
  this.y1 += dy;
  this.x2 += dx;
  this.y2 += dy;
  console.log(this.x1,this.y1, this.x2, this.y2);
  return this;
}

Line.prototype.isNear = function(x, y, threshold) {
  const dist = this.squareDistanceFrom(x, y) <= threshold * threshold;
  console.log(dist);
  return dist;
};

Line.prototype.distanceFrom = function(x,y) {
  return Math.sqrt(this.squareDistanceFrom(x,y));
}

Line.prototype.squareDistanceFrom = function(x, y) {
  var x1 = this.x1, y1 = this.y1, x2 = this.x2, y2 = this.y2;
  return Geometry.squareDistanceToSegment(x, y, x1, y1, x2, y2);
};
