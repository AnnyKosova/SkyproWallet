import { axiosInstance } from './axios/axiosInstance';

export class CRUD {
  #axios;

  constructor() {
    this.#axios = axiosInstance;
  }

  async _create(endpointName, body) {
    return await this.#axios.post(endpointName, body);
  }

  async _read(endpointName) {
    return await this.#axios.get(endpointName);
  }

  async _update(endpointName, id, body) {
    return await this.#axios.patch(endpointName + `/${id}`, body);
  }

  async _delete(endpointName, id) {
    return await this.#axios.delete(endpointName + `/${id}`);
  }
}
