#!/usr/bin/env node
import axios from 'axios';
import { getArgs } from './helpers/args.js';
import { getWeather, getIcon } from './services/api.service.js';
import { printHelp, printSuccess, printError, printWeather } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTIONARY, getKeyValue } from './services/storage.service.js';

const saveToken = async (token: string): Promise<void> => {
	if (!token.length) {
		printError('Не передан token');
		return;
	}
	try {
		await saveKeyValue(TOKEN_DICTIONARY.token, token);
		printSuccess('Токен сохранён');
	} catch (e) {
		if (e instanceof Error) {
			printError(e.message);
		} else {
			printError(String(e));
		}
	}
}

const saveCity = async (city: string): Promise<void> => {
	if (!city.length) {
		printError('Не передан город');
		return;
	}
	try {
		await saveKeyValue(TOKEN_DICTIONARY.city, city);
		printSuccess('Город сохранён');
	} catch (e) {
		if (e instanceof Error) {
			printError(e.message);
		} else {
			printError(String(e));
		}
	}
}

const getForecast = async (): Promise<void> => {
	try {
		const city: string | undefined = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city);
		if (!city) {
			printError('Город не указан');
			return;
		}
		const weather = await getWeather(city);
		printWeather(weather, getIcon(weather?.weather[0]?.icon || ""));
	} catch (e: unknown) {
		if (axios.isAxiosError(e) && e.response?.status === 404) {
			printError('Неверно указан город');
		} else if (axios.isAxiosError(e) && e.response?.status === 401) {
			printError('Неверно указан токен');
		} else if (e instanceof Error) {
			printError(e.message);
		} else {
			printError(String(e));
		}
	}
};

const initCLI = () => {
	const args = getArgs(process.argv);
	if (args.h) {
		return printHelp();
	}
	if (typeof args.s === 'string') {
		return saveCity(args.s);
	}
	if (typeof args.t === 'string') {
		return saveToken(args.t);
	}
	return getForecast();
};

initCLI();