export function fileParse(file, type = 'base64') {
    return new Promise(resolve => {
        const fileReader = new FileReader
        if (type === "base64") {
            fileReader.readAsDataURL(file);
        } else if (type === "buffer") {
            fileReader.readAsArrayBuffer(file);
        }
        fileReader.onload = (ev) => resolve(ev.target?.result);
    })
}