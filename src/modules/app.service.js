export default class AppService {
    constructor(text) {
        this.text = text;
    }

    log() {
        console.log('From AppService:', this.text);
    }
}