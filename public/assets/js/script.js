// require('bootstrap');
// require('fontawesome');

// const { response } = require("express");

document.addEventListener('DOMContentLoaded', () => {
  // require('./idb.js');

  let transactions = [];
  let offlineTransactions = [];
  let myChart;
  

const renderPage = (dat) => {
    // transactions = dat;
    populateTotal();
    populateTable();
    populateChart();
  }
async function mergeResponses(responsePromises, headers) {
  const readers = responsePromises.map(p => Promise.resolve(p).then(r => r.body.getReader()));
  let doneResolve;
  let doneReject;
  const done = new Promise((r, rr) => {
    doneResolve = r;
    doneReject = rr;
  });
  
  const readable = new ReadableStream({
    async pull(controller) {
      const reader = await readers[0];

      try {
        const {done, value} = await reader.read();
        if (done) {
          readers.shift();
          
          if (!readers[0]) {
            controller.close();
            doneResolve();
            return;
          }
          return this.pull(controller);
        }

        controller.enqueue(value);
      }
      catch (err) {
        doneReject(err);
        throw err;
      }
    },
    cancel() {
      doneResolve();
    }
  });

  const response = await responsePromises[0];

  return {
    done,
    response: new Response(readable, {
      headers: headers || response.headers
    })
  };
}


  function populateTotal() {
    // reduce transaction amounts to a single total value
    let total = transactions.reduce((total, t) => {
      return total + parseInt(t.value);
    }, 0);
  
    let totalEl = document.querySelector("#total");
    totalEl.textContent = total;
  }
  
  function populateTable() {
    let tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";
  
    transactions.forEach(transaction => {
      // create and populate a table row
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${transaction.name}</td>
        <td>${transaction.value}</td>
      `;
  
      tbody.appendChild(tr);
    });
  
  }
  
  const populateChart = function() {
    // function populateChart() {
      // copy array and reverse it
      let reversed = transactions.slice().reverse();
      let sum = 0;
    
      // create date labels for chart
      let labels = reversed.map(t => {
        let date = new Date(t.date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      });
    
      // create incremental values for chart
      let data = reversed.map(t => {
        sum += parseInt(t.value);
        return sum;
      });
    
      // remove old chart if it exists
      if (myChart) {
        myChart.destroy();
      }
    
      let ctx = document.getElementById("myChart").getContext("2d");
    
      myChart = new Chart(ctx, {
        type: 'line',
          data: {
            labels,
            datasets: [{
                label: "Total Over Time",
                fill: true,
                backgroundColor: "#6666ff",
                data
            }]
        }
      });
    
    }

function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  }
  else {
    errorEl.textContent = "";
  }

  // create record
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();
  
  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then( response => {    
    if (response.ok){
      return response.json();
    } 
    // else {
    //   return Promise.reject( { 
    //     status: response.status,
    //     statusText: response.statusText,
    //     transaction:transaction });
    // }
  }).then(data => {
    if (data.errors) {
      errorEl.textContent = "Missing Information";
    }
    else {
      // clear form
      nameEl.value = "";
      amountEl.value = "";
    }
  }).catch( e => {
    // fetch failed, so save in indexed db
    console.log(e);
    saveRecord(transactions[0]);
  })

}


function updateOnlineStatus (event) {
  var online = navigator.onLine;
  let infoEl = document.getElementById("network-info");
  infoEl.className = online ? 'success' : 'error';
  infoEl.textContent = online ? 'Online' : 'Offline';
  return online ;//navigator.onLine;
}

const getDBTransactions = async function () {
  // var online = navigator.onLine;
  // let base = online ? 'api' : 'api';
  // let reqURL = new URL('transaction', location.origin);
  // reqURL.pathname = base+reqURL.pathname;
  // console.log(reqURL)
  
  let data;
  try {  
    data = await getTransactions();
    console.log(JSON.stringify(data,null,4));
     
  } catch (error) {
    console.log('ERROR IN IDB: '+error);
    return;
  }
  
}

  fetch('/api/transaction', {
      method:'GET',
      Accept: 'application/json'
  })
  .then( response => {
      // .then( data => {
    if (response.ok) {
      return response.json();
    }
    
  })
  .then(data => {
    transactions=data;
    renderPage();
  });

  
  // }).then(data => {
    
  //   transactions.concat(data);
  //   renderPage();
  // })

  //   // return data;
  //   // }
  // }
      // })
// getTransactions();
// window.addEventListener('load', () => {
//   getTransactions()
//   renderPage();
// });

// getDBTransactions()
// getDBTransactions();
  // transactions=data;
  // renderPage();
  // });
// renderPage
    // return await data.json();


      
        
      // .then( (response) => {
      // data = await response.json();
      // })
    // data = response.json();
  // } catch (error) {
  //     console.log(error);
  //     const dbData = getTransactions();
  //     data = new Response({
  //       body: JSON.parse(data),
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     });

  // }
  

  


window.addEventListener('offline',  function(event) {
  updateOnlineStatus(event);
});
window.addEventListener('online',  function(event) {
  updateOnlineStatus(event);
  
});

// updateOnlineStatus(event);
//})
//window.onload = () => {
// const data = getDBTransactions()




// };

// async function(event) {
//   updateOnlineStatus(event);
//   try {
//     await uploadTransactions();  
//   } catch (err) {
//     console.log(err);
//     return;
//   }
//   const data =  getDBTransactions();
//   // transactions = data.clone();
//   renderPage(data);
 
// });

  // .then( data => { renderPage(data) }).catch(e => {alert(e)})

document.querySelector("#add-btn").onclick = function() {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
  sendTransaction(false);
};

})