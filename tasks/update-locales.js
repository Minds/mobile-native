const fs = require('fs');
const path = require('path');

const folderPath = './languages'; // Folder containing the language files
const referenceFileName = 'en.json'; // Reference language file

// Read the reference file
const referenceFilePath = path.join(folderPath, referenceFileName);
const referenceData = JSON.parse(fs.readFileSync(referenceFilePath, 'utf8'));

// Get a list of all files in the folder
const files = fs.readdirSync(folderPath);

// Function to update the language files
const updateLanguageFiles = (referenceData, files) => {
  files.forEach(file => {
    // Skip the reference file
    if (file === referenceFileName) return;

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

  // Add or update properties from the reference file
  for (const key in referenceData) {
    if (referenceData.hasOwnProperty(key)) {
      updatedData[key] = fileData.hasOwnProperty(key)
        ? fileData[key]
        : referenceData[key];
    }
  }

  // Remove properties not in the reference file
  for (const key in fileData) {
    if (fileData.hasOwnProperty(key) && !referenceData.hasOwnProperty(key)) {
      delete fileData[key];
    }
  }

  return updatedData;
};

// Execute the update process
updateLanguageFiles(referenceData, files);
