import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);
bootstrap();


