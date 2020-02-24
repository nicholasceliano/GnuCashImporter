declare interface Number {
    reduce: (numerator: number, denominator: number) => number[];
}

((): void => {
    Number.prototype.reduce = (numerator: number, denominator: number): number[] => {
        const gcd = function gcd(a: number, b: number): number {
			return b ? gcd(b, a%b) : a;
		};
		const greatesCommonDenom = gcd(numerator,denominator);
		return [numerator / greatesCommonDenom, denominator / greatesCommonDenom];
    };
})();