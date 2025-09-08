// src/features/LeadForm/LeadForm.tsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import styles from './LeadForm.module.css'
import axios from 'axios'

const schema = z.object({
  name: z.string().min(2, 'Введите имя'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX'),
  debt: z.string().optional(),
  agree: z.literal(true, { errorMap: () => ({ message: 'Обязательное согласие' }) })
})
type FormData = z.infer<typeof schema>

export default function LeadForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await axios.post('/api/lead', data) // настроите прокси или реальный бекенд/CRM
    reset()
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.row}>
        <input placeholder="Ваше имя" {...register('name')} />
        {errors.name && <span className={styles.err}>{errors.name.message}</span>}
      </div>
      <div className={styles.row}>
        <input placeholder="+7XXXXXXXXXX" {...register('phone')} inputMode="tel" />
        {errors.phone && <span className={styles.err}>{errors.phone.message}</span>}
      </div>
      <div className={styles.row}>
        <input placeholder="Сумма долга (≈)" {...register('debt')} inputMode="numeric" />
      </div>
      <label className={styles.agree}>
        <input type="checkbox" {...register('agree')} />
        <span>Соглашаюсь с <a href="/politika-konfidencialnosti" target="_blank" rel="noreferrer">политикой</a></span>
      </label>
      {errors.agree && <span className={styles.err}>{errors.agree.message}</span>}
      <button type="submit" disabled={isSubmitting}>Получить консультацию</button>
    </form>
  )
}