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
  agree: z.boolean().refine(v => v === true, { message: 'Обязательное согласие' })
})

type FormData = z.infer<typeof schema>

export default function LeadForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    // TODO: настроить прокси/бекенд; пока просто имитация
    try {
      // await axios.post('/api/lead', data)
      await new Promise(r => setTimeout(r, 600))
      alert('Спасибо! Мы свяжемся с вами в ближайшее время.')
      reset()
    } catch {
      alert('Не удалось отправить. Попробуйте позже.')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.row}>
        <input className="input" placeholder="Ваше имя" {...register('name')} />
        {errors.name && <span className={styles.err}>{errors.name.message}</span>}
      </div>

      <div className={styles.row}>
        <input className="input" placeholder="+7XXXXXXXXXX" inputMode="tel" {...register('phone')} />
        {errors.phone && <span className={styles.err}>{errors.phone.message}</span>}
      </div>

      <div className={styles.row}>
        <input className="input" placeholder="Сумма долга (≈)" inputMode="numeric" {...register('debt')} />
      </div>

      <label className={styles.agree}>
        <input type="checkbox" {...register('agree')} />
        <span>
          Согласен(а) с <a href="/politika-konfidencialnosti" target="_blank" rel="noreferrer">политикой</a>
        </span>
      </label>
      {errors.agree && <span className={styles.err}>{errors.agree.message}</span>}

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        Получить консультацию
      </button>
    </form>
  )
}