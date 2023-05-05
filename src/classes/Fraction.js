/**
 * Rational number class
 * @author rhseung
 * @during 2023. 4. 23 ~ 2023. 4. 24
 */

function Rational(n, d) {
    if (d == 0) {
        throw new Error("Division by zero");
    }

    let negative = (n < 0) ^ (d < 0);

    // TODO - using Integer class
    this.numerator = Math.abs(n) * (negative ? -1 : 1);
    this.denominator = Math.abs(d);
}

Rational.prototype = {
    add(q) {
        return new Rational(
            this.numerator * q.denominator + q.numerator * this.denominator,
            this.denominator * q.denominator
        ).reduce();
    },

    sub(q) {
        return new Rational(
            this.numerator * q.denominator - q.numerator * this.denominator,
            this.denominator * q.denominator
        ).reduce();
    },

    mul(q) {
        return new Rational(
            this.numerator * q.numerator,
            this.denominator * q.denominator
        ).reduce();
    },

    div(q) {
        return new Rational(
            this.numerator * q.denominator,
            this.denominator * q.numerator
        ).reduce();
    },

    mod(q) {
        return new Rational(
            this.numerator * q.denominator % (this.denominator * q.numerator),
            this.denominator * q.denominator
        ).reduce();
    },

    pos() {
        return this;
    },

    neg() {
        return new Rational(-this.numerator, this.denominator);
    },

    equal(q) {
        let q = q.reduce();
        return this.numerator == q.numerator && this.denominator == q.denominator;
    },

    greater(q) {
        return this.numerator * q.denominator > q.numerator * this.denominator;
    },

    less(q) {
        return this.numerator * q.denominator < q.numerator * this.denominator;
    },

    inverse() {
        return new Rational(this.denominator, this.numerator);
    },

    reduce() {
        let gcd = (a, b) => b ? gcd(b, a % b) : a;
        let g = gcd(this.numerator, this.denominator);
        return new Rational(this.numerator / g, this.denominator / g);
    },

    toString() {
        return this.numerator + (this.denominator !== 1 ? ("/" + this.denominator) : "");
    },

    toNumber() {
        return this.numerator / this.denominator;
    }
};

/**
 * @param {String | Number | Rational | undefined} numerator 
 * @param {String | Number | undefined} denominator 
 * @returns {Rational}
 */

const _RATIONAL_FORMAT = /^\s*(?<sign>[-+]?)(?=\d|\.\d)(?<num>\d*|\d+(?:_\d+)*)(?:(?:[:/](?<denom>\d+(?:_\d+)*))?|(?:\.(?<decimal>|\d+(?:_\d+)*)?(?:'(?<cycle>\d+(?:_\d+)*?)')?)?(?:[eE](?<exp>[-+]?\d+(?:_\d+)*))?)\s*$/;

function Fraction(numerator, denominator) {
    if (numerator === undefined && denominator === undefined) {
        return new Rational(0, 1);
    } else if (denominator === undefined) {
        switch (numerator.constructor) {
            case Number:
                if (Number.isInteger(numerator)) {
                    return new Rational(numerator, 1);
                } else {
                    return Fraction(String(numerator));
                }
            case Rational:
                return numerator;
            case String:
                let m = numerator.match(_RATIONAL_FORMAT);
                if (m == null) {
                    throw new Error("Invalid rational format: " + numerator);
                }

                for (let k in m.groups) {
                    if (m.groups[k] != undefined && k != 'sign') {
                        m.groups[k] = m.groups[k].replace(/_/g, '');
                    }
                }

                let num = m.groups.num || '';
                let denom = m.groups.denom || '';
                if (denom) {
                    denom = Number(denom);
                } else {
                    denom = 1
                    let decimal = m.groups.decimal || '';
                    let exp = m.groups.exp;
                    let cycle = m.groups.cycle || '0';

                    if (decimal !== undefined || cycle !== undefined) {
                        num = Number(num + decimal + cycle) - Number(num + decimal);
                        denom = Math.pow(10, decimal.length) * (Math.pow(10, cycle.length) - 1);
                    }
                    
                    if (exp !== undefined) {
                        exp = Number(exp);
                        
                        if (exp >= 0) {
                            num *= Math.pow(10, exp);
                        } else {
                            denom *= Math.pow(10, -exp);
                        }
                    }
                }

                if (m.groups.sign == '-') {
                    num = -num;
                }

                return new Rational(num, denom).reduce();
            default:
                throw new TypeError("numerator should be a String or Number or Rational instance.");
        }
    } else {
        if (Number.isInteger(numerator) && Number.isInteger(denominator)) {
            return new Rational(numerator, denominator);
        } else {
            return Fraction(String(numerator)).div(Fraction(String(denominator)));
        }
    }
};

module.exports = Fraction;