function resetComputer(){
	console.log(resetComputer.name)
	store().addressBus=0;
	store().dataBus=0;
	store().instructionRegister=0;
	store().mcCounter=0;
	store().accumulator=0
	store().programmCounter=0;
	assocIF(ramSelectedK, 0, !store().turboMode)
	store().halt = false;
	store().pause = false ;

	clearTimeout(timeoutforexecution); //beenden des Ausführen des programms
}


function downloadMc(){
	download(store().microCode.join("\r\n"), "Micro_code.mc","txt")

}
function downloadRam(){
	download(Ram.join("\r\n"), "Ram.ram","txt")

}

function CommandSelectChange(){
	const {ramInput,commandSelection}=store()
	const input = ramInput.split(numberDevisionChar)
	//todo: substr -> lowVal
	store().ramInput = zeroPad(commandSelection,2 )+ numberDevisionChar + zeroPad(input.pop(),ramLength +1).substr(2,ramLength);

}
function ManuellRam() {
  //ignorieren des Punktes der hi und low trennt
  const {ramInput,ramSelected}=store()
  const input = ramInput.split(numberDevisionChar).join("");
  const value = validateNumber(parseInt(input), maxAccu, 0);
  assocInRam( ramSelected, value);
  modify(ramSelectedK, v => v < maxAdress ? v + 1 : v)
}


function ManuellDb() {
  const {DataBusInput} = store()
  const value = validateNumber(parseInt(DataBusInput), maxAccu, 0);
  store().dataBus= value
}
function ManuellAB() {
  const {AddressBusInput} = store()
  const value = validateNumber(parseInt(AddressBusInput), maxAdress, 0);
  store().addressBus= value
}


//Wenn auf das Hochladebild gegklickt wird wird an file-input "weitergeleitet"
function uploadRam(){
	document.getElementById('ramfile').click();
   resetComputer()
}
function uploadMc(){
	document.getElementById('microcodefile').click();
}
