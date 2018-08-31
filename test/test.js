'use strict';

var expect = require('chai').expect;
var cg = require('../index').CodeGen;
var Modifier = require('../index').Modifier;

describe('code-gen-ts', function () {

    describe('#Modifier', function () {
        it('should have PRIVATE', function () {
            expect(Modifier).to.haveOwnProperty('PRIVATE');
            expect(Modifier.PRIVATE).to.equal('private');
        });
        it('should have PROTECTED', function () {
            expect(Modifier).to.haveOwnProperty('PROTECTED');
            expect(Modifier.PROTECTED).to.equal('protected');
        });
        it('should have PUBLIC', function () {
            expect(Modifier).to.haveOwnProperty('PUBLIC');
            expect(Modifier.PUBLIC).to.equal('public');
        });
    });

    describe('#default', function () {

        var cg0 = new cg();
        var cg1 = new cg({
            options: {
                prettify: true,
                tabSize: 4,
            }
        });
        var cg2 = new cg({
            options: {
                prettify: false,
                tabSize: 2,
            }
        });

        it('sapce should be " "', function () {
            expect(cg0.space).to.equal(' ');
            expect(cg1.space).to.equal(' ');
        });
        it('tab should be "    "', function () {
            expect(cg0.tab).to.equal('   ');
            expect(cg1.tab).to.equal('   ');
        });
        it('prettify should be true/false', function () {
            expect(cg0.prettify).to.equal(true);
            expect(cg1.prettify).to.equal(true);
            expect(cg2.prettify).to.equal(false);
        });
        it('tabSize should be 4/2', function () {
            expect(cg0.tabSize).to.equal(4);
            expect(cg1.tabSize).to.equal(4);
            expect(cg2.tabSize).to.equal(2);
        });
        it('clases should be empty', function () {
            expect(cg0.classes.length).to.equal(0);
            expect(cg1.classes.length).to.equal(0);
            expect(cg2.classes.length).to.equal(0);
        });
        it('enums should be empty', function () {
            expect(cg0.enums.length).to.equal(0);
            expect(cg1.enums.length).to.equal(0);
            expect(cg2.enums.length).to.equal(0);
        });
        it('interfaces should be empty', function () {
            expect(cg0.interfaces.length).to.equal(0);
            expect(cg1.interfaces.length).to.equal(0);
            expect(cg2.interfaces.length).to.equal(0);
        });
    });

    describe('#base-classes', function () {

        var z = new cg({
            classes: [
                {
                    name: 'BaseClass',
                    isBaseClass: true,
                    properties: [
                        {
                            name: 'id',
                            type: 'number',
                            write: false,
                        },
                        {
                            modifier: Modifier.PROTECTED,
                            name: '_className',
                            type: 'string',
                            value: "'BaseClass'",
                        },
                        {
                            name: 'className',
                            type: 'string',
                            write: false,
                            declare: false,
                        },
                    ],
                    constructorCode: 'this._id=IdManager.getNew();',
                },
                {
                    name: 'BaseModel',
                    extends: 'BaseClass',
                    isBaseClass: true,
                    properties: [
                        {
                            name: '_isDirty',
                            type: 'boolean',
                            value: 'false',
                        },
                        {
                            name: '_lastUpdated',
                            type: 'number',
                            value: '0',
                        },
                    ],
                },
            ]
        });
        var c0 = z.classes[0];
        var c1 = z.classes[1];

        it('should have 2 classes', function () {
            expect(z.classes.length).greaterThan(0);
            expect(z.classes.length).equals(2);
        });
        it('should have "BaseClass" and "BaseModel"', function () {
            expect(c0.name).to.equal('BaseClass');
            expect(c1.name).to.equal('BaseModel');
        });

        // BaseClass
        it('should be base class', function () {
            expect(c0.isBaseClass).to.equal(true);
            expect(c0.isBaseClass).to.equal(true);
        });

        // BaseModel
        it('should extend BaseClass', function () {
            expect(c1.extends).to.equal('BaseClass');
        });
    });

    describe('#coverage', function () {

        var __ = (c, n, a) => {
            var o = {};
            var oo = {};
            var b = ['extends', 'import', 'names'].includes(n);
            if (n === 'name') {
                oo[n] = a[0];
            } else {
                oo[n] = a.map((a_) => {
                    if (b === true) {
                        return a_;
                    }
                    return {
                        name: a_
                    };
                });
            }
            o[c] = [oo];

            var z = new cg(o);

            console.log(z);

            return {
                length: z[c][0][n].length,
                value: z[c][0][n].map((n_) => {
                    if (b === true) {
                        return n_;
                    }
                    return n_.name;
                }).join()
            };
        };

        describe('#coverage-BaseClass', function () {
            it('should have name "Foo"', function () {
                var a = ['foo'];
                var z = __('classes', 'name', a);
                expect(z.length).to.equal(1);
                expect(z.value).to.equal(a[0]);
            });
            it('should extend "Foo"', function () {
                var a = ['foo'];
                var z = __('classes', 'extends', a);
                expect(z.length).to.equal(1);
                expect(z.value).to.equal(a[0]);
            });
            it('should import "Foo" and "Bar', function () {
                var a = ['foo', 'bar'];
                var z = __('classes', 'import', a);
                expect(z.length).to.equal(2);
                expect(z.value).to.equal(a.join());
            });
            it('should have methods "Foo" and "Bar', function () {
                var a = ['foo', 'bar'];
                var z = __('classes', 'methods', a);
                expect(z.length).to.equal(2);
                expect(z.value).to.equal(a.join());
            });
            it('should have properties "foo" and "bar', function () {
                var a = ['foo', 'bar'];
                var z = __('classes', 'properties', a);
                expect(z.length).to.equal(2);
                expect(z.value).to.equal(a.join());
            });
        });

        describe('#coverage-Class', function () {
            it('should have args "foo" and "bar', function () {
                var a = ['foo', 'bar'];
                var z = __('classes', 'args', a);
                expect(z.length).to.equal(2);
                expect(z.value).to.equal(a.join());
            });
            it('should have constructorCode "console.log(\'hello world\');"', function () {
                var a = ['console.log(\'hello world\');'];
                var z = __('classes', 'constructorCode', a);
                expect(z.length).to.equal(1);
                expect(z.value).to.equal(a[0]);
            });
            it('should have args "foo" and "bar', function () {
                var a = ['foo', 'bar'];
                var z = __('classes', 'implements', a);
                expect(z.length).to.equal(2);
                expect(z.value).to.equal(a.join());
            });
            it('should have args "foo" and "bar', function () {
                var a = ['foo', 'bar'];
                var z = __('classes', 'properties', a);
                expect(z.length).to.equal(2);
                expect(z.value).to.equal(a.join());
            });
            it('should have args "foo" and "bar', function () {
                var a = ['foo', 'bar'];
                var z = __('classes', 'superArgs', a);
                expect(z.length).to.equal(2);
                expect(z.value).to.equal(a.join());
            });
        });

        describe('#coverage-Enum', function () {
            it('should have name "Foo"', function () {
                var a = ['Foo'];
                var z = __('enums', 'name', a);
                expect(z.length).to.equal(1);
                expect(z.value).to.equal(a[0]);
            });
            it('should have enums "foo" and "bar"', function () {
                var a = ['foo', 'bar'];
                var z = __('enums', 'names', a);
                expect(z.length).to.equal(2);
                expect(z.value).to.equal(a.join());
            });
        });
    });
});
