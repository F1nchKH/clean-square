import Image from "next/image";
import { cleaningServices } from "@/config/pricing";
import { CalculationProvider } from "@/components/calculator/CalculationState";
import { Calculator } from "@/components/calculator/Calculator";
import { LeadCalculation } from "@/components/calculator/LeadCalculation";
import { FinalCTA } from "@/components/calculator/FinalCTA";
import { ContactActions } from "@/components/lead/ContactActions";
import {
  benefits,
  howItWorksSteps,
  reviews,
  siteContacts,
  siteMode,
} from "@/config/site";

const serviceOrder = ["maintenance", "deep", "post-renovation"] as const;
const rubles = new Intl.NumberFormat("ru-RU");

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">К основному содержимому</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="wordmark" href="#top" aria-label="Clean Square — наверх">
            <span className="brand-mark" aria-hidden="true" />
            Clean Square
          </a>
          <nav className="header-nav" aria-label="Разделы сайта">
            <a href="#services">Виды уборки</a>
            <a href="#how-it-works">Как всё устроено</a>
          </nav>
          <a className="header-link" href="#calculator">Рассчитать стоимость <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Уборка квартир и домов</p>
              <h1 id="hero-title">Уборка дома. Понятный расчёт до заявки.</h1>
              <p className="hero-description">
                Выберите вид уборки, площадь и нужные дополнения. Покажем
                предварительную стоимость сразу, а детали согласуем до выезда.
              </p>
              <a className="button button-primary" href="#calculator">
                Рассчитать стоимость <span aria-hidden="true">↗</span>
              </a>
              <p className="hero-note">Никаких звонков, чтобы просто узнать ориентир по цене.</p>
            </div>
            <div className="hero-photo">
              <Image
                src="/images/home-interior.webp"
                alt="Светлая гостиная с диваном и дневным светом"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 48vw"
              />
            </div>
          </div>
        </section>

        <CalculationProvider>
          <section className="section calculator-section" id="calculator" aria-label="Калькулятор уборки">
            <div className="container calculator-grid">
              <div className="calculator-intro">
                <p className="eyebrow">Расчёт стоимости</p>
                <h2 id="calculator-title">Сколько будет стоить уборка?</h2>
                <p>
                  Цена зависит от площади, вида уборки и выбранных дополнений.
                  Расчёт предварительный — итог согласуем до начала работ.
                </p>
                <div className="calculator-aside" aria-label="Как считается стоимость">
                  <strong>Что влияет на цену</strong>
                  <span>Площадь и вид уборки</span>
                  <span>Окна и техника внутри — только если выберете</span>
                </div>
              </div>
              <Calculator />
            </div>
          </section>

          <section className="section services-section" id="services" aria-labelledby="services-title">
            <div className="container">
              <div className="section-heading">
                <p className="eyebrow">Виды уборки</p>
                <h2 id="services-title">Для обычной недели, большой уборки и после ремонта</h2>
                <p>Выберите подходящий формат в калькуляторе. Окна, холодильник и духовка внутри считаются отдельно.</p>
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

          <section className="section benefits-section" id="benefits" aria-labelledby="benefits-title">
            <div className="container benefits-layout">
              <div className="section-heading">
                <p className="eyebrow">Спокойнее, когда всё ясно</p>
                <h2 id="benefits-title">Договоримся о важном заранее</h2>
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

          <section className="section steps-section" id="how-it-works" aria-labelledby="steps-title">
            <div className="container">
              <div className="section-heading">
                <p className="eyebrow">Как всё устроено</p>
                <h2 id="steps-title">От расчёта до уборки — четыре шага</h2>
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

          <section className="section reviews-section" id="reviews" aria-labelledby="reviews-title">
            <div className="container">
              <div className="section-heading">
                <p className="eyebrow">Отзывы</p>
                <h2 id="reviews-title">Что остаётся после уборки</h2>
                <p>Примеры отзывов для демонстрации сайта. Эти истории вымышлены.</p>
              </div>
              <div className="reviews-grid">
                {reviews.map((review) => (
                  <blockquote className="review" key={review.name}>
                    <span className="rating" aria-label={`Оценка ${review.rating} из 5`}>
                      {"★".repeat(review.rating)}
                    </span>
                    <p>«{review.text}»</p>
                    <footer>{review.name}</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>

          <section className="section lead-section" id="lead" aria-label="Заявка">
            <div className="container lead-grid">
              <div className="lead-intro">
                <p className="eyebrow">Заявка</p>
                <h2 id="lead-title">Расчёт готов. Осталось обсудить детали.</h2>
                <p>Оставьте имя и телефон — согласуем объём работ, удобное время и окончательную стоимость до уборки.</p>
                <div className="contact-area">
                  <strong>Удобнее написать?</strong>
                  {siteMode === "portfolio" ? (
                    <ContactActions variant="lead" />
                  ) : siteContacts.telegramUrl || siteContacts.maxUrl ? (
                    <nav className="contact-links" aria-label="Другие способы связи">
                      {siteContacts.telegramUrl && (
                        <a href={siteContacts.telegramUrl} target="_blank" rel="noopener noreferrer">Telegram <span aria-hidden="true">↗</span></a>
                      )}
                      {siteContacts.maxUrl && (
                        <a href={siteContacts.maxUrl} target="_blank" rel="noopener noreferrer">MAX <span aria-hidden="true">↗</span></a>
                      )}
                    </nav>
                  ) : (
                    <p className="contact-note">Контакты для переписки пока не настроены.</p>
                  )}
                </div>
              </div>
              <LeadCalculation demoMode={siteMode === "portfolio"} />
            </div>
          </section>

          <section className="final-cta" aria-label="Узнайте стоимость вашей уборки">
            <div className="container final-cta-inner">
              <div>
                <p className="eyebrow">Следующий шаг</p>
                <h2 id="final-cta-title">О цене уже есть представление. Остались детали.</h2>
              </div>
              <FinalCTA />
            </div>
          </section>
        </CalculationProvider>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <strong>Clean Square</strong>
            <p>Уборка квартир и домов</p>
          </div>
          {siteMode === "portfolio" ? (
            <ContactActions variant="footer" />
          ) : (
            <div className="footer-contacts">
              {siteContacts.phone && <a href={`tel:${siteContacts.phone.replace(/[^\d+]/g, "")}`}>{siteContacts.phone}</a>}
              {siteContacts.telegramUrl && <a href={siteContacts.telegramUrl} target="_blank" rel="noopener noreferrer">Telegram</a>}
              {siteContacts.maxUrl && <a href={siteContacts.maxUrl} target="_blank" rel="noopener noreferrer">MAX</a>}
            </div>
          )}
          <div className="footer-meta">
            <span>© {new Date().getFullYear()} Clean Square</span>
            {siteMode === "portfolio" && <span>Демонстрационный проект. Компания вымышленная.</span>}
          </div>
        </div>
      </footer>
    </>
  );
}
