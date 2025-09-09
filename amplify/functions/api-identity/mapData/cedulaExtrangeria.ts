export const cedulaExtrangeria = (detectedTexts: (string | undefined)[]): Record<string, string> => {
    const data: Record<string, string> = {};
    console.log('cedulaExtrangeria')

    data.document_type = 'CE';

    // name
    let nameItem = detectedTexts.findIndex((item:any) => item.includes('nombres:'));
    if(nameItem > -1){
        let name = detectedTexts[nameItem]?.split(':')[1]?.trim();
        if(name){
            data.name = name
        }
    }
    if(!data.name){
        let nameWord = ['nombres:','nombres'];
        for (const word of nameWord) {
            nameItem = detectedTexts.indexOf(word);
            if(nameItem > -1) break;
        }
        if(nameItem > -1){
            let name = detectedTexts[nameItem - 1];
            if(name){
                data.name = name
            }
        }
    }

    // lastname
    let lastnameItem = detectedTexts.findIndex((item:any) => item.includes('apellidos:'));
    if(lastnameItem > -1){
        let lastname = detectedTexts[lastnameItem]?.split(':')[1]?.trim();
        if(lastname){
            data.lastname = lastname
        }
    }
    if(!data.lastname){
        lastnameItem = detectedTexts.findIndex((item:any) => item.includes('apellidos'));
        if(lastnameItem > -1){
            let lastname = detectedTexts[lastnameItem + 1];
            if(lastname){
                data.lastname = lastname
            }
        }
    }

    // document
    let documentItem = detectedTexts.indexOf('no.');
    if(documentItem > -1){
        let document = detectedTexts[documentItem + 1]?.trim().replaceAll('.','');
        if(document){
            data.document = document
        }
    }

    // birthDate
    let birthDateItem = detectedTexts.findIndex((item:any) => item.includes('fecha de nacimiento:'));
    if(birthDateItem > -1){
        let birthDate = detectedTexts[birthDateItem + 1]?.split(':')[1]?.trim();
        if(birthDate) data.birthDate = birthDate;
    }

    // nationality
    let nationalityItem = detectedTexts.indexOf('nacionalidad');
    let nationalityItem2 = detectedTexts.indexOf('nacionalidad:');
    if(nationalityItem > -1 || nationalityItem2 > -1){
        let nationality = detectedTexts[(nationalityItem > -1? nationalityItem : nationalityItem2) + 1];
        if(nationality){
            if(nationality?.includes('fecha')){
                nationality = detectedTexts[(nationalityItem > -1? nationalityItem : nationalityItem2) - 1];
                if(nationality)
                    data.nationality = nationality;
            } else {
                data.nationality = nationality;
            }
        }
    }

    return data;
}