class Pencil extends DrawingElement {
  constructor(start) {
    super();
    this.points = [
      start
    ];
    this.type = TOOL_PENCIL;
  }
  addPoint(point) {
    this.points.push(point);
    this.drawSegment(this.points[this.points.length-1], this.points[this.points.length-2]);
  };

  drawSegment(p1, p2) {
    var ctx = this.getContext();
    ctx.strokeStyle = '#000';
    ctx.PencilWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  };

  drawToCanvas() {
    var ctx = this.getContext();
    ctx.strokeStyle = '#000';
    ctx.PencilWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    this.points.forEach(
      (point) => {
        ctx.lineTo(point.x, point.y);
      }
    )
    ctx.stroke();
    if(this.selected) {
      this.drawSelect(ctx);
    }
  };

  translate(dx, dy) {
    this.points.forEach(
      (point) => {
        point.x += dx;
        point.y += dy;
      }
    );
  }

  select() {
    let ctx = this.getContext();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    this.drawSelect(ctx);
    this.selected = true;
  }

  drawSelect(ctx) {
    ctx.beginPath();
    const startPoint = this.points[0];
    const endPoint = this.points[this.points.length-1];
    ctx.arc(startPoint.x, startPoint.y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(endPoint.x, endPoint.y, 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  deSelect() {
    let ctx = this.getContext();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    this.drawSelect(ctx);
    this.selected = false;
    ctx.lineWidth = 1;
    this.drawToCanvas();
  }


  distanceFrom(point) {
    let distance = Number.MAX_SAFE_INTEGER;
    let segment;
    const {points} = this;
    for(let i = 1 ; i < points.length ; i++) {
      segment = new Segment(this.points[i-1], this.points[i]);
      const dist = this.distanceFromSegment(point, segment);
      if(dist < distance) {
        distance = dist;
      }
    }
    console.log(distance);
    return distance;
  };

  isNear(point, threshold) {
    return this.distanceFrom(point) < threshold;
  }
}


