export const cedulaNueva = (detectedTexts: (string | undefined)[]): Record<string, string> => {
    const data: Record<string, string> = {};
    console.log('cedulaNueva')

    data.document_type = 'CC';

    // name
    let nameItem = detectedTexts.indexOf('nombres');
    if(nameItem > -1){
        let name = nameItem + 1;
        if(detectedTexts[name]) data.name = detectedTexts[name];
    }

    // lastname
    let lastnameItem:any;
    let wordsLastname = ['apellidos','apelidos','apeldos','apelldos'];
    for (const word of wordsLastname) {
        lastnameItem = detectedTexts.indexOf(word);
        if(lastnameItem > -1) break;
    }
    if(lastnameItem > -1){
        let lastname = lastnameItem + 1;
        if(detectedTexts[lastname]) data.lastname = detectedTexts[lastname];
    }

    // document
    let documentItem = detectedTexts.indexOf('nuip');
    if(documentItem > -1){
        let number = detectedTexts[documentItem + 1]?.replaceAll('.','');
        if(number) data.document = number;
    }

    // birthDate
    let birthDateItem = detectedTexts.indexOf('fecha de nacimiento');
    if(birthDateItem > -1){
        let birthDate = birthDateItem + 2;
        if(`${birthDate}`.length <= 2)
            birthDate = birthDateItem + 3;
        data.birthDate = `${detectedTexts[birthDate]}`;
    }

    // birthDate
    let nationalityItem = detectedTexts.indexOf('nacionalidad');
    if(nationalityItem > -1){
        let nationality = nationalityItem + 5;
        if(detectedTexts[nationality]) data.nationality = detectedTexts[nationality];
    }

    return data;
    
}