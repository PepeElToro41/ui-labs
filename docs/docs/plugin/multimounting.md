# Multimounting

UI Labs allows you to mount multiple stories at the same time, even of the same module.<br/>
This is useful for creating drafts with separated components, or compare different stories.

Each of these stories will have their own environment, and will not interact with each other.
They will also update changes independently.

To do this, <span class="item-description">Right Click</span> your story and select <span class="button-reference">Mount On Top</span>

<div style="position: relative;">
   <img class="image-label" src="/docs/plugin/storydropdown.png" alt="mountontop">
   <div class="image-selector" style="top: 207px; left: 169px; width: 223px; height: 31px;" />
</div>


Now we have two stories mounted, you will see two tabs on top, a number at the side of the story will tell you how many of them are mounted. The ZIndex will be determined by the order of the tabs.

When you <span class="item-description">Left Click</span> a story as you would normally do, This will be mounted in the *Main Tab*.<br/>
This will also unmount the current *Main tab*.

The Main Tab will have small dot • at the start


<div style="position: relative;">
   <img class="image-label" src="/docs/plugin/multimounting/multitabs.png" alt="multitabs">
   <div class="image-selector-2" style="top: 26px; left: 217px; width: 78px; height: 29px;" />
   <div class="image-selector-2" style="top: 26px; left: 293px; width: 72px; height: 29px;" />
   
   <span class="image-desc-2" style="top: 60px; left: 214px; width: 78px; height: 29px;">• Main Tab</span>
   <span class="image-desc-2" style="top: 60px; left: 293px; width: 72px; height: 29px;">New Tab</span>
   
   <div class="image-selector" style="top: 138px; left: 182px; width: 24px; height: 24px;" />
   <span class="image-desc" style="top: 138px; left: 160px; width: 200px; height: 29px;">Tabs amount</span>
</div>


::: tip Selected Tab

Plugin actions will be applied to the selected tab such as:

   - Toolbar Buttons
   - Controls
   - Moving and Zooming

:::


## Mounting in Widget

You can use a separated widget window for your stories.<br/>
This enables fullscreen mode, distraction-free GUIs, plugin-like visualization, and multi-monitor setups.

Right click your story and choose Mount In Widget

<div style="position: relative;">
   <img class="image-label" src="/docs/plugin/multimounting/mountinwidget.png" alt="mountinwidget">
   
   <div class="image-selector" style="top: 27px; left: 292px; width: 85px; height: 29px;" />
   <span class="image-desc" style="top: 62px; left: 285px; width: 100px; height: 29px;">Widget Tab</span>
   
   <div class="image-selector" style="top: 311px; left: 362px; width: 362px; height: 204px;" />
   <span class="image-desc" style="top: 280px; left: 360px; width: 150px; height: 29px;">Separated Window</span>

   <div class="image-selector" style="top: 196px; left: 93px; width: 192px; height: 29px;" />
</div>


You can switch between Widget / Editor mode by clicking your Story Tab<br/>
and selecting <span class="button-reference">Mount in Editor</span>/<span class="button-reference">Mount in Widget</span>

<div style="position: relative; display: flex; flex-direction: row; gap: 10px;">
   <div class="image-label" style="overflow: hidden;">
      <img src="/docs/plugin/multimounting/mountineditor.png" alt="hide" style="margin-bottom: -170px;">
      <div class="image-selector" style="top: 52px; left: 62px; width: 220px; height: 32px;" />
   </div>
   <div class="image-label" style="overflow: hidden;">
      <img src="/docs/plugin/previewdropdown.png" alt="hide" style="margin-bottom: -170px;">
      <div class="image-selector" style="top: 55px; left: 40px; width: 220px; height: 32px;" />
   </div> 
</div>