# कृदन्तदर्शिका , Sanskrit Parser* and dictionary.

\* <sup>more accurately, word segmenter.</sup>

As the title says, this Chrome (or Firefox) extension can:
- split a Sanskrit word into smaller words
  - e.g. वाल्मीकिर्मुनिपुङ्गवम्‌ → वाल्मीकि, मुनि, पुङ्गव.
- provide English meaning for each of the smaller words (most of the times).
- provide related कृदन्त (Kridanta) forms for each of them (when applicable).
  - e.g. अध्याय → अध्येतुम्, अधीत्य, अधीतः, etc.

## Installation
### Installing on Chrome
Go to [Chrome store](https://t.co/9BwPXbIGzy) and click "Add To Chrome".
### Installing on Firefox
Go to [Firefox addons](https://addons.mozilla.org/en-US/firefox/addon/sanskrit-parser-dictionary/) and click "Add to Firefox".

## Usage
- Double click a Sanskrit word (in Devanagari script).
  - A table, with as many rows as the word is split into, is shown. Every row shows the constituent word, its English meaning, and related कृदन्त forms (again, if applicable).
  - The constituent word can be "clicked" too, in which case a page from ashtadhyayi.com will be opened in a new tab, which has the results from all popular Sanskrit dictionaries for that word.
  - Each of the Kridanta form can be clicked as well. This will take you to sanskritabhyas.in, where more कृदन्त forms and तिङन्त forms can be looked up easily.
- In the textbox that appears above the table, you can also edit the word, and press enter. Then the new edited word is taken as input and the table is updated accordingly. This is helpful when you want to split the word differently, or know about a different word that just occurs to your curious mind :)
- Press escape to close the table.

## Limitations
### Vocabulary
- Presently we only support a subset of Sanskrit lexicon.
  - Only ~300 common धातु's are considered (for which we can show कृदन्त forms)
  - Only common कृत् forms are considered, like क्त, क्त्वा, तुमुन्, ल्युट्, शतृ.
  - We're even more conservative with तिङन्त's. Only लट्, लोट् and selected विधिलिङ् forms are considered. There too, on the grounds of rarity, forms like द्विवचन, मध्यमपुरुष, कर्मणि-उत्तमपुरुष etc are often ignored.
  - We recognize सुबन्त forms of प्रातिपदिक's that end with अ,आ,इ,ई,उ,ऊ,ऋ, त्,न् & स्. Thus, as yet, नौः-नावौ-नावः, वणिक्-वणिजौ-वणिजः are out-of-syllabus!
  - Our dictionary is restricted as well. We drop words that are too short and rare. 
  - We don't support तद्धित forms (except those that are already in the dictionary, of course).
### Word split
- Almost always, there are multiple ways to split a Sanskrit word. We simply proceed greedily (with some checks here and there)  and pick the first match. Thus, considering sentence-level context, the word split we offer may not necessarily be correct. In such cases, users are encouraged to use the textbox-editing feature and look up individual constituent words.

That said, we hope to overcome some of these limitations in future!

##  Feedback
Use this [form](https://forms.gle/VUzn9PkFUVNP4DSb9), or reply to this twitter [thread](https://twitter.com/sumanthegde/status/1623233287308320768?s=20).

