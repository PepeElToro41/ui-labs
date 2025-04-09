import { exec } from "child_process"



export function install() {
   exec("pesde install")
   exec("rojo sourcemap serve.project.json -o sourcemap.json")
}
