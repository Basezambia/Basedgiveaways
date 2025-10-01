const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Source image path
const sourceImage = path.join(__dirname, 'public', 'ChatGPT Image Sep 28, 2025, 01_00_20 PM.png');

// Output directory
const outputDir = path.join(__dirname, 'public', 'app-images');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Image configurations
const imageConfigs = [
  {
    width: 1200,
    height: 630,
    filename: 'app-image-1200x630.png',
    description: 'Social media / Open Graph image'
  },
  {
    width: 1024,
    height: 1024,
    filename: 'app-image-1024x1024.png',
    description: 'Square app icon'
  },
  {
    width: 1284,
    height: 2778,
    filename: 'app-image-1284x2778.png',
    description: 'Mobile app screenshot'
  },
  {
    width: 200,
    height: 200,
    filename: 'app-image-200x200.png',
    description: 'Small app icon (transparent)',
    transparent: true
  },
  {
    width: 84,
    height: 84,
    filename: 'app-image-84x84.png',
    description: 'Tiny app icon'
  }
];

async function convertImages() {
  try {
    console.log('Starting image conversion...');
    console.log(`Source image: ${sourceImage}`);
    
    // Check if source image exists
    if (!fs.existsSync(sourceImage)) {
      throw new Error(`Source image not found: ${sourceImage}`);
    }

    for (const config of imageConfigs) {
      const outputPath = path.join(outputDir, config.filename);
      
      console.log(`\nProcessing: ${config.description}`);
      console.log(`Size: ${config.width}x${config.height}`);
      console.log(`Output: ${outputPath}`);

      let sharpInstance = sharp(sourceImage);

      // Handle transparent background for the 200x200 image
      if (config.transparent) {
        sharpInstance = sharpInstance
          .resize(config.width, config.height, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
          })
          .png({ quality: 100 });
      } else {
        sharpInstance = sharpInstance
          .resize(config.width, config.height, {
            fit: 'cover',
            position: 'center'
          })
          .png({ quality: 90 });
      }

      await sharpInstance.toFile(outputPath);
      
      console.log(`✅ Successfully created: ${config.filename}`);
    }

    console.log('\n🎉 All images converted successfully!');
    console.log(`Output directory: ${outputDir}`);
    
    // List all created files
    console.log('\nCreated files:');
    const files = fs.readdirSync(outputDir);
    files.forEach(file => {
      const filePath = path.join(outputDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`  - ${file} (${sizeKB} KB)`);
    });

  } catch (error) {
    console.error('❌ Error during image conversion:', error.message);
    process.exit(1);
  }
}

// Run the conversion
convertImages();