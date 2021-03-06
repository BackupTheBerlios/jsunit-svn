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
 * Utility classes needed for the JsUnit classes.
 * JsUnit need several helper classes to work properly. This file conatins
 * anything that is not related directly to JsUnit, but may be useful in other
 * environments, too.
 */


/**
 * Helper class with static flags.
 */
function JsUtil()
{
}
/** 
 * Retrieve the caller of a function.
 * @tparam Function fn The function to examine.
 * @treturn Function The caller as Function or undefined.
 **/
function JsUtil_getCaller( fn )
{
	switch( typeof( fn ))
	{
		case "undefined":
			return JsUtil_getCaller( JsUtil_getCaller );
			
		case "function":
			if( fn.caller )
				return fn.caller;
			if( fn.arguments && fn.arguments.caller )
				return fn.arguments.caller;
	}
	return undefined;
}
/**
 * Includes a JavaScript file.
 * @tparam String fname The file name.
 * Loads the content of a JavaScript file into a String that has to be
 * evaluated. Works for command line shells WSH, Rhino and SpiderMonkey.
 * @note This function is highly quirky. While WSH works as expected, the
 * Mozilla shells will evaluate the file immediately and add any symbols to
 * the global name space and return just "true". Therefore you have to 
 * evaluate the returned string for WSH at global level also. Otherwise the
 * function is not portable.
 * @treturn String The JavaScript code to be evaluated.
 */
function JsUtil_include( fname )
{
	var ret = "true";
	if( JsUtil.prototype.isMozillaShell )
	{
		load( fname );
	}
	else if( JsUtil.prototype.isWSH )
	{
		var fso = new ActiveXObject( "Scripting.FileSystemObject" );
		var file = fso.OpenTextFile( fname, 1 );
		ret = file.ReadAll();
		file.Close();
	}
	return ret;
}
/**
 * Returns the SystemWriter.
 * Instanciates a SystemWriter depending on the current JavaScript engine.
 * Works for command line shells WSH, Rhino and SpiderMonkey.
 * @type SystemWriter
 */
function JsUtil_getSystemWriter()
{
	if( !JsUtil.prototype.mWriter )
		JsUtil.prototype.mWriter = new SystemWriter();
	return JsUtil.prototype.mWriter;
}
/**
 * Quits the JavaScript engine.
 * @tparam Number exit The exit code.
 * Stops current JavaScript engine and returns an exit code. Works for 
 * command line shells WSH, Rhino and SpiderMonkey.
 */
function JsUtil_quit( exit )
{
	if( JsUtil.prototype.isMozillaShell )
		quit( exit );
	else if( JsUtil.prototype.isWSH )
		WScript.Quit( exit );
}
JsUtil.prototype.getCaller = JsUtil_getCaller;
JsUtil.prototype.include = JsUtil_include;
JsUtil.prototype.getSystemWriter = JsUtil_getSystemWriter;
JsUtil.prototype.quit = JsUtil_quit;
/**
 * The SystemWriter.
 * @type SystemWriter
 * @see getSystemWriter
 */
JsUtil.prototype.mWriter = null;
/**
 * Flag for a browser.
 * @type Boolean
 * The member is true, if the script runs within a browser environment.
 */
JsUtil.prototype.isBrowser = this.window != null;
/**
 * Flag for Microsoft JScript.
 * @type Boolean
 * The member is true, if the script runs in the Microsoft JScript engine.
 */
JsUtil.prototype.isJScript = this.ScriptEngine != null;
/**
 * Flag for Microsoft Windows Scripting Host.
 * @type Boolean
 * The member is true, if the script runs in the Microsoft Windows Scripting
 * Host.
 */
JsUtil.prototype.isWSH = this.WScript != null;
/**
 * Flag for Netscape Enterprise Server (iPlanet) engine.
 * @type Boolean
 * The member is true, if the script runs in the iPlanet as SSJS.
 */
JsUtil.prototype.isNSServer = this.Packages != null && !this.importPackage;
/**
 * Flag for Rhino.
 * @type Boolean
 * The member is true, if the script runs in Rhino of Mozilla.org.
 */
JsUtil.prototype.isRhino = this.importPackage != null;
/**
 * Flag for a Mozilla JavaScript shell.
 * @type Boolean
 * The member is true, if the script runs in a command line shell of a
 * Mozilla.org script engine (either SpiderMonkey or Rhino).
 */
JsUtil.prototype.isMozillaShell = this.load != null;
/**
 * Flag for a command line shell.
 * @type Boolean
 * The member is true, if the script runs in a command line shell.
 */
JsUtil.prototype.isShell = 
	   JsUtil.prototype.isMozillaShell 
	|| JsUtil.prototype.isWSH;
/**
 * Flag for call stack support.
 * @type Boolean
 * The member is true, if the engine provides call stack info.
 */
JsUtil.prototype.hasCallStackSupport = 
	   JsUtil.prototype.getCaller() !== undefined;
/**
 * \internal
 */
JsUtil.prototype.hasCompatibleErrorClass = 
	(    this.Error != null 
	  && (   !JsUtil.prototype.isJScript 
	  	  || (   JsUtil.prototype.isJScript 
		      && ( this.ScriptEngineMajorVersion() >= 6 ))));


/**
 * CallStack object.
 * The object is extremly system dependent, since its functionality is not
 * within the range of ECMA 262, 3rd edition. It is supported by JScript
 * and SpiderMonkey and was supported in Netscape Enterprise Server 2.x, 
 * but not in the newer version 4.x.
 * @ctor
 * Constructor.
 * The object collects the current call stack up to the JavaScript engine.
 * Most engines will not support call stack information with a recursion.
 * Therefore the collection is stopped when the stack has two identical
 * functions in direct sequence.
 * @tparam Number depth Maximum recorded stack depth (defaults to 10).
 **/
function CallStack( depth )
{
	/**
	 * The array with the stack. 
	 * @type Array<String>
	 */
	this.mStack = null;
	if( JsUtil.prototype.hasCallStackSupport )
		this._fill( depth );
}
/**
 * \internal
 */
function CallStack__fill( depth )
{
	this.mStack = new Array();
	
	// set stack depth to default
	if( depth == null )
		depth = 10;

	++depth;
	var fn = JsUtil.prototype.getCaller( CallStack__fill );
	while( fn != null && depth > 0 )
	{
		s = new String( fn );
		--depth;

		// Extract function name and argument list
		var r = /function (\w+)([^\{\}]*\))/;
		r.exec( s );
		var f = new String( RegExp.$1 );
		var args = new String( RegExp.$2 );
		this.mStack.push(( f + args ).replace( /\s/g, "" ));

		// Retrieve caller function
		if( fn == JsUtil.prototype.getCaller( fn ))
		{
			// Some interpreter's caller use global objects and may start
			// an endless recursion.
			this.mStack.push( "[JavaScript recursion]" );
			break;
		}
		else
			fn = JsUtil.prototype.getCaller( fn );
	}

	if( fn == null )
		this.mStack.push( "[JavaScript engine]" );

	// remove direct calling function CallStack or CallStack_fill
	this.mStack.shift();
}
/**
 * Fills the object with the current call stack info.
 * The function collects the current call stack up to the JavaScript engine.
 * Any previous data of the instance is lost.
 * Most engines will not support call stack information with a recursion.
 * Therefore the collection is stopped when the stack has two identical
 * functions in direct sequence.
 * @tparam Number depth Maximum recorded stack depth (defaults to 10).
 **/
function CallStack_fill( depth )
{
	this.mStack = null;
	if( JsUtil.prototype.hasCallStackSupport )
		this._fill( depth );
}
/**
 * Retrieve call stack as array.
 * The function returns the call stack as Array of Strings. 
 * @treturn Array<String> The call stack as array of strings.
 **/
function CallStack_getStack()
{
	var a = new Array();
	if( this.mStack != null )
		for( var i = this.mStack.length; i--; )
			a[i] = this.mStack[i];
	return a;
}
/**
 * Retrieve call stack as string.
 * The function returns the call stack as string. Each stack frame has an 
 * own line and is prepended with the call stack depth.
 * @treturn String The call stack as string.
 **/
function CallStack_toString()
{
	var s = "";
	if( this.mStack != null )
		for( var i = 1; i <= this.mStack.length; ++i )
		{
			if( s.length != 0 )
				s += "\n";
			s += i.toString() + ": " + this.mStack[i-1];
		}
	return s;
}

CallStack.prototype._fill = CallStack__fill;
CallStack.prototype.fill = CallStack_fill;
CallStack.prototype.getStack = CallStack_getStack;
CallStack.prototype.toString = CallStack_toString;


// MS engine does not implement Array.push and Array.pop until JScript 5.6
if( !Array.prototype.pop )
{
	/**
	 * \class Array
	 * Standard ECMA class.
	 * \docgen function Array() {}
	 */
	/**
	 * Pops last element from Array.
	 * The function is an implementation of the Array::pop method described
	 * in the ECMA standard. It removes the last element of the Array and
	 * returns it.
	 *
	 * The function is active if the ECMA implementation does not implement
	 * it (like Microsoft JScript engine up to version 5.5).
	 * @treturn Object Last element or undefined
	 */
	function Array_pop()
	{
		var obj;
		if( this instanceof Array && this.length > 0 )
		{
			var last = parseInt( this.length ) - 1;
			obj = this[last];
			this.length = last;
		}
		return obj;
	}
	Array.prototype.pop = Array_pop;
}	
if( !Array.prototype.push )
{ 
	/**
	 * Pushes elements into Array.
	 * The function is an implementation of the Array::push method described
	 * in the ECMA standard. It adds all given parameters at the end of the
	 * array.
	 *
	 * The function is active if the ECMA implementation does not implement
	 * it (like Microsoft JScript engine up to version 5.5).
	 * @treturn Object Number of added elements
	 */
	function Array_push()
	{
		var i = 0;
		if( this instanceof Array )
		{
			i = this.length;
			
			// Preallocation of array
			if( arguments.length > 0 )
				this[arguments.length + this.length - 1] = null;
			
			for( ; i < this.length; ++i )
				this[i] = arguments[i - this.length + arguments.length];
		}		
		return i;
	}
	Array.prototype.push = Array_push;
}


/**
 * \class String
 * Standard ECMA class.
 * \docgen function String() {}
 */
/**
 * Trims characters from string.
 * @tparam String chars String with characters to remove.  The character may
 * also be a regular expression character class like "\\s" (which is the 
 * default).
 *
 * The function removes the given chararcters \a chars from the beginning an 
 * the end from the current string and returns the result. The function will 
 * not modify the current string.
 *
 * The function is written as String enhancement and available as new member 
 * function of the class String.
 * @treturn String String without given characters at start or end.
 */
function String_trim( chars )
{
	if( !chars )
		chars = "\\s";
	var re = new RegExp( "^[" + chars + "]*(.*?)[" + chars + "]*$" );
	var s = this.replace( re, "$1" );
	return s;
}
String.prototype.trim = String_trim;


if( !this.Error || !JsUtil.prototype.hasCompatibleErrorClass )
{
	/**
	 * Error class according ECMA specification.
	 * This class is only active, if the ECMA implementation of the current
	 * engine does not support it or implements it not following the ECMA 
	 * standard (3rd edition).
	 * @ctor
	 * Constructor.
	 * The constructor initializes the \c message member with the argument 
	 * \a msg.
	 * @tparam String msg The error message.
	 **/
	function Error( msg )
	{
		/**
		 * The error message.
		 * @type String
		 **/
		this.message = msg || "";
	}
	Error.prototype = new Object();
	/**
	 * The name of the Error class as String.
	 * @type String
	 **/
	Error.prototype.name = "Error";
}
if(   JsUtil.prototype.isRhino 
   || !Error.prototype.toString 
   || !JsUtil.prototype.hasCompatibleErrorClass )
{
	/**
	 * String representation of the error.
	 * @treturn String Returns a \c String containing the Error class name 
	 * and the error message.
	 **/
	function Error_toString()
	{
		var msg = this.message;
		return this.name + ": " + msg;
	}
	Error.prototype.toString = Error_toString;
}


if( !this.TypeError || !JsUtil.prototype.hasCompatibleErrorClass )
{
	/**
	 * TypeError class according ECMA specification.
	 * This class is only active, if the ECMA implementation of the current
	 * engine does not support it or implements it nof following the ECMA 
	 * standard (3rd edition).
	 * @ctor
	 * Constructor.
	 * The constructor initializes the \c message member with the argument 
	 * \a msg.
	 * @tparam String msg The error message.
	 **/
	function TypeError( msg )
	{
		Error.call( this, msg );
	}
	TypeError.prototype = new Error();
	/**
	 * The name of the TypeError class as String.
	 * @type String
	 **/
	TypeError.prototype.name = "TypeError";
}


/**
 * InterfaceDefinitionError class.
 * This error class is used for interface definitions. Such definitions are 
 * simulated using Function::fulfills. The class has no explicit functionality
 * despite the separate type
 * @see Function::fulfills
 * @ctor
 * Constructor.
 * The constructor initializes the \c message member with the argument 
 * \a msg.
 * @tparam String msg The error message.
 **/
function InterfaceDefinitionError( msg )
{
	//TypeError.call( this, msg );
	this.message = msg;
}
InterfaceDefinitionError.prototype = new TypeError();
/**
 * The name of the InterfaceDefinitionError class as String.
 * @type String
 **/
InterfaceDefinitionError.prototype.name = "InterfaceDefinitionError";

/**
 * \class Function
 * Standard ECMA class.
 * \docgen function Function() {}
 */
/**
 * Ensures that a function fulfills an interface.
 * Since with ECMA 262 (3rd edition) interfaces are not supported yet, this
 * function will simulate the functionality. The arguments for the functions
 * are all classes that the current class will implement. The function checks
 * whether the current class fulfills the interface of the given classes or not.
 * @exception TypeError If the current object is not a class or the interface
 * is not a Function object with a prototype.
 * @exception InterfaceDefinitionError If an interface is not fulfilled or the 
 * interface has invalid members.
 */
function Function_fulfills()
{
	for( var i = 0; i < arguments.length; ++i )
	{
		var I = arguments[i];
		if( typeof I != "function" || !I.prototype )
			throw new TypeError( I.toString() + " is not an Interface" );
		if( !this.prototype )
			throw new TypeError( 
				"Current instance is not a Function definition" );
		for( var f in I.prototype )
		{
			if( typeof I.prototype[f] != "function" )
				throw new InterfaceDefinitionError( f.toString() 
					+ " is not a method in Interface " + I.toString());
			if(    typeof this.prototype[f] != "function" 
				&& typeof this[f] != "function" )
			{
				if(    typeof this.prototype[f] == "undefined" 
					&& typeof this[f] == "undefined" )
					throw new InterfaceDefinitionError( 
						f.toString() + " is not defined" );
				else
					throw new InterfaceDefinitionError( 
						f.toString() + " is not a function" );
			}
		}
	}
}
Function.prototype.fulfills = Function_fulfills;


/**
 * PrinterWriterError class.
 * This error class is used for errors in the PrinterWriter.
 * @see PrinterWriter::close
 * @ctor
 * Constructor.
 * The constructor initializes the \c message member with the argument 
 * \a msg.
 * @tparam String msg The error message.
 **/
function PrinterWriterError( msg )
{
	//TypeError.call( this, msg );
	this.message = msg;
}
PrinterWriterError.prototype = new TypeError();
/**
 * The name of the PrinterWriterError class as String.
 * @type String
 **/
PrinterWriterError.prototype.name = "PrinterWriterError";


/**
 * A PrinterWriter is an abstract base class for printing text.
 * @note This is a helper construct to support different writers in 
 * ResultPrinter e.g. depending on the JavaScript engine.
 */
function PrinterWriter()
{
	this.mBuffer = null;	
	this.mClosed = false;
}
/**
 * Closes the writer.
 * After closing the steam no further writing is allowed. Multiple calls to
 * close should be allowed.
 */
function PrinterWriter_close() 
{
	this.flush();
	this.mClosed = true;
}
/**
 * Flushes the writer.
 * Writes any buffered data to the underlaying output stream system immediatly.
 * @exception PrinterWriterError If flush was called after closing.
 */
function PrinterWriter_flush()
{
	if( !this.mClosed )
	{
		if( this.mBuffer !== null )
		{
			this._flush( this.mBuffer + "\n" );
			this.mBuffer = null;	
		}
	}
	else	
		throw new PrinterWriterError( 
			"'flush' called for closed PrinterWriter." );
}
/**
 * Prints into the writer.
 * @tparam Object data The data to print as String.
 * @exception PrinterWriterError If print was called after closing.
 */
function PrinterWriter_print( data )
{
	if( !this.mClosed )
	{
		var undef;
		if( data === undef || data == null )
			data = "";
		if( this.mBuffer )
			this.mBuffer += data.toString();
		else
			this.mBuffer = data.toString();
	}
	else	
		throw new PrinterWriterError( 
			"'print' called for closed PrinterWriter." );
}
/**
 * Prints a line into the writer.
 * @tparam Object data The data to print as String.
 * @exception PrinterWriterError If println was called after closing.
 */
function PrinterWriter_println( data )
{
	this.print( data );
	this.flush();
}
PrinterWriter.prototype.close = PrinterWriter_close;
PrinterWriter.prototype.flush = PrinterWriter_flush;
PrinterWriter.prototype.print = PrinterWriter_print;
PrinterWriter.prototype.println = PrinterWriter_println;
/** 
 * \internal 
 */
PrinterWriter.prototype._flush = function() {};


/**
 * The PrinterWriter of the JavaScript engine.
 */
function SystemWriter() 
{
	PrinterWriter.call( this );
} 
/**
 * Closes the writer.
 * Function just flushes the writer. Closing the system writer is not possible.
 */
function SystemWriter_close() 
{
	this.flush();
}
/** 
 * \internal 
 */
function SystemWriter__flush( str ) 
{
	/* self-modifying code ... */
	if( JsUtil.prototype.isMozillaShell )
		this._flush = 
			function SystemWriter__flush( str ) 
			{ 
				print( str.substring( 0, str.length - 1 )); 
			}
	else if( JsUtil.prototype.isBrowser )
		this._flush = 
			function SystemWriter__flush( str ) 
			{ 
				document.write( str );
			}
	else if( JsUtil.prototype.isWSH )
		this._flush = 
			function SystemWriter__flush( str ) 
			{ 
				WScript.Echo( str.substring( 0, str.length - 1 )); 
			}
	/*
	else if( JsUtil.prototype.isNSServer )
		this._flush = 
			function SystemWriter__flush( str ) 
			{ 
				write( str );
			}
	*/
	else
		this._flush = function() {}

	this._flush( str );
}
SystemWriter.prototype = new PrinterWriter();
SystemWriter.prototype.close = SystemWriter_close;
SystemWriter.prototype._flush = SystemWriter__flush;


/**
 * The PrinterWriter into a String.
 */
function StringWriter() 
{
	PrinterWriter.call( this );
	this.mString = "";
} 
/**
 * Returns the written String.
 * The function will close also the stream if it is still open.
 * @type String
 */
function StringWriter_get() 
{
	if( !this.mClosed )
		this.close();
	return this.mString;
}
/** 
 * \internal 
 */
function StringWriter__flush( str )
{
	this.mString += str;
}
StringWriter.prototype = new PrinterWriter();
StringWriter.prototype.get = StringWriter_get;
StringWriter.prototype._flush = StringWriter__flush;


/**
 * A filter for a PrinterWriter encoding HTML.
 * @ctor
 * Constructor.
 * @tparam PrinterWriter writer The writer to filter.
 * The constructor accepts the writer to wrap.
 */
function HTMLWriterFilter( writer )
{
	PrinterWriter.call( this );
	this.setWriter( writer );
}
/**
 * Returns the wrapped PrinterWriter.
 * @type PrinterWriter
 */
function HTMLWriterFilter_getWriter() 
{
	return this.mWriter;
}
/**
 * Sets the PrinterWriter to wrap.
 * @tparam PrinterWriter writer The writer to filter.
 * If the argument is omitted a StringWriter is created and wrapped.
 */
function HTMLWriterFilter_setWriter( writer ) 
{
	this.mWriter = writer ? writer : new StringWriter();
}
/** 
 * \internal 
 */
function HTMLWriterFilter__flush( str )
{
	str = str.toString();
	str = str.replace( /&/g, "&amp;" ); 
	str = str.replace( /</g, "&lt;" ); 
	str = str.replace( /\"/g, "&quot;" ); 
	str = str.replace( /\n/g, "<br>" );
	this.mWriter._flush( str );
}
HTMLWriterFilter.prototype = new PrinterWriter();
HTMLWriterFilter.prototype.getWriter = HTMLWriterFilter_getWriter;
HTMLWriterFilter.prototype.setWriter = HTMLWriterFilter_setWriter;
HTMLWriterFilter.prototype._flush = HTMLWriterFilter__flush;
