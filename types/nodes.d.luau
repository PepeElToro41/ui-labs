type Storybook = {
	name: string,
	storyRoots: { Instance },
	groupRoots: boolean,
}

export type Storybooks = Map<ModuleScript, Storybook>

-- entry point
export type RootNodes = {
	Storybooks: { StorybookNode },
	Unknown: { UnknownNode },
}

export type StoryNode = {
	Type: "Story",
	Name: string,
	Module: ModuleScript,
	Parent: ContainerNode,
}
export type ModuleLookup = { [ModuleScript]: StoryNode }

export type StorybookNode = {
	Type: "Storybook",
	Name: string,
	Module: ModuleScript,
	Result: Storybook,
	Children: { ChildrenNode },
}

export type FolderNode = {
	Type: "Folder",
	Instance: Instance, -- No name as this is binded to a roblox instance
	Storybook: StorybookNode,
	Parent: ParentNode,
	Children: { ChildrenNode },
}

export type UnknownNode = {
	Type: "Unknown",
	Instance: Instance,
	Children: { StoryNode },
}

export type Node = StoryNode | FolderNode | StorybookNode | UnknownNode
export type ParentNode = FolderNode | StorybookNode -- whatever can be a node parent
export type ContainerNode = FolderNode | StorybookNode | UnknownNode -- whatever can have children
export type ChildrenNode = StoryNode | FolderNode -- whatever can have a parent
export type DefinedNode = StoryNode | FolderNode | StorybookNode -- whatever has a name and it's not unknown
