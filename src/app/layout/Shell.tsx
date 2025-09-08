import Header from '@widgets/Header/Header'
import Footer from '@widgets/Footer/Footer'
import styles from './Shell.module.css'

export default function Shell({children}:{children:React.ReactNode}){
  return (
    <div className={styles.wrap}>
      <Header/>
      <main className="container">{children}</main>
      <Footer/>
    </div>
  )
}