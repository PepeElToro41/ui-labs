# Agregar Controles

UI Labs te permite agregar controles. Estos son valores personalizables que pueden ser modificados mientras se muestra la interfaz. Esto es útil para probar diferentes valores en tu UI sin necesidad de modificar tu código.

Puedes usar los Controles de [Flipbook en UI Labs](https://flipbook-labs.github.io/flipbook/docs/writing-stories#controls), sin embargo, UI Labs permite una mayor personalización y controles más avanzados.

<img class="image-label" src="/docs/controls/controlsshowcase.png" alt="controls" />

## Configurar Controles

Puedes agregar la lista de controles en la clave <span class="item-description">controls</span> de la tabla de tus historias.<br />

Aprenderemos cómo usar los controles más adelante, pero primero veamos cómo puedes crearlos.

La tabla de controles es una lista de valores donde la clave es el nombre del control y el valor es la declaración del control.

::: code-group
```lua [Luau] {2-4,8}
local controls = {
   control1 = ...,
   control2 = ...,
   control3 = ...,
}

local story = {
   controls = controls,
   story = ...
}

return story
```

```ts [Roblox-TS] {2-4,8}
const controls = {
   control1: ...,
   control2: ...,
   control3: ...,
}

const story = {
   controls: controls,
   story: ...
}

export = story;
```

:::

---

Se pueden crear dos tipos de controles:

- [Controles Primitivos](/es/docs/controls/primitive)
- [Controles Avanzados](/es/docs/controls/advanced)
