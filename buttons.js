var indicators= document.getElementsByClassName("dataMovement")


function FadeOut(number){
	if (indicators[number])
		indicators[number].style.display="none";

}

function FadeIn(number){
	console.log(FadeIn.name ,number , indicators[number])
	if (indicators[number]){
		indicators[number].style.display="block"
	}
}

function DbRamClick() {
  DbRam();
  renderSignal(true, 0);
}

function RamDbClick(){
	RamDb();
	renderSignal(true, 1)
}

function DbInsClick(){
	DbIns();
	renderSignal(true, 2)
}

function DbAccClick(){
	DbAcc();
	renderSignal(true, 3)
}
function AddAccClick(){
	AddAcc();
	renderSignal(true, 3)
}
function SubAccClick(){
	SubAcc();
	renderSignal(true, 3)
}

function AccDbClick(){
	AccDb();
	renderSignal(true, 4)
}

function InsMcClick(){
	InsMc();
	renderSignal(true, 5)
}

function InsAdClick(){
	InsAd();
	renderSignal(true, 6)
}

function InsPcClick(){
	InsPc();
	renderSignal(true, 7)
}
function PcAdClick(){
	PcAd();
	renderSignal(true, 8)
}

function NullAccClick(){
	NullAcc();
	renderSignal(true, 11)
}


function IncAccClick(){
	IncAcc();
	renderSignal(true, 12)
}
function DecAccClick(){
	DecAcc();
	renderSignal(true, 13)
}

function NullMcClick(){
	NullMc();
	renderSignal(true, 14)
}

function HaltClick(){
	Halt();
	renderSignal(true, 15)
}

function IncPc0Click(){
	IncPc0();
	renderSignal(true, 16)
}

function IncPcClick(){
	IncPc();
	renderSignal(true, 17)
}


function resetComputer(){
	console.log(resetComputer.name)
	assocAdressBus(0);
	assocDatabus(0);
	assocInstructionRegister(0);
	assocMcCounter(0);
	Alpine.store('default').accumulator=0
	assocProgramCounter(0);
	halt = false;
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
