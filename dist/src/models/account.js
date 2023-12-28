"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Account {
    /**
     *
     */
    constructor(id, userName, givenName, email, roles = []) {
        this.id = id;
        this.userName = userName;
        this.givenName = givenName;
        this.email = email;
        this.roles = roles;
    }
    static fromJson(decoded) {
        var _a, _b, _c, _d, _e, _f;
        const id = (_a = decoded["nameid"]) !== null && _a !== void 0 ? _a : "";
        const userName = (_b = decoded["unique_name"]) !== null && _b !== void 0 ? _b : "";
        const givenName = (_c = decoded["given_name"]) !== null && _c !== void 0 ? _c : "";
        const email = (_d = decoded["email"]) !== null && _d !== void 0 ? _d : "";
        const roles = (_e = decoded["roles"]) !== null && _e !== void 0 ? _e : [];
        const role = (_f = decoded["role"]) !== null && _f !== void 0 ? _f : "";
        if (decoded["role"]) {
            roles.push(role);
        }
        return new Account(id, userName, givenName, email, roles);
    }
}
exports.Account = Account;
//# sourceMappingURL=account.js.map