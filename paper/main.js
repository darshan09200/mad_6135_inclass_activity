"use strict";
const init = () => {
  paper.install(window);
  paper.setup(document.getElementById("mainCanvas"));

  //   var c;
  //   for (var x = 25; x < 400; x += 50) {
  //     for (var y = 25; y < 400; y += 50) {
  //       c = Shape.Circle(x, y, 20);
  //       c.fillColor = "green";
  //     }
  //   }

  var c = Shape.Circle(new Point(200, 200), 80);
  c.fillColor = "black";
  var text = new PointText(c.position);
  text.justification = "center";
  text.fillColor = "white";
  text.fontSize = 20;
  text.content = "hello world";

  var tool = new Tool();
  tool.onMouseDown = function (event) {
    var pointerCircle = Shape.Circle(event.point, 20);
    pointerCircle.fillColor = "green";
    project.activeLayer.addChild(pointerCircle);
    console.log(pointerCircle);
    console.log(c.intersects(pointerCircle));
    console.log(pointerCircle.intersects(c));
    if (pointerCircle.intersects(c)) c.insertBelow(event?.item);
  };

  paper.view.draw();
};

init();
