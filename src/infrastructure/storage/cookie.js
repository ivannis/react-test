import cookie from "js-cookie";

export default class CookieStorage {
    constructor(req?) {
        this.req = req;

        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.remove = this.remove.bind(this);
        this.runningInServerSide = this.runningInServerSide.bind(this);
        this.getFromBrowser = this.getFromBrowser.bind(this);
        this.getFromServer = this.getFromServer.bind(this);
    }

    get(key) {
        return this.runningInServerSide() ? this.getFromServer(key) : this.getFromBrowser(key);
    }

    set(key, value) {
        if (!this.runningInServerSide()) {
            cookie.set(key, value, {
                expires: 1,
                path: "/"
            });
        }
    }

    remove(key) {
        if (!this.runningInServerSide()) {
            cookie.remove(key, {
                expires: 1
            });
        }
    }

    runningInServerSide() {
        return !process.browser;
    }

    getFromBrowser(key) {
        return cookie.get(key);
    }

    getFromServer(key) {
        if (!this.req) {
            return undefined;
        }

        if (!this.req.headers.cookie) {
            return undefined;
        }

        const rawCookie = this.req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith(`${key}=`))
        ;

        if (!rawCookie) {
            return undefined;
        }

        return rawCookie.split("=")[1];
    }
}