const fs = require('fs');
const path = require('path');

const folderPath = './locales'; // Folder containing the language files
const referenceFileName = 'en.json'; // Reference language file

const args = process.argv.slice(2);

const replaceMinds = args[0] === '--replaceMinds';

// Read the reference file
const referenceFilePath = path.join(folderPath, referenceFileName);
const referenceData = JSON.parse(fs.readFileSync(referenceFilePath, 'utf8'));

// Get a list of all files in the folder
const files = fs.readdirSync(folderPath);

// Function to update the language files
const updateLanguageFiles = (referenceData, files) => {
  files.forEach(file => {
    // Skip the reference file
    if (file === referenceFileName || !file.endsWith('.json')) return;

    console.log(`Updating file: ${file}`);

    const filePath = path.join(folderPath, file);
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update the fileData to match referenceData
    const updatedData = updateFileData(referenceData, fileData);

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
    console.log(`Updated file: ${file}`);
  });
};

// Function to update the target file data to match the reference data
const updateFileData = (referenceData, fileData) => {
  const updatedData = {};

  for (const key in referenceData) {
    if (typeof referenceData[key] === 'object' && referenceData[key] !== null) {
      updatedData[key] = updateFileData(
        referenceData[key],
        fileData.hasOwnProperty(key) ? fileData[key] : {},
      );
      // cleanup empty objects
      if (Object.keys(updatedData[key]).length === 0) {
        delete updatedData[key];
      }
    } else if (fileData.hasOwnProperty(key)) {
      updatedData[key] = fileData[key];
      // remove keys that are the same as the reference
      if (updatedData[key] === referenceData[key]) {
        delete updatedData[key];
      }
      // if the reference contains {{TENANT}} replace the 'Minds' word on the updatedData with it
      if (replaceMinds && referenceData[key].includes('{{TENANT}}')) {
        updatedData[key] = updatedData[key].replace('Minds', '{{TENANT}}');
      }
    }
  }

  return updatedData;
};

// Execute the update process
updateLanguageFiles(referenceData, files);
