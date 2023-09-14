/// <reference no-default-lib="true"/>
declare const plugin: Plugin;

declare function settings(): GlobalSettings;

declare function DebuggerManager(): DebuggerManager;

interface GlobalSettings extends GenericSettings {
	DebugSettings: DebugSettings;
	GameSettings: GameSettings;
	LuaSettings: LuaSettings;
	NetworkSettings: NetworkSettings;
	PhysicsSettings: PhysicsSettings;
	RenderSettings: RenderSettings;
	Studio: Studio;
}
