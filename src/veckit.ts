export class M23 {
	// constructors

	/** matrix layout column major
	 * | a, c, tx |
	 * | b, d, ty |
	 */
	public constructor(
		public readonly a: number,
		public readonly b: number,
		public readonly c: number,
		public readonly d: number,
		public readonly tx: number,
		public readonly ty: number,
	) { }

	public static identity(): M23 {
		return new M23(1, 0, 0, 1, 0, 0);
	}

	public static rotation(rad: number): M23 {
		const c = Math.cos(rad);
		const s = Math.sin(rad);
		return new M23(c, s, -s, c, 0, 0)
	}

	public static scale(v: V2): M23 {
		return new M23(v.x, 0, 0, v.y, 0, 0);
	}

	public static shearX(s: number): M23 {
		return new M23(1, 0, s, 1, 0, 0);
	}

	public static shearY(s: number): M23 {
		return new M23(1, s, 0, 1, 0, 0);
	}

	public static reflectX(): M23 {
		return new M23(1, 0, 0, -1, 0, 0);
	}

	public static reflectY(): M23 {
		return new M23(-1, 0, 0, 1, 0, 0);
	}

	public static translation(v: V2): M23 {
		return new M23(1, 0, 0, 1, v.x, v.y);
	}

	public static canvasYUp(height: number): M23 {
		return new M23(1, 0, 0, -1, 0, height);
	}

	public static canvasYUpCentered(width: number, height: number): M23 {
		return new M23(1, 0, 0, -1, width / 2, height / 2);
	}

	// composition

	public mul(m: M23): M23 {
		return new M23(
			// linear part
			this.a * m.a + this.c * m.b,
			this.b * m.a + this.d * m.b,
			this.a * m.c + this.c * m.d,
			this.b * m.c + this.d * m.d,
			// affine/translation
			this.a * m.tx + this.c * m.ty + this.tx,
			this.b * m.tx + this.d * m.ty + this.ty,
		)
	}

	// application

	public transform(v: V2): V2 {
		return new V2(
			this.a * v.x + this.c * v.y + this.tx,
			this.b * v.x + this.d * v.y + this.ty
		);
	}

	public transformLinear(v: V2): V2 {
		return new V2(
			this.a * v.x + this.c * v.y,
			this.b * v.x + this.d * v.y
		);
	}

	// misc 

	public toCanvasTuple(): [number, number, number, number, number, number,] {
		return [this.a, this.b, this.c, this.d, this.tx, this.ty];
	}
}

export class V2 {
	public constructor(public readonly x: number, public readonly y: number) { }

	public static zero(): V2 {
		return new V2(0, 0);
	}

	public static fromAngle(rad: number): V2 {
		return new V2(Math.cos(rad), Math.sin(rad));
	}

	/** Map a noise sample in [-1; 1] to a unit vector */
	public static fromNoise(n: number): V2 {
		n = Math.max(-1, Math.min(1, n));
		const angle = (n + 1) * Math.PI;
		return V2.fromAngle(angle);
	}

	public add(v: V2): V2 {
		return new V2(this.x + v.x, this.y + v.y);
	}

	public sub(v: V2): V2 {
		return new V2(this.x - v.x, this.y - v.y);
	}

	public lenSqr(): number {
		return this.x * this.x + this.y * this.y;
	}

	public len(): number {
		return Math.sqrt(this.lenSqr());
	}

	public normalize(): V2 {
		const len = this.len();
		if (len === 0) return V2.zero();
		return new V2(this.x / len, this.y / len);
	}

	public dot(v: V2): number {
		return this.x * v.x + this.y * v.y;
	}

	public angle(v: V2): number {
		const det = this.x * v.y - this.y * v.x;
		const dot = this.dot(v);
		return Math.atan2(det, dot);
	}

	public scale(s: number): V2 {
		return new V2(this.x * s, this.y * s);
	}

	public rotate(rad: number): V2 {
		const c = Math.cos(rad);
		const s = Math.sin(rad);
		return new V2(this.x * c - this.y * s, this.x * s + this.y * c);
	}

	public perp(): V2 {
		return new V2(-this.y, this.x);
	}

	public distance(v: V2): number {
		return v.sub(this).len();
	}

	public toArray(): Array<number> {
		return [this.x, this.y];
	}

	public static radToDeg(rad: number): number {
		return rad * (180 / Math.PI);
	}

	public static degToRad(deg: number): number {
		return deg * (Math.PI / 180);
	}
}

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

	public rotateInPlace(rad: number): V2R {
		return new V2R(this.origin, this.dir.rotate(rad));
	}

	public rotateAround(rad: number, pivot: V2): V2R {
		const rM = M23.rotation(rad);

		const rotOrig = rM.transformLinear(this.origin.sub(pivot)).add(pivot);
		const rotDir = rM.transformLinear(this.dir);

		return new V2R(rotOrig, rotDir);
	}

	public rotateAboutOrigin(rad: number): V2R {
		return this.rotateAround(rad, V2.zero())
	}

	public scale(s: number): V2R {
		return new V2R(this.origin, this.dir.scale(s));
	}

	public transform(m: M23): V2R {
		return new V2R(m.transform(this.origin), m.transformLinear(this.dir));
	}
}
