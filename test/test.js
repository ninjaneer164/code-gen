'use strict';

var expect = require('chai').expect;
var cg = require('../index').CodeGen;
var Modifier = require('../index').Modifier;

describe('code-gen-ts', function() {

    describe('#Modifier', function() {
        it('should have PRIVATE', function() {
            expect(Modifier).to.haveOwnProperty('PRIVATE');
            expect(Modifier.PRIVATE).to.equal('private');
        });
        it('should have PROTECTED', function() {
            expect(Modifier).to.haveOwnProperty('PROTECTED');
            expect(Modifier.PROTECTED).to.equal('protected');
        });
        it('should have PUBLIC', function() {
            expect(Modifier).to.haveOwnProperty('PUBLIC');
            expect(Modifier.PUBLIC).to.equal('public');
        });
    });

    describe('#default', function() {

        var cg0 = cg();
        var cg1 = cg({
            options: {
                prettify: true,
                tabSize: 4,
            }
        });
        var cg2 = cg({
            options: {
                prettify: false,
                tabSize: 2,
            }
        });

        it('sapce should be " "', function() {
            expect(cg0.space).to.equal(' ');
            expect(cg1.space).to.equal(' ');
        });
        it('tab should be "    "', function() {
            expect(cg0.tab).to.equal('    ');
            expect(cg1.tab).to.equal('    ');
        });
        it('prettify should be true/false', function() {
            expect(cg0.prettify).to.equal(true);
            expect(cg1.prettify).to.equal(true);
            expect(cg2.prettify).to.equal(false);
        });
        it('tabSize should be 4/2', function() {
            expect(cg0.tabSize).to.equal(4);
            expect(cg1.tabSize).to.equal(4);
            expect(cg2.tabSize).to.equal(2);
        });
        it('clases should be empty', function() {
            expect(cg0.classes.length).to.equal(0);
            expect(cg1.classes.length).to.equal(0);
            expect(cg2.classes.length).to.equal(0);
        });
        it('enums should be empty', function() {
            expect(cg0.enums.length).to.equal(0);
            expect(cg1.enums.length).to.equal(0);
            expect(cg2.enums.length).to.equal(0);
        });
        it('interfaces should be empty', function() {
            expect(cg0.interfaces.length).to.equal(0);
            expect(cg1.interfaces.length).to.equal(0);
            expect(cg2.interfaces.length).to.equal(0);
        });
    });

    describe('#coverage', function() {
        it('CodeGen', function() {
            var o = {
                options: {
                    inferType: false,
                    isDirty: '_isDirty',
                    lastUpdated: '_lastUpdated'
                },
                enums: [
                    {},
                    {
                        name: 'Foo'
                    },
                    {
                        name: 'Bar',
                        names: ['foo', 'bar'],
                        values: []
                    },
                    {
                        name: 'Bar',
                        names: ['foo', 'bar'],
                        values: [1]
                    },
                    {
                        names: ['foo', 'bar']
                    },
                    {
                        names: ['foo', 'bar'],
                        values: []
                    },
                    {
                        names: ['foo', 'bar'],
                        values: ['1']
                    }
                ],
                interfaces: [
                    {},
                    {
                        name: 'Foo'
                    },
                    {
                        name: 'Foo',
                        extends: 'Bar',
                        import: [
                            {
                                name: 'Foo',
                                path: '@angular/core'
                            },
                            {
                                name: 'Bar',
                                path: '@angular/core'
                            }
                        ],
                        properties: [
                            {},
                            {
                                name: 'foo'
                            },
                            {
                                name: 'bar',
                                optional: true
                            }
                        ],
                        methods: [
                            {},
                            {
                                name: 'foo',
                                args: [
                                    {
                                        name: 'foo',
                                        type: 'any'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                classes: [
                    {},
                    {
                        properties: [
                            undefined
                        ]
                    },
                    {
                        name: 'Foo'
                    },
                    {
                        name: 'Bar',
                        isBaseClass: true
                    },
                    {
                        name: 'Bar',
                        extends: 'Foo',
                        implements: ['Foo'],
                        import: [{
                            name: 'Foo',
                            path: '@angular/core'
                        }],
                        isBaseClass: false,
                        args: [
                            {},
                            {
                                name: 'foo'
                            },
                            {
                                name: 'bar',
                                optional: true
                            }
                        ],
                        superArgs: [
                            {
                                name: 'foo'
                            }
                        ],
                        constructorCode: 'hello world',
                        properties: [
                            {},
                            {
                                name: 'foo',
                                track: true
                            },
                            {
                                name: 'bar',
                                declare: false,
                                static: true,
                                read: false,
                                write: false
                            }, {
                                name: 'foo',
                                track: false
                            }, {
                                name: 'foo',
                                track: true,
                                trackDate: false,
                                trackState: false
                            }
                        ],
                        methods: [
                            {},
                            {
                                name: 'foo',
                                args: [
                                    {
                                        name: 'foo',
                                        type: 'any'
                                    }
                                ]
                            },
                            {
                                name: 'bar',
                                static: true
                            }
                        ]
                    }
                ]
            };
            cg(o).generate();

            o.options = {
                prettify: false
            };
            cg(o).generate();

            o.options = {
                prettify: undefined
            };
            cg(o).generate();
        });
    });

    describe('#base-classes', function() {

        var z = cg({
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

        it('should have 2 classes', function() {
            expect(z.classes.length).greaterThan(0);
            expect(z.classes.length).equals(2);
        });
        it('should have "BaseClass" and "BaseModel"', function() {
            expect(c0.name).to.equal('BaseClass');
            expect(c1.name).to.equal('BaseModel');
        });

        // BaseClass
        it('should be base class', function() {
            expect(c0.isBaseClass).to.equal(true);
            expect(c0.isBaseClass).to.equal(true);
        });

        // BaseModel
        it('should extend BaseClass', function() {
            expect(c1.extends).to.equal('BaseClass');
        });
    });

    describe('#enum', function() {

        var options = {
            prettify: false
        };

        it('should return empty string', function() {
            var z = cg({
                options,
                enums: [
                    {
                        names: ['foo', 'bar']
                    }
                ]
            });
            var g = z.generate();
            expect(g.output).to.equal('');
        });
        it('should return empty enum', function() {
            var z = cg({
                options,
                enums: [
                    {
                        name: 'Foo'
                    }
                ]
            });
            var g = z.generate();
            expect(g.output).to.equal('export enum Foo{}');
        });
        it('should return simple enum', function() {
            var z = cg({
                options,
                enums: [
                    {
                        name: 'Foo',
                        names: ['foo', 'bar']
                    }
                ]
            });
            var g = z.generate();
            expect(g.output).to.equal('export enum Foo{foo,bar}');
        });
        it('should return number enum', function() {
            var z = cg({
                options,
                enums: [
                    {
                        name: 'Foo',
                        names: ['foo', 'bar'],
                        values: [1]
                    }
                ]
            });
            var g = z.generate();
            expect(g.output).to.equal('export enum Foo{foo=1,bar}');
        });
        it('should return string enum', function() {
            var z = cg({
                options,
                enums: [
                    {
                        name: 'Foo',
                        names: ['foo', 'bar'],
                        values: ['\'foo\'', '\'bar\'']
                    }
                ]
            });
            var g = z.generate();
            expect(g.output).to.equal('export enum Foo{foo=\'foo\',bar=\'bar\'}');
        });
    });

    describe('#interface', function() {

        var options = {
            prettify: false
        };

        it('should return empty string', function() {
            var z = cg({
                options,
                interfaces: [{}]
            });
            var g = z.generate();
            expect(g.output).to.equal('');
        });
        it('should return empty interface', function() {
            var z = cg({
                options,
                interfaces: [{
                    name: 'Foo'
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export interface Foo{}');
        });
        it('should return interface with property "foo"', function() {
            var z = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo'
                        }
                    ]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export interface Foo{foo:any;}');
        });
        it('should return interface with property "foo" of type "string"', function() {
            var z = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo',
                            type: 'string'
                        }
                    ]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export interface Foo{foo:string;}');
        });
        it('should return interface with optional property "foo"', function() {
            var z = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo',
                            optional: true
                        }
                    ]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export interface Foo{foo?:any;}');
        });
        it('should return interface with method "foo"', function() {
            var z = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    methods: [
                        {
                            name: 'foo'
                        }
                    ]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export interface Foo{foo():void;}');
        });
        it('should return interface with method "foo" of type "string"', function() {
            var z = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    methods: [
                        {
                            name: 'foo',
                            type: 'string'
                        }
                    ]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export interface Foo{foo():string;}');
        });
        it('should return interface with method "foo" of type "string", arg "bar"', function() {
            var z = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    methods: [
                        {
                            name: 'foo',
                            type: 'string',
                            args: [
                                {
                                    name: 'bar'
                                }
                            ]
                        }
                    ]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export interface Foo{foo(bar:any):string;}');
        });
        it('should return interface with method "foo" of type "string", arg "bar" of type "boolean"', function() {
            var z = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    methods: [
                        {
                            name: 'foo',
                            type: 'string',
                            args: [
                                {
                                    name: 'bar',
                                    type: 'boolean'
                                }
                            ]
                        }
                    ]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export interface Foo{foo(bar:boolean):string;}');
        });
        it('should return interface with method "foo" of type "string", optional arg "bar" of type "boolean"', function() {
            var z = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    methods: [{
                        name: 'foo',
                        type: 'string',
                        args: [{
                            name: 'bar',
                            type: 'boolean',
                            optional: true
                        }]
                    }]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export interface Foo{foo(bar?:boolean):string;}');
        });
        it('should not render extra new line', function() {
            var z = cg({
                options: {
                    prettify: true
                },
                "interfaces": [{
                    "name": "Event",
                    "properties": [{
                            "name": "type",
                            "type": "EventType"
                        },
                        {
                            "name": "data",
                            "optional": true
                        }
                    ]
                }]
            });
            var g = z.generate();
            var o = g.output.split(/[\n\r]/);
            expect(o.length).to.equal(4);
        });
    });

    describe('#class', function() {

        var options = {
            prettify: false
        };

        it('should return empty string', function() {
            var z = cg({
                options,
                classes: [{}]
            });
            var g = z.generate();
            expect(g.output).to.equal('');
        });
        it('should return empty class "Foo"', function() {
            var z = cg({
                options,
                classes: [{
                    name: 'Foo'
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export class Foo{constructor(){}}');
        });
        it('should return class "Foo", extends "Bar"', function() {
            var z = cg({
                options,
                classes: [{
                    name: 'Foo',
                    extends: 'Bar'
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export class Foo extends Bar{constructor(){super();this._className=\'Foo\';}}');
        });
        it('should return class "Foo", implements "Bar"', function() {
            var z = cg({
                options,
                classes: [{
                    name: 'Foo',
                    implements: ['Bar']
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export class Foo implements Bar{constructor(){}}');
        });
        it('should return class "Foo", implements "Bar" and "Bar2"', function() {
            var z = cg({
                options,
                classes: [{
                    name: 'Foo',
                    implements: ['Bar', 'Bar2']
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export class Foo implements Bar,Bar2{constructor(){}}');
        });
        it('should return class "Foo", extends "Bar", implements "Bar2"', function() {
            var z = cg({
                options,
                classes: [{
                    name: 'Foo',
                    extends: 'Bar',
                    implements: ['Bar2']
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export class Foo extends Bar implements Bar2{constructor(){super();this._className=\'Foo\';}}');
        });
        it('should return class "Foo", arg "foo"', function() {
            var z = cg({
                options,
                classes: [{
                    name: 'Foo',
                    args: [{
                        name: 'foo'
                    }]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export class Foo{constructor(foo:any){}}');
        });
        it('should return class "Foo", extends "Bar", super arg "foo"', function() {
            var z = cg({
                options,
                classes: [{
                    name: 'Foo',
                    extends: 'Bar',
                    superArgs: [{
                        name: 'foo'
                    }]
                }]
            });
            var g = z.generate();
            expect(g.output).to.equal('export class Foo extends Bar{constructor(){super(foo);this._className=\'Foo\';}}');
        });
    });
});
