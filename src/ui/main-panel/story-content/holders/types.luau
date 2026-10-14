local ecs = require "@vendor/ecs"

--- The preview a holder builds a place for
export type PreviewProps = {
	--- the preview the holder belongs to
	entity: ecs.Entity,
	--- the frame the story was mounted in. Holders never create, destroy or unparent it,
	--- they only offer a place for it through `target`
	holder: Frame,
	--- the slot the story panel keeps for this preview, where the editor holder builds itself
	slot: Frame,
	--- display name of the story, used to name what a holder creates
	name: Reactive<string>,
}

export type HolderProps = PreviewProps & {
	--- where the story goes while this holder is the one showing it. The holder writes its
	--- own instance in here and clears it again when it goes away
	target: Source<GuiBase2d?>,
}

--- Builds one place a story can be shown in and publishes it through `props.target`
export type Holder = (props: HolderProps) -> ()

return nil
