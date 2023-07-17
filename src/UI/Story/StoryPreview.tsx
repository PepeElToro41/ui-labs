import { useAsyncEffect, useEventListener } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useContext, useEffect, useMemo, useRef, useState, withHooksPure } from "@rbxts/roact-hooked";
import { _UILabsInternal as UL } from "@rbxts/ui-labs/out/Internal";
import { ActionsContext } from "UI/Contexts/ActionsContext";
import { useConnections } from "UI/Contexts/GlobalConnections";
import { MouseIconContext } from "UI/Contexts/Mouse/MouseIconContext";
import { PluginContext } from "UI/Contexts/PluginContext";
import { useSettingsContext } from "UI/Contexts/SettingsContext";
import { useCanvasControl } from "UI/Hooks/useCanvasControl";
import useMeasureTool from "UI/Hooks/useMeasureTool";
import useUILabsInput from "UI/Hooks/useUILabsInput";
import MeasureFrame from "UI/UIUtils/MeasureFrame";
import { LoadStoryModule } from "Utils/StoryUtils";

interface StoryPreviewProps {
	StoryHandle: StoryHandle | undefined;
}

function getFramePos(frame: Frame, pos: Vector2) {
	return pos.sub(frame.AbsolutePosition);
}

function StoryPreviewCreate(props: StoryPreviewProps) {
	//Preview states
	const [onViewport, setOnViewport] = useState(false);
	const [previewFrame, setPreviewFrame] = useState<Frame | undefined>(undefined);
	const pluginPreviewRef = useRef<Frame>();
	const viewportPreviewRef = useRef<Frame>();
	const connections = useConnections();
	const toolbarConnections = connections.Toolbar;
	const mouseIconContext = useContext(MouseIconContext);
	const [measureStart, setMeasureStart] = useState<Vector2 | undefined>(undefined);
	const mainFrame = useRef<Frame>();
	const [frameAbsPos, setFrameAbsPos] = useState(Vector2.zero);
	const [toolStarted, setToolStarted] = useState(false);
	const canvasInputs = useUILabsInput(onViewport, connections.MouseMoved);
	const actionsContext = useContext(ActionsContext);
	const settings = useSettingsContext();

	const [zoom, posShift, setZoom, setPosShift] = useCanvasControl(mouseIconContext, canvasInputs);
	useEffect(() => {
		const frame = mainFrame.getValue();
		if (frame) {
			const changedConnection = frame.GetPropertyChangedSignal("AbsolutePosition").Connect(() => {
				setFrameAbsPos(frame.AbsolutePosition);
			});
			setFrameAbsPos(frame.AbsolutePosition);
			return () => {
				changedConnection.Disconnect();
			};
		} else {
			setFrameAbsPos(Vector2.zero);
			return;
		}
	}, [mainFrame.getValue()]);
	const onToolActivated = (active: boolean, startMousePos?: Vector2) => {
		if (active) {
			setMeasureStart(startMousePos);
		} else {
			setMeasureStart(undefined);
		}
	};
	useMeasureTool(mouseIconContext, canvasInputs, toolStarted, onToolActivated);
	//Story Toolbar connections
	useEventListener(toolbarConnections.InViewport, (enabled) => {
		setOnViewport(enabled);
	});
	useEventListener(toolbarConnections.Explore, () => {
		game.GetService("Selection").Set([previewFrame!]);
	});
	useEventListener(toolbarConnections.Measure, (enabled: boolean) => {
		setToolStarted(enabled);
	});
	useEventListener(toolbarConnections.ZoomIn, () => {
		setZoom((oldZoom) => {
			let newZoom = oldZoom + 0.1;
			newZoom = math.round(newZoom * 10) / 10;
			return newZoom;
		});
	});
	useEventListener(toolbarConnections.ZoomOut, () => {
		setZoom((oldZoom) => {
			let newZoom = oldZoom - 0.1;
			newZoom = math.round(newZoom * 10) / 10;
			return newZoom;
		});
	});
	//This one loads the story module to be the final UI preview
	useEffect(() => {
		if (!props.StoryHandle) {
			actionsContext.ActionsAPI.SetSummary(undefined); //Resetting Summary
			actionsContext.ActionsAPI.SetControls(undefined); //Resetting Controls
			return;
		}
		let Unmounter: UL.Unmounter | undefined;
		const frame = previewFrame;
		if (!frame) return;
		if (props.StoryHandle && !props.StoryHandle.Error && props.StoryHandle.Result) {
			const [sucess, mountType, cleanup, updater] = pcall(
				LoadStoryModule,
				props.StoryHandle,
				settings,
				frame,
				actionsContext,
				canvasInputs,
			);
			if (sucess) {
				if (!mountType) {
					warn("The story mounting didnt finished correctly");
				} else if (mountType === "Hoarcekat") {
					if (typeIs(cleanup, "function")) {
						Unmounter = cleanup;
					} else {
						warn(
							"The story didnt return a cleanup function, this might cause a memory leak\n\nRestarting studio is recommended",
						);
					}
				} else if (mountType === "Roact" || mountType === "React") {
					Unmounter = cleanup;
				}
			} else {
				warn("There was an error executing the story: \n" + mountType + "\n\n The cleanup function was not executed");
			}
		}
		return () => {
			if (Unmounter) {
				const [sucess, err] = pcall(Unmounter);
				if (!sucess) {
					warn(
						"There was an error executing the cleanup function of the story: \n" +
							err +
							"\nthis might cause a memory leak\n\nRestarting studio is recommended",
					);
				}
			}
		};
	}, [props.StoryHandle]);
	//Creating a frame for the Story UI
	useEffect(() => {
		//Cant afford this to be destroyed or children-cleared by roact so I create the preview frame with roblox instances
		const newFrame = new Instance("Frame");
		newFrame.Size = new UDim2(1, 0, 1, 0);
		newFrame.Position = new UDim2(0, 0, 0, 0);
		newFrame.BackgroundTransparency = 1;
		newFrame.Parent = pluginPreviewRef.getValue();
		setPreviewFrame(newFrame);
		return () => {
			newFrame.Destroy();
		};
	}, []);
	//Parenting the previewFrame to the viewportPreview or pluginPreview
	useEffect(() => {
		const pluginPreview = pluginPreviewRef.getValue();
		const viewportPreview = viewportPreviewRef.getValue();
		if (previewFrame === undefined) return;
		if (onViewport) {
			if (!viewportPreview) return;
			previewFrame.Parent = viewportPreview;
		} else {
			if (!pluginPreview) return;
			previewFrame.Parent = pluginPreview;
		}
	}, [onViewport]);

	return (
		<>
			<frame
				Key="PreviewPanel"
				BackgroundTransparency={1}
				Size={new UDim2(1, -40, 1, 0)}
				Position={new UDim2(0, 40, 0, 0)}
				Ref={mainFrame}
				Event={{
					InputBegan: (_, inputObject: InputObject) => {
						if (!onViewport) {
							canvasInputs.InputBegan.Fire(inputObject, false, true);
						}
					},
					InputEnded: (_, inputObject: InputObject) => {
						if (!onViewport) {
							canvasInputs.InputEnded.Fire(inputObject, false, true);
						}
					},
					InputChanged: (_, inputObject: InputObject) => {
						if (!onViewport) {
							canvasInputs.InputChanged.Fire(inputObject, false, true);
						}
					},
				}}
			>
				{measureStart ? (
					<MeasureFrame
						MouseListener={canvasInputs.MouseMoved}
						StartMouse={measureStart}
						SizeMultiplier={zoom}
						FrameStart={frameAbsPos}
					></MeasureFrame>
				) : undefined}
				<frame
					Key={"PreviewCanvas"}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromOffset(posShift.X, posShift.Y)}
					Ref={pluginPreviewRef}
				>
					<uiscale Scale={zoom}></uiscale>
				</frame>
			</frame>
			<Roact.Portal target={game.GetService("CoreGui")}>
				<screengui Key="UIStory" ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
					<frame
						Key="PreviewFrame"
						BackgroundTransparency={1}
						Size={new UDim2(1, 0, 1, 0)}
						Position={new UDim2(0, 0, 0, 0)}
						Ref={viewportPreviewRef}
					/>
				</screengui>
			</Roact.Portal>
		</>
	);
}
const StoryPreview = withHooksPure(StoryPreviewCreate);

export = StoryPreview;
