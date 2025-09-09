import {
    createEmail,
    createPassword,
    createPhone,
    getAddress,
    getUser,
    sendCode,
    validAuth,
    verifyCode,
    updateAddress,
    updateBasicData
} from "./actions";
import { createCompany } from "./actions/createCompany";
import { getListUser } from "./actions/getListUser";
import { getRecoveryOptions } from "./actions/getRecoveryOptions";
import { storeDocument } from "./actions/storeDocument";
import { validPassword } from "./actions/validPassword";

export const routes: Record<string, (event: any, pool: any, user?:any) => Promise<any>> = {
    "GET:/user": getUser,
    "GET:/user/list": getListUser,
    "GET:/user/address": getAddress,
    "GET:/user/valid": validAuth,
    "POST:/user/email": createEmail,
    "POST:/user/company": createCompany,
    "POST:/user/company/documents": storeDocument,
    "POST:/user/phone": createPhone,
    "POST:/user/sendCode": sendCode,
    "POST:/user/verifyCode": verifyCode,
    "POST:/user/password": createPassword,
    "POST:/user/password/valid": validPassword,
    "POST:/user/basicData": updateBasicData,
    "POST:/user/address": updateAddress,

    "POST:/user/recovery/password/options": getRecoveryOptions,

};