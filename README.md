# VocabEstimate
A tool that will use statistics to estimate total vocabulary known in a target language from success rate with a small sample size

Original data from https://wortschatz.uni-leipzig.de/en/download/

TODO:
- [x]  remove numeral based words (not sure if I want to or not)
- [x]  fix indexing to skip only initial symbols
- [x]  remove words starting with an uppercase letter? (may vary by language)
- [ ]  calculate estimate based on performance in each bracket and display on last page
- [ ]  put some LaTeX in frontend 
- [ ]  show which CEFR level you would end up in based on estimate
- [ ]  maybe deliver all words to front end initially? like I already know what they'll be 
            save on calculating brackets dynamically and avoids collisions entirely