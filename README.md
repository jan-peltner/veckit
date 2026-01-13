# veckit

A lightweight 2D vector math and rendering library.

## Features

**V2**: Core vector class with standard math operations
**V2R**: Canvas renderer for visualizing vectors

## Usage

```typescript
import { V2 } from ".v2";
import { V2R } from ".v2r";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

V2R.setCtx(ctx);

const center = new V2(400, 300);

// Draw some arrows from center
const arrow1 = new V2R(center, new V2(100, 0));
const arrow2 = new V2R(center, new V2(0, -80));
const arrow3 = V2R.fromAngle(center, Math.PI / 4, 100);

arrow1.drawArrow("#ff6b6b", 2);
arrow2.drawArrow("#4ecdc4", 2);
arrow3.drawArrow("#ffe66d", 2);

// Draw a point at center
new V2R(center, new V2(0, 0)).drawPoint();

// Draw some lines
const lineStart = new V2(100, 100);
V2R.fromPoints(lineStart, new V2(200, 150)).drawLine("#888", 1);
V2R.fromPoints(new V2(200, 150), new V2(150, 250)).drawLine("#888", 1);

// Draw a circle
new V2R(new V2(600, 400), new V2(0, 0)).drawCircle(50, "#9b59b6", 2);
```

