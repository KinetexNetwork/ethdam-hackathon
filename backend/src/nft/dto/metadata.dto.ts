import { ERC721Attributes, ERC721Metadata } from '../helpers'

export class MetadataDTO implements ERC721Metadata {
	readonly image: string
	readonly name: string
	readonly description: string
	readonly attributes: Array<ERC721Attributes>
}
