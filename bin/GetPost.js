// Runtime: Browser

let posts = [...document.querySelectorAll('.sc-dkPtRN.kFnucu')].map(x => ({
    href : x.querySelector('.sc-1di2uql-1.bfpLye a').href, 
    title: x.querySelector('.sc-1di2uql-1.bfpLye a').textContent
}))

console.log(JSON.stringify(posts))