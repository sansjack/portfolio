declare global {
	namespace App {
		interface PageState {
			// Slug of the writeup shown in a dialog over the current page (shallow routing)
			writeup?: string;
		}
	}
}

export {};
