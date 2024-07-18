function extractPhoneNumber(text) {
    const phoneRegex = /\+[\d\s()-]+/;
  
    const match = text.match(phoneRegex);
  
    if (match) {
      return match[0].replace(/[^\d+]/g, '');
    } else {
      return null;
    }
}

function createMessage(template, variables) {
    console.log(template);
    return template.replace(/\$([A-Z_]+)/g, (match, variable) => {
      return variables[variable] || match;
    });
}

module.exports = { extractPhoneNumber, createMessage};
