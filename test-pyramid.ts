import { promises as fsPromises } from 'fs'

const TEST_FILE_PATTERN = new RegExp('\\.(fonc|integ|unit)\\.(spec|test)\\.ts$')

interface JsonReport {
    testResults: {
        assertionResults: {
            title: string,
        }[]
        name: string,
        startTime: number,
        endTime: number
    }[]
}

async function run() {
    const data_json = await readJsonFile('./test-pyramid-report.json')

    const CI_PROJECT_TITLE = 'Your project Name'
    const CI_PROJECT_TEAM = 'Your Team'
    const NB_TOTAL = data_json.testResults.reduce((acc, testFile) => {
        acc += testFile.assertionResults.length
        return acc
    }, 0)
    const NB_TOTAL_PERCENT = 100
    let NB_TOTAL_FONCTIONNEL = 0
    let NB_TOTAL_FONCTIONNEL_DURATION = 0
    let NB_TOTAL_INTEGRATION = 0
    let NB_TOTAL_INTEGRATION_DURATION = 0
    let NB_TOTAL_UNITAIRE = 0
    let NB_TOTAL_UNITAIRE_DURATION = 0
    let NB_TOTAL_AUTRE = 0
    let NB_TOTAL_AUTRE_DURATION = 0

    let totalDuration = 0
    data_json.testResults.forEach((testFile) => {
        const [, testTypology] = TEST_FILE_PATTERN.exec(testFile.name) || []
        const duration = testFile.endTime - testFile.startTime
        totalDuration += duration

        if (testTypology) {
            switch (testTypology) {
                case 'unit':
                    NB_TOTAL_UNITAIRE += testFile.assertionResults.length
                    NB_TOTAL_UNITAIRE_DURATION += duration
                    break
                case 'integ':
                    NB_TOTAL_INTEGRATION += testFile.assertionResults.length
                    NB_TOTAL_INTEGRATION_DURATION += duration
                    break
                case 'fonc':
                    NB_TOTAL_FONCTIONNEL += testFile.assertionResults.length
                    NB_TOTAL_FONCTIONNEL_DURATION += duration
                    break
                default:
                    NB_TOTAL_AUTRE += testFile.assertionResults.length
                    NB_TOTAL_AUTRE_DURATION += duration
            }
        } else {
            NB_TOTAL_AUTRE += testFile.assertionResults.length
            NB_TOTAL_AUTRE_DURATION += 0
        }

    })

    const NB_TOTAL_FONCTIONNEL_PERCENT = (NB_TOTAL_FONCTIONNEL * 100) / NB_TOTAL
    const NB_TOTAL_INTEGRATION_PERCENT = (NB_TOTAL_INTEGRATION * 100) / NB_TOTAL
    const NB_TOTAL_UNITAIRE_PERCENT = (NB_TOTAL_UNITAIRE * 100) / NB_TOTAL
    const NB_TOTAL_AUTRE_PERCENT = (NB_TOTAL_AUTRE * 100) / NB_TOTAL
    const NB_TOTAL_DURATION = totalDuration
    const TOTAL_INSTUMENTATION_DURATION =
        NB_TOTAL_DURATION -
        (NB_TOTAL_FONCTIONNEL_DURATION +
            NB_TOTAL_INTEGRATION_DURATION +
            NB_TOTAL_UNITAIRE_DURATION +
            NB_TOTAL_AUTRE_DURATION)

    await replaceInFile('./test-pyramid.template', './test-pyramid.html', [
        { toBeReplaced: '@CI_PROJECT_TITLE@', by: CI_PROJECT_TITLE },
        { toBeReplaced: '@CI_PROJECT_TEAM@', by: CI_PROJECT_TEAM },
        { toBeReplaced: '@TOTAL@', by: NB_TOTAL },
        { toBeReplaced: '@TOTAL_DURATION@', by: NB_TOTAL_DURATION },
        { toBeReplaced: '@TOTAL_PERCENT@', by: NB_TOTAL_PERCENT.toFixed(2) },
        { toBeReplaced: '@TOTAL_FONC@', by: NB_TOTAL_FONCTIONNEL },
        //{ toBeReplaced: '@TOTAL_FONC_DURATION@', by: (NB_TOTAL_FONCTIONNEL_DURATION / 1000).toFixed(1) },
        { toBeReplaced: '@TOTAL_FONC_DURATION@', by: NB_TOTAL_FONCTIONNEL_DURATION },
        { toBeReplaced: '@TOTAL_FONC_PERCENT@', by: NB_TOTAL_FONCTIONNEL_PERCENT.toFixed(2) },
        { toBeReplaced: '@TOTAL_INTEG@', by: NB_TOTAL_INTEGRATION },
        { toBeReplaced: '@TOTAL_INTEG_DURATION@', by: NB_TOTAL_INTEGRATION_DURATION },
        { toBeReplaced: '@TOTAL_INTEG_PERCENT@', by: NB_TOTAL_INTEGRATION_PERCENT.toFixed(2) },
        { toBeReplaced: '@TOTAL_UNIT@', by: NB_TOTAL_UNITAIRE },
        { toBeReplaced: '@TOTAL_UNIT_DURATION@', by: NB_TOTAL_UNITAIRE_DURATION },
        { toBeReplaced: '@TOTAL_UNIT_PERCENT@', by: NB_TOTAL_UNITAIRE_PERCENT.toFixed(2) },
        { toBeReplaced: '@TOTAL_AUTRE@', by: NB_TOTAL_AUTRE },
        { toBeReplaced: '@TOTAL_AUTRE_DURATION@', by: NB_TOTAL_AUTRE_DURATION },
        { toBeReplaced: '@TOTAL_AUTRE_PERCENT@', by: NB_TOTAL_AUTRE_PERCENT.toFixed(2) },
        { toBeReplaced: '@TOTAL_INSTUMENTATION_DURATION@', by: (TOTAL_INSTUMENTATION_DURATION / 1000).toFixed(1) }
    ])
}

async function readJsonFile(file: string): Promise<JsonReport> {
    try {
        return await import(file)
    } catch (error: any) {
        throw new Error('Error : You must run yarn test:ci before running yarn test:pyramid')
    }
}

async function replaceInFile(
    filenameFrom: string,
    filenameTo: string,
    replacements: { toBeReplaced: string; by: string | number }[]
) {
    try {
        let contents = await fsPromises.readFile(filenameFrom, 'utf-8')
        replacements.forEach((replacement) => {
            contents = contents.replace(new RegExp(replacement.toBeReplaced, 'gi'), replacement.by.toString())
        })
        await fsPromises.writeFile(filenameTo, contents)
    } catch (err) {
        console.log(err)
    }
}

(async () => {
    await run()
})()
