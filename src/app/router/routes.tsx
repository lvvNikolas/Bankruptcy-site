import { useRoutes } from 'react-router-dom'
import Home from '@pages/Home/Home'
import Services from '@pages/Services/Services'
import Debts from '@pages/Debts/Debts'
import Process from '@pages/Process/Process'
import Prices from '@pages/Prices/Prices'
import FAQ from '@pages/FAQ/FAQ'
import Contacts from '@pages/Contacts/Contacts'

export const AppRoutes = () => useRoutes([
  { path: '/', element: <Home/> },
  { path: '/uslugi', element: <Services/> },
  {path: '/dolg', element: <Debts/> },
  { path: '/process', element: <Process/> },
  { path: '/ceny', element: <Prices/> },
  { path: '/faq', element: <FAQ/> },
  { path: '/kontakty', element: <Contacts/> }
])