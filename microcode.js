function SingleMicroStep(){//legacy(entfernen)?

	microStep();
//console.log(SingleMicroStep.caller)
}


//Abläufe im Microcode


function microStep(display) {
  const {microCode,mcCounter}=Alpine.store('default')
  let mcCounter_ = mcCounter
  switch (parseInt(microCode[mcCounter])) {
    case 1: //
      DbRam();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 0);
      break;

    case 2: //
      RamDb();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 1);
      break;

    case 3: //
      DbIns();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 2);
      break;

    case 4: //
      InsAd();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 6);
      break;

    case 5: //
      mcCounter_ = InsMc();
      renderSignal(display, 5);
      break;

    case 8: //
      PcAd();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 8);
      break;

    case 7: //
      mcCounter_ = NullMc();
      renderSignal(display, 14);
      break;

    case 9: //
      IncPc();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 17);
      break;

    case 10: //
      IncPc0();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 16);
      break;

    case 11: //
      InsPc();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 7);
      break;

    case 12: //
      NullAcc();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 11);
      break;

    case 13: //
      AddAcc();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 3);
      break;

    case 14: //
      SubAcc();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 3);
      break;

    case 18: //
      DbAcc();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 3);
      break;

    case 15: //
      AccDb();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 4);
      break;

    case 16: //
      IncAcc();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 12);
      break;

    case 17: //
      DecAcc();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 13);

      break;

    case 19: //
      Halt();
      mcCounter_ = mcCounter + 1;
      renderSignal(display, 15);
      break;

    default:
      console.log(
        "Ungültiger Befehl " +
          microCode[mcCounter] +
          "in Adresse " +
          mcCounter +
          " programm wird beendent"
      );
      alert(
        "Kein Befehl in Microcodeadresse " +
          mcCounter +
          " Das Programm wird beendet"
      );
      Halt();
      NullMc();
      break;
  } //switch
  Alpine.store('default').mcCounter = mcCounter_

  
  highlightMc(mcCounter_);
}


function renderSignal(display,id) {
  if (display) {
    FadeIn(id);
    setTimeout(FadeOut, blockFadeoutTime, id);
  }
}

function RamDb(){
  const {addressBus,ram}=Alpine.store('default')
	Alpine.store('default').dataBus = ram[addressBus];
	highlightRamAccess()
	aufnehmen(2);
}


function DbRam(){
  const {addressBus,dataBus}=Alpine.store('default')
	writeToRam(dataBus,addressBus)
	highlightRamAccess()
	aufnehmen(1);
}

function DbAcc() {
  const {dataBus} =Alpine.store('default')
  Alpine.store('default').accumulator = dataBus;

  aufnehmen(18);
}

function AccDb(){
  const {accumulator} =Alpine.store('default')
	Alpine.store('default').dataBus = accumulator;
	aufnehmen(15);
}

function NullAcc(){
	Alpine.store('default').accumulator=0;

	aufnehmen(12);
}

function IncAcc() {
  const {accumulator} = Alpine.store('default')
  if (accumulator < parseInt(1 + "9".repeat(ramLength))) {
    Alpine.store('default').accumulator = accumulator + 1;
  }
  aufnehmen(16);
}

function DecAcc() {
  const {accumulator} = Alpine.store('default')
  Alpine.store('default').accumulator = accumulator > 0 ? accumulator - 1 : accumulator;
  aufnehmen(17);
}

function AddAcc() {
  const {accumulator,dataBus} = Alpine.store('default')
  Alpine.store('default').accumulator =
    accumulator + dataBus < "2" + "0".repeat(ramLength)
      ? accumulator + dataBus
      : (1 + "9".repeat(ramLength)).toString();
  aufnehmen(13);

}

function SubAcc() {
  const {accumulator,dataBus} = Alpine.store('default')

  Alpine.store('default').accumulator= accumulator - dataBus >= 0 ? accumulator - dataBus : 0;
  aufnehmen(14);
}

function DbIns(){
  const {dataBus} = Alpine.store('default')
	writeToIns(dataBus);
	aufnehmen(3);
	}

function InsMc(){
  const {instructionRegister} = Alpine.store('default')
  console.log('insmc', instructionRegister)
  const opCode = Math.floor(instructionRegister / ramSize) * 10;
	writeToMc( opCode	) //get only the opcode
	aufnehmen(5);
  return opCode
}

function InsAd(){
  const {instructionRegister} =Alpine.store('default')
  const address = zeroPad(instructionRegister, ramLength + 1).substr(2, ramLength + 1);
  writeToAddressBus(parseInt(address));
  aufnehmen(4);
}


function InsPc(){
  const {instructionRegister} =Alpine.store('default')
	writeToPc(zeroPad(instructionRegister,ramLength +1).substr(2,ramLength + 1))
	aufnehmen(11);
	}

function PcAd(){
  const {programmCounter} = Alpine.store('default')
	writeToAddressBus(programmCounter);
	aufnehmen(8);
	}

function NullMc(){
//	MicroCodeCounter = 0;
//	document.getElementById("MicroCodeCaption").innerHTML = "000";
	writeToMc(0)
	aufnehmen(7);
  return 0
}

function IncPc() {
  const {programmCounter} = Alpine.store('default')

  if (programmCounter < maxAdress()) {
    writeToPc(programmCounter + 1);
  }
  aufnehmen(9);
}

function maxAdress() {
  return parseInt("9".repeat(ramLength - 1));
}

function IncPc0() {
  const {programmCounter,accumulator} = Alpine.store('default')
  if (
    programmCounter < maxAdress() && accumulator == 0
  ) {
    writeToPc(programmCounter + 1);
  }

  aufnehmen(10);
}


function Halt(){
	alert("Ende des Programms")
	halt = true ;
	aufnehmen(19);
}
