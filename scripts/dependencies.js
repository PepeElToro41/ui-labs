import { exec } from "child_process";
import util from "util";

const spawn = util.promisify(exec);

export async function install() {
   await spawn("rojo sourcemap serve.project.json -o sourcemap.json")
   console.log("EXECUTING")
   exec("lune -V", (a, b, c) => {
      console.log(a, b, c)
   }).addListener("message", (a, b, c) => {
      console.log(a, b, c)
   })
   await spawn("pesde install")
}
