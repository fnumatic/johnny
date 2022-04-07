function resetComputer(){
	console.log(resetComputer.name)
	assocAdressBus(0);
	assocDatabus(0);
	assocInstructionRegister(0);
	assocMcCounter(0);
	Alpine.store('default').accumulator=0
	assocProgramCounter(0);
	Alpine.store('default').halt = false;
	Alpine.store('default').pause = false ;

	clearTimeout(timeoutforexecution); //beenden des Ausführen des programms
}


function downloadMc(){
	download(Alpine.store('default').microCode.join("\r\n"), "Micro_code.mc","txt")

}
function downloadRam(){
	download(Ram.join("\r\n"), "Ram.ram","txt")

}

function CommandSelectChange(){
	const {ramInput,commandSelection}=Alpine.store('default')
	const input = ramInput.split(numberDevisionChar)
	//todo: substr -> lowVal
	Alpine.store('default').ramInput = zeroPad(commandSelection,2 )+ numberDevisionChar + zeroPad(input.pop(),ramLength +1).substr(2,ramLength);

}
function ManuellRam() {
  //ignorieren des Punktes der hi und low trennt
  const {ramInput,ramSelected}=Alpine.store('default')
  const input = ramInput.split(numberDevisionChar).join("");
  const value = validateNumber(parseInt(input), maxAccu, 0);
  assocInRam( ramSelected, value);
  updateRamSelected(rsel => rsel < maxAdress ? rsel + 1 : rsel )
}


function ManuellDb() {
  const {DataBusInput} = Alpine.store('default')
  const value = validateNumber(parseInt(DataBusInput), maxAccu, 0);
  assocDatabus(value);
}
function ManuellAB() {
	const {AddressBusInput} = Alpine.store('default')
  const value = validateNumber(parseInt(AddressBusInput), maxAdress, 0);
  assocAdressBus(value);
}


//Wenn auf das Hochladebild gegklickt wird wird an file-input "weitergeleitet"
function uploadRam(){
	document.getElementById('ramfile').click();
   resetComputer()
}
function uploadMc(){
	document.getElementById('microcodefile').click();
}
