# Visualizing Stories

At this point, you should know how to create a story. Now let's see how you can visualize it.


UI Labs will search for `.story` modules in your game tree. These will appear as *Unknown* in the UI Labs explorer if you haven't created a [Storybook](/docs/storybooks.md) for them.

<img class="image-label" src="/docs/plugin/visualize/storyinexplorer.png" alt="storyinexplorer" width="300"/>

We'll talk about storybooks later, for now, open the story you created.

<img class="image-label" src="/docs/plugin/visualize/storyviewed.png" alt="storyviewed" width="300"/>

::: details Story Used
For this guide, we're gonna use the following story:

::: code-group
```lua [Luau]
local function story(target)
   local element = Instance.new("TextLabel")
   element.Text = "Hello UI Labs"
   element.Size = UDim2.fromOffset(250, 80)
   element.TextSize = 20
   element.Parent = target

   return function()
	   element:Destroy()
   end
end

return story
```

```ts [Roblox-TS]
function story(target: Frame) {
   const element = new Instance("TextLabel");
   element.Text = "Hello UI Labs";
   element.Size = UDim2.fromOffset(250, 80); 
   element.TextSize = 20;
   element.Parent = target;

   return () => {
      element.Destroy();
   }
}

export = story;
```

:::

We have our story here!, but it's not centered, and the text is too small. Let's fix that.


## Moving your view

   You can move your canvas around by either: 
   
- Holding <span class="item-description">Middle Click</span> and dragging.<br/>
- Holding <span class="item-description">Ctrl / Command</span> and dragging with <span class="item-description">Left Click</span>


---

<img class="image-label" src="/docs/plugin/visualize/storymoved.png" alt="Story Viewed" width="300" />


Great!, but now the text is too small so, what can we do about it?.

<div class="image-tip-holder" style="padding-top: 53px;">
   <div style="position: relative;">
      <img class="image-label" src="/docs/plugin/toolbar.png" alt="Zoom Buttons">
      <div class="zoom-selector" />
   </div>
</div>

## Zooming In / Out
<div class="side-img-text">
You can zoom in and out by either: 

-  Using the magnifying glasses at the side toolbar
-  Holding <span class="item-description">Shift</span> and scrolling Up/Down

<img class="image-label" src="/docs/plugin/visualize/storyzoomed.png" alt="Story Zoomed" width="300"/>

</div>

Nice!, now we can see our story more clearly.

::: warning Scaling Interfaces
   UI Labs uses [UIScale](https://create.roblox.com/docs/reference/engine/classes/UIScale) for zooming.<br/>
   Depending on your setup or Roblox limitations, zooming might give unexpected results.
:::

## Resetting the View 

You can reset the Position and Zoom by <span class="item-description">Right Click</span> your story preview and selecting <span class="button-reference">Reset Position</span> or <span class="button-reference">Reset Zoom</span>

<div style="position: relative; display: inline-block;">
   <img class="image-label" src="/docs/plugin/previewdropdown.png" alt="previewdropdown">
   <div class="resetview-selector" />
</div>
 

<div class="image-tip-holder" style="padding-top: 75px;">
   <div style="position: relative;" >
      <img class="image-label" src="/docs/plugin/toolbar.png" alt="toolbar">
      <div class="viewport-selector" />
   </div>
</div>

## Using the Game Viewport &nbsp; <span class="item-description">Q</span>


<div class="side-img-text">
You can visualize your story in the game viewport. For this clicking the <b>View on Viewport</b> button in the side toolbar. 

Once clicked, UI Labs will move your UI to the game viewport. Click it again to bring it back.

<span class="tiphelp">No position or zoom will be applied here.</span>
<img class="image-label" src="/docs/plugin/visualize/inviewport.png" alt="viewport" />

</div>