//Funktionen zum Schreiben in Busse/Ram
const ramSelectedK = "ramSelected";
const accumulatorK = "accumulator";
function assocInRam(address, value) {
	console.assert(typeof address === "number")	

	if (address > 999) return;
	console.assert(typeof value === "number")	
  //effect
  store().ram[address] = value;
  ramToStorage(store().ram);
}

function lowVal(Value,rlength=ramLength) {
	return zeroPad(Value, rlength + 1).substr(2, rlength + 1);
}

function highVal(Value, rlength=ramLength) {
	return zeroPad(Value, rlength + 1).substr(0, 2);
}

function assocRamSelectedIF(position) {
  const turboMode=  store().turboMode
	assocIF(ramSelectedK, position, !turboMode)
}

function modify(key,fn){
  const value= store()[key]
  store()[key]=fn(value)
}

function store(store='default'){
  return Alpine.store(store)
}

function assocIF(key,value,pred){
	if (pred) store()[key]=value
}