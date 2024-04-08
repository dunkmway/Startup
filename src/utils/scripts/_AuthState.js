import { httpRequest } from "./_helpers.mjs";

let instance;

export default class AuthState {
	static instantiate(setUser) {
		if (instance) {
			throw new Error("You can only create one instance!");
		}
		if (!setUser) throw new Error('AuthState must have setUser function.');
		return Object.freeze(new AuthState(setUser));
	}

	static getInstance() {
		return instance;
	}
	
	constructor(setUser) {
		this.isAuthenticated = null;
		this.user = null;
		this.setUser = setUser;
		instance = this;
	}

	async login(username, password) {
		this.user = await httpRequest("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password })
		});
		this._updateState();
	}
	
	async signout() {
		await httpRequest("/api/auth/logout", {
			method: "POST",
		})
		this._updateState();
	}

	async createUser(username, password) {
		this.user = await httpRequest("/api/auth/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password })
		});
		this._updateState();
	}
	
	_updateState() {
		this.setUser(this.user);
		this.isAuthenticated = !!this.user;
	}

	getIsAuthenticated() {
		return this.isAuthenticated;
	}

	getUser() {
		return this.user;
	}
}
