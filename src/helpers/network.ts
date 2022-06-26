import fs from 'node:fs';
import path, { join } from 'node:path';
import restart from './restart.js';
import { revokeDevice } from '../todo.js';
import { CONFIG_FILE_NAME } from './constants.js';

const requestAPI = async (url: string, requestPayload: any) => {
  const rawResponse = await fetch(url, requestPayload);

  if (rawResponse.status === 401 || rawResponse.status === 403) {
    console.error('Unauthenticated, voiding saved settings and restarting process');
    try {
      fs.unlinkSync(join(path.resolve(), CONFIG_FILE_NAME));
    } catch (error) {
      console.error(error);
    } finally {
      await revokeDevice();

      restart();
    }
  }

  return await rawResponse.json();
};

export default requestAPI;
