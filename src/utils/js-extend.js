if(String.prototype.replaceAll === undefined) {
    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    };
}
if(String.prototype.last === undefined) {
    String.prototype.last = function (n) {
        return this.substr(-n)
    };
}
if(Array.prototype.last === undefined) {
    Array.prototype.last = function (n) {
        let count = n === undefined ? 1 : n;
        let result = this.slice(Math.max(this.length - count, 0))
        return n === undefined ? result[0] : result;
    };
}
if(Array.prototype.sum === undefined) {
    String.prototype.sum = function () {
        var total = 0
        for(i=0 ; i<this.length ; i++)
            total += this[i]
        return total;
    };
}
