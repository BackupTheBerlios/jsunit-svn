/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002,2003,2006 Joerg Schaible

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

var shell = WScript.CreateObject ("WScript.Shell");
var ie = WScript.CreateObject("InternetExplorer.Application");
ie.Visible = true;
ie.Navigate("file://" + shell.CurrentDirectory + "/AllTests.html");

var count = 0;
while( count < 5 )
{
    if( ie.ReadyState == 4 )
        break;
    WScript.sleep(500);
}

var text = ie.Document.getElementsByTagName("body")[0].innerHTML;

ie.Quit();

if( text.match(/0 errors/) && text.match(/0 failures/))
    WScript.Quit(0);
    
WScript.Quit(1);

