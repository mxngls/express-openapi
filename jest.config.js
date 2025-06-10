/** @type {import('ts-jest').JestConfigWithTsJest} **/
export const preset = 'ts-jest'
export const transform = {
    '^.+.tsx?$': ['ts-jest', {}],
}
export const moduleDirectories = ['node_modules', 'src']
