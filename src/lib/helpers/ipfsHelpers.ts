export function getPreviewUrl(url: string): string {
	if (!url) return '';
	if (url.startsWith('ipfs://')) {
		const cid = url.substring(7);
		return `https://ipf.sk/${cid}`;
	}
	return url;
}
