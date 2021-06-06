import axios from 'axios';

export const API_URL = 'https://raw.githubusercontent.com/Ebazhanov/linkedin-skill-assessments-quizzes/master/html'

// export const getQuestions = () => {
export const downloadQuestions = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/html-quiz.md`)
    return data
  } catch (err) {
    throw (err)
  }

}

const handleMoreThanThreeSections = (sections) => {
  const answerOptions = []
  let optionsCount = -1;
  let correctAnswerIndex = -1
  sections.forEach((sec, i) => {
    let match = sec.match(/- \[(.)\]/g)
    if (match) {
      optionsCount++
      let option = sections[i + 1]
      answerOptions.push(option)
      if (match[0].includes('x')) {
        correctAnswerIndex = optionsCount
      }
    }
  })

  return {
    answerOptions,
    correctAnswerIndex
  }
}
const handleThreeSections = (sections) => {
  let rawOptions = sections[1].split('\n')
  const answerOptions = []
  let correctAnswerIndex = -1
  rawOptions.forEach((option, i) => {
    if (option.length) {
      let optionText = option.replace(/- \[(.)\] /, '')
      answerOptions.push(optionText)
      if (option.includes('[x]')) {
        correctAnswerIndex = i
      }
    }
  })

  return {
    answerOptions,
    correctAnswerIndex
  }
}

export const parseQuestions = (markdown) => {
  const rawQuestions = markdown.match(/####(.*\n)*?(?=\n####)/g)
  const parsedQuestions = rawQuestions.map(q => {
    let sections = q.split(/\n\n/)

    let prompt = sections[0].replace(/(####.*\. )/, '')
    let additionalContent = q.match(/####(.*\n)(*?)()/g);
    let res;
    if (sections[0].includes('Q6.') || sections[0].includes('Q18.')) {
      debugger
    }
    if (sections.length < 3) {
      res = handleThreeSections(sections)
    } else if (sections.length === 3) {
      additionalContent = sections[1];
      res = handleThreeSections(sections.slice(1))
    } else {
      additionalContent = sections[1];
      res = handleMoreThanThreeSections(sections)
    }
    let question = {
      prompt,
      additionalContent,
      ...res,
    }

    return question
  })
  console.log(parsedQuestions)
  return parsedQuestions
}

export const getQuestions = async () => {
  try {
    const data = await downloadQuestions()
    const questions = parseQuestions(data)
    return questions
  } catch (err) {
    debugger;
  }
}

export default {
  getQuestions
}

const sample = {
  prompt: '',
  additionalContent: [{ type: 'img', value: '' }],
  answerOptions: [],
  correctAnswerIndex: 1
}


// Questions with images as additional 
// Answer options with code 
