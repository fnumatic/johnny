const mccAction={
  assign:0,
  inc:1
}

const opTbl = {
  1: [DbRam, mccAction.inc, "db ---> ram"],
  2: [RamDb, mccAction.inc, "ram ---> db"],
  3: [DbIns, mccAction.inc, "db ---> ins"],
  4: [InsAd, mccAction.inc, "ins ---> ab"],
  5: [InsMc, mccAction.assign, "ins ---> mc"],
  7: [NullMc, mccAction.assign, "mc:=0"],
  8: [PcAd, mccAction.inc, "pc ---> ab"],
  9: [IncPc, mccAction.inc,"pc++"],
  10: [IncPc0, mccAction.inc, "acc=0?->pc++"],
  11: [InsPc, mccAction.inc, "ins ---> pc"],
  12: [NullAcc, mccAction.inc, "acc:=0"],
  13: [AddAcc, mccAction.inc, "plus"],
  14: [SubAcc, mccAction.inc,  "minus"],
  15: [AccDb, mccAction.inc, "acc ---> db"],
  16: [IncAcc, mccAction.inc, "acc++"],
  17: [DecAcc, mccAction.inc, "acc--"],
  18: [DbAcc, mccAction.inc, "db ---> acc"],
  19: [Halt, mccAction.inc, "stop"],
};
const mcTbl=Object
  .keys(opTbl)
  .reduce((o,k) => ({...o,[opTbl[k][0].name]:k}),{})

function mcEffect(fn, display=true){
  const op=mcTbl[fn.name]

  const res = fn()
  aufnehmen(op)
  renderSignal(display,op);
  return res
}
function incEffect (fn,display,mcCounter) {
  mcEffect(fn,display)
  return mcCounter + 1;
}
function microStep(display) {
  const {microCode,mcCounter}=Alpine.store('default')
  let mcCounter_ = 0

  const mcKey = parseInt(microCode[mcCounter])
  const [fn,action] = opTbl[mcKey]

  switch (action) {
    case mccAction.inc: mcCounter_ = incEffect(fn,display,mcCounter);break;

    case mccAction.assign: mcCounter_ = mcEffect(fn,display);break;

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


function renderSignal(display,k) {
  if (display) {
    Alpine.store('default').mcOpHighlight=k
    setTimeout(()=> Alpine.store('default').mcOpHighlight=-1, blockFadeoutTime, k);
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
