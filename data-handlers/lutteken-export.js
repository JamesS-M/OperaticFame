const step = 1000
const {
  extract_review,
  extract_ideal_opera,
  extract_name,
  name_reorder,
  extract_theatre,
  normalize_journal,
  normalize_name
} = require('../functions/functions.js')

module.exports = function handleLutteken(data, nameMap, journalInfo, keywords, iteration) {
  data = data.slice((iteration * step), ((iteration + 1) * step))
  console.log(`${data.length} lutteken rows to process...`)
  return data.map(({
    ReviewTitle: review,
    JournalShortTitle: journal,
    EntryDetails: publication1,
    Continuation: publication2,
    Year: year,
    Translated: translated,
    IdealOpera: idealOpera,
    Person: person,
    Critic: critic,
    Composer: composer,
    Place: place,
    Theatre: theatre
  }) => {

    // data massaging
    review = extract_review(review)
    idealOpera = extract_ideal_opera(idealOpera)
    person = normalize_name(name_reorder(extract_name(person)), nameMap)
    theatre = extract_theatre(theatre)
    journal = normalize_journal(journal, journalInfo)
    place = extract_name(place).join(', ')

    // assemble query
    let nodeQuery = [
      makeJournal(journal),
      makeReview(review, publication1, publication2, journal, translated, year),
      makePerson(person),
      makeIdealOpera(idealOpera),
      makePlace(place, theatre),
      makeCritic(critic),
      makeComposer(composer)
    ]
    let relationshipQuery = [
    ]
    let query = ` ${nodeQuery.join(' ')} ${relationshipQuery.join(' ')}`

    return query
  })
}

    return str += ` ${nodeQuery.join(' ')} ${relationshipQuery.join(' ')}`
  }, '')
}

const makePlace = (place, theatre) => {
  if (!place) return ``
  return `MERGE (place:Place {${
    [
      place ? `City: "${place}"` : false,
      theatre ? `Theatre: "${theatre}"` : false
    ].filter(Boolean).join(', ')
    }})`
}

const makeReview = (review, publication1, publication2, journal, translated, year, critic) => {
  if (!review) return ``
  return `MERGE (review:Review {${
    [
      review ? `Review: "${review}"` : false,
      (publication1 || publication2) ? `Continuation: "${publication1 || ''} ${publication1 ? ', ' : ''}${publication2 || ''}"` : false,
      journal ? `Journal: "${typeof (journal) === 'string' ? journal : journal.Journal}"` : false,
      year ? `Year: date({year:${year}})` : false,
      translated ? `Translated: "${translated}"` : false,
      critic ? `Critic: "${critic}"` : false
    ].filter(Boolean).join(', ')}})`
}

const makeCritic = (critic) => {
  if (!critic) return ``
  return `MERGE (critic:Critic {Name: "${critic}"})`
}

const makeComposer = (composer) => {
  if (!composer) return ``
  return `MERGE (composer:Composer {Name: "${composer}"})`
}

const makePerson = (person) => {
  if (!person) return ``
  return `MERGE (person:Person {Name: "${person}"})`
}

const makeJournal = (journal) => {
  if (!journal) return ``
  let query = `MERGE (journal:Journal {Title:"`
  if (typeof (journal) === 'string') {
    return query += `${journal}"})`
  }
  let { Journal, Publisher, Editor, Dates } = journal

  return query += `${Journal}", Publisher:"${Publisher}", Editor:"${Editor}", Dates:"${Dates}"})`
}

const makeIdealOpera = (idealOpera, composer) => {
  if (!idealOpera) return ``
  return `MERGE (idealOpera:Ideal_Opera {${
    [
      idealOpera ? `Title:"${idealOpera}"` : false,
      composer ? `Composer:${composer}` : false
    ].filter(Boolean).join(', ')
    }})`
}