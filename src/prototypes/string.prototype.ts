declare interface String {
    removeDashes: () => string;
}

((): void => {
    String.prototype.removeDashes = function(this: string): string {
        return this.replace(/-/g, '');
    };
})();