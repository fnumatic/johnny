//Funktionen zum Schreiben in Busse/Ram
function writeToRam(value, address) {
  if (address > 999) return;

  //effect
  Alpine.store('default').ram[address] = parseInt(value);
  ramToStorage(Alpine.store('default').ram);
}



function lowVal(Value) {
	return zeroPad(Value, ramLength + 1).substr(2, ramLength + 1);
}

function highVal(Value) {
	return zeroPad(Value, ramLength + 1).substr(0, 2);
}

function writeToAddressBus(number){
	Alpine.store('default').addressBus=number
}

function writeToIns(number){
	Alpine.store('default').instructionRegister=number
}


function writeToDb(number){
	Alpine.store('default').dataBus = parseInt(number);
}

function writeToMc(number){
	console.log('writetoMC',number)
	Alpine.store('default').mcCounter = parseInt(number)
	//highlightMc(MicroCodeCounter)
}


function writeToPc(number){
	Alpine.store('default').programmCounter =number;
	EditRam(number);
}
