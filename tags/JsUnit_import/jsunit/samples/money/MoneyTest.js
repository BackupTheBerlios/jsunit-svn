function MoneyTest(name) {
	this._super = TestCase;
	this._super(name);
	
	function setUp() {
		this.f12CHF = new Money(12, "CHF");
		this.f14CHF = new Money(14, "CHF");
		this.f7USD = new Money(7, "USD");
		this.f21USD = new Money(21, "USD");
		this.fMB1 = new MoneyBag(this.f12CHF, this.f7USD);
		this.fMB2 = new MoneyBag(this.f14CHF, this.f21USD);
	}
	function testBagMultiply() {
		// {[12 CHF][7 USD]} *2 == {[24 CHF][14 USD]}
		var expected = 
			new MoneyBag( new Money(24, "CHF"), new Money(14, "USD"));
		this.assert(expected.equals(this.fMB1.multiply(2))); 
		this.assert(this.fMB1.multiply(0).isNull());
	}
	function testBagNegate() {
		// {[12 CHF][7 USD]} negate == {[-12 CHF][-7 USD]}
		var expected = 
			new MoneyBag( new Money(-12, "CHF"), new Money(-7, "USD"));
		this.assert(expected.equals(this.fMB1.negate()));
	}
	function testBagSimpleAdd() {
		// {[12 CHF][7 USD]} + [14 CHF] == {[26 CHF][7 USD]}
		var expected = 
			new MoneyBag( new Money(26, "CHF"), new Money(7, "USD"));
		this.assert(expected.equals(this.fMB1.add(this.f14CHF)));
	}
	function testBagSubtract() {
		// {[12 CHF][7 USD]} - {[14 CHF][21 USD] == {[-2 CHF][-14 USD]}
		var expected = 
			new MoneyBag( new Money(-2, "CHF"), new Money(-14, "USD"));
		this.assert(expected.equals(this.fMB1.subtract(this.fMB2)));
	}
	function testBagSumAdd() {
		// {[12 CHF][7 USD]} + {[14 CHF][21 USD]} == {[26 CHF][28 USD]}
		var expected = 
			new MoneyBag( new Money(26, "CHF"), new Money(28, "USD"));
		this.assert(expected.equals(this.fMB1.add(this.fMB2)));
	}
	function testIsNull() {
		this.assert(this.fMB1.subtract(this.fMB1).isNull()); 
	}
	function testMixedSimpleAdd() {
		// [12 CHF] + [7 USD] == {[12 CHF][7 USD]}
		var expected = new MoneyBag(this.f12CHF, this.f7USD);
		this.assert(expected.equals(this.f12CHF.add(this.f7USD)));
	}
	function testMoneyBagEquals() {
		this.assert(!this.fMB1.equals(null)); 

		this.assert(this.fMB1.equals(this.fMB1));
		var equal = new MoneyBag(new Money(12, "CHF"), new Money(7, "USD"));
		this.assert(this.fMB1.equals(equal));
		this.assert(!this.fMB1.equals(this.f12CHF));
		this.assert(!this.f12CHF.equals(this.fMB1));
		this.assert(!this.fMB1.equals(this.fMB2));
	}
	/* function testMoneyBagHash() {
		var equal = new MoneyBag(new Money(12, "CHF"), new Money(7, "USD"));
		this.assertEquals(this.fMB1.hashCode(), equal.hashCode());
	} */
	function testMoneyEquals() {
		this.assert(!this.f12CHF.equals(null)); 
		var equalMoney = new Money(12, "CHF");
		this.assert(this.f12CHF.equals(this.f12CHF));
		this.assert(this.f12CHF.equals(equalMoney));
		//this.assertEquals(this.f12CHF.hashCode(), equalMoney.hashCode());
		this.assert(!this.f12CHF.equals(this.f14CHF));
	}
	/* function testMoneyHash() {
		this.assert(!this.f12CHF.equals(null)); 
		var equal= new Money(12, "CHF");
		this.assertEquals(this.f12CHF.hashCode(), equal.hashCode());
	} */
	function testNormalize() {
		var moneyBag = 
			new MoneyBag( 
				new Money(26, "CHF"), 
				new Money(28, "CHF"), 
				new Money(6, "CHF")
			);
		var expected = new MoneyBag( new Money(60, "CHF"));
		var expectedBag= new MoneyBag(expected);
		this.assert(expectedBag.equals(moneyBag));
	}
	function testNormalize2() {
		// {[12 CHF][7 USD]} - [12 CHF] == [7 USD]
		var expected = new Money(7, "USD");
		this.assert(expected.equals(this.fMB1.subtract(this.f12CHF)));
	}
	function testNormalize3() {
		// {[12 CHF][7 USD]} - {[12 CHF][3 USD]} == [4 USD]
		var ms1 = new MoneyBag( new Money(12, "CHF"), new Money(3, "USD"));
		var expected = new Money(4, "USD");
		this.assert(expected.equals(this.fMB1.subtract(ms1)));
	}
	function testNormalize4() {
		// [12 CHF] - {[12 CHF][3 USD]} == [-3 USD]
		var ms1 = new MoneyBag( new Money(12, "CHF"), new Money(3, "USD"));
		var expected = new Money(-3, "USD");
		this.assert(expected.equals(this.f12CHF.subtract(ms1)));
	}
	function testPrint() {
		this.assertEquals("[12 CHF]", this.f12CHF.toString());
	}
	function testSimpleAdd() {
		// [12 CHF] + [14 CHF] == [26 CHF]
		var expected = new Money(26, "CHF");
		this.assertEquals(expected.toString(), 
			this.f12CHF.add(this.f14CHF).toString());
	}
	function testSimpleBagAdd() {
		// [14 CHF] + {[12 CHF][7 USD]} == {[26 CHF][7 USD]}
		var expected = 
			new MoneyBag( new Money(26, "CHF"), new Money(7, "USD"));
		this.assert(expected.equals(this.f14CHF.add(this.fMB1)));
	}
	function testSimpleMultiply() {
		// [14 CHF] *2 == [28 CHF]
		var expected = new Money(28, "CHF");
		this.assertEquals(expected.toString(), 
			this.f14CHF.multiply(2).toString());
	}
	function testSimpleNegate() {
		// [14 CHF] negate == [-14 CHF]
		var expected= new Money(-14, "CHF");
		this.assertEquals(expected.toString(), 
			this.f14CHF.negate().toString());
	}
	function testSimpleSubtract() {
		// [14 CHF] - [12 CHF] == [2 CHF]
		var expected= new Money(2, "CHF");
		this.assertEquals(expected.toString(), 
			this.f14CHF.subtract(this.f12CHF).toString());
	}

	this.setUp = setUp;
	this.testBagMultiply = testBagMultiply;
	this.testBagNegate = testBagNegate;
	this.testBagSimpleAdd = testBagSimpleAdd;
	this.testBagSubtract = testBagSubtract;
	this.testBagSumAdd = testBagSumAdd;
	this.testIsNull = testIsNull;
	this.testMixedSimpleAdd = testMixedSimpleAdd;
	this.testMoneyBagEquals = testMoneyBagEquals;
	// this.testMoneyBagHash = testMoneyBagHash;
	this.testMoneyEquals = testMoneyEquals;
	// this.testMoneyHash = testMoneyHash;
	this.testNormalize = testNormalize;
	this.testNormalize2 = testNormalize2;
	this.testNormalize3 = testNormalize3;
	this.testNormalize4 = testNormalize4;
	this.testPrint = testPrint;
	this.testSimpleAdd = testSimpleAdd;
	this.testSimpleBagAdd = testSimpleBagAdd;
	this.testSimpleMultiply = testSimpleMultiply;
	this.testSimpleNegate = testSimpleNegate;
	this.testSimpleSubtract = testSimpleSubtract;
}

function MoneyTest_suite()
{
	var suite = new TestSuite( "Money" );
	suite.addTest( new MoneyTest( "testBagMultiply" ));
	suite.addTest( new MoneyTest( "testBagNegate" ));
	suite.addTest( new MoneyTest( "testBagSimpleAdd" ));
	suite.addTest( new MoneyTest( "testBagSubtract" ));
	suite.addTest( new MoneyTest( "testBagSumAdd" ));
	suite.addTest( new MoneyTest( "testIsNull" ));
	suite.addTest( new MoneyTest( "testMixedSimpleAdd" ));
	suite.addTest( new MoneyTest( "testMoneyBagEquals" ));
	suite.addTest( new MoneyTest( "testMoneyEquals" ));
	// suite.addTest( new MoneyTest( "testMoneyHash" ));
	suite.addTest( new MoneyTest( "testNormalize" ));
	suite.addTest( new MoneyTest( "testNormalize2" ));
	suite.addTest( new MoneyTest( "testNormalize3" ));
	suite.addTest( new MoneyTest( "testNormalize4" ));
	suite.addTest( new MoneyTest( "testPrint" ));
	suite.addTest( new MoneyTest( "testSimpleAdd" ));
	suite.addTest( new MoneyTest( "testSimpleBagAdd" ));
	suite.addTest( new MoneyTest( "testSimpleNegate" ));
	suite.addTest( new MoneyTest( "testSimpleSubtract" ));

	return suite;
}
