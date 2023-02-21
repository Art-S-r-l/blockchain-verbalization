import fs from "fs";
import chokidar from "chokidar";

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

watcher.on('add', (path, stats) => {
  console.log(path);
});