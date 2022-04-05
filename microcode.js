const mccAction={
  assign:0,
  inc:1
}

const stepTable = {
  1: [DbRam, mccAction.inc, 0],
  2: [RamDb, mccAction.inc, 1],
  3: [DbIns, mccAction.inc, 2],
  4: [InsAd, mccAction.inc, 6],
  5: [InsMc, mccAction.assign, 5],
  7: [NullMc, mccAction.assign, 14],
  8: [PcAd, mccAction.inc, 8],
  9: [IncPc, mccAction.inc, 17],
  10: [IncPc0, mccAction.inc, 16],
  11: [InsPc, mccAction.inc, 7],
  12: [NullAcc, mccAction.inc, 11],
  13: [AddAcc, mccAction.inc, 3],
  14: [SubAcc, mccAction.inc, 3],
  15: [AccDb, mccAction.inc, 4],
  16: [IncAcc, mccAction.inc, 12],
  17: [DecAcc, mccAction.inc, 13],
  18: [DbAcc, mccAction.inc, 3],
  19: [Halt, mccAction.inc, 15],
};
function microStep(display) {
  const {microCode,mcCounter}=Alpine.store('default')
  let mcCounter_ = 0
  const inc= (fn,id,k) =>{
    fn()
    mcCounter_ = mcCounter + 1;
    aufnehmen(k)
    renderSignal(display, id);
  }
  const assign= (fn,id,k) =>{
    mcCounter_ = fn();
    aufnehmen(k)
    renderSignal(display, id);
  }
  const mcKey = parseInt(microCode[mcCounter])
  const [fn,action,id] = stepTable[mcKey]
  
  switch (action) {
    case mccAction.inc: inc(fn,id,mcKey);break;

    case mccAction.assign: assign(fn,id,mcKey);break;

    default:
      console.log(
        "Ungültiger Befehl " +
          mcKey +
          " in Adresse " +
          mcCounter +
          " programm wird beendent",
          Alpine.store('default')
      );
      Halt();
  } 
  assocMcCounter(mcCounter_)
  if (!turboMode) {
    Alpine.store('default').mcHighlight=mcCounter_
  }
}


function renderSignal(display,id) {
  if (display) {
    FadeIn(id);
    setTimeout(FadeOut, blockFadeoutTime, id);
  }
}

function RamDb(){
  const store = Alpine.store('default');
  const {addressBus,ram}=store
  console.assert(typeof addressBus === "number")
  assocDatabus(ram[addressBus])
  Alpine.store('default').ramHighlight = highlightRamAccess(store)
}


function DbRam(){
  const store = Alpine.store('default');
  const {addressBus,dataBus}=store
  console.assert(typeof addressBus === "number")

	assocInRam(addressBus, dataBus)
	Alpine.store('default').ramHighlight = highlightRamAccess(store)
}

function DbAcc() {
  const {dataBus} = Alpine.store('default')
  updateAccu(_ => dataBus)
}

function AccDb(){
  const {accumulator} = Alpine.store('default')
  assocDatabus(accumulator)
}

function NullAcc(){
  updateAccu( _ => 0)
}

function IncAcc() {
  const notexceeds= accu => accu < maxAccu
  updateAccu(accu => notexceeds(accu) ? accu + 1 : accu );
}

function DecAcc() {
  updateAccu(accu => accu > 0 ? accu - 1 : accu)
}

function AddAcc() {
  const {dataBus} = Alpine.store('default')
  const notexceeds= accu => accu + dataBus < (maxAccu + 1)
  updateAccu(accu => notexceeds(accu) ? accu + dataBus : maxAccu)
}

function SubAcc() {
  const {dataBus} = Alpine.store('default')
  updateAccu(accu => accu - dataBus >= 0 ? accu - dataBus : 0 )
}

function DbIns(){
  const {dataBus} = Alpine.store('default')
  console.log(DbIns.name, dataBus);
	assocInstructionRegister(dataBus);
}

function InsMc(){
  const {instructionRegister} = Alpine.store('default')
  console.log(InsMc.name, instructionRegister)
  const opCode = Math.floor(instructionRegister / ramSize) * 10;
	assocMcCounter( opCode	) //get only the opcode
  return opCode
}

function InsAd(){
  const {instructionRegister} =Alpine.store('default')
  const address = lowVal(instructionRegister)
  assocAdressBus(parseInt(address));
}


function InsPc(){
  const {instructionRegister} =Alpine.store('default')
  const s = lowVal(instructionRegister)
  assocProgramCounter(parseInt(s))
}

function PcAd(){
  const {programmCounter} = Alpine.store('default')
	assocAdressBus(programmCounter);
}

function NullMc(){
	assocMcCounter(0)
  return 0
}

function IncPc() {
  const {programmCounter} = Alpine.store('default')
  if (programmCounter < maxAdress) {
    assocProgramCounter(programmCounter + 1);
  }
}

function IncPc0() {
  const {programmCounter,accumulator} = Alpine.store('default')
  if ( programmCounter < maxAdress && accumulator == 0) {
    assocProgramCounter(programmCounter + 1);
  }
}

function Halt(){
	alert("Ende des Programms")
	halt = true ;
}
