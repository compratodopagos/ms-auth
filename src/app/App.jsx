import './App.css'
import { RouterProvider } from './router'
import { ThemeProvider, ThemeToggle } from '@compratodo/ui-components'

import { Provider } from 'react-redux'
import store from './store'

function App() {
  return (
    <>
      <ThemeProvider>
        <Provider store={store}>
          <RouterProvider />
        </Provider>
      </ThemeProvider>
    </>
  )
}

export default App
