

function qian (str) { 
return str.replace(/(?=(\d{3})+$)/g, function(str) {
  return str = ','
}) 
}

const a = qian('1234567890')

debugger