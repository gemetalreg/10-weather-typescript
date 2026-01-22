const getArgs = (args: string[]): Record<string, string | boolean>  => {
	const res: Record<string, string | boolean>  = {};
	const [executer, file, ...rest] = args;
	rest.forEach((value, index, array) => {
		if (value.charAt(0) == '-') {
			const key = value.substring(1);
			const next = array[index + 1];
			if (index === array.length - 1 || next?.charAt(0) === '-') {
				res[key] = true;
			} else if (next !== undefined) {
				res[key] = next;
			}
		}
	});
	return res;
};

export { getArgs };