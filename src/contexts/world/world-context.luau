local vide = require "@pkg/vide"
local ecs = require "@vendor/ecs"

local WORLD_CONTEXT = vide.context() :: vide.Context<ecs.World>
return WORLD_CONTEXT
