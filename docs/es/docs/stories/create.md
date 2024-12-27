# Crear Historias

## Cómo crear una Historia

Las historias son `ModuleScript`s que terminan con `.story` en su nombre. Estos módulos le indicarán a UI Labs representar tus historias. 

<img class="image-label" src="/docs/stories/storyname.png" alt="storyname" />

---

</br>Estos módulos deben proporcionar la historia que se desea visualizar. En la siguiente sección aprenderemos cómo se escriben las historias.

::: code-group

```lua [Luau]
local story = ...
return story
```

```ts [Roblox-TS]
const story = ...
export = story;
```

:::

---

## Cómo Encontrar las Historias

Una vez creada una historia, esta aparecerá en el explorador de historias de UI Labs.

<img class="image-label" src="/docs/plugin/visualize/storyinexplorer.png" alt="storyinexplorer" />

::: tip Historias Desconocidas
Cualquier historia que no haya sido asignada a un [Storybook](/es/docs/storybooks.md) se encontrará dentro de <span class="item-description">Unknown Stories</span><br/> 
Aunque puedas usar esta historia ahora mismo, se recomienda agruparla eventualmente en un **Storybook**.

:::