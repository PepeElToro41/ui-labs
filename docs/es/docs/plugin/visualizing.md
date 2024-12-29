# Visualización de Historias

En este momento, ya deberías saber cómo crear una historia. Ahora veamos cómo puedes visualizarla.

UI Labs filtrará la estructura de tu juego para encontrar módulos `.story`. Estos aparecerán como *Unknown* (desconocidos) en el explorador de UI Labs si no has creado un [Storybook](/es/docs/storybooks.md) para ellos.

<img class="image-label" src="/docs/plugin/visualize/storyinexplorer.png" alt="storyinexplorer" width="300"/>

Hablaremos sobre los storybooks más adelante, por ahora, abre la historia que creaste.

<img class="image-label" src="/docs/plugin/visualize/storyviewed.png" alt="storyviewed" width="300"/>

::: details Historia Utilizada
Para esta guía, vamos a usar la siguiente historia:

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

¡Ya tenemos nuestra historia!, pero no está centrada y el texto es demasiado pequeño. Vamos a solucionarlo.

## Mover la Vista

Puedes mover tu lienzo de las siguientes maneras:
   
- Mantén presionado <span class="item-description">Botón Medio</span> y arrastra.<br/>
- Mantén presionado <span class="item-description">Ctrl / Command</span> y arrastra con el <span class="item-description">Clic Izquierdo</span>

---

<img class="image-label" src="/docs/plugin/visualize/storymoved.png" alt="Story Viewed" width="300" />

¡Genial!, pero ahora el texto es demasiado pequeño, ¿qué podemos hacer al respecto?

<div class="image-tip-holder" style="padding-top: 53px;">
   <div style="position: relative;">
      <img class="image-label" src="/docs/plugin/toolbar.png" alt="Zoom Buttons">
      <div class="zoom-selector" />
   </div>
</div>

## Acercar / Alejar
<div class="side-img-text">
Puedes acercarte u alejarte al:

-  Usar las lupas de la barra de herramientas lateral
-  Mantener presionado <span class="item-description">Shift</span> y desplazando la rueda del ratón arriba/abajo

<img class="image-label" src="/docs/plugin/visualize/storyzoomed.png" alt="Story Zoomed" width="300"/>

</div>

¡Genial!, ahora podemos ver nuestra historia con más claridad.

::: warning Escalado de Interfaces
   UI Labs utiliza [UIScale](https://create.roblox.com/docs/reference/engine/classes/UIScale) para hacer zoom.<br/>
   Dependiendo de tu configuración o las limitaciones de Roblox, el zoom podría dar resultados inesperados.
:::

## Restablecer la Vista

Puedes restablecer la posición y el zoom haciendo <span class="item-description">Clic Derecho</span> en la vista previa de tu historia y seleccionando <span class="button-reference">Reset Position</span> <span class="tiphelp">(Restablecer Posición)</span> o <span class="button-reference">Reset Zoom</span> <span class="tiphelp">(Restablecer Zoom)</span>

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

## Usar la Vista del Juego &nbsp; <span class="item-description">Q</span>

<div class="side-img-text">
Puedes observar tu historia dentro de la vista del juego.
Para lograr esto debes presionar en el botón <b>View on Viewport</b> <span class="tiphelp">(Ver en la Vista del Juego)</span> de la barra de herramientas lateral.

Una vez presionado, UI Labs acomodará tu interfaz a la vista del juego. Presiona de nuevo el botón para volver a la vista de UI Labs.

<span class="tiphelp">No se aplicará posición ni zoom aquí.</span>
<img class="image-label" src="/docs/plugin/visualize/inviewport.png" alt="viewport" />
</div>