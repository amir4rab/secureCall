export const jsonToTable = ( jsonData, includeNameAs= 'h2' ) => {
  const { name, json } = jsonData;
  const { data } = json;
  let tableBody = ``;
  let tableHeader = ``;

  data.forEach(( itemArr, index ) => {
    if ( index === 0 ) {
      tableHeader = `<tr>`
      itemArr.forEach(item => {
        tableHeader = tableHeader + `<th>${item}</th>`
      })
      tableHeader = tableHeader + `</tr>`
    } else {
      tableBody = tableBody + `<tr>`
      itemArr.forEach(item => {
        tableBody = tableBody + `<td>${item}</td>`
      })
      tableBody = tableBody + `</tr>`
    }
  });
  
  const table = `<table><thead>${tableHeader}</thead><tbody>${tableBody}</tbody></table>`

  const wrappedTable = `<div style='overflow:auto'>${table}</div>`

  const html = includeNameAs === false ? 
  wrappedTable : 
  `<${includeNameAs}>${name}</${includeNameAs}>${wrappedTable}`;
  


  return ({
    status: 'successful',
    name,
    html
  });
}

export default jsonToTable;