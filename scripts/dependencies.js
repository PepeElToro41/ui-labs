import { exec } from "child_process";
import util from "util";

const spawn = util.promisify(exec);

export async function install() {
	await spawn("rojo sourcemap serve.project.json -o sourcemap.json");
	console.log("INSTALLING PESDE");
	await spawn("pesde install");
}
