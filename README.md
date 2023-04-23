# VocabEstimate
A tool that will use statistics to estimate total vocabulary known in a target language from success rate with a small sample size

Original data from https://wortschatz.uni-leipzig.de/en/download/

TODO:
- [x]  remove numeral based words (not sure if I want to or not)
- [x]  fix indexing to skip only initial symbols
- [x]  remove words starting with an uppercase letter? (may vary by language)
- [x]  calculate estimate based on performance in each bracket and display on last page
- [x]  put some LaTeX in frontend 
- [ ]  dynamically change confidence interval LaTeX?
- [ ]  add ribbons for confidence intervals
- [ ]  show which CEFR level you would end up in based on estimate
- [x]  maybe deliver all words to front end initially