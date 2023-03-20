import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
const userobj = {
  users : [
    {id : 1,username : 'armaan', password : 'armaan12', coins : 1000},
    {id : 2,username : 'admin' , password : 'admin123', coins : 1000}
  ],
  "adhar": [],
  "birth": []
}
const adapter = new JSONFileSync(process.env.PWD + "/db/db.json");
const db = new LowSync(adapter);
db.read();
db.data = db.data || userobj;
db.write()
export default db;