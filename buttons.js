var indicators= document.getElementsByClassName("dataMovement")


function FadeOut(number){
	if (indicators[number])
		indicators[number].style.display="none";

}

function FadeIn(number){
	console.log('FadeIn',number , indicators[number])
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
	console.log('resetComputer')
	writeToAddressBus(0);
	writeToDb(0);
	writeToIns(0);
	writeToMc(0);
	Alpine.store('default').accumulator=0
	writeToPc(0);
	halt = false;
	pause = false ;

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
	Alpine.store('default').ramInput = zeroPad(commandSelection,2 )+ numberDevisionChar + zeroPad(input.pop(),ramLength +1).substr(2,ramLength);

}
function ManuellRam() {
  //ignorieren des Punktes der hi und low trennt
  const {ramInput,ramSelected}=Alpine.store('default')
  const input = ramInput.split(numberDevisionChar);
  const value = validateNumber(parseInt(input.join("")), ramStr(ramLength), 0);
  writeToRam(value, ramSelected);
  nextRamModule();
}

function ramStr(length) {
	return (1 + "9".repeat(length)).toString();
}
function ramStr2(length) {
	return "9".repeat(length - 1).toString()
}

function ManuellDb() {
  const value = validateNumber(
    parseInt(Alpine.store('default').DataBusInput),
    ramStr(ramLength),
    0
  );
  writeToDb(value);
}
function ManuellAB() {
  const value = validateNumber(
    parseInt(Alpine.store('default').AddressBusInput),
    ramStr2(ramLength),
    0
  );
  writeToAddressBus(value);
}


//Wenn auf das Hochladebild gegklickt wird wird an file-input "weitergeleitet"
function uploadRam(){
	document.getElementById('ramfile').click();
   resetComputer()
}
function uploadMc(){
	document.getElementById('microcodefile').click();
}
