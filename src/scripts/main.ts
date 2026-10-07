/**
 * Ponto de entrada único (Astro empacota e carrega como módulo, sem bloquear).
 * Cada módulo é independente e não faz nada se sua seção não existir.
 */
import { initCountdowns } from './countdown';
import { initExperience } from './experience';
import { initHero } from './hero';
import { initLeadForm } from './lead-form';
import { initNav } from './nav';
import { initReveal } from './reveal';
import { initStickyCta } from './sticky-cta';
import { initTilt } from './tilt';
import { initVideo } from './video';

initReveal();
initNav();
initCountdowns();
initHero();
initExperience();
initVideo();
initLeadForm();
initTilt();
initStickyCta();
