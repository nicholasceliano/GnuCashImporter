declare interface Date {
    toMySqlDateTimeString: () => string;
}

((): void => {
    Date.prototype.toMySqlDateTimeString = function(this: Date): string {
        return this.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    };
})();