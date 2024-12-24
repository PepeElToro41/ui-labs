# Herramientas para Historias

UI Labs tiene unas cuantas herramientas que te pueden ayudar al visualizar tus historias.

<div class="image-tip-holder" style="padding-top: 75px;">
   <div style="position: relative;" >
      <img class="image-label" src="/docs/plugin/toolbar2.png" alt="toolbar">
      <div class="measure-selector" />
   </div>
</div>

## Herramienta de Medida
<p style="margin-right: 170px">
Puedes hacer uso de la Herramienta de Medida para medir el tamaño de una sección específica.
</p>
<p style="margin-right: 170px">
Cuando la herramienta se encuentra activa puedes hacer clic y arrastrar el mouse para cubrir un área.
</p>

- <p style="margin-right: 170px">Al mantener la tecla <span class="item-description">Alt</span> con la herramienta activa, bloquearás cualquier interacción en la historia para que puedas usar esta herramienta sin interactuar con tus componentes.</p>

<img class="image-label" src="/docs/plugin/storytools/measure.png" alt="measure" width="300"/>

<div class="image-tip-holder" style="padding-top: 75px;">
   <div style="position: relative;" >
      <img class="image-label" src="/docs/plugin/toolbar2.png" alt="toolbar">
      <div class="selectelements-selector" />
   </div>
</div>

## Búsqueda de Elementos
<p style="margin-right: 170px">
Puedes usar la herramienta de Selección de Elementos para seleccionar elementos específicos.
</p>
<p style="margin-right: 170px">
Cuando esté activa, puedes pasar el cursor sobre los elementos y hacer clic en ellos para seleccionarlos.
</p>

- <p style="margin-right: 170px"> Si mantienes presionada la tecla <span class="item-description">Shift</span> mientras haces clic, puedes seleccionar elementos más profundos que están debajo del elemento seleccionado.</p>

- <p style="margin-right: 170px"> Si mantienes presionada la tecla <span class="item-description">Alt</span> con la herramienta activa, bloquearás cualquier interacción en la historia para que puedas usar esta herramienta sin interactuar con tus componentes.</p>


<img class="image-label" src="/docs/plugin/storytools/selectelements.png" alt="measure" width="300"/>

<div class="image-tip-holder" style="padding-top: 75px;">
   <div style="position: relative;" >
      <img class="image-label" src="/docs/plugin/toolbar2.png" alt="toolbar">
      <div class="outlines-selector" />
   </div>
</div>

## Mostrar Esquema
<p style="margin-right: 170px">
Puedes activar la Herramienta de Mostrar Esquema para ver el contorno de elementos escondidos.
</p>
<p style="margin-right: 170px">
Un contorno se dibujará alrededor de cualquier elemento cuando se cumplan las siguientes condiciones:
</p>

<div style="border-width: 1px; border-style: solid; border-color: rgba(255,255,255,0.2); padding-left: 10px; padding-right: 10px; margin-right: 170px; border-radius: 10px;">

- `BackgroundTransparency` es mayor a `0.95`  
- `AbsoluteSize` es mayor a `2` en los ejes X y Y
- El componente no cubre toda el área del componente principal

</div>

<br/>

<img class="image-label" src="/docs/plugin/storytools/outlines.png" alt="measure" width="300"/>

<div class="image-tip-holder" style="padding-top: 75px;">
   <div style="position: relative;" >
      <img class="image-label" src="/docs/plugin/toolbar2.png" alt="toolbar">
      <div class="rules-selector" />
   </div>
</div>

## Regla del Cursor
<p style="margin-right: 170px">
Puedes activar la herramienta de Reglas del Cursor para mostrar la posición exacta del mouse en tu historia, incluyendo sus coordenadas X y Y.
</p>
<p style="margin-right: 170px">
Esto se vuelve especialmente útil cuando mueves tu historia, ya que el mouse se calculará en función de la posición de la historia.
</p>

<img class="image-label" src="/docs/plugin/storytools/rules.png" alt="measure" width="300"/>