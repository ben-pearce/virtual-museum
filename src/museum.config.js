/**
 * Application config file.
 */
module.exports = {
  api: {
    base: 'http://localhost:3000/api/'
  },
  site: {
    name: 'Virtual Museum',
    tagline: 'All your favourite museum objects in one place!'
  },
  results: {
    resultsPerPage: 9,
    availableFilters: {
      image: {
        lang: 'Image',
        options: [
          { lang: 'Has Image', value: '1' },
          { lang: 'No Image', value: '0' }
        ]
      },
      category: {
        lang: 'Category',
        options: [
          { lang: 'Computing & Data Processing', value: '0' },
          { lang: 'Photographs', value: '1' },
          { lang: 'Surgery', value: '2' },
          { lang: 'Photographic Technology', value: '3' },
          { lang: 'Art', value: '4' },
          { lang: 'Theraputics', value: '5' }
        ]
      },
      maker: {
        lang: 'Maker',
        options: [
          { lang: 'Herbert Galloway', value: 'cp137480' },
          { lang: 'Ian Beesley', value: 'cp125760' },
          { lang: 'Down Brothers', value: 'cp46021' },
          { lang: 'Samuel Bourne', value: 'cp39862' },
          { lang: 'John Weiss', value: 'cp43443' },
          { lang: 'Apple Inc', value: 'cp20600' },
          { lang: 'Kodak', value: 'cp3742' }
        ]
      },
      place: {
        lang: 'Place',
        options: [
          { lang: 'United Kingdom', value: 'cd84' },
          { lang: 'Russia', value: 'cd170' },
          { lang: 'United States', value: 'cd133' },
          { lang: 'Germany', value: 'cd141' },
          { lang: 'France', value: 'cd184' },
          { lang: 'Japan', value: 'cd579' }
        ]
      },
      facility: {
        lang: 'On Display',
        options: [
          { lang: 'Not On Display', value: '0' },
          { lang: 'Science Museum, Medicine: The Wellcome Galleries', value: 'cf62029' },
          { lang: 'Science Museum, Making the Modern World Gallery', value: 'cf119' },
          { lang: 'Science Museum, Information Age Gallery: Web', value: 'cf6748' },
          { lang: 'National Science and Media Museum, Kodak Gallery', value: 'cf174' },
          { lang: 'Science Museum, Information Age Gallery: Cell', value: 'cf6744' }
        ]
      },
      creation: {
        lang: 'Date',
        type: 'date',
        options: ['earliest', 'latest']
      }
    }
  }
};