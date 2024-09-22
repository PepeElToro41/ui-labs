# Multimounting

UI Labs allows you to mount multiple stories at the same time, even of the same module.<br/>
This is useful for creating drafts with separated components, or compare different stories.

Each of these stories will have their own environment, and will not interact with each other.
They will also update changes independently.

To do this, <span class="item-description">Right Click</span> your story and select <span class="button-reference">Mount On Top</span>

<div style="position: relative; display: inline-block;">
   <img class="image-label" src="/docs/plugin/storydropdown.png" alt="mountontop">
   <div class="mountontop-selector" />
</div>


Now we have two stories mounted, you will see two tabs on top, a number at the side of the story will tell you how many of them are mounted. The ZIndex will be determined by the order of the tabs.

When you <span class="item-description">Left Click</span> a story as you would normally do, This will be mounted in the *Main Tab*.<br/>
This will also unmount the current *Main tab*.

The Main Tab will have small dot • at the start


<div style="position: relative; display: inline-block;">
   <img class="image-label" src="/docs/plugin/multimounting/multitabs.png" alt="multitabs">
   
   <div class="main-tab-selector" />
   <span class="main-tab-description">• Main Tab</span>
   
   <div class="new-tab-selector" />
   <span class="new-tab-description">New Tab</span>
   
   <div class="tabs-amount-selector" />
   <span class="tabs-amount-description">Tabs amount</span>
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

<div style="position: relative; display: inline-block;">
   <img class="image-label" src="/docs/plugin/multimounting/mountinwidget.png" alt="mountinwidget">
   
   <div class="widget-tab-selector" />
   <span class="widget-tab-description" >Widget Tab</span>
   
   <div class="widget-window-selector" />
   <span class="widget-window-description" >Separated Window</span>

   <div class="mountinwidget-selector" />
</div>


You can switch between Widget / Editor mode by clicking your Story Tab<br/>
and selecting <span class="button-reference">Mount in Editor</span>/<span class="button-reference">Mount in Widget</span>

<div style="display: flex; flex-direction: row; gap: 10px;">
   <div class="image-label" style="overflow: hidden;">
      <div style="position: relative; margin-bottom: -170px;">
         <img src="/docs/plugin/multimounting/mountineditor.png" alt="mountineditor">
         <div class="ineditor-selector" />
      </div>
   </div>
   <div class="image-label" style="overflow: hidden;">
      <div style="position: relative; margin-bottom: -170px;">
         <img src="/docs/plugin/previewdropdown.png" alt="hide">
         <div class="inwidget-selector" />
      </div> 
   </div> 
</div> 