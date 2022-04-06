function renderRam(ram, highlight,selected){
	return ram.map((e,i) => ramTableRow(e, i,highlight,selected));
}
function ramTableRow(value,address,highlight_,selected_){
  console.assert(typeof value === 'number')
  if (address > 999)   return

  const {microCode} = Alpine.store('default')
  const hv = highVal(value);
  const lv = lowVal(value);
  const high =  parseInt(hv) + 200;
  const data = hv + "." + lv
  const highlight= highlight_ == address
  const selected= selected_ == address
  const [asm,op] = high > 200 && microCode[high] != undefined
  ? [microCode[high], lv]
  : ["",""]
  return {	id: address,	data,	asm,	op ,highlight,selected }
}


function codelbl(agg, i, mc) {
	return R.assoc((i - 200) * 10, "   " + mc[i] + ":", agg);
}
function hopt(i,mc) {
  return {
    id: i - 200,
    val: zeroPad(i - 200, 2) + ": " + mc[i],
  };
}
function tblrow(desc,mcd,highlight) {
  return (i) => ({
    id: zeroPad(i, 3) + (desc[i] || ""),
    mc: microCodeToText(parseInt(mcd[i])),
    highlight: i == highlight
  });
}

function renderMC(mc, highlight) {
  const desc = R.range(200, mc.length).reduce((agg,i) => codelbl(agg,i,mc), {});
  return R.range(0, 200).map(tblrow(desc,mc,highlight));
}

function renderCommandSelect(mc) {
  if (!mc) return
  const opts = R.range(201, mc.length).map(i => hopt(i,mc));
  Alpine.store("commandSelect").items=opts;
}


function microCodeToText(id){
  return id === 0 ? "" 
  : opTbl[id] ? opTbl[id][3]
  : ""
}
