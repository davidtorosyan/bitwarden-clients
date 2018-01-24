import * as path from 'path';

// First locale is the default (English)
const SupportedLocales = [
    'en', 'es',
];

export class I18nService {
    defaultMessages: any = {};
    localeMessages: any = {};
    language: string;
    inited: boolean;

    constructor(private systemLanguage: string, private localesDirectory: string) {
    }

    async init(language?: string) {
        if (this.inited) {
            throw new Error('i18n already initialized.');
        }

        this.inited = true;
        this.language = language != null ? language : this.systemLanguage;

        if (SupportedLocales.indexOf(this.language) === -1) {
            this.language = this.language.slice(0, 2);

            if (SupportedLocales.indexOf(this.language) === -1) {
                this.language = SupportedLocales[0];
            }
        }

        await this.loadMessages(this.language, this.localeMessages);
        if (this.language !== SupportedLocales[0]) {
            await this.loadMessages(SupportedLocales[0], this.defaultMessages);
        }
    }

    t(id: string): string {
        return this.translate(id);
    }

    translate(id: string): string {
        if (this.localeMessages.hasOwnProperty(id) && this.localeMessages[id]) {
            return this.localeMessages[id];
        } else if (this.defaultMessages.hasOwnProperty(id) && this.defaultMessages[id]) {
            return this.defaultMessages[id];
        }
        return '';
    }

    private loadMessages(locale: string, messagesObj: any): Promise<any> {
        const formattedLocale = locale.replace('-', '_');
        const filePath = path.join(__dirname, this.localesDirectory + '/' + formattedLocale + '/messages.json');
        const locales = (window as any).require(filePath);
        for (const prop in locales) {
            if (locales.hasOwnProperty(prop)) {
                messagesObj[prop] = locales[prop].message;
            }
        }

        return Promise.resolve();
    }
}
