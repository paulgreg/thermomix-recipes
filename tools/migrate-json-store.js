const fs = require('fs')
const path = require('path')

const cleanJSON = (cookBook) => {
    const categories = cookBook.categories.map((category) => ({
        ...category,
        count: undefined,
    }))
    const recipes = cookBook.recipes.map((recipe) => ({
        ...recipe,
        lastDone: undefined,
    }))

    return { categories, recipes, lastSave: cookBook.lastSave }
}

const migrateJsonStore = (filePath) => {
    if (path.extname(filePath) !== '.json') {
        console.error('Please provide a valid JSON file.')
        return
    }

    let fileContent
    try {
        fileContent = fs.readFileSync(filePath, 'utf8')
        console.log('File read successfully.')
    } catch (error) {
        console.error('Error reading file:', error)
        return
    }

    let data
    try {
        data = JSON.parse(fileContent)
        console.log('JSON parsed successfully.')
    } catch (error) {
        console.error('Invalid JSON:', error)
        return
    }

    try {
        const cleanCoookBook = cleanJSON(data)
        fs.writeFileSync(filePath, JSON.stringify(cleanCoookBook))
        console.log('File written back successfully.')
    } catch (error) {
        console.error('Error writing file:', error)
    }
}

const filePath = process.argv[2]
if (!filePath) {
    console.error('Please provide a path to a JSON file.')
    process.exit(1)
}

migrateJsonStore(filePath)
