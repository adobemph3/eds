import { fetchPlaceholders,getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata("locale"));

const { allCountries,abbreviation,africa,america,asia,australia,capital,continent,countries,europe,sNo} = placeholders;


// let currentPage = 1;
// const rowsPerPage = 11;


//  function displayTablePage(table, rows,page){
//     table.innerHTML = "";
//     const start = (page-1) * rowsPerPage;
//     const end = start + rowsPerPage;
//     const rowsToDisplay = rows.slice(start, end);

//     rowsToDisplay.forEach(rwo => createTableHeader(table, row));
//  }


//  function addPaginationControls(totalRows,table){
//     const controls = document.createElement("div");
//     controls.innerHTML = ` <button onclick="currentPage--">Prev</button>
//                         <button onclick="currentPage++">Next</button> `;
//     document.body.append(controls);
//     displayTablePage(table,totalRows,currentPage);
//  }

//  document.getElementById('prev-btn').addEventListener('click', ()=>{
//         if(currentPage > 1){
//             currentPage++;
//         }
//         displayTablePage(totalRows, table,currentPage);
//     });

//     document.getElementById('next-btn').addEventListener('click', ()=>{
//         if(currentPage * rowsPerPage < totalRows.length){
//             currentPage++;
//         }
//         displayTablePage(totalRows, table,currentPage);
//     });


// let currentPage = 1;
// const rowsPerPage = 10;
// async function updateTable(jsonURL, val) {
//     const{ table, totalItems } = await createTable(jsonURL, val, currentPage,rowsPerPage);
//     parientDiv.querySelector?(".scope> table").replaceWith(table);

//     const totalPages =
//     Math.ceil(totalItems/rowsPerPage);
//     console.log('Page ${currentPage} of ${totalPages}');
// }


async function createTableHeader(table){
     //pagination
let currentPage = 1;
const rowsPerPage = 10;
const parentDiv = document.createElement('div');
parentDiv.addEventListener('scroll', async () => {
    if (parentDiv.scrollTop + parentDiv.clientHeight >= parientDiv.scrollHeight) {
        currentPage++;
        const { table } = await createTable(countries.href, null, currentPage, rowsPerPage);
        parentDiv.querySelector('table').append(...table.querySelectorAll('tr:not(:first-child)')); // Append rows
    }
});
    
    
    parentDiv.append(await createTable(countries.href, null));
    const initialTable = await createTable(countries.href, null, currentPage, rowsPerPage);
    parentDiv.append(initialTable);

    let tr=document.createElement("tr");

    let sno=document.createElement("th");
        sno.appendChild(document.createTextNode(sNo || "S.No"));
    let countryh=document.createElement("th");
        countryh.appendChild(document.createTextNode(countries || "Country"));
    let capitalh=document.createElement("th");
        capitalh.appendChild(document.createTextNode(capital || "Capital"));
    let continenth=document.createElement("th");
        continenth.appendChild(document.createTextNode(continent || "Continent"));
    let abbr=document.createElement("th");
        abbr.appendChild(document.createTextNode(abbreviation || "Abbreviation"));
    tr.append(sno);
    tr.append(countryh);
        tr.append(capitalh);
        tr.append(continenth);
        tr.append(abbr);

    table.append(tr);
}
async function createTableRow(table,row,i){
    let tr=document.createElement("tr");
    let sno=document.createElement("td");sno.appendChild(document.createTextNode(i));
    let country=document.createElement("td");country.appendChild(document.createTextNode(row.Country));
    let continent=document.createElement("td");continent.appendChild(document.createTextNode(row.Capital));
    let capital=document.createElement("td");capital.appendChild(document.createTextNode(row.Continent));
    let abbr=document.createElement("td");abbr.appendChild(document.createTextNode(row.Abbreviation));
    tr.append(sno);tr.append(country);tr.append(continent);tr.append(capital);tr.append(abbr);
    table.append(tr);
}

async function createSelectMap(jsonURL){
    const optionsMap=new Map();
    const { pathname } = new URL(jsonURL);

    const resp = await fetch(pathname);
    optionsMap.set("all",allCountries);optionsMap.set("asia",asia);optionsMap.set("europe",europe);optionsMap.set("africa",africa);optionsMap.set("america",america);optionsMap.set("australia",australia);
    const select=document.createElement('select');
    select.id = "region";
    select.name="region";
    optionsMap.forEach((val,key) => {
        const option = document.createElement('option');
        option.textContent = val;
        option.value = key;
        select.append(option);
      });
     
     const div=document.createElement('div'); 
     div.classList.add("region-select");
     div.append(select);
    return div;
}
async function createTable(jsonURL,val) {

    let  pathname = null;
    if(val){
        pathname=jsonURL;
    }else{
        pathname= new URL(jsonURL);
    }
    
    const resp = await fetch(pathname);
    const json = await resp.json();
    console.log("=====JSON=====> {} ",json);
    
    const table = document.createElement('table');
    createTableHeader(table);
    json.data.forEach((row,i) => {

        createTableRow(table,row,(i+1));

      
    });
    
    return table;
}    

export default async function decorate(block) {
   
    const countries = block.querySelector('a[href$=".json"]');
    const parientDiv=document.createElement('div');
    parientDiv.classList.add('contries-block');

    if (countries) {
        parientDiv.append(await createSelectMap(countries.href));
        parientDiv.append(await createTable(countries.href,null));
        countries.replaceWith(parientDiv);
        
    }
    const dropdown=document.getElementById('region');
      dropdown.addEventListener('change', () => {
        let url=countries.href;
        if(dropdown.value!='all'){
            url=countries.href+"?sheet="+dropdown.value;
        }
        const tableE=parientDiv.querySelector(":scope > table");
        let promise = Promise.resolve(createTable(url,dropdown.value));
        promise.then(function (val) {
            tableE.replaceWith(val);
        });
      });
      //addPaginationControls();
  }