// THIS FILE IS GENERATED AUTOMATICALLY AND SHOULD NOT BE EDITED BY HAND!

/// <reference no-default-lib="true"/>

interface Services {
	ChangeHistoryService: ChangeHistoryService;
	CoreGui: CoreGui;
	DebuggerManager: DebuggerManager;
	NetworkClient: NetworkClient;
	NetworkServer: NetworkServer;
	NetworkSettings: NetworkSettings;
	PackageService: PackageService;
	PluginDebugService: PluginDebugService;
	PluginGuiService: PluginGuiService;
	RenderSettings: RenderSettings;
	RobloxPluginGuiService: RobloxPluginGuiService;
	Selection: Selection;
	Studio: Studio;
	StudioData: StudioData;
	StudioService: StudioService;
	TaskScheduler: TaskScheduler;
	TestService: TestService;
	VersionControlService: VersionControlService;
}

interface CreatableInstances {
	PluginAction: PluginAction;
	RenderingTest: RenderingTest;
}

interface AbstractInstances {
	NetworkPeer: NetworkPeer;
	NetworkReplicator: NetworkReplicator;
	PluginGui: PluginGui;
	StatsItem: StatsItem;
}

interface Instances extends Services, CreatableInstances, AbstractInstances {
	ClientReplicator: ClientReplicator;
	DataModelSession: DataModelSession;
	DebuggerBreakpoint: DebuggerBreakpoint;
	DebuggerWatch: DebuggerWatch;
	DebugSettings: DebugSettings;
	DockWidgetPluginGui: DockWidgetPluginGui;
	File: File;
	GameSettings: GameSettings;
	GlobalSettings: GlobalSettings;
	LuaSettings: LuaSettings;
	MemStorageConnection: MemStorageConnection;
	MultipleDocumentInterfaceInstance: MultipleDocumentInterfaceInstance;
	PhysicsSettings: PhysicsSettings;
	Plugin: Plugin;
	PluginDragEvent: PluginDragEvent;
	PluginMenu: PluginMenu;
	PluginMouse: PluginMouse;
	PluginToolbar: PluginToolbar;
	PluginToolbarButton: PluginToolbarButton;
	QWidgetPluginGui: QWidgetPluginGui;
	RunningAverageItemDouble: RunningAverageItemDouble;
	RunningAverageItemInt: RunningAverageItemInt;
	RunningAverageTimeIntervalItem: RunningAverageTimeIntervalItem;
	ScriptDebugger: ScriptDebugger;
	ServerReplicator: ServerReplicator;
	StudioTheme: StudioTheme;
	TotalCountTimeIntervalItem: TotalCountTimeIntervalItem;
}

// GENERATED ROBLOX INSTANCE CLASSES

interface KeyframeSequence extends AnimationClip {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_KeyframeSequence: unique symbol;
	/**
	 * Contains the hip height of the [Humanoid](https://developer.roblox.com/en-us/api-reference/class/Humanoid) of the model that was used to author this [KeyframeSequence](https://developer.roblox.com/en-us/api-reference/class/KeyframeSequence). Default value is 1.35 since that is the hip height set for a standard R15 [character](https://developer.roblox.com/en-us/api-reference/class/Character).
	 * Tags: Hidden
	 */
	AuthoredHipHeight: number;
}

interface AnimationClipProvider extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_AnimationClipProvider: unique symbol;
	/**
	 * Tags: Deprecated, [object Object]
	 * @deprecated
	 */
	GetAnimationClip(this: AnimationClipProvider, assetId: string): AnimationClip;
	/**
	 * Tags: Deprecated, [object Object]
	 * @deprecated
	 */
	GetAnimationClipById(this: AnimationClipProvider, assetId: number, useCache: boolean): AnimationClip;
}

interface Animator extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Animator: unique symbol;
	/**
	 * Increments the [AnimationTrack.TimePosition](https://developer.roblox.com/en-us/api-reference/property/AnimationTrack/TimePosition) of all playing [AnimationTrack](https://developer.roblox.com/en-us/api-reference/class/AnimationTrack)s that are loaded onto the [Animator](https://developer.roblox.com/en-us/api-reference/class/Animator), applying the offsets to the model associated with the [Animator](https://developer.roblox.com/en-us/api-reference/class/Animator). For use in the command bar or by plugins only.
	 *
	 * The deltaTime paramater determines the number of seconds to increment on the animation's progress. Typically this function will be called in a loop to preview the length of an animation (see example).
	 *
	 * Note that once animations have stopped playing, the model's joints will need to be manually reset to their original positions (see example).
	 *
	 * This function is used to simulate playback of [Animation](https://developer.roblox.com/en-us/api-reference/class/Animation)s when the game isn't running. This allows animations to be previewed without the consequences of running the game, such as scripts executing. If the function is called whilst the game is running, or by [Script](https://developer.roblox.com/en-us/api-reference/class/Script)s or [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript)s, it will return an error.
	 *
	 * Developers designing their own custom animation editors are advised to use this function to preview animations, as it is the method the official Roblox Animation Editor plugin uses.
	 */
	StepAnimations(this: Animator, deltaTime: number): void;
}

/** The CoreGui is a service used to store Guis created in-game by Roblox for the core user interface found in every game (such as the game menu, the playerlist, the backpack, etc.). It can also be used by [Plugins](https://developer.roblox.com/en-us/api-reference/class/Plugin) in Roblox Studio.
 *
 * You can use the [StarterGui:SetCoreGuiEnabled](https://developer.roblox.com/en-us/api-reference/function/StarterGui/SetCoreGuiEnabled) and [StarterGui:GetCoreGuiEnabled](https://developer.roblox.com/en-us/api-reference/function/StarterGui/GetCoreGuiEnabled) methods in a [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript) to enable and disable most elements of the CoreGui. You can also use [PlayerGui:SetTopbarTransparency](https://developer.roblox.com/en-us/api-reference/function/PlayerGui/SetTopbarTransparency) to set the transparency of the top bar.
 */
interface CoreGui extends BasePlayerGui {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_CoreGui: unique symbol;
	/**
	 * The current version of the CoreGui. Everytime the CoreGui is majorly changed, this number is increased.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly Version: number;
}

interface StarterGui extends BasePlayerGui {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_StarterGui: unique symbol;
	/**
	 * Allows the StarterGui service to process input like [PlayerGui](https://developer.roblox.com/en-us/api-reference/class/PlayerGui) and [CoreGui](https://developer.roblox.com/en-us/api-reference/class/CoreGui) do. The default value is false.
	 * Tags: Hidden, NotReplicated
	 */
	ProcessUserInput: boolean;
	/**
	 * This property determines whether the contents of [StarterGui](https://developer.roblox.com/en-us/api-reference/class/StarterGui) is visible in studio
	 */
	ShowDevelopmentGui: boolean;
}

/** The ChangeHistoryService provides a way for plugins to undo and redo changes and to create waypoints when changes are made to the place. */
interface ChangeHistoryService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_ChangeHistoryService: unique symbol;
	/**
	 * Returns whether there are actions that can be redone, and, if there are, returns the last of them.
	 */
	GetCanRedo(this: ChangeHistoryService): unknown;
	/**
	 * Returns whether there are actions that can be undone, and, if there are, returns the last of them.
	 */
	GetCanUndo(this: ChangeHistoryService): unknown;
	/**
	 * Executes the last action that was undone.
	 */
	Redo(this: ChangeHistoryService): void;
	/**
	 * Clears the history, causing all undo/redo waypoints to be removed.
	 */
	ResetWaypoints(this: ChangeHistoryService): void;
	/**
	 * Sets whether or not the ChangeHistoryService is enabled. When set to false, the undo/redo list is cleared, and does not repopulate. When set to true again, the original list is not restored, but further operations append to the list once more
	 */
	SetEnabled(this: ChangeHistoryService, state: boolean): void;
	/**
	 * Sets a new waypoint which can be used as an undo or redo point.
	 */
	SetWaypoint(this: ChangeHistoryService, name: string): void;
	/**
	 * Undos the last action taken, for which there exists a waypoint.
	 */
	Undo(this: ChangeHistoryService): void;
	/**
	 * Fired when the user reverses the undo command. Waypoint describes the type action that has been redone.
	 */
	readonly OnRedo: RBXScriptSignal<(waypoint: string) => void>;
	/**
	 * Fired when the user undoes an action in studio. Waypoint describes the type action that has been undone.
	 */
	readonly OnUndo: RBXScriptSignal<(waypoint: string) => void>;
}

interface DataModelSession extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_DataModelSession: unique symbol;
}

/** The DebugSettings allows you to view diagnostics information regarding Roblox. It is labeled as **Diagnostics** in the Roblox Studio Settings menu. */
interface DebugSettings extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_DebugSettings: unique symbol;
	/**
	 * Describes whether a [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel) is actively in memory, as an integer (where 1 = true, and 0 = false).
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly DataModel: number;
	/**
	 * The number of instances active in the simulation.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly InstanceCount: number;
	/**
	 * Whether or not a stacktrace is displayed in the output for an error.
	 */
	IsScriptStackTracingEnabled: boolean;
	/**
	 * Returns the number of internal DataModel jobs actively being processed.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly JobCount: number;
	/**
	 * The number of players currently in the active game-instance.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly PlayerCount: number;
	/**
	 * Whether or not sound warnings should be reported.
	 */
	ReportSoundWarnings: boolean;
	/**
	 * The current client version of Roblox. Can also be retrieved by using the version() function.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly RobloxVersion: string;
	/**
	 * Sets the internal sampling method used to measure elapsed time with consistency across platforms.
	 */
	TickCountPreciseOverride: Enum.TickCountSampleMethod;
}

/** Represents a breakpoint in Roblox's Lua Debugger.
 * This object cannot be created, but it can be retrieved from the [ScriptDebugger](https://developer.roblox.com/en-us/api-reference/class/ScriptDebugger) class.
 */
interface DebuggerBreakpoint extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_DebuggerBreakpoint: unique symbol;
	/**
	 * The condition of the debugger breakpoint.
	 */
	Condition: string;
	/**
	 * This field controls whether debugger will stop on the breakpoint or not.
	 * It is used together with the [DebuggerBreakpoint.LogExpression](https://developer.roblox.com/en-us/api-reference/property/DebuggerBreakpoint/LogExpression) to log a message when breakpoint is hit, without pausing into the debugger to act as a 'logpoint' instead of a 'breakpoint'.
	 */
	ContinueExecution: boolean;
	/**
	 * Whether or not the breakpoint is enabled.
	 */
	IsEnabled: boolean;
	/**
	 * The line that the breakpoint has been placed on.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly Line: number;
	/**
	 * An expression which is evaluated when the breakpoint is hit with the result being logged into the Output window.
	 * Used together with [DebuggerBreakpoint.ContinueExecution](https://developer.roblox.com/en-us/api-reference/property/DebuggerBreakpoint/ContinueExecution) to implement a 'logpoint' instead of a 'breakpoint'.
	 */
	LogExpression: string;
	/**
	 * Whether the breakpoint is unique for a single script instance or not.
	 * When set, the breakpoint will not be duplicated into all the clones of the current script.
	 */
	isContextDependentBreakpoint: boolean;
}

/** The DebuggerManager is a special singleton class responsible for managing Roblox's Lua Debugger feature.
 * It can be retrieved via the `DebuggerManager()` function, but only from the command bar.
 */
interface DebuggerManager extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_DebuggerManager: unique symbol;
	/**
	 * Whether the debugger is enabled or disabled.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly DebuggingEnabled: boolean;
	/**
	 * Registers a script to be used in the Lua Debugger. Returns a [ScriptDebugger](https://developer.roblox.com/en-us/api-reference/class/ScriptDebugger) for the script.
	 */
	AddDebugger(this: DebuggerManager, script: LuaSourceContainer): Instance | undefined;
	/**
	 * Returns a list of [ScriptDebugger](https://developer.roblox.com/en-us/api-reference/class/ScriptDebugger) present in the experience.
	 */
	GetDebuggers(this: DebuggerManager): Array<Instance>;
	/**
	 * Resumes the Lua Debugger if it is paused.
	 */
	Resume(this: DebuggerManager): void;
	/**
	 * Performs a [step into](https://developer.roblox.com/articles/Lua-debugger "Lua Debugger") operation on the Lua Debugger.
	 * Tags: Deprecated
	 * @deprecated
	 */
	StepIn(this: DebuggerManager): void;
	/**
	 * Performs a [step out](https://developer.roblox.com/articles/Lua-debugger "Lua Debugger") operation on the Lua Debugger.
	 * Tags: Deprecated
	 * @deprecated
	 */
	StepOut(this: DebuggerManager): void;
	/**
	 * Performs a [step over](https://developer.roblox.com/articles/Lua-debugger "Lua Debugger") operation on the Lua Debugger.
	 * Tags: Deprecated
	 * @deprecated
	 */
	StepOver(this: DebuggerManager): void;
	/**
	 * Fires when a new [ScriptDebugger](https://developer.roblox.com/en-us/api-reference/class/ScriptDebugger) is created through the [DebuggerManager:AddDebugger](https://developer.roblox.com/en-us/api-reference/function/DebuggerManager/AddDebugger) method.
	 */
	readonly DebuggerAdded: RBXScriptSignal<(debug: Instance) => void>;
	/**
	 * Fires when a registered [ScriptDebugger](https://developer.roblox.com/en-us/api-reference/class/ScriptDebugger) has been discontinued.
	 */
	readonly DebuggerRemoved: RBXScriptSignal<(debug: Instance) => void>;
}

/** Represents a watch in Roblox's Lua Debugger.
 * This object cannot be created, but it can be retrieved from the [ScriptDebugger](https://developer.roblox.com/en-us/api-reference/class/ScriptDebugger) class.
 */
interface DebuggerWatch extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_DebuggerWatch: unique symbol;
	/**
	 * The expression set for the DebuggerWatch.
	 */
	Expression: string;
}

interface FaceControls extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_FaceControls: unique symbol;
	/**
	 * Raises the chin up; moves the lower lip upwards
	 * Tags: NotReplicated
	 */
	ChinRaiser: number;
	/**
	 * Moves the upper lip when ChinRaiser is engaged and touching the upper lip
	 * Tags: NotReplicated
	 */
	ChinRaiserUpperLip: number;
	/**
	 * Brings the left and right brows inward together
	 * Tags: NotReplicated
	 */
	Corrugator: number;
	/**
	 * Moves gaze down
	 * Tags: NotReplicated
	 */
	EyesLookDown: number;
	/**
	 * Moves gaze left
	 * Tags: NotReplicated
	 */
	EyesLookLeft: number;
	/**
	 * Moves gaze right
	 * Tags: NotReplicated
	 */
	EyesLookRight: number;
	/**
	 * Moves gaze up
	 * Tags: NotReplicated
	 */
	EyesLookUp: number;
	/**
	 * Also known as lip tightener; brings the corners of the mouth inward and pressing the lips back against the teeth
	 * Tags: NotReplicated
	 */
	FlatPucker: number;
	/**
	 * Makes a 'O' shape with the mouth
	 * Tags: NotReplicated
	 */
	Funneler: number;
	/**
	 * Lowers the jaw downward opening the mouth
	 * Tags: NotReplicated
	 */
	JawDrop: number;
	/**
	 * Tags: NotReplicated
	 */
	JawLeft: number;
	/**
	 * Moves mouth and jaw to the right (character right)
	 * Tags: NotReplicated
	 */
	JawRight: number;
	/**
	 * Lowers the left brow down
	 * Tags: NotReplicated
	 */
	LeftBrowLowerer: number;
	/**
	 * Puffs up the left cheek
	 * Tags: NotReplicated
	 */
	LeftCheekPuff: number;
	/**
	 * Squints the left eye
	 * Tags: NotReplicated
	 */
	LeftCheekRaiser: number;
	/**
	 * Moves the corners of the mouth back in Z
	 * Tags: NotReplicated
	 */
	LeftDimpler: number;
	/**
	 * Closes the left eyelid
	 * Tags: NotReplicated
	 */
	LeftEyeClosed: number;
	/**
	 * Raises the left eyelid upwards to reveal more of the eye white above the iris
	 * Tags: NotReplicated
	 */
	LeftEyeUpperLidRaiser: number;
	/**
	 * Raises the interior half of the left brow upwards
	 * Tags: NotReplicated
	 */
	LeftInnerBrowRaiser: number;
	/**
	 * Lowers the corners of the mouth downwards in a frown
	 * Tags: NotReplicated
	 */
	LeftLipCornerDown: number;
	/**
	 * Raises the corners of the mouth upwards in a smile
	 * Tags: NotReplicated
	 */
	LeftLipCornerPuller: number;
	/**
	 * Stretches the corners of the mouth apart
	 * Tags: NotReplicated
	 */
	LeftLipStretcher: number;
	/**
	 * Lowers the lower lip down away from the upper lip revealing the lower teeth
	 * Tags: NotReplicated
	 */
	LeftLowerLipDepressor: number;
	/**
	 * Raise the left nostril, pulls the brow down slightly, and wrinkles on the side of the nose
	 * Tags: NotReplicated
	 */
	LeftNoseWrinkler: number;
	/**
	 * Raises the outer part of the left brow upwards
	 * Tags: NotReplicated
	 */
	LeftOuterBrowRaiser: number;
	/**
	 * Raises the left upper lip away from the lower lip revealing the upper teeth
	 * Tags: NotReplicated
	 */
	LeftUpperLipRaiser: number;
	/**
	 * Presses the lips together
	 * Tags: NotReplicated
	 */
	LipPresser: number;
	/**
	 * Brings the lips together relative to JawDrop
	 * Tags: NotReplicated
	 */
	LipsTogether: number;
	/**
	 * Rolls the lower lip up over the teeth
	 * Tags: NotReplicated
	 */
	LowerLipSuck: number;
	/**
	 * Moves the mouth left
	 * Tags: NotReplicated
	 */
	MouthLeft: number;
	/**
	 * Moves the mouth right
	 * Tags: NotReplicated
	 */
	MouthRight: number;
	/**
	 * Makes a kiss-like shape with the mouth
	 * Tags: NotReplicated
	 */
	Pucker: number;
	/**
	 * Lowers the right brow down
	 * Tags: NotReplicated
	 */
	RightBrowLowerer: number;
	/**
	 * Puffs up the right cheek
	 * Tags: NotReplicated
	 */
	RightCheekPuff: number;
	/**
	 * Squints the right eye
	 * Tags: NotReplicated
	 */
	RightCheekRaiser: number;
	/**
	 * Moves the corners of the mouth back in Z
	 * Tags: NotReplicated
	 */
	RightDimpler: number;
	/**
	 * Closes the right eyelid
	 * Tags: NotReplicated
	 */
	RightEyeClosed: number;
	/**
	 * Raises the right eyelid upwards to reveal more of the eye white above the iris
	 * Tags: NotReplicated
	 */
	RightEyeUpperLidRaiser: number;
	/**
	 * Raises the interior half of the right brow upwards
	 * Tags: NotReplicated
	 */
	RightInnerBrowRaiser: number;
	/**
	 * Lowers the corners of the mouth downwards in a frown
	 * Tags: NotReplicated
	 */
	RightLipCornerDown: number;
	/**
	 * Raises the corners of the mouth upwards in a smile
	 * Tags: NotReplicated
	 */
	RightLipCornerPuller: number;
	/**
	 * Stretches the corners of the mouth apart
	 * Tags: NotReplicated
	 */
	RightLipStretcher: number;
	/**
	 * Lowers the lower lip down away from the upper lip revealing the lower teeth
	 * Tags: NotReplicated
	 */
	RightLowerLipDepressor: number;
	/**
	 * Raises the right nostril, pulls the brow down slightly, and wrinkles on the side of the nose
	 * Tags: NotReplicated
	 */
	RightNoseWrinkler: number;
	/**
	 * Raises the outer part of the right brow upwards
	 * Tags: NotReplicated
	 */
	RightOuterBrowRaiser: number;
	/**
	 * Raises the right upper lip away from the lower lip revealing the upper teeth
	 * Tags: NotReplicated
	 */
	RightUpperLipRaiser: number;
	/**
	 * Bends the tongue down
	 * Tags: NotReplicated
	 */
	TongueDown: number;
	/**
	 * Extends the tip of the tongue out of the mouth
	 * Tags: NotReplicated
	 */
	TongueOut: number;
	/**
	 * Bends the tongue up
	 * Tags: NotReplicated
	 */
	TongueUp: number;
	/**
	 * Rolls the upper lip around the teeth
	 * Tags: NotReplicated
	 */
	UpperLipSuck: number;
}

/** An object that represents an Asset loaded from a file on a local disk.
 *
 * Files generate a temporary asset id in the form _“rbxtemp://####”_, which can be used in Studio without uploading the asset, but will be destroyed when the File is destroyed or when the Studio session ends. Temporary asset ids are not shared across [Team Create](https://developer.roblox.com/en-us/articles/Team-Create).
 *
 * The default [Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name) of a File instance will be the filename on disk, excluding path, including extension.
 */
interface File extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_File: unique symbol;
	/**
	 * The file size (in bytes) of the local file associated with this [File](https://developer.roblox.com/en-us/api-reference/class/File).
	 * Tags: Hidden, ReadOnly, NotReplicated
	 */
	readonly Size: number;
	/**
	 * This function is used to read the contents of the [File](https://developer.roblox.com/en-us/api-reference/class/File) as a raw binary string. This allows the file to be uploaded to web endpoints, or to be processed by plugins.
	 */
	GetBinaryContents(this: File): string;
	/**
	 * This function is used to retrieve a temporary asset id associated with this [File](https://developer.roblox.com/en-us/api-reference/class/File). This id can be used like an _rbxassetid_ - for example, it can be assigned to the Image property of an [ImageLabel](https://developer.roblox.com/en-us/api-reference/class/ImageLabel).
	 *
	 * Throws an error if the file does not exist on disk.
	 */
	GetTemporaryId(this: File): string;
}

/** Various miscellaneous options for in-game. Can be accessed from Roblox Studio's settings menu under the _Game_ tab. */
interface GameSettings extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_GameSettings: unique symbol;
	/**
	 * Toggles whether or not video capture is enabled.
	 */
	VideoCaptureEnabled: boolean;
}

/** PluginGui is an abstract class for GUIs that allow the display of [GuiObjects](https://developer.roblox.com/en-us/api-reference/class/GuiObject) in various Roblox Studio widgets. As of right now, the only available PluginGui type is [DockWidgetPluginGui](https://developer.roblox.com/en-us/api-reference/class/DockWidgetPluginGui), but there may be more in the future! */
interface PluginGui extends LayerCollector {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginGui: unique symbol;
	/**
	 * The title that is displayed above the contents of the [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui). Defaults to empty string.
	 */
	Title: string;
	/**
	 * This function binds a function to the [PluginGui's](https://developer.roblox.com/en-us/api-reference/class/PluginGui) close button, overriding the default behavior.
	 *
	 * By default, when the user clicks the 'x' button in the top right corner of the [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) the [Enabled](https://developer.roblox.com/en-us/api-reference/property/LayerCollector/Enabled) property is set to _false_, closing the window. When a custom function is bound using BindToClose this behavior is overwritten, allowing you to check if the user really wants to close the window or give them an opportunity to save their work.
	 *
	 * As the default closing behavior is overwritten by this function, you'll need to configure the [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) to close manually by setting [PluginGui.Enabled](https://developer.roblox.com/en-us/api-reference/property/LayerCollector/Enabled) to _false_. For example, in the below snippet users are required to click a confirm button to close the GUI:
	 *
	 * local closing = false
	 * pluginGui:BindToClose(function()
	 * 	-- make sure we haven't already made a button
	 * 	if closing then
	 * 		return
	 * 	end
	 * 	closing = true
	 *
	 * 	-- create confirm button
	 * 	local confirmButton = Instance.new("TextButton")
	 * 	confirmButton.AnchorPoint = Vector2.new(0.5, 0.5)
	 * 	confirmButton.Size = UDim2.new(0.5, 0, 0.5, 0)
	 * 	confirmButton.Position = UDim2.new(0.5, 0, 0.5, 0)
	 * 	confirmButton.BackgroundColor3 = Color3.new(1, 0, 0)
	 * 	confirmButton.Text = "Close?"
	 * 	confirmButton.Parent = pluginGui
	 *
	 * 	-- listen for click
	 * 	confirmButton.Activated:Connect(function()
	 * 		-- close the gui
	 * 		pluginGui.Enabled = false
	 *
	 * 		-- remove confirm button
	 * 		confirmButton:Destroy()
	 * 	end)
	 * end)
	 *
	 * You can call BindToClose with no argument to 'unbind' and revert to the default behavior described above. For example:
	 *
	 * pluginGui:BindToClose()
	 *
	 * See also
	 * --------
	 *
	 * *   [Plugin:CreateDockWidgetPluginGui](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreateDockWidgetPluginGui) to create a [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui)
	 * *   [DataModel:BindToClose](https://developer.roblox.com/en-us/api-reference/function/DataModel/BindToClose), which can be used to bind a function to the game ending and should not be confused with this function
	 */
	BindToClose(this: PluginGui, callback?: Callback): void;
	/**
	 * GetRelativeMousePosition returns the position of the mouse relative to the top-left corner of the [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui). The returned value changes only if a mouse input began on the PluginGui, or if the mouse is presently hovering over the window.
	 *
	 * ![An animation of the return value of Plugin:GetRelativeMousePosition](https://developer.roblox.com/assets/blt2bbcc6b4d96ba800/PluginGui.GetRelativeMousePosition.gif)
	 *
	 * The animation above displays the value returned by this function (the left mouse button is pressed in the animation). Notice how the X-value is negative when the mouse is on the left of the window.
	 */
	GetRelativeMousePosition(this: PluginGui): Vector2;
	/**
	 * **PluginDragDropped** fires when the user releases their mouse over a [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) during a drag operation started by [Plugin:StartDrag](https://developer.roblox.com/en-us/api-reference/function/Plugin/StartDrag).
	 *
	 * See also
	 * --------
	 *
	 * *   [PluginGui.PluginDragEntered](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragEntered)
	 * *   [PluginGui.PluginDragLeft](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragLeft)
	 * *   [PluginGui.PluginDragMoved](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragMoved)
	 */
	readonly PluginDragDropped: RBXScriptSignal<(dragData: object) => void>;
	/**
	 * **PluginDragEntered** fires when the user's mouse enters the [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) during a drag operation started by [Plugin:StartDrag](https://developer.roblox.com/en-us/api-reference/function/Plugin/StartDrag).
	 *
	 * This event is useful for displaying a “Drop Here” UI on PluginGuis where a drag operation can be dropped. Such a UI should be hidden when either [PluginDragLeft](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragLeft) or [PluginDragDropped](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragDropped) fire.
	 *
	 * See Also
	 * --------
	 *
	 * *   [Drag and Drop in Studio Widgets](https://developer.roblox.com/en-us/articles/drag-and-drop-in-studio-widgets)
	 * *   [PluginGui.PluginDragLeft](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragLeft)
	 * *   [PluginGui.PluginDragMoved](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragMoved)
	 * *   [PluginGui.PluginDragDropped](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragDropped)
	 */
	readonly PluginDragEntered: RBXScriptSignal<(dragData: object) => void>;
	/**
	 * **PluginDragLeft** fires when the user's mouse leaves a [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) during a drag operation started by [Plugin:StartDrag](https://developer.roblox.com/en-us/api-reference/function/Plugin/StartDrag).
	 *
	 * This event and [PluginDragDropped](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragDropped) are useful for hiding a “Drop Here” UI on PluginGuis where a drag operation can be dropped. Such a UI should be shown when either [PluginDragEntered](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragEntered) fires.
	 *
	 * See Also
	 * --------
	 *
	 * *   [Drag and Drop in Studio Widgets](https://developer.roblox.com/en-us/articles/drag-and-drop-in-studio-widgets)
	 * *   [PluginGui.PluginDragEntered](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragEntered)
	 * *   [PluginGui.PluginDragMoved](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragMoved)
	 * *   [PluginGui.PluginDragDropped](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragDropped)
	 */
	readonly PluginDragLeft: RBXScriptSignal<(dragData: object) => void>;
	/**
	 * **PluginDragMoved** fires when the user's mouse moves within a [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) during a drag operation started by [Plugin:StartDrag](https://developer.roblox.com/en-us/api-reference/function/Plugin/StartDrag).
	 *
	 * See also
	 * --------
	 *
	 * *   [PluginGui.PluginDragEntered](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragEntered)
	 * *   [PluginGui.PluginDragLeft](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragLeft)
	 * *   [PluginGui.PluginDragDropped](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragDropped)
	 */
	readonly PluginDragMoved: RBXScriptSignal<(dragData: object) => void>;
	/**
	 * **WindowFocusReleased** fires immediately when the user stops interacting with the PluginGui's window, usually by clicking on on something not in the window. This functions works similarly to the similarly-named [UserInputService.WindowFocusReleased](https://developer.roblox.com/en-us/api-reference/event/UserInputService/WindowFocusReleased) event.
	 *
	 * If focus is moving to another [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) while the user had this PluginGui in focus, then this event fires before the other's [WindowFocused](https://developer.roblox.com/en-us/api-reference/event/PluginGui/WindowFocused) event. However, if the main game window is being put in focus, this event fires **after** [UserInputService.WindowFocused](https://developer.roblox.com/en-us/api-reference/event/UserInputService/WindowFocused).
	 */
	readonly WindowFocusReleased: RBXScriptSignal<() => void>;
	/**
	 * **WindowFocused** fires immediately when the user starts interacting with the PluginGui's window, usually by clicking on it. This functions works similarly to the similarly-named [UserInputService.WindowFocused](https://developer.roblox.com/en-us/api-reference/event/UserInputService/WindowFocused) event. It fires before any [GuiObject.InputBegan](https://developer.roblox.com/en-us/api-reference/event/GuiObject/InputBegan) events related to mouse buttons.
	 *
	 * If another [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) is in focus and the user focuses this PluginGui, then this event fires after the other's [WindowFocusReleased](https://developer.roblox.com/en-us/api-reference/event/PluginGui/WindowFocusReleased) event. However, if the main game window was in focus, this event fires **after** [UserInputService.WindowFocusReleased](https://developer.roblox.com/en-us/api-reference/event/UserInputService/WindowFocusReleased).
	 */
	readonly WindowFocused: RBXScriptSignal<() => void>;
}

/** **DockWidgetPluginGui** is a [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) that displays its contents inside a dockable Roblox Studio window. It is used to create widgets similar to the built-in **Animation Editor** and **Terrain Tools**.
 *
 * This GUI can be created using [Plugin:CreateDockWidgetPluginGui()](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreateDockWidgetPluginGui).
 *
 * See the [Building Studio Widgets](https://developer.roblox.com/en-us/articles/building-studio-widgets) tutorial for details on working with custom Studio widgets.
 */
interface DockWidgetPluginGui extends PluginGui {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_DockWidgetPluginGui: unique symbol;
}

interface QWidgetPluginGui extends PluginGui {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_QWidgetPluginGui: unique symbol;
}

interface InsertService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_InsertService: unique symbol;
	/**
	 * Tags: Yields
	 */
	CreateMeshPartAsync(
		this: InsertService,
		meshId: string,
		collisionFidelity: CastsToEnum<Enum.CollisionFidelity>,
		renderFidelity: CastsToEnum<Enum.RenderFidelity>,
	): MeshPart;
}

interface KeyframeSequenceProvider extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_KeyframeSequenceProvider: unique symbol;
	/**
	 * Returns a [KeyframeSequence](https://developer.roblox.com/en-us/api-reference/class/KeyframeSequence) from a given asset URL.
	 * Tags: Deprecated, [object Object]
	 * @deprecated
	 */
	GetKeyframeSequence(this: KeyframeSequenceProvider, assetId: string): Instance | undefined;
	/**
	 * Returns a [KeyframeSequence](https://developer.roblox.com/en-us/api-reference/class/KeyframeSequence) from the supplied assetId. Can optionally cache to reduce unnecessary loading freezes.
	 * Tags: Deprecated, [object Object]
	 * @deprecated
	 */
	GetKeyframeSequenceById(this: KeyframeSequenceProvider, assetId: number, useCache: boolean): Instance | undefined;
}

/** The LuaSettings allows you to change certain properties, in regards to how Roblox handles Lua.
 * It is labeled as **Lua** in the Roblox Studio Settings menu.
 */
interface LuaSettings extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_LuaSettings: unique symbol;
}

interface LuaSourceContainer extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_LuaSourceContainer: unique symbol;
	/**
	 * Tags: NotReplicated
	 */
	RuntimeSource: string;
}

interface Script extends BaseScript {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Script: unique symbol;
	/**
	 * A script's Source is the code to be executed. Modifying the code within a script modifies the source code executes when the script runs.
	 *
	 * For instance, given a script containing the line:
	 *
	 * print("Hello world!")
	 *
	 * The script's source is the “print(“Hello world”)” command because it is what will be executed when the script runs, leading to “Hello world” being printed in the command line.
	 *
	 * This item is protected. Attempting to use it in a [Script](https://developer.roblox.com/en-us/api-reference/class/Script) or [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript) will cause an error.
	 */
	Source: string;
}

interface ModuleScript extends LuaSourceContainer {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_ModuleScript: unique symbol;
	/**
	 * The code to be executed.
	 */
	Source: string;
}

interface MaterialVariant extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_MaterialVariant: unique symbol;
	BaseMaterial: Enum.Material;
	ColorMap: string;
	MetalnessMap: string;
	NormalMap: string;
	RoughnessMap: string;
}

interface MemStorageConnection extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_MemStorageConnection: unique symbol;
	Disconnect(this: MemStorageConnection): void;
}

/** The PluginMouse object gives [Plugin](https://developer.roblox.com/en-us/api-reference/class/Plugin)s access to the mouse. It works like the [Mouse](https://developer.roblox.com/en-us/api-reference/class/Mouse) object and can be obtained using the plugin [Plugin:GetMouse](https://developer.roblox.com/en-us/api-reference/function/Plugin/GetMouse) method.
 *
 * Note the PluginMouse can only be used when the plugin has been activated using [Plugin:Activate](https://developer.roblox.com/en-us/api-reference/function/Plugin/Activate).
 *
 * In addition to the functions from the [Mouse](https://developer.roblox.com/en-us/api-reference/class/Mouse) object, the PluginMouse includes the [PluginMouse.DragEnter](https://developer.roblox.com/en-us/api-reference/event/PluginMouse/DragEnter) function which keeps track of items being selected whilst the mouse is dragging.
 *
 * For more information on how to use mouse objects, see the [Mouse](https://developer.roblox.com/en-us/api-reference/class/Mouse) page.
 */
interface PluginMouse extends Mouse {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginMouse: unique symbol;
	/**
	 * Fired when Instances are being selected while the mouse is dragging.
	 */
	readonly DragEnter: RBXScriptSignal<(instances: Array<Instance>) => void>;
}

interface MultipleDocumentInterfaceInstance extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_MultipleDocumentInterfaceInstance: unique symbol;
}

/** The NetworkPeer object is the most basic class of the network objects. */
interface NetworkPeer extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_NetworkPeer: unique symbol;
	/**
	 * Sets the maximum outgoing bandwidth that Roblox can use.
	 */
	SetOutgoingKBPSLimit(this: NetworkPeer, limit: number): void;
}

/** This service is responsible for connecting a client to a server. */
interface NetworkClient extends NetworkPeer {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_NetworkClient: unique symbol;
	readonly ConnectionAccepted: RBXScriptSignal<(peer: string, replicator: ClientReplicator) => void>;
}

/** The NetworkServer stores all the [NetworkReplicator](https://developer.roblox.com/en-us/api-reference/class/NetworkReplicator) in the game and handles all connections. [NetworkPeer:SetOutgoingKBPSLimit](https://developer.roblox.com/en-us/api-reference/function/NetworkPeer/SetOutgoingKBPSLimit) can be used to imitate latency while using _Start Server_. */
interface NetworkServer extends NetworkPeer {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_NetworkServer: unique symbol;
}

/** An object which handles the replication of other objects either from the server to the client, or from the client to the server. */
interface NetworkReplicator extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_NetworkReplicator: unique symbol;
	/**
	 * Returns the player that is connected to the NetworkReplicator.
	 */
	GetPlayer(this: NetworkReplicator): Player;
}

/** The ClientReplicator is in charge of replicating changes from the server over to the client. It represents the client's connection to a server. */
interface ClientReplicator extends NetworkReplicator {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_ClientReplicator: unique symbol;
}

/** The ServerReplicator's job is to replicate changes from other clients and the server over to a certain client. */
interface ServerReplicator extends NetworkReplicator {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_ServerReplicator: unique symbol;
}

/** NetworkSettings is a settings class that allow you to debug a lot of features with Roblox's server/client networking.
 *
 * It can be found in Roblox Studio's settings, under the **Network** tab.
 */
interface NetworkSettings extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_NetworkSettings: unique symbol;
	/**
	 * Tags: Hidden, NotReplicated
	 */
	EmulatedTotalMemoryInMB: number;
	/**
	 * FreeMemoryMBytes is a read-only property that describes how much free memory is available, in MBs.
	 * It is stored as a floating point number, so it can be be read down at the level of available bytes by multiplying its value by `1024 * 1024`.
	 * Tags: Hidden, ReadOnly, NotReplicated
	 */
	readonly FreeMemoryMBytes: number;
	readonly HttpProxyEnabled: boolean;
	readonly HttpProxyURL: string;
	/**
	 * Instruct the engine to simulate additional lag by delaying all incoming messages. Units are seconds.
	 */
	IncomingReplicationLag: number;
	/**
	 * Print diagnostic information to the Output window after connecting. The data will indicate the largest individual Instances sent, as well as aggregate data about data sent by Instance type. The data sent for initial loading is compressed so the contributions are approximate.
	 */
	PrintJoinSizeBreakdown: boolean;
	/**
	 * When set to true, debug messages will be printed into the output, pertaining to physics replication errors. Note that this property is intended for Roblox engineers who are debugging network replication. The following are debug outputs that are made available when this property is set to true.
	 *
	 * *   `Physics-in old packet` prints if the PhysicsReceiver receives a mechanism update packet for a part that has been updated ahead of the packet's submission time. This happens if the packet is received late, and a newer packet has already been processed.
	 * *   `Physics-in of unidentified {GUID}` prints if the PhysicsReceiver cannot find the part that is trying to be updated because the provided Instance identifier was invalid, where `{GUID}` is the unknown [Instance:GetDebugId](https://developer.roblox.com/en-us/api-reference/function/Instance/GetDebugId) identifier that is supposed to be targeting the part. This typically happens if a part is removed before the physics update packet is received.
	 * *   `Physics-in of part not in workspace {GUID}` prints if the PhysicsReceiver receives a request to update the physics of a part that is not a descendant of the Workspace, where `{GUID}` is the [Instance:GetDebugId](https://developer.roblox.com/en-us/api-reference/function/Instance/GetDebugId) identifier of the target part. This happens if the part was just moved out of the Workspace, and was previously being simulated.
	 */
	PrintPhysicsErrors: boolean;
	/**
	 * When set to true, debug information is printed to the output regarding the replication of instances when [Workspace.StreamingEnabled](https://developer.roblox.com/en-us/api-reference/property/Workspace/StreamingEnabled) is set to true. There are several debug outputs that are made available when this property is set to true, as listed below.
	 *
	 * Note that this property is intended for Roblox engineers who are debugging network replication. This documentation may become outdated in the future, as Roblox's network code is always changing behind the scenes.
	 *
	 * * * *
	 *
	 * Streaming Capacity Update
	 * -------------------------
	 *
	 * When the client's streaming capacity is updated, the following debug message will be printed:
	 * `clientInstanceQuota {1}, packet in queue {2}, predictedTotalInstanceProcessTime {3}, avgStreamDataReadTime {4}, avgInstancesPerStreamData {5}`
	 *
	 * **The numbers in curly braces are substituted, and can be described as:**
	 * • `{1}` – The id of the client instance quota.
	 * • `{2}` – The current number of incoming packets that have been queued.
	 * • `{3}` – A prediction for how long it will take to update the quota.
	 * • `{4}` – The current average time it takes to read the stream data.
	 * • `{5}` – The average number of instances in the stream data.
	 *
	 * * * *
	 *
	 * Instance Quota Update
	 * ---------------------
	 *
	 * When the client receives an instance quota update, the following debug message will be printed:
	 * `Received new client instance quota: {1}, max region radius: {2}`
	 *
	 * **The numbers in curly braces are substituted, and can be described as:**
	 * • `{1}` – The id of the client instance quota.
	 * • `{2}` – The maximum radius of space around the client's [Player.ReplicationFocus](https://developer.roblox.com/en-us/api-reference/property/Player/ReplicationFocus) that can have physical instances streamed in.
	 *
	 * * * *
	 */
	PrintStreamInstanceQuota: boolean;
	/**
	 * Emulate the behavior of a server that has been online a long time by randomizing the order that instances initially arrive on clients. It is recommended to keep this setting enabled to help discover potential bugs while testing in Studio.
	 */
	RandomizeJoinInstanceOrder: boolean;
	/**
	 * ![RenderStreamedRegions in action!](https://developer.roblox.com/assets/blte3c189bb8bdbf8e3/ShowStreamedRegions.png)
	 *
	 * When set to true, regions of space that are being streamed to the client will be outlined in red.
	 * This will only be shown if [Workspace.StreamingEnabled](https://developer.roblox.com/en-us/api-reference/property/Workspace/StreamingEnabled) is set to true.
	 */
	RenderStreamedRegions: boolean;
	/**
	 * When set to true, a label will be shown above each [Player](https://developer.roblox.com/en-us/api-reference/class/Player)'s head, showing the current animation being played by the Player's [Humanoid](https://developer.roblox.com/en-us/api-reference/class/Humanoid), if any.
	 */
	ShowActiveAnimationAsset: boolean;
}

interface Terrain extends BasePart {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Terrain: unique symbol;
	/**
	 * Transforms the legacy terrain engine into the new terrain engine.
	 *
	 * All places now automatically use the new terrain engine, so this method is obsolete.
	 * Tags: Deprecated
	 * @deprecated
	 */
	ConvertToSmooth(this: Terrain): void;
}

interface Model extends PVInstance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Model: unique symbol;
	LevelOfDetail: Enum.ModelLevelOfDetail;
}

interface WorldRoot extends Model {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_WorldRoot: unique symbol;
	/**
	 * This function moves the specified part to the specified location via [inverse kinematics](https://en.wikipedia.org/wiki/Inverse_kinematics) rather than moving it there directly, to ensure any joints, [constraints](https://developer.roblox.com/en-us/api-reference/class/Constraint), or collisions that part is participating in remain physically satisfied. Currently this function is only available in Studio to [plugins](https://developer.roblox.com/en-us/api-reference/class/Plugin), as it currently conflicts with the physics of a running game.
	 *
	 * **Translate stiffness** is a number between 0 and 1 specifying how agressively to match the part's position to the position part of the target CFrame.
	 * **Rotate stiffness** is a number between 0 and 1 specifying how agresively to match the part's rotation to to the rotation part of the target CFrame.
	 * For example:
	 *
	 * *   If translate stiffness and rotate stiffness are both equal to 1, then the part will be moved exactly to the target CFrame regardless of what physical constraints there are on it.
	 * *   If translate stiffness and rotate stiffness are both equal to 0.5, then the part will try to move to exactly the target CFrame, but may be pushed out of the way by physical constraints on it.
	 * *   If translate stiffness and rotate stiffness are both equal to 0, then the target CFrame will be ignored and physical constraints will be solved for the object at the position where it was.
	 */
	IKMoveTo(
		this: WorldRoot,
		part: BasePart,
		target: CFrame,
		translateStiffness?: number,
		rotateStiffness?: number,
		collisionsMode?: CastsToEnum<Enum.IKCollisionsMode>,
	): void;
}

interface Workspace extends WorldRoot {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Workspace: unique symbol;
	/**
	 * Goes through all [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart)s given, breaking any joints connected to these parts.
	 *
	 * This function will break any of the following types of joints:
	 *
	 * *   [JointInstance](https://developer.roblox.com/en-us/api-reference/class/JointInstance)s such as `Connectors`, `Welds` and `Snaps`
	 * *   [WeldConstraint](https://developer.roblox.com/en-us/api-reference/class/WeldConstraint)s
	 *
	 * Unlike `Break/MakeJoints`, this function requires an array of [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart)s as a parameter. This array is given as follows:
	 *
	 * workspace:BreakJoints({part1, part2, part3})
	 *
	 * Note, this function cannot be used by scripts and will only function in plugins.
	 * Tags: Deprecated
	 * @deprecated
	 */
	readonly BreakJoints: never;
	/**
	 * **Deprecated**
	 *
	 * SurfaceType based joining is deprecated, do not use MakeJoints for new projects. [WeldConstraints](https://developer.roblox.com/en-us/api-reference/class/WeldConstraint) and [HingeConstraints](https://developer.roblox.com/en-us/api-reference/class/HingeConstraint) should be used instead
	 *
	 * Goes through all [Parts](https://developer.roblox.com/en-us/api-reference/class/BasePart) given. If any part's side has a [SurfaceType](https://developer.roblox.com/en-us/api-reference/enum/SurfaceType) that can make a joint it will create a joint with any adjacent parts.
	 *
	 * Joints will be created between the specified Parts and any planar touching surfaces, depending on the parts' surfaces.
	 *
	 * *   Smooth surfaces will not create joints
	 * *   Glue surfaces will create a [Glue](https://developer.roblox.com/en-us/api-reference/class/Glue) joint
	 * *   Weld will create a [Weld](https://developer.roblox.com/en-us/api-reference/class/Weld) joint with any surface except for Unjoinable
	 * *   Studs, Inlet, or Universal will each create a [Snap](https://developer.roblox.com/en-us/api-reference/class/Snap) joint with either of other the other two surfaces (e.g. Studs with Inlet and Universal)
	 * *   Hinge and Motor surfaces create [Rotate](https://developer.roblox.com/en-us/api-reference/class/Rotate) and [RotateV](https://developer.roblox.com/en-us/api-reference/class/RotateV) joint instances
	 *
	 * Unlike [Model:MakeJoints](https://developer.roblox.com/en-us/api-reference/function/Model/MakeJoints), this function requires an array of parts as a parameter. This array is given as follows:
	 *
	 * workspace:MakeJoints({part1, part2, part3})
	 *
	 * Joints are broken if enough force is applied to them due to an [Explosion](https://developer.roblox.com/en-us/api-reference/class/Explosion), unless a [ForceField](https://developer.roblox.com/en-us/api-reference/class/ForceField) object is parented to the [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) or ancestor [Model](https://developer.roblox.com/en-us/api-reference/class/Model). For this reason, they are often used to make simple destructible buildings and other models.
	 * Tags: Deprecated
	 * @deprecated
	 */
	readonly MakeJoints: never;
	/**
	 * Positions and zooms the [Workspace.CurrentCamera](https://developer.roblox.com/en-us/api-reference/property/Workspace/CurrentCamera) to show the extent of [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart)s currently in the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace).
	 *
	 * This function was used in the, now removed, 'Zoom To Extents' button in Roblox Studio. It exhibits similar behavior to the 'Zoom To' (F shortcut) feature, however it shows the extents of the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace) rather than the currently selected object.
	 *
	 * This function cannot be used in scripts but will function in the command bar or plugins.
	 */
	ZoomToExtents(this: Workspace): void;
}

interface PackageService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PackageService: unique symbol;
}

/** The PhysicsSettings is a singleton class, which lets developers view debugging features in Roblox's physics engine.
 * It can be found under the Physics tab in Roblox Studio's settings menu.
 */
interface PhysicsSettings extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PhysicsSettings: unique symbol;
	/**
	 * When set to true, physically simulated objects will stop being simulated if they have little to no motion for a set period of time.
	 */
	AllowSleep: boolean;
	/**
	 * When set to true, parts that are [BasePart.Anchored](https://developer.roblox.com/en-us/api-reference/property/BasePart/Anchored) will show a gray surface outline on the surface of the part's bounding box that is currently facing the ground.
	 */
	AreAnchorsShown: boolean;
	/**
	 * When set to true, each physics assembly is assigned a unique color and the [Part](https://developer.roblox.com/en-us/api-reference/class/Part) associated with the assembly are outlined with the color. Parts that are attached together by [JointInstance](https://developer.roblox.com/en-us/api-reference/class/JointInstance) will share the same color.
	 */
	AreAssembliesShown: boolean;
	/**
	 * When set to true, parts that are actively being physically simulated will have a red outline.
	 */
	AreAwakePartsHighlighted: boolean;
	/**
	 * When set to true, [Part](https://developer.roblox.com/en-us/api-reference/class/Part) will be outlined with a specific color, depending on the state of its root simulation body.
	 *
	 * Body Types
	 * ----------
	 *
	 * Color
	 *
	 * Body Type
	 *
	 * Description
	 *
	 * Real Time Body
	 *
	 * Physics Body that is always simulated in real time, and is never throttled. Used for Humanoids.
	 *
	 * Free Fall Body
	 *
	 * Physics Body that is freely moving with no physical contact.
	 *
	 * Joint Body
	 *
	 * Physics Body that is being influenced by a physically simulated joint, such as a Motor or a Hinge.
	 *
	 * Contact Body
	 *
	 * Physics Body that is in contact with another physics body.
	 *
	 * Symmetric Contact Body
	 *
	 * Physics Body that is experiencing a torquing force, while in contact with another body.
	 *
	 * Vertical Contact Body
	 *
	 * Physics Body that is moving very little along the Y plane, while in contact with another body.
	 */
	AreBodyTypesShown: boolean;
	/**
	 * When set to true, each contact island will render [SelectionBox](https://developer.roblox.com/en-us/api-reference/class/SelectionBox) adorns on the parts in contact islands, where each contact island is assigned a random color.
	 */
	AreContactIslandsShown: boolean;
	/**
	 * When set to true, sphere adorns will be drawn at the contact points of each part where physics interactions are occurring.
	 *
	 * Each sphere also has an arrow drawn in 3D, facing the surface that the contact point is detecting.
	 *
	 * Solver Variations
	 * -----------------
	 *
	 * The behavior of this property varies depending on whether Roblox's physics engine is using the _PGS Physics Solver_, or the _Spring Physics Solver_.
	 * This is controlled by the \`Workspace\`'s \`Workspace/PGSPhysicsSolverEnabled\` property.
	 *
	 * ### Spring Physics Solver
	 *
	 * When \`Workspace/PGSPhysicsSolverEnabled\` is set to false, the contact points are color coded as listed below.
	 * The length of the arrow extruding from the sphere depends on how much force the contact point is exerting, and what the contact type is.
	 *
	 * Color
	 *
	 * Contact Type
	 *
	 * Description
	 *
	 * Normal Contact
	 *
	 * Contact point with no special conditions.
	 *
	 * Resting Contact
	 *
	 * Contact point that has been active for at least 4 frames.
	 *
	 * Second Pass Contact
	 *
	 * Contact point that was made by a kernel joint going through a second pass. Rarely seen.
	 *
	 * Real Time Contact
	 *
	 * Contact point that was made with a real-time physics body. This applies to tripped \`Humanoid\`.
	 *
	 * Joint Contact
	 *
	 * Contact point that was made under the context of a physically simulated joint. This applies to Motors and Hinges.
	 *
	 * ### PGS Physics Solver
	 *
	 * When \`Workspace/PGSPhysicsSolverEnabled\` is set to true, the contact points are always colored **RED**, and the length of the arrow will always be 1 stud.
	 * There are no special conditions tracked, because the PGS solver does not keep specific lookup tables for the states listed in the Spring Solver.
	 *
	 * Color
	 *
	 * Contact Type
	 *
	 * Description
	 *
	 * Normal Contact
	 *
	 * Contact point with no special conditions.
	 */
	AreContactPointsShown: boolean;
	/**
	 * When set to true, XYZ axes are rendered at the [BasePart.CFrame](https://developer.roblox.com/en-us/api-reference/property/BasePart/CFrame) of every part.
	 */
	AreJointCoordinatesShown: boolean;
	/**
	 * When set to true, every individual mechanism of parts is given a unique color.
	 */
	AreMechanismsShown: boolean;
	/**
	 * An ancient property that hasn't work correctly since late 2007.
	 * It's supposed to render an XYZ axis on the root part of a [Model](https://developer.roblox.com/en-us/api-reference/class/Model), but the axis rendering component doesn't work correctly.
	 */
	AreModelCoordsShown: boolean;
	/**
	 * When set to true, each [Player](https://developer.roblox.com/en-us/api-reference/class/Player)'s character is outlined with a unique color, and each part that the player has network ownership over is outlined with the same color.
	 */
	AreOwnersShown: boolean;
	/**
	 * An ancient property that hasn't worked correctly since late 2007.
	 * It's supposed to render a large XYZ axis in the center of each [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart), but the axis rendering component doesn't work correctly.
	 */
	ArePartCoordsShown: boolean;
	/**
	 * When set to true, a cylinder is drawn around each [Player](https://developer.roblox.com/en-us/api-reference/class/Player)'s character, representing their [Player.SimulationRadius](https://developer.roblox.com/en-us/api-reference/property/Player/SimulationRadius).
	 *
	 * Each physically simulated object will check to see which player is closest to that object, and if they are within the player's simulation radius. If both conditions are met, that player will becomes the network owner of that object.
	 */
	AreRegionsShown: boolean;
	AreTerrainReplicationRegionsShown: boolean;
	/**
	 * When set to true, parts that aren't aligned on the 1x1x1 grid will be outlined yellow.
	 */
	AreUnalignedPartsShown: boolean;
	/**
	 * An ancient property that hasn't worked correctly since late 2007.
	 * It's supposed to render a large XYZ axis in the center of the world, but the axis rendering component doesn't work correctly.
	 */
	AreWorldCoordsShown: boolean;
	/**
	 * When set to true, Roblox will fall back to using its legacy CSG solver when performing [solid model operations](https://developer.roblox.com/articles/3D-Modeling-with-Parts "Solid modeling").
	 */
	DisableCSGv2: boolean;
	/**
	 * Tags: Hidden, NotReplicated
	 */
	ForceCSGv2: boolean;
	IsInterpolationThrottleShown: boolean;
	/**
	 * This property is supposed to show the [BasePart.ReceiveAge](https://developer.roblox.com/en-us/api-reference/property/BasePart/ReceiveAge) of a part, but it does not work correctly.
	 */
	IsReceiveAgeShown: boolean;
	/**
	 * When set to true, the joint connections of each part, and the states of their underlying primitive components are visualized as a spanning tree.
	 *
	 * Spanning Tree Table
	 * -------------------
	 *
	 * There are several visualizations made available when this property is set to true:
	 *
	 * Color
	 *
	 * Adorn Type
	 *
	 * Description
	 *
	 * Box
	 *
	 * Root Primitive of a Mechanism that is currently anchored, or connected to an anchored primitive. (See: \`BasePart/IsGrounded\`)
	 *
	 * Box
	 *
	 * Root Primitive of a Mechanism that is free to be physically simulated.
	 *
	 * Box
	 *
	 * Root Primitive of a Mechanism that has moving components.
	 *
	 * Sphere
	 *
	 * Root Primitive of an Assembly.
	 *
	 * Cylinder
	 *
	 * Root Primitive of a Clump.
	 *
	 * Line
	 *
	 * Connection between two Primitives that share the same Assembly and Clump.
	 *
	 * Line
	 *
	 * Connection between two Primitives that share the same Assembly.
	 *
	 * Line
	 *
	 * Connection between two Primitives.
	 */
	IsTreeShown: boolean;
	/**
	 * Controls the throttle rate of Roblox's physics engine.
	 *
	 * By default, the physics engine will adjust the physics environment throttle depending on how much work the physics engine is doing, and the current framerate. See the enum page for [EnviromentalPhysicsThrottle](https://developer.roblox.com/api-reference/enum/EnviromentalPhysicsThrottle "EnviromentalPhysicsThrottle") for more information.
	 */
	PhysicsEnvironmentalThrottle: Enum.EnviromentalPhysicsThrottle;
	/**
	 * When set to true, the underlying collision geometry for [PartOperation](https://developer.roblox.com/en-us/api-reference/class/PartOperation) and [MeshPart](https://developer.roblox.com/en-us/api-reference/class/MeshPart) is rendered.
	 */
	ShowDecompositionGeometry: boolean;
	/**
	 * If the [PhysicsSettings.PhysicsEnvironmentalThrottle](https://developer.roblox.com/en-us/api-reference/property/PhysicsSettings/PhysicsEnvironmentalThrottle) is set to _DefaultAuto_, this specifies the maximum time that the physics environmental throttle has to wait before it is allowed to automatically change.
	 */
	ThrottleAdjustTime: number;
	/**
	 * If set to true, version 2 of Roblox's CSG solver will be used instead of version 1.
	 */
	UseCSGv2: boolean;
}

interface Player extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Player: unique symbol;
	/**
	 * The SetAccountAge function sets the [Player.AccountAge](https://developer.roblox.com/en-us/api-reference/property/Player/AccountAge) of the player in days.
	 *
	 * It is used to set the [Player](https://developer.roblox.com/en-us/api-reference/class/Player) property that describes how long ago a player's account was registered in days.
	 *
	 * This does not set the age of the player on the account, but the age of the account itself relative to when it was first created.
	 */
	SetAccountAge(this: Player, accountAge: number): void;
	/**
	 * The SetSuperSafeChat [Player](https://developer.roblox.com/en-us/api-reference/class/Player) function sets whether or not the player sees chat filtered by [TextService](https://developer.roblox.com/en-us/api-reference/class/TextService)'s [TextService:FilterStringAsync](https://developer.roblox.com/en-us/api-reference/function/TextService/FilterStringAsync) rather than normal chats.
	 *
	 * SuperSafeChat is a chat mode where player's cannot see unfiltered messages.
	 *
	 * For example, entering the following command in the command prompt would enabled SuperSafeChat for the player named polarpanda16, as long as that player is in the game:
	 *
	 * ![Command prompt example enabling SuperSafeChat.](https://developer.roblox.com/assets/blte98afa1dbb206581/Screen_Shot_2018-07-28_at_9.46.09_PM.png)
	 *
	 * Note
	 * ----
	 *
	 * Regardless of whether a player has SuperSafeChat enabled, all chat should be filtered by TextService when broadcasted to other players or on the player's own screen. [TextService:FilterStringAsync](https://developer.roblox.com/en-us/api-reference/function/TextService/FilterStringAsync) returns a [TextFilterResult](https://developer.roblox.com/en-us/api-reference/class/TextFilterResult) object that can be filtered differently according to the message's intended use.
	 */
	SetSuperSafeChat(this: Player, value: boolean): void;
}

interface Players extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Players: unique symbol;
	/**
	 * This function makes the local player chat the given message. Since this item is protected, attempting to use it in a [Script](https://developer.roblox.com/en-us/api-reference/class/Script) or [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript) will cause an error.
	 *
	 * Instead, when creating a custom chat system, or a system that needs access to the chat, you can use the [Chat](https://developer.roblox.com/en-us/api-reference/class/Chat) service's [Chat:Chat](https://developer.roblox.com/en-us/api-reference/function/Chat/Chat) function instead.
	 *
	 * See also
	 * --------
	 *
	 * *   [Lua Chat System](https://developer.roblox.com/en-us/articles/lua-chat-system), a tutorial for creating a more advanced chat system
	 */
	Chat(this: Players, message: string): void;
	/**
	 * This function sets whether BubbleChat and ClassicChat are being used, and tells TeamChat and Chat what to do using the `ChatStyle` enum. Since this item is protected, attempting to use it in a [Script](https://developer.roblox.com/en-us/api-reference/class/Script) or [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript) will cause an error.
	 *
	 * This function is used internally when the chat mode is set by the game.
	 *
	 * If you would like to create a custom chat system where you can define custom functions such as these, take a look at the tutorial [here](https://developer.roblox.com/articles/Lua-Chat-System).
	 *
	 * See also
	 * --------
	 *
	 * Developers who are interested interested in configuring their games' bubble chat system even further should take a look at the [Bubble Chat](https://developer.roblox.com/en-us/articles/bubble-chat) article.
	 */
	SetChatStyle(this: Players, style?: CastsToEnum<Enum.ChatStyle>): void;
	/**
	 * This function makes the [Players.LocalPlayer](https://developer.roblox.com/en-us/api-reference/property/Players/LocalPlayer) chat the given message, which will only be viewable by users on the same team. Since this item is protected, attempting to use it in a [Script](https://developer.roblox.com/en-us/api-reference/class/Script) or [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript) will cause an error.
	 *
	 * This function is used internally when the [Players.LocalPlayer](https://developer.roblox.com/en-us/api-reference/property/Players/LocalPlayer) sends a message to their team.
	 *
	 * If you would like to create a custom chat system where you can define custom functions such as these, take a look at the tutorial [here](https://developer.roblox.com/articles/Lua-Chat-System).
	 */
	TeamChat(this: Players, message: string): void;
}

/** Plugin is the main object responsible for creating basic studio widgets. It is a custom add-on to Studio which adds new behavior and features that are not normally included.
 *
 * Both the [Animation Editor](https://developer.roblox.com/en-us/articles/using-animation-editor) and [Terrain Tools](https://developer.roblox.com/en-us/articles/intro-to-terrain) were originally developed as plugins. There are also many plugins made by the Roblox community that you can use to help make games and experiences.
 *
 * See also
 * --------
 *
 * [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
 */
interface Plugin extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Plugin: unique symbol;
	/**
	 * Returns whether the user enabled _Collisions_ in studio under the Model tab.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly CollisionEnabled: boolean;
	/**
	 * Returns the grid size the user has set in studio under the Model tab. This can be 1, 0.2 or 0.01, but has rounding errors.
	 *
	 * The 1/5th option should return 0.2, but could return 0.20000000298023 instead. This code can be used to get the real gridsize:
	 *
	 * local gridsize = plugin.GridSize
	 * if math.abs(gridsize-0.2) < 0.005 then -- Check if the gridsize is between 0.195 and 0.205
	 * 	gridsize = 0.2
	 * elseif math.abs(gridsize-0.01) < 0.005 then -- Between 0.005 and 0.015
	 * 	gridsize = 0.01
	 * else -- Assume it's 1
	 * 	gridsize = 1
	 * end
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly GridSize: number;
	/**
	 * This function sets the state of the calling plugin to activated. Activating the plugin allows mouse control through the [Plugin:GetMouse](https://developer.roblox.com/en-us/api-reference/function/Plugin/GetMouse) method.
	 *
	 * At any given time there are either 0 or 1 Activated Plugins. Activating a plugin will deactivate all other plugins (they will receive a [Plugin.Deactivation](https://developer.roblox.com/en-us/api-reference/event/Plugin/Deactivation) event).
	 *
	 * See also
	 * --------
	 *
	 * *   [Plugin:IsActivatedWithExclusiveMouse](https://developer.roblox.com/en-us/api-reference/function/Plugin/IsActivatedWithExclusiveMouse), returns true if this plugin is currently active with an exclusive mouse, after having been activated via this function
	 * *   [Plugin.Unloading](https://developer.roblox.com/en-us/api-reference/event/Plugin/Unloading), fires immediately before the plugin is unloaded or reloaded via uninstallation, deactivation, or updating
	 */
	Activate(this: Plugin, exclusiveMouse: boolean): void;
	/**
	 * This function creates a [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction) which is an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`. In Roblox Studio, they can be assigned a keyboard shortcut under `File → Advanced → Customize Shortcuts…`, and they can also be added to the Quick Access Toolbar.
	 *
	 * When an action is triggered, the [PluginAction.Triggered](https://developer.roblox.com/en-us/api-reference/event/PluginAction/Triggered) event is signaled.
	 *
	 * In order for PluginActions work as expected, they must be created using this function.
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 * *   [PluginMenu](https://developer.roblox.com/en-us/api-reference/class/PluginMenu), a context menu that can be shown in Studio which displays a list of PluginActions and supports submenus
	 * *   [Plugin:CreatePluginMenu](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginMenu), creates a PluginMenu
	 */
	CreatePluginAction(
		this: Plugin,
		actionId: string,
		text: string,
		statusTip: string,
		iconName?: string,
		allowBinding?: boolean,
	): PluginAction;
	/**
	 * This function creates a new [PluginMenu](https://developer.roblox.com/en-us/api-reference/class/PluginMenu), which is a context menu that can be shown in Studio that displays a list of [PluginActions](https://developer.roblox.com/en-us/api-reference/class/PluginAction) and supports submenus.
	 *
	 * In order for PluginMenus to work as expected, they must be created using this function.
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 * *   [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction), an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`.
	 * *   [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction), creates a PluginAction
	 * *   [PluginMenu.Title](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Title), the text to be displayed when used as a sub menu
	 * *   [PluginMenu.Icon](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Icon), the icon to be displayed when used as a sub menu
	 * *   [PluginMenu:AddAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddAction), adds the given action to the menu
	 * *   [PluginMenu:AddNewAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddNewAction), creates a temporary action that is hidden from Studio's customize shortcuts window
	 * *   [PluginMenu:AddMenu](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddMenu), adds the given menu as a separator
	 * *   [PluginMenu:AddSeparator](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddSeparator), adds a separator between items in the menu
	 * *   [PluginMenu:Clear](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/Clear), clears the menu
	 * *   [PluginMenu:ShowAsync](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/ShowAsync), shows the menu at the mouse cursor. Yields until either an item is selected or the menu is closed. The selected action fires its Triggered event
	 */
	CreatePluginMenu(this: Plugin, id: string, title?: string, icon?: string): PluginMenu;
	/**
	 * The **CreateToolbar** function creates a new [PluginToolbar](https://developer.roblox.com/en-us/api-reference/class/PluginToolbar) with the given name. The tooblar can then be used to create plugin buttons.
	 *
	 * ![](https://developer.roblox.com/assets/blt8a9224a9e7eef525/PluginToolbar-light.png)
	 */
	CreateToolbar(this: Plugin, name: string): PluginToolbar;
	/**
	 * Deactivates the plugin. This will disengage the associated [PluginMouse](https://developer.roblox.com/en-us/api-reference/class/PluginMouse) if it has been activated
	 *
	 * See also
	 * --------
	 *
	 * *   [Plugin:Activate](https://developer.roblox.com/en-us/api-reference/function/Plugin/Activate), sets the state of the calling plugin to activated
	 * *   [Plugin.Deactivation](https://developer.roblox.com/en-us/api-reference/event/Plugin/Deactivation), fires when the plugin is deactivated
	 * *   [Plugin.Unloading](https://developer.roblox.com/en-us/api-reference/event/Plugin/Unloading), fires immediately before the plugin is unloaded or reloaded via uninstallation, deactivation, or updating
	 */
	Deactivate(this: Plugin): void;
	/**
	 * Returns the [JointCreationMode](https://developer.roblox.com/en-us/api-reference/enum/JointCreationMode) the user has set in studio under the Model tab.
	 */
	GetJoinMode(this: Plugin): Enum.JointCreationMode;
	/**
	 * **GetMouse** returns a [PluginMouse](https://developer.roblox.com/en-us/api-reference/class/PluginMouse) that can be used while the plugin is active through [Plugin:Activate](https://developer.roblox.com/en-us/api-reference/function/Plugin/Activate).
	 */
	GetMouse(this: Plugin): PluginMouse;
	/**
	 * GetSelectedRibbonTool return the currently selected [RibbonTool](https://developer.roblox.com/en-us/api-reference/enum/RibbonTool). It returns an Enum that corresponds to a particular tool. This will return whether the tool is selected manually or programmatically via [Plugin:SelectRibbonTool](https://developer.roblox.com/en-us/api-reference/function/Plugin/SelectRibbonTool).
	 */
	GetSelectedRibbonTool(this: Plugin): Enum.RibbonTool;
	/**
	 * Retrieves a previously stored value with the given key, or nil if the given key doesn't exist.
	 */
	GetSetting(this: Plugin, key: string): unknown;
	/**
	 * Returns the studio user's userId if they're logged in, otherwise returns 0.
	 * Tags: Deprecated
	 * @deprecated
	 */
	GetStudioUserId(this: Plugin): number;
	Intersect(this: Plugin, objects: Array<Instance>): Instance | undefined;
	/**
	 * This function returns true if this plugin is currently active, after having been activated via the [Plugin:Activate](https://developer.roblox.com/en-us/api-reference/function/Plugin/Activate) function.
	 */
	IsActivated(this: Plugin): boolean;
	/**
	 * This function returns true if this plugin is currently active with an exclusive mouse, after having been activated via the [Plugin:Activate](https://developer.roblox.com/en-us/api-reference/function/Plugin/Activate) function. If this returns true, a [PluginMouse](https://developer.roblox.com/en-us/api-reference/class/PluginMouse) can be retrieved via [Plugin:GetMouse](https://developer.roblox.com/en-us/api-reference/function/Plugin/GetMouse).
	 *
	 * See also
	 * --------
	 *
	 * *   [Plugin.Deactivation](https://developer.roblox.com/en-us/api-reference/event/Plugin/Deactivation), fires when the plugin is deactivated
	 * *   [Plugin.Unloading](https://developer.roblox.com/en-us/api-reference/event/Plugin/Unloading), fires immediately before the plugin is unloaded or reloaded via uninstallation, deactivation, or updating
	 */
	IsActivatedWithExclusiveMouse(this: Plugin): boolean;
	/**
	 * Negates the given parts and returns the resulting NegateOperations.
	 */
	Negate(this: Plugin, objects: Array<Instance>): Array<Instance>;
	/**
	 * Used to open the given script instance in an editor window, in Roblox studio, at the given line. If no line is given as an argument it will default to 0.
	 */
	OpenScript(this: Plugin, script: LuaSourceContainer, lineNumber?: number): void;
	/**
	 * Opens the context help window to the wiki page that `url` links to.
	 */
	OpenWikiPage(this: Plugin, url: string): void;
	/**
	 * Opens an upload window for the user's current selection.
	 */
	SaveSelectedToRoblox(this: Plugin): void;
	/**
	 * Activates the specified Roblox Studio tool.
	 * If the tool opens a window, the position parameter specifies where it should be shown on the screen.
	 *
	 * Notes
	 * -----
	 *
	 * *   An object must be selected in order for this to work correctly.
	 * *   Altering the scale fields of the _position_ property will not affect the dialog popups.
	 */
	SelectRibbonTool(this: Plugin, tool: CastsToEnum<Enum.RibbonTool>, position: UDim2): void;
	/**
	 * Separates the given UnionOperations and returns the resulting parts.
	 */
	Separate(this: Plugin, objects: Array<Instance>): Array<Instance>;
	/**
	 * Stores a given value for later use under the given key. The value will persist even after studio is closed.
	 */
	SetSetting(this: Plugin, key: string, value: unknown): void;
	/**
	 * **StartDrag** initiates a drag action using a dictionary of parameters. The parameters are as follows:
	 *
	 * Name
	 *
	 * Type
	 *
	 * Default
	 *
	 * Description
	 *
	 * Sender
	 *
	 * string
	 *
	 * `""`
	 *
	 * Identifies the source of the drag action to the drop target
	 *
	 * MimeType
	 *
	 * string
	 *
	 * `""`
	 *
	 * The [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of Data.
	 *
	 * Data
	 *
	 * string
	 *
	 * `""`
	 *
	 * Information about the drag action (eg. what is being dragged). Should be used by the drop target.
	 *
	 * MouseIcon
	 *
	 * Content
	 *
	 * `""`
	 *
	 * The icon to use for the mouse cursor during the drag. If empty, uses the default cursor.
	 *
	 * DragIcon
	 *
	 * Content
	 *
	 * `""`
	 *
	 * An image to render under the mouse cursor during the drag. This should represent the item being dragged.
	 *
	 * HotSpot
	 *
	 * Vector2
	 *
	 * `Vector2.new(0, 0)`
	 *
	 * The pixel offset from the top-left where the cursor should "hold" the DragIcon.
	 *
	 * See Also
	 * --------
	 *
	 * *   [Drag and Drop in Studio Widgets](https://developer.roblox.com/en-us/articles/drag-and-drop-in-studio-widgets)
	 * *   [PluginGui.PluginDragEntered](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragEntered)
	 * *   [PluginGui.PluginDragMoved](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragMoved)
	 * *   [PluginGui.PluginDragDropped](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragDropped)
	 * *   [PluginGui.PluginDragLeft](https://developer.roblox.com/en-us/api-reference/event/PluginGui/PluginDragLeft)
	 */
	StartDrag(this: Plugin, dragData: object): void;
	/**
	 * Unions the given parts and returns the resulting UnionOperation.
	 */
	Union(this: Plugin, objects: Array<BasePart>): UnionOperation;
	/**
	 * **CreateDockWidgetPluginGui** creates a new [DockWidgetPluginGui](https://developer.roblox.com/en-us/api-reference/class/DockWidgetPluginGui) from the given [DockWidgetPluginGuiInfo](https://developer.roblox.com/en-us/api-reference/datatype/DockWidgetPluginGuiInfo). The first parameter, `pluginGuiId`, should be a unique and consistent string. It is used to save the state of the widget's dock state and other internal details.
	 *
	 * See also
	 * --------
	 *
	 * *   [Building Studio Widgets](https://developer.roblox.com/en-us/articles/building-studio-widgets), for more information on working with Studio widgets.
	 * Tags: Yields
	 */
	CreateDockWidgetPluginGui(
		this: Plugin,
		pluginGuiId: string,
		dockWidgetPluginGuiInfo: DockWidgetPluginGuiInfo,
	): DockWidgetPluginGui;
	/**
	 * This function prompts the user to open a .fbx animation file that can be loaded onto the _rigModel_, then proceeds to insert the animation as a [KeyframeSequence](https://developer.roblox.com/en-us/api-reference/class/KeyframeSequence) in the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace).
	 * Tags: Yields
	 */
	ImportFbxAnimation(this: Plugin, rigModel: Model, isR15?: boolean): Instance | undefined;
	/**
	 * Prompts the user to open a .fbx file, uploads the individual components of the model as meshes, and generates a character rig for use in animation, which is loaded into the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace).
	 * Tags: Yields
	 */
	ImportFbxRig(this: Plugin, isR15?: boolean): Model;
	/**
	 * Opens a window in Roblox Studio, which prompts the user to select an asset based on the _assetType_ specified. Returns what assetId was selected, or -1 if the window was closed.
	 * Tags: Yields
	 */
	PromptForExistingAssetId(this: Plugin, assetType: string): number;
	/**
	 * Prompts the user to save their current selection with the specified file name. Returns true if the user did save the file.
	 * Tags: Yields
	 */
	PromptSaveSelection(this: Plugin, suggestedFileName?: string): boolean;
	/**
	 * Fired when the [Plugin](https://developer.roblox.com/en-us/api-reference/class/Plugin) is deactivated. This occurs when either the plugin code calls [Plugin:Deactivate](https://developer.roblox.com/en-us/api-reference/function/Plugin/Deactivate), or because some other plugin called [Plugin:Activate](https://developer.roblox.com/en-us/api-reference/function/Plugin/Activate), which forces all other plugins to lose their active state.
	 *
	 * See also
	 * --------
	 *
	 * *   [Plugin.Unloading](https://developer.roblox.com/en-us/api-reference/event/Plugin/Unloading), fires immediately before the plugin is unloaded or reloaded via uninstallation, deactivation, or updating
	 */
	readonly Deactivation: RBXScriptSignal<() => void>;
	/**
	 * This event fires immediately before the [Plugin](https://developer.roblox.com/en-us/api-reference/class/Plugin) stops running. Plugins are unloaded when disabled, uninstalled, about to be updated, or when the place is closing.
	 *
	 * It enables a plugin to clean up after itself before its scripts stop running, e.g. to remove unnecessary instances from the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel). If a plugin does not clean up properly, the old copies will remain. When this occurs, users may be forced to close and reopen the place which is a bad user experience.
	 *
	 * Plugin-related instances such as [PluginToolbarButtons](https://developer.roblox.com/en-us/api-reference/class/PluginToolbarButton), [DockWidgetPluginGuis](https://developer.roblox.com/en-us/api-reference/class/DockWidgetPluginGui), and [PluginGuis](https://developer.roblox.com/en-us/api-reference/class/PluginGui) are automatically cleaned up when the plugin is unloaded so there is no need to remove them.
	 *
	 * See also
	 * --------
	 *
	 * [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 */
	readonly Unloading: RBXScriptSignal<() => void>;
}

/** PluginAction is an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`. In Roblox Studio, they can be assigned a keyboard shortcut under `File → Advanced → Customize Shortcuts...`, and they can also be added to the Quick Access Toolbar.
 *
 * PluginActions must be created using the [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction) function in order to work as expected.
 */
interface PluginAction extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginAction: unique symbol;
	/**
	 * A string that uniquely identifies this action. This string is the key used when saving and loading the action's state in Roblox Studio.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly ActionId: string;
	/**
	 * This property determines whether the [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction) will be hidden from Studio's shortcuts view. Useful for contextual actions. It defaults to true.
	 *
	 * See also
	 * --------
	 *
	 * *   `Plugin/CreationPluginAction`, creates a PluginAction
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly AllowBinding: boolean;
	/**
	 * The description of the action, when viewing it from the keyboard shortcuts window in Roblox Studio.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly StatusTip: string;
	/**
	 * The text that is displayed when viewing this action in Roblox Studio.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly Text: string;
	/**
	 * Fires when the action is triggered. This can be done by either activating the action from the Quick Access Toolbar, or by using the keyboard shortcut that was bound to it.
	 */
	readonly Triggered: RBXScriptSignal<() => void>;
}

interface PluginDebugService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginDebugService: unique symbol;
}

interface PluginDragEvent extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginDragEvent: unique symbol;
	/**
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly Data: string;
	/**
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly MimeType: string;
	/**
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly Position: Vector2;
	/**
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly Sender: string;
}

/** PluginGuiService is a service that stores [PluginGui](https://developer.roblox.com/en-us/api-reference/class/PluginGui) objects to be displayed in Roblox Studio. It only allows PluginGuis to be direct children of the service, and PluginGuis are not allowed to be parented anywhere besides the service. */
interface PluginGuiService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginGuiService: unique symbol;
}

interface PluginManagerInterface extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginManagerInterface: unique symbol;
	/**
	 * Tags: Deprecated, CustomLuaState
	 * @deprecated
	 */
	CreatePlugin(this: PluginManagerInterface): Instance | undefined;
	ExportPlace(this: PluginManagerInterface, filePath?: string): void;
	ExportSelection(this: PluginManagerInterface, filePath?: string): void;
}

/** A context menu that can be shown in Studio. It displays a list of PluginActions and supports submenus.
 *
 * PluginMenus must be created using the [Plugin:CreatePluginMenu](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginMenu) function in order to work as expected.
 *
 * See also
 * --------
 *
 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
 * *   [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction), an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`.
 * *   [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction), creates a PluginAction
 * *   [PluginMenu.Title](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Title), the text to be displayed when used as a sub menu
 * *   [PluginMenu.Icon](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Icon), the icon to be displayed when used as a sub menu
 * *   [PluginMenu:AddAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddAction), adds the given action to the menu
 * *   [PluginMenu:AddNewAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddNewAction), creates a temporary action that is hidden from Studio's customize shortcuts window
 * *   [PluginMenu:AddMenu](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddMenu), adds the given menu as a separator
 * *   [PluginMenu:AddSeparator](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddSeparator), adds a separator between items in the menu
 * *   [PluginMenu:Clear](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/Clear), clears the menu
 * *   [PluginMenu:ShowAsync](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/ShowAsync), shows the menu at the mouse cursor. Yields until either an item is selected or the menu is closed. The selected action fires its Triggered event
 */
interface PluginMenu extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginMenu: unique symbol;
	/**
	 * This property determines the icon to be displayed when used as a sub menu. It defaults to an empty string `””`.
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 * *   [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction), an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`.
	 * *   [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction), creates a PluginAction
	 * *   [PluginMenu.Title](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Title), the text to be displayed when used as a sub menu
	 * *   [PluginMenu:AddAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddAction), adds the given action to the menu
	 * *   [PluginMenu:AddNewAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddNewAction), creates a temporary action that is hidden from Studio's customize shortcuts window
	 * *   [PluginMenu:AddMenu](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddMenu), adds the given menu as a separator
	 * *   [PluginMenu:AddSeparator](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddSeparator), adds a separator between items in the menu
	 * *   [PluginMenu:Clear](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/Clear), clears the menu
	 * *   [PluginMenu:ShowAsync](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/ShowAsync), shows the menu at the mouse cursor. Yields until either an item is selected or the menu is closed. The selected action fires its Triggered event
	 * Tags: NotReplicated
	 */
	Icon: string;
	/**
	 * This property determines the text to be displayed when a [PluginMenu](https://developer.roblox.com/en-us/api-reference/class/PluginMenu) is used as a sub menu. It defaults to an empty string `””`.
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 * *   [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction), an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`.
	 * *   [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction), creates a PluginAction
	 * *   [PluginMenu.Icon](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Icon), the icon to be displayed when used as a sub menu
	 * *   [PluginMenu:AddAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddAction), adds the given action to the menu
	 * *   [PluginMenu:AddNewAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddNewAction), creates a temporary action that is hidden from Studio's customize shortcuts window
	 * *   [PluginMenu:AddMenu](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddMenu), adds the given menu as a separator
	 * *   [PluginMenu:AddSeparator](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddSeparator), adds a separator between items in the menu
	 * *   [PluginMenu:Clear](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/Clear), clears the menu
	 * *   [PluginMenu:ShowAsync](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/ShowAsync), shows the menu at the mouse cursor. Yields until either an item is selected or the menu is closed. The selected action fires its Triggered event
	 * Tags: NotReplicated
	 */
	Title: string;
	/**
	 * This function adds the given action to the menu.
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 * *   [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction), an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`.
	 * *   [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction), creates a PluginAction
	 * *   [PluginMenu.Title](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Title), the text to be displayed when used as a sub menu
	 * *   [PluginMenu.Icon](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Icon), the icon to be displayed when used as a sub menu
	 * *   [PluginMenu:AddNewAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddNewAction), creates a temporary action that is hidden from Studio's customize shortcuts window
	 * *   [PluginMenu:AddMenu](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddMenu), adds the given menu as a separator
	 * *   [PluginMenu:AddSeparator](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddSeparator), adds a separator between items in the menu
	 * *   [PluginMenu:Clear](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/Clear), clears the menu
	 * *   [PluginMenu:ShowAsync](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/ShowAsync), shows the menu at the mouse cursor. Yields until either an item is selected or the menu is closed. The selected action fires its Triggered event
	 */
	AddAction(this: PluginMenu, action: PluginAction): void;
	/**
	 * This function adds the given menu as a separator.
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 * *   [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction), an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`.
	 * *   [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction), creates a PluginAction
	 * *   [PluginMenu.Title](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Title), the text to be displayed when used as a sub menu
	 * *   [PluginMenu.Icon](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Icon), the icon to be displayed when used as a sub menu
	 * *   [PluginMenu:AddAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddAction), adds the given action to the menu
	 * *   [PluginMenu:AddNewAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddNewAction), creates a temporary action that is hidden from Studio's customize shortcuts window
	 * *   [PluginMenu:AddSeparator](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddSeparator), adds a separator between items in the menu
	 * *   [PluginMenu:Clear](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/Clear), clears the menu
	 * *   [PluginMenu:ShowAsync](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/ShowAsync), shows the menu at the mouse cursor. Yields until either an item is selected or the menu is closed. The selected action fires its Triggered event
	 */
	AddMenu(this: PluginMenu, menu: PluginMenu): void;
	AddNewAction(this: PluginMenu, actionId: string, text: string, icon?: string): PluginAction;
	/**
	 * This function adds a separator between items in the menu.
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 * *   [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction), an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`.
	 * *   [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction), creates a PluginAction
	 * *   [PluginMenu.Title](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Title), the text to be displayed when used as a sub menu
	 * *   [PluginMenu.Icon](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Icon), the icon to be displayed when used as a sub menu
	 * *   [PluginMenu:AddAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddAction), adds the given action to the menu
	 * *   [PluginMenu:AddNewAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddNewAction), creates a temporary action that is hidden from Studio's customize shortcuts window
	 * *   [PluginMenu:AddMenu](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddMenu), adds the given menu as a separator
	 * *   [PluginMenu:Clear](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/Clear), clears the menu
	 * *   [PluginMenu:ShowAsync](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/ShowAsync), shows the menu at the mouse cursor. Yields until either an item is selected or the menu is closed. The selected action fires its Triggered event
	 */
	AddSeparator(this: PluginMenu): void;
	/**
	 * This function clears the menu
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 * *   [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction), an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`.
	 * *   [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction), creates a PluginAction
	 * *   [PluginMenu.Title](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Title), the text to be displayed when used as a sub menu
	 * *   [PluginMenu.Icon](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Icon), the icon to be displayed when used as a sub menu
	 * *   [PluginMenu:AddAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddAction), adds the given action to the menu
	 * *   [PluginMenu:AddNewAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddNewAction), creates a temporary action that is hidden from Studio's customize shortcuts window
	 * *   [PluginMenu:AddMenu](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddMenu), adds the given menu as a separator
	 * *   [PluginMenu:AddSeparator](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddSeparator), adds a separator between items in the menu
	 * *   [PluginMenu:ShowAsync](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/ShowAsync), shows the menu at the mouse cursor. Yields until either an item is selected or the menu is closed. The selected action fires its Triggered event
	 */
	Clear(this: PluginMenu): void;
	/**
	 * This function shows the menu at the mouse cursor. It yields until either an item is selected or the menu is closed. The selected action fires its [PluginAction.Triggered](https://developer.roblox.com/en-us/api-reference/event/PluginAction/Triggered) event
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory article to plugin use and development
	 * *   [PluginAction](https://developer.roblox.com/en-us/api-reference/class/PluginAction), an object that represents a generic performable action in Roblox Studio, with no directly associated `Toolbar` or `Button`.
	 * *   [Plugin:CreatePluginAction](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreatePluginAction), creates a PluginAction
	 * *   [PluginMenu.Title](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Title), the text to be displayed when used as a sub menu
	 * *   [PluginMenu.Icon](https://developer.roblox.com/en-us/api-reference/property/PluginMenu/Icon), the icon to be displayed when used as a sub menu
	 * *   [PluginMenu:AddAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddAction), adds the given action to the menu
	 * *   [PluginMenu:AddNewAction](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddNewAction), creates a temporary action that is hidden from Studio's customize shortcuts window
	 * *   [PluginMenu:AddMenu](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddMenu), adds the given menu as a separator
	 * *   [PluginMenu:AddSeparator](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/AddSeparator), adds a separator between items in the menu
	 * *   [PluginMenu:Clear](https://developer.roblox.com/en-us/api-reference/function/PluginMenu/Clear), clears the menu
	 * Tags: Yields
	 */
	ShowAsync(this: PluginMenu): Instance | undefined;
}

/** A PluginToolbar is an object created by using the [Plugin:CreateToolbar](https://developer.roblox.com/en-us/api-reference/function/Plugin/CreateToolbar) method. It is used to create [PluginToolbarButton](https://developer.roblox.com/en-us/api-reference/class/PluginToolbarButton)s using the [CreateButton](https://developer.roblox.com/en-us/api-reference/function/PluginToolbar/CreateButton) function. In general, it is good practice for a plugin to use **one and only one** uniquely named toolbar for all of its buttons. In Roblox Studio, toolbars are rendered under the Plugins tab.
 *
 * ![A screenshot of Roblox Studio's Plugins tab, rendering several PluginToolbars](https://developer.roblox.com/assets/blt8a9224a9e7eef525/PluginToolbar-light.png)
 *
 * Pictured above are three PluginToolbars in Roblox Studio: Animations, Three Wise Monkeys and Localization. The center toolbar is a custom toolbar created by a plugin; the other toolbars are created by built-in Roblox Studio plugins.
 *
 * Example
 * -------
 *
 * The following code sample creates a basic toolbar with one button. It should be run as a Roblox Studio plugin, and not run as a [Script](https://developer.roblox.com/en-us/api-reference/class/Script).
 *
 * local toolbar = plugin:CreateToolbar("Three Wise Monkeys")
 * local button = toolbar:CreateButton("Mizaru", "See No Evil", "rbxassetid://2778270261")
 */
interface PluginToolbar extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginToolbar: unique symbol;
	/**
	 * Creates [PluginToolbarButton](https://developer.roblox.com/en-us/api-reference/class/PluginToolbarButton) that allows the user to initiate a single, one-off action in Roblox Studio through the [Click](https://developer.roblox.com/en-us/api-reference/event/PluginToolbarButton/Click) event.
	 *
	 * See also
	 * --------
	 *
	 * *   [Intro to Plugins](https://developer.roblox.com/en-us/articles/intro-to-plugins), an introductory level article for users looking to create custom plugins
	 */
	CreateButton(this: PluginToolbar, buttonId: string, tooltip: string, iconname: string, text?: string): PluginToolbarButton;
}

/** A PluginToolbarButton is an object created by the [PluginToolbar:CreateButton](https://developer.roblox.com/en-us/api-reference/function/PluginToolbar/CreateButton) function. It allows the user to initiate a single, one-off action in Roblox Studio through the [Click](https://developer.roblox.com/en-us/api-reference/event/PluginToolbarButton/Click) event. Pictured below are three PluginToolbarButtons. From left to right: the default, hover and pressed states. The hovered button in the center shows tooltip text, which is the 2nd argument passed to [PluginToolbar:CreateButton](https://developer.roblox.com/en-us/api-reference/function/PluginToolbar/CreateButton).
 *
 * ![Three PluginToolbarButtons rendered on a PluginToolbar titled "Three Wise Monkeys"](https://developer.roblox.com/assets/blt3d234c03ebdc6750/PluginToolbarButton-light.png)
 *
 * Behavior
 * --------
 *
 * When pressed, the [Click](https://developer.roblox.com/en-us/api-reference/event/PluginToolbarButton/Click) event fires. A button will also remain in the pressed state, which may be set manually using [SetActive](https://developer.roblox.com/en-us/api-reference/function/PluginToolbarButton/SetActive). Upon plugin activation ([Plugin:Activate](https://developer.roblox.com/en-us/api-reference/function/Plugin/Activate)), buttons in all other [PluginToolbar](https://developer.roblox.com/en-us/api-reference/class/PluginToolbar)s will be toggled off. If all buttons in a toolbar are off, the toolbar's plugin is deactivated ([Plugin:Deactivate](https://developer.roblox.com/en-us/api-reference/function/Plugin/Deactivate)).
 *
 * When the game viewport is not visible, buttons will be disabled as if their [Enabled](https://developer.roblox.com/en-us/api-reference/property/PluginToolbarButton/Enabled) property were false. Disabled buttons are desaturated and do not respond to user clicks. By setting [ClickableWhenViewportHidden](https://developer.roblox.com/en-us/api-reference/property/PluginToolbarButton/ClickableWhenViewportHidden) to true, you can allow plugin buttons to remain clickable (such as during script editing).
 *
 * History
 * -------
 *
 * *   Prior to an update released in January 2019, this class was simply known as “Button”. This was changed to reduce confusion with similarly named in-game UI element classes, such as [TextButton](https://developer.roblox.com/en-us/api-reference/class/TextButton).
 */
interface PluginToolbarButton extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_PluginToolbarButton: unique symbol;
	/**
	 * **ClickableWhenViewportHIdden** determines whether a PluginToolbarButton may be clicked while the game viewport is hidden, such as when a [Script](https://developer.roblox.com/en-us/api-reference/class/Script) is being edited in another tab. In the image below, various plugin toolbar buttons are visible. Some are enabled as a result of this property being true, such as the Localization Tools button.
	 *
	 * ![Various plugin toolbar buttons visible while a Script is being edited, causing the game viewport to be hidden. Some of the buttons are enabled due to this property being true.](https://developer.roblox.com/assets/blt15abc50a70cd30be/PluginToolbarButton.ClickableWhenViewportHidden.jpg)
	 *
	 * Typically, this property is good to enable if an action triggered by a plugin button's [Click](https://developer.roblox.com/en-us/api-reference/event/PluginToolbarButton/Click) event doesn't occur in the game world (Workspace). For example, a button that opens a widget should have this property be true, as showing a widget is visible to the user even if the game view isn't visible.
	 * Tags: NotReplicated
	 */
	ClickableWhenViewportHidden: boolean;
	/**
	 * **Enabled** determines whether a button is clickable in general. When this property is false, the button will be greyed out and unclickable, preventing the user from firing the [Click](https://developer.roblox.com/en-us/api-reference/event/PluginToolbarButton/Click) event. Buttons are enabled by default.
	 *
	 * Plugins should disable their buttons when the button action isn't relevant in the current context. For example, a plugin button that assigns random colors to selected should not be enabled when the selection contains no parts. See the code samples for more information.
	 *
	 * See also
	 * --------
	 *
	 * *   [ClickableWhenViewportHidden](https://developer.roblox.com/en-us/api-reference/property/PluginToolbarButton/ClickableWhenViewportHidden), which determines whether a button is clickable when the game view is hidden (and not just in general)
	 * Tags: NotReplicated
	 */
	Enabled: boolean;
	/**
	 * Tags: NotReplicated
	 */
	Icon: string;
	SetActive(this: PluginToolbarButton, active: boolean): void;
	/**
	 * **Click** fires when the PluginToolbarButton is pressed and released by the user.
	 *
	 * Clicking a PluginToolbarButton causes the state of the button to toggle. Call [SetActive](https://developer.roblox.com/en-us/api-reference/function/PluginToolbarButton/SetActive) to manually set the state of the button.
	 */
	readonly Click: RBXScriptSignal<() => void>;
}

/** The RenderSettings is a singleton class, which lets developers debug components of Roblox's graphics engine.
 *
 * It can be found under the _Rendering_ tab in Roblox Studio's settings menu.
 */
interface RenderSettings extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_RenderSettings: unique symbol;
	/**
	 * Sets the starting quality level of the framerate manager, when [RenderSettings.EnableFRM](https://developer.roblox.com/en-us/api-reference/property/RenderSettings/EnableFRM) is set to true.
	 */
	AutoFRMLevel: number;
	/**
	 * When set to true, all scene updates will be given an unlimited budget, regardless of how computationally expensive it may be.
	 *
	 * This ensures each frame will look as it should, at the cost of a more unstable frame rate.
	 *
	 * Notes
	 * -----
	 *
	 * *   This is used when rendering game thumbnails.
	 */
	EagerBulkExecution: boolean;
	/**
	 * Sets the graphics quality level in Roblox Studio, when [RenderSettings.EnableFRM](https://developer.roblox.com/en-us/api-reference/property/RenderSettings/EnableFRM) is set to false.
	 */
	EditQualityLevel: Enum.QualityLevel;
	/**
	 * Toggles the enabled state of the framerate manager.
	 * Tags: Hidden, NotReplicated
	 */
	EnableFRM: boolean;
	/**
	 * Sets whether materials should be generated per part, or per unique appearance in Roblox's obj exporter.
	 */
	ExportMergeByMaterial: boolean;
	/**
	 * Specifies the behavior of the framerate manager.
	 */
	FrameRateManager: Enum.FramerateManagerMode;
	/**
	 * The graphics API that Roblox will use on startup.
	 */
	GraphicsMode: Enum.GraphicsMode;
	/**
	 * The size in bytes of the mesh cache.
	 *
	 * Defaults to 32 MBs.
	 */
	MeshCacheSize: number;
	/**
	 * Determines the mode for the selection of detail levels for mesh parts. For a good balance between performance and fidelity this should be set to `MeshPartDetail.DistanceBased` (default), which is what the client uses.
	 *
	 * Note that the `MeshPart.RenderFidelity` needs to be set to `RenderFidelity.Automatic` for this to work. If you set it to `RenderFidelity.Precise` you will always see the higher resolution version and the `MeshPartDetailLevel` will be ignored for that [MeshPart](https://developer.roblox.com/en-us/api-reference/class/MeshPart).
	 */
	MeshPartDetailLevel: Enum.MeshPartDetailLevel;
	/**
	 * If [RenderSettings.EnableFRM](https://developer.roblox.com/en-us/api-reference/property/RenderSettings/EnableFRM) is set to true, this property controls the quality level in Roblox Studio.
	 */
	QualityLevel: Enum.QualityLevel;
	/**
	 * When set to true, Roblox Studio will automatically reload changes that are made to files in Roblox's `content` folder.
	 */
	ReloadAssets: boolean;
	/**
	 * When set to true, a wireframe of polygons will be shown on all [PartOperation](https://developer.roblox.com/en-us/api-reference/class/PartOperation) objects.
	 */
	RenderCSGTrianglesDebug: boolean;
	/**
	 * If set to true, renders bounding boxes around each individual rendered entity in the scene.
	 */
	ShowBoundingBoxes: boolean;
	/**
	 * Returns the maximum quality level.
	 */
	GetMaxQualityLevel(this: RenderSettings): number;
}

/** **RenderingTest** is an internal testing utility for the rendering pipeline. It is not intended for external use. */
interface RenderingTest extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_RenderingTest: unique symbol;
	CFrame: CFrame;
	ComparisonDiffThreshold: number;
	ComparisonMethod: Enum.RenderingTestComparisonMethod;
	ComparisonPsnrThreshold: number;
	Description: string;
	FieldOfView: number;
	/**
	 * Tags: Hidden, NotReplicated
	 */
	Orientation: Vector3;
	PerfTest: boolean;
	/**
	 * Tags: Hidden, NotReplicated
	 */
	Position: Vector3;
	QualityLevel: number;
	ShouldSkip: boolean;
	Ticket: string;
	Timeout: number;
	RenderdocTriggerCapture(this: RenderingTest): void;
}

interface RobloxPluginGuiService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_RobloxPluginGuiService: unique symbol;
}

interface RunService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_RunService: unique symbol;
	/**
	 * This function returns whether the current environment is in 'Edit' mode. For example, Roblox Studio is in 'Edit Mode' when the game is not running.
	 *
	 * IsEdit will return the inverse of [RunService:IsRunning](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunning) with one exception, if the simulation has been 'paused' then both IsEdit and [RunService:IsRunning](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunning) will return false.
	 *
	 * See also
	 * --------
	 *
	 * *   [RunService:IsClient](https://developer.roblox.com/en-us/api-reference/function/RunService/IsClient)
	 * *   [RunService:IsServer](https://developer.roblox.com/en-us/api-reference/function/RunService/IsServer)
	 * *   [RunService:IsStudio](https://developer.roblox.com/en-us/api-reference/function/RunService/IsStudio)
	 * *   [RunService:IsRunning](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunning)
	 * *   [RunService:IsRunMode](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunMode)
	 */
	IsEdit(this: RunService): boolean;
	/**
	 * This function pauses the games' simulation if it is running, suspending physics and scripts.
	 *
	 * The simulation can be started using [RunService:Run](https://developer.roblox.com/en-us/api-reference/function/RunService/Run) or the 'Run' button in Roblox Studio. When the simulation is paused, [RunService:IsRunning](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunning) will return _false_.
	 *
	 * Pausing the simulation can be used to assist with debugging in Roblox Studio, it cannot be used in real game sessions.
	 *
	 * See also
	 * --------
	 *
	 * *   [RunService:IsRunning](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunning)
	 * *   [RunService:Run](https://developer.roblox.com/en-us/api-reference/function/RunService/Run)
	 * *   [RunService:Stop](https://developer.roblox.com/en-us/api-reference/function/RunService/Stop)
	 */
	Pause(this: RunService): void;
	/**
	 * The Reset function resets the current game to a waypoint set when Run was called. This method should only be used after Run was called.
	 * Tags: Deprecated
	 * @deprecated
	 */
	Reset(this: RunService): void;
	/**
	 * This function runs the game's simulation, running physics and scripts.
	 *
	 * When the simulation is running, [RunService:IsRunning](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunning) will return _true_. However, [RunService:IsRunMode](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunMode) will only return _true_ if the simulation was started using the 'Run' button in Roblox Studio. This means when this function is used to start the simulation, IsRunMode will return _false_ even though the simulation is running.
	 *
	 * The simulation can be paused using [RunService:Pause](https://developer.roblox.com/en-us/api-reference/function/RunService/Pause) or the 'Pause' button in Roblox Studio. It can also be ended using [RunService:Stop](https://developer.roblox.com/en-us/api-reference/function/RunService/Stop).
	 *
	 * Running the simulation can be used to assist with debugging in Roblox Studio. Currently it is not possible to restore the game to the state it was in prior to running the simulation if the simulation was started using this function. If this is a problem, instead use the 'Run' button in Roblox Studio.
	 *
	 * See also
	 * --------
	 *
	 * *   [RunService:IsRunning](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunning)
	 * *   [RunService:Pause](https://developer.roblox.com/en-us/api-reference/function/RunService/Pause)
	 * *   [RunService:Stop](https://developer.roblox.com/en-us/api-reference/function/RunService/Stop)
	 */
	Run(this: RunService): void;
	/**
	 * This function ends the game's simulation if it is running.
	 *
	 * The simulation can be started using [RunService:Run](https://developer.roblox.com/en-us/api-reference/function/RunService/Run) or the 'Run' button in Roblox Studio. When the simulation is stopped, [RunService:IsRunning](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunning) will return _false_ and [RunService:IsEdit](https://developer.roblox.com/en-us/api-reference/function/RunService/IsEdit) will return _true_.
	 *
	 * In contrast to the 'Stop' button in Roblox Studio, calling this function will not restore the game to the state it was in prior to the simulation being run. This means any changes made to the game by the physics simulation and scripts will persist after the simulation has ended.
	 *
	 * See also
	 * --------
	 *
	 * *   [RunService:IsRunning](https://developer.roblox.com/en-us/api-reference/function/RunService/IsRunning)
	 * *   [RunService:Run](https://developer.roblox.com/en-us/api-reference/function/RunService/Run)
	 * *   [RunService:Pause](https://developer.roblox.com/en-us/api-reference/function/RunService/Pause)
	 */
	Stop(this: RunService): void;
}

interface ScriptContext extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_ScriptContext: unique symbol;
	/**
	 * Limits how long a script is allowed to run without yielding.
	 */
	SetTimeout(this: ScriptContext, seconds: number): void;
}

/** A ScriptDebugger is used to handle the debugging of a specific script. It can be retrieved from the [DebuggerManager](https://developer.roblox.com/en-us/api-reference/class/DebuggerManager). */
interface ScriptDebugger extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_ScriptDebugger: unique symbol;
	/**
	 * The current line that the script is on.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly CurrentLine: number;
	/**
	 * Describes if this ScriptDebugger is actually debugging the script attached to it.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly IsDebugging: boolean;
	/**
	 * Describes if this ScriptDebugger is paused.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly IsPaused: boolean;
	/**
	 * The script object this debugger is linked to.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly Script: Instance | undefined;
	/**
	 * Adds a [DebuggerWatch](https://developer.roblox.com/en-us/api-reference/class/DebuggerWatch) with the given expression.
	 */
	AddWatch(this: ScriptDebugger, expression: string): Instance | undefined;
	/**
	 * Returns a list of [DebuggerBreakpoint](https://developer.roblox.com/en-us/api-reference/class/DebuggerBreakpoint) present in the script.
	 */
	GetBreakpoints(this: ScriptDebugger): Array<Instance>;
	/**
	 * Returns a dictionary of all variables that are present in the global environment of the stack frame, where the keys are the names of the variables, and the values are the actual values of the variables.
	 * Each stack frame might see different global variables if function environments are different.
	 */
	GetGlobals(this: ScriptDebugger, stackFrame?: number): Map<string, unknown>;
	/**
	 * Returns a dictionary of all local variables in the specified stack frame, where the keys are the names of the variables, and the values are the actual values of the variables.
	 */
	GetLocals(this: ScriptDebugger, stackFrame?: number): Map<string, unknown>;
	/**
	 * Returns an array of all active call stack frames in the script.
	 */
	GetStack(this: ScriptDebugger): unknown;
	/**
	 * Returns a dictionary of all upvalues present in the specified stack frame, where the keys are the names of the upvalues, and the values are the actual values of the upvalues.
	 */
	GetUpvalues(this: ScriptDebugger, stackFrame?: number): Map<string, unknown>;
	/**
	 * Returns the current value of a variable being watched by a [DebuggerWatch](https://developer.roblox.com/en-us/api-reference/class/DebuggerWatch).
	 */
	GetWatchValue(this: ScriptDebugger, watch: Instance): unknown;
	/**
	 * Returns a list with all the [DebuggerWatch](https://developer.roblox.com/en-us/api-reference/class/DebuggerWatch) instances for this debugger.
	 */
	GetWatches(this: ScriptDebugger): Array<Instance>;
	/**
	 * Sets the specified line of the script as a breakpoint. Returns a [DebuggerBreakpoint](https://developer.roblox.com/en-us/api-reference/class/DebuggerBreakpoint) that you can use to manage the breakpoint.
	 */
	SetBreakpoint(this: ScriptDebugger, line: number, isContextDependentBreakpoint: boolean): Instance | undefined;
	/**
	 * Sets the value of the variable _name_ as _value_ in the global environment of the specified stack frame.
	 */
	SetGlobal(this: ScriptDebugger, name: string, value: unknown, stackFrame: number): void;
	/**
	 * Sets the value of the variable _name_ as _value_ in the specified stack frame.
	 */
	SetLocal(this: ScriptDebugger, name: string, value: unknown, stackFrame?: number): void;
	/**
	 * Sets the value of the upvalue _name_ as _value_ in the specified stack frame.
	 */
	SetUpvalue(this: ScriptDebugger, name: string, value: unknown, stackFrame?: number): void;
	/**
	 * Fires when a [DebuggerBreakpoint](https://developer.roblox.com/en-us/api-reference/class/DebuggerBreakpoint) is added to the script.
	 */
	readonly BreakpointAdded: RBXScriptSignal<(breakpoint: Breakpoint) => void>;
	/**
	 * Fires when a [DebuggerBreakpoint](https://developer.roblox.com/en-us/api-reference/class/DebuggerBreakpoint) is removed from the script.
	 */
	readonly BreakpointRemoved: RBXScriptSignal<(breakpoint: Breakpoint) => void>;
	/**
	 * Fires when a [DebuggerBreakpoint](https://developer.roblox.com/en-us/api-reference/class/DebuggerBreakpoint) is encountered by the script.
	 */
	readonly EncounteredBreak: RBXScriptSignal<(line: number, breakReason: Enum.BreakReason) => void>;
	/**
	 * Fires when the game is resumed after being paused by a breakpoint.
	 */
	readonly Resuming: RBXScriptSignal<() => void>;
	/**
	 * Fires when a [DebuggerWatch](https://developer.roblox.com/en-us/api-reference/class/DebuggerWatch) is added to this script debugger.
	 */
	readonly WatchAdded: RBXScriptSignal<(watch: Instance) => void>;
	/**
	 * Fires when a [DebuggerWatch](https://developer.roblox.com/en-us/api-reference/class/DebuggerWatch) is removed from this script debugger.
	 */
	readonly WatchRemoved: RBXScriptSignal<(watch: Instance) => void>;
}

interface ScriptDocument extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_ScriptDocument: unique symbol;
	GetLine(this: ScriptDocument, lineIndex?: number | undefined): string;
	GetLineCount(this: ScriptDocument): number;
	GetScript(this: ScriptDocument): LuaSourceContainer;
	GetSelectedText(this: ScriptDocument): string;
	GetSelection(this: ScriptDocument): unknown;
	GetSelectionEnd(this: ScriptDocument): unknown;
	GetSelectionStart(this: ScriptDocument): unknown;
	GetText(
		this: ScriptDocument,
		startLine?: number | undefined,
		startCharacter?: number | undefined,
		endLine?: number | undefined,
		endCharacter?: number | undefined,
	): string;
	GetViewport(this: ScriptDocument): unknown;
	HasSelectedText(this: ScriptDocument): boolean;
	IsCommandBar(this: ScriptDocument): boolean;
	/**
	 * Tags: Yields
	 */
	CloseAsync(this: ScriptDocument): unknown;
	/**
	 * Tags: Yields
	 */
	EditTextAsync(
		this: ScriptDocument,
		newText: string,
		startLine: number,
		startCharacter: number,
		endLine: number,
		endCharacter: number,
	): unknown;
	/**
	 * Tags: Yields
	 */
	ForceSetSelectionAsync(
		this: ScriptDocument,
		cursorLine: number,
		cursorCharacter: number,
		anchorLine?: number | undefined,
		anchorCharacter?: number | undefined,
	): unknown;
	/**
	 * Tags: Yields
	 */
	RequestSetSelectionAsync(
		this: ScriptDocument,
		cursorLine: number,
		cursorCharacter: number,
		anchorLine?: number | undefined,
		anchorCharacter?: number | undefined,
	): unknown;
	readonly SelectionChanged: RBXScriptSignal<
		(positionLine: number, positionCharacter: number, anchorLine: number, anchorCharacter: number) => void
	>;
	readonly ViewportChanged: RBXScriptSignal<(startLine: number, endLine: number) => void>;
}

interface ScriptEditorService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_ScriptEditorService: unique symbol;
	DeregisterAutocompleteCallback(this: ScriptEditorService, name: string): void;
	DeregisterScriptAnalysisCallback(this: ScriptEditorService, name: string): void;
	FindScriptDocument(this: ScriptEditorService, script: LuaSourceContainer): ScriptDocument;
	GetEditorSource(this: ScriptEditorService, script: LuaSourceContainer): string;
	GetScriptDocuments(this: ScriptEditorService): Array<Instance>;
	RegisterAutocompleteCallback(this: ScriptEditorService, name: string, priority: number, callbackFunction: Callback): void;
	RegisterScriptAnalysisCallback(this: ScriptEditorService, name: string, priority: number, callbackFunction: Callback): void;
	/**
	 * Tags: Yields
	 */
	OpenScriptDocumentAsync(this: ScriptEditorService, script: LuaSourceContainer): unknown;
	readonly TextDocumentDidChange: RBXScriptSignal<(document: ScriptDocument, changesArray: unknown) => void>;
	readonly TextDocumentDidClose: RBXScriptSignal<(oldDocument: ScriptDocument) => void>;
	readonly TextDocumentDidOpen: RBXScriptSignal<(newDocument: ScriptDocument) => void>;
}

/** The Selection service controls the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)s that are selected in Roblox Studio.
 *
 * This service is particularly useful when developing [Plugin](https://developer.roblox.com/en-us/api-reference/class/Plugin)s, as it allows the developer to access and manipulate the current selection.
 *
 * Currently selected [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)s can be obtained and set using the [Selection:Get](https://developer.roblox.com/en-us/api-reference/function/Selection/Get) and [Selection:Set](https://developer.roblox.com/en-us/api-reference/function/Selection/Set) functions. The [Selection.SelectionChanged](https://developer.roblox.com/en-us/api-reference/event/Selection/SelectionChanged) event fires whenever the current selection changes.
 *
 * For more information on using Selection and [Plugin](https://developer.roblox.com/en-us/api-reference/class/Plugin)s please see [this tutorial](https://developer.roblox.com/en-us/articles/intro-to-plugins).
 *
 * Selection is also often used in the command bar, to set hidden properties or run functions for selected [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)s. For example:
 *
 * game.Selection:Get()\[1\]:SetPrimaryPartCFrame(CFrame.new()) -- move the selected model to the origin
 *
 * Note this class only applies to Roblox Studio and has no applicability to games.
 */
interface Selection extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Selection: unique symbol;
	/**
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly SelectionThickness: number;
	Add(this: Selection, instancesToAdd: Array<Instance>): void;
	/**
	 * Returns an array of currently selected [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)s in Roblox Studio.
	 *
	 * If no [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)s are selected, the array returned be empty. This function can be used in conjunction with the [Selection.SelectionChanged](https://developer.roblox.com/en-us/api-reference/event/Selection/SelectionChanged) event to get the selection whenever it changes.
	 *
	 * Note, this function can only be used in [Plugin](https://developer.roblox.com/en-us/api-reference/class/Plugin)s or the command line.
	 *
	 * For changing the current selection, please see [Selection:Set](https://developer.roblox.com/en-us/api-reference/function/Selection/Set).
	 */
	Get(this: Selection): Array<Instance>;
	Remove(this: Selection, instancesToRemove: Array<Instance>): void;
	/**
	 * Sets the currently selected objects in Roblox Studio to [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)s in the given array.
	 *
	 * Calling this function will cause the [Selection.SelectionChanged](https://developer.roblox.com/en-us/api-reference/event/Selection/SelectionChanged) event to fire, unless the new selection set is identical to the previous selection.
	 *
	 * Note this function overwrites the existing selection. However, using [Selection:Get](https://developer.roblox.com/en-us/api-reference/function/Selection/Get) an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) can be added to the existing selection like so:
	 *
	 * local selected = Selection:Get()
	 * table.insert(selected, object)
	 * Selection:Set(selected)
	 */
	Set(this: Selection, selection: Array<Instance>): void;
	/**
	 * Fires when the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)s selected in Roblox Studio changes.
	 *
	 * Note this event does not give the new selection. Developers will need to use [Selection](https://developer.roblox.com/en-us/api-reference/class/Selection)'s [Selection:Get](https://developer.roblox.com/en-us/api-reference/function/Selection/Get) function to obtain the current selection.
	 *
	 * Although this event can be used outside of plugins and the command bar, it only applies to the selection in Roblox Studio and therefore has no functionality outside of Studio.
	 *
	 * To change the selection use the [Selection:Set](https://developer.roblox.com/en-us/api-reference/function/Selection/Set) function.
	 */
	readonly SelectionChanged: RBXScriptSignal<() => void>;
}

interface DataModel extends ServiceProvider<Services> {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_DataModel: unique symbol;
	/**
	 * Returns a table containing basic information about the jobs performed by the task scheduler.
	 *
	 * In computing, a task scheduler is a system responsible for executing key tasks at the appropriate intervals.
	 *
	 * You can also find live task scheduler statistics in the Task Scheduler window in Roblox Studio.
	 *
	 * The first entry in the table returned is a reference dictionary containing the statistics (or headings) available. It is in the following format:
	 *
	 * {
	 *     \["name"\] = "name",
	 *     \["averageDutyCycle"\] = "averageDutyCycle",
	 *     \["averageStepsPerSecond"\] = "averageStepsPerSecond",
	 *     \["averageStepTime"\] = "averageStepTime",
	 *     \["averageError"\] = "averageError",
	 *     \["isRunning"\] = "isRunning",
	 * }
	 *
	 * The subsequent entries in the table returned are dictionaries containing the above statistics for jobs performed by the task scheduler. For example:
	 *
	 * {
	 *     \["name"\] = "Heartbeat",
	 *     \["averageDutyCycle"\] = 0,
	 *     \["averageStepsPerSecond"\] = 0,
	 *     \["averageStepTime"\] = 0,
	 *     \["averageError"\] = 0,
	 *     \["isRunning"\] = false,
	 * }
	 *
	 * See also
	 * --------
	 *
	 * *   [TaskScheduler](https://developer.roblox.com/en-us/api-reference/class/TaskScheduler)
	 * *   `DataModel/GetJobsExtendedStats`
	 * *   `DataModel/GetJobIntervalPeakFraction`
	 * *   `DataModel/GetJobTimePeakFraction`
	 */
	GetJobsInfo(this: DataModel): unknown;
	/**
	 * This function returns an array of [Instances](https://developer.roblox.com/en-us/api-reference/class/Instance) associated with the given [content](https://developer.roblox.com/en-us/articles/content) URL.
	 *
	 * This function can be used to insert content from the Roblox [library](https://www.roblox.com/develop/library), such as:
	 *
	 * *   Models
	 * *   Decals
	 * *   Meshes
	 * *   Plugins
	 * *   Animations
	 *
	 * It is not possible to insert [Sounds](https://developer.roblox.com/en-us/api-reference/class/Sound) using this method as they do not have an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) associated with them and have only a [content](https://developer.roblox.com/en-us/articles/content) URL.
	 *
	 * Unlike [InsertService:LoadAsset](https://developer.roblox.com/en-us/api-reference/function/InsertService/LoadAsset), GetObjects does not require an asset to be 'trusted'. This means that an asset does not need to be owned by the logged in user, or created by Roblox, to be inserted. However, if the asset is not owned by the logged in user it must be freely available.
	 *
	 * Due to this function's security context it can only be used by plugins or the command bar. For an alternative that can be used in [Scripts](https://developer.roblox.com/en-us/api-reference/class/Script) and [LocalScripts](https://developer.roblox.com/en-us/api-reference/class/LocalScript), see [InsertService:LoadAsset](https://developer.roblox.com/en-us/api-reference/function/InsertService/LoadAsset).
	 */
	GetObjects(this: DataModel, url: string): Array<Instance>;
	/**
	 * This function sets the [DataModel.PlaceId](https://developer.roblox.com/en-us/api-reference/property/DataModel/PlaceId) of the game instance to the given _placeId_.
	 *
	 * Setting the [DataModel.PlaceId](https://developer.roblox.com/en-us/api-reference/property/DataModel/PlaceId) is required to access the [DataStoreService](https://developer.roblox.com/en-us/api-reference/class/DataStoreService) when the place is unpublished (for example a local .rbxl file). See below for an example. This will only work when the _'Enable Studio Access to API Services\`_ option is enabled under game settings.
	 *
	 * local DataStoreService = game:GetService("DataStoreService")
	 *
	 * -- access DataStore 'Data' as place placeId
	 * game:SetPlaceId(placeId)
	 * local dataStore = DataStoreService:GetDataStore("Data")
	 *
	 * You can use [DataModel:SetUniverseId](https://developer.roblox.com/en-us/api-reference/function/DataModel/SetUniverseId) to set the [DataModel.GameId](https://developer.roblox.com/en-us/api-reference/property/DataModel/GameId) of the game instance. However, it is the [DataModel.PlaceId](https://developer.roblox.com/en-us/api-reference/property/DataModel/PlaceId) that must be set to access the [DataStoreService](https://developer.roblox.com/en-us/api-reference/class/DataStoreService).
	 */
	SetPlaceId(this: DataModel, placeId: number): void;
	/**
	 * This function sets the [DataModel.GameId](https://developer.roblox.com/en-us/api-reference/property/DataModel/GameId) of the current game instance to the given _universeId_. This is useful when testing local .rbxl files that have not been published to Roblox.
	 *
	 * If you want to access the [DataStoreService](https://developer.roblox.com/en-us/api-reference/class/DataStoreService) in an unpublished place, you should use [DataModel:SetPlaceId](https://developer.roblox.com/en-us/api-reference/function/DataModel/SetPlaceId) instead.
	 */
	SetUniverseId(this: DataModel, universeId: number): void;
}

/** The base object used for Roblox Studio's settings menu.
 * Can be accessed by using the `settings()` function.
 *
 * Settings classes under the GlobalSettings
 * -----------------------------------------
 *
 * *   [DebugSettings](https://developer.roblox.com/en-us/api-reference/class/DebugSettings)
 * *   [GameSettings](https://developer.roblox.com/en-us/api-reference/class/GameSettings)
 * *   [LuaSettings](https://developer.roblox.com/en-us/api-reference/class/LuaSettings)
 * *   [NetworkSettings](https://developer.roblox.com/en-us/api-reference/class/NetworkSettings)
 * *   [PhysicsSettings](https://developer.roblox.com/en-us/api-reference/class/PhysicsSettings)
 * *   [RenderSettings](https://developer.roblox.com/en-us/api-reference/class/RenderSettings)
 * *   [Studio](https://developer.roblox.com/en-us/api-reference/class/Studio)
 */
interface GlobalSettings extends GenericSettings {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_GlobalSettings: unique symbol;
	/**
	 * Returns the value of an FFlag if it exists.
	 */
	GetFFlag(this: GlobalSettings, name: string): boolean;
	/**
	 * Returns the value of an FVariable, if it exists.
	 */
	GetFVariable(this: GlobalSettings, name: string): string;
}

/** A StatsItem is an internal measurement item that is created by the engine to benchmark many of the backend components of Roblox.
 * It cannot be created using `Instance.new`, but its value can be read by plugins. They can be found stored inside of the [Stats](https://developer.roblox.com/en-us/api-reference/class/Stats) service.
 */
interface StatsItem extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_StatsItem: unique symbol;
	/**
	 * Tags: Hidden, ReadOnly, NotReplicated
	 */
	readonly DisplayName: string;
	/**
	 * Returns the StatsItem's value.
	 */
	GetValue(this: StatsItem): number;
	/**
	 * Returns the StatsItem's value as a formatted string.
	 */
	GetValueString(this: StatsItem): string;
}

/** A special type of [StatsItem](https://developer.roblox.com/en-us/api-reference/class/StatsItem) which measures the runtime average of an internal **double** value. */
interface RunningAverageItemDouble extends StatsItem {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_RunningAverageItemDouble: unique symbol;
}

/** A special type of [StatsItem](https://developer.roblox.com/en-us/api-reference/class/StatsItem) which measures the runtime average of an internal integer value.
 * As of right now, this StatsItem goes unused.
 */
interface RunningAverageItemInt extends StatsItem {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_RunningAverageItemInt: unique symbol;
}

/** A special type of [StatsItem](https://developer.roblox.com/en-us/api-reference/class/StatsItem) which measures a runtime average time interval.
 * As of right now, this StatsItem goes unused.
 */
interface RunningAverageTimeIntervalItem extends StatsItem {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_RunningAverageTimeIntervalItem: unique symbol;
}

/** A special type of [StatsItem](https://developer.roblox.com/api-reference/class/StatsItem "StatsItem") which measures a total-count-over-time interval.
 * As of right now, this StatsItem goes unused.
 */
interface TotalCountTimeIntervalItem extends StatsItem {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_TotalCountTimeIntervalItem: unique symbol;
}

/** The Studio object is a settings object that is exclusive to Roblox Studio. It can be found in Roblox Studio's settings under the Studio tab. */
interface Studio extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_Studio: unique symbol;
	/**
	 * Tags: NotReplicated
	 */
	['"TODO" Color']: Color3;
	/**
	 * Tags: NotReplicated
	 */
	['"function" Color']: Color3;
	/**
	 * Tags: NotReplicated
	 */
	['"local" Color']: Color3;
	/**
	 * Tags: NotReplicated
	 */
	['"nil" Color']: Color3;
	/**
	 * Tags: NotReplicated
	 */
	['"self" Color']: Color3;
	["Active Color"]: Color3;
	["Active Hover Over Color"]: Color3;
	["Always Save Script Changes"]: boolean;
	["Animate Hover Over"]: boolean;
	["Auto Clean Empty Line"]: boolean;
	["Auto Closing Brackets"]: boolean;
	["Auto Closing Quotes"]: boolean;
	["Auto Delete Closing Brackets and Quotes"]: boolean;
	["Auto Indent Rule"]: Enum.AutoIndentRule;
	["Auto-Recovery Enabled"]: boolean;
	["Auto-Recovery Interval (Minutes)"]: number;
	["Auto-Recovery Path"]: QDir;
	/**
	 * Tags: NotReplicated
	 */
	["Background Color"]: Color3;
	["Basic Objects Display Mode"]: Enum.ListDisplayMode;
	/**
	 * Tags: NotReplicated
	 */
	["Bool Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Bracket Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Built-in Function Color"]: Color3;
	["Camera Mouse Wheel Speed"]: number;
	["Camera Shift Speed"]: number;
	["Camera Speed"]: number;
	["Camera Zoom to Mouse Position"]: boolean;
	["Clear Output On Start"]: boolean;
	CommandBarLocalState: boolean;
	/**
	 * Tags: NotReplicated
	 */
	["Comment Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Current Line Highlight Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Debugger Current Line Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Debugger Error Line Color"]: Color3;
	/**
	 * Specifies the default prompt directory that will be opened when the user activates the _Execute Script_ button in Roblox Studio.
	 */
	DefaultScriptFileDir: QDir;
	/**
	 * If set to true, deprecated objects will be shown in the Advanced Objects window, as well as the Object Browser.
	 */
	DeprecatedObjectsShown: boolean;
	["Drag Multiple Parts As Single Part"]: boolean;
	["Enable Autocomplete"]: boolean;
	["Enable CoreScript Debugger"]: boolean;
	["Enable Http Sandboxing"]: boolean;
	["Enable Internal Beta Features"]: boolean;
	["Enable Internal Features"]: boolean;
	["Enable Temporary Tabs"]: boolean;
	["Enable Temporary Tabs In Explorer"]: boolean;
	/**
	 * Tags: NotReplicated
	 */
	["Error Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Find Selection Background Color"]: Color3;
	/**
	 * Specifies the font used in the script editor.
	 */
	Font: QFont;
	["Format On Paste"]: boolean;
	["Format On Type"]: boolean;
	/**
	 * Tags: NotReplicated
	 */
	["Function Name Color"]: Color3;
	["Highlight Current Line"]: boolean;
	["Highlight Occurances"]: boolean;
	/**
	 * Tags: NotReplicated
	 */
	HintColor: Color3;
	["Hover Animate Speed"]: Enum.HoverAnimateSpeed;
	["Hover Over Color"]: Color3;
	["Indent Using Spaces"]: boolean;
	/**
	 * Tags: NotReplicated
	 */
	InformationColor: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Keyword Color"]: Color3;
	["Line Thickness"]: number;
	readonly LocalAssetsFolder: QDir;
	/**
	 * Specifies whether or not the [Lua Debugger](https://developer.roblox.com/articles/Lua-debugger "Lua Debugger") feature is enabled.
	 */
	LuaDebuggerEnabled: boolean;
	/**
	 * Tags: Hidden, ReadOnly, NotReplicated
	 */
	readonly LuaDebuggerEnabledAtStartup: boolean;
	/**
	 * Tags: NotReplicated
	 */
	["Luau Keyword Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Matching Word Background Color"]: Color3;
	["Maximum Output Lines"]: number;
	/**
	 * Tags: NotReplicated
	 */
	["Menu Item Background Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Method Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Number Color"]: Color3;
	["Only Play Audio from Window in Focus"]: boolean;
	/**
	 * Tags: NotReplicated
	 */
	["Operator Color"]: Color3;
	["Output Font"]: QFont;
	["Output Layout Mode"]: Enum.OutputLayoutMode;
	/**
	 * Sets the highest permission level that APIs have to have in order to be shown in the Object Browser.
	 * See [PermissionLevelShown](https://developer.roblox.com/en-us/api-reference/enum/PermissionLevelShown) for more info.
	 */
	PermissionLevelShown: Enum.PermissionLevelShown;
	PluginDebuggingEnabled: boolean;
	/**
	 * The directory where local plugins are stored.
	 */
	PluginsDir: QDir;
	/**
	 * Tags: NotReplicated
	 */
	["Primary Text Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Property Color"]: Color3;
	["Render Throttle Percentage"]: number;
	["Respect Studio shortcuts when game has focus"]: boolean;
	/**
	 * Tags: NotReplicated
	 */
	["Ruler Color"]: Color3;
	Rulers: string;
	RuntimeUndoBehavior: Enum.RuntimeUndoBehavior;
	["Script Editor Color Preset"]: Enum.StudioScriptEditorColorPresets;
	/**
	 * Tags: NotReplicated
	 */
	["Script Editor Scrollbar Background Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Script Editor Scrollbar Handle Color"]: Color3;
	/**
	 * The time (in seconds) a script can wait to be resumed before timing out.
	 */
	ScriptTimeoutLength: number;
	["Scroll Past Last Line"]: boolean;
	["Search Content For Core Scripts"]: boolean;
	/**
	 * Tags: NotReplicated
	 */
	["Secondary Text Color"]: Color3;
	["Select Color"]: Color3;
	["Select/Hover Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Selected Menu Item Background Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Selected Text Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Selection Background Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Selection Color"]: Color3;
	["Server Audio Behavior"]: Enum.ServerAudioBehavior;
	["Set Pivot of Imported Parts"]: boolean;
	["Show Core GUI in Explorer while Playing"]: boolean;
	["Show Diagnostics Bar"]: boolean;
	["Show FileSyncService"]: boolean;
	["Show Hidden Objects in Explorer"]: boolean;
	["Show Hover Over"]: boolean;
	["Show Navigation Mesh"]: boolean;
	["Show Plugin GUI Service in Explorer"]: boolean;
	["Show QT warnings in output"]: boolean;
	["Show Whitespace"]: boolean;
	["Show plus button on hover in Explorer"]: boolean;
	["Skip Closing Brackets and Quotes"]: boolean;
	/**
	 * Tags: NotReplicated
	 */
	["String Color"]: Color3;
	["Tab Width"]: number;
	/**
	 * Tags: NotReplicated
	 */
	["Text Color"]: Color3;
	["Text Wrapping"]: boolean;
	/**
	 * The Theme property is used to get/set the current [StudioTheme](https://developer.roblox.com/en-us/api-reference/class/StudioTheme) used by [Studio](https://developer.roblox.com/en-us/api-reference/class/Studio).
	 *
	 * This is intended for use within [Plugins](https://developer.roblox.com/en-us/api-reference/class/Plugin), but will also execute in the Command Line. You can access the function via:
	 *
	 * settings().Studio.Theme
	 *
	 * For instance, if you would like to print the current Studio theme:
	 *
	 * print("The current Studio theme is:", settings().Studio.Theme)
	 */
	Theme: StudioTheme;
	/**
	 * Tags: Hidden, ReadOnly, NotReplicated, Deprecated
	 * @deprecated
	 */
	readonly ["UI Theme"]: Enum.UITheme;
	/**
	 * Tags: NotReplicated
	 */
	["Warning Color"]: Color3;
	/**
	 * Tags: NotReplicated
	 */
	["Whitespace Color"]: Color3;
	/**
	 * The **GetAvailableThemes()** function returns a list of [StudioThemes](https://developer.roblox.com/en-us/api-reference/class/StudioTheme) available in [Studio](https://developer.roblox.com/en-us/api-reference/class/Studio). You can access the function via:
	 *
	 * settings().Studio:GetAvailableThemes()
	 */
	GetAvailableThemes(this: Studio): unknown;
	/**
	 * The **ThemeChanged** event fires when Studio's [Theme](https://developer.roblox.com/en-us/api-reference/property/Studio/Theme) changes. The best use of this event is to get the colors from the theme that changed and update your plugin's UI accordingly.
	 *
	 * See the [Building Studio Widgets](https://developer.roblox.com/en-us/articles/building-studio-widgets) tutorial for details on working with custom Studio widgets.
	 */
	readonly ThemeChanged: RBXScriptSignal<() => void>;
}

interface StudioData extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_StudioData: unique symbol;
}

/** StudioService provides access to configuration of Roblox Studio, allows importing files from the user's file system, and other miscellaneous information. It is intended to be used by [Plugin](https://developer.roblox.com/en-us/api-reference/class/Plugin)s in order to provide a consistent user experience.
 *
 * *   Plugins that allow the user to move objects may find [GridSize](https://developer.roblox.com/en-us/api-reference/property/StudioService/GridSize), [RotateIncrement](https://developer.roblox.com/en-us/api-reference/property/StudioService/RotateIncrement) and [UseLocalSpace](https://developer.roblox.com/en-us/api-reference/property/StudioService/UseLocalSpace) useful.
 * *   Plugins that require the user to import files should use [PromptImportFile](https://developer.roblox.com/en-us/api-reference/function/StudioService/PromptImportFile) or [PromptImportFiles](https://developer.roblox.com/en-us/api-reference/function/StudioService/PromptImportFiles) in order to receive [File](https://developer.roblox.com/en-us/api-reference/class/File) objects.
 * *   Plugins that display icons of Instance classes can use [GetClassIcon](https://developer.roblox.com/en-us/api-reference/function/StudioService/GetClassIcon).
 * *   Plugins that care about which script is currently being edited (if any) can read this from [ActiveScript](https://developer.roblox.com/en-us/api-reference/property/StudioService/ActiveScript).
 */
interface StudioService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_StudioService: unique symbol;
	/**
	 * **ActiveScript** refers to the [LuaSourceContainer](https://developer.roblox.com/en-us/api-reference/class/LuaSourceContainer) currently being edited by the user. If the user is not editing a script, this will be `nil`. Below is an example that shows how you can use this property to measure for how long a script was active.
	 *
	 * local startTime = os.time()
	 * local activeScript
	 * local function onActiveScriptChanged(newActiveScript)
	 * 	if newActiveScript ~= activeScript then
	 * 		local deltaTime = os.time() - startTime
	 * 		print(("You edited %s for %d:%2.d"):format(activeScript.Name, math.floor(deltaTime / 60), deltaTime % 60))
	 * 	end
	 * 	startTime = os.time()
	 * 	activeScript = newActiveScript
	 * end
	 * game:GetService("StudioService"):GetPropertyChangedSignal("ActiveScript"):Connect(onActiveScriptChanged)
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly ActiveScript: Instance | undefined;
	/**
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly DraggerSolveConstraints: boolean;
	/**
	 * Tags: ReadOnly, NotReplicated, Deprecated
	 * @deprecated
	 */
	readonly DrawConstraintsOnTop: boolean;
	/**
	 * **GridSize** determines the distance in studs by which studio's drag and move tools move objects each tick. This is set by the user Model tab under the “Snap to Grid” section.
	 *
	 * ![Studio "snap to grid" UI](https://developer.roblox.com/assets/blt8ea442f1baf0663d/SnapToGrid.jpg)
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly GridSize: number;
	/**
	 * **RotateIncrement** determines the angle in degrees by which studio's rotation tool will rotate selected objects each tick. This is set by the user Model tab under the “Snap to Grid” section.
	 *
	 * ![Studio "snap to grid" UI](https://developer.roblox.com/assets/blt8ea442f1baf0663d/SnapToGrid.jpg)
	 *
	 * The table below shows how the rotation handles appear while dragging. Notice how lower values render more axles. In these images, [UseLocalSpace](https://developer.roblox.com/en-us/api-reference/property/StudioService/UseLocalSpace) is `true`.
	 *
	 * RotateIncrement
	 *
	 * Image
	 *
	 * `22.5`
	 *
	 * ![](https://developer.roblox.com/assets/bltfbafe587b43fff88/StudioService.RotateIncrement.22.5.jpg)
	 *
	 * `90.0`
	 *
	 * ![](https://developer.roblox.com/assets/blt72e458401421d679/StudioService.RotateIncrement.90.jpg)
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly RotateIncrement: number;
	/**
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly ShowConstraintDetails: boolean;
	/**
	 * The **StudioLocaleId** property contains the locale currently in-use by Studio, e.g. `en_US`. It is useful when localizing plugins.
	 *
	 * Below is a trivial example of localization based on the value returned by this function.
	 *
	 * local locale = game:GetService("StudioService").StudioLocaleId
	 * if locale == "en\_US" then
	 *    print("Howdy, ya'll")
	 * elseif locale == "en\_GB" then
	 *    print("'Ello, gov'na")
	 * elseif locale:sub(1, 2) == "en" then
	 *    print("Hello")
	 * elseif locale == "fr\_FR" then
	 *    print("Bonjour")
	 * end
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly StudioLocaleId: string;
	/**
	 * **UseLocalSpace** determines whether the studio movement/rotation tools will manipulate a part's [CFrame](https://developer.roblox.com/en-us/api-reference/property/BasePart/CFrame) using the local space of an object or global space. By default, this setting is toggled with Ctrl-L. Plugins can read from this property if they implement their own object movement tools.
	 *
	 * The table below shows how movement/rotation tools change when working with parts. Notice how when UseLocalSpace is false, the movement tools align with the global axes, and when true the movement tools align with the part's local axes.
	 *
	 * UseLocalSpace
	 *
	 * Movement
	 *
	 * Rotation
	 *
	 * `true`
	 *
	 * ![](https://developer.roblox.com/assets/blt430c3ecf09c42eec/StudioService.UseLocalSpace.true.jpg)
	 *
	 * ![](https://developer.roblox.com/assets/blta4d9732d2d9d6d85/StudioService.UseLocalSpace.true.rotation.jpg)
	 *
	 * `false`
	 *
	 * ![](https://developer.roblox.com/assets/blt8175598ca3ea1650/StudioService.UseLocalSpace.false.jpg)
	 *
	 * ![](https://developer.roblox.com/assets/bltc26cf9b88a51df6b/StudioService.UseLocalSpace.false.rotation.jpg)
	 * Tags: NotReplicated
	 */
	UseLocalSpace: boolean;
	/**
	 * **GetClassIcon** provides a dictionary that allows the display of a class' Explorer window icon, e.g. calling this function with “Part” returns property values that display the part icon from the Explorer window.
	 *
	 * Below is a literal table representation of the value returned when this function is called with `"Part"`.
	 *
	 * {
	 * 	Image = "rbxasset://textures/ClassImages.png",
	 * 	ImageRectOffset = Vector2.new(16, 0),
	 * 	ImageRectSize = Vector2.new(16, 16)
	 * }
	 *
	 * The utility function below may prove useful when displaying class icons:
	 *
	 * local StudioService = game:GetService("StudioService")
	 * local imageLabel = script.Parent
	 * local function displayClassIcon(image, className)
	 * 	for k, v in pairs(StudioService:GetClassIcon(className)) do
	 * 		image\[k\] = v -- Set property
	 * 	end
	 * end
	 * displayClassIcon(imageLabel, "Part")
	 */
	GetClassIcon(this: StudioService, className: string): object;
	/**
	 * Returns the studio user's userId if they're logged in, otherwise returns 0.
	 */
	GetUserId(this: StudioService): number;
	GizmoRaycast(this: StudioService, origin: Vector3, direction: Vector3, raycastParams?: RaycastParams): RaycastResult;
	/**
	 * This function prompts the current Studio user to select one file, which will then be loaded as a [File](https://developer.roblox.com/en-us/api-reference/class/File).
	 *
	 * See also
	 * --------
	 *
	 * *   [StudioService:PromptImportFiles](https://developer.roblox.com/en-us/api-reference/function/StudioService/PromptImportFiles), the same function but for loading a list of files instead of a single file
	 * Tags: Yields
	 */
	PromptImportFile(this: StudioService, fileTypeFilter?: Array<any>): Instance | undefined;
	/**
	 * This function prompts the current Studio user to select one or more files, which will then be loaded as [Files](https://developer.roblox.com/en-us/api-reference/class/File).
	 *
	 * Throws an error if the fileTypeFilter was an empty list.
	 *
	 * See also
	 * --------
	 *
	 * *   [StudioService:PromptImportFile](https://developer.roblox.com/en-us/api-reference/function/StudioService/PromptImportFile), the same function but for loading a single file instead of a list of files
	 * Tags: Yields
	 */
	PromptImportFiles(this: StudioService, fileTypeFilter?: Array<any>): Array<Instance>;
}

interface StudioTheme extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_StudioTheme: unique symbol;
	/**
	 * The **GetColor()** function returns the [Color3](https://developer.roblox.com/en-us/api-reference/datatype/Color3) corresponding to the arguments provided. For instance, if you would like to get the [Color3](https://developer.roblox.com/en-us/api-reference/datatype/Color3) of the Studio “MainButton” when it's **disabled**, you can use the following code:
	 *
	 * settings().Studio.Theme:GetColor(Enum.StudioStyleGuideColor.MainButton, Enum.StudioStyleGuideModifier.Disabled)
	 *
	 * See the [StudioStyleGuideColor](https://developer.roblox.com/en-us/api-reference/enum/StudioStyleGuideColor) reference for a list of Studio elements and [StudioStyleGuideModifier](https://developer.roblox.com/en-us/api-reference/enum/StudioStyleGuideModifier) for a list of modifiers.
	 */
	GetColor(
		this: StudioTheme,
		styleguideitem: CastsToEnum<Enum.StudioStyleGuideColor>,
		modifier?: CastsToEnum<Enum.StudioStyleGuideModifier>,
	): Color3;
}

interface SurfaceAppearance extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_SurfaceAppearance: unique symbol;
	/**
	 * This property determines how the alpha channel of the [SurfaceAppearance.ColorMap](https://developer.roblox.com/en-us/api-reference/property/SurfaceAppearance/ColorMap) of a [SurfaceAppearance](https://developer.roblox.com/en-us/api-reference/class/SurfaceAppearance) is used.
	 *
	 * When AlphaMode is set to [Transparency](https://developer.roblox.com/en-us/api-reference/enum/AlphaMode) and the [MeshPart.Transparency](https://developer.roblox.com/en-us/api-reference/property/BasePart/Transparency) is set to 0, opaque pixels in the SurfaceAppearance's ColorMap will render as completely opaque in the 3D scene. This solves various problems for textures with different transparent and opaque areas, such as foliage. When parts of the surface are fully opaque, the Roblox engine can render them with proper depth-based occlusion. Opaque surfaces also generally work better with depth-based effects like DepthOfField, glass and water refraction, and water reflection.
	 *
	 * MeshPart.TextureId vs SurfaceAppearance:
	 *
	 * ![Foliage comparison](https://developer.roblox.com/assets/bltc11b6d62483163b0/leaves-comparison.gif)
	 *
	 * Here is an example of a fern color map. Only the pixels on the leaves have full alpha.
	 *
	 * ![Alpha fern](https://developer.roblox.com/assets/blt1a2e3175d2522842/fern-color.png)
	 */
	AlphaMode: Enum.AlphaMode;
	/**
	 * This property determines the color and opacity of the surface. This texture is sometimes called the albedo texture. The alpha channel of this texture controls its opacity, which behaves differently based on the [SurfaceAppearance.AlphaMode](https://developer.roblox.com/en-us/api-reference/property/SurfaceAppearance/AlphaMode) setting.
	 */
	ColorMap: string;
	/**
	 * This property determines which parts of the surface are metal and are non-metal. A metalness map is a grayscale image where black pixels correspond to non-metals and white pixels correspond to metals.
	 *
	 * Metals only reflect light the same color as the metal, and they reflect much more light than non-metals. Most materials in the real world can be categorized either metals or non-metals. For this reason, most pixels in a metalness map will be either pure black or pure white. Values in between are typically used to simulate dirt or grunge on top of an underlying metal area.
	 *
	 * Here's an example of a piece of metal with a layer of paint on top. Most paints are non-metallic, so the metalness map is black everywhere except on unpainted metal parts and spots where the paint has chipped away and the underlying metal is visible.
	 *
	 * ![Metalness jetpack](https://developer.roblox.com/assets/blt0a658c7367d5cdab/jetpack.gif)
	 *
	 * ![Map explanation](https://developer.roblox.com/assets/blt96558be20f7b7a1a/metalness-explained.png)
	 *
	 * Note
	 * ----
	 *
	 * *   When [Lighting.EnvironmentSpecularScale](https://developer.roblox.com/en-us/api-reference/property/Lighting/EnvironmentSpecularScale) is 0, metalness has no effect. For the most realistic reflections, setting EnvironmentSpecularScale and [Lighting.EnvironmentDiffuseScale](https://developer.roblox.com/en-us/api-reference/property/Lighting/EnvironmentDiffuseScale) to 1, and [Lighting.Ambient](https://developer.roblox.com/en-us/api-reference/property/Lighting/Ambient) and [Lighting.OutdoorAmbient](https://developer.roblox.com/en-us/api-reference/property/Lighting/OutdoorAmbient) to (0,0,0) is recommended.
	 */
	MetalnessMap: string;
	/**
	 * This property modifies the lighting of the surface by adding bumps, dents, cracks, and curves without adding more polygons.
	 *
	 * Normal maps are RGB images that modify the surface's normal vector used for lighting calculations. The R, G, and B channels of the NormalMap correspond to the X, Y, and Z components of the local surface vector respectively, and byte values of 0 and 255 for each channel correspond linearly to normal vector components of -1 and 1.016 respectively. This range is stretched slightly from -1 to 1 so that a byte value of 127 maps to exactly 0. The normal vector's Z axis is always defined as the direction of the underlying mesh's normal. A uniform (127,127,255) image translates to a completely flat normal map where the normal is everywhere perpendicular to the mesh surface. This format is called “tangent space” normal maps. Roblox does not support world space or object space normal maps.
	 *
	 * Incorrectly flipped normal components can make bumps appear like indents. If you import a normal map and notice the lighting looks off, you may need to invert the G channel of the image. The X and Y axes of the tangent space frame correspond to the X and Y directions in the image after it's transformed by the mesh UVs. If you view your normal map in an image editor as if it were displayed on a surface, normals pointing towards the right side of the screen should appear more red, and normals pointing towards the top side of your screen should appear more green.
	 *
	 * ![Bread normal map](https://developer.roblox.com/assets/blt013e67a5f211cd0d/bread-nmap.png)
	 *
	 * The terms “DirectX format” and “OpenGL format” are sometimes used to describe whether the G channel of the normal map is inverted or not. Roblox expects the OpenGL format.
	 *
	 * Note
	 * ----
	 *
	 * Roblox expects imported meshes to include tangents. Modeling software may also refer to this as “tangent space” information. If you apply a normal map and it does not seem to make any visual difference, you may need to re-export your mesh along with its tangent information from modeling software.
	 */
	NormalMap: string;
	/**
	 * This property determines the apparent roughness across the surface. A roughness map is a grayscale image where black pixels correspond to a maximally smooth surface, and white pixels correspond to a maximally rough surface.
	 *
	 * Roughness refers to how much variation the surface has on a very small scale. Reflections on smooth surfaces are sharp and concentrated. Reflections on rough surfaces are more blurry and dispersed.
	 */
	RoughnessMap: string;
}

/** TaskScheduler is a read-only settings class responsible for the Task Scheduler feature.
 * Can be found in Roblox Studio's settings with the name _Task Scheduler_.
 */
interface TaskScheduler extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_TaskScheduler: unique symbol;
	/**
	 * The average time divided by the average interval of the duty cycle.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly SchedulerDutyCycle: number;
	/**
	 * The current average rate of the task scheduler.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly SchedulerRate: number;
	/**
	 * The specified thread pooling configuration for the task scheduler.
	 */
	ThreadPoolConfig: Enum.ThreadPoolConfig;
	/**
	 * The current size of the thread pool.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly ThreadPoolSize: number;
}

interface TerrainDetail extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_TerrainDetail: unique symbol;
	ColorMap: string;
	MetalnessMap: string;
	NormalMap: string;
	RoughnessMap: string;
}

interface TerrainRegion extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_TerrainRegion: unique symbol;
	/**
	 * Calling this method transforms the TerrainRegion into a [TerrainRegion](https://developer.roblox.com/en-us/api-reference/class/TerrainRegion) usable for [Terrain](https://developer.roblox.com/en-us/api-reference/class/Terrain). This can only be done from a plugin, when in edit mode.
	 *
	 * The game can't be running, nor can it have a [NetworkServer](https://developer.roblox.com/en-us/api-reference/class/NetworkServer).
	 * Tags: Deprecated
	 * @deprecated
	 */
	ConvertToSmooth(this: TerrainRegion): void;
}

/** The TestService is a service used by Roblox internally to run analytical tests on their engine.
 * It makes it possible to write sophisticated tests right inside a game.
 *
 * Macros
 * ------
 *
 * Scripts that are executed inside of the TestService (via [TestService:Run](https://developer.roblox.com/en-us/api-reference/function/TestService/Run)) have access to special macros that directly invoke functions under the TestService. Macros are essentially substitutions for large blocks of code that shouldn't need to be rewritten each time you want to call them.
 *
 * ### RBX\_CHECK
 *
 * This macro does tests with calls to the [TestService:Check](https://developer.roblox.com/en-us/api-reference/function/TestService/Check) function.
 *
 * Macro
 *
 * Test Condition
 *
 * RBX\_CHECK(cond)
 *
 * cond == true
 *
 * RBX\_CHECK\_MESSAGE(cond, failMsg)
 *
 * cond == true
 *
 * RBX\_CHECK\_THROW(CODE)
 *
 * pcall(function () CODE end) == false
 *
 * RBX\_CHECK\_NO\_THROW(CODE)
 *
 * pcall(function () CODE end) == true
 *
 * RBX\_CHECK\_EQUAL(a,b)
 *
 * a == b
 *
 * RBX\_CHECK\_NE(a,b)
 *
 * a ~= b
 *
 * RBX\_CHECK\_GE(a,b)
 *
 * a >= b
 *
 * RBX\_CHECK\_LE(a,b)
 *
 * a <= b
 *
 * RBX\_CHECK\_GT(a,b)
 *
 * a > b
 *
 * RBX\_CHECK\_LT(a,b)
 *
 * a < b
 *
 * ### RBX\_REQUIRE
 *
 * This macro does tests with calls to the [TestService:Require](https://developer.roblox.com/en-us/api-reference/function/TestService/Require) function.
 *
 * Macro
 *
 * Test Condition
 *
 * RBX\_REQUIRE(cond)
 *
 * cond == true
 *
 * RBX\_REQUIRE\_MESSAGE(cond, failMsg)
 *
 * cond == true
 *
 * RBX\_REQUIRE\_THROW(CODE)
 *
 * pcall(function () CODE end) == false
 *
 * RBX\_REQUIRE\_NO\_THROW(CODE)
 *
 * pcall(function () CODE end) == true
 *
 * RBX\_REQUIRE\_EQUAL(a,b)
 *
 * a == b
 *
 * RBX\_REQUIRE\_NE(a,b)
 *
 * a ~= b
 *
 * RBX\_REQUIRE\_GE(a,b)
 *
 * a >= b
 *
 * RBX\_REQUIRE\_LE(a,b)
 *
 * a <= b
 *
 * RBX\_REQUIRE\_GT(a,b)
 *
 * a > b
 *
 * RBX\_REQUIRE\_LT(a,b)
 *
 * a < b
 *
 * ### RBX\_WARN
 *
 * This macro does tests with calls to the [TestService:Warn](https://developer.roblox.com/en-us/api-reference/function/TestService/Warn) function.
 *
 * Macro
 *
 * Test Condition
 *
 * RBX\_WARN(cond)
 *
 * cond == true
 *
 * RBX\_WARN\_MESSAGE(cond, failMsg)
 *
 * cond == true
 *
 * RBX\_WARN\_THROW(CODE)
 *
 * pcall(function () CODE end) == false
 *
 * RBX\_WARN\_NO\_THROW(CODE)
 *
 * pcall(function () CODE end) == true
 *
 * RBX\_WARN\_EQUAL(a,b)
 *
 * a == b
 *
 * RBX\_WARN\_NE(a,b)
 *
 * a ~= b
 *
 * RBX\_WARN\_GE(a,b)
 *
 * a >= b
 *
 * RBX\_WARN\_LE(a,b)
 *
 * a <= b
 *
 * RBX\_WARN\_GT(a,b)
 *
 * a > b
 *
 * RBX\_WARN\_LT(a,b)
 *
 * a < b
 *
 * ### Additional Macros
 *
 * Macro
 *
 * Description
 *
 * RBX\_ERROR(msg)
 *
 * Directly calls the \`TestService/Error\` function.
 *
 * RBX\_FAIL(msg)
 *
 * Directly calls the \`TestService/Fail\` function.
 *
 * RBX\_MESSAGE(msg)
 *
 * Directly calls the \`TestService/Message\` function.
 *
 * See Also
 * --------
 *
 * *   [Speeding Roblox Development with Continuous Testing](http://blog.roblox.com/2012/04/speeding-roblox-development-with-continuous-testing)
 */
interface TestService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_TestService: unique symbol;
	/**
	 * If set to true, the game will start running when the TestService's [TestService:Run](https://developer.roblox.com/en-us/api-reference/function/TestService/Run) method is called.
	 */
	AutoRuns: boolean;
	/**
	 * A description of the test being executed.
	 */
	Description: string;
	/**
	 * Measures how many errors have been recorded in the test session.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly ErrorCount: number;
	/**
	 * When set to true, the TestService will be executed when using the _Run_ action in Roblox Studio.
	 *
	 * Notes
	 * -----
	 *
	 * *   If the [TestService.NumberOfPlayers](https://developer.roblox.com/en-us/api-reference/property/TestService/NumberOfPlayers) property is set to a value above 0, running the game will open `NumberOfPlayers + 1` studio windows, where one window is a server, and the rest are players connected to that server.
	 *     *   Try to keep this value within a rational range (1 to 8 players at most), or else your computer's CPU will get overloaded.
	 */
	ExecuteWithStudioRun: boolean;
	/**
	 * Sets whether or not the physics engine should be throttled to 30 FPS while the test is being ran.
	 */
	Is30FpsThrottleEnabled: boolean;
	/**
	 * Sets whether or not the physics environment should be throttled while running this test.
	 */
	IsPhysicsEnvironmentalThrottled: boolean;
	/**
	 * Sets whether or not physics objects will be allowed to fall asleep while the test simulation is running.
	 */
	IsSleepAllowed: boolean;
	/**
	 * The number of players expected in this test, if any.
	 */
	NumberOfPlayers: number;
	/**
	 * Sets a specific amount of additional latency experienced by players during the test session.
	 */
	SimulateSecondsLag: number;
	/**
	 * Measures how many test calls have been recorded in the test session.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly TestCount: number;
	/**
	 * The maximum amount of time that tests are allowed to run for.
	 */
	Timeout: number;
	/**
	 * Measures how many warning calls have been recorded in the test session.
	 * Tags: ReadOnly, NotReplicated
	 */
	readonly WarnCount: number;
	/**
	 * If condition is true, prints "Check passed: ", followed by description to the output, in blue text. Otherwise, prints "Check failed: ", again, followed by description, but in red text.
	 */
	Check(this: TestService, condition: boolean, description: string, source?: Instance, line?: number): void;
	/**
	 * Prints “Test checkpoint: ”, followed by text, to the output, in blue text.
	 */
	Checkpoint(this: TestService, text: string, source?: Instance, line?: number): void;
	/**
	 * Prints Testing Done to the output, in blue text.
	 */
	Done(this: TestService): void;
	/**
	 * Prints a red message to the output, prefixed by `TestService:` .
	 */
	Error(this: TestService, description: string, source?: Instance, line?: number): void;
	/**
	 * Indicates a fatal error in a TestService run.
	 *
	 * If this is called inside of a script running inside of the TestService, this will initiate a [breakpoint](https://developer.roblox.com/articles/Lua-debugger "Lua Debugger") on the line that invoked the error.
	 */
	Fail(this: TestService, description: string, source?: Instance, line?: number): void;
	/**
	 * Prints Test message, followed by text to the output, in blue text.
	 */
	Message(this: TestService, text: string, source?: Instance, line?: number): void;
	/**
	 * If `condition` is true, prints `Require passed:` , followed by `description`, to the output in blue text. Otherwise, prints `Require failed. Test ended:` , followed by `description`, to the output in red text.
	 */
	Require(this: TestService, condition: boolean, description: string, source?: Instance, line?: number): void;
	ScopeTime(this: TestService): object;
	/**
	 * If condition is true, prints Warning passed: , followed by description, to the output, in blue text. Otherwise, prints Warning: , followed by description, to the output, in yellow text.
	 */
	Warn(this: TestService, condition: boolean, description: string, source?: Instance, line?: number): void;
	isFeatureEnabled(this: TestService, name: string): boolean;
	/**
	 * Runs scripts which are parented to TestService.
	 * Tags: Yields
	 */
	Run(this: TestService): void;
	/**
	 * Fired when the server should collect a conditional test result.
	 */
	readonly ServerCollectConditionalResult: RBXScriptSignal<
		(condition: boolean, text: string, script: LuaSourceContainer, line: number) => void
	>;
	/**
	 * Fired when the server should collect a test result.
	 */
	readonly ServerCollectResult: RBXScriptSignal<(text: string, script: LuaSourceContainer, line: number) => void>;
}

interface VersionControlService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_VersionControlService: unique symbol;
}

interface VoiceChatService extends Instance {
	/**
	 * **DO NOT USE!**
	 *
	 * This field exists to force TypeScript to recognize this as a nominal type
	 * @hidden
	 * @deprecated
	 */
	readonly _nominal_VoiceChatService: unique symbol;
	EnableDefaultVoice: boolean;
}
