#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');

// Log to indicate the CLI has started
console.log('CLI has started'); 

// Set up yargs to handle the project name argument
yargs.command({
    command: '*',
    describe: 'Create a new server side project',
    handler: (argv) => {
        const projectName = argv._[0]; // Get the project name from the command arguments
        
        // Determine the target path based on the project name
        let targetPath;
        if (projectName === '*') {
            targetPath = process.cwd(); // Use the current directory
        } else {
            targetPath = path.join(process.cwd(), projectName || 'myBackendApp'); // Default to 'myBackendApp' if no name is provided
        }

        console.log('Target path:', targetPath); // Log the target path for debugging
        
        const templatePath = path.join(__dirname, 'backend-template'); // Path to your template folder

        console.log(`Copying files from ${templatePath} to ${targetPath}`); // Log the paths for debugging

        // Copy template folder to the target directory
        fs.copy(templatePath, targetPath, (err) => {
            if (err) {
                console.error('Error copying files:', err); // Log any errors during copying
            } else {
                console.log('Backend template copied successfully'); // Confirmation message
            }
        });
    }
}).argv; // Execute yargs
