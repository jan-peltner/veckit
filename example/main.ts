import { M23, V2, V2R } from "./libs/veckit.ts"

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

V2R.setCtx(ctx);

// flip the y-axis and center the origin
ctx.setTransform(...M23.canvasYUpCentered(canvas.clientWidth, canvas.clientHeight).toCanvasTuple());

const coordSystem = [
  V2R.fromPoints(V2.zero(), new V2(200, 0)),
  V2R.fromPoints(V2.zero(), new V2(0, 200)),
];

const f = [
  V2R.fromPoints(V2.zero(), new V2(0, 100)),
  V2R.fromPoints(V2.zero(), new V2(50, 0)).translate(new V2(0, 50)),
  V2R.fromPoints(V2.zero(), new V2(50, 0)).translate(new V2(0, 100)),
];

const f2 = [...f];

for (const axis of coordSystem) {
  axis.drawArrow();
}

for (const vec of f) {
  vec.drawLine("#ff0000", 2);
}

for (const vec of f2) {
  const r = vec.rotateAboutOrigin(0.25 * Math.PI);
  r.drawLine("#00ff00", 2);
}

