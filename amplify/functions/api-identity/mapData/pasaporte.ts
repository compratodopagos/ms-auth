export const pasaporte = (detectedTexts: (string | undefined)[]): Record<string, string> => {
    const data: Record<string, string> = {};

    data.document_type = 'PP';

    // name
    let nationalityItem = detectedTexts.indexOf('nacionalidad / nationality');
    if(nationalityItem > -1){
        let name = detectedTexts[nationalityItem - 1];
        if(name) data.name = name;
    }

    // lastname
    let lastnameItem:any;
    let lastnameWords = ['apellidos / surname','apellidos/surname','apelidos / surname','apelidos/surname'];
    for (const word of lastnameWords) {
        lastnameItem = detectedTexts.indexOf(word);
        if(lastnameItem > -1) break;
    }
    if(lastnameItem > -1){
        let lastname = detectedTexts[lastnameItem + 2];
        if(lastname) data.lastname = lastname;
    }

    // document
    let documentItem = detectedTexts.findIndex((item:any) => item.includes('passport no'));
    if(documentItem > -1){
        let number = detectedTexts[documentItem + 3]?.trim().replaceAll('.','');
        if(number) data.document = number;
    }

    // birthDate
    let birthDateItem = detectedTexts.indexOf('fecha de nacimiento');
    let birthDateWords = ['fecha de nacimiento','fecha de nacimiento / date of birth','fecha de nacimiento/date of birth'];
    for (const word of birthDateWords) {
        birthDateItem = detectedTexts.indexOf(word);
        if(birthDateItem > -1) break;
    }
    if(birthDateItem > -1){
        let birthDate = birthDateItem + 2;
        if(detectedTexts[birthDate]) data.birthDate = detectedTexts[birthDate];
    }

    // nationality
    if(nationalityItem > -1){
        let nationality = detectedTexts[nationalityItem + 1];
        if(nationality == data.name){
            nationality = detectedTexts[nationalityItem - 1];
        }
        if(nationality) data.nationality = nationality;
    }

    return data;
}