import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: '../graphql-schema/backend.graphql',
  documents: ['src/**/*.ts'],
	generates: {
		'./src/api-client/__generated__/': {
			preset: 'client',
			plugins: [],
			presetConfig: {
				gqlTagName: 'gql',
			},
		},
	},
	ignoreNoDocuments: true,
}

export default config
