import { AppRoutes } from './router/routes'
import Shell from './layout/Shell'

export default function App(){
  return (
    <Shell>
      <AppRoutes/>
    </Shell>
  )
}