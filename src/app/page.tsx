import { cleaningServices } from "@/config/pricing";
import { CalculationProvider } from "@/components/calculator/CalculationState";
import { Calculator } from "@/components/calculator/Calculator";
import { LeadCalculation } from "@/components/calculator/LeadCalculation";
import {
  benefits,
  howItWorksSteps,
  reviews,
  siteContacts,
} from "@/config/site";

const serviceOrder = ["maintenance", "deep", "post-renovation"] as const;
const rubles = new Intl.NumberFormat("ru-RU");

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a
            className="wordmark"
            href="#top"
            aria-label="Clean Square — наверх"
          >
            <span className="brand-mark" aria-hidden="true" />
            Clean Square
          </a>
          <span className="header-caption">Уборка квартир и домов</span>
          <a className="header-link" href="#calculator">
            Рассчитать стоимость <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero section" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Чистота без лишних хлопот</p>
              <h1 id="hero-title">
                Уборка, после которой хочется остаться дома.
              </h1>
              <p className="hero-description">
                Поддерживающая, генеральная и после ремонта. Выберите услугу,
                узнайте ориентировочную стоимость и оставьте заявку в одном
                месте.
              </p>
              <a className="button button-primary" href="#calculator">
                Рассчитать стоимость <span aria-hidden="true">↗</span>
              </a>
              <p className="hero-note">
                Предварительная цена до разговора с нами
              </p>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-visual-square square-one" />
              <div className="hero-visual-square square-two" />
              <div className="hero-visual-square square-three" />
              <span className="visual-caption">Пространство для жизни.</span>
            </div>
          </div>
        </section>

        <section
          className="section services-section"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Услуги</p>
              <h2 id="services-title">Нужная уборка для вашего дома</h2>
              <p>
                Три понятных варианта. Стоимость зависит от площади и
                дополнительных услуг.
              </p>
            </div>
            <div className="services-grid">
              {serviceOrder.map((id, index) => {
                const service = cleaningServices[id];
                return (
                  <article className="service" key={id}>
                    <span className="item-number">0{index + 1}</span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="service-pricing">
                      <strong>от {rubles.format(service.minPrice)} ₽</strong>
                      <span>{rubles.format(service.pricePerM2)} ₽/м²</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <CalculationProvider>
        <section
          className="section calculator-section"
          id="calculator"
          aria-label="Калькулятор уборки"
        >
          <div className="container calculator-grid">
            <div className="calculator-intro">
              <p className="eyebrow">Калькулятор</p>
              <h2 id="calculator-title">Начните с ориентировочной цены</h2>
              <p>
                Выберите вид уборки, укажите площадь и дополнительные услуги.
                Ориентировочная цена меняется сразу при выборе параметров.
              </p>
            </div>
            <Calculator />
          </div>
        </section>

        <section
          className="section benefits-section"
          id="benefits"
          aria-labelledby="benefits-title"
        >
          <div className="container">
            <div className="section-heading compact-heading">
              <p className="eyebrow">Почему мы</p>
              <h2 id="benefits-title">Удобно с первого шага</h2>
            </div>
            <ul className="benefits-grid">
              {benefits.map((benefit, index) => (
                <li key={benefit}>
                  <span className="item-number">0{index + 1}</span>
                  <p>{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="section steps-section"
          id="how-it-works"
          aria-labelledby="steps-title"
        >
          <div className="container steps-grid">
            <div className="section-heading compact-heading">
              <p className="eyebrow">Как всё устроено</p>
              <h2 id="steps-title">От расчёта до чистого дома</h2>
            </div>
            <ol className="steps-list">
              {howItWorksSteps.map((step, index) => (
                <li key={step}>
                  <span className="step-number">0{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="section reviews-section"
          id="reviews"
          aria-labelledby="reviews-title"
        >
          <div className="container">
            <div className="section-heading compact-heading">
              <p className="eyebrow">Отзывы</p>
              <h2 id="reviews-title">Что говорят о нашей уборке</h2>
              <p>Вымышленные отзывы для демонстрации сайта.</p>
            </div>
            <div className="reviews-grid">
              {reviews.map((review) => (
                <blockquote className="review" key={review.name}>
                  <span
                    className="rating"
                    aria-label={`Оценка ${review.rating} из 5`}
                  >
                    {"★".repeat(review.rating)}
                  </span>
                  <p>«{review.text}»</p>
                  <footer>{review.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section lead-section"
          id="lead"
          aria-label="Заявка"
        >
          <div className="container lead-grid">
            <div>
              <p className="eyebrow">Заявка</p>
              <h2 id="lead-title">Остался один шаг до чистоты</h2>
              <p>
                Оставьте имя и телефон. Мы свяжемся с вами, чтобы уточнить
                детали и удобное время уборки.
              </p>
              <p className="contact-note">
                Связь через Telegram и MAX появится после настройки контактов
                компании.
              </p>
            </div>
            <LeadCalculation />
          </div>
        </section>

        </CalculationProvider>

        <section className="final-cta" aria-labelledby="final-cta-title">
          <div className="container final-cta-inner">
            <div>
              <p className="eyebrow">Начнём?</p>
              <h2 id="final-cta-title">Узнайте стоимость вашей уборки</h2>
            </div>
            <a className="button button-light" href="#calculator">
              Вернуться к расчёту <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>Clean Square</strong>
            <p>Уборка квартир и домов</p>
          </div>
          <div className="footer-contacts">
            {siteContacts.phone && <span>{siteContacts.phone}</span>}
            <span>Telegram · MAX — контакты будут добавлены</span>
          </div>
          <span>© {new Date().getFullYear()} Clean Square</span>
        </div>
      </footer>
    </>
  );
}
