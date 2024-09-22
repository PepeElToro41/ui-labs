import { cleanup, Source } from "@rbxts/vide";



export function ListenHovered(source: Source<boolean>) {
   return (gui: GuiObject) => {
      const enter = gui.MouseEnter.Connect(() => source(true))
      const leave = gui.MouseLeave.Connect(() => source(false))

      cleanup(() => {
         enter.Disconnect()
         leave.Disconnect()
      })
   }
}

type Action<T> = (component: T) => void
export function mergeActions<T>(...args: Action<T>[]) {
   return (component: T) => {
      args.forEach(action => action(component))
   }
}