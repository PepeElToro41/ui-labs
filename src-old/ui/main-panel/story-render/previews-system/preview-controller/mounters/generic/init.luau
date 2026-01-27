local UILabs = require("@pkg/ui-labs")
local Types = require "../types"

type MounterProps<T> = Types.MounterProps<T>

function GenericStory(props: MounterProps<UILabs.GenericStory>) end

return GenericStory
