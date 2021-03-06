/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002 Joerg Schaible

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation in version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

Test suites built with JsUnit are derivative works derived from tested 
classes and functions in their production; they are not affected by this 
license.
*/

/**
 * @file
 * Test unit classes for JavaScript.
 * This file contains a port of the JUnit Java package of Kent Beck and 
 * Erich Gamma for JavaScript.
 *
 * If this file is loaded within a browser, an onLoad event handler is set.
 * This event handler will set the global variable isJsUnitPageLoaded to true.
 * Any previously set onLoad event handler is restored and called.
 */


/**
 * Thrown, when a test assertion fails.
 * @ctor
 * Constructor.
 * An AssertionFailedMessage needs a message and a call stack for construction.
 * @tparam String msg Failure message.
 * @tparam CallStack stack The call stack of the assertion.
 */
function AssertionFailedError( msg, stack )
{
	this.message = msg || "";
	/**
	 * The call stack for the message.
	 */
	this.mCallStack = stack;
}
AssertionFailedError.prototype = new Error();
/**
 * The name of the TypeError class as String.
 * @type String
 **/
AssertionFailedError.prototype.name = "AssertionFailedError";


/**
 * A test can be run and collect its results.
 * @ctor
 * A test has always a name.
 * @tparam String testName Name of the test.
 * @see TestResult
 */
function Test( testName )
{
	this.mName = testName;
}
/**
 * Counts the number of test cases that will be run by this test.
 * @treturn Number The number of test cases.
 */
function Test_countTestCases() { return 0; }
/**
 * Search a test by name.
 * The function compares the given name with the name of the test and 
 * returns its own instance if the name is equal.
 * @tparam String testName The name of the searched test.
 * @treturn String The instance itself of null.
 */
function Test_findTest( testName ) 
{ 
	return testName == this.mName ? this : null; 
}
/**
 * Retrieves the name of the test.
 * @treturn String The name of test cases.
 */
function Test_name() { return this.mName; }
/**
 * Runs a test and collects its result in a TestResult instance.
 * @tparam TestResult result The test result to fill.
 */
function Test_run( result ) {}
/**
 * Retrieve the test case as string.
 * @treturn String Returns the name of the test case.
 */
function Test_toString() { return this.mName; }
Test.prototype.countTestCases = Test_countTestCases;
Test.prototype.findTest = Test_findTest;
Test.prototype.name = Test_name;
Test.prototype.run = Test_run;
Test.prototype.toString = Test_toString;


/**
 * A TestFailure collects a failed test together with the caught exception.
 * @ctor
 * Constructor.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown error of the exception
 * @see TestResult
 */
function TestFailure( test, except )
{
	this.mException = except;
	this.mTest = test;
}
/**
 * Retrieve the failed test.
 * @treturn Test Returns the failed test.
 */
function TestFailure_failedTest() { return this.mTest; }
/**
 * Retrieve the thrown exception.
 * @treturn Test Returns the thrown exception.
 */
function TestFailure_thrownException() { return this.mException.toString(); }
/**
 * Retrieve failure as string.
 * @treturn String Returns the error message.
 */
function TestFailure_toString() 
{ 
	return "Test " + this.mTest + " failed: " + this.mException; 
}
TestFailure.prototype.failedTest = TestFailure_failedTest;
TestFailure.prototype.thrownException = TestFailure_thrownException;
TestFailure.prototype.toString = TestFailure_toString;


/**
 * A listener for test progress.
 */
function TestListener()
{
}
/**
 * An occured error was added.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
TestListener.prototype.addError = function( test, except ) {}
/**
 * An occured failure was added.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
TestListener.prototype.addFailure = function( test, except ) {}
/**
 * A test ended.
 * @tparam Test test The ended test.
 */
TestListener.prototype.endTest = function( test ) {}
/**
 * A test started
 * @tparam Test test The started test.
 */
TestListener.prototype.startTest = function( test ) {}


/**
 * A TestResult collects the results of executing a test case.
 * The test framework distinguishes between failures and errors.
 * A failure is anticipated and checked for with assertions. Errors are
 * unanticipated problems like a JavaScript run-time error.
 *
 * @see Test
 */
function TestResult()
{
	this.mErrors = new Array();
	this.mFailures = new Array();
	this.mListeners = new Array();
	this.mRunTests = 0;
	this.mStop = 0;
}
/**
 * Add an occured error.
 * Add an occured error and call the registered listeners.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
function TestResult_addError( test, except )
{
	this.mErrors.push( new TestFailure( test, except ));
	for( var i = 0; i < this.mListeners.length; ++i )
		this.mListeners[i].addError( test, except );
}
/**
 * Add an occured failure.
 * Add an occured failure and call the registered listeners.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
function TestResult_addFailure( test, except )
{
	this.mFailures.push( new TestFailure( test, except ));
	for( var i = 0; i < this.mListeners.length; ++i )
		this.mListeners[i].addFailure( test, except );
}
/**
 * Add a listener.
 * @tparam TestListener listener The listener.
 */
function TestResult_addListener( listener ) 
{ 
	this.mListeners.push( listener ); 
}
/**
 * A test ended.
 * A test ended, inform the listeners.
 * @tparam Test test The ended test.
 */
function TestResult_endTest( test )
{
	for( var i = 0; i < this.mListeners.length; ++i )
		this.mListeners[i].endTest( test );
}
/**
 * Retrieve the number of occured errors.
 * @type Number
 */
function TestResult_errorCount() { return this.mErrors.length; }
/**
 * Retrieve the number of occured failures.
 * @type Number
 */
function TestResult_failureCount() { return this.mFailures.length; }
/**
 * Runs a test case.
 * @tparam Test test The test case to run.
 */
function TestResult_run( test )
{
	try
	{
		this.startTest( test );
		test.runBare();
	}
	catch( ex )
	{
		if( ex instanceof AssertionFailedError )
			this.addFailure( test, ex );
		else
			this.addError( test, ex );
	}
	this.endTest( test );
}
/**
 * Retrieve the number of run tests.
 * @type Number
 */
function TestResult_runCount() { return this.mRunTests; }
/**
 * Checks whether the test run should stop.
 * @type Boolean
 */
function TestResult_shouldStop() { return this.mStop; }
/**
 * A test starts.
 * A test starts, inform the listeners.
 * @tparam Test test The test to start.
 */
function TestResult_startTest( test )
{
	++this.mRunTests;

	for( var i = 0; i < this.mListeners.length; ++i )
		this.mListeners[i].startTest( test );
}
/**
 * Marks that the test run should stop.
 */
function TestResult_stop() { this.mStop = 1; }
/**
 * Returns whether the entire test was successful or not.
 * @type Boolean
 */
function TestResult_wasSuccessful() 
{ 
	return this.mErrors.length + this.mFailures.length == 0; 
}
TestResult.prototype.addListener = TestResult_addListener;
TestResult.prototype.addError = TestResult_addError;
TestResult.prototype.addFailure = TestResult_addFailure;
TestResult.prototype.failureCount = TestResult_failureCount;
TestResult.prototype.endTest = TestResult_endTest;
TestResult.prototype.errorCount = TestResult_errorCount;
TestResult.prototype.run = TestResult_run;
TestResult.prototype.runCount = TestResult_runCount;
TestResult.prototype.startTest = TestResult_startTest;
TestResult.prototype.shouldStop = TestResult_shouldStop;
TestResult.prototype.stop = TestResult_stop;
TestResult.prototype.wasSuccessful = TestResult_wasSuccessful;
TestResult.fulfills( TestListener );


/**
 * A set of assert methods.
 */
function Assert()
{
}
/**
 * Asserts that a condition is true.
 * @tparam String cond The condition to evaluate.
 * @tparam String msg An optional error message.
 * @exception AssertionFailedError Thrown if the evaluation was not true.
 * @depricated
 */
function Assert_assert( cond, msg )
{
	if( !eval( cond ))
	{
		var m = "Condition failed \"" + cond + "\"";
		if( msg != null && msg != "" )
			m += ": " + msg;
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that two values are equal.
 * @tparam Object expected The expected value.
 * @tparam Object actual The actual value.
 * @exception AssertionFailedError Thrown if the expected value is not the 
 * actual one.
 */
function Assert_assertEquals( expected, actual )
{
	if( expected != actual )
	{
		var m = "Expected <" + expected + ">, actual was <" + actual + ">.";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that a condition is false.
 * @tparam String cond The condition to evaluate.
 * @tparam String msg An optional error message.
 * @exception AssertionFailedError Thrown if the evaluation was not false.
 */
function Assert_assertFalse( cond, msg )
{
	if( eval( cond ))
	{
		var m = "Condition should have failed \"" + cond + "\"";
		if( msg != null && msg != "" )
			m += ": " + msg;
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that an object is not null.
 * @tparam Object object The valid object.
 * @exception AssertionFailedError Thrown if the object is not null.
 */
function Assert_assertNotNull( object )
{
	if( object === null )
	{
		var m = "Object was null.";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that an object is not undefined.
 * @tparam Object object The defined object.
 * @exception AssertionFailedError Thrown if the object is undefined.
 */
function Assert_assertNotUndefined( object )
{
	if( object === undefined )
	{
		var m = "Object <" + object + "> was undefined.";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that an object is null.
 * @tparam Object object The null object.
 * @exception AssertionFailedError Thrown if the object is not null.
 */
function Assert_assertNull( object )
{
	if( object !== null )
	{
		var m = "Object <" + object + "> was not null.";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that a condition is true.
 * @tparam String cond The condition to evaluate.
 * @tparam String msg An optional error message.
 * @exception AssertionFailedError Thrown if the evaluation was not true.
 */
function Assert_assertTrue( cond, msg )
{
	if( !eval( cond ))
	{
		var m = "Condition failed \"" + cond + "\"";
		if( msg != null && msg != "" )
			m += ": " + msg;
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that an object is undefined.
 * @tparam Object object The undefined object.
 * @exception AssertionFailedError Thrown if the object is not undefined.
 */
function Assert_assertUndefined( object )
{
	if( object !== undefined )
	{
		var m = "Object <" + object + "> was not undefined.";
		this.fail( m, new CallStack());
	}
}
/**
 * Fails a test with a give message.
 * @tparam String msg The error message.
 * @tparam CallStack stack The call stack of the error.
 * @exception AssertionFailedError Is always thrown.
 */
function Assert_fail( msg, stack )
{
	var afe = new AssertionFailedError( msg, stack );
	throw afe;
}
Assert.prototype.assert = Assert_assert;
Assert.prototype.assertEquals = Assert_assertEquals;
Assert.prototype.assertFalse = Assert_assertFalse;
Assert.prototype.assertNotNull = Assert_assertNotNull;
Assert.prototype.assertNotUndefined = Assert_assertNotUndefined;
Assert.prototype.assertNull = Assert_assertNull;
Assert.prototype.assertTrue = Assert_assertTrue;
Assert.prototype.assertUndefined = Assert_assertUndefined;
Assert.prototype.fail = Assert_fail;


/**
 * A test case defines the fixture to run multiple tests. 
 * To define a test case
 * -# implement a subclass of TestCase
 * -# define instance variables that store the state of the fixture
 * -# initialize the fixture state by overriding <code>setUp</code>
 * -# clean-up after a test by overriding <code>tearDown</code>.
 * Each test runs in its own fixture so there can be no side effects among 
 * test runs.
 *
 * For each test implement a method which interacts
 * with the fixture. Verify the expected results with assertions specified
 * by calling <code>assert</code> with a bool or one of the other assert 
 * functions.
 *
 * Once the methods are defined you can run them. The framework supports
 * both a static and more generic way to run a test.
 * In the static way you override the runTest method and define the method to
 * be invoked.
 * The generic way uses member function pointer to implement 
 * <code>runTest</code>.
 * It uses a table of function names.
 *
 * The tests to be run can be collected into a TestSuite. TestUnit provide
 * a <i>test runner</i> which can run a test suite and collect the results.
 * A test runner expects a function <code>TestCase_suite</code> as the entry
 * point to get a test to run.
 *
 * @see TestResult
 * @see TestSuite
 * @ctor
 * Constructor.
 * @tparam String name The name of the test case.
 */
function TestCase( name )
{
	this.constructor.call( this, name );
	Assert.constructor.call( this );
}
/**
 * Counts the number of test cases that will be run by this test.
 * @treturn Number Returns 1.
 */
function TestCase_countTestCases() { return 1; }
/**
 * Runs a test and collects its result in a TestResult instance.
 * @tparam TestResult result The test result to fill.
 */
function TestCase_run( result ) { result.run( this ); }
/**
 * \internal
 */
function TestCase_runBare()
{
	this.setUp();
	try
	{
		this[this.mName].call( this );
		this.tearDown();
	}
	catch( ex )
	{
		this.tearDown();
		throw ex;
	}
}
TestCase.prototype = new Test();
TestCase.inherits( Assert );
TestCase.prototype.countTestCases = TestCase_countTestCases;
TestCase.prototype.run = TestCase_run;
TestCase.prototype.runBare = TestCase_runBare;
/**
 * Set up the environment of the fixture.
 */
TestCase.prototype.setUp = function() {};
/**
 * Clear up the environment of the fixture.
 */
TestCase.prototype.tearDown = function() {};


/**
 * A TestSuite is a composition of Tests.
 * It runs a collection of test cases.
 * In despite of the JUnit implementation, this class has also functionality of
 * TestSetup of the extended JUnit framework. This is because of &quot;recursion
 * limits&quot; of the JavaScript implementation of BroadVision's One-to-one
 * Server (an OEM version of Netscape Enterprise Edition).
 * @see Test
 * @ctor
 * Constructor.
 * The constructor collects all test methods of the given object and adds them
 * to the array of tests.
 * @tparam Object obj if obj is an instance of a TestCase, the suite is filled 
 * with the fixtures automatically. Otherwise obj's string value is treated as 
 * name.
 */
function TestSuite( obj )
{
	var name, str;
	switch( typeof obj )
	{
		case "undefined": name = "all"; break;
		case "object":
			if( !obj )
			{
				name = "all";
				break;
			}
			str = new String( obj.constructor );
		case "function":
			if( !str )
				str = new String( obj );
			name = str.substring( str.indexOf( " " ) + 1, str.indexOf( "(" ));
			if( name == "(" )
				name = "[anonymous]";
			break;
		case "string": name = obj; break;
		default: name = obj.toString(); break;
	}

	this.constructor.call( this, name );
	this.mTests = new Array();

	// collect all testXXX methods
	if( typeof( obj ) == "function" )
	{
		for( var member in obj.prototype )
		{
			if( member.indexOf( "test" ) == 0 )
				this.addTest( new ( obj )( member ));
		}
	}
 	else if( typeof( obj ) == "object" )
	{
		for( var member in obj )
		{
			if( member.indexOf( "test" ) == 0 )
				this.addTest( new obj.constructor( member ));
		}
		obj = null;
	}
}
/**
 * Add a test to the suite.
 * @tparam Test test The test to add.
 */
function TestSuite_addTest( test ) 
{ 
	this.mTests.push( test ); 
}
/**
 * Add a test suite to the current suite.
 * All fixtures of the test case will be collected in a suite which
 * will be added.
 * @tparam TestCase testCase The TestCase object to add.
 */
function TestSuite_addTestSuite( testCase ) 
{ 
	this.addTest( new TestSuite( testCase )); 
}
/**
 * Counts the number of test cases that will be run by this test suite.
 * @treturn Number The number of test cases.
 */
function TestSuite_countTestCases()
{
	var tests = 0;
	for( var i = 0; i < this.testCount(); ++i )
		tests += this.mTests[i].countTestCases();
	return tests;
}
/**
 * Search a test by name.
 * The function compares the given name with the name of the test and 
 * returns its own instance if the name is equal.
 * @tparam String name The name of the searched test.
 * @treturn String The instance itself of null.
 */
function TestSuite_findTest( name )
{
	if( name == this.mName )
		return this;

	for( var i = 0; i < this.testCount(); ++i )
	{
		var test = this.mTests[i].findTest( name );
		if( test != null )
			return test;
	}
	return null;
}
/**
 * Runs a test and collects its result in a TestResult instance.
 * @tparam TestResult result The test result to fill.
 */
function TestSuite_run( result )
{
	--result.mRunTests;
	result.startTest( this );

	this.setUp();

	for( var i = 0; i < this.testCount(); ++i )
	{
		if( result.shouldStop())
			break;
		this.mTests[i].run( result );
	}

	this.tearDown();

	if( i == 0 )
	{
		var ex = new AssertionFailedError( 
			"Test suite with no tests.", new CallStack());
		result.addFailure( this, ex );
	}

	result.endTest( this );
}
/**
 * Set up the environment of the test suite.
 */
function TestSuite_setUp() {}
/**
 * Clear up the environment of the test suite.
 */
function TestSuite_tearDown() {}
/**
 * Returns the number of tests in this suite.
 * @type Number
 */
function TestSuite_testCount() { return this.mTests.length; }
TestSuite.prototype = new Test();
TestSuite.prototype.addTest = TestSuite_addTest;
TestSuite.prototype.addTestSuite = TestSuite_addTestSuite;
TestSuite.prototype.countTestCases = TestSuite_countTestCases;
TestSuite.prototype.findTest = TestSuite_findTest;
TestSuite.prototype.run = TestSuite_run;
TestSuite.prototype.setUp = TestSuite_setUp;
TestSuite.prototype.tearDown = TestSuite_tearDown;
TestSuite.prototype.testCount = TestSuite_testCount;


/**
 * General base class for an application running test suites.
 */
function TestRunner()
{
	this.mSuites = new TestSuite();
	this.mElapsedTime = 0;
}
/**
 * Add a test suite to the application.
 * @tparam TestSuite suite The suite to add.
 */
function TestRunner_addSuite( suite ) { this.mSuites.addTest( suite ); }
/**
 * Counts the number of test cases that will be run by this test 
 * application.
 * @treturn Number The number of test cases.
 */
function TestRunner_countTestCases() { return this.mSuites.countTestCases(); }
/**
 * The milliseconds needed to execute all registered tests of the runner.
 * This number is 0 as long as the test was never started.
 * @treturn Number The milliseconds.
 */
function TestRunner_countMilliSeconds() { return this.mElapsedTime; }
/**
 * Creates an instance of a TestResult.
 * @treturn TestResult Returns the new TestResult instance.
 */
function TestRunner_createTestResult() { return new TestResult(); }
/**
 * Runs all test of all suites and collects their results in a TestResult 
 * instance.
 * @tparam String name The name of the test.
 * @tparam TestResult result The test result to fill.
 */
function TestRunner_run( name, result )
{
	var test = this.mSuites.findTest( name );
	if( test == null )
	{
		var ex = new AssertionFailedError( 
			"Test \"" + name + "\" not found.", new CallStack());
		result.addFailure( new Test( name ), ex );
	}
	else
	{
		this.mElapsedTime = new Date();
		test.run( result );
		this.mElapsedTime = new Date() - this.mElapsedTime;
	}
}
/**
 * Runs all test of all suites and collects their results in a TestResult 
 * instance.
 * @tparam TestResult result The test result to fill.
 */
function TestRunner_runAll( result ) 
{ 
	this.mElapsedTime = new Date();
	this.mSuites.run( result ); 
	this.mElapsedTime = new Date() - this.mElapsedTime;
}
TestRunner.prototype.addError = function( test, except ) {}
TestRunner.prototype.addFailure = function( test, except ) {}
TestRunner.prototype.addSuite = TestRunner_addSuite;
TestRunner.prototype.countTestCases = TestRunner_countTestCases;
TestRunner.prototype.countMilliSeconds = TestRunner_countMilliSeconds;
TestRunner.prototype.createTestResult = TestRunner_createTestResult;
TestRunner.prototype.endTest = function( test ) {}
TestRunner.prototype.run = TestRunner_run;
TestRunner.prototype.runAll = TestRunner_runAll;
TestRunner.prototype.startTest = function( test ) {}
TestRunner.fulfills( TestListener );


/**
 * Class for an application running test suites with a test based status report.
 */
function TextTestRunner()
{
	this.constructor.call( this );

	this.mRunTests = 0;
	this.mNest = "";
	this.mStartArgs = new Array();
}
/**
 * An occured error was added.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
function TextTestRunner_addError( test, except )
{
	var str = "";
	if( except.message || except.description )
	{
		if( except.name )
			str = except.name + ": ";
		str += except.message || except.description;
	}
	else
		str = except;
	this.writeLn( "ERROR in " + test + ": " + str );
}
/**
 * An occured failure was added.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
function TextTestRunner_addFailure( test, except )
{
	this.writeLn( "FAILURE in " + test + ": " + except );
	this.writeLn( except.mCallStack );
}
/**
 * A test ended
 * @tparam Test test The ended test.
 */
function TextTestRunner_endTest( test )
{
	if( test.testCount != null )
	{
		this.mNest = this.mNest.substr( 1 );
		this.writeLn( 
			  "<" + this.mNest.replace( /-/g, "=" ) 
			+ " Completed test suite \"" + test.name() + "\"" );
	}
}
/**
 * Write a header starting the application.
 */
function TextTestRunner_printHeader()
{
	this.writeLn( 
		  "TestRunner(" + this.mStartArgs[0] + ") (" 
		+ this.countTestCases() + " test cases available)" );
}
/**
 * Write a footer at application end with a summary of the tests.
 * @tparam TestResult result The result of the test run.
 */
function TextTestRunner_printFooter( result )
{
	if( result.wasSuccessful() == 0 )
	{
		var error = result.errorCount() != 1 ? " errors" : " error";
		var failure = result.failureCount() != 1 ? " failures" : " failure";
		this.writeLn( 
			  result.errorCount() + error + ", " 
			+ result.failureCount() + failure + "." );
	}
	else
		this.writeLn( 
			  result.runCount() + " tests successful in " 
			+ ( this.mElapsedTime / 1000 ) + " seconds.");
}
/**
 * Start the test functionality of the application.
 * @param args list of test names in an array or a single test name
 * @treturn Number 0 if no test fails, otherwise -1
 */
function TextTestRunner_start( args )
{
	if( typeof( args ) == "undefined" )
		args = new Array();
	else if( typeof( args ) == "string" )
		args = new Array( args );
	if( args.length == 0 )
		args[0] = "all";
	this.mStartArgs = args;

	var result = this.createTestResult();
	result.addListener( this );

	this.printHeader();
	if( args[0] == "all" )
		this.runAll( result );
	else
	{
		for( var i = 0; i < args.length; ++ i )
			this.run( args[i], result );
	}
	this.printFooter( result );

	return result.wasSuccessful() ? 0 : -1;
}
/**
 * A test started
 * @tparam Test test The started test.
 */
function TextTestRunner_startTest( test )
{
	if( test.testCount == null )
	{
		++this.mRunTests;
		this.writeLn( 
			  this.mNest + " Running test " 
			+ this.mRunTests + ": \"" + test + "\"" );
	}
	else
	{
		this.writeLn( 
			  this.mNest.replace(/-/g, "=") + "> Starting test suite \"" 
			+ test.name() + "\"" );
		this.mNest += "-";
	}
}
TextTestRunner.prototype = new TestRunner();
TextTestRunner.prototype.addFailure = TextTestRunner_addFailure;
TextTestRunner.prototype.addError = TextTestRunner_addError;
TextTestRunner.prototype.endTest = TextTestRunner_endTest;
TextTestRunner.prototype.printHeader = TextTestRunner_printHeader;
TextTestRunner.prototype.printFooter = TextTestRunner_printFooter;
TextTestRunner.prototype.start = TextTestRunner_start;
TextTestRunner.prototype.startTest = TextTestRunner_startTest;
/**
 * Write a line of text.
 * @tparam String str The text to print on the line.
 * The method of this object does effectivly nothing. It must be 
 * overloaded with a proper version, that knows how to print a line.
 */
TextTestRunner.prototype.writeLn = function ( str ){};


/*************************************************************/
if( this.window )
{
	function newOnLoadEventForJsUnit() 
	{
		window.isJsUnitPageLoaded = true;
		if( typeof( window.savedOnLoadEventBeforeJsUnit ) == "function" )
			window.savedOnLoadEventBeforeJsUnit();
	}

	if( this.name && this.name == "testFrame" )
	{
		window.isJsUnitPageLoaded = false;
		window.savedOnLoadEventBeforeJsUnit = window.onload;
		window.onload = newOnLoadEventForJsUnit;
	}
}

