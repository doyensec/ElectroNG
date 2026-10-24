export const getNineLines = (text: string, location: string) => {
    // this check is necessary to correctly show the string, otherwise the text could or couldn't be shown depending on the line number.
    if (text === ("File is too large to be displayed"))
        return text;

    const locationNumber = +location;
    const initialLine = Math.max(0, locationNumber-4);
    const endingLine = initialLine+9;

    return text
            .split(/\r\n|\r|\n/)
            .slice(initialLine, endingLine)
            .join('\n');
}

export const getStartingLineNumber = (location: string) => {
    const locationNumber = +location;
    const initialLine = Math.max(0, locationNumber-4);
    return initialLine;
}

export const extToLang = (filepath: string) => {
    const extension = filepath.split('.').pop().toLowerCase();
    const extensionsToLanguages = {
    "html":"htmlbars",
    "md":"markdown",
    "js":"javascript",
    "cjs":"javascript",
    "mjs":"javascript",
    "jsx":"javascript",
    "ts":"typescript",
    "tsx":"typescript",
    "txt":"text",
    "json":"json",
    "json5":"json"
    };
    if (typeof extensionsToLanguages[extension] !== "undefined")
        return extensionsToLanguages[extension];
    else
        return "text";
}