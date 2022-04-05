/*
David Laubersheimer - 2019

mit dank an Dr. Peter Dauscher


*/
const bonsaiMC="8;2;3;5;0;0;0;0;0;0;4;2;18;16;15;1;9;7;0;0;4;2;18;17;15;1;9;7;0;0;11;7;0;0;0;0;0;0;0;0;4;2;18;10;9;7;0;0;0;0;19;7;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;FETCH;INC;DEC;JMP;TST;HLT"
const normalMC="8;2;3;5;0;0;0;0;0;0;12;4;2;13;9;7;0;0;0;0;4;2;13;9;7;0;0;0;0;0;4;2;14;9;7;0;0;0;0;0;4;15;1;9;7;0;0;0;0;0;11;7;0;0;0;0;0;0;0;0;4;2;18;10;9;7;0;0;0;0;12;4;2;13;16;15;1;9;7;0;12;4;2;13;17;15;1;9;7;0;4;12;15;1;9;7;0;0;0;0;19;7;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;FETCH;TAKE;ADD;SUB;SAVE;JMP;TST;INC;DEC;NULL;HLT"

	//daten die zückgesetzt werden müssen
	var halt = false;
	//var Eingabe; // evt unbenutzt ?
	var recording = false;
	var recordingCounter = 150; //gibt an an welcher stelle
	//150 zum testen

	//daten die nicht zurückgesetzt werden müssen
/*
	var screenShown = false;
	var resolution = 50; //allways square
	var pixelSize;
*/
	var timeoutforexecution  //zum abbrechen des ausführen des Programms
	var alterProgrammzaeler= 0;
	var numberDevisionChar = "." //für ändern zum komma beim englischen

	var blockFadeoutTime = 1200;

	var blinkgeschwindigkeit = 700;
	var blinkzyklus = 0;
	var timeoutforblinking //damit das Blinken abgebrochen werden kann

	var startScreenFadeOutTime = 1500; // für den Ladebildschirm

	const ramSize = 1000  //this ideally has to be a multiple of 10
	const ramLength = Math.log10(ramSize) +1;
  const maxAccu = parseInt(1 + "9".repeat(ramLength));
  const maxAdress = parseInt("9".repeat(ramLength - 1))



var turboMode = false;


document.addEventListener('alpine:init', () => {
	
	initStores()
	console.log('alpine:init')
})
document.addEventListener('alpine:initialized', () => {
	initEffects()
	initialize()
    console.log('alpine:initialized')
})


function initStores() {
  Alpine.store("commandSelect", {
    items: [],
  });
 
  Alpine.store("default", {
    ramHighlight: -1,
    ramSelected: -1,
    ram: [],
    r_ram(){return renderRam(this.ram,this.ramHighlight,this.ramSelected) },
    microCode: [],
    mcHighlight: -1,
    r_microCode(){ return renderMC(this.microCode,this.mcHighlight)  },
    addressBus: 0,
    r_addressBus(){ return zeroPad(this.addressBus,ramLength -1)},
    AddressBusInput: "",
    dataBus: 0,
    r_databus(){return zeroPad(this.dataBus,ramLength + 1)},
    DataBusInput: "000",
    ramInput: "",
    accumulator: 0,
    r_accumulator(){ return zeroPad(this.accumulator,ramLength +1)},
    is_accuZero(){return this.accumulator == 0},
    executionSpeed: 1700,
    showDetailControl: true,
    showModal: false,
    mcCounter: 0,
    r_mcCounter(){return zeroPad(this.mcCounter,ramLength-1)},
    instructionRegister:0,
    r_instructHi(){return highVal(this.instructionRegister)},
    r_instructLo(){return lowVal(this.instructionRegister)},
    programmCounter: 0,
    r_programCounter(){return zeroPad(this.programmCounter,ramLength +1)},
    NullaccHighlight: false,
    IncaccHighlight: false,
    DecaccHighlight: false,
    NullMcHighlight: false,
    HaltButtonHighlight: false,
    IncPc0Highlight: false,
    IncPcHighlight: false,
    showStartScreen: true,
    commandSelection: 0,
    recordNum: 110,
    pause: false,
  });
}

function initEffects(){
	Alpine.effect(() => {
		console.log(Alpine.store('default').showModal)
	})
}

function initialize() {
  console.log(initialize.name);
  //toggleFullScreen()
  Alpine.store('default').ram= ramFromStorage() || R.range(0, ramSize).map((_) => 0);
  Alpine.store('default').microCode=  mcFromStorage() || resetMicrocode();
  renderCommandSelect(Alpine.store('default').microCode)

  //1st row ramtbl green
  Alpine.store('default').ramHighlight = Alpine.store('default').addressBus;
  Alpine.store('default').loadMsg = "...";
  var loadEnd = new Date().getTime();

  if (window.matchMedia("(display-mode: standalone)").matches) {
    fadeOutStartScreen();
  } else {
    setTimeout(
      fadeOutStartScreen,
      startScreenFadeOutTime - (loadEnd - LoadStart)
    );
  }
}

function resetRam(){
  Alpine.store('default').ram = R.range(0, ramSize).map(_ => 0);
}
function newRam(){
  initialize();
  resetRam();
}

function resetMicrocode() {
  return normalMC.split(";");
}

function fadeOutStartScreen(){//für verzögertes ausblenden des Startblidschirms(frühstens nach startScreenFadeOutTime ms  )
	console.log(fadeOutStartScreen.name)
	Alpine.store('default').showStartScreen=false

	//dinge die nach dem Anzeigen gemacht werden müssen
	resetComputer()
  Alpine.nextTick(() =>{
    Alpine.store('default').ramSelected = -1
    Alpine.store('default').ramSelected = 0
  } )
}

function keyDownHandler(){
  Alpine.nextTick(() => fadeOutStartScreen())
}

function resize(){
  console.log(resize.name)

	//needed for the Safari fix
	scrollMaxX = document.body.scrollWidth - window.innerWidth;
	scrollMaxY = document.body.scrollHeight - window.innerHeight;

/*
	//ändern der Auflösung des Bildschirms:
	let canvasWidth =document.getElementById("screen").clientWidth
	document.getElementById("screen").width = canvasWidth;
	document.getElementById("screen").height = canvasWidth;
	pixelSize = canvasWidth/resolution;
*/
}

function validateNumber(X,maxValue,minValue){
  //Überprüft ob nur Zaheln eingegeben wurden +Größe der Zahlen
  if (X <= maxValue && X >= minValue) {
    return X;
  } else if (X > maxValue) {
    return maxValue;
  } else {
    return minValue;
  }
}

function updateSpeed(speed){
  console.log(updateSpeed.name)
	turboMode = 3000 - speed == 0;
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function getObjectHeight(object){//nimmt ein objekt und gibt die Höhe zurück
  const eb = object.getBoundingClientRect();
	return eb.bottom - eb.top
}

//aufnahme
function aufnahmeBlinken(){
  const [color,bz] = blinkzyklus== 0? ["bg-red-400", blinkzyklus + 1]: ["bg-green-400", 0]
	Alpine.store('default').recordBlink=color
  blinkzyklus=bz
	timeoutforblinking =setTimeout(aufnahmeBlinken,blinkgeschwindigkeit);
}

function aufnahme(){
  const {recordNum,recordName}=Alpine.store('default')
	if (recording) {
    recording = false;
    clearTimeout(timeoutforblinking);
    Alpine.store("default").recordBlink = "";
  } else {
    recording = true;
    recordingCounter =
      Math.floor(validateNumber(parseInt(recordNum), 200, 0) / 10) * 10; // ignorieren der letzen stelle
    assocInMicrocode(recordingCounter / 10 + 200, recordName);
    //todo: default append name on recording
    //Alpine.store('default').microCode[recordingCounter].id = recordingCounter + "   " + Alpine.store('default').microCode[recordingCounter/10+200] + ":" ;//name im Mc Tabelle einfügen

    for (i = recordingCounter; i < recordingCounter + 10; i++) {
      assocInMicrocode(i, 0);
    }

    //springen im Mc
    //todo: recordingCounter - 10 first element of gui list

    //als option bei der Eingabe einfügen
    Alpine.store("commandSelect").items.push({
      id: recordingCounter / 10,
      val: zeroPad(recordingCounter / 10) + ": " + recordName,
    });

    aufnahmeBlinken();
  }
}

function aufnehmen(befehl) {
  if (recording) {
    assocInMicrocode(recordingCounter,befehl)
    //springen beim aufnehmen
    //todo: recordingCounter - 10 first element of gui list
 
    rcToStorage(Alpine.store('default').microCode);

    recordingCounter++;
  } //if
}
const maxRecursion = 15


function executeProgram(currentRecursions) {
  console.log(executeProgram.name, currentRecursions,maxRecursion);
  SingleMacroStep();
  const {programmCounter,executionSpeed}=Alpine.store('default')
  Alpine.store('default').pause=false

  if (!halt && alterProgrammzaeler != programmCounter) {
    // beenden beim Halt und bei endlosschleifen durch fehlende oder einen jmp befehl auf die selbe adresse
    if (currentRecursions < maxRecursion && turboMode) {
      alterProgrammzaeler = programmCounter;
      executeProgram(currentRecursions + 1);
    } else {
      timeoutforexecution = setTimeout(executeProgram, executionSpeed,0);
    }

    alterProgrammzaeler = programmCounter;
  }
}


function SingleMacroStep(){
	microStep(false);
	while(Alpine.store('default').mcCounter !=0){
		microStep(false);
	}

}

//einlesen einer Microcodedatei
function readMCFile() {
  var file = this.files[0];

  var reader = new FileReader();
  reader.onload = function (progressEvent) {
    const mc = this.result.split("\n").map(eventualNum)
  assocMicrocode(mc)  
  renderCommandSelect(mc)

  };
  reader.readAsText(file);
};

function eventualNum(c, i) {
  return i < 200 ? parseInt(c) : c;
}

//einlesen einer Ramdatei
function readRamFile(what) {
  var file = what.files[0];

  var reader = new FileReader();
  reader.onload = function (progressEvent) {
    const ram = this.result.split("\n").map(i => parseInt(i));
    Alpine.store('default').ram= R.take(1000,ram);
  };
  reader.readAsText(file);
};



//"download" von dateien
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function pauseProgram() {
  const {executionSpeed,pause}=Alpine.store('default')
  if (!pause) {
    clearTimeout(timeoutforexecution);
    Alpine.store('default').pause = true;
  } else {
    timeoutforexecution = setTimeout(executeProgram, executionSpeed,0);
    Alpine.store('default').pause = false;
  }
}

function EditRam(CellNumber) {
  if (!turboMode) {
    updateRamSelected( _ => CellNumber)
  }
}

function positionRamInput(idx, selRow, ramdiv, raminp, innerrd) {
  const raminpHeight= getObjectHeight(raminp)
  const tableHeight= getObjectHeight(selRow)
  const selRowTop = selRow.getBoundingClientRect().top;
  const ramDivBottom = ramdiv.getBoundingClientRect().bottom;
  const irdtop =
    selRowTop + tableHeight / 2 >= ramDivBottom
      ? (idx - 1) * tableHeight
      : innerrd.scrollTop;
  const top = selRowTop - raminpHeight / 2 + tableHeight / 2 + "px";

  console.log(positionRamInput.name,{selRowTop,ramDivBottom,irdtop, tableHeight, top})
  //effect
  Alpine.store('default').ramInputTop = top;

  innerrd.scrollTop = irdtop;
}


function highlightRamAccess({addressBus,ramHighlight,mcCounter}) {
  return mcCounter != 1 ? addressBus : ramHighlight;
}

/*
//this is needed to prevent Safari (ipad) from making the background scroll funny
var scrollX = 0;
var scrollY = 0;
var scrollMinX = 0;
var scrollMinY = 0;
var scrollMaxX = document.body.scrollWidth - window.innerWidth;
var scrollMaxY = document.body.scrollHeight - window.innerHeight;

// where the magic happens
window.addEventListener('scroll', function (e) {
	e.preventDefault();
  scrollX = window.scrollX;
  scrollY = window.scrollY;

  if (scrollX <= scrollMinX) scrollTo(scrollMinX, window.scrollY);
  if (scrollX >= scrollMaxX) scrollTo(scrollMaxX, window.scrollY);

  if (scrollY <= scrollMinY) scrollTo(window.scrollX, scrollMinY);
  if (scrollY >= scrollMaxY) scrollTo(window.scrollX, scrollMaxY);
}, false);
*/

function toggleBonsai() {
  const [msg,mc,isBonsaiMode] = 	Alpine.store('default').bonsaiMode
  ? ["changing to normal mode will clear the microcode", normalMC, false]
  : ["changing to bonsai mode will clear the microcode", bonsaiMC, true]

  //effect
  if (confirm(msg)) {
    assocMicrocode(mc.split(";"))

    Alpine.store('default').bonsaiMode = isBonsaiMode;
    renderCommandSelect(Alpine.store('default').microCode)
  }
  
}

function ramFromStorage() {
  const thread= R.compose(R.map(parseInt), R.take(1000))
  const storageRam = JSON.parse(localStorage.getItem('johnny-ram'));
  console.log(ramFromStorage.name, thread(storageRam))
	return storageRam ?  thread( storageRam ) : null;
}

function ramToStorage(ram) {
  //compress memory
  //const thread = R.compose(R.reverse,R.dropWhile(x=> x === 0),R.reverse)
  console.log(ramToStorage.name, ram);
	localStorage.setItem("johnny-ram", JSON.stringify(ram));
}

function mcFromStorage() {
  return JSON.parse(localStorage.getItem("johnny-microcode"));
}

function rcToStorage(microcode) {
  localStorage.setItem("johnny-microcode", JSON.stringify(microcode));
}