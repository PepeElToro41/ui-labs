local UILabs = require("@pkg/ui-labs")
local Types = require "../types"

type MounterProps<T> = Types.MounterProps<T>

function ReactStory(props: MounterProps<UILabs.ReactStory>) end

return ReactStory
