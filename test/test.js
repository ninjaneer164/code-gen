'use strict';

var expect = require('chai').expect;
var cg = require('../index').CodeGen;
var Modifier = require('../index').Modifier;

function verify(cg, result) {
    var g = cg.generate();
    expect(g.output).to.equal(result);
}
function verifyLineCount(cg, count) {
    var g = cg.generate();
    var o = g.output.split(/[\n\r]/);
    expect(o.length).to.equal(count);
}

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

    describe('#base', function() {

        var cg0, cg1;

        cg0 = cg({
            options: {
                prettify: undefined
            },
            classes: [
                {
                    name: 'Foo',
                    import: [
                        {
                            name: 'Component',
                            path: '@angular/core'
                        },
                        {
                            name: 'OnInit',
                            path: '@angular/core'
                        }
                    ]
                }
            ]
        });

        cg1 = cg({
            options: {
                prettify: false
            }
        });
        cg1.addClass('Foo').addImport('Component', '@angular/core').addImport('OnInit', '@angular/core');

        it('should return imports, empty class "Foo"', function() {
            var z = 'import{Component,OnInit}from\'@angular/core\';export class Foo{}'
            verify(cg0, z);
            verify(cg1, z);
        });
    });

    describe('#base-class', function() {

        var cg0;
        var cg1, c10, c11;

        var cg0 = cg({
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
                            value: 'false'
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
        var c00 = cg0.classes[0];
        var c01 = cg0.classes[1];

        beforeEach(function() {
            cg1 = cg({
                options: {
                    prettify: false
                }
            });
            // calling setIsBaseClass twice for code coverage - has the same effect
            c10 = cg1.addClass('BaseClass').setIsBaseClass().setIsBaseClass(true);
            c11 = cg1.addClass('BaseModel').setIsBaseClass().addExtends('BaseClass');
        });

        it('should have 2 classes', function() {
            expect(cg0.classes.length).equals(2);
            expect(cg1.classes.length).equals(2);
        });
        it('should have "BaseClass" and "BaseModel"', function() {
            expect(c00.name).to.equal('BaseClass');
            expect(c01.name).to.equal('BaseModel');
            expect(c10.name).to.equal('BaseClass');
            expect(c11.name).to.equal('BaseModel');
        });

        // BaseClass
        it('should be base class', function() {
            expect(c00.isBaseClass).to.equal(true);
            expect(c01.isBaseClass).to.equal(true);
            expect(c10.isBaseClass).to.equal(true);
            expect(c11.isBaseClass).to.equal(true);
        });

        // BaseModel
        it('should extend BaseClass', function() {
            expect(c01.extends).to.equal('BaseClass');
            expect(c11.extends).to.equal('BaseClass');
        });
    });

    describe('#enum', function() {

        var cg0, cg1;
        var options = {
            prettify: false
        };

        beforeEach(function() {
            cg1 = cg({
                options: {
                    prettify: false
                }
            });
        });

        it('should return empty string', function() {
            var z = '';

            cg0 = cg({
                options,
                enums: [
                    {
                        names: ['foo', 'bar']
                    }
                ]
            });
            verify(cg0, z);

            cg1.addEnum();
            verify(cg1, z);
        });
        it('should return empty enum', function() {
            var z = 'export enum Foo{}';

            cg0 = cg({
                options,
                enums: [
                    {
                        name: 'Foo'
                    }
                ]
            });
            verify(cg0, z);

            cg1.addEnum('Foo');
            verify(cg1, z);
        });
        it('should return simple enum', function() {
            var z = 'export enum Foo{foo,bar}';

            cg0 = cg({
                options,
                enums: [
                    {
                        name: 'Foo',
                        names: ['foo', 'bar']
                    }
                ]
            });
            verify(cg0, z);

            cg1.addEnum('Foo').addItem('foo').addItem('bar');
            verify(cg1, z);
        });
        it('should return number enum', function() {
            var z = 'export enum Foo{foo=1,bar}';

            cg0 = cg({
                options,
                enums: [
                    {
                        name: 'Foo',
                        names: ['foo', 'bar'],
                        values: [1]
                    }
                ]
            });
            verify(cg0, z);

            cg1.addEnum('Foo').addItem('foo', 1).addItem('bar');
            verify(cg1, z);
        });
        it('should return string enum', function() {
            var z = 'export enum Foo{foo=\'foo\',bar=\'bar\'}';

            cg0 = cg({
                options,
                enums: [
                    {
                        name: 'Foo',
                        names: ['foo', 'bar'],
                        values: ['\'foo\'', '\'bar\'']
                    }
                ]
            });
            verify(cg0, z);

            cg1.addEnum('Foo').addItem('foo', '\'foo\'').addItem('bar', '\'bar\'');
            verify(cg1, z);
        });
        it('should return empty enum "Foo"', function() {
            var z = 2;

            cg0 = cg({
                options: {
                    prettify: true
                },
                enums: [
                    {
                        name: 'Foo'
                    }
                ]
            });
            verifyLineCount(cg0, z);

            cg1 = cg({
                options: {
                    prettify: true
                }
            });
            cg1.addEnum('Foo');
            verifyLineCount(cg1, z);
        });
        it('should return enum "Foo", two items', function() {
            var z = 4;

            cg0 = cg({
                options: {
                    prettify: true
                },
                enums: [
                    {
                        name: 'Foo',
                        names: [
                            'foo',
                            'bar'
                        ]
                    }
                ]
            });
            verifyLineCount(cg0, z);

            cg1 = cg({
                options: {
                    prettify: true
                }
            });
            cg1.addEnum('Foo').addItem('foo').addItem('bar');
            verifyLineCount(cg1, z);
        });
    });

    describe('#interface', function() {

        var cg0, cg1;
        var options = {
            prettify: false
        };

        beforeEach(function() {
            cg1 = cg({
                options: {
                    prettify: false
                }
            });
        });

        it('should return empty string', function() {
            var z = '';

            cg0 = cg({
                options,
                interfaces: [{}]
            });
            verify(cg0, z);

            cg1.addInterface();
            verify(cg1, z);
        });
        it('should return empty interface', function() {
            var z = 'export interface Foo{}';

            cg0 = cg({
                options,
                interfaces: [{
                    name: 'Foo'
                }]
            });
            verify(cg0, z);

            cg1.addInterface('Foo');
            verify(cg1, z);
        });
        it('should return interface"Foo", extends "Bar', function() {
            var z = 'export interface Foo extends Bar{}';

            cg0 = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    extends: 'Bar'
                }]
            });
            verify(cg0, z);

            cg1.addInterface('Foo').addExtends('Bar');
            verify(cg1, z);
        });
        it('should return empty interface "Foo"', function() {
            var z = 'export interface Foo{}';

            cg0 = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    properties: [
                        {}
                    ]
                }]
            });
            verify(cg0, z);

            cg1.addInterface('Foo').addMethod();
            verify(cg1, z);
        });
        it('should return interface with property "foo"', function() {
            var z = 'export interface Foo{foo:any;}';

            cg0 = cg({
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
            verify(cg0, z);

            cg1.addInterface('Foo').addProperty('foo');
            verify(cg1, z);
        });
        it('should return interface with property "foo" of type "string"', function() {
            var z = 'export interface Foo{foo:string;}';

            cg0 = cg({
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
            verify(cg0, z);

            cg1.addInterface('Foo').addProperty('foo').setType('string');
            verify(cg1, z);
        });
        it('should return interface with optional property "foo"', function() {
            var z = 'export interface Foo{foo?:any;}';

            cg0 = cg({
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
            verify(cg0, z);

            cg1.addInterface('Foo').addProperty('foo').setOptional();
            verify(cg1, z);
        });
        it('should return empty interface "Foo"', function() {
            var z = 'export interface Foo{}';

            cg0 = cg({
                options,
                interfaces: [{
                    name: 'Foo',
                    methods: [
                        {}
                    ]
                }]
            });
            verify(cg0, z);

            cg1.addInterface('Foo').addMethod();
            verify(cg1, z);
        });
        it('should return interface with method "foo"', function() {
            var z = 'export interface Foo{foo():void;}';

            cg0 = cg({
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
            verify(cg0, z);

            cg1.addInterface('Foo').addMethod('foo');
            verify(cg1, z);
        });
        it('should return interface with method "foo" of type "string"', function() {
            var z = 'export interface Foo{foo():string;}';

            cg0 = cg({
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
            verify(cg0, z);

            cg1.addInterface('Foo').addMethod('foo').setType('string');
            verify(cg1, z);
        });
        it('should return interface with method "foo" of type "string", arg "bar"', function() {
            var z = 'export interface Foo{foo(bar:any):string;}';

            cg0 = cg({
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
            verify(cg0, z);

            var i = cg1.addInterface('Foo').addMethod('foo').setType('string');
            i.addArg('bar');
            verify(cg1, z);
        });
        it('should return interface with method "foo" of type "string", arg "bar" of type "boolean"', function() {
            var z = 'export interface Foo{foo(bar:boolean):string;}';

            cg0 = cg({
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
            verify(cg0, z);

            var i = cg1.addInterface('Foo').addMethod('foo').setType('string');
            i.addArg('bar').setType('boolean');
            verify(cg1, z);
        });
        it('should return interface with method "foo" of type "string", optional arg "bar" of type "boolean"', function() {
            var z = 'export interface Foo{foo(bar?:boolean):string;}';

            cg0 = cg({
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
            verify(cg0, z);

            var i = cg1.addInterface('Foo').addMethod('foo').setType('string');
            i.addArg('bar').setType('boolean').setOptional();
            verify(cg1, z);
        });
        it('should not render extra new line', function() {
            var z = 4;

            cg0 = cg({
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
            verifyLineCount(cg0, z);

            cg1 = cg({
                options: {
                    prettify: true
                }
            });
            var i = cg1.addInterface('Event');
            i.addProperty('type').setType('EventType');
            i.addProperty('data').setOptional(true);
            verifyLineCount(cg1, z);
        });
    });

    describe('#class', function() {

        var cg0, cg1;
        var options = {
            prettify: false
        };

        beforeEach(function() {
            cg1 = cg({
                options: {
                    prettify: false
                }
            });
        });

        it('should return empty string', function() {
            var z = '';

            cg0 = cg({
                options,
                classes: [{}]
            });
            verify(cg0, z);

            cg1.addClass();
            verify(cg0, z);
        });
        it('should return empty class, isBaseClass', function() {
            var z = 'export class Foo{}';

            cg0 = cg({
                options,
                classes: [
                    {
                        name: 'Foo',
                        isBaseClass: true
                    }
                ]
            });
            verify(cg0, z);

            cg1.addClass('Foo').setIsBaseClass();
            verify(cg0, z);
        });
        it('should return empty class "Foo"', function() {
            var z = 'export class Foo{}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo'
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo');
            verify(cg1, z);
        });
        it('should return empty class "Foo"', function() {
            var z = 'export class Foo{}';

            cg0 = cg({
                options,
                classes: [
                    {
                        name: 'Foo',
                        args: [
                            {}
                        ]
                    }
                ]
            });

            cg1.addClass('Foo').addArg();
            verify(cg1, z);
        });
        it('should return class "Foo", extends "Bar"', function() {
            var z = 'export class Foo extends Bar{constructor(){super();}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    extends: 'Bar'
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addExtends('Bar');
            verify(cg1, z);
        });
        it('should return class "Foo", extends "Bar", "_className"', function() {
            var className = '_className';
            var z = 'export class Foo extends Bar{constructor(){super();this._className=\'Foo\';}}';

            cg0 = cg({
                options: {
                    className,
                    prettify: false
                },
                classes: [
                    {
                        name: 'Foo',
                        extends: 'Bar'
                    }
                ]
            });
            expect(cg0.classes[0].className).to.eq(className);
            verify(cg0, z);

            cg1.options.className = className;
            cg1.addClass('Foo').addExtends('Bar');
            expect(cg1.classes[0].className).to.eq(className);
            verify(cg1, z);
        });
        it('should return class "Foo", implements "Bar"', function() {
            var z = 'export class Foo implements Bar{}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    implements: ['Bar']
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addImplements('Bar');
            verify(cg1, z);
        });
        it('should return class "Foo", implements "Bar" and "Bar2"', function() {
            var z = 'export class Foo implements Bar,Bar2{}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    implements: ['Bar', 'Bar2']
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addImplements('Bar').addImplements('Bar2');
            verify(cg1, z);
        });
        it('should return class "Foo", extends "Bar", implements "Bar2"', function() {
            var z = 'export class Foo extends Bar implements Bar2{constructor(){super();}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    extends: 'Bar',
                    implements: ['Bar2']
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addExtends('Bar').addImplements('Bar2');
            verify(cg1, z);
        });
        it('should return class "Foo", arg "foo"', function() {
            var z = 'export class Foo{constructor(foo:any){}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    args: [{
                        name: 'foo'
                    }]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addArg('foo');
            verify(cg1, z);
        });
        it('should return class "Foo", optional arg "foo"', function() {
            var z = 'export class Foo{constructor(foo?:any){}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    args: [{
                        name: 'foo',
                        optional: true
                    }]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addArg('foo').setOptional();
            verify(cg1, z);
        });
        it('should return class "Foo", extends "Bar", super arg "foo"', function() {
            var z = 'export class Foo extends Bar{constructor(){super(foo);}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    extends: 'Bar',
                    superArgs: [{
                        name: 'foo'
                    }]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addExtends('Bar').addSuperArg('foo');
            verify(cg1, z);
        });
        it('should return class "Foo", no property "foo"', function() {
            var z = 'export class Foo{}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    properties: [
                        undefined
                    ]
                }]
            });
            verify(cg0, z);
        });
        it('should return class "Foo", property "foo", inferType', function() {
            var z = 'export class Foo{public foo:any;}';

            cg0 = cg({
                options: {
                    ...options,
                    inferType: true
                },
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo'
                        }
                    ]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addProperty('foo');
            verify(cg1, z);
        });
        it('should return class "Foo", property "id" with getter and setter bodies', function() {
            var z = 'export class Foo{private _id:number=0;public get id():number{return this._id;}public set id(value:number){throw new Error(\'"id" cannot be set\');}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'id',
                            type: 'number',
                            value: 0,
                            getterBody: 'return this._id;',
                            setterBody: 'throw new Error(\'"id" cannot be set\');'
                        }
                    ]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addProperty('id').setType('number').setValue(0).setGetter('return this._id;').setSetter('throw new Error(\'"id" cannot be set\');');
            verify(cg1, z);
        });
        it('should return class "Foo", static property "id"', function() {
            var z = 'export class Foo{public static _id:number=new Date().getTime();}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: '_id',
                            type: 'number',
                            static: true,
                            value: 'new Date().getTime()'
                        }
                    ]
                }]
            });
            verify(cg0, z);

            var p = cg1.addClass('Foo').addProperty('_id');
            p.setType('number').setStatic().setValue('new Date().getTime()');
            verify(cg1, z);

            p.setStatic(true);
            verify(cg1, z);
        });
        it('should return class "Foo", protected property "_className"', function() {
            var z = 'export class Foo{protected _className:string=\'BaseClass\';}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: '_className',
                            type: 'string',
                            modifier: 'protected',
                            read: false,
                            write: false,
                            value: '\'BaseClass\''
                        }
                    ]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addProperty('_className').setType('string').setModifier('protected').setRead(false).setWrite(false).setValue('\'BaseClass\'');
            verify(cg1, z);
        });
        it('should return class "Foo", no getter/setter "foo"', function() {
            var z = 'export class Foo{public foo:any;}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo',
                            useGetterSetter: true,
                            read: false,
                            write: false
                        }
                    ]
                }]
            });
            verify(cg0, z);
        });
        it('should return class "Foo", getter/setter "foo"', function() {
            var z = 'export class Foo{private _foo:any;public get foo():any{return this._foo;}public set foo(value:any){this._foo=value;}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo',
                            useGetterSetter: true
                        }
                    ]
                }]
            });
            verify(cg0, z);
        });
        it('should return class "Foo", getter/setter "foo", track', function() {
            var z = 'export class Foo{private _foo:any;public get foo():any{return this._foo;}public set foo(value:any){this._foo=value;this._isDirty=true;this._lastUpdated=(new Date()).getTime();}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo',
                            track: true
                        }
                    ]
                }]
            });
            verify(cg0, z);

            var p = cg1.addClass('Foo').addProperty('foo').setTrack();
            verify(cg1, z);

            p.setTrack(true);
            verify(cg1, z);
        });
        it('should return class "Foo", getter/setter "foo", track, isDirty & lastUpdated', function() {
            var z = 'export class Foo{private _foo:any;public get foo():any{return this._foo;}public set foo(value:any){this._foo=value;this._isDirty=true;this._lastUpdated=(new Date()).getTime();}}';

            cg0 = cg({
                options: {
                    ...options,
                    isDirty: '_isDirty',
                    lastUpdated: '_lastUpdated'
                },
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo',
                            track: true
                        }
                    ]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addProperty('foo').setTrack();
            verify(cg1, z);
        });
        it('should return class "Foo", getter/setter "foo", track, no track state/date', function() {
            var z = 'export class Foo{private _foo:any;public get foo():any{return this._foo;}public set foo(value:any){this._foo=value;}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo',
                            useGetterSetter: true,
                            track: true,
                            trackState: false,
                            trackDate: false
                        }
                    ]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addProperty('foo').setTrack().setTrackState(false).setTrackDate(false);
            verify(cg1, z);
        });
        it('should return class "Foo", no decorator', function() {
            var z = 'export class Foo{}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    decorator: {}
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addDecorator();
            verify(cg1, z);
        });
        it('should return class "Foo", decorator @Component, one option', function() {
            var z = '@Component({selector:\'some-component\'}) export class Foo{}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    decorator: {
                        type: "Component",
                        options: [
                            {
                                name: 'selector',
                                value: "'some-component'"
                            }
                        ]
                    }
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addDecorator('Component').addOption('selector', '\'some-component\'');
            verify(cg1, z);
        });
        it('should return class "Foo", decorator @Component, two options', function() {
            var z = '@Component({selector:\'some-component\',templateUrl:\'some-component.html\'}) export class Foo{}';
            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    decorator: {
                        type: "Component",
                        options: [
                            {
                                name: 'selector',
                                value: "'some-component'"
                            },
                            {
                                name: 'templateUrl',
                                value: "'some-component.html'"
                            }
                        ]
                    }
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addDecorator('Component').addOption('selector', '\'some-component\'').addOption('templateUrl', '\'some-component.html\'');
            verify(cg1, z);
        });
        it('should return class "Foo", decorator @Component, one option, prettified', function() {
            var z = 5;

            cg0 = cg({
                options: {
                    inferType: true,
                    prettify: true
                },
                classes: [
                    {
                        name: 'Foo',
                        decorator: {
                            type: 'Component',
                            options: [
                                {
                                    name: 'selector',
                                    value: "'some-component'"
                                }
                            ]
                        }
                    }
                ]
            });
            verifyLineCount(cg0, z);

            cg1 = cg({
                options: {
                    inferType: true,
                    prettify: true
                }
            });
            var c = cg1.addClass('Foo');
            c.addDecorator('Component').addOption('selector', '\'some-component\'');
            verifyLineCount(cg1, z);
        });
        it('should return class "Foo", two constructor args', function() {
            var z = 'export class Foo{constructor(foo:any,bar:any){}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    args: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'bar'
                        }
                    ]
                }]
            });
            verify(cg0, z);

            var c = cg1.addClass('Foo');
            c.addArg('foo');
            c.addArg('bar');
            verify(cg1, z);
        });
        it('should return empty class "Foo" (property "foo", no declare)', function() {
            var z = 'export class Foo{}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    properties: [
                        {
                            name: 'foo',
                            declare: false
                        }
                    ]
                }]
            });
            verify(cg0, z);

            var p = cg1.addClass('Foo').addProperty('foo').setDeclare(false);
            verify(cg1, z);

            p.setDeclare();
            verify(cg1, z);
        });
        it('should return empty class "Foo", no method', function() {
            var z = 'export class Foo{}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    methods: [
                        {}
                    ]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addMethod();
            verify(cg1, z);
        });
        it('should return class "Foo", method "foo"', function() {
            var z = 'export class Foo{public foo():void{return;}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    methods: [
                        {
                            name: 'foo'
                        }
                    ]
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').addMethod('foo');
            verify(cg1, z);
        });
        it('should return class "Foo", static method "foo"', function() {
            var z = 'export class Foo{public static foo():void{return;}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    methods: [
                        {
                            name: 'foo',
                            static: true
                        }
                    ]
                }]
            });
            verify(cg0, z);

            var m = cg1.addClass('Foo').addMethod('foo');
            m.setStatic();
            verify(cg1, z);

            m.setStatic(true);
            verify(cg1, z);
        });
        it('should return class "Foo", class "Bar" extends "Foo"', function() {
            var z = 0;

            var c0 = cg1.addClass('Foo').setIsBaseModel().setCanClone().setCanExport();
            c0.addProperty('foo');
            c0.addProperty('bar');
            var c1 = cg1.addClass('Boo').addExtends('Foo');
            c1.addProperty('foo');
            c1.addProperty('bar');
            var p = c1.addProperty('bar2').setCanClone(false).setCanExport(false);
            var c2 = cg1.addClass('Foo').setIsBaseModel().setCanUndo();

            var g1 = cg1.generate();
            expect(g1.output.length).to.gt(0);

            c0.setCanClone(true).setCanExport(true).setCanUndo(true).setIsBaseModel(true);
            var g2 = cg1.generate();
            expect(g2.output.length).to.gt(0);
        });
        it('should return class "Foo", constructor code', function() {
            var z = 'export class Foo{constructor(){return;}}';

            cg0 = cg({
                options,
                classes: [{
                    name: 'Foo',
                    constructorCode: 'return;'
                }]
            });
            verify(cg0, z);

            cg1.addClass('Foo').setConstructorCode('return;');
            verify(cg1, z);
        });
    });
});
