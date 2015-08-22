/**
 * Copyright 2013 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var operators = {
        'eq': function(a, b) { return a == b; },
        'neq': function(a, b) { return a != b; },
        'lt': function(a, b) { return a < b; },
        'lte': function(a, b) { return a <= b; },
        'gt': function(a, b) { return a > b; },
        'gte': function(a, b) { return a >= b; },
        'btwn': function(a, b, c) { return a >= b && a <= c; },
        'cont': function(a, b) { return (a + "").indexOf(b) != -1; },
        'regex': function(a, b) { return (a + "").match(new RegExp(b)); },
        'true': function(a) { return a === true; },
        'false': function(a) { return a === false; },
        'null': function(a) { return (typeof a == "undefined" || a === null); },
        'nnull': function(a) { return (typeof a != "undefined" && a !== null); },
        'else': function(a) { return a === true; }
    };

    function SwitchNode(n) {
        RED.nodes.createNode(this, n);
        this.rules = n.rules || [];
        this.property = n.property;
        this.checkall = n.checkall || "true";
        var node = this;

        for (var i=0; i<this.rules.length; i+=1) {
            var rule = this.rules[i];
            if (!isNaN(Number(rule.v))) {
                rule.v = Number(rule.v);
                rule.v2 = Number(rule.v2);
            }
        }

        this.on('input', function (msg) {
            var onward = [];
            console.log("Message: ", msg);
            console.log("Rules: ", node.rules);
            try {
                // var prop = propertyParts.reduce(function (obj, i) {
                //     return obj[i]
                // }, msg);
                // console.log("Prop: ", prop);
                var elseflag = true;
                for (var i=0; i<node.rules.length; i+=1) {

                    //Get the Key
                    var key = node.rules[i].key;
                    console.log('Key is: ' + key);
                    var propertyParts = ["payload"];
                    var keyParts = key.split('.');
                    for(var subPartIndex = 0; subPartIndex < keyParts.length; subPartIndex++) {
                        //Append to property parts array
                        console.log("Subpart: " + subPartIndex);
                        propertyParts.push(keyParts[subPartIndex]);
                    }

                    var prop = propertyParts.reduce(function (obj, i) {
                        return obj[i]
                    }, msg);

                    console.log("Property: " + prop);

                    var rule = node.rules[i];
                    var test = prop;

                    //Check Types
                    var typeTestValue = typeof test;
                    var typeRuleValue1 = typeof rule.v;
                    var typeRuleValue2 = typeof rule.v2;
                    
                    console.log("Test Value Type: " + typeTestValue);
                    console.log("Test Value 1: " + typeRuleValue1);
                    console.log("Test Value 2: " + typeRuleValue2);

                    if(typeRuleValue1 != "undefined" && typeRuleValue2 != "undefined") {
                        // In that case check both types
                        if(typeTestValue != typeRuleValue1 || typeTestValue != typeRuleValue2) {
                            this.error("Data types don't match");
                            return;
                        }
                    } else if(typeRuleValue2 == "undefined") {
                        //Check the first value
                        if(typeTestValue != typeRuleValue1) {
                            this.error("Data types don't match");
                            return;
                        }
                    }

                    if (rule.t == "else") { test = elseflag; elseflag = true; }
                    if (operators[rule.t](test,rule.v, rule.v2)) {
                        this.log("Values match");
                        console.log("Operation Passed");
                        elseflag = false;
                        if (node.checkall == "false") { break; }
                    } else {
                        console.log("Operation Failed");
                        this.error("Values don't match");
                        onward.push(null);
                        return;
                    }
                }
            } catch(err) {
                node.warn(err);
            }
            onward.push(msg);
            this.send(onward);
        });
    }
    RED.nodes.registerType("node-sanitize", SwitchNode);
}