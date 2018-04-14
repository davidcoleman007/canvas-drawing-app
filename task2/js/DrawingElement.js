class DrawingElement {
  getCanvas() {
    return document.getElementById('canvas');
  }

  getContext() {
    return this.getCanvas().getContext('2d');
  }

  distanceFromSegment(point, segment) {
    return Math.sqrt(
      Geometry.squareDistanceToSegment(
        point.x, point.y,
        segment.p1.x, segment.p1.y,
        segment.p2.x, segment.p2.y
      )
    );
  };
}