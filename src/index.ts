export{}
// require=require("esm")(module);
// require("dotenv").config();
const {Server,Origins,SocketIO} = require("boardgame.io/server");
const {Cucamber} = require("./Cucamber");
// const admin = require("firebase-admin");
// const {Firestore} = require("bgio-firebase");
// const fs = require("fs");

// console.log("process.env");
// console.log(process.env.FIREBASE_CONFIG);
// const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json",{encoding:"utf8"}));
// const serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//   credential:admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG))
//   // credential: admin.credential.cert(serviceAccount),
//   // databaseURL: "https://svelte-bgio.firebaseio.com"
// });
// console.log(admin.apps.length);
// console.log(admin.apps.map(v=>console.log(v.name)));
// const database = new Firestore({app:"svelte-bgio",config:{
//   // credential: admin.credential.cert(serviceAccount),
//   credential: admin.credential.applicationDefault(),
//   databaseURL: "https://svelte-bgio.firebaseio.com"
// }});
// const database = new Firestore();

const server = Server({
  games:[Cucamber],
  // db:database,
  origins:Origins.LOCALHOST,
  // localhost:["http://localhost"],
  // transport:new SocketIO()
});

const {apiServer,appServer} = server.run(8000,()=>console.log("running on http://localhost:8000"));