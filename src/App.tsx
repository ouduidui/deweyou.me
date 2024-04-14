import type { Component } from 'solid-js'
import { Avatar, Background, ButtonGroup, Summary } from './components'
import { AppProvider, I18nProvider } from './contexts'

const App: Component = () => {
  return (
    <AppProvider>
      <I18nProvider>
        <div class="select-none w-screen bg-slate-100 dark:bg-zinc-950">
          <div class="container h-screen mx-auto px-4 flex flex-col ">
            <div class="flex-1 flex flex-col justify-center pt-20 pb-40">
              <Avatar></Avatar>
              <Summary></Summary>
            </div>
            <ButtonGroup></ButtonGroup>
          </div>
          <Background></Background>
        </div>
      </I18nProvider>
    </AppProvider>
  )
}

export default App
