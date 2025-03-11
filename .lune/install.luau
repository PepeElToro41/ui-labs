local process = require "@lune/process"

function install()
	process.spawn("pesde", { "install" })

	process.spawn("rojo", {
		"sourcemap",
		"serve.project.json",
		"-o",
		"sourcemap.json",
	})
end

return install
