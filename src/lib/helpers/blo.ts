import { blo } from '@blockchainhub/blo';

export function getIcon(address: string): string {
	return blo(address);
}
