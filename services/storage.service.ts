import { homedir } from 'os';
import { join } from 'path';
import { promises } from 'fs';

const filePath = join(homedir(), 'weather-data.json');

const TOKEN_DICTIONARY = {
	token: 'token',
	city: 'city'
}

const saveKeyValue = async (key: string, value: string): Promise<void> => {
  let data: Record<string, string> = {};
  if (await isExist(filePath)) {
    const fileBuffer = await promises.readFile(filePath);
    data = JSON.parse(fileBuffer.toString());
  }
  data[key] = value;
  await promises.writeFile(filePath, JSON.stringify(data));
};

const getKeyValue = async (key: string): Promise<string | undefined>  => {
	if (await isExist(filePath)) {
		const fileBuffer = await promises.readFile(filePath);
		const data: Record<string, string> = JSON.parse(fileBuffer.toString());
		return data[key];
	}
	return undefined;
};

const isExist = async (path: string): Promise<boolean> => {
	try {
		await promises.stat(path);
		return true;
	} catch (e) {
		return false;
	}
};

export { saveKeyValue, getKeyValue, TOKEN_DICTIONARY };