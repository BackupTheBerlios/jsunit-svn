/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 2006 Joerg Schaible

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * First test case for isolation.
 */
function FirstTest(name)
{
    TestCase.call( this, name );
}
function FirstTest_testDivideByZero()
{
    var zero = 0;
    this.assertEquals( "Infinity", 8/zero );
}
FirstTest.prototype = new TestCase();
FirstTest.prototype.testDivideByZero = FirstTest_testDivideByZero;
