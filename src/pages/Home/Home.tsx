import LeadForm from '@features/LeadForm/LeadForm'
import styles from './Home.module.css'

export default function Home(){
  return (
    <section className={styles.hero}>
      <title>Банкротство физических лиц — помощь по 127-ФЗ</title>
      <meta name="description" content="Законно спишем долги. Бесплатная консультация. Прозрачная цена. Работаем по всей РФ." />
      <div className="container">
        <h1>Списание долгов законно и безопасно</h1>
        <p className={styles.sub}>Сопровождаем судебную и внесудебную процедуру банкротства. Бесплатная первичная консультация.</p>
        <div className={styles.cta}><LeadForm/></div>
      </div>
    </section>
  )
}