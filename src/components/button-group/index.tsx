import { type Component, Match, Switch, createMemo, useContext } from 'solid-js'
import { AppContext } from '../../contexts'

export const ButtonGroup: Component = () => {
  const [store, actions] = useContext(AppContext)
  const baseClassName = createMemo(() => 'w-6 h-6 text-gray-500 cursor-pointer opacity-70 hover:opacity-100')
  return (
    <div class="fixed bottom-0 w-screen left-1/2 -translate-x-1/2 bg-slate-100 dark:bg-zinc-950 flex justify-center">
      <div class="flex container gap-4 align-center justify-end p-4">
        <Switch>
          <Match when={store.colorMode === 'light'}>
            <span onClick={() => actions.changeColorMode('dark')} class={`${baseClassName()} icon-[line-md--moon-alt-to-sunny-outline-loop-transition]`}></span>
          </Match>
          <Match when={store.colorMode === 'dark'}>
            <span onClick={() => actions.changeColorMode('light')} class={`${baseClassName()} icon-[line-md--sunny-outline-to-moon-alt-loop-transition]`}></span>
          </Match>
        </Switch>
        <span onClick={() => window.open('https://github.com/ouduidui/deweyou.me')} class={`${baseClassName()} icon-[line-md--github-loop]`}></span>
        <span
          class={`${baseClassName()} icon-[icon-park-outline--translate]`}
          onClick={() => {
            actions.changeLocale(store.locale === 'en' ? 'cn' : 'en')
          }}
        >
        </span>
      </div>
    </div>
  )
}
