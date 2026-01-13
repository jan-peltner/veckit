export class V2 {
	public constructor(public readonly x: number, public readonly y: number) { }

	public add(v: V2): V2 {
		return new V2(this.x + v.x, this.y + v.y);
	}

	public sub(v: V2): V2 {
		return new V2(this.x - v.x, this.y - v.y);
	}

	public scale(s: number): V2 {
		return new V2(this.x * s, this.y * s);
	}

	public lenSqr(): number {
		return this.x * this.x + this.y * this.y;
	}

	public len(): number {
		return Math.sqrt(this.lenSqr());
	}

	public normalize(): V2 {
		const len = this.len();
		if (len === 0) return new V2(0, 0);
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

	public static radToDeg(rad: number): number {
		return rad * (180 / Math.PI);
	}

	public static degToRad(deg: number): number {
		return deg * (Math.PI / 180);
	}
}
