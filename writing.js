//Funktionen zum Schreiben in Busse/Ram
function assocInRam(address, value) {
	console.assert(typeof address === "number")	

	if (address > 999) return;
	console.assert(typeof value === "number")	
  //effect
  Alpine.store('default').ram[address] = value;
  ramToStorage(Alpine.store('default').ram);
}

function assocInMicrocode(address,value){
	Alpine.store('default').microCode[address] = value;
}
function assocMicrocode(mc){
	Alpine.store('default').microCode = mc;
}


function lowVal(Value) {
	return zeroPad(Value, ramLength + 1).substr(2, ramLength + 1);
}

function highVal(Value) {
	return zeroPad(Value, ramLength + 1).substr(0, 2);
}

function assocAdressBus(number){
	console.assert( typeof number === "number")
	Alpine.store('default').addressBus=number
}

function assocInstructionRegister(number){
	console.assert(typeof number === "number")

	Alpine.store('default').instructionRegister=number
}


function assocDatabus(number){
	console.assert(typeof number === "number")
	Alpine.store('default').dataBus = parseInt(number);
}

function assocMcCounter(number){
	console.assert(typeof number === "number")
	Alpine.store('default').mcCounter = parseInt(number)
}


function assocProgramCounter(number){
	console.assert(typeof number === "number")
	Alpine.store('default').programmCounter =number;
	EditRam(number);
}

function updateAccu(fn){
	const {accumulator} = Alpine.store('default')
	Alpine.store('default').accumulator=fn(accumulator)
}

function updateRamSelected(fn){
  const {ramSelectet}=Alpine.store('default')
  Alpine.store('default').ramSelected = fn(ramSelectet);
}