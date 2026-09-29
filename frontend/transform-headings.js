import fs from 'fs';
import { glob } from 'glob';

function strictFix(html) {
  // 1. Repair broken HTML attributes
  let fixed = html
    .replace(/Style=/g, 'style=')
    .replace(/#38b2ac/g, '#38B2AC');

  // 2. Standardize country casing and acronyms back to their clean forms
  fixed = fixed
    .replace(/>uae</gi, '>the UAE<')
    .replace(/>the UAE</gi, '>the UAE<')
    .replace(/\buae\b/gi, 'the UAE')
    .replace(/\bthe the UAE\b/gi, 'the UAE')
    .replace(/\bmofa\b/gi, 'MOFA')
    .replace(/\busa\b/gi, 'USA')
    .replace(/\bUsa\b/g, 'USA')
    .replace(/\boman\b/gi, 'Oman')
    .replace(/\bsaudi\b/gi, 'Saudi')
    .replace(/\bqatar\b/gi, 'Qatar')
    .replace(/\bkuwait\b/gi, 'Kuwait')
    .replace(/\bgermany\b/gi, 'Germany')
    .replace(/\bphilippines\b/gi, 'Philippines')
    .replace(/\bindia\b/gi, 'India')
    .replace(/\bdubai\b/gi, 'Dubai')
    .replace(/\babu dhabi\b/gi, 'Abu Dhabi')
    .replace(/\bAbu dhabi\b/g, 'Abu Dhabi');

  // 3. REMOVE the injected "Services" words to restore your original phrasing
  // This cleans up "Certificate Attestation Services" back to "Certificate Attestation"
  fixed = fixed
    .replace(/Certificate Certificate/gi, 'Certificate')
    .replace(/Attestation Services/g, 'Attestation')
    .replace(/Attestation services/g, 'Attestation')
    .replace(/Services Services/gi, '');

  // 4. Fix grammar rules for minor words
  fixed = fixed
    .replace(/\bin the UAE\b/gi, 'in the UAE')
    .replace(/\bfrom the UAE\b/gi, 'from the UAE')
    .replace(/\bFrom the UAE\b/gi, 'from the UAE')
    .replace(/\bFrom UAE\b/gi, 'from the UAE')
    .replace(/\bin India\b/gi, 'in India')
    .replace(/\bin Dubai\b/gi, 'in Dubai')
    .replace(/\bin Abu Dhabi\b/gi, 'in Abu Dhabi')
    .replace(/\btrusted No.1\b/g, 'Trusted No.1');

  // 5. Clean up structural double-spaces left behind by removals
  fixed = fixed.replace(/\s+/g, ' ').trim();

  return fixed;
}

async function run() {
  const files = await glob('src/pages/**/*.astro');

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    const updatedContent = content.replace(/(<h1[^>]*>)([\s\S]*?)(<\/h1>)/gi, (match, openTag, headingText, closeTag) => {
      const transformedText = strictFix(headingText);
      
      if (headingText.trim() !== transformedText) {
        console.log(`Restoring original words in: ${file}`);
        console.log(`   Before: ${headingText.trim().replace(/\n/g, ' ')}`);
        console.log(`   After:  ${transformedText}`);
        hasChanges = true;
        return `${openTag}${transformedText}${closeTag}`;
      }
      return match;
    });

    if (hasChanges) {
      fs.writeFileSync(file, updatedContent, 'utf8');
    }
  });

  console.log('🎉 Wording successfully restored back to original text with updated Title Case styling!');
}

run();
