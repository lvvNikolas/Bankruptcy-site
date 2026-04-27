/** Центральное место для всех сайтовых констант. */

// ─── Идентификация сайта ──────────────────────────────────────────────────────

export const SITE_URL  = "https://basolution.ru";
export const SITE_NAME = "Юридическое агентство по банкротству Солюшен";

// ─── Контакты ─────────────────────────────────────────────────────────────────

export const PHONE_RAW     = "+79162979645";
export const PHONE_DISPLAY = "+7 (916) 297-96-45";
export const PHONE_HREF    = `tel:${PHONE_RAW}`;

export const EMAIL      = "bankruptcyagencysolution@yandex.com";
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const TELEGRAM_BOT  = "https://t.me/ba_solution";
export const WHATSAPP_HREF = `https://wa.me/${PHONE_RAW.replace("+", "")}`;
export const TELEGRAM_HREF = `https://t.me/${PHONE_RAW.replace("+", "")}`;

export const ADDRESS = "г. Москва, Пресненская набережная, д. 12";

/** Полный режим работы — для футера и страницы контактов */
export const WORKING_HOURS = "Ежедневно с 9:00 до 21:00";

/**
 * Краткий диапазон часов — для сообщений об ответе на заявку в формах.
 * Синхронизирован с WORKING_HOURS.
 */
export const WORKING_HOURS_SHORT = "9:00–21:00 МСК";

// ─── Личный кабинет ───────────────────────────────────────────────────────────

export const CABINET_URL = "https://cabinet.basolution.ru";

// ─── Аналитика ────────────────────────────────────────────────────────────────

export const METRIKA_ID = 107006423;

// ─── UI: виджет FloatingCTA ───────────────────────────────────────────────────

/** Скролл (px), после которого плавающая кнопка становится видимой */
export const FLOATING_CTA_SCROLL_PX = 200;

/** Таймаут бездействия (мс), после которого плавающая кнопка становится видимой */
export const FLOATING_CTA_IDLE_MS = 5_000;

// ─── UI: виджет ExitPopup ─────────────────────────────────────────────────────

/** Задержка принудительного показа exit-попапа (мс) */
export const EXIT_POPUP_DELAY_MS = 40_000;

// ─── UI: секция Hero ──────────────────────────────────────────────────────────

/** Порог видимости (0–1) для IntersectionObserver счётчиков в Hero */
export const HERO_INTERSECTION_THRESHOLD = 0.5;

/**
 * Длительности анимации счётчиков доверия в Hero (мс).
 * Разные значения создают эффект неодновременного завершения.
 */
export const HERO_COUNT_DURATIONS = {
  clients: 1_400, // «500+ клиентов»
  success: 1_200, // «98% списали долги»
  years:     900, // «7 лет на рынке»
} as const;
