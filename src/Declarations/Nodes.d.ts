interface StoryNode {
	DisplayName: string;
	Unknown?: boolean;
	DisplayIcon?: string;
	Module: ModuleScript;
}
interface FolderNode {
	DisplayName: string;
	Unknown?: boolean;
	Inside: ListNode[];
}
type ListNode = FolderNode | StoryNode;
