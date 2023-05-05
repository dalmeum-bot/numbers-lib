function Integer(pieces, sign) {
    this.pieces = pieces;
    this.sign = sign;
}

const BASE_DIGIT = 7;
const SEPARATOR = ',';
const BASE = Math.pow(10, BASE_DIGIT);

Integer.prototype = {
    add(z) {
        if (this.sign === 1 && z.sign === -1) return this.sub(z);
        if (this.sign === -1 && z.sign === 1) return z.sub(this);
        
        let a, b;
        if (this.pieces.length < z.pieces.length) [a, b] = [z.pieces, this.pieces];
        else [a, b] = [this.pieces, z.pieces];
    
        let r = new Array(a.length);
    
        let i = 0,
            carry = 0,
            sum = 0;
    
        for (i = 0; i < b.length; i++) {
            sum = a[i] + b[i] + carry;
            carry = (sum >= BASE) ? 1 : 0;
            r[i] = sum - carry * BASE;
        }
    
        while (i < a.length) {
            sum = a[i] + carry;
            carry = (sum == BASE) ? 1 : 0;
            r[i] = sum - carry * BASE;
            i++;
        }
    
        if (carry > 0) r.push(carry);
    
        return new Integer(r, this.sign);
    },
    
    sub(z) {
        // TODO - Implement
    },

    mul(z) {
        // TODO - Implement
    },

    div(z) {
        // TODO - Implement
    },

    mod(z) {
        // TODO - Implement
    },

    pos() {
        return this;
    },

    neg() {
        return new Integer(this.pieces, -this.sign);
    },

    equal(z) {
        return this.sign === z.sign && (this.pieces.every((v, i) => v === z.pieces[i]));
    },

    greater(z) {
        if (this.sign === 1 && z.sign === -1) return true;
        if (this.sign === -1 && z.sign === 1) return false;

        if (this.pieces.length > z.pieces.length) return this.sign === 1;
        if (this.pieces.length < z.pieces.length) return this.sign !== 1;        

        for (let i = this.pieces.length - 1; i >= 0; i--) {
            if (this.pieces[i] > z.pieces[i]) return this.sign === 1;
            if (this.pieces[i] < z.pieces[i]) return this.sign !== 1;
        }

        return false;
    },

    less(z) {
        return !(this.equal(z) || this.greater(z));
    },

    toString() {
        let str = '';
        this.pieces.forEach(e => str = e + str);
        str = str.replace(/\B(?=(\d{3})+(?!\d))/g, SEPARATOR);
        return (this.sign === -1 ? '-' : '') + str;
    }
};  

function Int(number) {
    let sign = 1;
    if (number.startsWith('-'))
        sign = -1;

    number = number.replace(/ |\+|-/g, ''); 

    let chucks = [];
    while (number.length != 0) {
        let chucklen = (number.length % BASE_DIGIT == 0) ? BASE_DIGIT : number.length % BASE_DIGIT;
        chucks.unshift(number.slice(0, chucklen));
        number = number.slice(chucklen);
    }

    return new Integer(chucks.map(Number), sign);
};

module.exports = Int;

// console.log(Int('123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890').toString());