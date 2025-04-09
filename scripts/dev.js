
import { exec } from "child_process";
import fs from "fs/promises";
import util from "util";
import { install } from "./dependencies.js";


const spawn = util.promisify(exec);


const SERVE_DIR = "serve"
const DARKLUA_CONFIG = ".darklua.json"
const SOURCEMAP = "darklua-sourcemap.json"
const PACKAGES = "roblox_packages"

install()


await fs.rm(SOURCEMAP, { force: true })
await fs.rm(SERVE_DIR, { recursive: true, force: true })
await fs.mkdir(SERVE_DIR)

await fs.copyFile("build.project.json", SERVE_DIR + "/build.project.json")
await fs.copyFile("serve.project.json", SERVE_DIR + "/serve.project.json")

await fs.cp("src", SERVE_DIR + "/src", { recursive: true });
await fs.cp(PACKAGES, SERVE_DIR + "/" + PACKAGES, { recursive: true });

exec("rojo sourcemap serve.project.json -o " + SOURCEMAP)

console.log("RUNNING ROJO SOURCEMAP")
spawn("rojo sourcemap --watch serve.project.json -o " + SOURCEMAP).catch(console.warn)

console.log("RUNNING DARK LUA")
console.log("darklua process -w --config " + DARKLUA_CONFIG + " src " + SERVE_DIR + "/src")

spawn("darklua process -w --config " + DARKLUA_CONFIG + " src " + SERVE_DIR + "/src")

console.log("SERVER RUNNING")

spawn("rojo serve " + SERVE_DIR + "/serve.project.json").catch(console.warn)