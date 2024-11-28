/*
David Laubersheimer - 2019

mit dank an Dr. Peter Dauscher


*/
const bonsaiMC="8;2;3;5;0;0;0;0;0;0;4;2;18;16;15;1;9;7;0;0;4;2;18;17;15;1;9;7;0;0;11;7;0;0;0;0;0;0;0;0;4;2;18;10;9;7;0;0;0;0;19;7;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;FETCH;INC;DEC;JMP;TST;HLT"
const normalMC="8;2;3;5;0;0;0;0;0;0;12;4;2;13;9;7;0;0;0;0;4;2;13;9;7;0;0;0;0;0;4;2;14;9;7;0;0;0;0;0;4;15;1;9;7;0;0;0;0;0;11;7;0;0;0;0;0;0;0;0;4;2;18;10;9;7;0;0;0;0;12;4;2;13;16;15;1;9;7;0;12;4;2;13;17;15;1;9;7;0;4;12;15;1;9;7;0;0;0;0;19;7;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;FETCH;TAKE;ADD;SUB;SAVE;JMP;TST;INC;DEC;NULL;HLT"

var timeoutforexecution  //zum abbrechen des ausführen des Programms
const numberDevisionChar = "." //für ändern zum komma beim englischen
var blinkzyklus = 0;
var timeoutforblinking //damit das Blinken abgebrochen werden kann

const blockFadeoutTime = 1200;
const blinkgeschwindigkeit = 700;
const startScreenFadeOutTime = 1500; // für den Ladebildschirm

const ramSize = 1000  //this ideally has to be a multiple of 10
const mcCacheSize=200
const ramLength = Math.log10(ramSize) +1;
const maxAccu = parseInt(1 + "9".repeat(ramLength));
const maxAdress = parseInt("9".repeat(ramLength - 1))


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
    mcOpHighlight: [],
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
    showDetailControl: false,
    showModal: false,
    mcCounter: 0,
    r_mcCounter(){return zeroPad(this.mcCounter,ramLength-1)},
    instructionRegister:0,
    r_instructHi(){return highVal(this.instructionRegister)},
    r_instructLo(){return lowVal(this.instructionRegister)},
    programmCounter: 0,
    r_programCounter(){return zeroPad(this.programmCounter,ramLength +1)},
    showStartScreen: true,
    commandSelection: 0,
    recordNum: 110,
    pause: false,
    halt:false,
    recording : false,
    recordingCounter : 150,
    turboMode : false,
    bonsaiMode: false,
    showEditor: false,
    editorContent:""
  });
}

function initEffects(){
	Alpine.effect(() => {
		console.log(store().showModal)
	})
}

function initialize() {
  console.log(initialize.name);
  //toggleFullScreen()
  store().ram= ramFromStorage() || R.range(0, ramSize).map((_) => 0);
  store().microCode=  mcFromStorage() || resetMicrocode();
  renderCommandSelect(store().microCode)

  //1st row ramtbl green
  store().ramHighlight = store().addressBus;
  store().loadMsg = "...";
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
  store().ram = R.range(0, ramSize).map(_ => 0);
}
function newRam(){
  initialize();
  resetRam();
}

function resetMicrocode() {
  return (store().bonsaiMode ? bonsaiMC : normalMC).split(';');
}

function fadeOutStartScreen(){//für verzögertes ausblenden des Startblidschirms(frühstens nach startScreenFadeOutTime ms  )
	console.log(fadeOutStartScreen.name)
	store().showStartScreen=false

	//dinge die nach dem Anzeigen gemacht werden müssen
	resetComputer()
  Alpine.nextTick(() =>{
    store().ramSelected = -1
    store().ramSelected = 0
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
	store().turboMode = 3000 - speed == 0;
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
	store().recordBlink=color
  blinkzyklus=bz
	timeoutforblinking =setTimeout(aufnahmeBlinken,blinkgeschwindigkeit);
}

function aufnahme(){
  const {recordNum,recordName,recording}=store()
	if (recording) {
    clearTimeout(timeoutforblinking);
    store().recordBlink= ""
    store().recording= false
  } else {
    store().recording= true
    const rc = Math.floor(validateNumber(parseInt(recordNum), mcCacheSize, 0) / 10) * 10; // ignorieren der letzen stelle
    store().microCode[rc / 10 + mcCacheSize]= recordName
    //todo: default append name on recording

    for (i = rc; i < rc + 10; i++) {
      store().microCode[i]= 0
    }


    //als option bei der Eingabe einfügen
      store("commandSelect").items.push({
      id: rc / 10,
      val: zeroPad(rc / 10) + ": " + recordName,
    });

    store().recordingCounter = rc ;
    aufnahmeBlinken();
  }
}

function aufnehmen(befehl) {
  const {recording,recordingCounter,microCode} = store()
  if (recording) {
    store().microCode[recordingCounter]= befehl
 
    rcToStorage(microCode);
    store().recordingCounter = recordingCounter + 1;
  } //if
}
const maxRecursion = 15


function executeProgram(currentRecursions) {
  const oldPCounter=store().programmCounter
  console.log(executeProgram.name, currentRecursions,maxRecursion);
  SingleMacroStep();
  const {programmCounter,executionSpeed,halt,turboMode}=store()

  store().pause=false

  if (!halt && oldPCounter != programmCounter) {
    // beenden beim Halt und bei endlosschleifen durch fehlende oder einen jmp befehl auf die selbe adresse
    if (currentRecursions < maxRecursion && turboMode) {
      executeProgram(currentRecursions + 1);
    } else {
      timeoutforexecution = setTimeout(executeProgram, executionSpeed,0);
    }
  }
}


function SingleMacroStep(){
	microStep(false);
	while(store().mcCounter !=0){
		microStep(false);
	}

}

//einlesen einer Microcodedatei
function readMCFile() {
  var file = this.files[0];

  var reader = new FileReader();
  reader.onload = function (progressEvent) {
    const mc = this.result.split("\n").map(eventualNum)
    store().microCode= mc
  renderCommandSelect(mc)

  };
  reader.readAsText(file);
};

function eventualNum(c, i) {
  return i < mcCacheSize ? parseInt(c) : c;
}

//einlesen einer Ramdatei
function readRamFile(what) {
  var file = what.files[0];

  var reader = new FileReader();
  reader.onload = function (progressEvent) {
    const ram = this.result.split("\n").map(i => parseInt(i));
    store().ram= R.take(ramSize,ram);
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
  const {executionSpeed,pause}=store()
  if (!pause) {
    clearTimeout(timeoutforexecution);
  } else {
    timeoutforexecution = setTimeout(executeProgram, executionSpeed,0);
  }
  store().pause=!pause
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
  store().ramInputTop = top;

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
  const txt = s => `"changing to ${s} mode will clear the microcode"`
  const [msg,mc,isBonsaiMode] = 	store().bonsaiMode 
  ? [txt('normal'), normalMC, false]
  : [txt('bonsai'), bonsaiMC, true]

  //effect
  if (confirm(msg)) {
    const microCode= mc.split(";")
    store().microCode= microCode

    store().bonsaiMode = isBonsaiMode;
    renderCommandSelect(microCode)
  }
  
}

function ramFromStorage() {
  const arr= Array(ramSize).fill(0)
  const thread= R.compose(R.map(parseInt), R.take(ramSize))
  const storageRam = JSON.parse(localStorage.getItem('johnny-ram'));
	return storageRam ?  thread( storageRam.concat(arr) ) : null;
}

function ramToStorage(ram) {
  //compress memory
  const thread = R.compose(R.reverse,R.dropWhile(x=> x === 0),R.reverse)
	localStorage.setItem("johnny-ram", JSON.stringify(thread(ram)));
}

function mcFromStorage() {
  return JSON.parse(localStorage.getItem("johnny-microcode"));
}

function rcToStorage(microcode) {
  localStorage.setItem("johnny-microcode", JSON.stringify(microcode));
}

function editRam(){
  const microCode = store().microCode

  const toAsm= e => ram2asm(e,microCode).join(' ').trim()
  store().editorContent= store().ram.map(toAsm).join('\n');
  store().showEditor=true;
}
