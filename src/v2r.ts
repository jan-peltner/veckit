import { V2 } from "./v2"

export class V2R {

	// canvas ctx

	private static ctx: CanvasRenderingContext2D | null = null;

	public static setCtx(ctx: CanvasRenderingContext2D): void {
		V2R.ctx = ctx;
	}

	public static getCtx(): CanvasRenderingContext2D | null {
		return V2R.ctx;
	}

	private requireCtx(): CanvasRenderingContext2D {
		if (!V2R.ctx) {
			throw new Error("Canvas context not set. Call V2R.setCtx() first.");
		}
		return V2R.ctx;
	}

	// constructors

	public constructor(
		public readonly origin: V2,
		public readonly dir: V2
	) { }

	public static fromPoints(start: V2, end: V2): V2R {
		return new V2R(start, end.sub(start));
	}

	public static fromAngle(origin: V2, angleRad: number, length: number = 1): V2R {
		const direction = new V2(Math.cos(angleRad), Math.sin(angleRad)).scale(length);
		return new V2R(origin, direction);
	}

	public get head(): V2 {
		return this.origin.add(this.dir);
	}

	// rendering

	public drawLine(style?: string | CanvasGradient | CanvasPattern, lineWidth?: number): this {
		const ctx = this.requireCtx();
		const end = this.head;

		ctx.save();
		if (style) ctx.strokeStyle = style;
		if (lineWidth) ctx.lineWidth = lineWidth;

		ctx.beginPath();
		ctx.moveTo(this.origin.x, this.origin.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
		ctx.restore();

		return this;
	}

	public drawArrow(style?: string | CanvasGradient | CanvasPattern, lineWidth?: number, headSize: number = 10): this {
		const ctx = this.requireCtx();
		const end = this.head;

		ctx.save();
		if (style) ctx.strokeStyle = style;
		if (lineWidth) ctx.lineWidth = lineWidth;

		ctx.beginPath();
		ctx.moveTo(this.origin.x, this.origin.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();

		const dir = this.dir.normalize();
		const perp = dir.perp();
		const headBase = end.sub(dir.scale(headSize));
		const head1 = headBase.add(perp.scale(headSize * 0.5));
		const head2 = headBase.sub(perp.scale(headSize * 0.5));

		ctx.beginPath();
		ctx.moveTo(end.x, end.y);
		ctx.lineTo(head1.x, head1.y);
		ctx.lineTo(head2.x, head2.y);
		ctx.closePath();

		if (style) ctx.fillStyle = style;
		ctx.fill();
		ctx.restore();

		return this;
	}

	public drawPoint(radius: number = 4, style?: string | CanvasGradient | CanvasPattern): this {
		const ctx = this.requireCtx();

		ctx.save();
		if (style) ctx.fillStyle = style;

		ctx.beginPath();
		ctx.arc(this.origin.x, this.origin.y, radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		return this;
	}

	public drawCircle(radius: number, style?: string | CanvasGradient | CanvasPattern, lineWidth?: number): this {
		const ctx = this.requireCtx();

		ctx.save();
		if (style) ctx.strokeStyle = style;
		if (lineWidth) ctx.lineWidth = lineWidth;

		ctx.beginPath();
		ctx.arc(this.origin.x, this.origin.y, radius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.restore();

		return this;
	}

	public drawX(length: number = 8, style?: string | CanvasGradient | CanvasPattern, lineWidth?: number): this {
		const ctx = this.requireCtx();

		ctx.save();
		if (style) ctx.strokeStyle = style;
		if (lineWidth) ctx.lineWidth = lineWidth;

		const halfLen = length * 0.5;

		ctx.beginPath();
		ctx.moveTo(this.origin.x - halfLen, this.origin.y - halfLen);
		ctx.lineTo(this.origin.x + halfLen, this.origin.y + halfLen);
		ctx.moveTo(this.origin.x + halfLen, this.origin.y - halfLen);
		ctx.lineTo(this.origin.x - halfLen, this.origin.y + halfLen);
		ctx.stroke();

		ctx.restore();

		return this;
	}

	public drawPlus(length: number = 8, style?: string | CanvasGradient | CanvasPattern, lineWidth?: number): this {
		const ctx = this.requireCtx();

		ctx.save();
		if (style) ctx.strokeStyle = style;
		if (lineWidth) ctx.lineWidth = lineWidth;

		const halfLen = length * 0.5;

		ctx.beginPath();
		ctx.moveTo(this.origin.x, this.origin.y - halfLen);
		ctx.lineTo(this.origin.x, this.origin.y + halfLen);
		ctx.moveTo(this.origin.x - halfLen, this.origin.y);
		ctx.lineTo(this.origin.x + halfLen, this.origin.y);
		ctx.stroke();

		ctx.restore();

		return this;
	}

	// transformations

	public translate(offset: V2): V2R {
		return new V2R(this.origin.add(offset), this.dir);
	}

	public rotate(rad: number): V2R {
		return new V2R(this.origin, this.dir.rotate(rad));
	}

	public scale(s: number): V2R {
		return new V2R(this.origin, this.dir.scale(s));
	}
}
