import path from 'path';
import fs from 'fs';

const DB_FILE = path.resolve(__dirname, 'data/database.json');
let database = [];
let dirty = false;

let savePromise = Promise.resolve();
if (fs.existsSync(DB_FILE)) {
  try {
    database = JSON.parse(fs.readFileSync(DB_FILE).toString());
  } catch(err) {
  }
}

function save() {
  if (!dirty) return;
  dirty = false;

  savePromise.then(() => {
    savePromise = new Promise(resolve => {
      fs.writeFile(DB_FILE, JSON.stringify(database), resolve);
    })
  })
}

setInterval(save, 1000 * 60);

export function addRecord(record) {
  database.push(record);
  dirty = true;
}

export function getData() {
  console.log(database)
  return Array.from(database);
}
