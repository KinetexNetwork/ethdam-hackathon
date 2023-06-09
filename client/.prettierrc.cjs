module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  jsxSingleQuote: true,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrder: [
    '^@mui(/?.*)$',
    '^api(/?.*)$',
    '^assets(/?.*)$',
    '^components(/?.*)$',
    '^helpers(/?.*)$',
    '^logic(/?.*)$',
    '^pages(/?.*)$',
    '^theme(/?.*)$',
    '^[.]{2}',
    '^[.]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  singleAttributePerLine: true,
};
