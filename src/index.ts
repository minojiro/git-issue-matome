import gitlog from 'gitlog'
import dayjs from 'dayjs'
import repos from './repos'


const dayIssues: string[][] = []

const startAt = dayjs().startOf('month')
repos.forEach(repo => {
  console.log(repo)
  gitlog({
    repo,
    number: 100,
    author: "minojiro",
    fields: ['body', 'authorDate'],
  })
    .map(c => {
      const m = c.body.match(/(https\:\/\/github\.com.+\/issues\/\d+)/g)
      const authorDate = dayjs(c.authorDate)
      return {
        authorDate,
        issueUrl: m ? m[0] : '',
      }
    })
    .filter(o => o.authorDate >= startAt && o.issueUrl)
    .forEach(c => {
      const date = c.authorDate.date()
      dayIssues[date] = dayIssues[date] || []
      if (!dayIssues[date].includes(c.issueUrl)) {
        dayIssues[date].push(c.issueUrl)
      }
    })
})

dayIssues.forEach((dayIssuesInADay, date) => {
  console.log(`===\n${startAt.format('YYYY/MM')}/${date}\n${dayIssuesInADay.join("\n")}\n\n`)
})
