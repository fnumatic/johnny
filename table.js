function renderRam(ram, highlight,selected){
	return ram.map((e,i) => ramTableRow(e, i,highlight,selected));
}
function ramTableRow(value,address,highlight_,selected_){
  console.assert(typeof value === 'number')
  if (address > ramSize - 1)   return

  const {microCode} = store()
  const hv = highVal(value);
  const lv = lowVal(value);
  const high =  parseInt(hv) + mcCacheSize;
  const data = hv + "." + lv
  const highlight= highlight_ == address
  const selected= selected_ == address
  const [asm,op] = high > mcCacheSize && microCode[high] != undefined
  ? [microCode[high], lv]
  : ["",""]
  return {	id: address,	data,	asm,	op ,highlight,selected }
}


function codelbl(agg, i, mc) {
	return R.assoc((i - mcCacheSize) * 10, "   " + mc[i] + ":", agg);
}
function hopt(i,mc) {
  return {
    id: i - mcCacheSize,
    val: zeroPad(i - mcCacheSize, 2) + ": " + mc[i],
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
  const desc = R.range(mcCacheSize, mc.length).reduce((agg,i) => codelbl(agg,i,mc), {});
  return R.range(0, mcCacheSize).map(tblrow(desc,mc,highlight));
}

function renderCommandSelect(mc) {
  if (!mc) return
  const opts = R.range(201, mc.length).map(i => hopt(i,mc));
  store("commandSelect").items=opts;
}


function microCodeToText(id){
  return id === 0 ? "" 
  : opTbl[id] ? opTbl[id][2]
  : ""
}

function ram2asm(value, microCode, cacheSize = mcCacheSize, rlength=ramLength){
  const clean=true
  const hv = highVal(value, rlength);
  const lv = lowVal(value, rlength);
  const lv_ = clean && parseInt(lv)==0 ? "": lv
  const high =  parseInt(hv) + cacheSize;
  return high > mcCacheSize && microCode[high] != undefined
                ? [microCode[high], lv]
                : ["",lv_]
}