var Geometry = {
  /**
   * Returns the distance between 2 points
   * x1/y1: position of 1st point
   * x2/y2: position of 2nd point
   */
  distance: function(x1, y1, x2, y2) {
    return Math.sqrt(this.squareDistance(x1, y1, x2, y2));
  },
  
  /**
   * Returns the square of the distance between 2 points
   * x1/y1: position of 1st point
   * x2/y2: position of 2nd point
   */
  squareDistance: function(x1, y1, x2, y2) {
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  },
  
  /**
   * Returns the distance between from a point P to a line segment
   * x,y: position of P
   * x1,y1 / x2,y2: position of segment ends
   */
  distanceToSegment: function(x, y, x1, y1, x2, y2) {
    return Math.sqrt(this.squareDistanceToSegment(x, y, x1, y1, x2, y2));
  },
  
  /**
   * Returns the square of the distance from a point P to a line segment
   * x,y: position of P
   * x1,y1 / x2,y2: position of segment ends
   */
  squareDistanceToSegment: function(x, y, x1, y1, x2, y2) {
    var length2 = this.squareDistance(x1, y1, x2, y2);
    if(length2 == 0)
      return this.squareDistance(x, y, x1 , y1);
    
    // consider the line as parameterized function, find projection param
    var t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / length2;
    // clamp to segment
    if(t < 0)
      t = 0;
    else if(t > 1)
      t = 1;
    // compute projected point on line
    var xp = x1 + t * (x2 - x1);
    var yp = y1 + t * (y2 - y1);
    // return square distance to projected point
    return this.squareDistance(x, y, xp, yp);
  },
};
