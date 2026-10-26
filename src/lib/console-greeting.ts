const REPOSITORY_URL = 'https://github.com/sansjack/portfolio';

const BANNER = String.raw`
 _   _      _ _
| | | | ___| | | ___
| |_| |/ _ \ | |/ _ \
|  _  |  __/ | | (_) |
|_| |_|\___|_|_|\___/
`;

// Shown to anyone who opens the dev tools console
export function logConsoleGreeting() {
	console.log(`%c${BANNER}`, 'color: #6965db; font-weight: bold; font-family: monospace;');
	console.log(
		`%cHello! Wondering how it's built? Head to ${REPOSITORY_URL}\nNo cookies on this site, it's also written in Svelte 5.`,
		'color: #6965db; font-size: 14px; font-weight: bold;'
	);
}
