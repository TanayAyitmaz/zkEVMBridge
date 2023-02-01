// Add Comma Decimal
function addComma(nStr:any) {
    nStr += ''
    const x = nStr.split('.')
    let x1 = x[0]
    const x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2')
    }
    return x1 + x2
  }
  
  // Comma Str
  function strDisplay(str:any) {
    return addComma(str.toString())
  }

  export { addComma }
  export { strDisplay } 