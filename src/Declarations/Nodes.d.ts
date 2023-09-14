interface StoryNode {
	DisplayName: string;
	Unknown?: boolean;
	DisplayIcon?: string;
	Module: ModuleScript;
}
interface BookStoryNode extends StoryNode {
	BookNodeBinded: BookNode;
}
interface FolderNode {
	DisplayName: string;
	Unknown?: boolean;
	InstanceBinded?: Instance;
	Inside: ListNode[];
}
interface BookFolderNode {
	DisplayName: string;
	InstanceBinded: Instance;
	BookNodeBinded: BookNode;
	Inside: (BookStoryNode | BookFolderNode)[];
}
interface BookNode {
	DisplayName: string;
	ModuleBookBinded: ModuleScript;
	UILibs?: UILibsPartial;
	Inside: (BookStoryNode | BookFolderNode)[];
}

type StoryType = StoryNode | BookStoryNode;

type MainNodes = (FolderNode | BookNode)[];

type ListNode = FolderNode | StoryType;
