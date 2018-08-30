'use strict';

var expect = require('chai').expect;
var cg = require('../index').CodeGen;
var Modifier = require('../index').Modifier;

describe('code-gen-ts', function () {

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

    describe('#class', function () {

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

        it('should have 2 classes', function () {
            expect(z.classes.length).greaterThan(0);
            expect(z.classes.length).equals(2);
        });
        it('should have "BaseClass" and "BaseModel"', function () {
            expect(z.classes[0].name).equals('BaseClass');
            expect(z.classes[1].name).equals('BaseModel');
        });
    });
});
