declare interface String {
    removeDashes: () => string;
    removeParentheses: () => string;
}

((): void => {
  String.prototype.removeDashes = function (this: string): string {
    return this.replace(/-/g, '')
  }

  String.prototype.removeParentheses = function (this: string): string {
    return this.replace(/([()])/g, '')
  }
})()
