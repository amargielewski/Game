import './style.css';
import { Game } from './app/game';

async function bootstrap(): Promise<void> {
  await document.fonts.ready;
  await new Game().start();
}

bootstrap().catch((error: unknown) => {
  console.error(error);
});
