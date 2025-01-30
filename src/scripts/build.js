const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');

// Configure marked for security
marked.setOptions({
    headerIds: false,
    mangle: false
});

async function build() {
    try {
        // Clean and create dist directory
        await fs.emptyDir('dist');
        
        // Copy static assets
        await fs.copy('src/static', 'dist');
        
        // Read base template
        const template = await fs.readFile('src/templates/base.html', 'utf-8');
        
        // Process markdown files
        const contentDir = 'src/content';
        const files = await fs.readdir(contentDir);
        
        for (const file of files) {
            if (file.endsWith('.md')) {
                const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
                const { attributes, body } = frontMatter(content);
                const html = marked.parse(body);
                
                // Replace template placeholders
                const page = template
                    .replace('{{title}}', attributes.title || 'Default Title')
                    .replace('{{content}}', html);
                
                // Generate output path
                const outFile = path.join('dist', file.replace('.md', '.html'));
                await fs.outputFile(outFile, page);
                
                console.log(`Built: ${file} → ${path.relative('dist', outFile)}`);
            }
        }
        
        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build(); 