import fs from "fs";
import chokidar from "chokidar";
import crypto from "crypto";

const configFile = "./config.json";
let config;

try {
  config = fs.readFileSync(configFile, "utf8");
} catch (err) {
  console.log(`Errore nel processo di lettura del file di configurazione: ${err}.`);
  process.exit(1);
}

const rootDirPath = JSON.parse(config).rootDirPath;

const watcher = chokidar.watch(rootDirPath, {
  persistent: true,
  awaitWriteFinish: { //per attendere la fine della scrittura dei video
    stabilityThreshold: 2000,
    pollInterval: 100
  },
});

watcher.on('add', async (path, stats) => {
  console.log(path);
  generateHash(path);
});

function generateHash(filePath){
  const hash = crypto.createHash("sha256");
  const input = fs.createReadStream(filePath);
  
  input.on("data", (data) => {
    hash.update(data);
  });

  input.on("end", () => {
    console.log(hash.digest("hex"));
  })
}