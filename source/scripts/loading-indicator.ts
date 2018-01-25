class LoadingIndicator {
    private count = 0;

    toggle(on: boolean) {
        this.count += on ? 1 : -1;
        document.body.classList.toggle("loading", this.count > 0);
    }

    show() {
        this.toggle(true);
    }

    hide() {
        this.toggle(false);
    }
}

export const loadingIndicator = new LoadingIndicator();