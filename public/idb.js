// const { poll } = require("fontawesome");

let db, transaction;

// window.addEventListener('load', () => {
const request = window.indexedDB.open('budget-tracker-transaction-cache', 4);

  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('budget', { keyPath: 'date' });
  };
  
  request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above), save reference to db in global variable
    db = event.target.result;
    // check if app is online, if yes run checkDatabase() function to send all local db data to api
    if (navigator.onLine) {
      uploadTransactions();
    }
  }
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };
  // request.oncomplete = function() {
  //   db.close();
  // };

// });

function saveRecord(record) {
  const transaction = db.transaction(['budget'], 'readwrite');
  const offlineObjectStore = transaction.objectStore('budget');
  // add record to your store with add method.
  offlineObjectStore.add(record);
}

const getTransactions = function() {
  return new Promise( (resolve,reject) => {
    // const request = window.indexedDB.open('budget-tracker-cache', 5);
    let tx,store
  
    tx = db.transaction(['budget'],'readwrite');
    // access your pending object store
    store = tx.objectStore('budget');
    //   get all records from store and set to a variable
    const all = store.getAll();
    all.onsuccess = function() {
      resolve(all.result);
    }
    all.onerror = function() {
      reject('getAll Failed!')
    }
    
  });
}
function uploadTransactions() {
  // open a transaction on your pending db
  
  tx = db.transaction(['budget'], 'readwrite')

  // access your pending object store
  store = tx.objectStore('budget');

  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(['budget'], 'readwrite');
          const offlineObjectStore = transaction.objectStore('budget');
          // clear all items in your store
          offlineObjectStore.clear();
        })
        .catch(err => {
          // set reference to redirect back here
          console.log(err);
        });
    }
  };
}

// listen for app coming back online
//window.addEventListener
//window.addEventListener('online', uploadTransactions);
