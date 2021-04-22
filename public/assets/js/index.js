let transactions = [];
let offlineTransactions = [];
let myChart;


let isOnline = function(yes,ocheck) {
  // const currentState = 
  var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');

  // if (current)
  // if (currentState !== true) {
    xhr.onload = function(){
      let infoEl = document.querySelector(".form .network-info"); 
      infoEl.textContent = "Syncing Transactions ..."
      if(yes instanceof Function){
          yes();
      }
      ocheck.clearInterval();
    }
  // } else {
    // xhr.onerror = function(){
    //   if(no instanceof Function){
    //     no();
    // }
    // }
  // }
  xhr.open("GET","/offline",true);
  xhr.send();
}




function syncTransactions() {

  // if (!localStorage.length||null) return [];
  let len = localStorage.length
  const offlineBulk = localStorage.key(0);
  console.log(JSON.stringify(offlineBulk,null,4))
  // const offlineBulk = keys.map( k => { return {k : localStorage.key(k)} })
  fetch("/api/transaction/bulk", {
      method: "POST",
      body: JSON.stringify(offlineBulk,null,4),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.errors) {
        errorEl.textContent = "Missing Information";
      }
      else {
        // clear form
        localStorage.clear()
        // nameEl.value = "";
        // amountEl.value = "";
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const displayNetworkDown = async () => {
  var ocheck = setInterval(
    isOnline,
    2000,
    syncTransactions,ocheck
    );
}

// syncTransactions();
  // currentState,
  // function(){
  //   if(currentState) {
  //     currentState = false;
  //     alert("Sorry, we currently do not have Internet access.");
  //   }
  // },
  // function(){
  //   // console.log('Internet access');
  //   if(!(currentState||null)) {
  //     currentState = true;
  //     alert("Succesfully connected!");
  //   }
  // }
// );
// isOnline(
//     function(){
//         alert("Sorry, we currently do not have Internet access.");
//     },
//     function(){
//       console.log('Internet access');
//         // alert("Succesfully connected!");
//     }
//   );

  // })

  // .catch( err => {

fetch("/api/transaction")
.then(response => {
  return response.json();
})
.then(data => {
  // save db data on global variable
  // data.join()
  transactions = data;
  populateTotal();
  populateTable();
  populateChart();
})
.catch(displayNetworkDown);

function saveRecord(transaction) {
    let infoEl = document.querySelector(".form .network-info"); 
    infoEl.textContent = "Network Offline"
    // errorEl.textContent = `Network is offline!! Caching transaction "${transaction.name}"`
    // alert('Offline')
    let idx= transactions.unshift(transaction);
    localStorage.setItem(idx,transaction);
    // offlineTranscations.map( (index,item) => {localStorage.setItem('offline',JSON.stringify(item)) });
    // transactions.push(transaction);
    displayNetworkDown();

    
    // console.log(offlineTransactions);
    // fetch("/offline", {
    //   method: "POST",
    //   body: JSON.stringify(transaction),
    //   headers: {
    //     Accept: "application/json, text/plain, */*",
    //     "Content-Type": "application/json"
    //   }
    // })
    // .then(response => { 
    //   console.log()
    //   return response.json();
    // })
    // .then(data => {
    //   offlineData = data;
    //   // if(data.errors) {
    //   //   errorEl.textContent = `Missing info`
    //   // } else {
    //     errorEl.textContent = `Done caching transaction "${transaction.name}"`
    //   // }
    // })
  
  
  //     throw new Error('Could not cache data')
  //   }
  // })
  // .then( transactionData => {
  //   console.log(transactionData)
  //   errorEl.textContent = `Network is offline!! Caching transaction "${transactionData.name}"`

  // })
  // .catch(err => {
  //   console.log(err);
  // })
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

function populateChart() {
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
  .then(response => {    
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      errorEl.textContent = "Missing Information";
    }
    else {
      // clear form
      nameEl.value = "";
      amountEl.value = "";
    }
  })
  .catch(err => {
    // fetch failed, so save in indexed db
    saveRecord(transaction);

    // clear form
    nameEl.value = "";
    amountEl.value = "";
  });
}


document.querySelector("#add-btn").onclick = function() {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
  sendTransaction(false);
};
