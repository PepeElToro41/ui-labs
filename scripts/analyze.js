import { exec } from "child_process";
import { promises as fs } from 'fs';
import util from "util";

const spawn = util.promisify(exec);
const defFiles = []


const files = await fs.readdir("types");
for (const file of files) {
   const fullPath = "./types/" + file;
   const stat = await fs.stat(fullPath);
   if (stat.isFile()) {
      defFiles.push(fullPath);
   }
}


spawn('luau-lsp analyze --sourcemap ./sourcemap.json --ignore "./roblox-packages ./serve" --defs "./globalTypes.d.luau ' + defFiles.join(" ") + '" src') 