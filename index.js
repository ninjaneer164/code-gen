'use strict';

var SPACE = ' ';
var TAB = '    ';

var _isNullOrUndefined = (o) => {
    return ((o === null) || (o === undefined));
};
var _isNullOrEmpty = (s) => {
    return (_isNullOrUndefined(s) || (s.toString().trim().length === 0));
};
var _parseObject = (s, d) => {
    Object.keys(s).forEach(k => {
        if (d[k] !== undefined) {
            d[k] = s[k];
        }
    });
};
var Modifier = {
    PRIVATE: 'private',
    PROTECTED: 'protected',
    PUBLIC: 'public',
};

class Base {
    constructor(options) {
        if (options !== undefined) {
            _parseObject(options, this);
        }

        this.space = SPACE;
        this.tab = TAB;
    }

    formatStringArray(a, prettify) {
        toString(prettify);

        if (prettify === true) {
            return a.join('\n');
        } else {
            return a.join(this.space);
        }
    }
    getImportString(im, prettify) {
        this.toString(prettify);

        var m = new Map();
        im.forEach((i) => {
            var a = m.has(i.path) ? m.get(i.path) : [];
            a.push(i.name);
            m.set(i.path, a);
        });
        var i = [];
        m.forEach((a, p) => {
            i.push(`import${this.space}{${this.space}${a.join(`,${this.space}`)}${this.space}}${this.space}from${this.space}'${p}';`);
        });

        return this.formatStringArray(i, prettify);
    }
    toString(prettify) {
        if (prettify === undefined) {
            prettify = false;
        }

        this.space = (prettify === true) ? SPACE : '';
        this.tab = (prettify === true) ? TAB : '';

        return '';
    }
}

class BaseClass extends Base {
    constructor(data, options) {
        super(options);

        this.extends = '';
        this.import = [];
        this.methods = [];
        this.name = '';
        this.properties = [];

        if (data.extends !== undefined) {
            this.extends = data.extends;
        }
        if (data.import !== undefined) {
            this.import = data.import;
        }
        if (data.methods !== undefined) {
            this.methods = data.methods.map((m) => {
                return new Method(m, options);
            });
        }
        if (data.properties !== undefined) {
            this.properties = data.properties.map((p) => {
                return new Property(p, options);
            });
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
    }
}

class Class extends BaseClass {
    constructor(data, options) {
        super(data, options);

        this.args = [];
        this.constructorCode = '';
        this.implements = [];
        this.isBaseClass = false;
        this.properties = [];
        this.superArgs = [];

        if (data.args !== undefined) {
            this.args = data.args.map((a) => {
                return new Property(a, options);
            });
        }
        if (data.isBaseClass !== undefined) {
            this.isBaseClass = data.isBaseClass;
        }
        if (data.constructorCode !== undefined) {
            this.constructorCode = data.constructorCode;
        }
        if (data.implements !== undefined) {
            this.implements = data.implements;
        }
        if (data.properties !== undefined) {
            this.properties = data.properties.map((p) => {
                return new Property(p, options);
            });
        }
        if (data.superArgs !== undefined) {
            this.superArgs = data.superArgs.map((a) => {
                return new Property(a, options);
            });
        }
    }

    toString(prettify) {
        if (_isNullOrEmpty(this.name)) {
            return '';
        }

        super.toString(prettify);

        var s = [];
        var e = _isNullOrEmpty(this.extends) ? '' : ` extends ${this.extends}`;
        var i = (this.implements.length === 0)
            ? ''
            : ` implements ${this.implements.join(`,${this.space}`)}`;

        s.push(`export class ${this.name}${e}${i}${this.space}{`);

        var _ = (a, prettify) => {
            return this.formatStringArray(
                a.map((a_) => {
                    return a_.toString(prettify);
                }),
                prettify
            );
        };

        var sp = this.properties.filter((p) => {
            return (p.static === true);
        });
        if (sp.length > 0) {
            s.push(_(sp, prettify));
        }
        var sm = this.methods.filter((m) => {
            return (m.static === true);
        });
        if (sm.length > 0) {
            s.push(_(sm, prettify));
        }
        var np = this.properties.filter((p) => {
            return (p.static === false);
        });
        if (np.length > 0) {
            s.push(_(np, prettify));
        }

        var a = _(
            this.args.map((a_) => {
                return a_.toArgString(prettify);
            }),
            prettify
        );
        var c = `${this.tab}constructor(${a})${this.space}{`;
        if (!_isNullOrEmpty(this.extends)) {
            var sa = _(
                this.superArgs.map((a_) => {
                    return a_.name;
                }),
                prettify
            );
            c += `${this.space}super(${sa});`;
            c += `${this.space}this._className${this.space}=${this.space}'${this.name}';`;
        } else {
            c += ``;
        }
        if (!_isNullOrEmpty(this.constructorCode)) {
            c += `${this.space}${this.constructorCode}`;
        }
        c += `${this.space}}`;
        s.push(c);

        var nm = this.methods.filter((m) => {
            return m.static === false;
        });
        if (nm.length > 0) {
            s.push(_(nm, prettify));
        }

        s.push('}');

        return this.formatStringArray(s, prettify);
    }
}

class Enum extends Base {
    constructor(data, options) {
        super(options);

        this.enums = [];
        this.name = '';
        this.names = [];
        this.values = [];

        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.names !== undefined) {
            this.names = data.names;

            this.values = (data.values !== undefined && Array.isArray(data.values))
                ? data.names.map((n, i) => {
                    return (i < data.values.length) ? data.values[i] : '';
                })
                : data.names.map((n) => {
                    return '';
                });
            this.enums = data.names.map((n, i) => {
                return new EnumItem({
                    name: n,
                    value: this.values[i],
                });
            });
        }
    }

    toString(prettify) {
        if (_isNullOrEmpty(this.name)) {
            return '';
        }

        super.toString(prettify);

        var s = [];

        s.push(`export enum ${this.name}${this.space}{`);

        var e = [];
        this.enums.forEach((e_) => {
            var s_ = e_.toString(prettify);
            if (prettify === true) {
                e.push(TAB + s_);
            } else {
                e.push(s_);
            }
        });
        if (prettify) {
            s.push(e.join(',\n'));
        } else {
            s.push(e.join());
        }

        s.push('}');

        return this.formatStringArray(s, prettify);
    }
}

class EnumItem extends Base {
    constructor(data) {
        super();

        this.name = '';
        this.value = '';

        _parseObject(data, this);
    }

    toString(prettify) {
        super.toString(prettify);
        var v = _isNullOrEmpty(this.value)
            ? ''
            : `${this.space}=${this.space}${this.value}`;
        return `${this.name}${v}`;
    }
}

class Interface extends BaseClass {
    constructor(data, options) {
        super(data, options);
    }

    toString(prettify) {
        if (_isNullOrEmpty(this.name)) {
            return '';
        }

        super.toString(prettify);

        var s = [];
        var e = _isNullOrEmpty(this.extends) ? '' : ` extends ${this.extends}`;

        s.push(`export interface ${this.name}${e}${this.space}{`);

        if ((this.properties !== undefined) && (this.properties.length > 0)) {
            s.push(
                this.formatStringArray(
                    this.properties.map((p) => {
                        return p.toInterfaceString(prettify);
                    }),
                    prettify
                )
            );
        }
        if ((this.methods !== undefined) && (this.methods.length > 0)) {
            s.push(
                this.formatStringArray(
                    this.methods.map((m) => {
                        return m.toInterfaceString(prettify);
                    }),
                    prettify
                )
            );
        }

        s.push('}');

        return this.formatStringArray(s, prettify);
    }
}

class Method extends Base {
    constructor(data, options) {
        super(options);

        this.args = [];
        this.body = 'return;';
        this.modifier = Modifier.PUBLIC;
        this.name = '';
        this.static = false;
        this.type = 'void';

        _parseObject(data, this);

        if (data.args !== undefined) {
            this.args = data.args.map((a) => {
                return new Property(a, options);
            });
        }
    }

    toInterfaceString(prettify) {
        if (_isNullOrEmpty(this.name)) {
            return '';
        }

        super.toString(prettify);

        var a = this.args
            .map((a_) => {
                var o = (a_.optional === true) ? '?' : '';
                return `${a_.name}${o}:${this.space}${a_.type}`;
            })
            .join(`,${this.space}`);

        return `${this.tab}${this.name}(${a}):${this.space}${this.type};`;
    }
    toString(prettify) {
        if (_isNullOrEmpty(this.name)) {
            return '';
        }

        super.toString(prettify);

        var s = [];
        var t = this.static ? ' static' : '';
        var a = this.args
            .map((a_) => {
                return a_.toArgString(prettify);
            })
            .join(`,${this.space}`);

        s.push(`${this.tab}${this.modifier}${t} ${this.name}${this.space}(${a}):${this.space}${this.type}${this.space}{`);
        s.push(`${this.tab}${this.tab}${this.body}`);
        s.push(`${this.tab}}`);

        return this.formatStringArray(s, prettify);
    }
}

class Property extends Base {
    constructor(data, options) {
        super(options);

        this.inferType = false;
        this.options = options;

        if (options !== undefined) {
            if (options.inferType !== undefined) {
                this.inferType = Boolean(options.inferType);
            }
        }

        this.declare = true;
        this.getterBody = null;
        this.modifier = Modifier.PUBLIC;
        this.name = '';
        this.optional = false;
        this.read = true;
        this.setterBody = null;
        this.static = false;
        this.track = false;
        this.trackDate = true;
        this.trackState = true;
        this.type = 'any';
        this.value = 'null';
        this.write = true;

        if (data !== undefined) {
            _parseObject(data, this);
        }
    }

    toArgString(prettify) {
        if (_isNullOrEmpty(this.name)) {
            return '';
        }

        super.toString(prettify);

        var o = this.optional ? '?' : '';

        return `${this.name}${o}:${this.space}${this.type}`;
    }
    toInterfaceString(prettify) {
        if (_isNullOrEmpty(this.name)) {
            return '';
        }

        super.toString(prettify);

        var o = this.optional ? '?' : '';

        return `${this.tab}${this.name}${o}:${this.space}${this.type};`;
    }
    toString(prettify) {
        if (_isNullOrEmpty(this.name)) {
            return '';
        }

        super.toString(prettify);

        var st = this.static ? ' static ' : ' ';

        var s = [];

        if (this.declare === true) {
            s.push(`${this.tab}private${st}_${this.name}:${this.space}${this.type}${this.space}=${this.space}${this.value};`);
        }

        if (this.read === true) {
            var r = `${this.tab}${this.modifier}${st}get ${this.name}():${this.space}${this.type}${this.space}{${this.space}`;
            r += _isNullOrUndefined(this.getterBody)
                ? `return this._${this.name};`
                : `${this.getterBody}`;
            r += `${this.space}}`;
            s.push(r);
        }
        if (this.write === true) {
            var w = `${this.tab}${this.modifier}${st}set ${this.name}(value:${this.space}${this.type})${this.space}{`;
            if (_isNullOrUndefined(this.setterBody)) {
                w += `${this.space}this._${this.name}${this.space}=${this.space}value;`;
                if (this.track === true) {
                    var d = (this.trackState === true)
                        ? (this.options.isDirty !== undefined)
                            ? this.options.isDirty
                            : '_isDirty'
                        : '';
                    var dd = (d.length > 0) ? `${this.space}this.${d}${this.space}=${this.space}true;` : '';
                    var l = (this.trackDate === true)
                        ? (this.options.lastUpdated !== undefined)
                            ? this.options.lastUpdated
                            : '_lastUpdated'
                        : '';
                    var ll = (l.length > 0) ? `${this.space}this.${l}${this.space}=${this.space}(new Date()).getTime();` : '';
                    w += `${dd}${ll}`;
                }
            } else {
                w += `${this.setterBody}${this.space}`;
            }
            w += `${this.space}}`;
            s.push(w);
        }

        return this.formatStringArray(s, prettify);
    }
}

class CodeGen extends Base {
    constructor(def) {
        super();

        this.prettify = true;
        this.tabSize = 4;

        this.classes = [];
        this.enums = [];
        this.interfaces = [];

        if (def !== undefined) {
            if (def.options !== undefined) {
                this.options = def.options;
                _parseObject(def.options, this);
            }

            TAB = new Array(this.tabSize + 1).join(SPACE);

            if (def.classes !== undefined) {
                this.classes = def.classes.map((c) => {
                    return new Class(c, def.options);
                });
            }

            if (def.enums !== undefined) {
                this.enums = def.enums.map((e) => {
                    return new Enum(e, def.options);
                });
            }

            if (def.interfaces !== undefined) {
                this.interfaces = def.interfaces.map((i) => {
                    return new Interface(i, def.options);
                });
            }
        }
    }

    generate() {
        var z = {
            classes: [],
            enums: [],
            interfaces: [],
            output: '',
        };
        var s = [];
        var i = [];

        this.enums.forEach((e) => {
            z.enums.push(e.name);
            s.push(e.toString(this.prettify));
        });
        this.interfaces.forEach((n) => {
            z.interfaces.push(n.name);
            s.push(n.toString(this.prettify));
            i.push(...n.import);
        });
        this.classes.forEach((c) => {
            if (c.isBaseClass === false) {
                z.classes.push(c.name);
            }
            s.push(c.toString(this.prettify));
            i.push(...c.import);
        });

        z.output = this.formatStringArray(
            [
                this.getImportString(i, this.prettify),
                this.formatStringArray(s, this.prettify),
            ].filter((s_) => {
                return !_isNullOrEmpty(s_);
            }),
            this.prettify
        );

        return z;
    }
}

module.exports = {
    Modifier: Modifier,
    CodeGen: (d) => {
        return new CodeGen(d);
    }
};
