export class Api {
    constructor(baseUrl, headers) {
        this._baseURL = baseUrl || "";
        this._headers = headers || {};
    }
    setHeader(key, value) {
        this._headers[key] = value;
        return this;
    }
    async _fetchJSON(endpoint, options = {}) {
        const res = await fetch(this._baseURL + endpoint, {
          ...options,
          headers: this._headers
        });
      
        if (!res.ok) throw new Error(res.statusText);
      
        if (options.parseResponse !== false && res.status !== 204)
          return res.json();
      
        return undefined;
    }

    async get(endpoint, options = {}) {
        return await this._fetchJSON(
          endpoint, 
          { 
            ...options, 
            method: 'GET' 
          }
        )
      }
      
    async post(endpoint, body, options = {}) {
        return await this._fetchJSON(
          endpoint, 
          {
            ...options, 
            body: JSON.stringify(body), 
            method: 'POST' 
          }
        )
      }
      
    async delete(endpoint, options = {}) {
        return await this._fetchJSON(
          endpoint, 
          {
            parseResponse: false,
            ...options, 
            method: 'DELETE' 
          }
        )
    }

    async put(endpoint, options = {}) {
        return await this._fetchJSON(
          endpoint, 
          {
            parseResponse: false,
            ...options, 
            method: 'PUT' 
          }
        )
    }
}