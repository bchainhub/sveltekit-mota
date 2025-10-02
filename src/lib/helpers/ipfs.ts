export function getIpfsUrl(url: string, ns?: string): string {
	if (!url) return '';
	if (url.startsWith('ipfs://')) {
		const cid = url.substring(7); // remove the 'ipfs://' prefix
		if (ns) {
			return `https://ipf.sk/${ns}/${cid}`;
		}
		return `https://ipf.sk/${cid}`;
	}
	return url;
}
