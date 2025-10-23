export const cedulaAntigua = (detectedTexts: (string | undefined)[]): Record<string, string> => {
    const data: Record<string, string> = {};
    console.log('cedulaAntigua')

    data.document_type = 'CC';

    // name
    let nameItem = detectedTexts.indexOf('apellidos');
    if(nameItem > -1){
        let name = detectedTexts[nameItem + 1];
        if(name) data.name = name;
    }

    // lastname
    let lastnameItem:any;
    let wordsLastname = ['apellidos','apelidos','apeldos','apelldos'];
    for (const word of wordsLastname) {
        lastnameItem = detectedTexts.indexOf(word);
        if(lastnameItem > -1) break;
    }
    if(lastnameItem > -1){
        let lastname = detectedTexts[nameItem - 1];
        if(lastname) data.lastname = lastname;
    }

    // document
    let documentItem = detectedTexts.indexOf('numero');
    if(documentItem == -1){
        documentItem = detectedTexts.indexOf('número');
    }
    if(documentItem > -1) {
        let document = detectedTexts[documentItem - 1]?.replaceAll('.','');
        if(document && !isNaN(parseInt(document || 'null'))) data.document = document;
    
        document = detectedTexts[documentItem + 1]?.replaceAll('.','');
        if(document && !isNaN(parseInt(document || 'null'))) data.document = document;
    }

    // birthDate
    let birthDateItem = detectedTexts.indexOf('fecha de nacimiento');
    if(birthDateItem > -1){
        let birthDate = detectedTexts[birthDateItem + 1];
        if(!(birthDate || '').includes('-')){
            birthDate = detectedTexts[birthDateItem - 1];
        }
        if(birthDate) data.birthDate = birthDate;
    }

    let sexoItem = detectedTexts.indexOf('sexo');
    if(sexoItem > -1){
        let sexo = sexoItem - 3;
        if(detectedTexts[sexo] == 'm'){
            data.nationality = 'Colombiano';
        }
        if(detectedTexts[sexo] == 'f'){
            data.nationality = 'Colombiana';
        }
    }

    return data;
}